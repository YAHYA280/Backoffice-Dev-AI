import type { ApexOptions } from 'apexcharts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fNumber } from 'src/utils/format-number';

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

export default function ActiveUsersChart({ title, subheader, filters }: Props) {
  const theme = useTheme();

  // Mock data - would be fetched from API based on filters in real app
  const getChartData = () => {
    // Different data for different filters
    let data: number[] = [];
    let categories: string[] = [];

    // Sample weekday data
    categories = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    switch (filters.level) {
      case 'CP':
        data = [452, 428, 510, 450, 445, 348, 280];
        break;
      case 'CM1':
        data = [620, 598, 615, 629, 618, 452, 389];
        break;
      case 'CM2':
        data = [589, 595, 618, 609, 588, 420, 350];
        break;
      default:
        // All levels combined
        data = [1661, 1621, 1743, 1688, 1651, 1220, 1019];
    }

    return { data, categories };
  };

  const { data, categories } = getChartData();

  // Cast to ApexOptions to avoid the TS error
  const chartOptions = useChart({
    colors: [theme.palette.info.main],
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
          formatter: () => 'Utilisateurs actifs',
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
      <CardHeader title={title} subheader={subheader} />

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
