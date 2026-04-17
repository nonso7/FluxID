"use client";

import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { useFreighter } from "../../context/FreighterContext";

export default function WalletPage() {
  const { publicKey: address, isConnected } = useFreighter();

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 28 }} className="mb-2">
          Wallet
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          Manage your connected wallet and view details.
        </p>

        {isConnected && address ? (
          <div 
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            className="mt-6 p-4 rounded-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Wallet size={20} style={{ color: "var(--primary)" }} />
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>Connected Wallet</span>
            </div>
            <p style={{ color: "var(--foreground-muted)", fontSize: 14, fontFamily: "monospace" }}>
              {address}
            </p>
          </div>
        ) : (
          <div 
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            className="mt-6 p-8 rounded-xl text-center"
          >
            <Wallet size={32} style={{ color: "var(--foreground-muted)", margin: "0 auto 12px" }} />
            <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
              Connect your wallet to view details.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
