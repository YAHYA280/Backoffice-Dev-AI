import type { MetricType } from './ToggleMetricsButton';

// Interface pour les options de graphique en fonction du type de métrique
export interface ChartOptionsByMetric {
  yAxisTitle: string;
  yAxisMax: number;
  tooltipSuffix: string;
}

/**
 * Obtient les options de graphique appropriées en fonction du type de métrique sélectionné
 * @param metricType Type de métrique (utilisation ou précision)
 * @returns Options configurées pour le graphique
 */
export const getChartOptionsByMetric = (metricType: MetricType): ChartOptionsByMetric => {
  switch (metricType) {
    case 'precision':
      return {
        yAxisTitle: 'Score de précision',
        yAxisMax: 100,
        tooltipSuffix: 'pts'
      };
    case 'utilization':
    default:
      return {
        yAxisTitle: 'Taux utilisation (%)',
        yAxisMax: 100,
        tooltipSuffix: '%'
      };
  }
};

/**
 * Transforme les données de performance en fonction du type de métrique
 * @param originalData Données originales (généralement du taux d'utilisation)
 * @param metricType Type de métrique à afficher
 * @returns Données transformées pour l'affichage
 */
export const transformDataByMetricType = (
  originalData: any,  // Dans un cas réel, vous utiliseriez un type plus précis
  metricType: MetricType
): any => {
  // Si on affiche déjà le taux d'utilisation, retourner les données telles quelles
  if (metricType === 'utilization') {
    return originalData;
  }

  // Si on veut afficher les scores de précision, transformer les données en diagramme empilé
  if (originalData && originalData.datasets && originalData.labels) {
    const transformedData = { ...originalData };
    const {labels} = originalData;
    
    // Créer un nouveau jeu de datasets pour les scores de précision empilés
    // Pour chaque métrique (Précision, Pertinence, Clarté, etc.)
    const metricNames = ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction'];
    const metricColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    // Créer des datasets pour chaque métrique
    transformedData.datasets = metricNames.map((metricName, index) => ({
      label: metricName,
      data: labels.map((_: any, i: number) => {
        // Générer des valeurs randomisées mais cohérentes pour chaque élément
        // La somme devrait être proche du taux d'utilisation original
        const baseValue = originalData.datasets[1].data[i] || 80; // Utiliser la valeur "après correction"
        const randomFactor = 0.7 + (index * 0.1); // Facteur différent pour chaque métrique
        return Math.round((baseValue / metricNames.length) * randomFactor);
      }),
      backgroundColor: metricColors[index],
      stack: 'stack1' // Toutes les métriques dans le même stack pour qu'elles s'empilent
    }));
    
    return transformedData;
  }
  
  return originalData;
};

/**
 * Applique les options de métrique aux options de graphique
 * @param baseOptions Options de base du graphique
 * @param metricType Type de métrique à utiliser
 * @returns Options de graphique mises à jour
 */
export const applyMetricOptionsToChart = (baseOptions: any, metricType: MetricType): any => {
  const metricOptions = getChartOptionsByMetric(metricType);
  
  // Créer une copie profonde des options
  const updatedOptions = JSON.parse(JSON.stringify(baseOptions));
  
  // Mettre à jour les options spécifiques à la métrique
  if (updatedOptions.scales && updatedOptions.scales.y) {
    updatedOptions.scales.y.title.text = metricOptions.yAxisTitle;
    
    // Pour les scores de précision (diagramme empilé), la valeur maximale peut être ajustée
    if (metricType === 'precision') {
      updatedOptions.scales.y.max = 100; // Valeur max pour les scores empilés
      updatedOptions.scales.y.stacked = true; // Activer l'empilage sur l'axe Y
    } else {
      updatedOptions.scales.y.max = metricOptions.yAxisMax;
      updatedOptions.scales.y.stacked = false; // Désactiver l'empilage pour les taux d'utilisation
    }
  }
  
  // Configurer les barres pour qu'elles soient empilées ou non selon le type de métrique
  if (updatedOptions.scales && updatedOptions.scales.x) {
    if (metricType === 'precision') {
      updatedOptions.scales.x.stacked = true; // Activer l'empilage sur l'axe X
    } else {
      updatedOptions.scales.x.stacked = false; // Désactiver l'empilage pour les taux d'utilisation
    }
  }
  
  // Mettre à jour les tooltips
  if (updatedOptions.plugins && updatedOptions.plugins.tooltip && updatedOptions.plugins.tooltip.callbacks) {
    updatedOptions.plugins.tooltip.callbacks.label = (context: any) => 
      `${context.dataset.label}: ${context.raw}${metricOptions.tooltipSuffix}`;
    
    // Ajouter un callback pour le total dans le cas des diagrammes empilés
    if (metricType === 'precision') {
      updatedOptions.plugins.tooltip.callbacks.footer = (tooltipItems: any[]) => {
        let sum = 0;
        tooltipItems.forEach((tooltipItem) => {
          sum += tooltipItem.parsed.y;
        });
        return `Total: ${Math.round(sum)}${metricOptions.tooltipSuffix}`;
      };
    } else {
      updatedOptions.plugins.tooltip.callbacks.footer = undefined;
    }
  }
  
  return updatedOptions;
};