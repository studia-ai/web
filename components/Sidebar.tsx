"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import TimeAgo from "react-timeago";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { useNavigation } from "@/lib/context/navigation";
import { MessageSquare } from "lucide-react";
import { toast } from 'react-toastify';

function ChatRow({
  chat,
  onDelete,
}: {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
}) {
  const router = useRouter();
  const { closeMobileNav } = useNavigation();
  const lastMessage = useQuery(api.messages.getLastMessage, {
    chatId: chat._id,
  });

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  return (
    <div
      className="group rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md hover:border-purple-100"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-2 rounded-lg">
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 font-medium truncate">
                {lastMessage ? (
                  <>
                    {lastMessage.role === "user" ? "You: " : "AI: "}
                    {lastMessage.content.replace(/\\n/g, "\n")}
                  </>
                ) : (
                  <span className="text-gray-500">New conversation</span>
                )}
              </p>
              {lastMessage && (
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  <TimeAgo date={lastMessage.createdAt} />
                </p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 -mt-2 ml-2 text-gray-500 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(chat._id);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const router = useRouter();
  const { isMobileNavOpen, closeMobileNav } = useNavigation();

  const chats = useQuery(api.chats.listChats);
  const createChat = useMutation(api.chats.createChat);
  const deleteChat = useMutation(api.chats.deleteChat);

  const handleNewChat = async () => {
    try {
      const chatId = await createChat({ title: "New Chat" });
      toast.success("Created new chat!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      router.push(`/dashboard/chat/${chatId}`);
      closeMobileNav();
    } catch (error) {
      toast.error("Failed to create new chat", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const handleDeleteChat = async (id: Id<"chats">) => {
    try {
      await deleteChat({ id });
      toast.success("Chat deleted successfully", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      if (window.location.pathname.includes(id)) {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to delete chat", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const sidebarClasses = cn(
    "fixed md:sticky top-14 md:top-0 bottom-0 left-0 z-50",
    "w-[280px] md:w-72 bg-gray-50/80 backdrop-blur-xl",
    "border-r border-gray-200",
    "transform transition-transform duration-300 ease-in-out",
    "flex flex-col h-[calc(100vh-3.5rem)] md:h-screen",
    isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
  );

  return (
    <>
      {/* Background Overlay for mobile */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeMobileNav}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-4 border-b border-gray-200">
          <a href="/dashboard" className="block cursor-pointer group">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-auto mb-4 max-w-[160px] mx-auto transition-all duration-300 group-hover:scale-105" 
            />
          </a>
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <PlusIcon className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {chats?.map((chat) => (
            <ChatRow key={chat._id} chat={chat} onDelete={handleDeleteChat} />
          ))}
          
          {!chats?.length && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No chats yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new conversation to begin</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
