# 🎯 FluxID UI Wireframe (Demo-Optimized)

---

## 🖥️ Screen 1: Landing / Input State

### Goal:

Immediately communicate value + allow instant interaction

## Layout (Centered, Minimal)

| |
| FLUXID LOGO |
| |
| Turn wallet activity into a |
| simple financial trust score |
| |
| [ Enter Wallet Address ] |
| |
| [ Analyze Wallet ] |
| |
| (Optional: Connect Wallet to auto-fill) |
| |

---

### Notes:

- Address input is PRIMARY (not wallet connect)
- One clear action: **Analyze Wallet**
- Wallet connect = optional convenience only
- No navbar, no distractions
- Clean spacing, strong typography

---

## ⚡ Screen 2: Loading State

### Goal:

Make system feel intelligent and alive

---

| Analyzing wallet... |
| |
| [ animated loader / dots ] |
| |
| Fetching transaction history |
| Computing liquidity score |
| Evaluating behavior patterns |

---

### Notes:

- Keep under 2–3 seconds
- Messages rotate (feels dynamic)
- Builds trust in the system

---

## 🧠 Screen 3: MAIN DASHBOARD (CORE MOMENT)

### Goal:

User instantly understands:

👉 “This wallet is trustworthy (or not)”

---

## | Wallet: GABCD...X9K2 |

              82
        LIQUIDITY SCORE

         🟢 LOW RISK

---

Your wallet shows consistent inflow
and stable spending behavior.

---

Suggestion:
Consider saving 20% of incoming funds
to improve long-term stability.

---

## 🔥 Design Rules (NON-NEGOTIABLE)

### 1. Score is KING

- Largest element on screen
- Centered
- Nothing competes with it

### 2. Risk is SECOND

- Color-coded:
  - Green = Low
  - Yellow = Medium
  - Red = High
- Immediately visible

### 3. Insight = ONE SENTENCE

- No paragraphs
- No jargon

Example:

- “Your income flow is consistent”
- “Your spending is highly unstable”

### 4. Suggestion = ONE ACTION

- Clear and actionable
- No multiple cards

---

## 📊 Screen 4: Supporting Insights (Below Fold)

### Goal:

Add credibility WITHOUT clutter

---

### Score Breakdown

- Inflow Consistency: 40%
- Outflow Stability: 30%
- Transaction Frequency: 30%

---

### Flow Overview (30 days)

[ simple line / area chart ]

---

Inflow: $2,400  
Outflow: $1,950  
Transactions: 34  
Avg Transaction: $70

---

### Key Risk Factors

- Irregular income pattern
- High spending spikes

---

### Notes:

- This section supports the score
- Not required for understanding
- Avoid overloading visuals

---

## ❌ What NOT to Build

Do NOT:

- Add multiple dashboards
- Add tab-heavy navigation (Analytics, Security, etc.)
- Add complex filters
- Add raw transaction tables
- Add unnecessary charts

👉 Simplicity wins the demo.

---

## 🎬 Demo Flow (What Judges See)

### Step 1:

Open app  
→ Clean input screen  
→ Enter wallet address

### Step 2:

Click "Analyze"  
→ Loading state appears

### Step 3 (WOW MOMENT):

Score appears:

82 — Low Risk

👉 Instant understanding:
“This is a financial trust score”

---

### Step 4:

You say:

“We turn wallet behavior into a simple trust score.”

---

### Step 5:

Scroll slightly → show flow chart

“And this is how we derive it from transaction behavior.”

---

DONE.

---

## 🧩 Component Breakdown

### Core Components

- AddressInput ⭐
- AnalyzeButton
- ScoreDisplay ⭐ (most important)
- RiskBadge
- InsightText
- SuggestionCard
- ScoreBreakdown
- FlowChart
- FactorsList

---

## 🏗️ Layout Structure

<App>
  <MainContainer>
    <AddressInput />
    <AnalyzeButton />

    <ScoreDisplay />
    <RiskBadge />
    <InsightText />
    <SuggestionCard />

    <ScoreBreakdown />
    <FlowChart />
    <FactorsList />

  </MainContainer>
</App>

---

## 🧠 Key Principle

If the user only sees:

- Score
- Risk
- One sentence

👉 The product must still make complete sense.

Everything else is supporting.
