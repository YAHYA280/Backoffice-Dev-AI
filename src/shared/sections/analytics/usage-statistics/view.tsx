'use client';

import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import SearchBar from './components/SearchBar';
import ViewToggle from './components/ViewToggle';
import FilterSection from './components/FilterSection';
import UsageOverview from './components/UsageOverview';
import ActivityHeatmap from './components/ActivityHeatmap';
import ActiveUsersChart from './components/ActiveUsersChart';
import UserActivityChart from './components/UserActivityChart';
import DisengagedUsersList from './components/DisengagedUsersList';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function UsageStatisticsView({ title = `Statistiques d'usage` }: Props) {
  // Add state for view toggle (children/parents)
  const [view, setView] = useState<'children' | 'parents'>('children');

  const [filters, setFilters] = useState({
    level: 'all',
    dateRange: 'last30days',
    searchQuery: '',
    engagementRate: 'all', // Pour la vue enfants
    connectionFrequency: 'all', // Pour la vue parents
    parentActivity: 'all', // Pour la vue parents
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
  };

  const handleViewChange = (newView: 'children' | 'parents') => {
    setView(newView);
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
      engagementRate: 'all',
      connectionFrequency: 'all',
      parentActivity: 'all',
    }));
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 2, md: 3 },
        }}
      >
        {title}
      </Typography>

      <ViewToggle view={view} onViewChange={handleViewChange} />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} md={8}>
          <SearchBar onSearch={handleSearch} view={view} />
        </Grid>
        <Grid xs={12} md={4}>
          <FilterSection filters={filters} onFilterChange={handleFilterChange} view={view} />
        </Grid>
      </Grid>

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
    </DashboardContent>
  );
}
