// /usagestatistics/components/ActiveUsersChart.tsx

import type { ApexOptions } from 'apexcharts';
import type { FilterValues, DateRange } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { useTheme, alpha } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { fNumber } from 'src/utils/format-number';
import { Chart, useChart } from 'src/shared/components/chart';
import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';
import ComparisonMenu from './ComparisonMenu';

type Props = {
  title: string;
  subheader?: string;
  filters: FilterValues;
  view: 'children' | 'parents';
};

export default function ActiveUsersChart({ title, subheader, filters, view }: Props) {
  const theme = useTheme();
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);
  const isComparing = Boolean(compareRange);

  const [selectedWeek, setSelectedWeek] = useState('current');
  const handleWeekChange = (event: SelectChangeEvent) => {
    setSelectedWeek(event.target.value);
  };

  // useMemo to prevent infinite loops
  const localFilters = useMemo(() => ({ ...filters, compareRange }), [filters, compareRange]);
  const { childrenData, parentsData } = useAnalyticsApi(view, localFilters);

  // Data from API
  const categories =
    view === 'children'
      ? childrenData?.activeUsersData.categories || []
      : parentsData?.activeParentsData.categories || [];
  const currentData =
    view === 'children'
      ? childrenData?.activeUsersData.data || []
      : parentsData?.activeParentsData.data || [];
  const oldData =
    view === 'children'
      ? childrenData?.activeUsersData.comparisonData
      : parentsData?.activeParentsData.comparisonData;

  // If we are comparing, show only old data. Else show current data
  const series = isComparing
    ? [{ name: 'Période comparative', data: oldData || [] }]
    : [{ name: 'Période actuelle', data: currentData }];

  const chartOptions = useChart({
    colors: [
      view === 'children' ? theme.palette.info.main : theme.palette.success.main,
      alpha(view === 'children' ? theme.palette.info.main : theme.palette.success.main, 0.6),
    ],
    plotOptions: {
      bar: {
        columnWidth: '60%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (value: number) => fNumber(value),
        title: {
          formatter: () => (view === 'children' ? 'Utilisateurs actifs' : 'Parents actifs'),
        },
      },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (value: number) => fNumber(value),
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => fNumber(val),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [theme.palette.text.secondary],
      },
    },
  }) as ApexOptions;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title || (view === 'children' ? 'Utilisateurs actifs' : 'Parents actifs')}
        subheader={
          subheader || (view === 'children' ? 'Activité quotidienne' : 'Connexions quotidiennes')
        }
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

      {isComparing && compareRange && (
        <Box sx={{ px: 3, pt: 1 }}>
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
            Période comparative: {compareRange.label || 'Période précédente'}
          </Typography>
        </Box>
      )}

      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
