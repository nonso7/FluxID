'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import Image from "next/image";
import { Briefcase, Wallet, TrendingUp, Shield, Clock, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";
import type { Variants } from "framer-motion";

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

// Mock tracked wallets - in production would come from backend
const MOCK_WALLETS = [
  { address: "GABC123XYZ...", score: 78, risk: "Low", lastAnalyzed: "2 hours ago", transactions: 45 },
  { address: "GDEF456UVW...", score: 52, risk: "Medium", lastAnalyzed: "1 day ago", transactions: 128 },
  { address: "GGHI789RST...", score: 34, risk: "High", lastAnalyzed: "3 days ago", transactions: 89 },
];

export default function Portfolio() {
  const { isConnected } = useAccount();
  const [wallets] = useState(MOCK_WALLETS);

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="FluxID" width={48} height={48} />
        <h2 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black">
          Tracked Wallets
        </h2>
        <p style={{ color: "var(--foreground-muted)" }}>Connect your wallet to track and analyze wallets.</p>
        <appkit-button />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-5 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-4xl font-black mb-2">
              Tracked Wallets
            </h1>
            <p style={{ color: "var(--foreground-muted)" }} className="text-lg">
              Monitor wallets you've analyzed and want to keep track of.
            </p>
          </div>
          <button className="btn btn-primary flex items-center gap-2">
            <Wallet size={14} /> Add Wallet
          </button>
        </div>

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "var(--primary-muted)", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <Briefcase size={18} style={{ color: "var(--primary)" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Total Tracked</span>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 28 }}>{wallets.length}</p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "#22c55e20", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <TrendingUp size={18} style={{ color: "#22c55e" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Avg Score</span>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 28 }}>
              {Math.round(wallets.reduce((sum, w) => sum + w.score, 0) / wallets.length)}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            initial="hidden"
            animate="show"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: "var(--primary-muted)", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                <Shield size={18} style={{ color: "var(--primary)" }} />
              </div>
              <span style={{ color: "var(--foreground-muted)", fontSize: 12, fontWeight: 600 }}>Low Risk</span>
            </div>
            <p style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 28 }}>
              {wallets.filter(w => w.risk === "Low").length}
            </p>
          </motion.div>
        </div>

        {/* ── Wallets Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl overflow-hidden"
        >
          {/* Table Header */}
          <div 
            style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
            className="grid grid-cols-5 gap-4 px-6 py-4 text-xs font-bold uppercase tracking-wider"
          >
            <span style={{ color: "var(--foreground-dim)" }}>Wallet</span>
            <span style={{ color: "var(--foreground-dim)" }}>Score</span>
            <span style={{ color: "var(--foreground-dim)" }}>Risk</span>
            <span style={{ color: "var(--foreground-dim)" }}>Last Analyzed</span>
            <span style={{ color: "var(--foreground-dim)" }} className="text-right">Actions</span>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[var(--border)]">
            {wallets.map((wallet, i) => (
              <motion.div
                key={i}
                variants={item}
                initial="hidden"
                animate="show"
                transition={{ delay: i * 0.1 }}
                className="grid grid-cols-5 gap-4 px-6 py-4 items-center hover:bg-[var(--surface)] transition-colors"
              >
                {/* Wallet Address */}
                <div className="flex items-center gap-3">
                  <div style={{ background: "var(--primary-muted)", borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
                    <Wallet size={18} style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <p style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>{wallet.address}</p>
                    <p style={{ color: "var(--foreground-dim)", fontSize: 11 }}>{wallet.transactions} transactions</p>
                  </div>
                </div>

                {/* Score */}
                <div>
                  <span 
                    style={{ 
                      color: wallet.score >= 70 ? "#22c55e" : wallet.score >= 40 ? "#eab308" : "#ef4444",
                      fontWeight: 900,
                      fontSize: 20
                    }}
                  >
                    {wallet.score}
                  </span>
                  <span style={{ color: "var(--foreground-dim)", fontSize: 11 }}>/100</span>
                </div>

                {/* Risk */}
                <div>
                  <span 
                    className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      background: wallet.risk === "Low" ? "#22c55e20" : wallet.risk === "Medium" ? "#eab30820" : "#ef444420",
                      color: wallet.risk === "Low" ? "#22c55e" : wallet.risk === "Medium" ? "#eab308" : "#ef4444"
                    }}
                  >
                    {wallet.risk}
                  </span>
                </div>

                {/* Last Analyzed */}
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: "var(--foreground-dim)" }} />
                  <span style={{ color: "var(--foreground-muted)", fontSize: 13 }}>{wallet.lastAnalyzed}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <button 
                    className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
                    title="View Details"
                  >
                    <ExternalLink size={16} style={{ color: "var(--foreground-dim)" }} />
                  </button>
                  <button 
                    className="p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} style={{ color: "#ef4444" }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}