import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  trimMessages,
  SystemMessage,
} from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { ChatDeepSeek } from '@langchain/deepseek';
// import { ChatAnthropic } from "@langchain/anthropic";
import {
  END,
  START,
  StateGraph,
  MessagesAnnotation,
} from "@langchain/langgraph";
import wxflows from "@wxflows/sdk/langchain";
import { MemorySaver } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { EventEmitter } from 'events';
import { POPULAR_MODELS } from "./models";
import SYSTEM_MESSAGE from "@/constants/systemMessage";

// Increase the maximum number of listeners
EventEmitter.defaultMaxListeners = 20;

// Trim the messages to manage conversation history
const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

// Connect to wxflows
const toolClient = new wxflows({
  endpoint: process.env.WXFLOWS_ENDPOINT || "",
  apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve the tools
const tools = await toolClient.lcTools;
const toolNode = new ToolNode(tools);

// Initialize model with OpenRouter/DeepSeek
const initialiseModel = (modelId: string) => {
  try {
    const model = new ChatOpenAI({
      modelName: modelId,
      temperature: 0.7,
      maxTokens: 4096,
      streaming: true,
      apiKey: process.env.OPENROUTER_API_KEY,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://localhost:3000",
          "X-Title": "Studia.ai",
        },
      },
      callbacks: [{
        handleLLMStart: async () => {
          console.log("🤖 Starting OpenRouter call for model:", modelId);
        },
        handleLLMError: async (error) => {
          console.error("🔥 OpenRouter error:", error);
        },
        handleLLMEnd: async (output) => {
          console.log("🤖 End OpenRouter call", output);
        }
      }]
    }).bindTools(tools);

    return model;
  } catch (error) {
    console.error("Failed to initialize OpenRouter model:", error);
    throw error;
  }
};

// Define the function that determines whether to continue or not
function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }

  // If the last message is a tool message, route back to agent
  if (lastMessage.content && lastMessage._getType() === "tool") {
    return "agent";
  }

  // Otherwise, we stop (reply to the user)
  return END;
}

// Define a new graph
const createWorkflow = (modelId: string) => {
  const model = initialiseModel(modelId);
  
  // Get model name from ID
  const modelName = POPULAR_MODELS.find(m => m.id === modelId)?.name || modelId;


  return new StateGraph(MessagesAnnotation)
    .addNode("agent", async (state) => {
      // Create the system message content
      const systemContent = SYSTEM_MESSAGE;

      // Create the prompt template with system message and messages placeholder
      const promptTemplate = ChatPromptTemplate.fromMessages([
        new SystemMessage(systemContent, {
          cache_control: { type: "ephemeral" },
        }),
        new MessagesPlaceholder("messages"),
      ]);

      // Trim the messages to manage conversation history
      const trimmedMessages = await trimmer.invoke(state.messages);

      // Format the prompt with the current messages
      const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

      // Get response from the model
      const response = await model.invoke(prompt);

      // Add model info to response
      const modelInfo = `\n\n_Model used: ${modelName}_`;
      response.content = response.content + modelInfo;

      return { messages: [response] };
    })
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");
};

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
  if (!messages.length) return messages;

  // Create a copy of messages to avoid mutating the original
  const cachedMessages = [...messages];

  // Helper to add cache control
  const addCache = (message: BaseMessage) => {
    message.content = [
      {
        type: "text",
        text: message.content as string,
        cache_control: { type: "ephemeral" },
      },
    ];
  };

  // Cache the last message
  // console.log("🤑🤑🤑 Caching last message");
  addCache(cachedMessages.at(-1)!);

  // Find and cache the second-to-last human message
  let humanCount = 0;
  for (let i = cachedMessages.length - 1; i >= 0; i--) {
    if (cachedMessages[i] instanceof HumanMessage) {
      humanCount++;
      if (humanCount === 2) {
        // console.log("🤑🤑🤑 Caching second-to-last human message");
        addCache(cachedMessages[i]);
        break;
      }
    }
  }

  return cachedMessages;
}

export async function submitQuestion(
  messages: BaseMessage[], 
  chatId: string,
  modelId: string
) {
  const cachedMessages = addCachingHeaders(messages);
  const workflow = createWorkflow(modelId);

  // Create a checkpoint to save the state of the conversation
  const checkpointer = new MemorySaver();
  const app = workflow.compile({ checkpointer });

  const stream = await app.streamEvents(
    { messages: cachedMessages },
    {
      version: "v2",
      configurable: { thread_id: chatId },
      streamMode: "messages",
      runId: chatId,
    }
  );
  return stream;
}
