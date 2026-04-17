"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 28 }} className="mb-2">
          Security
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          Security settings and risk assessment for your wallet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }} className="p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Shield size={20} style={{ color: "var(--primary)" }} />
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>Risk Level</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} style={{ color: "#22c55e" }} />
              <span style={{ color: "#22c55e", fontWeight: 600 }}>Low Risk</span>
            </div>
          </div>

          <div style={{ background: "var(--surface)", border: "1px solid var(--border)" }} className="p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={20} style={{ color: "var(--warning)" }} />
              <span style={{ color: "var(--foreground)", fontWeight: 600 }}>Two-Factor Auth</span>
            </div>
            <p style={{ color: "var(--foreground-muted)", fontSize: 13 }}>
              Not enabled
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
