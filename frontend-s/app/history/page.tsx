'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Clock, RefreshCw, TrendingUp, Wallet, ArrowRight, ExternalLink } from "lucide-react";
import type { Variants } from "framer-motion";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

// Mock analysis history
const MOCK_HISTORY = [
  { 
    id: 1, 
    wallet: "GABC123XYZ...", 
    score: 78, 
    risk: "Low", 
    date: "2 hours ago",
    factors: { inflowConsistency: 85, outflowStability: 72, transactionFrequency: 80 }
  },
  { 
    id: 2, 
    wallet: "GDEF456UVW...", 
    score: 52, 
    risk: "Medium", 
    date: "1 day ago",
    factors: { inflowConsistency: 45, outflowStability: 60, transactionFrequency: 55 }
  },
  { 
    id: 3, 
    wallet: "GGHI789RST...", 
    score: 34, 
    risk: "High", 
    date: "3 days ago",
    factors: { inflowConsistency: 30, outflowStability: 25, transactionFrequency: 50 }
  },
  { 
    id: 4, 
    wallet: "GJKL012ABC...", 
    score: 89, 
    risk: "Low", 
    date: "5 days ago",
    factors: { inflowConsistency: 95, outflowStability: 85, transactionFrequency: 88 }
  },
];

export default function History() {
  const { isConnected } = useAccount();
  const [history] = useState(MOCK_HISTORY);

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="FluxID" width={48} height={48} />
        <h2 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black">
          Analysis History
        </h2>
        <p style={{ color: "var(--foreground-muted)" }}>Connect your wallet to view wallet analysis history.</p>
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* ── Header ── */}
        <div className="mb-8">
          <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-4xl font-black mb-2">
            Analysis History
          </h1>
          <p style={{ color: "var(--foreground-muted)" }} className="text-lg">
            View past wallet analyses and track changes over time.
          </p>
        </div>

        {/* ── History List ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl overflow-hidden"
        >
          {history.map((analysis, i) => (
            <motion.div
              key={analysis.id}
              variants={item}
              initial="hidden"
              animate="show"
              transition={{ delay: i * 0.1 }}
              className="p-6 border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface)] transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* Wallet Info */}
                <div className="flex items-center gap-4">
                  <div 
                    style={{ background: "var(--primary-muted)", borderRadius: 12 }}
                    className="w-12 h-12 flex items-center justify-center"
                  >
                    <Wallet size={20} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 16 }}>
                      {analysis.wallet}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} style={{ color: "var(--foreground-dim)" }} />
                      <span style={{ color: "var(--foreground-dim)", fontSize: 12 }}>{analysis.date}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Risk */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p style={{ color: "var(--foreground-dim)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="uppercase mb-1">
                      Score
                    </p>
                    <p style={{ 
                      color: analysis.score >= 70 ? "#22c55e" : analysis.score >= 40 ? "#eab308" : "#ef4444",
                      fontWeight: 900,
                      fontSize: 24
                    }}>
                      {analysis.score}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p style={{ color: "var(--foreground-dim)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="uppercase mb-1">
                      Risk
                    </p>
                    <span 
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                      style={{ 
                        background: analysis.risk === "Low" ? "#22c55e20" : analysis.risk === "Medium" ? "#eab30820" : "#ef444420",
                        color: analysis.risk === "Low" ? "#22c55e" : analysis.risk === "Medium" ? "#eab308" : "#ef4444"
                      }}
                    >
                      {analysis.risk}
                    </span>
                  </div>

                  <button className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors">
                    <ArrowRight size={18} style={{ color: "var(--foreground-dim)" }} />
                  </button>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <p style={{ color: "var(--foreground-dim)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="uppercase mb-3">
                  Score Breakdown
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Inflow Consistency", value: analysis.factors.inflowConsistency },
                    { label: "Outflow Stability", value: analysis.factors.outflowStability },
                    { label: "Transaction Frequency", value: analysis.factors.transactionFrequency },
                  ].map((factor, j) => (
                    <div key={j}>
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>{factor.label}</span>
                        <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 13 }}>{factor.value}%</span>
                      </div>
                      <div style={{ background: "var(--surface)", borderRadius: 4 }} className="h-2">
                        <div 
                          style={{ 
                            width: `${factor.value}%`, 
                            background: factor.value >= 70 ? "#22c55e" : factor.value >= 40 ? "#eab308" : "#ef4444",
                            borderRadius: 4
                          }}
                          className="h-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}