# FluxID Smart Contract Deployment Guide

This guide covers how to build and deploy the FluxID Soroban smart contract to Stellar networks.

## Prerequisites

1. **Rust toolchain** - Install via: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. **Soroban CLI** - Install via: `cargo install soroban-cli`
3. **Stellar wallet** - Funded account on target network (Testnet/Mainnet)

### Install Dependencies

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Soroban CLI
cargo install soroban-cli --locked

# Verify installation
soroban --version
```

## Networks

| Network | RPC URL | Friendbot |
|---------|---------|-----------|
| Testnet | https://horizon-testnet.stellar.org | https://friendbot.stellar.org |
| Mainnet | https://horizon.stellar.org | N/A |

## Build Contract

```bash
cd smartcontract
cargo build --target wasm32-unknown-unknown --release
```

Output: `smartcontract/target/wasm32-unknown-unknown/release/liquidity_identity.wasm`

## Deploy to Testnet

### 1. Generate Keys (if needed)

```bash
# Create admin key pair
soroban keys generate --global fluxid-admin --network testnet

# Or use existing secret key
# Export: export SOROBAN_SECRET_KEY="S..."
```

### 2. Fund Account

```bash
# Get public key
soroban keys address fluxid-admin

# Fund from friendbot (testnet only)
curl -X GET "https://friendbot.stellar.org?addr=G..."
```

### 3. Deploy Contract

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/liquidity_identity.wasm \
  --source fluxid-admin \
  --network testnet
```

This returns a **Contract ID** (starts with `C...`). Save this!

**Example output:**
```
CBPJWSH2POVRFIZ3D5P4DP4NFQ3V7TIEJEP3FH2UR5ES4BKM7VXZ3V5
```

### 4. Initialize Contract

```bash
# Replace CONTRACT_ID with your contract address
# Replace ADMIN_ADDRESS with your wallet address

soroban contract invoke \
  --id CONTRACT_ID \
  --source fluxid-admin \
  --network testnet \
  -- init \
  --admin ADMIN_ADDRESS \
  --network testnet
```

## Deploy to Mainnet

### 1. Setup Keys

```bash
soroban keys generate --global fluxid-admin-mainnet --network mainnet
```

### 2. Fund Account

Mainnet requires XLM from an exchange. Buy XLM and send to your public key.

### 3. Deploy

```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/liquidity_identity.wasm \
  --source fluxid-admin-mainnet \
  --network mainnet
```

### 4. Initialize

```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --source fluxid-admin-mainnet \
  --network mainnet \
  -- init \
  --admin ADMIN_ADDRESS \
  --network mainnet
```

## Interact with Contract

### Set Score (Admin only)

```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --source fluxid-admin \
  --network testnet \
  -- set_score \
  --admin ADMIN_ADDRESS \
  --wallet TARGET_WALLET \
  --score 85 \
  --risk "Low"
```

### Get Score (Anyone)

```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --network testnet \
  -- get_score \
  --wallet TARGET_WALLET
```

### Get Wallet Info

```bash
soroban contract invoke \
  --id CONTRACT_ID \
  --network testnet \
  -- get_wallet_info \
  --wallet TARGET_WALLET
```

## Quick Deploy (One-liner)

```bash
# Testnet
cd smartcontract && \
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/liquidity_identity.wasm --source fluxid-admin --network testnet
```

## Environment Variables

```bash
export SOROBAN_RPC_URL="https://horizon-testnet.stellar.org"
export SOROBAN_NETWORK="testnet"
export SOROBAN_SECRET_KEY="S..."  # Your secret key
```

## Troubleshooting

### "Transaction simulation failed"
- Increase ledger bandwidth: Add `--sim-bands 100`

### "Insufficient balance"
- Fund your account with more XLM

### "Contract already initialized"
- The contract was already initialized. Use existing Contract ID.

### "WASM not found"
- Run: `cargo build --target wasm32-unknown-unknown --release`

## Contract Addresses (Deployed)

| Network | Contract ID | Admin | Status |
|---------|-------------|-------|--------|
| Testnet | `C...` | `G...` | DEPLOYED |
| Mainnet | TBD | TBD | PENDING |

Update this table after deployment!
