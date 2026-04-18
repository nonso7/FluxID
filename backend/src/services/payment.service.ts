import { randomBytes } from 'crypto';
import { Keypair } from '@stellar/stellar-sdk';
import type { NetworkType } from '../config/stellar.config.js';
import { appConfig } from '../config/app.config.js';
import type { PaymentRequest, PaymentStatus } from '../types/payment.types.js';
import { HorizonService, createHorizonService } from './horizon.service.js';
import { logger } from '../utils/logger.js';

const MEMO_PREFIX = 'FLX-';

function resolveReceiveAddress(): string {
  if (appConfig.payment.receiveAddress) return appConfig.payment.receiveAddress;
  const adminSecret = process.env.ADMIN_SECRET_KEY;
  if (adminSecret) {
    try {
      return Keypair.fromSecret(adminSecret).publicKey();
    } catch (err) {
      logger.warn({ err: (err as Error).message }, 'ADMIN_SECRET_KEY invalid; cannot derive receive address');
    }
  }
  return '';
}

class PaymentService {
  private requests: Map<string, PaymentRequest> = new Map();
  private receiveAddress: string;
  private amountXLM: number;
  private ttlSeconds: number;

  constructor() {
    this.receiveAddress = resolveReceiveAddress();
    this.amountXLM = appConfig.payment.amountXLM;
    this.ttlSeconds = appConfig.payment.requestTtlSeconds;
  }

  isConfigured(): boolean {
    return Boolean(this.receiveAddress);
  }

  getReceiveAddress(): string {
    return this.receiveAddress;
  }

  getAmountXLM(): number {
    return this.amountXLM;
  }

  createRequest(accountId: string, network: NetworkType): PaymentRequest {
    if (!this.isConfigured()) {
      throw new Error('Payment service not configured: set PAYMENT_RECEIVE_ADDRESS or ADMIN_SECRET_KEY');
    }

    // 8 hex chars → memo "FLX-xxxxxxxx" (12 chars) — well under Stellar 28-char text memo limit
    const requestId = randomBytes(4).toString('hex');
    const memo = `${MEMO_PREFIX}${requestId}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.ttlSeconds * 1000);

    const request: PaymentRequest = {
      requestId,
      accountId,
      network,
      payTo: this.receiveAddress,
      amountXLM: this.amountXLM,
      memo,
      createdAt: now,
      expiresAt,
      status: 'pending',
    };

    this.requests.set(requestId, request);
    this.pruneExpired();
    logger.info({ requestId, accountId, network }, 'Payment request created');
    return request;
  }

  get(requestId: string): PaymentRequest | null {
    const req = this.requests.get(requestId);
    if (!req) return null;
    if (req.status === 'pending' && req.expiresAt < new Date()) {
      req.status = 'expired';
    }
    return req;
  }

  async verify(requestId: string): Promise<{ status: PaymentStatus; txHash?: string }> {
    const req = this.get(requestId);
    if (!req) return { status: 'expired' };
    if (req.status === 'paid') return { status: 'paid', txHash: req.txHash };
    if (req.status === 'expired') return { status: 'expired' };

    const horizon: HorizonService = createHorizonService(req.network);
    let transactions;
    try {
      transactions = await horizon.getAccountTransactions(req.payTo, 50);
    } catch (err) {
      logger.warn({ err: (err as Error).message, requestId }, 'Horizon lookup failed during verify');
      return { status: 'pending' };
    }

    const match = transactions.find(
      (tx) =>
        tx.successful &&
        tx.memo_type === 'text' &&
        tx.memo === req.memo &&
        new Date(tx.created_at).getTime() >= req.createdAt.getTime() - 5000
    );

    if (!match) return { status: 'pending' };

    const txHash = match.hash || match.id;
    const ops = await horizon.getTransactionOperations(txHash);
    const paid = ops.some(
      (op) =>
        op.type === 'payment' &&
        op.asset_type === 'native' &&
        op.to === req.payTo &&
        parseFloat(op.amount || '0') >= req.amountXLM
    );

    if (!paid) return { status: 'pending' };

    req.status = 'paid';
    req.txHash = txHash;
    logger.info({ requestId, txHash, accountId: req.accountId }, 'Payment verified');
    return { status: 'paid', txHash };
  }

  private pruneExpired(): void {
    const now = new Date();
    for (const [id, req] of this.requests.entries()) {
      // Keep paid requests around for their TTL; drop expired ones older than 2x TTL
      const stale = req.expiresAt.getTime() + this.ttlSeconds * 1000 < now.getTime();
      if (stale) this.requests.delete(id);
    }
  }
}

export const paymentService = new PaymentService();
