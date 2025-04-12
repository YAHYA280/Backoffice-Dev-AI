export type ComparisonType =
  | 'Sans comparaison'
  | 'Période précédente'
  | 'Mois précédent'
  | 'Année précédente';

export type MetricType = 'Nombre de requêtes' | 'Temps de réponse' | "Taux d'utilisation";

export interface AIAssistantMetric {
  name: MetricType;
  data: number[];
}

export interface AIAssistantCategoryData {
  name: string;
  data: AIAssistantMetric[];
}

export interface ChartData {
  categories: string[];
  series: AIAssistantCategoryData[];
}

export interface ComparisonChartSeries {
  name: string;
  categories: string[];
  data: number[][];
  comparisonData?: number[][];
  comparisonLabel?: string;
}

export interface ComparisonChartData {
  colors?: string[];
  options?: any;
  series: ComparisonChartSeries[];
}

// Types pour les requêtes API avec Axios
export interface DateRangeFilter {
  startDate: string; // Format ISO
  endDate: string; // Format ISO
  comparisonType: ComparisonType;
}

// Réponse de l'API pour les données de requête
export interface AIQueryAnalysisResponse {
  categories: string[];
  series: {
    name: string;
    metrics: {
      name: MetricType;
      data: number[];
    }[];
  }[];
}

// Réponse de l'API pour l'analyse comparative
export interface AssistantComparisonResponse {
  series: {
    name: MetricType;
    categories: string[];
    currentPeriodData: number[];
    comparisonData?: number[];
    comparisonLabel?: string;
  }[];
}
