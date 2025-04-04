import type { DateRange, FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useMemo, useState } from 'react';
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

import { FontAwesome } from 'src/shared/components/fontawesome';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import ComparisonMenu from './ComparisonMenu';

type StatCardProps = {
  title: string;
  total: number;
  icon: any;
  color: string;
};

function StatCard({ title, total, icon, color }: StatCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
        bgcolor: () => alpha(theme.palette.grey[100], 0.8),
        boxShadow: () => `0 0 2px ${alpha(theme.palette.grey[500], 0.2)}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Icon background */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 80,
          height: 80,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: () => alpha(color, 0.1),
          color,
          opacity: 0.5,
        }}
      >
        <FontAwesome icon={icon} width={32} />
      </Box>

      <Typography variant="h3" sx={{ mb: 1 }}>
        {total}
      </Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
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
  const theme = useTheme();
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);
  const isComparing = Boolean(compareRange);

  // Merge compareRange
  const localFilters = useMemo(() => ({ ...filters, compareRange }), [filters, compareRange]);
  const { childrenData, parentsData } = useAnalyticsApi(view, localFilters);

  if (view === 'children') {
    const c = childrenData;
    const stats = [
      {
        title: 'Utilisateurs actifs',
        total: isComparing ? c?.activeUsers.comparison ?? 0 : c?.activeUsers.total ?? 0,
        icon: faUsers,
        color: theme.palette.primary.main,
      },
      {
        title: 'Durée moyenne session (min)',
        total: isComparing
          ? c?.averageSessionDuration.comparison ?? 0
          : c?.averageSessionDuration.total ?? 0,
        icon: faClock,
        color: theme.palette.info.main,
      },
      {
        title: "Taux d'engagement (%)",
        total: isComparing ? c?.engagementRate.comparison ?? 0 : c?.engagementRate.total ?? 0,
        icon: faChartLine,
        color: theme.palette.success.main,
      },
      {
        title: 'Utilisateurs à risque',
        total: isComparing ? c?.atRiskUsers.comparison ?? 0 : c?.atRiskUsers.total ?? 0,
        icon: faExclamationCircle,
        color: theme.palette.error.main,
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
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Comparaison : {compareRange.label || 'Période précédente'}
          </Typography>
        )}

        <Grid container spacing={3}>
          {stats.map((s, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <StatCard title={s.title} total={s.total} icon={s.icon} color={s.color} />
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
      icon: faUsers,
      color: theme.palette.primary.main,
    },
    {
      title: 'Fréquence connexion (/sem)',
      total: isComparing
        ? p?.connectionFrequency.comparison ?? 0
        : p?.connectionFrequency.total ?? 0,
      icon: faUserClock,
      color: theme.palette.info.main,
    },
    {
      title: 'Temps moyen consultation (min)',
      total: isComparing ? p?.averageViewTime.comparison ?? 0 : p?.averageViewTime.total ?? 0,
      icon: faClock,
      color: theme.palette.success.main,
    },
    {
      title: 'Notifications aux enfants (%)',
      total: isComparing ? p?.parentFeedback.comparison ?? 0 : p?.parentFeedback.total ?? 0,
      icon: faComment,
      color: theme.palette.warning.main,
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
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Comparaison : {compareRange.label || 'Période précédente'}
        </Typography>
      )}

      <Grid container spacing={3}>
        {stats.map((s, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <StatCard title={s.title} total={s.total} icon={s.icon} color={s.color} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
