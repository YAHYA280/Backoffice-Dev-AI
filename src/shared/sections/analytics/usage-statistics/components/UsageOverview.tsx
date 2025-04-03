import type { ColorSchema } from 'src/shared/theme/color-scheme-script';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/shared/theme/css';

import { FontAwesome } from 'src/shared/components/fontawesome';

// ----------------------------------------------------------------------

type StatCardProps = {
  title: string;
  total: number;
  increment: number;
  icon: string;
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
          startColor: alpha(theme.palette[color].light, 0.2),
          endColor: alpha(theme.palette[color].main, 0.2),
        }),
        py: 5,
        borderRadius: 2,
        textAlign: 'center',
        color: `${color}.darker`,
        backgroundColor: 'common.white',
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

export default function UsageOverview() {
  const statsData = [
    {
      title: 'Utilisateurs actifs',
      total: 1892,
      increment: 12.5,
      icon: 'mdi:account-group',
      color: 'primary' as ColorSchema,
    },
    {
      title: 'Durée moyenne de session',
      total: 28,
      increment: 5.2,
      icon: 'mdi:clock-time-four',
      color: 'info' as ColorSchema,
      suffix: 'min',
    },
    {
      title: "Taux d'engagement",
      total: 78,
      increment: -2.3,
      icon: 'mdi:chart-line',
      color: 'warning' as ColorSchema,
      suffix: '%',
    },
    {
      title: 'Utilisateurs à risque',
      total: 85,
      increment: 18.7,
      icon: 'mdi:alert-circle',
      color: 'error' as ColorSchema,
    },
  ];

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
