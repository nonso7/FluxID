"use client";

import { motion } from "framer-motion";
import { Activity, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 28 }} className="mb-2">
          Activity
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          View your recent transaction history.
        </p>

        <div 
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          className="mt-6 p-8 rounded-xl text-center"
        >
          <Activity size={32} style={{ color: "var(--foreground-muted)", margin: "0 auto 12px" }} />
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
            No recent activity. Connect a wallet and analyze to see transactions.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
