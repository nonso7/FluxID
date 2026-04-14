'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import RegisterForm from "@/components/RegisterForm";
import SecurityNotice from "@/components/SecurityNotice";
import Image from "next/image";
import { Layers, Wallet, TrendingUp, Activity, Plus, RefreshCw, AlertCircle } from "lucide-react";

import type { Variants } from "framer-motion";
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [analyzeAddress, setAnalyzeAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<"Low" | "Medium" | "High" | null>(null);

  /* ── Not connected ── */
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-20 px-6 gap-5 text-center">
        <Image src="/logo.svg" alt="FluxID" width={48} height={48} />
        <h2 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black">
          Connect your wallet
        </h2>
        <p style={{ color: "var(--foreground-muted)" }}>Connect your Freighter wallet to analyze any wallet's liquidity.</p>
        <appkit-button />
      </div>
    );
  }

  const analyzeWallet = async () => {
    if (!analyzeAddress) return;
    setIsAnalyzing(true);
    // Simulate analysis - in production this would call Horizon API
    setTimeout(() => {
      setScore(Math.floor(Math.random() * 100));
      const levels: Array<"Low" | "Medium" | "High"> = ["Low", "Medium", "High"];
      setRiskLevel(levels[Math.floor(Math.random() * 3)]);
      setIsAnalyzing(false);
    }, 2000);
  };

  const STATS = [
    { label: "Liquidity Score", value: score !== null ? String(score) : "—", icon: Layers,  color: "var(--primary)" },
    { label: "Risk Level",       value: riskLevel || "—",          icon: AlertCircle, color: riskLevel === "Low" ? "#22c55e" : riskLevel === "Medium" ? "#eab308" : "#ef4444" },
    { label: "Wallet",          value: address?.slice(0, 8) + "..." || "—", icon: Wallet,  color: "var(--foreground-muted)" },
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-5 py-8">

        <SecurityNotice />

        {/* ── Wallet Analysis Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl p-6 mb-6"
        >
          <h2 style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 20, letterSpacing: "-0.02em" }} className="mb-4">
            Analyze Wallet
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: 14 }} className="mb-4">
            Enter any Stellar wallet address to analyze its liquidity behavior and risk profile.
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={analyzeAddress}
              onChange={(e) => setAnalyzeAddress(e.target.value)}
              placeholder="Enter Stellar wallet address (G...)"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary outline-none text-sm"
            />
            <button
              onClick={analyzeWallet}
              disabled={isAnalyzing || !analyzeAddress}
              className="btn btn-primary flex items-center gap-2"
            >
              {isAnalyzing ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={14} />}
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {STATS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              className="rounded-2xl p-5 flex items-center gap-4"
            >
              <div style={{ background: `${color}20`, borderRadius: 12 }} className="w-12 h-12 flex items-center justify-center shrink-0">
                <Icon size={20} style={{ color }} />
              </div>
              <div>
                <p style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 600, letterSpacing: "0.04em" }} className="uppercase">
                  {label}
                </p>
                <p style={{ color, fontWeight: 900, fontSize: 24, letterSpacing: "-0.02em" }}>
                  {value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Score Display ── */}
        {score !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-8 text-center"
          >
            <div className="relative inline-block mb-6">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--border)" strokeWidth="12" />
                <circle 
                  cx="100" cy="100" r="90" fill="none" 
                  stroke={riskLevel === "Low" ? "#22c55e" : riskLevel === "Medium" ? "#eab308" : "#ef4444"} 
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(score / 100) * 565} 565`}
                  transform="rotate(-90 100 100)"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 48 }}>{score}</span>
              </div>
            </div>
            <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 24 }} className="mb-2">
              Liquidity Score
            </h3>
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-bold"
              style={{ 
                background: riskLevel === "Low" ? "#22c55e20" : riskLevel === "Medium" ? "#eab30820" : "#ef444420",
                color: riskLevel === "Low" ? "#22c55e" : riskLevel === "Medium" ? "#eab308" : "#ef4444"
              }}
            >
              {riskLevel} Risk
            </span>
          </motion.div>
        )}

        {/* ── Coming Soon ── */}
        {score === null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            className="rounded-2xl p-8 text-center"
          >
            <TrendingUp size={48} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
            <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 20 }} className="mb-2">
              Ready to Analyze
            </h3>
            <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
              Enter a wallet address above to see its liquidity score and risk assessment.
            </p>
          </motion.div>
        )}

      </div>
    </div>
  );
}