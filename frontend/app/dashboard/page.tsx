'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFreighter, truncateAddress } from "../context/FreighterContext";
import { analyzeWallet, getSuggestions, LiquidityScore } from "../../lib/scoring";
import Image from "next/image";
import { Layers, Wallet, TrendingUp, AlertCircle, RefreshCw, ExternalLink } from "lucide-react";

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
  const { address, isConnected, isConnecting, error, connect } = useFreighter();
  const [analyzeAddress, setAnalyzeAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scoreData, setScoreData] = useState<LiquidityScore | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (address && !analyzeAddress) {
      setAnalyzeAddress(address);
    }
  }, [address, analyzeAddress]);

  const handleAnalyze = async () => {
    const targetAddress = analyzeAddress || address;
    if (!targetAddress) return;
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeWallet(targetAddress);
      setScoreData(result);
      setSuggestions(getSuggestions(result, {
        totalInflow: 0,
        totalOutflow: 0,
        transactionCount: 0,
        inflowCount: 0,
        outflowCount: 0
      }));
    } catch (err) {
      console.error("Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* Not connected */
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-6 text-center">
        <Image src="/logo.svg" alt="FluxID" width={80} height={80} />
        <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-4xl font-black">
          FluxID
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 18 }}>
          Turn any wallet into a real-time financial identity.
        </p>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="btn btn-primary flex items-center gap-2"
        >
          <Wallet size={18} />
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
        {error && (
          <p style={{ color: "#ef4444", fontSize: 14 }}>{error}</p>
        )}
        <p style={{ color: "var(--foreground-dim)", fontSize: 12 }}>
          Powered by Stellar
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 style={{ color: "var(--foreground)", letterSpacing: "-0.03em" }} className="text-3xl font-black mb-2">
            Liquidity Score
          </h1>
          {address && (
            <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
              Wallet: {truncateAddress(address)}
            </p>
          )}
        </div>

        {/* Analyze Input */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          className="rounded-2xl p-6 mb-8"
        >
          <div className="flex gap-3">
            <input
              type="text"
              value={analyzeAddress}
              onChange={(e) => setAnalyzeAddress(e.target.value)}
              placeholder="Enter Stellar wallet address (G...)"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-white/10 focus:border-primary outline-none text-sm"
            />
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !analyzeAddress}
              className="btn btn-primary flex items-center gap-2"
            >
              {isAnalyzing ? <RefreshCw size={16} className="animate-spin" /> : <TrendingUp size={16} />}
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </button>
          </div>
          {address && (
            <button
              onClick={() => setAnalyzeAddress(address)}
              style={{ color: "var(--primary)", fontSize: 13 }}
              className="mt-3 text-sm"
            >
              Analyze my wallet ({truncateAddress(address)})
            </button>
          )}
        </motion.div>

        {/* Score Display */}
        {scoreData ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            {/* Score Circle */}
            <div className="relative inline-block mb-6">
              <svg width="240" height="240" viewBox="0 0 240 240">
                <circle 
                  cx="120" 
                  cy="120" 
                  r="100" 
                  fill="none" 
                  stroke="var(--border)" 
                  strokeWidth="16" 
                />
                <circle 
                  cx="120" 
                  cy="120" 
                  r="100" 
                  fill="none" 
                  stroke={scoreData.riskLevel === "Low" ? "#22c55e" : scoreData.riskLevel === "Medium" ? "#eab308" : "#ef4444"}
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${(scoreData.score / 100) * 628} 628`}
                  transform="rotate(-90 120 120)"
                  style={{ transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span style={{ color: "var(--foreground)", fontWeight: 900, fontSize: 64 }}>
                  {scoreData.score}
                </span>
              </div>
            </div>

            {/* Risk Badge */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                style={{ 
                  background: scoreData.riskLevel === "Low" ? "#22c55e20" : scoreData.riskLevel === "Medium" ? "#eab30820" : "#ef444420",
                  color: scoreData.riskLevel === "Low" ? "#22c55e" : scoreData.riskLevel === "Medium" ? "#eab308" : "#ef4444"
                }}
              >
                <AlertCircle size={16} />
                {scoreData.riskLevel} Risk
              </span>
            </div>

            {/* Score Breakdown */}
            <div 
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
              className="rounded-2xl p-6 mb-6"
            >
              <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }} className="mb-4">
                Score Breakdown
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Inflow Consistency", value: scoreData.factors.inflowConsistency },
                  { label: "Outflow Stability", value: scoreData.factors.outflowStability },
                  { label: "Transaction Frequency", value: scoreData.factors.transactionFrequency },
                ].map((factor, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span style={{ color: "var(--foreground-muted)", fontSize: 12 }}>{factor.label}</span>
                      <span style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 14 }}>{factor.value}%</span>
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

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div style={{ background: "var(--card)", border: "1px solid var(--border)" }} className="rounded-2xl p-6">
                <h3 style={{ color: "var(--foreground)", fontWeight: 700, fontSize: 16 }} className="mb-4">
                  Insights
                </h3>
                <div className="space-y-3">
                  {suggestions.map((suggestion, i) => (
                    <p key={i} style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
                      {suggestion}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Layers size={48} style={{ color: "var(--primary)", margin: "0 auto 16px" }} />
            <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 20 }} className="mb-2">
              Enter a wallet address to analyze
            </h3>
            <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
              Connect your wallet or enter any Stellar address to see their liquidity score.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}