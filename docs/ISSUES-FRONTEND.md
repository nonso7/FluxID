# Frontend Issues - FluxID

This document tracks UI/UX and integration tasks for the FluxID dashboard.

Core Principle:
The UI must make one thing obvious in under 3 seconds:

> "This wallet has a trust score."

Everything else supports that.

---

## Phase 1: Foundation

### Issue #FE-1: Project Scaffold & Theme

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Critical  

**Description:** Initialize Next.js app with FluxID branding focused on clarity and minimalism.

**Tasks:**

- [x] Configure `tailwind.config.ts` (dark mode focus)
- [x] Setup `globals.css` (clean, minimal palette)
- [x] Define design tokens (spacing, typography, colors)
- [x] Implement base `Layout`
- [x] Ensure mobile-first structure from start

---

### Issue #FE-2: Freighter Wallet Integration

**Category:** [INTEGRATION]  
**Status:** COMPLETED  
**Priority:** Critical  

**Description:** Handle wallet connection globally.

**Tasks:**

- [x] Create `FreighterContext`
- [x] Implement connect/disconnect logic
- [x] Auto-reconnect on refresh
- [x] Display connected wallet address (truncated)
- [x] Handle "wallet not installed" state cleanly

---

## Phase 2: Core Experience (Score First)

### Issue #FE-3: Wallet Connection Flow

**Category:** [UI/INTEGRATION]  
**Status:** COMPLETED  
**Priority:** High  

**Description:** Smooth wallet connection experience.

**Tasks:**

- [x] Prominent "Connect Wallet" CTA
- [x] Detect Freighter wallet
- [x] Display wallet address after connection
- [x] Loading state during connection

---

### Issue #FE-4: Liquidity Score Display

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Critical  

**Description:** The main product moment — must be instantly clear.

**Tasks:**

- [x] Fetch transaction history from Horizon
- [x] Integrate rule-based scoring engine
- [x] Display score prominently (center of screen)
- [x] Large typography (dominant visual element)
- [x] Circular gauge display
- [x] Label clearly: "Liquidity Score"

---

### Issue #FE-5: Risk Indicator

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** High  

**Description:** Simple risk classification tied to score.

**Tasks:**

- [x] Display risk badge: Low (green), Medium (yellow), High (red)
- [x] Position near score
- [x] Keep explanation minimal

---

## Phase 3: Supporting Insights

### Issue #FE-6: Transaction Flow Chart

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Simple visualization of money flow.

**Tasks:**

- [ ] Create FlowChart component
- [ ] Display last 30 days activity
- [ ] Show inflow vs outflow

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

---

## Phase 4: Suggestions

### Issue #FE-8: Actionable Recommendations

**Category:** [UI]  
**Status:** COMPLETED  
**Priority:** Medium  

**Description:** Provide simple behavioral insights.

**Tasks:**

- [x] Rule-based suggestion engine
- [x] Display 1-2 suggestions max
- [x] Use clear, human language

---

## Phase 5: UX Polish

### Issue #FE-9: Empty & Error States

**Category:** [ERROR]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Handle edge cases cleanly.

**Tasks:**

- [ ] No transaction history message
- [ ] Network errors retry UI
- [ ] Wallet not connected state

---

### Issue #FE-10: Loading States

**Category:** [UX]  
**Status:** PENDING  
**Priority:** High  

**Description:** Smooth transitions during data fetch.

**Tasks:**

- [ ] Skeleton loader for score
- [ ] Loading indicator

---

### Issue #FE-11: Responsive Design

**Category:** [UI]  
**Status:** PENDING  
**Priority:** Medium  

**Description:** Ensure mobile-first usability.

**Tasks:**

- [ ] Optimize for small screens
- [ ] Test on multiple device sizes

---

## Success Metrics

- Connect wallet -> See score -> Understand instantly
- Score displayed prominently in under 3 seconds
- Clean, minimal UI focused on one idea