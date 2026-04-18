"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Circle, Loader2, X } from "lucide-react";
import type { AgentStep } from "@/lib/agentDemo";

interface Props {
  steps: AgentStep[];
  className?: string;
}

function statusIcon(status: AgentStep["status"]) {
  switch (status) {
    case "done":
      return <Check size={14} style={{ color: "#22c55e" }} />;
    case "active":
      return <Loader2 size={14} className="animate-spin" style={{ color: "var(--primary)" }} />;
    case "error":
      return <X size={14} style={{ color: "#ef4444" }} />;
    default:
      return <Circle size={14} style={{ color: "var(--foreground-dim)" }} />;
  }
}

function statusColor(status: AgentStep["status"]): string {
  switch (status) {
    case "done":
      return "#22c55e";
    case "active":
      return "var(--primary)";
    case "error":
      return "#ef4444";
    default:
      return "var(--foreground-dim)";
  }
}

export default function ActivityLog({ steps, className = "" }: Props) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 15 }}
          className="flex items-center gap-2"
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: steps.some((s) => s.status === "active") ? "var(--primary)" : "var(--foreground-dim)",
              boxShadow: steps.some((s) => s.status === "active")
                ? "0 0 8px var(--primary)"
                : "none",
            }}
          />
          Agent Activity
        </h3>
        <span
          style={{ color: "var(--foreground-dim)", fontSize: 11, fontFamily: "monospace" }}
        >
          {steps.filter((s) => s.status === "done").length}/{steps.length}
        </span>
      </div>

      <ol className="space-y-2">
        <AnimatePresence initial={false}>
          {steps.map((step, idx) => (
            <motion.li
              key={step.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="flex items-start gap-3"
            >
              <div
                className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background:
                    step.status === "done"
                      ? "#22c55e20"
                      : step.status === "active"
                      ? "color-mix(in srgb, var(--primary) 18%, transparent)"
                      : step.status === "error"
                      ? "#ef444420"
                      : "var(--surface)",
                  border: `1px solid ${statusColor(step.status)}`,
                }}
              >
                {statusIcon(step.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  style={{
                    color:
                      step.status === "pending"
                        ? "var(--foreground-muted)"
                        : "var(--foreground)",
                    fontSize: 13,
                    fontWeight: step.status === "active" ? 600 : 500,
                  }}
                >
                  {step.label}
                </div>
                {step.detail && (
                  <div
                    style={{
                      color: "var(--foreground-muted)",
                      fontSize: 11,
                      fontFamily: "monospace",
                      marginTop: 2,
                      wordBreak: "break-all",
                    }}
                  >
                    {step.detail}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </div>
  );
}
