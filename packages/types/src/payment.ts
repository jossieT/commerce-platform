export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentProvider {
  CHAPA = 'chapa',
}

export interface Payment {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  txRef: string;           // Chapa transaction reference
  chapaTransactionId?: string;
  amount: number;
  currency: string;        // 'ETB'
  status: PaymentStatus;
  metadata?: Record<string, unknown>;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChapaInitResponse {
  checkoutUrl: string;
  txRef: string;
}
