import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/shared/components/chart';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { Stack , Select , MenuItem , InputLabel, FormControl } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/shared/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    series: {
      name: string;
      categories: string[];
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ChartOptions;
  };
};

export function UsersPerformancesStatistics({ title, subheader, chart, ...other }: Props) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState('Mensuel');
  const [comparison, setComparison] = useState('');

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

  const comparisonOptions = [
    { value: 'previous_period', label: 'Période précédente' },
    { value: 'previous_year', label: 'Année précédente' },
    { value: 'current_month', label: 'Mois en cours' },
  ];

  const chartOptions = useChart({
    stroke: { width: 2, colors: ['transparent'] },
    colors: chartColors,
    xaxis: { categories: currentSeries?.categories },
    yaxis: [
      {
        title: { text: 'Score moyen (/100)' },
        max: 100,
        min: 0,
        labels: { formatter: (value: number) => `${fNumber(value)}` },
      },
      {
        opposite: true,
        title: { text: 'Exercices réalisés' },
        labels: { formatter: (value: number) => `${fNumber(value)}` },
      },
    ],
    tooltip: {
      y: {
        formatter: (value: number, { seriesIndex }: { seriesIndex: number }) =>
          seriesIndex === 0 ? `${fNumber(value)} / 100` : `${fNumber(value)} exercices`,
      },
    },
    ...chart.options,
  });

  const handleChangeSeries = useCallback((newValue: string) => {
    setSelectedSeries(newValue);
  }, []);

  const handleChangeComparison = useCallback((event: any) => {
    setComparison(event.target.value);
  }, []);

  const scoreMoyenAvg = currentSeries?.data?.[0]?.data?.length
    ? currentSeries.data[0].data.reduce((a, b) => a + b, 0) / currentSeries.data[0].data.length
    : 0;
  const exercicesAvg = currentSeries?.data?.[1]?.data?.length
    ? currentSeries.data[1].data.reduce((a, b) => a + b, 0) / currentSeries.data[1].data.length
    : 0;

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack direction="row" spacing={2}>
            <ChartSelect
              options={chart.series.map((item) => item.name)}
              value={selectedSeries}
              onChange={handleChangeSeries}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="compare-select-label">Comparer à</InputLabel>
              <Select
                labelId="compare-select-label"
                value={comparison}
                label="Comparer à"
                onChange={handleChangeComparison}
              >
                {comparisonOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartOptions?.colors}
        labels={currentSeries?.data.map((item) => item.name) || []}
        sublabels={['Moyenne sur la période', 'Total sur la période']}
        values={[`${fNumber(scoreMoyenAvg / 100)} `, `${fNumber(exercicesAvg)} exercices`]}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="bar"
        series={currentSeries?.data}
        options={chartOptions}
        height={320}
        loadingProps={{ sx: { p: 2.5 } }}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
