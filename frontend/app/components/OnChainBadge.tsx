"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { fetchOnChainInfo, formatLastUpdated, type OnChainWalletInfo } from "../../lib/onchain";

interface Props {
  wallet: string | null;
  className?: string;
}

export default function OnChainBadge({ wallet, className = "" }: Props) {
  const [state, setState] = useState<{ status: "idle" } | { status: "loading" } | { status: "verified"; info: OnChainWalletInfo }>({ status: "idle" });

  useEffect(() => {
    let cancelled = false;
    if (!wallet) {
      setState({ status: "idle" });
      return;
    }

    setState({ status: "loading" });
    fetchOnChainInfo(wallet).then((result) => {
      if (cancelled) return;
      if (result.info) {
        setState({ status: "verified", info: result.info });
      } else {
        setState({ status: "idle" });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [wallet]);

  if (state.status !== "verified") return null;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${className}`}
      style={{ background: "#22c55e20", border: "1px solid #22c55e", color: "#22c55e" }}
      title={`Score ${state.info.score} · ${state.info.risk} risk · on-chain`}
    >
      <ShieldCheck size={12} />
      On-chain verified · {formatLastUpdated(state.info.lastUpdated)}
    </div>
  );
}
