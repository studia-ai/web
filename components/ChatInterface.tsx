"use client";

import { useEffect, useRef, useState } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { ChatRequestBody, StreamMessageType, OpenRouterModel } from "@/lib/types";
import WelcomeMessage from "@/components/WelcomeMessage";
import { createSSEParser } from "@/lib/SSEParser";
import { MessageBubble } from "@/components/MessageBubble";
import { ArrowRight } from "lucide-react";
import { getConvexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { POPULAR_MODELS } from "@/lib/models";

interface ChatInterfaceProps {
  chatId: Id<"chats">;
  initialMessages: Doc<"messages">[];
}

const groupBy = <T extends Record<string, any>>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const value = item[key];
    groups[value] = [...(groups[value] || []), item];
    return groups;
  }, {} as Record<string, T[]>);
};

export default function ChatInterface({
  chatId,
  initialMessages,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Doc<"messages">[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const [currentTool, setCurrentTool] = useState<{
    name: string;
    input: unknown;
  } | null>(null);
  const [selectedModel, setSelectedModel] = useState(POPULAR_MODELS[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedResponse]);

  const formatToolOutput = (output: unknown): string => {
    if (typeof output === "string") return output;
    return JSON.stringify(output, null, 2);
  };

  const formatTerminalOutput = (
    tool: string,
    input: unknown,
    output: unknown
  ) => {
    const terminalHtml = `<div class="bg-[#1e1e1e] text-white font-mono p-2 rounded-md my-2 overflow-x-auto whitespace-normal max-w-[600px]">
      <div class="flex items-center gap-1.5 border-b border-gray-700 pb-1">
        <span class="text-red-500">●</span>
        <span class="text-yellow-500">●</span>
        <span class="text-green-500">●</span>
        <span class="text-gray-400 ml-1 text-sm">~/${tool}</span>
      </div>
      <div class="text-gray-400 mt-1">$ Input</div>
      <pre class="text-yellow-400 mt-0.5 whitespace-pre-wrap overflow-x-auto">${formatToolOutput(input)}</pre>
      <div class="text-gray-400 mt-2">$ Output</div>
      <pre class="text-green-400 mt-0.5 whitespace-pre-wrap overflow-x-auto">${formatToolOutput(output)}</pre>
    </div>`;

    return `---START---\n${terminalHtml}\n---END---`;
  };

  /**
   * Processes a ReadableStream from the SSE response.
   * This function continuously reads chunks of data from the stream until it's done.
   * Each chunk is decoded from Uint8Array to string and passed to the callback.
   */
  const processStream = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onChunk: (chunk: string) => Promise<void>
  ) => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await onChunk(new TextDecoder().decode(value));
      }
    } finally {
      reader.releaseLock();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    // Reset UI state for new message
    setInput("");
    setStreamedResponse("");
    setCurrentTool(null);
    setIsLoading(true);

    // Add user's message immediately for better UX
    const optimisticUserMessage: Doc<"messages"> = {
      _id: `temp_${Date.now()}`,
      chatId,
      content: trimmedInput,
      role: "user",
      createdAt: Date.now(),
    } as Doc<"messages">;

    setMessages((prev) => [...prev, optimisticUserMessage]);

    // Track complete response for saving to database
    let fullResponse = "";

    try {
      // Prepare chat history and new message for API
      const requestBody: ChatRequestBody = {
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        newMessage: trimmedInput,
        chatId,
        modelId: selectedModel,
      };

      // Initialize SSE connection
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(await response.text());
      if (!response.body) throw new Error("No response body available");

      // Create SSE parser and stream reader
      const parser = createSSEParser();
      const reader = response.body.getReader();

      // Process the stream chunks
      await processStream(reader, async (chunk) => {
        // Parse SSE messages from the chunk
        const messages = parser.parse(chunk);

        // Handle each message based on its type
        for (const message of messages) {
          switch (message.type) {
            case StreamMessageType.Token:
              // Handle streaming tokens (normal text response)
              if ("token" in message) {
                fullResponse += message.token;
                setStreamedResponse(fullResponse);
              }
              break;

            case StreamMessageType.ToolStart:
              // Handle start of tool execution (e.g. API calls, file operations)
              if ("tool" in message) {
                setCurrentTool({
                  name: message.tool,
                  input: message.input,
                });
                fullResponse += formatTerminalOutput(
                  message.tool,
                  message.input,
                  "Processing..."
                );
                setStreamedResponse(fullResponse);
              }
              break;

            case StreamMessageType.ToolEnd:
              // Handle completion of tool execution
              if ("tool" in message && currentTool) {
                // Replace the "Processing..." message with actual output
                const lastTerminalIndex = fullResponse.lastIndexOf(
                  '<div class="bg-[#1e1e1e]'
                );
                if (lastTerminalIndex !== -1) {
                  fullResponse =
                    fullResponse.substring(0, lastTerminalIndex) +
                    formatTerminalOutput(
                      message.tool,
                      currentTool.input,
                      message.output
                    );
                  setStreamedResponse(fullResponse);
                }
                setCurrentTool(null);
              }
              break;

            case StreamMessageType.Error:
              // Handle error messages from the stream
              if ("error" in message) {
                throw new Error(message.error);
              }
              break;

            case StreamMessageType.Done:
              // Handle completion of the entire response
              const assistantMessage: Doc<"messages"> = {
                _id: `temp_assistant_${Date.now()}`,
                chatId,
                content: fullResponse,
                role: "assistant",
                createdAt: Date.now(),
              } as Doc<"messages">;

              // Save the complete message to the database
              const convex = getConvexClient();
              await convex.mutation(api.messages.store, {
                chatId,
                content: fullResponse,
                role: "assistant",
              });

              setMessages((prev) => [...prev, assistantMessage]);
              setStreamedResponse("");
              return;
          }
        }
      });
    } catch (error) {
      // Enhanced error handling
      console.error("Error sending message:", error);

      // Check if error is an instance of TypeError and log more details
      if (error instanceof TypeError) {
        console.error("TypeError details:", error.message);
      }

      // Remove the optimistic user message if there was an error
      setMessages((prev) =>
        prev.filter((msg) => msg._id !== optimisticUserMessage._id)
      );
      setStreamedResponse(
        formatTerminalOutput(
          "error",
          "Failed to process message",
          error instanceof Error ? error.message : "Unknown error"
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    // You might want to notify the user that changing models will start a new conversation
    setStreamedResponse("");
    setCurrentTool(null);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Messages container */}
      <section className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto p-3 md:p-8 space-y-4 md:space-y-6">
          {messages?.length === 0 && <WelcomeMessage />}

          {messages?.map((message: Doc<"messages">) => (
            <MessageBubble
              key={message._id}
              content={message.content}
              isUser={message.role === "user"}
            />
          ))}

          {streamedResponse && <MessageBubble content={streamedResponse} />}

          {/* Loading indicator */}
          {isLoading && !streamedResponse && (
            <div className="flex justify-start animate-in fade-in-0">
              <div className="rounded-2xl px-6 py-4 bg-white text-gray-900 rounded-bl-none shadow-md ring-1 ring-gray-200">
                <div className="flex items-center gap-2">
                  {[0.3, 0.15, 0].map((delay, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-purple-400 animate-bounce"
                      style={{ animationDelay: `-${delay}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Quick Suggestions */}
      <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm px-2 sm:px-3 pt-2 sm:pt-3">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            {[
              {
                title: "Research",
                query: "Research quantum computing developments",
                icon: "🔍",
              },
              {
                title: "Code Review",
                query: "Review smart contract security",
                icon: "👨‍💻",
              },
              {
                title: "Analysis",
                query: "Analyze DeFi market trends",
                icon: "📊",
              },
              {
                title: "Explain",
                query: "Explain zero-knowledge proofs",
                icon: "💡",
              },
            ].map((suggestion) => (
              <button
                key={suggestion.title}
                onClick={() => setInput(suggestion.query)}
                className="bg-white/80 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-gray-200/50 
                          hover:border-purple-200/50 hover:shadow-md transition-all duration-200 
                          text-left group w-full"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200">
                    {suggestion.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm">{suggestion.title}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500 truncate">{suggestion.query}</p>
                  </div>
                </div>
                <div className="mt-1 w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 
                              transform scale-x-0 group-hover:scale-x-100 transition-transform 
                              duration-200 origin-left"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Model Selector */}
      <div className="border-t border-gray-200/50 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-2">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Model:</span>
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[200px] bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(groupBy(POPULAR_MODELS, 'category')).map(([category, models]) => (
                <div key={category}>
                  <div className="px-2 py-1.5 text-sm font-semibold text-gray-500">
                    {category}
                  </div>
                  {models.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="py-2 px-4 text-sm cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{model.name}</span>
                        {model.description && (
                          <span className="text-xs text-gray-500">{model.description}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Input form */}
      <footer className="border-t bg-white/80 backdrop-blur-sm p-2 sm:p-3 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message AI Agent..."
              className="flex-1 py-2.5 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 
                        rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-purple-500 
                        focus:border-transparent pr-12 sm:pr-16 bg-white/50 
                        placeholder:text-gray-500 text-sm sm:text-base"
              disabled={isLoading}
            />
            <div className="absolute right-1.5 sm:right-2">
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`rounded-lg h-9 w-10 sm:h-10 sm:w-12 md:h-11 md:w-16 transition-all ${
                  input.trim()
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </form>
      </footer>
    </main>
  );
}
