// /usagestatistics/components/UserActivityChart.tsx

import type { ApexOptions } from 'apexcharts';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { DateRange, FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { Chart, useChart } from 'src/shared/components/chart';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import ComparisonMenu from './ComparisonMenu';

type Props = {
  title: string;
  subheader?: string;
  filters: FilterValues;
  view: 'children' | 'parents';
};

export default function UserActivityChart({ title, subheader, filters, view }: Props) {
  const theme = useTheme();

  // Local compare state
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);
  const isComparing = Boolean(compareRange);

  const [selectedWeek, setSelectedWeek] = useState('current');
  const handleWeekChange = (event: SelectChangeEvent) => {
    setSelectedWeek(event.target.value);
  };

  // useMemo for stable localFilters
  const localFilters = useMemo(() => ({ ...filters, compareRange }), [filters, compareRange]);
  const { loading, childrenData, parentsData } = useAnalyticsApi(view, localFilters);

  const [chartData, setChartData] = useState<{
    labels: string[];
    series: any[];
    comparisonSeries?: any[];
  }>({ labels: [], series: [] });

  // 1) Always call your chart hook
  const chartOptions = useChart({
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      alpha(theme.palette.primary.main, 0.7),
      alpha(theme.palette.info.main, 0.7),
      alpha(theme.palette.warning.main, 0.7),
    ],
    xaxis: {
      type: 'category',
      categories: chartData.labels,
      labels: {
        formatter: (value: string) => value,
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

  // 2) Then do effect to set chartData
  useEffect(() => {
    if (view === 'children' && childrenData?.activityData) {
      setChartData({
        labels: childrenData.activityData.labels || [],
        series: childrenData.activityData.series || [],
        comparisonSeries: childrenData.activityData.comparisonSeries,
      });
    } else if (view === 'parents' && parentsData?.activityData) {
      setChartData({
        labels: parentsData.activityData.labels || [],
        series: parentsData.activityData.series || [],
        comparisonSeries: parentsData.activityData.comparisonSeries,
      });
    } else {
      setChartData({ labels: [], series: [] });
    }
  }, [view, childrenData, parentsData]);

  // 3) If loading => show spinner
  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title={title} subheader="Chargement des données..." />
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

  // 4) If no data => fallback
  if (!chartData.series || chartData.series.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader title={title} subheader="Aucune donnée disponible" />
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

  // 5) If comparing => show old data only
  const actualSeries = isComparing ? chartData.comparisonSeries ?? [] : chartData.series;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <ComparisonMenu
              isComparing={isComparing}
              currentDateRange={filters.dateRange}
              onCompareToggle={(range: DateRange | null) => setCompareRange(range)}
            />
          </Stack>
        }
      />

      <ConditionalComponent isValid={Boolean(isComparing && compareRange)}>
        <Box sx={{ px: 3, pt: 1 }}>
          <Typography variant="caption">
            Période comparative: {compareRange?.label || 'Période précédente'}
          </Typography>
        </Box>
      </ConditionalComponent>

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={actualSeries}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
