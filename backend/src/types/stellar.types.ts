export interface HorizonPayment {
  id: string;
  transaction_hash: string;
  from: string;
  to: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  amount: string;
  created_at: string;
  transaction_attr: {
    created_at: string;
  };
}

export interface HorizonTransaction {
  id: string;
  hash?: string;
  source_account: string;
  created_at: string;
  operation_count: number;
  fee_charged: number;
  successful: boolean;
  memo?: string;
  memo_type?: string;
}

export interface HorizonOperation {
  id: string;
  type: string;
  transaction_hash: string;
  from?: string;
  to?: string;
  amount?: string;
  asset_type?: string;
  created_at: string;
}

export interface PaymentData {
  id: string;
  from: string;
  to: string;
  amount: number;
  asset: string;
  timestamp: Date;
  isIncoming: boolean;
}
