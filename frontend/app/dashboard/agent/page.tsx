"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AgentDemo from "@/app/components/AgentDemo";
import { useFreighter } from "@/app/context/FreighterContext";

export default function AgentDemoPage() {
  const router = useRouter();
  const { isConnected, isLoading } = useFreighter();

  useEffect(() => {
    if (!isLoading && !isConnected) router.push("/");
  }, [isLoading, isConnected, router]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }}
          className="text-3xl font-black mb-2"
        >
          Agent Demo
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          An AI agent pays per request to unlock the FluxID score endpoint (X402 flow).
        </p>
      </div>

      <AgentDemo />
    </div>
  );
}
