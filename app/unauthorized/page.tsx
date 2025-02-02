"use client";

import { SignInButton } from "@clerk/nextjs";
import { ArrowLeft, LogIn } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full px-4 py-8 text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">
            This page is protected. Please sign in to continue.
          </p>
        </div>

        <div className="space-y-4">
          <SignInButton mode="modal">
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </SignInButton>

          <Link 
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-all duration-200 shadow-sm hover:shadow border border-gray-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
} 