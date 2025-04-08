// Types pour la section d'évaluation du taux de satisfaction

// Période de temps pour les filtres
export type TimePeriod = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';

// Niveau d'enseignement
export type EducationLevel = 'cp' | 'ce1' | 'ce2' | 'cm1' | 'cm2' | 'all';

// Type d'assistant
export type AssistantType = 'accueil' | 'recherche' | 'japprends' | 'all';

// Interface pour les filtres avec sélections multiples et compatibilité
export interface FilterOptions {
  // Time period selection
  period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom' | TimePeriod;
  startDate?: Date;
  endDate?: Date;
  
  // Education filters - both single and multiple selection
  level: EducationLevel;  // For backward compatibility
  levels: EducationLevel[];
  
  // Type filters - both single and multiple selection
  type: AssistantType;  // For backward compatibility
  types: AssistantType[];
  
  // Content filters - both single and multiple selection
  subject?: string;
  subjects?: string[];
  
  chapter?: string;
  chapters?: string[];
  
  exercise?: string;
  exercises?: string[];
  
  // Search
  searchTerm?: string;
  
  // Correction AI specific fields
  status?: AssistantStatus;
  assistants?: string[];
  correctionTypes?: string[];
}

// Structure des données de satisfaction
export interface SatisfactionData {
  id: string;
  date: string;
  assistant: string;
  assistantType: AssistantType;
  level: EducationLevel;
  satisfactionRate: number;
  totalResponses: number;
  positiveResponses: number;
  negativeResponses: number;
}

// Interface pour les données de graphique par période
export interface ChartDataPoint {
  period: string;
  value: number;
  totalResponses: number;
}

// Interface pour les statistiques de performance
export interface PerformanceStat {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'stable';
  // Nouvelle propriété pour permettre l'override direct de la couleur
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  // Données additionnelles pour les détails
  details?: {
    description?: string;
    timeSeriesData?: {
      labels: string[];
      values: number[];
    };
    distribution?: {
      labels: string[];
      values: number[];
    };
    topSources?: {
      name: string;
      value: number;
    }[];
    comparisonPeriod?: string;
  };
}

// Interface pour les données agrégées par assistant
export interface AssistantSatisfactionData {
  name: string;
  type: AssistantType;
  level: EducationLevel;
  satisfactionRate: number;
  totalResponses: number;
  trend: number; // Tendance par rapport à la période précédente
  totalUsers: number;
}

// Interface pour les données de distribution des notes
export interface RatingDistribution {
  rating: number; // 1 à 5 étoiles
  count: number;
  percentage: number;
}

// Interface pour les données de feedback textuel
export interface FeedbackComment {
  id: string;
  date: string;
  assistant: string;
  rating: number;
  comment: string;
  tags?: string[];
  educationLevel: string | null;
  subject: string | null;
  chapter: string | null;
  exercise: string | null;
}
// Types pour la section de correction et réentraînement des modèles IA



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



// Interface pour les métriques de comparaison
export type ComparisonMetric = 'response-time' | 'requests' | 'usage';

// Interface pour les données de période de date personnalisée
export interface CustomDateRange {
  startDate: Date | null;
  endDate: Date | null;
}