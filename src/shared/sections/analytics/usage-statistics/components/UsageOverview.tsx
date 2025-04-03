import {
  faUsers,
  faClock,
  faComment,
  faChartLine,
  faUserClock,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { FontAwesome } from 'src/shared/components/fontawesome';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

// ----------------------------------------------------------------------

// Define a type for color schema that matches the theme
type ColorSchema = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

const bgGradient = ({ direction, theme }: { direction: string; theme: any }) => ({
  background: `linear-gradient(${direction}, ${theme.palette.background.neutral}, ${alpha(theme.palette.background.neutral, 0.8)})`,
});

type StatCardProps = {
  title: string;
  total: number;
  increment: number;
  icon: any;
  color?: ColorSchema;
  suffix?: string;
};

function StatCard({
  title,
  total,
  increment,
  icon,
  color = 'primary',
  suffix = '',
}: StatCardProps) {
  const theme = useTheme();

  const isPositive = increment > 0;
  const incrementText = `${isPositive ? '+' : ''}${increment}%`;

  return (
    <Stack
      alignItems="center"
      sx={{
        ...bgGradient({
          direction: '135deg',
          theme,
        }),
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
        color: 'text.primary',
        boxShadow: theme.shadows[2],
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FontAwesome icon={icon} width={36} height={36} />
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h3">{total}</Typography>
        {suffix && <Typography variant="h5">{suffix}</Typography>}
      </Stack>

      <Typography variant="subtitle2" sx={{ opacity: 0.64, mb: 1 }}>
        {title}
      </Typography>

      <Typography
        variant="caption"
        sx={{
          px: 1,
          py: 0.5,
          borderRadius: 1,
          bgcolor: isPositive ? 'success.lighter' : 'error.lighter',
          color: isPositive ? 'success.darker' : 'error.darker',
        }}
      >
        {incrementText} depuis la dernière période
      </Typography>
    </Stack>
  );
}

type Props = {
  view: 'children' | 'parents';
  filters: {
    level: string;
    dateRange: string;
    searchQuery: string;
  };
};

export default function UsageOverview({ view, filters }: Props) {
  const { childrenData, parentsData } = useAnalyticsApi(view, filters);

  const childrenStats = [
    {
      title: 'Utilisateurs actifs',
      total: childrenData?.activeUsers.total || 0,
      increment: childrenData?.activeUsers.increment || 0,
      icon: faUsers,
      color: 'primary' as ColorSchema,
    },
    {
      title: 'Durée moyenne de session',
      total: childrenData?.averageSessionDuration.total || 0,
      increment: childrenData?.averageSessionDuration.increment || 0,
      icon: faClock,
      color: 'info' as ColorSchema,
      suffix: 'min',
    },
    {
      title: "Taux d'engagement",
      total: childrenData?.engagementRate.total || 0,
      increment: childrenData?.engagementRate.increment || 0,
      icon: faChartLine,
      color: 'warning' as ColorSchema,
      suffix: '%',
    },
    {
      title: 'Utilisateurs à risque',
      total: childrenData?.atRiskUsers.total || 0,
      increment: childrenData?.atRiskUsers.increment || 0,
      icon: faExclamationCircle,
      color: 'error' as ColorSchema,
    },
  ];

  const parentsStats = [
    {
      title: 'Parents actifs',
      total: parentsData?.activeParents.total || 0,
      increment: parentsData?.activeParents.increment || 0,
      icon: faUsers,
      color: 'primary' as ColorSchema,
    },
    {
      title: 'Fréquence de connexion',
      total: parentsData?.connectionFrequency.total || 0,
      increment: parentsData?.connectionFrequency.increment || 0,
      icon: faUserClock,
      color: 'info' as ColorSchema,
      suffix: '/sem',
    },
    {
      title: 'Temps moyen de consultation',
      total: parentsData?.averageViewTime.total || 0,
      increment: parentsData?.averageViewTime.increment || 0,
      icon: faClock,
      color: 'warning' as ColorSchema,
      suffix: 'min',
    },
    {
      title: 'Notifications aux enfants',
      total: parentsData?.parentFeedback.total || 0,
      increment: parentsData?.parentFeedback.increment || 0,
      icon: faComment,
      color: 'success' as ColorSchema,
      suffix: '%',
    },
  ];

  const statsData = view === 'children' ? childrenStats : parentsStats;

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid key={index} xs={12} sm={6} md={3}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
}
