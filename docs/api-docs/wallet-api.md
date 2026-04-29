# FluxID Wallet Intelligence API

Turn any Stellar wallet into a real-time financial identity. Use these endpoints to assess individual wallet reliability, fetch historical behavior, or verify scores on-chain.

---

## 1. Get Wallet Score
`GET /wallet/:accountId`

Analyzes the target wallet and returns a deterministic trust score (0-100), risk level, liquidity metrics, and an AI-generated behavioral insight.

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `accountId` | `string` | **Path**. The Stellar public key (starts with G). |
| `network` | `string` | **Query**. `testnet` or `mainnet`. Defaults to `testnet`. |
| `refresh` | `boolean` | **Query**. Force a re-calculation if `true`. Defaults to `false` (cached). |
| `sync` | `boolean` | **Query**. If `true`, attempts to sync the score to Soroban. Defaults to `false`. |

### Response
```json
{
  "success": true,
  "data": {
    "accountId": "G...",
    "score": 82,
    "risk": "Low",
    "metrics": {
      "transactionCount": 145,
      "inflowScore": 88,
      "outflowScore": 76,
      "frequencyScore": 92
    },
    "explanation": {
      "insight": "Consistent incoming payments with stable outflow patterns.",
      "suggestions": ["Maintain current balance stability"]
    }
  }
}
```

---

## 2. Wallet History
`GET /wallet/:accountId/history`

Retrieves the historical score progression for a specific wallet.

### Parameters
| Name | Type | Description |
| :--- | :--- | :--- |
| `accountId` | `string` | **Path**. The Stellar public key. |
| `limit` | `number` | **Query**. Number of entries to return (max 1000). |
| `since` | `number` | **Query**. Unix timestamp to filter entries. |

---

## 3. On-Chain Sync
`POST /wallet/:accountId/sync`

Publishes the current liquidity score to the FluxID Soroban contract. Useful for DeFi protocols that require on-chain verification.

### Body
```json
{
  "network": "testnet"
}
```

---

## 4. Agentic AI (X402)
`GET /paid/wallet/:accountId`

Designed for AI agents. Returns an `HTTP 402 Payment Required` challenge. Once the agent pays the required XLM fee on-chain, this endpoint returns the full score and AI insight.

**Flow:**
1. Agent calls endpoint → Receives 402 + `requestId` + `payTo` address.
2. Agent pays via Stellar.
3. Agent calls endpoint again with `?requestId=...` → Receives data.

---

## Developer Tools (MCP)

FluxID supports the **Model Context Protocol (MCP)**. If you are integrating with an LLM (like Claude), you can expose the `analyze_wallet` tool to let the AI perform financial due diligence on-chain.
