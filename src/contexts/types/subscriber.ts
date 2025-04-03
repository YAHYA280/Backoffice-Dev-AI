import type { IDatePickerControl } from './common';
import type { IAbonnementItem } from './abonnement';

export type ISubscriberFilters = {
  name: string;
  email: string;
  status: string;
  subscriptions: string[];
  startDate?: IDatePickerControl;
  endDate?: IDatePickerControl;
};

export interface ISubscriberItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscriptions: IAbonnementItem[];
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  status: string;
  paymentMethod: string;
  billingCycle: string;
  lastPaymentDate: string;
  createdAt: string;
  updatedAt: string;
}