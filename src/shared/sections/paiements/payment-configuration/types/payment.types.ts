// Path: src/shared/sections/paiements/payment-configuration/types/payment.types.ts

export type PaymentMode = 'live' | 'sandbox';
export type ThreeDSecureOption = 'REQUIRED' | 'ALWAYS';

// Stripe Configuration
export interface StripeConfig {
  id?: string;
  active: boolean;
  mode: PaymentMode;
  liveSecretKey: string;
  sandboxSecretKey: string;
  webhookUrl?: string;
  webhookSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Credit Card Configuration
export interface CreditCardConfig {
  id?: string;
  active: boolean;
  title: string;
  allowedBrands: string[];
  disabledBrands: string[];
  vaulting: boolean;
  threeDSecure: ThreeDSecureOption;
  displayLogos: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Bank Account
export interface BankAccount {
  id: string;
  accountName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency: string;
  isDefault: boolean;
}

// Bank Transfer Configuration
export interface BankTransferConfig {
  id?: string;
  active: boolean;
  title: string;
  description: string;
  instructions?: string;
  showAccountDetails: boolean;
  bankAccounts: BankAccount[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Payment Method Base
export interface PaymentMethod {
  id: string;
  type: 'stripe' | 'credit_card' | 'bank_transfer';
  title: string;
  description: string;
  active: boolean;
  configured: boolean;
  icon?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Combined Configuration Response
export interface PaymentConfigResponse {
  stripe: StripeConfig;
  creditCard: CreditCardConfig;
  bankTransfer: BankTransferConfig;
  methods: PaymentMethod[];
}

// Configuration Status
export interface ConfigurationStatus {
  stripe: {
    configured: boolean;
    active: boolean;
    mode?: PaymentMode;
  };
  creditCard: {
    configured: boolean;
    active: boolean;
  };
  bankTransfer: {
    configured: boolean;
    active: boolean;
    accountsCount: number;
  };
}

// Form Data Types
export interface StripeFormData {
  active: boolean;
  mode: PaymentMode;
  liveSecretKey: string;
  sandboxSecretKey: string;
  webhookUrl?: string;
  webhookSecret?: string;
}

export interface CreditCardFormData {
  active: boolean;
  title: string;
  allowedBrands: string[];
  disabledBrands: string[];
  vaulting: boolean;
  threeDSecure: ThreeDSecureOption;
  displayLogos: boolean;
}

export interface BankTransferFormData {
  active: boolean;
  title: string;
  description: string;
  instructions?: string;
  showAccountDetails: boolean;
}
