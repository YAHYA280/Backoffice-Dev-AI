// /usagestatistics/components/ActivityHeatmap.tsx

import type { ApexOptions } from 'apexcharts';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { DateRange, FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

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

export default function ActivityHeatmap({ title, subheader, filters, view }: Props) {
  const theme = useTheme();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWeek, setSelectedWeek] = useState('current');

  // Local comparison
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);
  const isComparing = Boolean(compareRange);

  // useMemo to prevent re-fetch loops
  const localFilters = useMemo(() => ({ ...filters, compareRange }), [filters, compareRange]);

  const { childrenData, parentsData } = useAnalyticsApi(view, localFilters);

  // Decide which data to use
  const data =
    view === 'children'
      ? childrenData?.activityHeatmap || []
      : parentsData?.parentActivityHeatmap || [];

  // Build series (either old or current)
  const getSeries = () =>
    data.map((seriesItem) => ({
      name: seriesItem.name,
      data: isComparing ? seriesItem.comparisonData || [] : seriesItem.data,
    }));

  const mainOptions = useChart({
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false,
    },
    colors: [view === 'children' ? theme.palette.primary.main : theme.palette.success.main],
    xaxis: {
      categories: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      reversed: true,
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        radius: 0,
        useFillColorAsStroke: true,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 20,
              name: 'Faible',
              color:
                view === 'children' ? theme.palette.primary.lighter : theme.palette.success.lighter,
            },
            {
              from: 21,
              to: 40,
              name: 'Modérée',
              color:
                view === 'children' ? theme.palette.primary.light : theme.palette.success.light,
            },
            {
              from: 41,
              to: 60,
              name: 'Moyenne',
              color: view === 'children' ? theme.palette.primary.main : theme.palette.success.main,
            },
            {
              from: 61,
              to: 80,
              name: 'Élevée',
              color: view === 'children' ? theme.palette.primary.dark : theme.palette.success.dark,
            },
          ],
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) =>
          `${value} ${view === 'children' ? 'utilisateurs' : 'parents'}`,
      },
    },
  }) as ApexOptions;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          title ||
          (view === 'children'
            ? "Périodes d'activité des élèves"
            : "Périodes d'activité des parents")
        }
        subheader={subheader || 'Vue hebdomadaire'}
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            <ComparisonMenu
              isComparing={isComparing}
              currentDateRange={filters.dateRange}
              onCompareToggle={setCompareRange}
            />
          </Stack>
        }
      />

      <ConditionalComponent isValid={Boolean(isComparing && compareRange)}>
        <Typography variant="caption" sx={{ pl: 3, pt: 1 }}>
          Période comparative: {compareRange?.label || 'Période précédente'}
        </Typography>
      </ConditionalComponent>

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="heatmap"
          series={getSeries()}
          options={mainOptions}
          width="100%"
          height={336}
        />
      </Box>
    </Card>
  );
}
