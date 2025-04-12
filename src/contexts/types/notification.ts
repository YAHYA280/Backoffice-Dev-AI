import type { IAbonnementSubscribers } from './common';

export type INotificationFilters = {
  title: string;
  type: string;
  startDate?: any; // Using same date picker control as in payment
  endDate?: any;
  status: string;
  channel: string;
};

export interface INotificationType {
  id: string;
  title: string;
  type: string; // Information, Promotionnel, Rappel, Alerte
  status: string; // Envoyée, En attente, Échouée
  recipients: IAbonnementSubscribers[] | { name: string; count: number }; // For user groups with count
  content: string;
  sentDate: string;
  channel: string[]; // Email, SMS, Push as array to support multiple channels
  createdAt: string;
  updatedAt: string;
}
