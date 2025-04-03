import type { ApexOptions } from 'apexcharts';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Chart, useChart } from 'src/shared/components/chart';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  subheader?: string;
  filters: FilterValues;
  view: 'children' | 'parents';
};

export default function ActivityHeatmap({ title, subheader, filters, view }: Props) {
  const theme = useTheme();
  const [selectedWeek, setSelectedWeek] = useState('current');
  const { childrenData, parentsData } = useAnalyticsApi(view, filters);

  const handleWeekChange = (event: SelectChangeEvent) => {
    setSelectedWeek(event.target.value);
  };

  const getChartData = () => {
    const periods = ['8h-10h', '10h-12h', '12h-14h', '14h-16h', '16h-18h', '18h-20h', '20h-22h'];

    // Days of the week
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // Use data from API
    const data =
      view === 'children'
        ? childrenData?.activityHeatmap || []
        : parentsData?.parentActivityHeatmap || [];

    return { data, days };
  };

  const { data, days } = getChartData();

  // Cast the result to ApexOptions
  const chartOptions = useChart({
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false,
    },
    colors: [view === 'children' ? theme.palette.primary.main : theme.palette.success.main],
    xaxis: {
      categories: days,
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
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="week-select-label">Semaine</InputLabel>
            <Select
              labelId="week-select-label"
              id="week-select"
              value={selectedWeek}
              label="Semaine"
              onChange={handleWeekChange}
            >
              <MenuItem value="previous">Précédente</MenuItem>
              <MenuItem value="current">Actuelle</MenuItem>
              <MenuItem value="next">Prochaine</MenuItem>
            </Select>
          </FormControl>
        }
      />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="heatmap"
          series={data}
          options={chartOptions}
          width="100%"
          height={336}
        />
      </Box>
    </Card>
  );
}
