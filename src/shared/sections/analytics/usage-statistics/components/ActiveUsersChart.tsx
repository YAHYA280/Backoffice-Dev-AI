import type { ApexOptions } from 'apexcharts';
import type { FilterValues } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/shared/components/chart';

import { useAnalyticsApi } from 'src/shared/sections/analytics/hooks/useAnalyticsApi';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  subheader?: string;
  filters: FilterValues;
  view: 'children' | 'parents';
};

export default function ActiveUsersChart({ title, subheader, filters, view }: Props) {
  const theme = useTheme();
  const { childrenData, parentsData } = useAnalyticsApi(view, filters);

  // Get the appropriate data based on the current view
  const chartData = () => {
    let data: number[] = [];
    let categories: string[] = [];

    if (view === 'children') {
      categories = childrenData?.activeUsersData.categories || [];
      data = childrenData?.activeUsersData.data || [];
    } else {
      categories = parentsData?.activeParentsData.categories || [];
      data = parentsData?.activeParentsData.data || [];
    }

    return { data, categories };
  };

  const { data, categories } = chartData();

  // Cast to ApexOptions to avoid the TS error
  const chartOptions = useChart({
    colors: [view === 'children' ? theme.palette.info.main : theme.palette.success.main],
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
      />

      <Box sx={{ mx: 3 }}>
        <Chart
          dir="ltr"
          type="bar"
          series={[{ data }]}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}
