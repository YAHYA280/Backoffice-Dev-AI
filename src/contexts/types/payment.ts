import type { IInvoice } from './invoice';
import type { PurchasedSubscription } from './abonnement';
import type { IDatePickerControl, IAbonnementSubscribers } from './common';

export type IBankTransferConfig = {
  active: boolean;
  title: string;
  accountId: string;
  description: string;
  bankAccounts: {
    name: string;
    number: string;
    bank: string;
    code: string;
    IBAN: string;
    bic_swift: string;
  }[];
};

export interface IBankAccount {
  id?: number;
  accountName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency?: string;
  order: number;
}

export type ICreditCardConfig = {
  active: boolean;
  title: string;
  logos: string[]; // comme ['visa', 'mastercard', 'american-express']
  disabledCreditCards: string[]; // comme ['diners']
  vaulting: boolean;
  contingencyFor3DSecure: string; // comme 'REQUIRED'
};
export type IPaymentMethod = {
  id: string;
  order: number;
  title: string;
  active: boolean;
  type: string;
  description: string;
};

export type IPaymentFilters = {
  name: string;
  paymentMethod: string;
  startDate?: IDatePickerControl;
  endDate?: IDatePickerControl;
  status: string;
  minAmount?: number;
  maxAmount?: number;
  hasInvoice?: boolean;
  subscriptions: string[];
};

export interface IPaymentItem {
  id: string;
  transactionId: string;
  subscriber: IAbonnementSubscribers;
  subscriptions: PurchasedSubscription[];
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  invoiceGenerated: boolean;
  invoice?: IInvoice;
  createdAt: string;
  updatedAt: string;
}
