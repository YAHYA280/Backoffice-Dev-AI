// Types pour la section de correction et réentraînement des modèles IA

// Type d'assistant (correspond à AI_ASSISTANT_TYPE_OPTIONS)
export type AssistantType = 'accueil' | 'recherche' | 'japprends' | 'all';

// Niveau d'enseignement (correspond à AI_ASSISTANT_EDUCATION_LEVELS)
export type EducationLevel = 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2' | 'all';

// Statut de l'assistant (correspond à AI_ASSISTANT_STATUS_OPTIONS)
export type AssistantStatus = 'active' | 'inactive' | 'all';

// Interface pour les données d'un assistant (compatible avec IAIAssistantItem)
export interface Assistant {
  id: string;
  name: string;
  description?: string;
  levels: EducationLevel[]; // Changed from level to levels
  types: AssistantType[];   // Changed from type to types
  status: AssistantStatus;
  educationLevel?: string;
  subjects?: string[];      // Changed to array
  chapters?: string[];      // Changed to array
  exercises?: string[];     // Changed to array
  responseTime?: number;
  requests?: number;
  usage?: number;
  lastUpdated?: string;
  avatarUrl?: string;
}

// Interface pour les filtres
export interface FilterOptions {
  period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
  startDate?: Date;
  endDate?: Date;
  level: EducationLevel;
  type: AssistantType;
  status?: AssistantStatus;
  subject?: string;
  chapter?: string;
  exercise?: string;
  searchTerm: string;
  // Nouveaux champs pour les données de _correction_ai.ts
  assistants?: string[];
  correctionTypes?: string[];
}

// Interface pour les métriques de comparaison
export type ComparisonMetric = 'response-time' | 'requests' | 'usage';

// Interface pour les données de période de date personnalisée
export interface CustomDateRange {
  startDate: Date | null;
  endDate: Date | null;
}