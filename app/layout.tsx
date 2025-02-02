import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '@/components/Header';
import { NavigationProvider } from "@/lib/context/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Studia.ai',
  description: 'New AI Agents for your Solana Dapps',
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white/80 min-h-screen`}
        >
          <NavigationProvider>
            {children}
            <ToastContainer 
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover
              theme="dark"
            />
          </NavigationProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
