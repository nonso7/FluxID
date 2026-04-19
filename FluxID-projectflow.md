# FluxID Project Flow

A comprehensive guide to FluxID's architecture, request flow, and team responsibilities.

---

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌──────────────────┐
│   Frontend  │────▶│   Backend   │────▶│ Stellar Horizon  │
│  (Next.js)  │     │  (Node.js)  │     │  (Data Source)   │
└─────────────┘     └─────────────┘     └──────────────────┘
       ▲                   │
       │                   ▼
       │            ┌─────────────┐
       │            │   Scoring   │
       │            │   Engine    │
       │            └─────────────┘
       │                   │
       │                   ▼
       │            ┌────────────────────┐
       │            │  Smart Contract     │
       │            │    (Optional)       │
       │            └────────────────────┘
       │                   │
       └───────────────────┘
              Response
```

---

## Core Product Principle

FluxID must be able to score **ANY wallet address** without requiring ownership.

This enables:

- Lending platforms to evaluate borrowers
- Marketplaces to assess buyers
- Remittance apps to analyze recipients
- AI agents to query wallet trust

Wallet connection is only used for:

- Convenience (auto-fill)
- Future identity features

**NOT for access control.**

---

## Main Demo Flow

### Step 1: User Enters Wallet Address (Frontend)

- User pastes or types a Stellar wallet address
- Clicks **Analyze Wallet**
- Result: `walletAddress = "GABC123...XYZ"`

### Optional: User Connects Wallet (Convenience Only)

- User connects Freighter wallet
- Address is auto-filled
- No authorization required

> Wallet connection is NOT required for scoring

---

### Step 2: Frontend Calls Backend

```http
GET /score/{wallet}
```

### Step 3: Backend Fetches Transactions

Fetch from Stellar Horizon:

```
GET https://horizon.stellar.org/accounts/{wallet}/payments
```

**Extract:**

- Amount
- Asset type (XLM, USDC, tokens)
- Direction (inflow/outflow)
- Timestamp

---

### Step 4: Data Normalization

- Convert all assets to a common unit (USD equivalent)
- Normalize amounts across tokens (XLM, USDC, etc.)
- Classify:
  - Inflow vs Outflow
  - External vs Internal transfers

> Ensures consistent and fair scoring across all wallets

**Note:** Use price feeds or static conversion for MVP

---

### Step 5: Backend Runs Scoring Engine

**Input:**
```json
{ "transactions": [...] }
```

**Processing:**

- Inflow consistency → Are payments regular?
- Outflow stability → Is spending controlled?
- Frequency → Is wallet active?

---

### Step 6 (Optional): Write to Smart Contract

Call Soroban contract:
```
set_score(wallet, score)
```

**Purpose:**

- Demonstrate on-chain capability
- Not required for core logic

---

### Step 7: Backend Responds

```json
{
  "score": 82,
  "risk": "Low",
  "breakdown": {
    "inflow": 30,
    "outflow": 28,
    "frequency": 24
  },
  "factors": [
    "Stable income pattern",
    "Controlled spending behavior"
  ],
  "insight": "Consistent inflow and stable spending behavior.",
  "suggestions": [
    "Consider increasing savings rate"
  ]
}
```

---

### Step 8: Frontend Renders UI

- Large score (primary focus)
- Risk badge (color-coded)
- Key factors (short and clear)
- Score breakdown (bars or chart)
- Flow visualization (inflow vs outflow)
- Insight (1 sentence)
- Suggestions (1–2 actions)

---

### Edge Case Handling

If wallet has insufficient data:

```json
{
  "score": 10,
  "risk": "High",
  "insight": "Insufficient transaction history to assess reliability",
  "suggestions": [
    "Use wallet more consistently to build a reliable score"
  ]
}
```

---

## UX Models

### Primary (Infrastructure Mode)
```
[ Enter Wallet Address ] → [ Analyze Wallet ] → [ Results ]
```

### Secondary (User Mode)
```
[ Connect Wallet ] → [ Auto-fill ] → [ Analyze ]
```

---

## Team Responsibilities

### Frontend
- Accept wallet input
- Call `/score/{wallet}`
- Display:
  - Score
  - Risk
  - Breakdown
  - Factors
  - Suggestions

> No business logic

### Backend
- Fetch transactions
- Normalize data
- Compute score
- Generate explanations
- Return structured response

> This is the core intelligence layer

### Smart Contract (Optional)
- Store score
- Return score

> Credibility layer only

---

## AI Architecture

### Layer 1 — Core (Rule-Based)

Must be:

- Deterministic
- Fast
- Explainable

Handles:

- Score (0–100)
- Risk (Low / Medium / High)
- Breakdown (inflow, outflow, frequency)

> Same wallet must always return the same result

---

### Layer 2 — AI Augmentation

Handles:

- Insight wording
- Explanation clarity
- Suggestion phrasing

Constraints:

- Must NOT change:
  - Score
  - Risk
  - Breakdown

---

## Response Format

```json
{
  "score": 34,
  "risk": "High",
  "breakdown": {
    "inflow": 10,
    "outflow": 12,
    "frequency": 12
  },
  "factors": [
    "Irregular income pattern",
    "High spending volatility"
  ],
  "insight": "This wallet shows inconsistent income and unstable spending behavior.",
  "suggestions": [
    "Maintain more consistent inflow",
    "Reduce large irregular withdrawals"
  ]
}
```

---

## Final Rules

1. Primary flow = Enter wallet → Analyze
2. Wallet connection is optional
3. Backend owns all scoring logic
4. Output must include:
   - Score
   - Risk
   - Breakdown
   - Factors
   - Suggestions
5. UI must answer instantly:
   - What is the score?
   - Why?
   - What should I do?
6. System must be deterministic
7. No overengineering for MVP

---

## Common Mistakes

| Mistake | Problem |
|---------|---------|
| Scoring in smart contract | Slows development |
| Frontend computing logic | Breaks architecture |
| Overbuilding API | Only one endpoint needed |

---

## AI Implementation Options

### Fast (Recommended)

- OpenAI
- Claude

**Use for:**

- Insight generation
- Explanation clarity
- Suggestions

### Open Source (Optional)

- `mistralai/Mistral-7B-Instruct`
- `meta-llama/Llama-3-8B-Instruct`

> Heavier setup — not needed for MVP

### Not Recommended

- Custom ML scoring models
- Deep learning pipelines

---

## Future: Agentic Access (X402)

FluxID can support AI agents querying wallet scores.

**Future possibilities:**

- Payment-gated API (X402)
- Autonomous decision systems

> Not required for MVP  
> Do not block development

---

## Summary

FluxID flow:

```
Wallet → Transactions → Normalization → Scoring → Explanation → Decision
```

This document defines the source of truth for how FluxID works.

---

## Final Reality Check

This version is now:

- Clear enough for **your frontend guy to build without asking questions**
- Structured enough for **backend to not guess logic**
- Simple enough for **demo clarity**
- Strong enough for **judges / reviewers**
