// Path: src/shared/sections/paiements/payment-configuration/types/payment.types.ts

export type PaymentMode = 'live' | 'sandbox';
export type ThreeDSecureOption = 'REQUIRED' | 'ALWAYS';

export interface StripeConfig {
  id?: string;
  active: boolean;
  mode: PaymentMode;
  liveSecretKey: string;
  sandboxSecretKey: string;
  webhookUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreditCardConfig {
  id?: string;
  active: boolean;
  title: string;
  logos: string[];
  disabledCreditCards: string[];
  vaulting: boolean;
  contingencyFor3DSecure: ThreeDSecureOption;
  stripeConfig?: StripeConfig;
}

export interface BankTransferConfig {
  id?: string;
  active: boolean;
  title: string;
  description: string;
  accountId?: string;
  bankAccounts: BankAccount[];
  stripeConfig?: StripeConfig;
}

export interface BankAccount {
  id?: number;
  accountName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency?: string;
  order: number;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'paypal' | 'apple_pay';
  title: string;
  description: string;
  active: boolean;
  icon?: string;
  config?: any;
}

export interface PaymentConfigFormData {
  stripe: StripeConfig;
  creditCard: CreditCardConfig;
  bankTransfer: BankTransferConfig;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaymentConfigResponse {
  stripe: StripeConfig;
  methods: PaymentMethod[];
}
