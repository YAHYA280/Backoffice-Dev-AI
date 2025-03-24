import type { IPaymentItem } from './payment';
import type { IAbonnementItem } from './abonnement';
import type { IDatePickerControl, IAbonnementSubscribers } from './common';

export type IInvoiceFilters = {
  name: string;
  status: string;
  subscriptions: string[];
  startDate?: IDatePickerControl;
  endDate?: IDatePickerControl;
  minAmount?: number;
  maxAmount?: number;
};

export interface IInvoice {
  id: string;
  subscriber: IAbonnementSubscribers | null;
  subscriptions: IAbonnementItem[];
  amount: number;
  invoiceNumber: string;
  createDate: string;
  updatedDate: string;
  status: string;
  payment: IPaymentItem;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  notes?: string;
}
