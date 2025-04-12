// src/components/ai-performance/AssistantComparison.tsx

import type { CardProps } from '@mui/material/Card';
import type { SelectChangeEvent } from '@mui/material';
import type { ComparisonType, ComparisonChartData } from 'src/contexts/types/ai-performance';

import { useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import { Stack, Select, MenuItem, Skeleton, FormControl } from '@mui/material';

import { Chart, useChart, ChartSelect } from 'src/shared/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  isLoading?: boolean;
  chart: ComparisonChartData;
  comparisonType?: ComparisonType;
  onComparisonTypeChange?: (type: ComparisonType) => void;
};

export function AssistantComparison({
  title,
  subheader,
  isLoading = false,
  chart,
  comparisonType = 'Sans comparaison',
  onComparisonTypeChange,
  ...other
}: Props) {
  const theme = useTheme();

  // Options pour les sélecteurs
  const metricOptions = useMemo(() => chart.series.map((series) => series.name), [chart.series]);

  const comparisonOptions: ComparisonType[] = useMemo(
    () => ['Sans comparaison', 'Période précédente', 'Mois précédent', 'Année précédente'],
    []
  );

  // États locaux
  const [selectedMetric, setSelectedMetric] = useState(() =>
    metricOptions.length > 0 ? metricOptions[0] : ''
  );

  // Mettre à jour la métrique sélectionnée si les options changent
  useMemo(() => {
    if (metricOptions.length > 0 && !metricOptions.includes(selectedMetric)) {
      setSelectedMetric(metricOptions[0]);
    }
  }, [metricOptions, selectedMetric]);

  // Gestionnaires d'événements optimisés
  const handleChangeMetric = useCallback((newValue: string) => {
    setSelectedMetric(newValue);
  }, []);

  const handleChangeComparison = useCallback(
    (event: SelectChangeEvent<ComparisonType>) => {
      const newValue = event.target.value as ComparisonType;
      if (onComparisonTypeChange) {
        onComparisonTypeChange(newValue);
      }
    },
    [onComparisonTypeChange]
  );

  // Trouver la série actuellement sélectionnée
  const currentSeries = useMemo(
    () => chart.series.find((series) => series.name === selectedMetric),
    [chart.series, selectedMetric]
  );

  // Préparer les données pour le graphique
  const seriesData = useMemo(() => {
    if (!currentSeries || !Array.isArray(currentSeries.data?.[0])) {
      return [];
    }

    // Données de la série principale
    const result = [
      {
        name: currentSeries.name,
        data: [...currentSeries.data[0]],
      },
    ];

    // Ajouter les données de comparaison si disponibles
    if (
      comparisonType !== 'Sans comparaison' &&
      currentSeries.comparisonData &&
      Array.isArray(currentSeries.comparisonData[0])
    ) {
      result.push({
        name: `${currentSeries.name} (${comparisonType})`,
        data: [...currentSeries.comparisonData[0]],
      });
    }

    return result;
  }, [currentSeries, comparisonType]);

  // Couleurs du graphique
  const chartColors = useMemo(
    () =>
      chart.colors ?? [
        theme.palette.primary.main,
        theme.palette.warning.main,
        theme.palette.info.main,
      ],
    [chart.colors, theme.palette]
  );

  // Options du graphique
  const chartOptions = useChart({
    colors: chartColors,
    tooltip: { theme: 'light' },
    legend: { position: 'top', horizontalAlign: 'right' },
    xaxis: {
      categories: currentSeries?.categories || [],
    },
    chart: {
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
        export: {
          csv: {
            filename: `${title || 'Analyse'}_${selectedMetric}_${comparisonType}`,
            columnDelimiter: ',',
          },
          svg: {
            filename: `${title || 'Analyse'}_${selectedMetric}_${comparisonType}`,
          },
          png: {
            filename: `${title || 'Analyse'}_${selectedMetric}_${comparisonType}`,
          },
        },
      },
    },
    ...chart.options,
  });

  // Rendu du squelette pendant le chargement
  if (isLoading) {
    return (
      <Card {...other}>
        <CardHeader
          title={<Skeleton width={200} />}
          subheader={<Skeleton width={120} />}
          action={<Skeleton width={300} height={40} />}
        />
        <Skeleton variant="rectangular" width="100%" height={320} sx={{ p: 3 }} />
      </Card>
    );
  }

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <ChartSelect
              options={metricOptions}
              value={selectedMetric}
              onChange={handleChangeMetric}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={comparisonType}
                onChange={handleChangeComparison}
                size="small"
                displayEmpty
              >
                {comparisonOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        }
      />

      <Chart type="bar" series={seriesData} options={chartOptions} height={320} sx={{ p: 3 }} />
    </Card>
  );
}
