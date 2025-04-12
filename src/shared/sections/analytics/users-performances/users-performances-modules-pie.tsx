import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/shared/components/chart';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { Box, Select, MenuItem, InputLabel, Typography , FormControl } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartLegends } from 'src/shared/components/chart';
import ConditionalComponent from 'src/shared/components/conditional-component/ConditionalComponent';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      label: string;
      value: number;
      score?: number;
    }[];
    options?: ChartOptions;
  };
};

export function UsersPerformancesModulesPieChart({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();
  const [comparison, setComparison] = useState('');

  const chartSeries = chart.series.map((item) => item.value);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
  ];

  const comparisonOptions = [
    { value: 'previous_period', label: 'Période précédente' },
    { value: 'previous_year', label: 'Année précédente' },
    { value: 'current_month', label: 'Mois en cours' },
  ];

  const chartOptions = useChart({
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    labels: chart.series.map((item) => item.label),
    stroke: { width: 0 },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: (seriesName: string) => `${seriesName}` },
      },
    },
    plotOptions: { pie: { donut: { labels: { show: false } } } },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <FormControl size="small" sx={{ minWidth: 160, mr: 2 }}>
            <InputLabel id="compare-select-label">Comparer à</InputLabel>
            <Select
              labelId="compare-select-label"
              value={comparison}
              label="Comparer à"
              onChange={(e) => setComparison(e.target.value)}
            >
              {comparisonOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />

      <Chart
        type="pie"
        series={chartSeries}
        options={chartOptions}
        width={{ xs: 240, xl: 260 }}
        height={{ xs: 240, xl: 260 }}
        sx={{ my: 6, mx: 'auto' }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box sx={{ p: 3 }}>
        <ChartLegends
          labels={chartOptions?.labels}
          colors={chartOptions?.colors}
          sx={{ justifyContent: 'center', mb: 2 }}
        />

        {chart.series.map((item, index) => (
          <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', my: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 0.5,
                  bgcolor: chartColors[index],
                  mr: 1,
                }}
              />
              <Typography variant="body2">{item.label}</Typography>
            </Box>
            <ConditionalComponent isValid={item.score !== undefined}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {`Score moyen: ${fNumber((item.score ?? 0) / 100)}`}
                <ConditionalComponent isValid={!!comparison}>
                  <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                    {comparison === 'previous_period' && `vs Période précédente: +5%`}
                    {comparison === 'previous_year' && `vs Année précédente: +12%`}
                    {comparison === 'current_month' && `vs Mois en cours: -2%`}
                  </Typography>
                </ConditionalComponent>
              </Typography>
            </ConditionalComponent>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
