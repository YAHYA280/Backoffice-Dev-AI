import { useState } from 'react';
import type { ApexOptions } from 'apexcharts';
import type { SelectChangeEvent } from '@mui/material/Select';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { Chart, useChart } from 'src/shared/components/chart';

// ----------------------------------------------------------------------

type FilterValues = {
  level: string;
  dateRange: string;
  searchQuery: string;
};

type Props = {
  title: string;
  subheader?: string;
  filters: FilterValues;
};

export default function ActivityHeatmap({ title, subheader, filters }: Props) {
  const theme = useTheme();
  const [selectedWeek, setSelectedWeek] = useState('current');

  const handleWeekChange = (event: SelectChangeEvent) => {
    setSelectedWeek(event.target.value);
  };

  // Mock data for the heatmap
  const getChartData = () => {
    // Time periods of the day
    const periods = ['8h-10h', '10h-12h', '12h-14h', '14h-16h', '16h-18h', '18h-20h', '20h-22h'];

    // Days of the week
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // Generate heatmap data - the values represent activity levels
    let data = [];

    if (selectedWeek === 'previous') {
      data = [
        { name: periods[0], data: [45, 52, 68, 49, 40, 10, 5] },
        { name: periods[1], data: [50, 55, 72, 55, 45, 8, 2] },
        { name: periods[2], data: [20, 22, 25, 20, 18, 5, 1] },
        { name: periods[3], data: [60, 65, 70, 58, 55, 15, 8] },
        { name: periods[4], data: [68, 72, 75, 70, 65, 20, 10] },
        { name: periods[5], data: [52, 55, 58, 50, 48, 30, 22] },
        { name: periods[6], data: [25, 28, 30, 27, 22, 15, 10] },
      ];
    } else if (selectedWeek === 'next') {
      data = [
        { name: periods[0], data: [48, 55, 70, 52, 42, 12, 6] },
        { name: periods[1], data: [53, 58, 75, 58, 47, 10, 3] },
        { name: periods[2], data: [23, 25, 28, 22, 20, 7, 2] },
        { name: periods[3], data: [62, 68, 73, 60, 57, 18, 10] },
        { name: periods[4], data: [70, 75, 78, 72, 67, 22, 12] },
        { name: periods[5], data: [55, 58, 60, 52, 50, 32, 24] },
        { name: periods[6], data: [28, 30, 32, 29, 25, 17, 12] },
      ];
    } else {
      data = [
        { name: periods[0], data: [42, 50, 65, 45, 38, 8, 3] },
        { name: periods[1], data: [48, 52, 70, 52, 42, 5, 1] },
        { name: periods[2], data: [18, 20, 22, 18, 15, 3, 0] },
        { name: periods[3], data: [58, 62, 68, 55, 52, 12, 5] },
        { name: periods[4], data: [65, 70, 72, 68, 62, 18, 8] },
        { name: periods[5], data: [50, 52, 55, 48, 45, 28, 20] },
        { name: periods[6], data: [22, 25, 28, 24, 20, 12, 8] },
      ];
    }

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
    colors: [theme.palette.primary.main],
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
              color: theme.palette.primary.lighter,
            },
            {
              from: 21,
              to: 40,
              name: 'Modérée',
              color: theme.palette.primary.light,
            },
            {
              from: 41,
              to: 60,
              name: 'Moyenne',
              color: theme.palette.primary.main,
            },
            {
              from: 61,
              to: 80,
              name: 'Élevée',
              color: theme.palette.primary.dark,
            },
          ],
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value} utilisateurs`,
      },
    },
  }) as ApexOptions;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        subheader={subheader}
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
