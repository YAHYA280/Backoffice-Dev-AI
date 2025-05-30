'use client';

import React, { useState, useEffect } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box, Grid, Chip, Badge, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import FilterSidebar from './FilterSidebar';
import RecentCommentsComponent from './RecentCommentsComponent';
import { SatisfactionTrendChart } from './SatisfactionTrendChart';
import AssistantComparisonChart from './AssistantComparisonChart';
import PerformanceStatsComponent from './PerformanceStatsComponent';
import FeedbackDistributionChart from './FeedbackDistributionChart';
import {
  mockRecentFeedbacks,
  mockRatingDistribution,
  mockAssistantComparison,
} from '../../../../_mock/_mock_taux_ai';

import type {
  FilterOptions,
  FeedbackComment,
  RatingDistribution,
  AssistantSatisfactionData,
} from './type';

// Couleurs pour les graphiques
const COLORS = ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'];

// Définition des filtres par défaut
const defaultFilters: FilterOptions = {
  period: 'last7days',
  levels: ['all'],
  types: ['all'],
  subjects: [],
  chapters: [],
  exercises: [],
  level: 'all',
  type: 'all',
  searchTerm: '', // Add this line
};

const SatisfactionRateView: React.FC = () => {
  // États pour les filtres
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  // États pour les données
  const [assistantComparison, setAssistantComparison] = useState<AssistantSatisfactionData[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<RatingDistribution[]>([]);
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // État pour les filtres actifs (pour affichage)
  const [activeFilterCount, setActiveFilterCount] = useState<number>(0);

  // Calculer le nombre de filtres actifs pour l'affichage
  useEffect(() => {
    let count = 0;

    // Vérifier si period n'est pas la valeur par défaut
    if (filters.period !== defaultFilters.period) {
      count += 1;
    }

    // Vérifier les niveaux
    if (!filters.levels.includes('all') && filters.levels.length > 0) {
      count += 1;
    }

    // Vérifier les types d'assistants
    if (!filters.types.includes('all') && filters.types.length > 0) {
      count += 1;
    }

    // Vérifier les matières, chapitres et exercices
    if (filters.subjects && filters.subjects.length > 0) count += 1;
    if (filters.chapters && filters.chapters.length > 0) count += 1;
    if (filters.exercises && filters.exercises.length > 0) count += 1;

    setActiveFilterCount(count);
  }, [filters]);

  // Effet pour charger les données en fonction des filtres
  useEffect(() => {
    // Simule un chargement de données avec un délai pour montrer le loading state
    setIsLoading(true);

    // Simuler une requête API
    const fetchTimeout = setTimeout(() => {
      // Charger les données simulées
      setAssistantComparison(mockAssistantComparison);
      setRatingDistribution(mockRatingDistribution);
      setRecentFeedbacks(mockRecentFeedbacks);
      setIsLoading(false);

      // Dans une implémentation réelle, vous feriez un appel API avec les filtres
      console.log('Filtres appliqués:', filters);
    }, 600);

    return () => clearTimeout(fetchTimeout);
  }, [filters]);

  // Gestionnaire pour appliquer les filtres depuis le sidebar
  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Gestionnaire pour réinitialiser les filtres
  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  // Fonction pour exporter les données en CSV
  const handleExportCSV = () => {
    // Logique d'exportation des données au format CSV
    console.log('Exportation des données en CSV...');
    // Implémentation réelle à ajouter
  };

  // Définir les statistiques de performance personnalisées
  const customStats = [
    {
      id: 'total-feedbacks',
      label: 'Total des feedbacks',
      value: 1254,
      change: 7.3,
      changeDirection: 'up' as const,
      color: 'info' as const,
    },
    {
      id: 'satisfaction-rate',
      label: 'Taux de satisfaction global',
      value: 92,
      unit: '%',
      change: 3.5,
      changeDirection: 'up' as const,
      color: 'success' as const,
    },
    {
      id: 'dissatisfaction-rate',
      label: "Taux d'insatisfaction",
      value: 6.5,
      unit: '%',
      change: 2.1,
      changeDirection: 'down' as const,
      color: 'warning' as const,
    },
    {
      id: 'unanswered-feedbacks',
      label: 'Feedbacks sans réponse',
      value: 37,
      change: 15.8,
      changeDirection: 'down' as const,
      color: 'info' as const,
    },
  ];

  // Rendu du composant
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Taux"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Assistant IA', href: paths.dashboard.ai.correction },
          { name: 'Taux' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
          {/* Badge pour indiquer le nombre de filtres actifs */}
          <Badge
            badgeContent={activeFilterCount}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                right: -5,
                top: 5,
              },
            }}
          >
            {/* Composant FilterSidebar pour gérer les filtres */}
            <FilterSidebar
              filters={filters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
          </Badge>
        </Box>

        {/* Afficher les filtres actifs sous forme de chips */}
        <ConditionalComponent isValid={activeFilterCount > 0}>
          <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              <FontAwesomeIcon icon={faFilter} style={{ marginRight: '5px' }} />
              Filtres actifs:
            </Typography>

            <ConditionalComponent isValid={filters.period !== defaultFilters.period}>
              <Chip
                label={`Période: ${
                  filters.period === 'last7days'
                    ? '7 derniers jours'
                    : filters.period === 'last30days'
                      ? '30 derniers jours'
                      : filters.period === 'today'
                        ? "Aujourd'hui"
                        : filters.period === 'yesterday'
                          ? 'Hier'
                          : 'Personnalisée'
                }`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </ConditionalComponent>

            <ConditionalComponent
              isValid={!!(!filters.levels.includes('all') && filters.levels.length > 0)}
            >
              <Chip
                label={`Niveaux: ${filters.levels.length} sélectionnés`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </ConditionalComponent>

            <ConditionalComponent
              isValid={!!(!filters.types.includes('all') && filters.types.length > 0)}
            >
              <Chip
                label={`Assistants: ${filters.types.length} sélectionnés`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </ConditionalComponent>

            <ConditionalComponent isValid={!!(filters.subjects && filters.subjects.length > 0)}>
              <Chip
                label={`Matières: ${(filters.subjects ?? []).length} sélectionnées`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </ConditionalComponent>

            <ConditionalComponent isValid={!!(filters.chapters && filters.chapters.length > 0)}>
              <Chip
                label={`Chapitres: ${(filters.chapters ?? []).length} sélectionnés`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </ConditionalComponent>

            <ConditionalComponent isValid={!!(filters.exercises && filters.exercises.length > 0)}>
              <Chip
                label={`Exercices: ${(filters.exercises ?? []).length} sélectionnés`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </ConditionalComponent>
          </Box>
        </ConditionalComponent>

        {/* Section des statistiques globales */}

        {/* Section des statistiques globales - Utilisation du composant PerformanceStatsComponent avec les couleurs personnalisées */}
        <PerformanceStatsComponent stats={customStats} showDetailedView />

        {/* Section des graphiques */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          {/* Évolution du taux de satisfaction */}
          <Grid item xs={12} md={8}>
            <SatisfactionTrendChart filters={filters} showControls />
          </Grid>

          {/* Répartition des feedbacks */}
          <Grid item xs={12} md={4}>
            <FeedbackDistributionChart data={ratingDistribution} isLoading={isLoading} />
          </Grid>

          {/* Comparaison des assistants */}
          <Grid item xs={12}>
            <AssistantComparisonChart
              data={assistantComparison}
              filters={filters}
              onExportCSV={handleExportCSV}
              isLoading={isLoading}
            />
          </Grid>
        </Grid>

        {/* Section des commentaires récents avec pagination */}
        <Box sx={{ mt: 4 }}>
          <RecentCommentsComponent feedbacks={recentFeedbacks} />
        </Box>
      </Box>
    </DashboardContent>
  );
};

export default SatisfactionRateView;
