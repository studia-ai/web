/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { BotIcon, Zap, Brain, PocketKnife, ClipboardCopy, Check, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigation } from "@/lib/context/navigation";
import { useState } from "react";
import { toast } from 'react-toastify';
import UnderTheHood from "@/components/UnderTheHood";
import { CONTRACT_ADDRESS } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const createChat = useMutation(api.chats.createChat);
  const { closeMobileNav } = useNavigation();
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setIsCopied(true);
      toast.success("Contract address copied to clipboard!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error: unknown) {
      toast.error("Failed to copy contract address", {
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

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="relative max-w-3xl w-full">
        {/* Enhanced background with subtle patterns and gradients */}
        <div className="absolute inset-0 -z-10">
        </div>

        <div className="relative space-y-8 p-8 text-center">
          {/* Welcome Card */}
          <div className="bg-[#E9E3D9] backdrop-blur-md shadow-xl ring-1 ring-gray-200/50 rounded-2xl p-8 space-y-6">
            {/* Icon Container */}
            <div className="inline-flex p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4">
                <BotIcon className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title with gradient */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Your AI Workspace
              </h2>
              <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
                Start a new conversation or select an existing chat from the sidebar. 
                Your Studia AI assistant is ready to help with any task.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {[
                { icon: Zap, text: "Real-time Responses", color: "from-blue-500 to-blue-600" },
                { icon: Brain, text: "Smart Assistance", color: "from-purple-500 to-purple-600" },
                { icon: PocketKnife, text: "Powerful Tools", color: "from-teal-500 to-teal-600" },
              ].map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm ring-1 ring-gray-200/50 hover:shadow-md transition-shadow"
                >
                  <div className={`bg-gradient-to-r ${color} rounded-full p-1`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Updated Quick Start Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={handleNewChat}
              className="bg-[#E9E3D9] backdrop-blur-md p-6 rounded-2xl ring-1 ring-gray-200/50 hover:shadow-lg transition-all group cursor-pointer"
            >
              <h3 className="font-semibold text-gray-900 mb-2">New Chat</h3>
              <p className="text-gray-600 text-sm">Start a fresh conversation with your AI assistant</p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
            <div className="bg-[#E9E3D9] backdrop-blur-md p-6 rounded-2xl ring-1 ring-gray-200/50 hover:shadow-lg transition-all group">
              <h3 className="font-semibold text-gray-900 mb-2">Browse History</h3>
              <p className="text-gray-600 text-sm">Access your previous conversations and insights</p>
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </div>
          </div>

          {/* API Key Card */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl ring-1 ring-gray-200/50 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">CA:</span>
                <code className="px-2 py-1 bg-gray-50 rounded-md text-sm font-mono text-gray-800">
                  {CONTRACT_ADDRESS}
                </code>
              </div>
              <button
                onClick={handleCopyClick}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Copy API key"
              >
                {isCopied ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <ClipboardCopy className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Quick Documentation */}
          <UnderTheHood />
        </div>
      </div>
    </div>
  );
}