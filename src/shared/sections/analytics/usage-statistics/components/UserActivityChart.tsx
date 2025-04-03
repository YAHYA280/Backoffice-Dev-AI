import type { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

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

export default function UserActivityChart({ title, subheader, filters }: Props) {
  const theme = useTheme();

  // Mock data - would be fetched from API based on filters in real app
  const getChartData = () => {
    // Base dates for x-axis
    const baseLabels = [
      '01/03/2025',
      '02/03/2025',
      '03/03/2025',
      '04/03/2025',
      '05/03/2025',
      '06/03/2025',
      '07/03/2025',
      '08/03/2025',
      '09/03/2025',
      '10/03/2025',
      '11/03/2025',
      '12/03/2025',
    ];

    // Data variations based on selected level
    if (filters.level === 'CP') {
      return {
        labels: baseLabels,
        series: [
          {
            name: 'CP',
            type: 'line',
            fill: 'solid',
            data: [20, 23, 22, 25, 24, 28, 30, 32, 30, 29, 30, 31],
          },
        ],
      };
    } else if (filters.level === 'CM1') {
      return {
        labels: baseLabels,
        series: [
          {
            name: 'CM1',
            type: 'line',
            fill: 'solid',
            data: [32, 30, 33, 35, 37, 36, 38, 40, 42, 41, 39, 38],
          },
        ],
      };
    } else if (filters.level === 'CM2') {
      return {
        labels: baseLabels,
        series: [
          {
            name: 'CM2',
            type: 'line',
            fill: 'solid',
            data: [25, 26, 28, 30, 33, 35, 34, 32, 33, 35, 37, 36],
          },
        ],
      };
    } else {
      // All levels
      return {
        labels: baseLabels,
        series: [
          {
            name: 'CP',
            type: 'line',
            fill: 'solid',
            data: [20, 23, 22, 25, 24, 28, 30, 32, 30, 29, 30, 31],
          },
          {
            name: 'CM1',
            type: 'line',
            fill: 'solid',
            data: [32, 30, 33, 35, 37, 36, 38, 40, 42, 41, 39, 38],
          },
          {
            name: 'CM2',
            type: 'line',
            fill: 'solid',
            data: [25, 26, 28, 30, 33, 35, 34, 32, 33, 35, 37, 36],
          },
        ],
      };
    }
  };

  const { labels, series } = getChartData();

  const chartOptions: ApexOptions = useChart({
    colors: [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main],
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
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
        formatter: (value: number) => {
          return `${value} minutes`;
        },
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
  });

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="line"
          series={series}
          options={chartOptions}
          labels={labels}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
