# FluxID Smart Contract Deployment Guide

This guide covers how to build and deploy the FluxID Soroban smart contract to Stellar networks.

## Prerequisites

1. **Rust toolchain** - Install via: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. **Stellar CLI** - Download from: https://github.com/stellar/stellar-cli/releases
3. **Stellar wallet** - Funded account on target network (Testnet/Mainnet)

### Install CLI

```bash
# Download
cd /tmp
curl -L -o stellar-cli.tar.gz "https://github.com/stellar/stellar-cli/releases/download/v26.0.0/stellar-cli-26.0.0-x86_64-unknown-linux-gnu.tar.gz"
tar -xzf stellar-cli.tar.gz

# Verify
./stellar --version
```

## Networks

| Network | RPC URL | Friendbot |
|---------|--------|-----------|
| Testnet | https://rpc.lightsail.network/ | https://friendbot.stellar.org |
| Mainnet | https://rpc.lightsail.network/ | N/A |

**Important:** Use `wasm32v1-none` target (not `wasm32-unknown-unknown`) due to Rust compiler compatibility.

## Build Contract

```bash
cd smartcontract

# Add wasm32v1-none target (required for Soroban)
rustup target add wasm32v1-none

# Build
cargo build --target wasm32v1-none --release
```

Output: `smartcontract/target/wasm32v1-none/release/liquidity_identity.wasm`

## Deploy to Testnet

### 1. Setup Identity

```bash
# Generate or add your key
/tmp/stellar keys add fluxid-admin
# Enter secret key when prompted
```

### 2. Fund Account (Testnet only)

Open in browser:
```
https://friendbot.stellar.org?addr=GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX
```

### 3. Deploy Contract

```bash
/tmp/stellar contract deploy \
  --wasm target/wasm32v1-none/release/liquidity_identity.wasm \
  --source fluxid-admin \
  --network testnet \
  --rpc-url "https://rpc.lightsail.network/" \
  --network-passphrase "Test SDF Network ; September 2015"
```

Returns **Contract ID** (starts with `C...`). Save this!

### 4. Initialize Contract

```bash
# Replace CONTRACT_ID with your contract ID
/tmp/stellar contract invoke \
  --id CONTRACT_ID \
  --source fluxid-admin \
  --network testnet \
  --rpc-url "https://rpc.lightsail.network/" \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- init \
  --admin GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX \
  --network testnet
```

## Deploy to Mainnet

### 1. Setup Identity

```bash
/tmp/stellar keys add fluxid-admin
# Enter your mainnet secret key
```

### 2. Fund Account

Buy XLM from an exchange and send to your admin address.

### 3. Deploy Contract

```bash
/tmp/stellar contract deploy \
  --wasm target/wasm32v1-none/release/liquidity_identity.wasm \
  --source fluxid-admin \
  --network mainnet \
  --rpc-url "https://rpc.lightsail.network/" \
  --network-passphrase "Public Global Stellar Network ; September 2015"
```

### 4. Initialize Contract

```bash
/tmp/stellar contract invoke \
  --id CONTRACT_ID \
  --source fluxid-admin \
  --network mainnet \
  --rpc-url "https://rpc.lightsail.network/" \
  --network-passphrase "Public Global Stellar Network ; September 2015" \
  -- init \
  --admin GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX \
  --network mainnet
```

## Interact with Contract

### Set Score (Admin only)

```bash
/tmp/stellar contract invoke \
  --id CONTRACT_ID \
  --source fluxid-admin \
  --network testnet \
  --rpc-url "https://rpc.lightsail.network/" \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- set_score \
  --admin GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX \
  --wallet TARGET_WALLET \
  --score 85 \
  --risk "Low"
```

### Get Score (Anyone)

```bash
/tmp/stellar contract invoke \
  --id CONTRACT_ID \
  --network testnet \
  --rpc-url "https://rpc.lightsail.network/" \
  --network-passphrase "Test SDF Network ; September 2015" \
  -- get_score \
  --wallet TARGET_WALLET
```

## Troubleshooting

### "reference-types not enabled"
- Use `wasm32v1-none` target instead of `wasm32-unknown-unknown`

### "Invalid URL"
- Always specify `--rpc-url` explicitly

### "transaction simulation failed"
- Ensure correct network passphrase

### "TxInsufficientBalance"
- Fund your account with XLM

### "Account not found"
- You're trying to deploy to mainnet but account has no XLM

## RPC Providers ( alternatives)

If lightsail.network doesn't work, try:
- `https://rpc.ankr.com/stellar_soroban`
- `https://soroban-rpc.mainnet.stellar.gateway.fm`
- `https://stellar-soroban-public.nodies.app`

## Quick Reference

| Item | Value |
|------|-------|
| WASM Target | `wasm32v1-none` |
| Mainnet Passphrase | `Public Global Stellar Network ; September 2015` |
| Testnet Passphrase | `Test SDF Network ; September 2015` |
| RPC URL | `https://rpc.lightsail.network/` |
| Admin Address | `GBACI4PCHZQXZFAADCMG4TICARUDZAGF5CI3A4RPTD7SOSW2VPKLGDCX` |
