# FluxID API Documentation

Welcome to the FluxID technical documentation. Our APIs enable developers, institutions, and AI agents to leverage real-time liquidity intelligence on the Stellar network.

---

## 1. [Wallet Intelligence API](./wallet-api.md)
**Turn any wallet into a financial identity.**
Get trust scores, risk levels, and AI-generated behavior insights for individual Stellar addresses.
- Score generation (0-100)
- Historical behavior tracking
- On-chain verification (Soroban)
- Agentic AI (X402) payments

## 2. [Protocol Intelligence API](./protocol-api.md)
**Monitor and manage entire ecosystems.**
Aggregate health metrics, behavior-based segmentation, and early warning systems for multi-wallet portfolios.
- Network health monitoring
- Behavior-based cohort segmentation
- Real-time risk alerts
- Portfolio heatmap analysis

---

## Getting Started

### API Base URL
- **Production**: `https://api.fluxid.vercel.app` (Replace with actual if different)
- **Local Dev**: `http://localhost:3001`

### Authentication
Currently, FluxID uses address-based analysis. For Agentic AI flows, use the [X402 Payment Required](./wallet-api.md#4-agentic-ai-x402) protocol to access premium scoring data.

### Support
For integration support or custom institutional requirements, reach out to the FluxID core team.
