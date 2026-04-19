# Backend & AI Issues - FluxID

This document tracks backend infrastructure, scoring logic, and AI systems for FluxID.

## Core Principle

The backend exists to do ONE thing:

> Turn wallet transaction history into a trust score.

Everything else supports that.

---

## Phase 1: Data Ingestion (Minimal Pipeline)

### Issue #BK-1: Transaction Data Fetching

**Category:** [DATA]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Fetch wallet transaction data from Stellar.

**Tasks:**

- [x] Setup Node.js service (Fastify — lightweight)
- [x] Connect to Horizon API (testnet + mainnet)
- [x] Fetch recent payments for a wallet (retry + timeout)
- [x] Extract payment operations only
- [x] Classify:
  - Inflow
  - Outflow

**Evidence:** `backend/src/services/horizon.service.ts`

---

### Issue #BK-2: In-Memory Processing

**Category:** [INFRA]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Process transactions without heavy infrastructure.

**Tasks:**

- [x] In-memory processing (no DB)
- [x] Normalize transaction data
- [x] TTL caching

**Evidence:** `backend/src/services/cache.service.ts`

---

## Phase 2: Scoring Engine (CORE)

### Issue #BK-3: Rule-Based Liquidity Score

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** Critical

**Description:** Compute wallet trust score (0–100).

**Tasks:**

- [x] Inflow consistency
- [x] Outflow stability
- [x] Transaction frequency
- [x] Flow stability (inflow/outflow ratio)
- [x] Counterparty diversity
- [x] Volume component
- [x] Weighted scoring model

**Output:** `score`, `metrics`  
**Evidence:** `scoring.service.ts`

---

### Issue #BK-4: Risk Classification

**Category:** [AI]  
**Status:** COMPLETED  
**Priority:** High

**Tasks:**

- [x] Thresholds:
  - Low ≥ 70
  - Medium 40–69
  - High < 40
- [x] Generate explanation

---

## Phase 3: API Layer

### Issue #BK-5: Score Endpoint

**Category:** [API]  
**Status:** COMPLETED  
**Priority:** Critical

**Endpoint:**

GET /score/:accountId

**Returns:**

- Score
- Risk
- Breakdown
- Factors
- Insight
- Suggestions

---

## Phase 4: Suggestions Engine

### Issue #BK-6: Recommendation Logic

**Category:** [AI]  
**Status:** COMPLETED

**Tasks:**

- [x] Rule-based suggestions
- [x] Max 1 primary suggestion
- [x] Simple language

---

## Phase 5: Optional On-Chain Integration

### Issue #BK-7: Smart Contract Sync

**Category:** [INTEGRATION]  
**Status:** COMPLETED

**Purpose:**

- Store score on-chain
- Demonstrate verifiability

---

## Phase 6: Agentic AI Payments (X402)

### Issue #BK-8 → BK-12

**Status:** COMPLETED

**Capabilities:**

- Payment-gated API access (HTTP 402)
- Stellar payment verification
- Retry flow for agents
- MCP-compatible endpoints

---

## Phase X: AI Augmentation Layer

### Issue #BK-AI-1: Insight Generation

**Status:** COMPLETED

- Generate 1-line explanation
- Fallback to rule-based insight

---

### Issue #BK-AI-2: Suggestion Generation

**Status:** COMPLETED

- 1–2 clear suggestions
- Based on weakest signals

---

### Issue #BK-AI-3: Pattern Interpretation (Optional)

**Priority:** Low

- Detect deeper behavioral patterns
- Not required for MVP

---

## Post-MVP Roadmap (Backend Evolution)

This defines how the backend evolves beyond single-wallet scoring.

---

### 1. Multi-Wallet Intelligence Layer

Move from:

> Single wallet analysis

To:

> Batch and cohort-level analysis

Capabilities:

- Analyze thousands of wallets
- Aggregate scores across user groups
- Compute:
  - Average score
  - Risk distribution
  - Trend over time

---

### 2. Cohort Query Engine

Enable filtering based on behavior + score.

Examples:

- Score > 75
- Monthly inflow > threshold
- Interaction with specific contracts

Backend Requirements:

- Query layer on top of scoring outputs
- Indexed wallet datasets (future DB layer)

---

### 3. Risk Aggregation & Network Analysis

Detect systemic risk patterns.

Capabilities:

- Identify clusters of high-risk wallets
- Track risky counterparties
- Analyze transaction relationships

---

### 4. Event Monitoring & Alerts

Real-time risk detection.

Triggers:

- Sudden score drops
- Risk spikes across cohorts
- Abnormal transaction behavior

Example:

> “12% of users dropped below score 50”

---

### 5. Intelligence API Layer

Expand API from:

/score/{wallet}

To:

/cohort
/metrics
/alerts
/risk-clusters

Enables:

- Lending platforms
- Marketplaces
- Financial systems

---

### 6. AI-Assisted Decision Layer

Enable systems to act on scores.

Capabilities:

- Automated loan decisions
- Risk-based routing
- Smart contract triggers

---

## Final Guideline

Backend must remain:

- Fast
- Deterministic
- Explainable
- Reliable

Avoid:

- Overengineering
- Premature ML complexity
- Heavy infrastructure before need

---

## Success Metric

During demo:

- Wallet → Score instantly
- Output is clear
- Insight is understandable
- No failures

---

## Implementation Status

- Data ingestion: COMPLETE
- Scoring engine: COMPLETE
- API layer: COMPLETE
- Suggestions: COMPLETE
- X402 payments: COMPLETE
- AI augmentation: PARTIAL (pattern detection deferred)

---

FluxID backend is now:

> A scoring engine today  
> A financial intelligence layer tomorrow
