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
       │            │  Smart Contract    │
       │            │    (Optional)       │
       │            └────────────────────┘
       │                   │
       └───────────────────┘
              Response
```

---

## Main Demo Flow

### Step 1: User Connects Wallet (Frontend)
- **Trigger**: User clicks "Connect Wallet"
- **Frontend**: Uses Freighter wallet extension
- **Result**: `walletAddress = "GABC123...XYZ"`

### Step 2: Frontend Calls Backend
```http
GET /score/GABC123XYZ
```

### Step 3: Backend Fetches Transactions
- Backend → Stellar Horizon
- `GET https://horizon.stellar.org/accounts/{wallet}/payments`
- Extracts: Amount, Direction (inflow/outflow), Timestamp

### Step 4: Backend Runs Scoring Engine
**Input:**
```json
{ "transactions": [...] }
```

**Processing:**
- Inflow consistency → Are payments regular?
- Outflow stability → Is spending controlled?
- Frequency → Is wallet active?

**Output:**
```json
{
  "score": 82,
  "risk": "Low",
  "insight": "Consistent inflow and stable spending",
  "suggestion": "Consider saving a portion of incoming funds"
}
```

### Step 5 (OPTIONAL): Backend Writes to Smart Contract
- Only if implemented
- Backend → Soroban Contract: `set_score(wallet, 82)`
- **Why**: Proves on-chain capability

### Step 6: Backend Responds to Frontend
```json
{
  "score": 82,
  "risk": "Low",
  "insight": "Consistent inflow and stable spending",
  "suggestion": "Consider saving a portion of incoming funds"
}
```

### Step 7: Frontend Renders UI
- Big Score → 82
- Risk Badge → Low (Green)
- Insight → short sentence
- Suggest → one action

---

## UX Models

### Primary (Infrastructure)
```
[ Enter Wallet Address ] → [ Analyze Wallet ] → [ Results ]
```

### Secondary (Optional)
```
[ Connect Wallet ] → [ Auto-fill address ] → [ Analyze ]
```

---

## Team Responsibilities

### Frontend
- Connect wallet
- Call `/score/{wallet}`
- Display: Score, Risk, Insight, Suggestion
- No heavy logic here

### Backend
- Fetch transactions (Horizon)
- Compute score
- Return response
- **This is the brain**

### Smart Contract (Optional)
- Store score
- Return score
- **This is the credibility layer, not core logic**

---

## AI Architecture

### Layer 1 — CORE (Rule-Based)
Must stay deterministic:
- Score (0–100)
- Risk level (Low/Medium/High)
- Breakdown (inflow, outflow, frequency)

> This must NOT depend on AI models

### Layer 2 — AI Augmentation
AI models should handle:
- Insight generation (natural language)
- Risk reasoning explanation
- Pattern interpretation

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
  "ai_insight": "Spending spikes following irregular deposits indicate weak financial stability.",
  "suggestions": [
    "Maintain more consistent inflow",
    "Reduce large irregular withdrawals"
  ]
}
```

---

## Final Rules

1. Primary interaction = Enter wallet address → Analyze
2. Wallet connection is optional (auto-fill only)
3. Backend uses rule-based scoring (no AI models for logic)
4. Output must include: Score, Risk, Breakdown, Factors, Suggestions
5. Frontend must clearly answer:
   - What is the score?
   - Why is it that score?
   - What should I do?
6. X402 and AI agents are future-facing — not required for MVP

---

## Common Mistakes

| Mistake | Problem |
|---------|---------|
| Putting scoring logic in contract | Too complex, slows you down |
| Frontend calculating score | Breaks separation, messy |
| Overbuilding API | You only need ONE endpoint |

---

## Best Options

### 🟢 Fast + Reliable
Use OpenAI (GPT-4o) or Claude for:
- Insight generation
- Explanation rewriting
- Suggestions

### 🟡 Open Source Alternative
Use HuggingFace models:
- `mistralai/Mistral-7B-Instruct`
- `meta-llama/Llama-3-8B-Instruct`

> Heavier setup, not worth it for hackathon

### 🔴 Not Recommended
- Custom-trained ML models
- Deep learning scoring systems

---

## Future: Agentic Access (X402)

FluxID can support AI agents that autonomously query wallet scores.

Future integration may include:
- Payment-gated API access (X402)
- Autonomous agent decision-making

This enables AI systems to evaluate financial trust in real time.

> NOT REQUIRED FOR MVP — Do NOT block progress for it
