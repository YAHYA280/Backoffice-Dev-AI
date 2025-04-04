// /usagestatistics/view.tsx

'use client';

import type { DateRange } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';
import { useState } from 'react';
import { subDays } from 'date-fns';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import ViewToggle from './components/ViewToggle';
import UnifiedFilter from './components/UnifiedFilter';
import UsageOverview from './components/UsageOverview';
import ActivityHeatmap from './components/ActivityHeatmap';
import ActiveUsersChart from './components/ActiveUsersChart';
import UserActivityChart from './components/UserActivityChart';
import DisengagedUsersList from './components/DisengagedUsersList';

export function UsageStatisticsView({ title = `Statistiques d'usage` }: { title?: string }) {
  const [view, setView] = useState<'children' | 'parents'>('children');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

  // Global date range for "current" data across all charts
  const initialDateRange: DateRange = {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: '30 derniers jours',
  };

  // Our global "filters" state
  const [filters, setFilters] = useState({
    level: 'all',
    dateRange: initialDateRange,
    searchQuery: '',
    engagementRate: 'all',
    connectionFrequency: 'all',
    parentActivity: 'all',
  });

  // Called any time the user picks new date range or other filters
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    // Show loading indicator briefly
    setIsLoading(true);

    // Update filters
    setFilters({ ...filters, ...newFilters });

    // Show filter applied notification
    setFilterApplied(true);

    // Simulate a brief loading period for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  // Handle filter notification close
  const handleCloseNotification = () => {
    setFilterApplied(false);
  };

  // Switch between children/parents
  const handleViewChange = (newView: 'children' | 'parents') => {
    // Show loading indicator briefly
    setIsLoading(true);

    setView(newView);
    // Reset some filters if needed
    setFilters((prev) => ({
      ...prev,
      level: 'all',
      searchQuery: '',
      engagementRate: 'all',
      connectionFrequency: 'all',
      parentActivity: 'all',
    }));

    // Simulate a brief loading period for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 2, md: 3 } }}>
        {title}
      </Typography>

      {/* Toggle between "children" and "parents" */}
      <ViewToggle view={view} onViewChange={handleViewChange} />

      {/* Position the unified filter on the right */}
      <Grid container justifyContent="flex-end" sx={{ mb: 3 }}>
        <Grid>
          <UnifiedFilter filters={filters} view={view} onFilterChange={handleFilterChange} />
        </Grid>
      </Grid>

      {isLoading ? (
        <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Application des filtres en cours...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid xs={12}>
            <UsageOverview view={view} filters={filters} />
          </Grid>

          <Grid xs={12} md={8}>
            <UserActivityChart
              title={
                view === 'children' ? "Temps d'utilisation moyen" : 'Temps de consultation moyen'
              }
              subheader={
                view === 'children' ? 'Par niveau et période' : "Par niveau d'enfant et période"
              }
              filters={filters}
              view={view}
            />
          </Grid>

          <Grid xs={12} md={4}>
            <ActiveUsersChart
              title={view === 'children' ? 'Utilisateurs actifs' : 'Parents actifs'}
              subheader={view === 'children' ? 'Activité quotidienne' : 'Connexions quotidiennes'}
              filters={filters}
              view={view}
            />
          </Grid>

          <Grid xs={12} md={5}>
            <DisengagedUsersList
              title={view === 'children' ? 'Utilisateurs à risque' : 'Parents peu actifs'}
              filters={filters}
              view={view}
            />
          </Grid>

          <Grid xs={12} md={7}>
            <ActivityHeatmap
              title={
                view === 'children'
                  ? "Périodes d'activité des élèves"
                  : "Périodes d'activité des parents"
              }
              subheader="Vue hebdomadaire"
              filters={filters}
              view={view}
            />
          </Grid>
        </Grid>
      )}

      {/* Notification when filters are applied */}
      <Snackbar
        open={filterApplied}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity="success" sx={{ width: '100%' }}>
          Filtres appliqués avec succès
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}
