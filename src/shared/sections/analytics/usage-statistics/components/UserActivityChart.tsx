import type { ApexOptions } from 'apexcharts';
import type { FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { Chart, useChart } from 'src/shared/components/chart';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  subheader?: string;
  filters: FilterValues;
  view: 'children' | 'parents';
};

export default function UserActivityChart({ title, subheader, filters, view }: Props) {
  const theme = useTheme();
  const { loading, childrenData, parentsData } = useAnalyticsApi(view, filters);
  const [chartData, setChartData] = useState<{
    labels: string[];
    series: any[];
  }>({ labels: [], series: [] });

  useEffect(() => {
    if (view === 'children' && childrenData?.activityData) {
      setChartData({
        labels: childrenData.activityData.labels || [],
        series: childrenData.activityData.series || [],
      });
    } else if (view === 'parents' && parentsData?.activityData) {
      setChartData({
        labels: parentsData.activityData.labels || [],
        series: parentsData.activityData.series || [],
      });
    }
  }, [view, childrenData, parentsData]);

  // Cast to ApexOptions to avoid the TS error
  const chartOptions = useChart({
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main],
    xaxis: {
      categories: chartData.labels,
      type: 'category', // Changed from datetime to category
      labels: {
        formatter: (value) => value, // Simple formatter to display the value as is
      },
    },
    yaxis: {
      title: {
        text: 'Minutes',
      },
      min: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value} minutes`,
      },
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      fillOpacity: 0,
      strokeOpacity: 0,
      hover: {
        size: 7,
      },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
      lineCap: 'round',
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
    },
  }) as ApexOptions;

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            title ||
            (view === 'children' ? "Temps d'utilisation moyen" : 'Temps de consultation moyen')
          }
          subheader="Chargement des données..."
        />
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 364,
          }}
        >
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (!chartData.series || chartData.series.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title={
            title ||
            (view === 'children' ? "Temps d'utilisation moyen" : 'Temps de consultation moyen')
          }
          subheader="Aucune donnée disponible"
        />
        <Box
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 364,
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Aucune donnée n&apos;est disponible pour la période sélectionnée.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          title ||
          (view === 'children' ? "Temps d'utilisation moyen" : 'Temps de consultation moyen')
        }
        subheader={
          subheader ||
          (view === 'children' ? 'Par niveau et période' : "Par niveau d'enfant et période")
        }
      />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={chartData.series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
