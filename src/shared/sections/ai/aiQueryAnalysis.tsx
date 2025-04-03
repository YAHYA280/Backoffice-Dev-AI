import type { CardProps } from '@mui/material/Card';
import type { ChartOptions } from 'src/shared/components/chart';

import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

import { CATEGORIES_AI_ASSISTANT } from 'src/shared/_mock/_ai';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/shared/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  chart: {
    colors?: string[];
    categories?: string[];
    series: {
      name: string;
      data: {
        name: string;
        data: number[];
      }[];
    }[];
    options?: ChartOptions;
  };
  periode: 'Hebdomadaire' | 'Mensuel' | 'Annuel';
  onPeriodeChange: (periode: 'Hebdomadaire' | 'Mensuel' | 'Annuel') => void;
};

export function AiQueryAnalysis({
  title,
  subheader,
  chart,
  periode,
  onPeriodeChange,
  ...other
}: Props) {
  const theme = useTheme();

  // Extraire les options pour chaque sélecteur basé sur les données reçues
  const categoryOptions = CATEGORIES_AI_ASSISTANT;

  const periodOptions = ['Hebdomadaire', 'Mensuel', 'Annuel'];

  // États pour chaque sélecteur
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];
  const currentCategoryData = chart.series.find((item) => item.name === selectedCategory);

  const chartData = currentCategoryData?.data || [];

  // Gestionnaires de changement pour chaque sélecteur
  const handleChangeCategory = useCallback((newValue: string) => {
    setSelectedCategory(newValue);
  }, []);

  const handleChangePeriod = useCallback(
    (newValue: string) => {
      onPeriodeChange(newValue as 'Hebdomadaire' | 'Mensuel' | 'Annuel');
    },
    [onPeriodeChange]
  );

  // Options du graphique
  const chartOptions = useChart({
    colors: chartColors,
    xaxis: { categories: chart.categories },
    chart: {
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
        export: {
          csv: {
            filename: `${title || 'Analyse'}_${selectedCategory}_${periode}`,
            columnDelimiter: ',',
          },
          svg: {
            filename: `${title || 'Analyse'}_${selectedCategory}_${periode}`,
          },
          png: {
            filename: `${title || 'Analyse'}_${selectedCategory}_${periode}`,
          },
        },
      },
    },
    ...chart.options,
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack direction="row" spacing={2}>
            <ChartSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleChangeCategory}
            />
            <ChartSelect options={periodOptions} value={periode} onChange={handleChangePeriod} />
          </Stack>
        }
        sx={{ mb: 3 }}
      />

      <ChartLegends
        colors={chartColors.slice(0, chartData.length)}
        labels={chartData.map((item) => item.name)}
        values={chartData.map((item, index) =>
          fShortenNumber(item.data.reduce((sum, current) => sum + current, 0) / item.data.length)
        )}
        sx={{ px: 3, gap: 3 }}
      />

      <Chart
        type="area"
        series={chartData}
        options={chartOptions}
        height={320}
        loadingProps={{ sx: { p: 2.5 } }}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
