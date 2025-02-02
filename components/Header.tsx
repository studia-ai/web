"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useNavigation } from "@/lib/context/navigation";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';

export default function Header() {
  const { setIsMobileNavOpen } = useNavigation();
  const router = useRouter();
  const createChat = useMutation(api.chats.createChat);

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

  return (
    <header className="border-b border-gray-200/50 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3">
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
          >
            <HamburgerMenuIcon className="h-5 w-5" />
          </Button>
          
          <Link href="/dashboard">
            <Button
              variant="secondary"
              size="icon"
              className="text-gray-900 hover:text-gray-700 hover:bg-gray-100/50"
            >
              <HomeIcon className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            onClick={handleNewChat}
            variant="secondary"
            className="text-gray-900 hover:text-gray-700 hover:bg-gray-100/50 flex items-center"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="hidden md:inline ml-2">New Chat</span>
          </Button>
        </div>

        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
