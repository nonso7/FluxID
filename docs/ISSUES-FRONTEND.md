
# Frontend Issues - FluxID

This document tracks UI/UX and integration tasks for the FluxID dashboard.

Core Principle:
The UI must make one thing obvious in under 3 seconds:

> “This wallet has a trust score.”

Everything else supports that.

---

## Phase 1: Foundation

### Issue #FE-1: Project Scaffold & Theme

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Critical  

**Description:** Initialize Next.js app with FluxID branding focused on clarity and minimalism.

**Tasks:**

- [ ] Configure `tailwind.config.ts` (dark mode focus)
- [ ] Setup `globals.css` (clean, minimal palette — avoid visual clutter)
- [ ] Define design tokens (spacing, typography, colors)
- [ ] Implement base `Layout` (no heavy sidebar — keep it simple)
- [ ] Ensure mobile-first structure from start

---

### Issue #FE-2: Freighter Wallet Integration

**Category:** [INTEGRATION]  
**Status:** PENDING  
**Priority:** Critical  

**Description:** Handle wallet connection globally.

**Tasks:**

- [ ] Create `FreighterContext`
- [ ] Implement connect/disconnect logic
- [ ] Auto-reconnect on refresh
- [ ] Display connected wallet address (truncated)
- [ ] Handle “wallet not installed” state cleanly

---

## Phase 2: Core Experience (Score First)

### Issue #FE-3: Wallet Connection Flow

**Category:** [UI/INTEGRATION]  
**Status:** PENDING  
**Priority:** High  

**Description:** Smooth wallet connection experience.

**Tasks:**

- [ ] Prominent “Connect Wallet” CTA (centered on first load)
- [ ] Detect Freighter wallet
- [ ] Display wallet address after connection
- [ ] Optional: show basic balance (keep minimal)
- [ ] Loading state during connection

---

### Issue #FE-4: Liquidity Score Display (MOST IMPORTANT)

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Critical  

**Description:** The main product moment — must be instantly clear.

**Tasks:**

- [ ] Fetch transaction history from Horizon
- [ ] Integrate rule-based scoring engine
- [ ] Display score prominently (center of screen)
- [ ] Large typography (dominant visual element)
- [ ] Optional: circular gauge OR bold numeric display (prefer clarity over fancy UI)
- [ ] Label clearly: “Liquidity Score”

**Success Criteria:**

User understands their score in under 3 seconds.

---

### Issue #FE-5: Risk Indicator

**Category:** [UI]  
**Status:** PENDING  
**Priority:** High  

**Description:** Simple risk classification tied to score.

**Tasks:**

- [ ] Display risk badge:
  - Low (green)
  - Medium (yellow)
  - High (red)
- [ ] Position near score (not separate)
- [ ] Keep explanation minimal (no overload)

---

## Phase 3: Supporting Insights (Lightweight)

### Issue #FE-6: Transaction Flow Chart

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Simple visualization of money flow.

**Tasks:**

- [ ] Install `recharts`
- [ ] Create `FlowChart` component
- [ ] Display last 30 days activity
- [ ] Show inflow vs outflow
- [ ] Keep chart simple (no complex interactions)

---

### Issue #FE-7: Flow Summary

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Lightweight supporting stats.

**Tasks:**

- [ ] Total inflow (30 days)
- [ ] Total outflow (30 days)
- [ ] Transaction count
- [ ] Keep layout minimal (avoid dashboard clutter)

---

## Phase 4: Suggestions (Explain the Score)

### Issue #FE-8: Actionable Recommendations

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Provide simple behavioral insights.

**Tasks:**

- [ ] Rule-based suggestion engine
- [ ] Display 1–2 suggestions max (do NOT overload)
- [ ] Use clear, human language

**Examples:**

- “Your spending is inconsistent — consider stabilizing outflows.”
- “You receive funds regularly — consider saving a fixed portion.”

---

## Phase 5: UX Polish (Demo Critical)

### Issue #FE-9: Empty & Error States

**Category:** [ERROR]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Handle edge cases cleanly.

**Tasks:**

- [ ] No transaction history → show friendly message
- [ ] Network errors → retry UI
- [ ] Wallet not connected → clear CTA state

---

### Issue #FE-10: Loading States

**Category:** [UX]  
**Status:** PENDING  
**Priority:** High  

**Description:** Smooth transitions during data fetch.

**Tasks:**

- [ ] Skeleton loader for score
- [ ] Loading indicator during transaction fetch
- [ ] Prevent UI flicker

---

### Issue #FE-11: Responsive Design

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Ensure mobile-first usability.

**Tasks:**

- [ ] Optimize for small screens
- [ ] Ensure score remains dominant on mobile
- [ ] Test on multiple device sizes

---

## Final UX Goal

The product should feel like:

- One screen
- One idea
- One insight

User flow:

Connect wallet → See score → Understand instantly

---

## What to Avoid

- Too many charts  
- Overly complex UI  
- Multiple competing sections  
- Anything that distracts from the score  

---

## Success Metric (Hackathon Focus)

A judge should:

- Understand the product in 3 seconds  
- See the score immediately  
- Follow the demo without confusi
