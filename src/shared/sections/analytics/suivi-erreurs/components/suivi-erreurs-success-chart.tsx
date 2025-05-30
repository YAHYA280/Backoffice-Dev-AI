import type { CardProps } from '@mui/material/Card';

import { useMemo } from 'react';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { Stack, IconButton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

import { Chart, useChart } from 'src/shared/components/chart';

// ----------------------------------------------------------------------

type ChartData = {
  months: string[];
  series: {
    name: string;
    data: number[];
  }[];
};

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chartData: ChartData;
};

export function SuiviErreursSuccessChart({
  title = 'Évolution du taux de réussite',
  subheader,
  chartData,
  ...other
}: Props) {
  const theme = useTheme();

  // Calculate global success rate from all subjects
  const globalSuccessRate = useMemo(() => {
    const months = chartData.months.length;
    const globalData = Array(months).fill(0);

    // Sum success rates for each month across all subjects
    chartData.series.forEach((subject) => {
      subject.data.forEach((value, index) => {
        globalData[index] += value;
      });
    });

    // Calculate average (divide by number of subjects)
    const numberOfSubjects = chartData.series.length;
    return globalData.map(total => total / numberOfSubjects);
  }, [chartData]);

  const chartSeries = useMemo(() => [
      {
        name: 'Taux de réussite global',
        type: 'line',
        data: globalSuccessRate,
      },
      ...chartData.series.map(subject => ({
        name: subject.name,
        type: 'line',
        data: subject.data,
      })),
    ], [chartData.series, globalSuccessRate]);

  const chartOptions = useChart({
    chart: {
      stacked: false,
      zoom: {
        enabled: false,
      },
      animations: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [
      '#4e86ff', 
      '#ffbb00', 
      '#72cc59', 
      '#5199ee', 
      '#e57878', 
      '#9c6bcc', 
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2.5, 2, 2, 2, 2, 2],
      curve: 'smooth',
      dashArray: [0, 3, 3, 3, 3, 3], 
    },
    fill: {
      type: ['solid', 'solid', 'solid', 'solid', 'solid', 'solid'],
      opacity: [0, 1, 1, 1, 1, 1],
    },
    xaxis: {
      categories: chartData.months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      min: 50,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => `${value}%`,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => `${value.toFixed(1)}%`,
      },
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetX: -10,
        offsetY: 0,
        labels: {
          useSeriesColors: false,
        },
        itemMargin: {
          horizontal: 10,
        },
      },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
    ],
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{ mb: 2 }}
        action={
          <Stack direction="row" spacing={1}>
            <Button 
              size="small" 
              startIcon={<FileDownloadIcon />}
              sx={{ mr: 1 }}
            >
              Exporter
            </Button>
            <IconButton size="small">
              <FilterListIcon />
            </IconButton>
          </Stack>
        }
      />


      <Chart
        type="line"
        series={chartSeries}
        options={chartOptions}
        height={380}
      />
    </Card>
  );
}