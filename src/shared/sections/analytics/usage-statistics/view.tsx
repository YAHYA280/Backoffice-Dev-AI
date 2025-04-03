'use client';

import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { useSettingsContext } from 'src/shared/components/settings';

import SearchBar from './components/SearchBar';
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
  const settings = useSettingsContext();
  const [filters, setFilters] = useState({
    level: 'all',
    dateRange: 'last30days',
    searchQuery: '',
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleSearch = (query: string) => {
    setFilters({ ...filters, searchQuery: query });
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

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid xs={12} md={8}>
          <SearchBar onSearch={handleSearch} />
        </Grid>
        <Grid xs={12} md={4}>
          <FilterSection filters={filters} onFilterChange={handleFilterChange} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Usage Overview Section */}
        <Grid xs={12}>
          <UsageOverview />
        </Grid>

        {/* Charts Section */}
        <Grid xs={12} md={8}>
          <UserActivityChart
            title="Temps d'utilisation moyen"
            subheader="Par niveau et période"
            filters={filters}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <ActiveUsersChart
            title="Utilisateurs actifs"
            subheader="Activité quotidienne"
            filters={filters}
          />
        </Grid>

        <Grid xs={12} md={5}>
          <DisengagedUsersList title="Utilisateurs à risque" filters={filters} />
        </Grid>

        <Grid xs={12} md={7}>
          <ActivityHeatmap
            title="Périodes d'activité"
            subheader="Vue hebdomadaire"
            filters={filters}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
