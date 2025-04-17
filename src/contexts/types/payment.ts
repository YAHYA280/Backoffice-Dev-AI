import type { IInvoice } from './invoice';
import type { PurchasedSubscription } from './abonnement';
import type { IDatePickerControl, IAbonnementSubscribers } from './common';

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
