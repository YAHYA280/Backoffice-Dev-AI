// /usagestatistics/components/UsageOverview.tsx

import type { FilterValues, DateRange } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useState, useMemo } from 'react';
import {
  faUsers,
  faClock,
  faComment,
  faChartLine,
  faUserClock,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';
import ComparisonMenu from './ComparisonMenu';

type StatCardProps = {
  title: string;
  total: number;
};

function StatCard({ title, total }: StatCardProps) {
  return (
    <Card
      sx={{
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" sx={{ mb: 1 }}>
        {total}
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
        {title}
      </Typography>
    </Card>
  );
}

type Props = {
  view: 'children' | 'parents';
  filters: FilterValues;
};

export default function UsageOverview({ view, filters }: Props) {
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);
  const isComparing = Boolean(compareRange);

  const [selectedWeek, setSelectedWeek] = useState('current');
  const handleWeekChange = (event: SelectChangeEvent) => {
    setSelectedWeek(event.target.value);
  };

  // Merge compareRange
  const localFilters = useMemo(() => ({ ...filters, compareRange }), [filters, compareRange]);
  const { childrenData, parentsData } = useAnalyticsApi(view, localFilters);

  if (view === 'children') {
    const c = childrenData;
    const stats = [
      {
        title: 'Utilisateurs actifs',
        total: isComparing ? c?.activeUsers.comparison ?? 0 : c?.activeUsers.total ?? 0,
      },
      {
        title: 'Durée moyenne session (min)',
        total: isComparing
          ? c?.averageSessionDuration.comparison ?? 0
          : c?.averageSessionDuration.total ?? 0,
      },
      {
        title: "Taux d'engagement (%)",
        total: isComparing ? c?.engagementRate.comparison ?? 0 : c?.engagementRate.total ?? 0,
      },
      {
        title: 'Utilisateurs à risque',
        total: isComparing ? c?.atRiskUsers.comparison ?? 0 : c?.atRiskUsers.total ?? 0,
      },
    ];

    return (
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 2 }}>
          <ComparisonMenu
            isComparing={isComparing}
            currentDateRange={filters.dateRange}
            onCompareToggle={(range) => setCompareRange(range)}
          />
        </Stack>

        {isComparing && compareRange && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
            Comparaison : {compareRange.label || 'Période précédente'}
          </Typography>
        )}

        <Grid container spacing={3}>
          {stats.map((s, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <StatCard title={s.title} total={s.total} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Parents view
  const p = parentsData;
  const stats = [
    {
      title: 'Parents actifs',
      total: isComparing ? p?.activeParents.comparison ?? 0 : p?.activeParents.total ?? 0,
    },
    {
      title: 'Fréquence connexion (/sem)',
      total: isComparing
        ? p?.connectionFrequency.comparison ?? 0
        : p?.connectionFrequency.total ?? 0,
    },
    {
      title: 'Temps moyen consultation (min)',
      total: isComparing ? p?.averageViewTime.comparison ?? 0 : p?.averageViewTime.total ?? 0,
    },
    {
      title: 'Notifications aux enfants (%)',
      total: isComparing ? p?.parentFeedback.comparison ?? 0 : p?.parentFeedback.total ?? 0,
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mb: 2 }}>
        <ComparisonMenu
          isComparing={isComparing}
          currentDateRange={filters.dateRange}
          onCompareToggle={(range) => setCompareRange(range)}
        />
      </Stack>

      {isComparing && compareRange && (
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
          Comparaison : {compareRange.label || 'Période précédente'}
        </Typography>
      )}

      <Grid container spacing={3}>
        {stats.map((s, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <StatCard title={s.title} total={s.total} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
