"use client";

import { Line } from 'react-chartjs-2';
import { registerables, Chart as ChartJS } from 'chart.js';
import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faCheckCircle, 
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

import useMediaQuery from '@mui/material/useMediaQuery';
import { styled , useTheme} from '@mui/material/styles';
import {
  Box,
  Grid,
  Card,
  Alert,
  Snackbar,
  Container,
  CardHeader
, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import Filters from './Filters';
import HistoryCorrection from './HistoryCorrection';
import CorrectionTypesChart from './CorrectionTypesChart';
import PerformanceComparison from './PerformanceComparison';
import { CorrectionWidgetSummary } from './CorrectionWidgetSummary';
import {
  chartColors,
  correctionData,
  correctionStats,
  defaultFilterOptions,
  filterCorrectionData,
  correctionTypeDistribution,
  filterPerformanceEvolutionData
} from '../../../../_mock/_correction_ai';

import type {
  FilterOptions,
  PerformanceEvolutionFilterOptions} from '../../../../_mock/_correction_ai';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(...registerables);

// Styles pour le contenu principal
const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const CorrectionDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Initialisation des filtres avec les valeurs par défaut
  const [filters, setFilters] = useState<FilterOptions>(defaultFilterOptions);
  const [appliedFilters, setAppliedFilters] = useState<FilterOptions>(defaultFilterOptions);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // État pour les données filtrées
  const [filteredCorrectionData, setFilteredCorrectionData] = useState(correctionData);

  // État pour les filtres d'évolution des performances
  const [performanceEvolutionFilters, setPerformanceEvolutionFilters] = useState<PerformanceEvolutionFilterOptions>({
    period: 'day',
    assistantTypes: [],
    educationLevels: [],
    startDate: null,
    endDate: null,
    onlySignificantImprovements: false,
    compareWithPreviousPeriod: false
  });

  // Fonction pour appliquer les filtres
  const applyFilters = (newFilters: FilterOptions) => {
    setAppliedFilters(newFilters);
    setOpenSnackbar(true);
  };

  // Fonction de téléchargement CSV
  const handleDownloadCSV = () => {
    alert("Téléchargement des données des corrections et réentraînements démarré.");
    // Logique réelle de création et téléchargement du CSV à implémenter ici
  };

  // Fonction de téléchargement pour le composant PerformanceComparison
  const handleDownloadPerformanceData = () => {
    alert("Téléchargement des données de performance des assistants démarré.");
    // Logique spécifique aux données de performance
  };

  // Effet pour appliquer les filtres
  useEffect(() => {
    try {
      // Ensure we have valid filters
      const validFilters: FilterOptions = {
        ...defaultFilterOptions,
        ...appliedFilters
      };
  
      console.log('Applied filters AVANT traitement:', JSON.stringify(validFilters, null, 2));
      
      // S'assurer que le niveau est correctement traité
      if (validFilters.level && validFilters.level !== 'all') {
        if (Array.isArray(validFilters.level) && validFilters.level.length === 0) {
          // Si c'est un tableau vide, utiliser 'all'
          validFilters.level = 'all';
          console.log('Level converti en "all" car le tableau est vide');
        }
      }
      
      console.log('Applied filters APRÈS traitement:', JSON.stringify(validFilters, null, 2));
      console.log('Original data length:', correctionData.length);
  
      // Apply filters
      const newFilteredData = filterCorrectionData(correctionData, validFilters);
      console.log('Filtered data length:', newFilteredData.length);
      
      // Pour le débogage, afficher les 3 premières entrées filtrées
      if (newFilteredData.length > 0) {
        console.log('Premières entrées filtrées:', 
          newFilteredData.slice(0, Math.min(3, newFilteredData.length)).map(item => ({
            assistant: item.assistant,
            level: item.meta.level,
            type: item.type
          }))
        );
      }
  
      // Only update if we actually have data
      if (newFilteredData.length > 0 || Object.keys(validFilters as object).some(key =>
        validFilters[key as keyof FilterOptions] !== defaultFilterOptions[key as keyof FilterOptions])) {
        setFilteredCorrectionData(newFilteredData);
      } else {
        // If no results but filters are applied, show empty results
        setFilteredCorrectionData(newFilteredData);
        console.warn('No data matches the current filters');
      }
    } catch (error) {
      console.error('Error filtering data:', error);
      // Fallback to showing all data if filtering fails
      setFilteredCorrectionData(correctionData);
    }
  }, [appliedFilters]);

  // Reset all filters function
  const resetAllFilters = () => {
    setAppliedFilters(defaultFilterOptions);
    setFilters(defaultFilterOptions);
    setFilteredCorrectionData(correctionData);
      // Réinitialiser également les filtres d'évolution des performances
  const defaultPerformanceFilters: PerformanceEvolutionFilterOptions = {
    period: 'day',
    assistantTypes: [],
    educationLevels: [],
    startDate: null,
    endDate: null,
    onlySignificantImprovements: false,
    compareWithPreviousPeriod: false
  };
  setPerformanceEvolutionFilters(defaultPerformanceFilters);
  
  // Afficher une notification
  setOpenSnackbar(true);
  };

  // Gérer l'enregistrement des filtres
  const handleSaveFilters = (newFilters: FilterOptions) => {
    setAppliedFilters(newFilters);
    setOpenSnackbar(true);
  };

  // Gérer la fermeture du snackbar
  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Gérer le changement de filtre
  const handleFilterChange = (name: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Convertir FilterOptions en PerformanceEvolutionFilterOptions
  const convertToPerformanceFilters = (currentFilters: FilterOptions): PerformanceEvolutionFilterOptions => {
    // Mapping des types d'assistants
    let assistantTypes: string[] = [];
    if (Array.isArray(currentFilters.type) && currentFilters.type.length > 0) {
      assistantTypes = currentFilters.type;
    } else if (typeof currentFilters.type === 'string' && currentFilters.type !== 'all') {
      assistantTypes = [currentFilters.type];
    }

    // Mapping des niveaux d'éducation
    let educationLevels: string[] = [];
    if (Array.isArray(currentFilters.level) && currentFilters.level.length > 0) {
      educationLevels = currentFilters.level;
    } else if (typeof currentFilters.level === 'string' && currentFilters.level !== 'all') {
      educationLevels = [currentFilters.level];
    }

    // Conversion de période
    let period: 'day' | 'week' | 'month' = 'day';
    switch (currentFilters.period) {
      case 'today': 
      case 'yesterday':
        period = 'day';
        break;
      case 'last7days':
        period = 'week';
        break;
      case 'last30days':
      case 'custom':
        period = 'month';
        break;
      default:
        period = 'day';
        break;
    }

    return {
      period,
      assistantTypes,
      educationLevels,
      startDate: currentFilters.startDate || null,
      endDate: currentFilters.endDate || null,
      onlySignificantImprovements: false,
      compareWithPreviousPeriod: false
    };
  };

  // Appliquer les filtres globaux aux graphiques de performance
  useEffect(() => {
    // Convertir les filtres globaux en filtres pour le graphique d'évolution
    const performanceFilters = convertToPerformanceFilters(appliedFilters);
    setPerformanceEvolutionFilters(performanceFilters);
  }, [appliedFilters]);

  // Fonction pour obtenir le texte des filtres actifs
  const getActiveFiltersText = (currentFilters: FilterOptions) => {
    const activeFilters: string[] = [];

    if (currentFilters.period && currentFilters.period !== defaultFilterOptions.period) {
      let periodText = "Période: ";
      switch (currentFilters.period) {
        case 'today': periodText += "Aujourd'hui"; break;
        case 'yesterday': periodText += "Hier"; break;
        case 'last7days': periodText += "7 derniers jours"; break;
        case 'last30days': periodText += "30 derniers jours"; break;
        case 'custom': periodText += "Personnalisée"; break;
        default: periodText += "Tous"; break;
      }
      activeFilters.push(periodText);
    }

    if (currentFilters.type && currentFilters.type !== 'all') {
      const typeText = `Type: ${Array.isArray(currentFilters.type) ? currentFilters.type.join(', ') : currentFilters.type}`;
      activeFilters.push(typeText);
    }

    if (currentFilters.level && currentFilters.level !== 'all') {
      const levelText = `Niveau: ${Array.isArray(currentFilters.level) ? currentFilters.level.join(', ') : currentFilters.level}`;
      activeFilters.push(levelText);
    }

    if (currentFilters.searchTerm) {
      activeFilters.push(`Recherche: "${currentFilters.searchTerm}"`);
    }

    if (currentFilters.correctionTypes && currentFilters.correctionTypes.length > 0) {
      activeFilters.push(`Types de correction: ${currentFilters.correctionTypes.join(', ')}`);
    }

    return activeFilters.length > 0
      ? activeFilters.join(' | ')
      : "";
  };

  // Filtrer et adapter les données des types de correction selon les filtres appliqués
  const correctionTypesDataFiltered = useMemo(() => {
    // Créez des données adaptées aux filtres actuels
    const filteredTypes = correctionTypeDistribution.filter((item) => {
      if (appliedFilters.correctionTypes && appliedFilters.correctionTypes.length > 0) {
        return appliedFilters.correctionTypes.includes(item.type);
      }
      return true;
    });

    // Si aucun filtre spécifique, utilisez toutes les données
    const typesToUse = filteredTypes.length > 0 ? filteredTypes : correctionTypeDistribution;

    return {
      labels: typesToUse.map(item => item.type),
      datasets: [{
        data: typesToUse.map(item => item.percentage),
        backgroundColor: chartColors.slice(0, typesToUse.length),
      }]
    };
  }, [appliedFilters]);

  // Options globales pour les graphiques
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  // Remplacer la configuration des données d'évolution des performances par celle-ci:
  const performanceEvolutionData = useMemo(() => {
    // Appliquer les filtres
    const evolutionData = filterPerformanceEvolutionData(performanceEvolutionFilters);
    type ChartDataset = {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension: number;
      fill: boolean;
      borderDash?: number[]; // Make borderDash optional
    };
    // Créer le jeu de données pour le graphique
    const datasets: ChartDataset[] = [
      {
        label: 'Avant correction',
        data: evolutionData.beforeCorrection,
        borderColor: '#FF5733', // Change to your desired color (orange-red)
        backgroundColor: 'rgba(255, 51, 0, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Après correction',
        data: evolutionData.afterCorrection,
        borderColor: '#33FF57', // Change to your desired color (green)
        backgroundColor: 'rgba(11, 226, 47, 0.1)',
        tension: 0.4,
        fill: true
      }
    ];

    // Ajouter la série pour la période précédente si elle existe
    if (evolutionData.previousPeriodAfterCorrection) {
      datasets.push({
        label: 'Période précédente',
        data: evolutionData.previousPeriodAfterCorrection.map(value => value === null ? 0 : value), // Convert null to 0
        borderColor: theme.palette.warning.main,
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.4,
        fill: false
      });
    }

    return {
      labels: evolutionData.labels,
      datasets
    };
  }, [performanceEvolutionFilters, theme.palette]);
 
  // Calculer l'amélioration moyenne basée sur les données filtrées
  const averageImprovement = useMemo(() => {
    if (!filteredCorrectionData || filteredCorrectionData.length === 0) {
      return correctionStats.averageImprovementPercentage; // Valeur par défaut
    }
    
    // Calculer la moyenne des impacts de toutes les corrections filtrées
    const totalImpact = filteredCorrectionData.reduce((sum, item) => sum + item.impact, 0);
    return (totalImpact / filteredCorrectionData.length).toFixed(1);
  }, [filteredCorrectionData]);

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Correction"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Assistant IA', href: paths.dashboard.ai.correction },
          { name: 'Correction' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
    <Box sx={{ display: 'flex' }}>

      {/* Contenu principal */}
      <Main>
        <Container maxWidth="xl">
          {/* Section des filtres globaux */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: '100%' }}>
              <Box /> {/* Empty box for spacing */}
              <Filters
                filters={filters}
                handleFilterChange={handleFilterChange}
                onFilterApplied={() => console.log('Filtres appliqués :', filters)}
                onSaveFilters={applyFilters}
                onResetFilters={resetAllFilters}
              />
            </Box>
          {/* Notification de filtres appliqués */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              Filtres appliqués avec succès !
            </Alert>
          </Snackbar>

          {/* KPI Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <CorrectionWidgetSummary
                title="Corrections en attente"
                total={correctionStats.totalPendingCorrections}
                icon={<FontAwesomeIcon icon={faInfoCircle} />}
                color="info"
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  series: [18, 25, 14, 24, 22, 24],
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <CorrectionWidgetSummary
                title="Corrections effectuées"
                total={correctionStats.totalCorrectionsMade}
                icon={<FontAwesomeIcon icon={faCheckCircle} />}
                color="success"
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  series: [42, 56, 65, 78, 89, 187],
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <CorrectionWidgetSummary
                title="Amélioration moyenne"
                total={0}
                percent={Number(averageImprovement)}
                icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
                color="warning"
                chart={{
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  series: [8.2, 9.5, 11.2, 12.8, 14.1, 15.0],
                }}
                showPercentWithTotal={false}
                showPercentAsTotal
              />
            </Grid>
          </Grid>

          {/* Graphiques */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader
                  title="Évolution des performances après correction"
                  subheader={
                    <>
                      {performanceEvolutionFilters.period === 'day' ? 'Par jour' :
                      performanceEvolutionFilters.period === 'week' ? 'Par semaine' : 'Par mois'}
                      {performanceEvolutionFilters.assistantTypes.length > 0 &&
                        ` | Types: ${performanceEvolutionFilters.assistantTypes.join(', ')}`}
                      {performanceEvolutionFilters.educationLevels.length > 0 &&
                        ` | Niveaux: ${performanceEvolutionFilters.educationLevels.join(', ')}`}
                      {performanceEvolutionFilters.onlySignificantImprovements &&
                        ' | Améliorations significatives uniquement'}
                    </>
                  }
                />
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    <Line data={performanceEvolutionData} options={{
                      ...chartOptions,
                      scales: {
                        y: {
                          min: 60,
                          max: 100,
                          title: {
                            display: true,
                            text: 'Score de performance (%)'
                          }
                        }
                      }
                    }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <CorrectionTypesChart 
                data={correctionTypesDataFiltered}
                title="Répartition des types de corrections" 
                filters={appliedFilters}
              />
            </Grid>
          </Grid>

          {/* Composant de Comparaison des performances avant/après réentraînement */}
          <PerformanceComparison 
            filters={appliedFilters} 
            onDownloadData={handleDownloadPerformanceData} 
          />

          {/* Historique des corrections */}
          <Card sx={{ mb: 3 }}>
            <CardHeader
              title={`Historique des corrections (${filteredCorrectionData.length} résultats)`}
              titleTypographyProps={{ variant: 'h6' }}
            />
            <CardContent>
              <HistoryCorrection data={filteredCorrectionData} />
            </CardContent>
          </Card>
        </Container>
      </Main>
    </Box>
    </DashboardContent>
  );
};

export default CorrectionDashboard;