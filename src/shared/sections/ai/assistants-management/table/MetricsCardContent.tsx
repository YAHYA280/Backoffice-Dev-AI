"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faGauge, faChartLine, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { Grid, Stack, Typography, CardContent } from '@mui/material';

// Types definition
type MetricColorKey = 'totalRequests' | 'avgResponseTime' | 'utilizationRate' | 'latencyAlerts';

type IconColors = {
  [Key in MetricColorKey]: string;
};

type MetricsData = {
  totalRequests: number;
  avgResponseTime: number;
  utilizationRate: number;
  latencyAlerts: number;
};

const MetricsCardContent: React.FC = () => {
  // Définition des couleurs avec le type correct
  const iconColors: IconColors = {
    totalRequests: '#1E88E5', // Bleu
    avgResponseTime: '#43A047', // Vert
    utilizationRate: '#FDD835', // Jaune
    latencyAlerts: '#E53935', // Rouge
  };

  const metricsData: MetricsData = {
    totalRequests: 12458,
    avgResponseTime: 1.4,
    utilizationRate: 78.5,
    latencyAlerts: 2,
  };

  return (
    <CardContent>
      <Grid container spacing={2}>
        {[
          {
            icon: faChartLine,
            title: "Requêtes totales",
            value: metricsData.totalRequests,
            gridProps: { xs: 6, sm: 3, md: 3 },
            colorKey: 'totalRequests' as MetricColorKey
          },
          {
            icon: faClock,
            title: "Temps de réponse moyen",
            value: `${metricsData.avgResponseTime} s`,
            gridProps: { xs: 6, sm: 3, md: 3 },
            colorKey: 'avgResponseTime' as MetricColorKey
          },
          {
            icon: faGauge,
            title: "Taux d'utilisation",
            value: `${metricsData.utilizationRate}%`,
            gridProps: { xs: 6, sm: 3, md: 3 },
            colorKey: 'utilizationRate' as MetricColorKey
          },
          {
            icon: faExclamationTriangle,
            title: "Alertes de latence",
            value: metricsData.latencyAlerts,
            gridProps: { xs: 6, sm: 3, md: 3 },
            colorKey: 'latencyAlerts' as MetricColorKey
          }
        ].map((metric, index) => (
          <Grid item key={index} {...metric.gridProps}>
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              sx={{ width: 1, minWidth: 200, p: 2 }}
            >
              <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
                <FontAwesomeIcon
                  icon={metric.icon}
                  size="2x"
                  color={iconColors[metric.colorKey]}
                  style={{ opacity: 0.8 }}
                />
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="subtitle1">{metric.title}</Typography>
                <Typography variant="subtitle2" color="red">
                  {metric.value}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  );
};

export default MetricsCardContent;