# Smart Contract Issues - FluxID

This document tracks the development tasks for FluxID Soroban smart contracts.

Core Principle:
Smart contracts are NOT the product.

They support one core function:

> Store and expose a wallet's trust score.

Keep contracts minimal, fast, and demo-ready.

---

## Phase 1: MVP Contract (Minimal & Functional)

### Issue #SC-1: Project Initialization

**Priority:** Critical  
**Status:** COMPLETED

**Description:** Setup basic Soroban contract structure.

**Tasks:**

- [x] Initialize `liquidity_identity` contract
- [x] Setup contract structure and modules
- [x] Configure build and deployment scripts
- [x] Use `wasm32v1-none` target for compatibility

---

### Issue #SC-2: Liquidity Score Storage

**Priority:** Critical  
**Status:** COMPLETED

**Description:** Store and retrieve liquidity scores for wallet addresses.

**Tasks:**

- [x] Define `DataKey` enum: `Score(Address)`, `LastUpdated(Address)`, `RiskLevel(Address)`
- [x] Implement `set_score(env, admin, wallet, score, risk)`
- [x] Implement `get_score(env, wallet) -> u32`
- [x] Implement `get_last_updated(env, wallet) -> Option<u64>`

**Evidence:** `smartcontract/contracts/liquidity_identity/src/lib.rs`

---

### Issue #SC-3: Risk Level Mapping (Optional On-Chain)

**Priority:** Medium  
**Status:** COMPLETED

**Description:** Map score to risk level.

**Tasks:**

- [x] `RiskLevel` enum: `Low`, `Medium`, `High`
- [x] Store risk alongside score via `RiskLevel(Address)` key
- [x] Expose `get_risk(env, wallet) -> Option<RiskLevel>`

Risk is computed off-chain (backend) and stored on-chain.

---

## Phase 2: Access Control (Lightweight)

### Issue #SC-4: Score Update Authorization

**Priority:** High  
**Status:** COMPLETED

**Description:** Restrict who can update scores.

**Tasks:**

- [x] `Admin` address stored in instance storage via `init`
- [x] `set_score` uses `require_auth` + stored-admin check
- [x] `transfer_admin` for future rotation

Single admin model — MVP-appropriate.

---

## Phase 3: Integration Layer (Demo Support)

### Issue #SC-5: Public Query Interface

**Priority:** High  
**Status:** COMPLETED

**Description:** Allow external apps to query scores.

**Tasks:**

- [x] `get_score(wallet)`
- [x] `get_risk(wallet)`
- [x] `get_wallet_info(wallet)` — score + risk + last_updated
- [x] `get_last_updated(wallet)`
- [x] `get_all_wallets_with_scores(wallets)` — batch query
- [x] Read functions use persistent storage and are read-optimized

---

## Phase 3.5: Off-Chain → On-Chain Sync (Agent Flow Support)

### Issue #SC-7: Backend Score Sync Hook

**Priority:** Medium  
**Status:** COMPLETED

**Description:** Allow backend (after payment + scoring) to persist results on-chain.

**Tasks:**

- [x] `set_score(admin, wallet, score, risk)` is admin-only and callable by the backend
- [x] Backend signs transactions using the admin key via `ContractService`
- [x] Triggered AFTER:
  - score is computed
  - payment is verified (see `GET /paid/score/:accountId?sync=true` in BK-11)
- [x] `LastUpdated` timestamp recorded on every `set_score` call

**Flow:**

Agent → `POST /paid/score/:wallet` → Backend verifies payment → Backend computes score → Backend calls `set_score` on contract.

**Evidence:** `backend/src/services/contract.service.ts`, `backend/src/routes/paid.routes.ts`.

---

### Issue #SC-8: Read Consistency (Fallback Source)

**Priority:** Low  
**Status:** COMPLETED

**Description:** Allow frontend or external apps to read score directly if needed.

**Tasks:**

- [x] `get_score(wallet)` is stable and fast (persistent storage read)
- [x] Returns `0` default when no score exists (no panic)
- [x] `get_wallet_info(wallet)` includes `last_updated` timestamp
- [x] `get_last_updated(wallet)` returns `Option<u64>` for fine-grained reads

**Evidence:** `lib.rs::get_score` returns `.unwrap_or(0)` when key missing; 10/10 tests pass including `test_get_nonexistent_score`.

Contract acts as the "verifiable source of truth"; backend remains the "real-time computation engine".

---

## Phase 4: Testing (Must Work Live)

### Issue #SC-6: Contract Testing

**Priority:** High  
**Status:** COMPLETED

**Description:** Ensure contract reliability.

**Tasks:**

- [x] Test score storage and retrieval (`test_set_and_get_score`)
- [x] Test unauthorized access rejection (admin-only `set_score`)
- [x] Test edge cases — no score returns 0, missing risk returns `None`
- [x] Test multiple wallet entries (`test_multiple_wallets`)
- [x] Test `transfer_admin`
- [x] Test `last_updated` timestamp recording
- [x] Test `get_wallet_info` happy + nonexistent paths

10/10 tests pass (`cargo test`).

---

## What We Are NOT Building (For MVP)

- ❌ No identity token (NFT) yet
- ❌ No complex analytics on-chain
- ❌ No historical tracking
- ❌ No multi-oracle system
- ❌ No heavy computation logic

---

## Post-Grant Expansion (Future — OmniFlow Level)

### 1. On-Chain Liquidity Identity Token
- Non-transferable identity token
- Represents wallet reliability over time
- Continuously updated based on behavior

### 2. Advanced On-Chain Risk Logic
- Deeper on-chain computation
- Verifiable on-chain scoring components

### 3. Multi-Oracle System
- Multiple trusted sources updating scores

### 4. Cross-Platform Identity Layer
- Extend identity beyond single wallet

### 5. Privacy Layer (ZK Future)
- Selective disclosure of score components

---

## Final Guideline

Contracts must be: Simple, Working, Demo-ready.  
Not: Complex, Overengineered, Incomplete.

## Success Metric

During demo:

- Score can be stored on-chain
- Score can be retrieved instantly
- Contract interaction does not fail

---

## Implementation Complete

All smart contract issues have been implemented and tested:

- Phase 1: MVP Contract (COMPLETE) — SC-1, SC-2, SC-3
- Phase 2: Access Control (COMPLETE) — SC-4
- Phase 3: Integration Layer (COMPLETE) — SC-5
- Phase 3.5: Off-Chain → On-Chain Sync (COMPLETE) — SC-7, SC-8
- Phase 4: Testing (COMPLETE) — SC-6 (10/10 tests passing)
