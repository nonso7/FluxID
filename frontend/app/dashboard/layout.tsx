"use client";

import { ReactNode } from "react";
import Header from "@/app/components/Header";
import Sidebar from "@/app/components/Sidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Header />
      <Sidebar />
        <div 
          className="fixed right-6 bottom-6"
          style={{ left: "calc(var(--sidebar-width, 248px) + 24px)", top: 104 }}
        >
          <div 
            style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 20 }}
            className="h-full w-full overflow-auto"
          >
          {children}
        </div>
      </div>
    </div>
  );
}
