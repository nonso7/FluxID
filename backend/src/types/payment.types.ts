import type { NetworkType } from '../config/stellar.config.js';

export type PaymentStatus = 'pending' | 'paid' | 'expired';

export interface PaymentRequest {
  requestId: string;
  accountId: string;
  network: NetworkType;
  payTo: string;
  amountXLM: number;
  memo: string;
  createdAt: Date;
  expiresAt: Date;
  status: PaymentStatus;
  txHash?: string;
}

export interface PaymentChallenge {
  status: 'payment_required';
  requestId: string;
  payTo: string;
  amount: string;
  asset: 'XLM';
  memo: string;
  network: NetworkType;
  expiresAt: string;
  retryUrl: string;
  instructions: string;
}
