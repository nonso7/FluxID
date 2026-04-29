const AI_BACKEND_URL = process.env.NEXT_PUBLIC_AI_BACKEND_URL || "";

export type ProtocolNetwork = "mainnet" | "testnet";

export interface ProtocolHealth {
  generatedAt: string;
  network: ProtocolNetwork;
  windowHours: number;
  totalWallets: number;
  avgScore: number;
  distribution: { low: number; medium: number; high: number };
  lowRiskPct: number;
  highRiskAlerts: number;
  delta: {
    avgScore: number | null;
    totalWallets: number | null;
    lowRiskPct: number | null;
    highRiskAlerts: number | null;
  };
}

export interface ProtocolCohort {
  id: string;
  name: string;
  count: number;
  color: string;
  description: string;
}

export interface ProtocolRiskBand {
  name: string;
  risk: number;
  activity: number;
  walletCount: number;
  avgScore: number;
}

export interface ProtocolAlert {
  id: string;
  title: string;
  desc: string;
  severity: "Low" | "Medium" | "High";
  generatedAt: string;
}

export type SegmentActivity = "low" | "medium" | "high";

export interface SegmentQuery {
  minScore?: number;
  maxScore?: number;
  risk?: "Low" | "Medium" | "High";
  activity?: SegmentActivity;
  consistent?: boolean;
  limit?: number;
}

export interface SegmentWallet {
  wallet: string;
  score: number;
  risk: "Low" | "Medium" | "High";
  observations: number;
  activity: SegmentActivity;
  consistent: boolean;
  scoreRange: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface SegmentResult {
  network: ProtocolNetwork;
  criteria: SegmentQuery;
  total: number;
  returned: number;
  wallets: SegmentWallet[];
}

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getJson<T>(path: string, network?: ProtocolNetwork): Promise<T | null> {
  if (!AI_BACKEND_URL) return null;
  const url = new URL(path, AI_BACKEND_URL.endsWith("/") ? AI_BACKEND_URL : AI_BACKEND_URL + "/");
  if (network) url.searchParams.set("network", network);
  try {
    const res = await fetch(url.toString());
    const body = (await res.json()) as ApiEnvelope<T>;
    if (!body.success || !body.data) return null;
    return body.data;
  } catch {
    return null;
  }
}

export function fetchProtocolHealth(network?: ProtocolNetwork) {
  return getJson<ProtocolHealth>("protocol/health", network);
}

export function fetchProtocolCohorts(network?: ProtocolNetwork) {
  return getJson<{ network: ProtocolNetwork; cohorts: ProtocolCohort[] }>(
    "protocol/cohorts",
    network
  );
}

export function fetchProtocolRiskHeatmap(network?: ProtocolNetwork) {
  return getJson<{ network: ProtocolNetwork; bands: ProtocolRiskBand[] }>(
    "protocol/risk-heatmap",
    network
  );
}

export function fetchProtocolAlerts(network?: ProtocolNetwork) {
  return getJson<{ network: ProtocolNetwork; alerts: ProtocolAlert[] }>(
    "protocol/alerts",
    network
  );
}

export interface AddWalletsResult {
  network: ProtocolNetwork;
  requested: number;
  scored: number;
  failed: { wallet: string; reason: string }[];
  durationMs: number;
}

export async function addProtocolWallets(
  wallets: string[],
  network: ProtocolNetwork
): Promise<AddWalletsResult | null> {
  if (!AI_BACKEND_URL) return null;
  const url = AI_BACKEND_URL.endsWith("/")
    ? `${AI_BACKEND_URL}protocol/wallets`
    : `${AI_BACKEND_URL}/protocol/wallets`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallets, network }),
    });
    const body = (await res.json()) as ApiEnvelope<AddWalletsResult>;
    if (!body.success || !body.data) return null;
    return body.data;
  } catch {
    return null;
  }
}

export async function resetProtocolHistory(
  network?: ProtocolNetwork
): Promise<{ removed: number; network: string } | null> {
  if (!AI_BACKEND_URL) return null;
  const base = AI_BACKEND_URL.endsWith("/") ? AI_BACKEND_URL : AI_BACKEND_URL + "/";
  const url = new URL("protocol/wallets", base);
  if (network) url.searchParams.set("network", network);
  try {
    const res = await fetch(url.toString(), { method: "DELETE" });
    const body = (await res.json()) as ApiEnvelope<{ removed: number; network: string }>;
    if (!body.success || !body.data) return null;
    return body.data;
  } catch {
    return null;
  }
}

export async function fetchProtocolSegments(
  query: SegmentQuery = {},
  network?: ProtocolNetwork
): Promise<SegmentResult | null> {
  if (!AI_BACKEND_URL) return null;
  const url = new URL(
    "protocol/segments",
    AI_BACKEND_URL.endsWith("/") ? AI_BACKEND_URL : AI_BACKEND_URL + "/"
  );
  if (network) url.searchParams.set("network", network);
  if (query.minScore !== undefined) url.searchParams.set("minScore", String(query.minScore));
  if (query.maxScore !== undefined) url.searchParams.set("maxScore", String(query.maxScore));
  if (query.risk) url.searchParams.set("risk", query.risk);
  if (query.activity) url.searchParams.set("activity", query.activity);
  if (query.consistent !== undefined) url.searchParams.set("consistent", String(query.consistent));
  if (query.limit) url.searchParams.set("limit", String(query.limit));

  try {
    const res = await fetch(url.toString());
    const body = (await res.json()) as ApiEnvelope<SegmentResult>;
    if (!body.success || !body.data) return null;
    return body.data;
  } catch {
    return null;
  }
}
