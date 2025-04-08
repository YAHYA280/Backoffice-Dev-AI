// _mock_satisfaction_trend.ts
import type { AssistantType , ChartDataPoint , EducationLevel } from "./type";

// Données mockées pour le graphique d'évolution du taux de satisfaction - par jour
export const mockDailySatisfactionTrend: ChartDataPoint[] = [
  { period: 'Lun', value: 85, totalResponses: 120 },
  { period: 'Mar', value: 87, totalResponses: 132 },
  { period: 'Mer', value: 84, totalResponses: 125 },
  { period: 'Jeu', value: 88, totalResponses: 140 },
  { period: 'Ven', value: 91, totalResponses: 155 },
  { period: 'Sam', value: 89, totalResponses: 110 },
  { period: 'Dim', value: 92, totalResponses: 95 },
];

// Données mockées par semaine
export const mockWeeklySatisfactionTrend: ChartDataPoint[] = [
  { period: 'Semaine 1', value: 86, totalResponses: 820 },
  { period: 'Semaine 2', value: 87, totalResponses: 850 },
  { period: 'Semaine 3', value: 89, totalResponses: 880 },
  { period: 'Semaine 4', value: 91, totalResponses: 910 },
];

// Données mockées par mois
export const mockMonthlySatisfactionTrend: ChartDataPoint[] = [
  { period: 'Jan', value: 85, totalResponses: 3500 },
  { period: 'Fév', value: 86, totalResponses: 3200 },
  { period: 'Mar', value: 88, totalResponses: 3800 },
  { period: 'Avr', value: 87, totalResponses: 3600 },
  { period: 'Mai', value: 90, totalResponses: 3900 },
  { period: 'Juin', value: 92, totalResponses: 4100 },
];

// Données mockées pour aujourd'hui (par heure)
export const mockTodaySatisfactionTrend: ChartDataPoint[] = [
  { period: '8h', value: 84, totalResponses: 15 },
  { period: '9h', value: 86, totalResponses: 22 },
  { period: '10h', value: 88, totalResponses: 28 },
  { period: '11h', value: 87, totalResponses: 25 },
  { period: '12h', value: 85, totalResponses: 18 },
  { period: '13h', value: 86, totalResponses: 20 },
  { period: '14h', value: 89, totalResponses: 30 },
  { period: '15h', value: 90, totalResponses: 32 },
  { period: '16h', value: 91, totalResponses: 28 },
  { period: '17h', value: 92, totalResponses: 25 },
];

// Données mockées pour hier (par heure)
export const mockYesterdaySatisfactionTrend: ChartDataPoint[] = [
  { period: '8h', value: 82, totalResponses: 14 },
  { period: '9h', value: 84, totalResponses: 20 },
  { period: '10h', value: 85, totalResponses: 26 },
  { period: '11h', value: 87, totalResponses: 28 },
  { period: '12h', value: 84, totalResponses: 15 },
  { period: '13h', value: 86, totalResponses: 18 },
  { period: '14h', value: 88, totalResponses: 27 },
  { period: '15h', value: 89, totalResponses: 30 },
  { period: '16h', value: 90, totalResponses: 26 },
  { period: '17h', value: 88, totalResponses: 22 },
];

// Fonction pour obtenir les données mockées en fonction de la période
export const getMockSatisfactionTrendByPeriod = (period: string): ChartDataPoint[] => {
  switch (period) {
    case 'today':
      return mockTodaySatisfactionTrend;
    case 'yesterday':
      return mockYesterdaySatisfactionTrend;
    case 'last7days':
      return mockDailySatisfactionTrend;
    case 'last30days':
      return mockWeeklySatisfactionTrend;
    case 'custom':
    default:
      return mockMonthlySatisfactionTrend;
  }
};

// Définir les variations pour chaque niveau d'éducation
const levelVariations: Record<EducationLevel, number> = {
  'cp': 2.5,
  'ce1': 1.8,
  'ce2': 0.5,
  'cm1': -0.8,
  'cm2': -1.5,
  'all': 0
};

// Définir les variations pour chaque type d'assistant
const typeVariations: Record<AssistantType, number> = {
  'accueil': 1.2,
  'recherche': -0.5,
  'japprends': 2.0,
  'all': 0
};

// Fonction pour appliquer des filtres personnalisés au jeu de données
export const applyCustomFilters = (
  data: ChartDataPoint[], 
  level: EducationLevel = 'all', 
  type: AssistantType = 'all' , 
  additionalFilters?: {
    levels?: string[],
    types?: string[],
    subjects?: string[],
    chapters?: string[],
    exercises?: string[],
    searchTerm?: string
  }
): ChartDataPoint[] => {
  let filteredData = [...data];
  
  // Variation en fonction du niveau
  if (level !== 'all') {
    const variation = levelVariations[level] || 0;
    
    filteredData = filteredData.map(item => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value + variation + (Math.random() * 2 - 1))),
      totalResponses: Math.round(item.totalResponses * (0.9 + (level === 'cp' ? 0.2 : level === 'cm2' ? 0.3 : 0.1)))
    }));
  }
  
  // Variation en fonction du type d'assistant
  if (type !== 'all') {
    const variation = typeVariations[type] || 0;
    
    filteredData = filteredData.map(item => ({
      ...item,
      value: Math.min(100, Math.max(0, item.value + variation + (Math.random() * 2 - 1))),
      totalResponses: Math.round(item.totalResponses * (type === 'japprends' ? 1.5 : type === 'recherche' ? 1.2 : 1.0))
    }));
  }
  
  return filteredData;
};
// Fonction pour obtenir les données comparatives (période précédente, mois précédent, année précédente)
export const getMockComparativeSatisfactionData = (
  currentData: ChartDataPoint[],
  comparisonType: 'previousPeriod' | 'previousMonth' | 'previousYear'
): ChartDataPoint[] => {
  // Créer une copie profonde des données actuelles
  const comparativeData = JSON.parse(JSON.stringify(currentData)) as ChartDataPoint[];
  
  // Appliquer des modifications en fonction du type de comparaison
  switch (comparisonType) {
    case 'previousPeriod':
      // Période précédente : valeurs 1-3% plus basses
      return comparativeData.map(item => ({
        ...item,
        value: Math.max(0, Math.min(100, item.value - (2 + Math.random() * 1))),
        totalResponses: Math.round(item.totalResponses * 0.9),
        isPreviousPeriod: true
      }));
    
    case 'previousMonth':
      // Mois précédent : valeurs 3-6% plus basses
      return comparativeData.map(item => ({
        ...item,
        value: Math.max(0, Math.min(100, item.value - (4 + Math.random() * 2))),
        totalResponses: Math.round(item.totalResponses * 0.8),
        isPreviousMonth: true
      }));
    
    case 'previousYear':
      // Année précédente : valeurs 8-12% plus basses
      return comparativeData.map(item => ({
        ...item,
        value: Math.max(0, Math.min(100, item.value - (10 + Math.random() * 2))),
        totalResponses: Math.round(item.totalResponses * 0.6),
        isPreviousYear: true
      }));
    
    default:
      return comparativeData;
  }
};