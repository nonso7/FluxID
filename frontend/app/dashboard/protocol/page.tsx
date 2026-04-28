"use client";

import { useEffect, useState } from "react";
import { Filter, Search, Download } from "lucide-react";
import ProtocolMetrics from "../../components/ProtocolMetrics";
import RiskHeatmap from "../../components/RiskHeatmap";
import EarlyWarningBanner from "../../components/EarlyWarningBanner";
import {
  fetchProtocolCohorts,
  fetchProtocolSegments,
  type ProtocolCohort,
  type SegmentActivity,
  type SegmentResult,
} from "../../../lib/protocolApi";

type RiskFilter = "" | "Low" | "Medium" | "High";
type ActivityFilter = "" | SegmentActivity;

function truncateWallet(addr: string, head = 6, tail = 4): string {
  if (addr.length <= head + tail + 2) return addr;
  return `${addr.slice(0, head)}…${addr.slice(-tail)}`;
}

export default function ProtocolDashboard() {
  const [cohorts, setCohorts] = useState<ProtocolCohort[] | null>(null);
  const [queryOpen, setQueryOpen] = useState(false);
  const [minScore, setMinScore] = useState<string>("");
  const [maxScore, setMaxScore] = useState<string>("");
  const [risk, setRisk] = useState<RiskFilter>("");
  const [activity, setActivity] = useState<ActivityFilter>("");
  const [consistent, setConsistent] = useState(false);
  const [segmentResult, setSegmentResult] = useState<SegmentResult | null>(null);
  const [segmentLoading, setSegmentLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetchProtocolCohorts().then((res) => {
      if (active) setCohorts(res?.cohorts ?? []);
    });
    return () => {
      active = false;
    };
  }, []);

  const cohortsLoading = cohorts === null;
  const cohortMax = cohorts && cohorts.length > 0
    ? Math.max(1, ...cohorts.map((c) => c.count))
    : 1;

  const runSegmentQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSegmentLoading(true);
    const result = await fetchProtocolSegments({
      minScore: minScore === "" ? undefined : Number(minScore),
      maxScore: maxScore === "" ? undefined : Number(maxScore),
      risk: risk === "" ? undefined : risk,
      activity: activity === "" ? undefined : activity,
      consistent: consistent ? true : undefined,
      limit: 50,
    });
    setSegmentResult(result);
    setSegmentLoading(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1
            style={{ color: "var(--foreground)", letterSpacing: "-0.04em" }}
            className="text-4xl font-black mb-2"
          >
            Protocol Intelligence
          </h1>
          <p style={{ color: "var(--foreground-muted)", fontSize: 15 }}>
            Real-time health monitoring and risk analysis for your entire user-base.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-outline text-xs h-10 px-4 flex items-center gap-2"
            style={{ borderRadius: 12 }}
          >
            <Download size={14} /> Export Report
          </button>
          <button
            className="btn btn-primary text-xs h-10 px-4 flex items-center gap-2"
            style={{ borderRadius: 12 }}
          >
            <Filter size={14} /> Global Filters
          </button>
        </div>
      </div>

      {/* Early Warning System */}
      <EarlyWarningBanner />

      {/* High-Level Metrics */}
      <ProtocolMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Risk Heatmap - 2/3 width */}
        <div className="lg:col-span-2">
          <RiskHeatmap />
        </div>

        {/* Cohort & Segmentation Engine - 1/3 width */}
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
          }}
          className="p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 18 }}
            >
              Cohort Engine
            </h3>
            <Search size={18} style={{ color: "var(--foreground-dim)" }} />
          </div>

          <div className="space-y-4">
            <div className="relative">
              <p
                style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 700 }}
                className="uppercase mb-2"
              >
                Quick Segments
              </p>
              <div className="space-y-2">
                {cohortsLoading && (
                  <p
                    style={{ color: "var(--foreground-dim)", fontSize: 12 }}
                    className="py-2"
                  >
                    Loading segments…
                  </p>
                )}
                {!cohortsLoading && (cohorts?.length ?? 0) === 0 && (
                  <p
                    style={{ color: "var(--foreground-dim)", fontSize: 12 }}
                    className="py-2"
                  >
                    No cohort data yet.
                  </p>
                )}
                {!cohortsLoading && cohorts && cohorts.map((s) => (
                  <button
                    key={s.id}
                    title={s.description}
                    className="w-full text-left p-3 rounded-xl transition-colors hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        style={{ color: "var(--foreground)", fontSize: 13, fontWeight: 600 }}
                      >
                        {s.name}
                      </span>
                      <span
                        style={{ color: "var(--foreground-dim)", fontSize: 11 }}
                        className="font-bold"
                      >
                        {s.count}
                      </span>
                    </div>
                    <div className="w-full h-1 bg-[var(--surface)] rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${(s.count / cohortMax) * 100}%`,
                          background: s.color,
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[var(--border)]">
              <button
                onClick={() => setQueryOpen((v) => !v)}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
              >
                {queryOpen ? "Hide Custom Segment" : "Create Custom Segment"}
              </button>

              {queryOpen && (
                <form
                  onSubmit={runSegmentQuery}
                  className="mt-4 space-y-3"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span
                        style={{ color: "var(--foreground-muted)", fontSize: 10, fontWeight: 700 }}
                        className="uppercase block mb-1"
                      >
                        Min Score
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={minScore}
                        onChange={(e) => setMinScore(e.target.value)}
                        placeholder="0"
                        className="w-full px-2 py-1.5 rounded-md text-xs"
                        style={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </label>
                    <label className="block">
                      <span
                        style={{ color: "var(--foreground-muted)", fontSize: 10, fontWeight: 700 }}
                        className="uppercase block mb-1"
                      >
                        Max Score
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={maxScore}
                        onChange={(e) => setMaxScore(e.target.value)}
                        placeholder="100"
                        className="w-full px-2 py-1.5 rounded-md text-xs"
                        style={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                        }}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span
                        style={{ color: "var(--foreground-muted)", fontSize: 10, fontWeight: 700 }}
                        className="uppercase block mb-1"
                      >
                        Risk
                      </span>
                      <select
                        value={risk}
                        onChange={(e) => setRisk(e.target.value as RiskFilter)}
                        className="w-full px-2 py-1.5 rounded-md text-xs"
                        style={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        <option value="">Any</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </label>
                    <label className="block">
                      <span
                        style={{ color: "var(--foreground-muted)", fontSize: 10, fontWeight: 700 }}
                        className="uppercase block mb-1"
                      >
                        Activity
                      </span>
                      <select
                        value={activity}
                        onChange={(e) => setActivity(e.target.value as ActivityFilter)}
                        className="w-full px-2 py-1.5 rounded-md text-xs"
                        style={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          color: "var(--foreground)",
                        }}
                      >
                        <option value="">Any</option>
                        <option value="low">Low (1 obs)</option>
                        <option value="medium">Medium (2-3)</option>
                        <option value="high">High (4+)</option>
                      </select>
                    </label>
                  </div>
                  <label
                    className="flex items-center gap-2 cursor-pointer"
                    style={{ color: "var(--foreground-muted)", fontSize: 11 }}
                  >
                    <input
                      type="checkbox"
                      checked={consistent}
                      onChange={(e) => setConsistent(e.target.checked)}
                    />
                    Consistent risk across observations
                  </label>
                  <button
                    type="submit"
                    disabled={segmentLoading}
                    className="w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
                    style={{
                      background: "var(--primary)",
                      color: "var(--background)",
                      opacity: segmentLoading ? 0.6 : 1,
                    }}
                  >
                    {segmentLoading ? "Querying…" : "Find Wallets"}
                  </button>

                  {segmentResult && (
                    <div className="pt-3 mt-3 border-t border-[var(--border)]">
                      <p
                        style={{ color: "var(--foreground-muted)", fontSize: 11, fontWeight: 700 }}
                        className="uppercase mb-2"
                      >
                        {segmentResult.total} match{segmentResult.total === 1 ? "" : "es"}
                        {segmentResult.total > segmentResult.returned
                          ? ` · showing ${segmentResult.returned}`
                          : ""}
                      </p>
                      {segmentResult.wallets.length === 0 ? (
                        <p
                          style={{ color: "var(--foreground-dim)", fontSize: 12 }}
                          className="py-2"
                        >
                          No wallets match these criteria yet.
                        </p>
                      ) : (
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                          {segmentResult.wallets.map((w) => (
                            <div
                              key={w.wallet}
                              className="flex items-center justify-between px-2 py-1.5 rounded-md"
                              style={{ background: "var(--card)" }}
                              title={w.wallet}
                            >
                              <span
                                style={{ color: "var(--foreground-muted)", fontSize: 11 }}
                                className="font-mono"
                              >
                                {truncateWallet(w.wallet)}
                              </span>
                              <span
                                style={{
                                  color:
                                    w.risk === "Low"
                                      ? "#22c55e"
                                      : w.risk === "Medium"
                                        ? "#eab308"
                                        : "#ef4444",
                                  fontSize: 11,
                                  fontWeight: 700,
                                }}
                              >
                                {w.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Insights section */}
      <div
         style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
        }}
        className="p-8 text-center"
      >
        <h3 style={{ color: "var(--foreground)", fontWeight: 800, fontSize: 20 }} className="mb-2">
          Protocol Intelligence API
        </h3>
        <p style={{ color: "var(--foreground-muted)", fontSize: 14 }} className="max-w-xl mx-auto mb-6">
          Access these trust signals programmatically. Integrate real-time liquidity scoring and risk monitoring into your lending logic, marketplaces, or AI agents.
        </p>
        <div className="flex justify-center gap-4">
          <code style={{ background: "var(--card)", padding: "8px 16px", borderRadius: 8, fontSize: 13, border: "1px solid var(--border)" }}>
            GET /protocol/health
          </code>
          <button className="text-[var(--primary)] text-sm font-bold flex items-center gap-1 hover:underline">
            View API Docs →
          </button>
        </div>
      </div>
    </div>
  );
}
