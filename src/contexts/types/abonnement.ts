// ----------------------------------------------------------------------

import type { IAbonnementSubscribers } from './common';

export type PublishStatus = 'draft' | 'published' | 'archived';
export type PriceInterval = 'monthly' | 'semiannual' | 'annual';
// Type définissant les modèles d'assistants disponibles
export type AIModel = 'chatgpt3' | 'chatgpt4' | 'chatgpt5' | 'claude3' | 'claude3_5' | 'claude4';
export type TTSModel = 'tts_standard' | 'tts_premium' | 'tts_neural' | 'tts_premium_plus';

export type IAbonnementPrice = {
  monthly: number;
  semiannual: number;
  annual: number;
  defaultInterval: string;
};

export type IPromoDetails = {
  discountPercentage?: number;
  validUntil?: string;
};

// Configuration d'un assistant spécifique
export interface AssistantSettings {
  access: boolean;
  textModel: string;
  ttsModel: string;
}

// Configuration de tous les assistants disponibles
export interface AssistantConfiguration {
  devoir: AssistantSettings;
  recherche: AssistantSettings;
  japprends: AssistantSettings;
}

// Type pour les modèles disponibles par assistant
export type AvailableModels = Record<keyof AssistantConfiguration, AIModel[]>;
export type AvailableTTSModels = Record<keyof AssistantConfiguration, TTSModel[]>;

export type IAbonnementItem = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  nbr_children_access: number;
  daily_question_limit: number;
  assistants: AssistantConfiguration;
  nbr_subjects: number;
  publish: string;
  totalSubscribers: number;
  price: IAbonnementPrice;
  promoDetails?: IPromoDetails;
  subscribers: IAbonnementSubscribers[];
  createdAt: string;
  updatedAt: string;
  lastPublishedDate?: string;
  lastarchivedDate?: string;
  expiredAt?: string;
};

export interface PurchasedSubscription extends IAbonnementItem {
  interval: string;
}
