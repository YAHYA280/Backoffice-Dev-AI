// types/ai-assistant.ts
export interface IAIAssistantItem {
  id: string;
  name: string;
  educationLevel: string;
  type: string;
  subject: string | null;
  chapter: string | null;
  exercise: string | null;
  status: string;
  lastUpdated?: Date | string;
  createdAt?: Date | string | null;
  dateAjoute?: Date | string | null;
  avatarUrl?: string;
  description?: string | null;
}

export interface IAIAssistantDetailLevel {
  level: number; // Niveau entre 1 et 5
}

export interface IAdvancedFilter {
  column: string;
  operator: string;
  value: string;
}

export interface IAIAssistantCustomizationSettings {
  responseType: ("text" | "audio" | "image")[]; // Tableau des types de réponse autorisés
  inputType: "text" | "audio" | "image"; // Entrées utilisateur possibles
  welcomeMessage: string; // Message d'accueil personnalisé
  motivationalPhrases: string[]; // Liste de phrases de motivation
  helpPhrases: string[]; // Liste de phrases d'aide
  audioFormat: "mp3" | "wav" | "aac"; // Format audio préféré
  voiceTranscription: boolean; // Activation/désactivation de la transcription vocale
  imageSupport: boolean; // Activation/désactivation du support d'images
  imageFormat: ("jpg" | "png" | "svg")[]; // Formats d'image pris en charge
  deletionHistory: { phrase: string; date: string; type: "motivation" | "aide" }[]; // Historique des suppressions
}

export interface IAIAssistantTableColumns {
  name: boolean;
  type: boolean;
  educationLevel: boolean;
  subject: boolean;
  chapter: boolean;
  exercise: boolean;
  status: boolean;
  dateAjoute: boolean;
}

export interface IAIAssistantTableFilters {
  name: string;
  type: string[];
  status: string;
  educationLevel: string;
  subject: string;
  chapter: string;
  exercise: string;
  dateAjoute: string;
  visibleColumns: IAIAssistantTableColumns;
  advancedFilter?: IAdvancedFilter | null;
}

export interface IAIAssistantTableFiltersResultProps {
  filters: IAIAssistantTableFilters;
  onFilters: (name: string, value: string | string[]) => void;
  onResetFilters: () => void;
  onResetPage: () => void;
  sx?: object;
  results: number;
  options: {
    types: {
      value: string;
      label: string;
    }[];
    educationLevels: {
      value: string;
      label: string;
    }[];
    subjects: {
      value: string;
      label: string;
    }[];
    statuses: {
      value: string;
      label: string;
    }[];
  };
}

export type SupervisionRule = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isSystemRule: boolean;
  parameters?: {
    [key: string]: any;
  };
  lastModified?: string;
  lastModifiedBy?: string;
  lastModificationComment?: string;
};

export type ModificationHistoryEntry = {
  id: string;
  date: string;
  user: string;
  action: 'add' | 'modify' | 'delete' | 'toggle';
  ruleName: string;
  comment: string;
};

export type AIAssistantFilteringProps = {
  assistantId: string;
};

export type AIAssistantLanguagesProps = {
  assistantId: string;
};

export type LanguageOption = {
  code: string;
  name: string;
  enabled: boolean;
};

export type CommunicationStyle = "amical" | "neutre" | "académique";

export type AIAssistantDetailLevelProps = {
  assistantId?: string;
};

export type AIAssistantDescriptionProps = {
  assistantId: string;
};
