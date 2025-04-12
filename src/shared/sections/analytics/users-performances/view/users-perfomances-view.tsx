'use client';

import { useMemo, useState, useEffect } from 'react';

import { Grid, Stack } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean, useSetState } from 'src/hooks';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import {
  userPerformancesData,
  subjectPerformanceData,
  subjectsPerformanceData,
} from 'src/shared/_mock';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { UsersPerformancesFilters } from '../users-performances-filters';
import { UsersPerformancesOverview } from '../users-performances-overview';
import { UsersPerformancesStatistics } from '../users-performances-statistics';
import { UsersPerformancesModulesTable } from '../users-performances-modules-table';
import { UsersPerformancesModulesPieChart } from '../users-performances-modules-pie';

import type { IPerformanceFilters } from '../users-performances-filters';

// ----------------------------------------------------------------------

const MOCK_USERS = [
  { id: '1', name: 'John Doe'},
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Robert Johnson' },
];

const MOCK_SUBJECTS = [
  { id: '1', name: 'Mathématiques' },
  { id: '2', name: 'Français' },
  { id: '3', name: 'Histoire' },
  { id: '4', name: 'Sciences' },
  { id: '5', name: 'Langues étrangères' },
  { id: '6', name: 'Arts et culture' },
];

const PERFORMANCE_LEVELS = ['Excellent', 'Bon', 'Moyen', 'Faible'];

const ENGAGEMENT_LEVELS = ['Très actif', 'Actif', 'Modéré', 'Faible'];
const TREND_DIRECTIONS = ['Positive', 'Négative'];
const PARENT_ENGAGEMENT = ['Élevé', 'Moyen', 'Faible'];

const PERFORMANCE_LEVEL_RANGES = {
  'Excellent': [85, 100],
  'Bon': [70, 84],
  'Moyen': [50, 69],
  'Faible': [0, 49],
};

const JAN_FEB_DATA = {
  subjects: [
    {
      id: '1',
      matiere: 'Mathématiques',
      noteAvg: 81,
      completionRate: 78,
      engagement: 73,
      trend: { value: 2.5, isPositive: true },
    },
    {
      id: '2',
      matiere: 'Français',
      noteAvg: 75,
      completionRate: 72,
      engagement: 68,
      trend: { value: 1.2, isPositive: true },
    },
    {
      id: '3',
      matiere: 'Sciences',
      noteAvg: 83,
      completionRate: 76,
      engagement: 79,
      trend: { value: 3.8, isPositive: true },
    },
    {
      id: '4',
      matiere: 'Histoire-Géographie',
      noteAvg: 72,
      completionRate: 69,
      engagement: 62,
      trend: { value: 0.8, isPositive: false },
    },
    {
      id: '5',
      matiere: 'Langues étrangères',
      noteAvg: 79,
      completionRate: 74,
      engagement: 71,
      trend: { value: 1.9, isPositive: true },
    },
    {
      id: '6',
      matiere: 'Arts et culture',
      noteAvg: 87,
      completionRate: 82,
      engagement: 85,
      trend: { value: 4.2, isPositive: true },
    },
  ],
  overview: [
    {
      label: 'Étudiants actifs',
      value: 72.5,
      totalValue: '2064',
      additionalInfo: 'sur 2845 inscrits',
      trend: null,
      icon: 'user',
    },
    {
      label: 'Taux de complétion',
      value: 75,
      totalValue: '75%',
      additionalInfo: null,
      trend: '+1.8% ce mois',
      icon: 'chart',
    },
    {
      label: 'Engagement parents',
      value: 65,
      totalValue: '65%',
      additionalInfo: null,
      trend: '+1.2% ce mois',
      icon: 'group',
    },
    {
      label: 'Note moyenne',
      value: 79.5,
      totalValue: '79.5/100',
      additionalInfo: null,
      trend: '+1.8 points',
      icon: 'award',
    },
  ],
  pieChart: {
    series: [
      { label: 'Mathématiques', value: 1180, score: 81 },
      { label: 'Français', value: 920, score: 75 },
      { label: 'Sciences', value: 810, score: 83 },
      { label: 'Histoire-Géographie', value: 680, score: 72 },
      { label: 'Langues étrangères', value: 620, score: 79 },
      { label: 'Arts et culture', value: 430, score: 87 },
    ],
  },
};

const initialFilters: IPerformanceFilters = {
  startDate: null as any,
  endDate: null as any,
  users: [],
  subjects: [],
  performanceLevel: [],
  engagementLevel: [],
  completionRateRange: [0, 100],
  trendDirection: [],
  parentEngagement: [],
  scoreRange: [0, 100],
};

export function UsersPerformancesView() {
  const openFilters = useBoolean(false);
  const filters = useSetState(initialFilters);

  const [filteredSubjectsData, setFilteredSubjectsData] = useState(subjectsPerformanceData);
  const [filteredOverviewData, setFilteredOverviewData] = useState(userPerformancesData);
  const [filteredPieChartData, setFilteredPieChartData] = useState(subjectPerformanceData);

  const canReset = useMemo(
    () =>
      !!filters.state.startDate ||
      !!filters.state.endDate ||
      !!filters.state.users.length ||
      !!filters.state.subjects.length ||
      !!filters.state.performanceLevel.length ||
      !!filters.state.engagementLevel.length ||
      !!filters.state.trendDirection.length ||
      !!filters.state.parentEngagement.length ||
      (filters.state.completionRateRange[0] !== 0 || filters.state.completionRateRange[1] !== 100) ||
      (filters.state.scoreRange[0] !== 0 || filters.state.scoreRange[1] !== 100),
    [filters.state]
  );

  const dateError = useMemo(
    () =>
      filters.state.startDate &&
      filters.state.endDate &&
      new Date(filters.state.endDate as any).getTime() <
        new Date(filters.state.startDate as any).getTime(),
    [filters.state.startDate, filters.state.endDate]
  );

  useEffect(() => {
    let newSubjectsData = [...subjectsPerformanceData];
    let newOverviewData = [...userPerformancesData];
    let newPieChartData = { ...subjectPerformanceData };
    
    if (
      filters.state.startDate && filters.state.endDate &&
      filters.state.startDate.toDate().getMonth() === 0 && // January
      new Date(filters.state.endDate.toDate()).getMonth() === 1 // February
    ) {
      newSubjectsData = JAN_FEB_DATA.subjects;
      newOverviewData = JAN_FEB_DATA.overview;
      newPieChartData = JAN_FEB_DATA.pieChart;
    }
    
    // Apply subject filter
    if (filters.state.subjects.length > 0) {
      newSubjectsData = newSubjectsData.filter(item => 
        filters.state.subjects.includes(item.matiere)
      );
      
      // Also filter pie chart data
      newPieChartData = {
        series: newPieChartData.series.filter(item => 
          filters.state.subjects.includes(item.label)
        )
      };
    }
    
    // Apply performance level filter
    if (filters.state.performanceLevel.length > 0) {
      newSubjectsData = newSubjectsData.filter(item => 
        // Check if the item's completion rate falls within any of the selected performance level ranges
         filters.state.performanceLevel.some(level => {
          const range = PERFORMANCE_LEVEL_RANGES[level as keyof typeof PERFORMANCE_LEVEL_RANGES];
          return item.completionRate >= range[0] && item.completionRate <= range[1];
        })
      );
      
      // Also filter pie chart data based on score
      newPieChartData = {
        series: newPieChartData.series.filter(item => filters.state.performanceLevel.some(level => {
            const range = PERFORMANCE_LEVEL_RANGES[level as keyof typeof PERFORMANCE_LEVEL_RANGES];
            return item.score >= range[0] && item.score <= range[1];
          }))
      };
    }
    
    setFilteredSubjectsData(newSubjectsData);
    setFilteredOverviewData(newOverviewData);
    setFilteredPieChartData(newPieChartData);
    
  }, [filters.state]);

  const renderFilters = (
    <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
      <UsersPerformancesFilters
        filters={filters}
        canReset={canReset}
        dateError={dateError || false}
        open={openFilters.value}
        onOpen={openFilters.onTrue}
        onClose={openFilters.onFalse}
        options={{
          users: MOCK_USERS,
          subjects: MOCK_SUBJECTS,
          performanceLevels: PERFORMANCE_LEVELS,
          engagementLevels: ENGAGEMENT_LEVELS,
          trendDirections: TREND_DIRECTIONS,
          parentEngagementLevels: PARENT_ENGAGEMENT,
        }}
      />
    </Stack>
  );

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Performances des utilisateurs"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Analytiques', href: paths.dashboard.root },
          { name: 'Performances des utilisateurs' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {renderFilters}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UsersPerformancesOverview title="Vue d'ensemble" data={filteredOverviewData} />
        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>
          <UsersPerformancesStatistics
            title="Statistiques des scores des exercices"
            subheader="Évolution des scores et exercices réalisés par période"
            chart={{
              series: [
                {
                  name: 'Quotidien',
                  categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
                  data: [
                    { name: 'Score moyen', data: [85, 78, 92, 88, 76, 80, 91] },
                    { name: 'Exercices réalisés', data: [25, 20, 30, 28, 22, 18, 27] },
                  ],
                },
                {
                  name: 'Hebdomadaire',
                  categories: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
                  data: [
                    { name: 'Score moyen', data: [82, 87, 79, 90] },
                    { name: 'Exercices réalisés', data: [120, 130, 115, 140] },
                  ],
                },
                {
                  name: 'Mensuel',
                  categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
                  data: [
                    { name: 'Score moyen', data: [80, 85, 88, 82, 90] },
                    { name: 'Exercices réalisés', data: [500, 520, 480, 510, 530] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} sx={{ mt: 3 }}>
          <UsersPerformancesModulesTable
            title="Performance par matière"
            subheader="Statistiques détaillées par matière"
            tableData={filteredSubjectsData}
            headLabel={[
              { id: 'matiere', label: 'Matière' },
              { id: 'noteAvg', label: 'Note moyenne' },
              { id: 'completionRate', label: 'Taux de complétion' },
              { id: 'engagement', label: 'Engagement' },
              { id: 'trend', label: 'Tendance' },
            ]}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ mt: 3 }}>
          <UsersPerformancesModulesPieChart
            title="Distribution des performances par matière"
            subheader="Répartition des exercices réalisés et scores moyens par matière"
            chart={filteredPieChartData}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
