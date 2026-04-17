'use client'

import { motion } from "framer-motion";

export default function AnalyticsPage() {
  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 28 }} className="mb-2">
          Analytics
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }}>
          Detailed analytics and insights about wallet performance.
        </p>
      </motion.div>
    </div>
  );
}
