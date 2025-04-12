import type { CardProps } from '@mui/material/Card';
import type { SelectChangeEvent } from '@mui/material';
import type { ChartOptions } from 'src/shared/components/chart';
import type { MetricType, ComparisonType } from 'src/contexts/types/ai-performance';

import dayjs from 'dayjs';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import { Box, Tab, Tabs, Stack } from '@mui/material';

import { fShortenNumber } from 'src/utils/format-number';

import { CATEGORIES_AI_ASSISTANT } from 'src/shared/_mock/_ai';

import { Chart, useChart, ChartSelect, ChartLegends } from 'src/shared/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
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
  comparisonType?: ComparisonType;
  onComparisonTypeChange?: (type: ComparisonType) => void;
};

export function AiQueryAnalysis({
  title,
  subheader,
  startDate = dayjs().subtract(7, 'day'),
  endDate = dayjs(),
  chart,
  comparisonType = 'Sans comparaison',
  onComparisonTypeChange,
  ...other
}: Props) {
  const theme = useTheme();

  // Extraire les options pour chaque sélecteur
  const categoryOptions = CATEGORIES_AI_ASSISTANT;
  const comparisonOptions: ComparisonType[] = [
    'Sans comparaison',
    'Période précédente',
    'Mois précédent',
    'Année précédente',
  ];

  // Liste des métriques disponibles (extraite des données)
  const metricOptions: MetricType[] = useMemo(() => {
    if (chart.series.length && chart.series[0].data.length) {
      return chart.series[0].data.map((item) => item.name) as MetricType[];
    }
    return ['Nombre de requêtes', 'Temps de réponse', "Taux d'utilisation"];
  }, [chart.series]);

  // États pour chaque sélecteur
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedComparison, setSelectedComparison] = useState<ComparisonType>(comparisonType);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>(metricOptions[0]);

  // Générer des catégories de date basées sur startDate et endDate
  const generateDateCategories = useCallback(() => {
    if (!startDate || !endDate) return ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const diff = endDate.diff(startDate, 'day') + 1;

    const categories = Array.from({ length: diff }, (_, i) =>
      startDate.clone().add(i, 'day').format('DD/MM')
    );

    return categories;
  }, [startDate, endDate]);

  // Nouvel état pour les catégories d'abscisse dynamiques
  const [dynamicCategories, setDynamicCategories] = useState<string[]>(generateDateCategories());

  // Nouvel état pour les données dynamiques
  const [dynamicData, setDynamicData] = useState<any[]>([]);

  // Mettre à jour les catégories quand les dates changent
  useEffect(() => {
    setDynamicCategories(generateDateCategories());
  }, [startDate, endDate, generateDateCategories]);

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.secondary.main,
  ];

  // Gestionnaires de changement pour chaque sélecteur
  const handleChangeCategory = useCallback((newValue: string) => {
    setSelectedCategory(newValue);
  }, []);

  const handleChangeComparison = useCallback(
    (event: SelectChangeEvent<ComparisonType>) => {
      const newValue = event.target.value as ComparisonType;
      setSelectedComparison(newValue);
      if (onComparisonTypeChange) {
        onComparisonTypeChange(newValue);
      }
    },
    [onComparisonTypeChange]
  );

  const handleChangeMetric = useCallback((newValue: string) => {
    setSelectedMetric(newValue as MetricType);
  }, []);

  // Fonction pour générer des données aléatoires
  const generateRandomData = useCallback(
    (length: number, min: number, max: number) =>
      Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min),
    []
  );

  // Générer les catégories et données en fonction du type de comparaison
  useEffect(() => {
    let newCategories: string[] = [];
    let newSeriesData: any[] = [];

    // Obtenir les données de la catégorie sélectionnée
    const currentCategoryData = chart.series.find((item) => item.name === selectedCategory);
    if (!currentCategoryData?.data) return;

    // Trouver la métrique sélectionnée
    const metricData = currentCategoryData.data.find((item) => item.name === selectedMetric);
    if (!metricData) return;

    // Par défaut (sans comparaison), utiliser les dates générées dynamiquement
    if (selectedComparison === 'Sans comparaison') {
      newCategories = generateDateCategories();

      // Générer des données aléatoires pour correspondre au nombre de jours
      const randomData = generateRandomData(newCategories.length, 10, 100);

      newSeriesData = [
        {
          name: selectedMetric,
          data: randomData,
        },
      ];
    }
    // Pour l'année précédente, afficher les mois
    else if (selectedComparison === 'Année précédente') {
      newCategories = [
        'Jan',
        'Fév',
        'Mar',
        'Avr',
        'Mai',
        'Juin',
        'Juil',
        'Août',
        'Sept',
        'Oct',
        'Nov',
        'Déc',
      ];

      // Générer des données pour l'année en cours
      const currentYearData = generateRandomData(12, 10, 100);

      // Générer des données pour l'année précédente (légèrement différentes)
      const previousYearData = currentYearData.map((val) =>
        Math.floor(val * (0.7 + Math.random() * 0.4))
      );

      newSeriesData = [
        {
          name: `${selectedMetric} (Année courante)`,
          data: currentYearData,
        },
        {
          name: `${selectedMetric} (Année précédente)`,
          data: previousYearData,
        },
      ];
    }
    // Pour le mois précédent, afficher les semaines
    else if (selectedComparison === 'Mois précédent') {
      // Générer les semaines du mois
      newCategories = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5'];

      // Générer des données pour le mois courant
      const currentMonthData = generateRandomData(5, 10, 100);

      // Générer des données pour le mois précédent
      const previousMonthData = currentMonthData.map((val) =>
        Math.floor(val * (0.7 + Math.random() * 0.4))
      );

      newSeriesData = [
        {
          name: `${selectedMetric} (Mois courant)`,
          data: currentMonthData,
        },
        {
          name: `${selectedMetric} (Mois précédent)`,
          data: previousMonthData,
        },
      ];
    }
    // Pour la période précédente, utiliser les mêmes dates mais avec des données différentes
    else if (selectedComparison === 'Période précédente') {
      // Utiliser les mêmes dates pour la période courante
      newCategories = generateDateCategories();

      // Simuler des données pour la période courante
      const currentPeriodData = generateRandomData(newCategories.length, 10, 100);

      // Simuler des données pour la période précédente (même nombre de jours)
      const previousPeriodData = currentPeriodData.map((val) =>
        Math.floor(val * (0.7 + Math.random() * 0.4))
      );

      newSeriesData = [
        {
          name: `${selectedMetric} (Période courante)`,
          data: currentPeriodData,
        },
        {
          name: `${selectedMetric} (Période précédente)`,
          data: previousPeriodData,
        },
      ];
    }

    setDynamicCategories(newCategories);
    setDynamicData(newSeriesData);
  }, [
    chart.series,
    selectedCategory,
    selectedMetric,
    selectedComparison,
    generateRandomData,
    generateDateCategories,
  ]);

  // Calculer les valeurs moyennes pour l'affichage des légendes
  const legendValues = useMemo(
    () =>
      dynamicData.map((series) => {
        const average =
          series.data.reduce((sum: number, val: number) => sum + val, 0) / series.data.length;
        return fShortenNumber(average);
      }),
    [dynamicData]
  );

  // Options du graphique
  const chartOptions = useChart({
    colors: chartColors.slice(0, dynamicData.length),
    tooltip: { theme: 'light' },
    xaxis: {
      categories: dynamicCategories,
      labels: {
        style: {
          // Modification ici - utilisation de la couleur de texte du thème au lieu de la couleur de la série
          colors: theme.palette.text.secondary,
        },
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: selectedMetric,
      },
      labels: {
        style: {
          // Modification ici - utilisation de la couleur de texte du thème au lieu de la couleur de la série
          colors: theme.palette.text.secondary,
        },
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    chart: {
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
        export: {
          csv: {
            filename: `${title || 'Analyse'}_${selectedCategory}_${selectedMetric}_${selectedComparison}`,
            columnDelimiter: ',',
          },
          svg: {
            filename: `${title || 'Analyse'}_${selectedCategory}_${selectedMetric}_${selectedComparison}`,
          },
          png: {
            filename: `${title || 'Analyse'}_${selectedCategory}_${selectedMetric}_${selectedComparison}`,
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
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <ChartSelect
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleChangeCategory}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <Select
                value={selectedComparison}
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
        sx={{ mb: 1 }}
      />

      {/* Sélecteur de métriques */}
      <Box sx={{ px: 3, mb: 2 }}>
        <Tabs
          value={metricOptions.indexOf(selectedMetric)}
          onChange={(_, value) => handleChangeMetric(metricOptions[value])}
          variant="scrollable"
          scrollButtons="auto"
        >
          {metricOptions.map((metric) => (
            <Tab key={metric} label={metric} />
          ))}
        </Tabs>
      </Box>

      <ChartLegends
        colors={chartColors.slice(0, dynamicData.length)}
        labels={dynamicData.map((item: any) => item.name)}
        values={legendValues}
        sx={{ px: 3, gap: 3, mb: 2 }}
      />

      <Chart
        type="area"
        series={dynamicData}
        options={chartOptions}
        height={320}
        loadingProps={{ sx: { p: 2.5 } }}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
