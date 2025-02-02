"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowRight, ClipboardCopy, Check } from "lucide-react"; 
import Link from "next/link";
import { useState } from "react";
import { toast } from 'react-toastify';
import UnderTheHood from "@/components/UnderTheHood";
import Sidebar from "@/components/Sidebar";

import { CONTRACT_ADDRESS } from "@/lib/constants";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

export default function LandingPage() {
  const [isCopied, setIsCopied] = useState(false);

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
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-50 flex">
      <div className="flex-1 flex">
        <SignedIn>
          <Sidebar />
        </SignedIn>
        <div className="flex-1 flex items-center justify-center">
          <div className="absolute inset-0 -z-10 h-full w-full bg-[#E9E3D9] bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:6rem_4rem]" />
          
          <section className="w-full px-4 py-8 md:py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 flex flex-col items-center space-y-8 md:space-y-16 text-center relative">
            {/* Hero content */}
            <header className="space-y-6 md:space-y-8">
              <div className="inline-block animate-fade-in">
                <span className="px-3 md:px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-purple-50 to-teal-50 text-gray-700 rounded-full border border-gray-200">
                  ✨ Welcome to the future of AI in Solana
                </span>
              </div>
              <h1 className="flex flex-col text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                  Studia.ai
                </span>
                <span className="bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent leading-tight pb-2">
                  AI Agents
                </span>
              </h1>
              <p className="max-w-[600px] text-lg md:text-xl text-gray-600 leading-relaxed px-4">
                New AI Agents for your Solana Dapps
              </p>
              <a
                href="https://x.com/StudiaAI"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <TwitterLogoIcon className="w-5 h-5" />
                <span>Follow us on X</span>
              </a>
            </header>

            {/* CTA Buttons and API Key Card Group */}
            <div className="space-y-6">
              <SignedIn>
                <Link href="/dashboard">
                  <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-[0_0_0_3px_rgba(124,58,237,0.1)] hover:shadow-[0_0_0_3px_rgba(124,58,237,0.2)]">
                    Login / Sign Up
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </SignedIn>

              <SignedOut>
                <div className="space-y-4">
                  <SignInButton mode="modal" fallbackRedirectUrl={"/dashboard"} forceRedirectUrl={"/dashboard"}>
                    <button className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 shadow-[0_0_0_3px_rgba(124,58,237,0.1)] hover:shadow-[0_0_0_3px_rgba(124,58,237,0.2)]">
                      Login / Sign Up
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </SignInButton>

                  {/* API Key Card */}
                  <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl ring-1 ring-gray-200/50 shadow-sm max-w-md mx-auto">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs sm:text-sm font-medium text-gray-500">CA:</span>
                        <code className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-50 rounded-md text-xs sm:text-sm font-mono text-gray-800">
                          {CONTRACT_ADDRESS}
                        </code>
                      </div>
                      <button
                        onClick={handleCopyClick}
                        className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Copy contract address"
                      >
                        {isCopied ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <ClipboardCopy className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </SignedOut>
            </div>

            {/* Updated Features grid */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pt-8 max-w-4xl mx-auto">
              {[
                { 
                  title: "Lightning Fast", 
                  description: "Real-time streamed responses with minimal latency",
                  icon: "⚡"
                },
                {
                  title: "Modern Stack",
                  description: "Built with IBM's WxTools, LangChain, and Claude-3.5-Sonnet",
                  icon: "🚀"
                },
                { 
                  title: "AI Powered", 
                  description: "Leveraging cutting-edge language models",
                  icon: "🤖"
                },
              ].map(({ title, description, icon }) => (
                <div key={title} className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 hover:border-purple-100 transition-colors">
                  <div className="text-3xl mb-3">{icon}</div>
                  <div className="text-xl font-semibold text-gray-900 mb-2">
                    {title}
                  </div>
                  <div className="text-sm text-gray-600">{description}</div>
                </div>
              ))}
            </div> */}

            <UnderTheHood />
          </section>
        </div>
      </div>
    </main>
  );
}
