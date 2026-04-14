"use client";

import { ReactNode } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Navbar";
import AIChat from "./AIChat";
import { ToastProvider } from "./Toast";

const Web3Provider = dynamic(() => import("@/context/Web3Provider"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <Web3Provider>
      <ToastProvider>
        <Navbar />
        {children}
        <AIChat />
      </ToastProvider>
    </Web3Provider>
  );
}