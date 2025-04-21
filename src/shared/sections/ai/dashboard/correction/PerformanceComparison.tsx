import { Bar } from 'react-chartjs-2';
import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faSyncAlt,
  faBookOpen,
  faPencilAlt,
  faInfoCircle,
  faFileExport,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Card,
  Grid,
  Tabs,
  Button,
  Select,
  Tooltip,
  MenuItem,
  CardHeader,
  Typography,
  InputLabel,
  IconButton,
  CardContent,
  FormControl,
  useMediaQuery
} from '@mui/material';

import ToggleMetricsButton from './ToggleMetricsButton';
import {
  transformDataByMetricType,
  applyMetricOptionsToChart
} from './metricsUtils';
import {
  filterAssistantPerformanceData,
  getPerformingAssistantsAnalysis
} from '../../../../_mock/_correction_ai';
// Importer les nouvelles données de performance par exercice
import {
  getSubjectComparisonData,
  getAveragePerformanceByLevel,
  getFilteredExercisePerformance,
  getAveragePerformanceBySubject,
  getChapterPerformanceEvolution,
  getAssistantTypePerformanceData
} from '../../../../_mock/_exercise_performance';

// Importer les composants et utilitaires pour le basculement de métriques
import type { MetricType } from './ToggleMetricsButton';
import type {
  FilterOptions
} from '../../../../_mock/_correction_ai';

// Ajouter cette interface pour les props de type Tab
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

// Componant pour le contenu des tabs
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Ajouter cette fonction aux propriétés de l'interface PerformanceComparisonProps
interface PerformanceComparisonProps {
  filters: FilterOptions;
  onDownloadData?: () => void;
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  filters,
  onDownloadData
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State pour la gestion des onglets
  const [tabValue, setTabValue] = useState(0);

  // State pour le type de métrique
  const [metricType, setMetricType] = useState<MetricType>('utilization');

  // States pour les sélecteurs
  const [selectedLevel, setSelectedLevel] = useState<string>('CP'); // Préselectionner le niveau 'CP'
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [selectedAssistantType, setSelectedAssistantType] = useState<string>('');

  const assistantTypePerformanceData = useMemo(() =>
    getAssistantTypePerformanceData(selectedLevel || undefined)
    , [selectedLevel]);

  // Gestion du changement d'onglet
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Obtenir les assistants basés sur les filtres
  const filteredAssistants = useMemo(() => {
    // Si des types sont sélectionnés, filtrer les assistants par type
    if (Array.isArray(filters.type) && filters.type.length > 0) {
      return filterAssistantPerformanceData(filters.assistants || [], false);
    }

    // Si des assistants spécifiques sont sélectionnés
    if (filters.assistants && filters.assistants.length > 0) {
      return filterAssistantPerformanceData(filters.assistants, false);
    }

    // Par défaut, montrer tous les assistants
    return filterAssistantPerformanceData([], false);
  }, [filters]);

  // Obtenir les données filtrées d'exercices basées sur les filtres appliqués
  const filteredExerciseData = useMemo(() =>
    getFilteredExercisePerformance({
      level: Array.isArray(filters.level) ? filters.level : filters.level === 'all' ? undefined : filters.level,
      subject: filters.subjects,
      chapter: filters.chapters,
      exercise: filters.exercises,
      startDate: filters.startDate,
      endDate: filters.endDate
    })
    , [filters]);

  // Analyser les performances pour obtenir les meilleures et pires performances
  const performanceAnalysis = useMemo(() =>
    getPerformingAssistantsAnalysis()
    , []);

  // Configuration des options du graphique
  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        tooltip: {
          callbacks: {
            label(context: any) {
              return `${context.dataset.label}: ${context.raw}%`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Taux utilisation (%)'
          }
        }
      }
    };

    // Appliquer les options spécifiques au type de métrique
    return applyMetricOptionsToChart(baseOptions, metricType);
  }, [metricType]);

  // Exemple de modification des couleurs
  const compareChartData = useMemo(() => {
    const assistantName = Object.keys(filteredAssistants)[0] || 'Assistant Mathématiques';
    const assistantData = filteredAssistants[assistantName];

    if (!assistantData) return null;

    const chartData = {
      labels: assistantData.metrics,
      datasets: [
        {
          label: 'Avant réentraînement',
          data: assistantData.beforeRetraining,
          backgroundColor: 'rgba(235, 71, 6, 0.5)', // Augmenter l'opacité
        },
        {
          label: 'Après réentraînement',
          data: assistantData.afterRetraining,
          backgroundColor: 'rgba(11, 226, 47, 0.5)', // Augmenter l'opacité
        }
      ]
    };

    return transformDataByMetricType(chartData, metricType);
  }, [filteredAssistants, metricType]);

  // Données pour le graphique des performances par niveau
  const levelPerformanceData = useMemo(() => {
    const avgByLevel = getAveragePerformanceByLevel();

    const chartData = {
      labels: Object.keys(avgByLevel),
      datasets: [
        {
          label: 'Avant correction',
          data: Object.values(avgByLevel).map(v => v.before),
          backgroundColor: 'rgba(235, 71, 6, 0.5)', // Augmenter l'opacité
        },
        {
          label: 'Après correction',
          data: Object.values(avgByLevel).map(v => v.after),
          backgroundColor: 'rgba(11, 226, 47, 0.5)', // Augmenter l'opacité
        }
      ]
    };

    return transformDataByMetricType(chartData, metricType);
  }, [metricType]);

  const resetFilters = () => {
    setSelectedLevel('CP'); // Réinitialiser au niveau 'CP'
    setSelectedSubject('');
    setSelectedChapter('');
    setSelectedExercise('');
    setSelectedAssistantType('');
  };

  // Données pour le graphique des performances par matière
  const subjectPerformanceData = useMemo(() => {
    // Obtenir les données filtrées par niveau si un niveau est sélectionné
    const filteredData = getFilteredExercisePerformance({
      level: selectedLevel || undefined
    });

    // Regrouper par matière
    const subjectData: Record<string, { before: number[], after: number[] }> = {};

    filteredData.forEach(item => {
      if (!subjectData[item.subjectName]) {
        subjectData[item.subjectName] = { before: [], after: [] };
      }

      subjectData[item.subjectName].before.push(item.beforeCorrection);
      subjectData[item.subjectName].after.push(item.afterCorrection);
    });

    // Calculer les moyennes par matière
    const chartData = {
      labels: Object.keys(subjectData),
      datasets: [
        {
          label: 'Avant correction',
          data: Object.values(subjectData).map(subjectValue =>
            parseFloat((subjectValue.before.reduce((sum, val) => sum + val, 0) / subjectValue.before.length).toFixed(1))),
          backgroundColor: 'rgba(235, 71, 6, 0.5)', // Augmenter l'opacité
        },
        {
          label: 'Après correction',
          data: Object.values(subjectData).map(subjectValue =>
            parseFloat((subjectValue.before.reduce((sum, val) => sum + val, 0) / subjectValue.before.length).toFixed(1))),
          backgroundColor: 'rgba(11, 226, 47, 0.5)', // Augmenter l'opacité
        }
      ]
    };

    return transformDataByMetricType(chartData, metricType);
  }, [selectedLevel, metricType]);

  const hasActiveFilters = useMemo(() =>
    selectedLevel !== 'CP' ||
    selectedSubject !== '' ||
    selectedChapter !== '' ||
    selectedExercise !== '' ||
    selectedAssistantType !== ''
    , [selectedLevel, selectedSubject, selectedChapter, selectedExercise, selectedAssistantType]);


  // Données pour le graphique des performances par exercice (si un chapitre est sélectionné)
  const exercisePerformanceData = useMemo(() => {
    if (!selectedChapter) return null;

    const chartData = getChapterPerformanceEvolution(selectedChapter, selectedLevel);

    const exerciseData = {
      labels: chartData.labels,
      datasets: [
        {
          label: 'Avant correction',
          data: chartData.beforeCorrection,
          backgroundColor: 'rgba(235, 71, 6, 0.5)', // Augmenter l'opacité
        },
        {
          label: 'Après correction',
          data: chartData.afterCorrection,
          backgroundColor: 'rgba(11, 226, 47, 0.5)', // Augmenter l'opacité
        }
      ]
    };

    return transformDataByMetricType(exerciseData, metricType);
  }, [selectedChapter, selectedLevel, metricType]);

  // Données pour le graphique des performances par chapitre (si une matière est sélectionnée)
  const chapterPerformanceData = useMemo(() => {
    if (!selectedSubject || !selectedLevel) return null;

    const chartData = getSubjectComparisonData(selectedLevel, selectedSubject);

    const chapterData = {
      labels: chartData.chapters,
      datasets: [
        {
          label: 'Avant correction',
          data: chartData.beforeCorrection,
          backgroundColor: 'rgba(235, 71, 6, 0.5)', // Augmenter l'opacité
        },
        {
          label: 'Après correction',
          data: chartData.afterCorrection,
          backgroundColor: 'rgba(11, 226, 47, 0.5)', // Augmenter l'opacité
        }
      ]
    };

    return transformDataByMetricType(chapterData, metricType);
  }, [selectedSubject, selectedLevel, metricType]);

  // Titre du graphique basé sur les filtres
  const getChartTitle = () => {
    if (filters.assistants && filters.assistants.length === 1) {
      return `Performance de ${filters.assistants[0]} avant/après réentraînement`;
    }

    return "Comparaison des performances avant/après réentraînement";
  };

  // Sous-titre du graphique basé sur les filtres
  const getChartSubtitle = () => {
    // Filtré par type
    if (filters.type !== 'all') {
      if (Array.isArray(filters.type) && filters.type.length > 0) {
        return `Filtré par type: ${filters.type.join(', ')}`;
      }
      return `Filtré par type: ${filters.type}`;
    }

    // Filtré par assistants spécifiques
    if (filters.assistants && filters.assistants.length > 0) {
      if (filters.assistants.length === 1) {
        return `Assistant sélectionné: ${filters.assistants[0]}`;
      }
      return `Assistants sélectionnés: ${filters.assistants.join(', ')}`;
    }

    // Par défaut
    return "";
  };

  // Add these interfaces for data types
  interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }

  interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
  }

  interface PerformanceData {
    labels: string[];
    beforeCorrection: number[];
    afterCorrection: number[];
  }

  interface PerformanceRecord {
    [key: string]: { before: number; after: number };
  }

  // Union type for all possible exportable data types
  // Update the ExportableData type to include all possible data structures
  type ExportableData =
    | ChartData
    | PerformanceData
    | PerformanceRecord
    | Record<string, any>[]
    | { chapters: string[]; beforeCorrection: number[]; afterCorrection: number[]; }
    | { labels: string[]; beforeCorrection: number[]; afterCorrection: number[]; improvement?: number[]; }
    | Record<string, { metrics: string[]; beforeRetraining: number[]; afterRetraining: number[]; }>
    | null;
  // Modify the handleDownload function with proper type annotations
  const handleDownload = (): void => {
    if (onDownloadData) {
      onDownloadData();
    } else {
      // Default implementation - Export current data as CSV
      let dataToExport: ExportableData = null;
      let filename: string = 'performance_comparison';

      // Determine which data to export based on current tab
      switch (tabValue) {
        case 0: // Assistants tab
          dataToExport = selectedAssistantType || selectedLevel
            ? assistantTypePerformanceData
            : filteredAssistants;
          filename = 'assistant_performance_comparison';
          break;
        case 1: // By Level tab
          dataToExport = getAveragePerformanceByLevel();
          filename = 'level_performance_comparison';
          break;
        case 2: // By Subject tab
          try {
            dataToExport = getAveragePerformanceBySubject();
            filename = 'subject_performance_comparison';
          } catch (error) {
            console.error("Error exporting subject data:", error);
            alert("Une erreur s'est produite lors de l'exportation des données par matière.");
            return;
          }
          break;
        case 3: // By Chapter tab
          if (selectedLevel && selectedSubject) {
            dataToExport = getSubjectComparisonData(selectedLevel, selectedSubject);
            filename = `${selectedSubject}_chapters_performance`;
          }
          break;
        case 4: // By Exercise tab
          if (selectedChapter) {
            dataToExport = getChapterPerformanceEvolution(selectedChapter, selectedLevel);
            filename = `${selectedChapter}_exercises_performance`;
          }
          break;
        default:
          dataToExport = null;
          filename = 'performance_data';
          break;
      }

      if (dataToExport) {
        exportToCSV(dataToExport, filename);
      } else {
        alert("Aucune donnée disponible à exporter. Veuillez sélectionner les filtres appropriés.");
      }
    }
  };

  const exportToCSV = (data: ExportableData, filename: string = 'export'): void => {
    try {
      // Format the data based on its structure
      let csvContent: string = 'data:text/csv;charset=utf-8,';

      // Handle different data structures
      if (Array.isArray(data)) {
        // Handle array of objects
        if (data.length > 0 && typeof data[0] === 'object') {
          // Get headers
          const headers: string[] = Object.keys(data[0]);
          csvContent += `${headers.join(',')}\n`;

          // Add rows
          data.forEach((item: Record<string, any>) => {
            const row: string = headers.map(header => {
              const cell = item[header];
              // Handle values with commas by wrapping in quotes
              return typeof cell === 'string' && cell.includes(',')
                ? `"${cell}"`
                : cell;
            }).join(',');
            csvContent += `${row}\n`;
          });
        } else {
          // Simple array
          csvContent += data.join(',');
        }
      } else if (typeof data === 'object' && data !== null) {
        // Handle assistant performance data (nested object with metrics)
        if (Object.values(data).length > 0 && typeof Object.values(data)[0] === 'object' &&
          'metrics' in Object.values(data)[0] && 'beforeRetraining' in Object.values(data)[0]) {

          // This is the filteredAssistants structure
          const assistantData = data as Record<string, {
            metrics: string[];
            beforeRetraining: number[];
            afterRetraining: number[];
          }>;

          // Get the first assistant to extract metrics (assuming all assistants have the same metrics)
          const firstAssistant = Object.values(assistantData)[0];

          // Create header row with metric names
          csvContent += 'Assistant,Metric,Before Retraining,After Retraining\n';

          // Add data for each assistant and metric
          Object.entries(assistantData).forEach(([assistantName, assistantMetrics]) => {
            assistantMetrics.metrics.forEach((metric, index) => {
              csvContent += `${assistantName},${metric},${assistantMetrics.beforeRetraining[index]},${assistantMetrics.afterRetraining[index]}\n`;
            });
          });
        }
        // Special case for chapter data structure
        else if ('chapters' in data && 'beforeCorrection' in data && 'afterCorrection' in data) {
          csvContent += 'Chapter,Avant correction,Après correction\n';

          const chapterData = data as {
            chapters: string[];
            beforeCorrection: number[];
            afterCorrection: number[];
          };

          chapterData.chapters.forEach((chapter: string, index: number) => {
            csvContent += `${chapter},${chapterData.beforeCorrection[index]},${chapterData.afterCorrection[index]}\n`;
          });
        }
        // Special case for performance data with labels
        else if ('labels' in data && 'beforeCorrection' in data && 'afterCorrection' in data) {
          csvContent += 'Label,Avant correction,Après correction';

          // Add improvement column if available
          if ('improvement' in data) {
            csvContent += ',Improvement';
          }
          csvContent += '\n';

          const perfData = data as {
            labels: string[];
            beforeCorrection: number[];
            afterCorrection: number[];
            improvement?: number[];
          };

          perfData.labels.forEach((label: string, index: number) => {
            let row = `${label},${perfData.beforeCorrection[index]},${perfData.afterCorrection[index]}`;
            if (perfData.improvement) {
              row += `,${perfData.improvement[index]}`;
            }
            csvContent += `${row}\n`;
          });
        }
        // Special case for chart data structure
        else if ('labels' in data && 'datasets' in data) {
          // Chart-like structure
          csvContent += 'Label,';

          const chartData = data as ChartData;
          csvContent += `${chartData.datasets.map((ds: ChartDataset) => ds.label).join(',')}\n`;

          // Add data rows
          chartData.labels.forEach((label: string, index: number) => {
            let row = `${label},`;
            row += chartData.datasets.map((ds: ChartDataset) => ds.data[index]).join(',');
            csvContent += `${row}\n`;
          });
        }
        else {
          // Generic object
          Object.entries(data).forEach(([key, value]: [string, any]) => {
            if (typeof value === 'object' && value !== null) {
              // Handle nested objects
              Object.entries(value as Record<string, any>).forEach(([subKey, subValue]: [string, any]) => {
                csvContent += `${key}_${subKey},${subValue}\n`;
              });
            } else {
              csvContent += `${key},${value}\n`;
            }
          });
        }
      }

      // Create encoded URI for download
      const encodedUri: string = encodeURI(csvContent);

      // Create and trigger download
      const link: HTMLAnchorElement = document.createElement('a');
      link.setAttribute('href', encodedUri);

      // Set filename with date for uniqueness
      const date: string = new Date().toISOString().slice(0, 10);
      link.setAttribute('download', `${filename}_${date}.csv`);

      // Append to document, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Download triggered successfully');
    } catch (error) {
      console.error('Error during CSV export:', error);
      alert('Une erreur est survenue lors de l\'exportation des données. Veuillez réessayer.');
    }
  };

  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader
        title={getChartTitle()}
        subheader={getChartSubtitle()}
      />
      <CardContent>
        {/* Navigation par onglets avec bouton de basculement de métriques */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', flex: 1 }}
          >
            <Tab label="Assistants" icon={<FontAwesomeIcon icon={faInfoCircle} />} iconPosition="start" />
            <Tab label="Par Niveau" icon={<FontAwesomeIcon icon={faGraduationCap} />} iconPosition="start" />
            <Tab label="Par Matière" icon={<FontAwesomeIcon icon={faBook} />} iconPosition="start" />
            <Tab label="Par Chapitre" icon={<FontAwesomeIcon icon={faBookOpen} />} iconPosition="start" />
            <Tab label="Par Exercice" icon={<FontAwesomeIcon icon={faPencilAlt} />} iconPosition="start" />
          </Tabs>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {hasActiveFilters && (
              <Button
                variant="text"
                startIcon={<FontAwesomeIcon icon={faSyncAlt} />}
                color="primary"
                onClick={resetFilters}
                size="small"
                aria-label="Reset filters"
              />
            )}

            <ToggleMetricsButton
              currentMetric={metricType}
              onChange={setMetricType}
              variant="simple"
            />

            {/* Bouton pour exporter */}
            <Tooltip title="Exporter les données">
              <IconButton
                color="primary"
                aria-label="exporter"
                onClick={handleDownload}
                sx={{
                  p: 1,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                size="small"
              >
                <FontAwesomeIcon icon={faFileExport} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {/* Onglet 1: Performance des assistants */}
        <TabPanel value={tabValue} index={0}>
          {/* Sélecteurs */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau éducatif</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Niveau éducatif"
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Tous niveaux</em>
                  </MenuItem>
                  {['CP', 'CE1', 'CE2', 'CM1', 'CM2'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          {/* Graphique de comparaison */}
          <Box sx={{ height: 300 }}>
            <Bar
              data={transformDataByMetricType({
                labels: assistantTypePerformanceData.labels,
                datasets: [
                  {
                    label: 'Avant correction',
                    data: assistantTypePerformanceData.beforeCorrection,
                    backgroundColor: 'rgba(235, 71, 6, 0.5)',
                  },
                  {
                    label: 'Après correction',
                    data: assistantTypePerformanceData.afterCorrection,
                    backgroundColor: 'rgba(11, 226, 47, 0.5)',
                  }
                ]
              }, metricType)}
              options={chartOptions}
            />
          </Box>
        </TabPanel>

        {/* Onglet 2: Performance par niveau */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ height: 300, mb: 3 }}>
            <Bar data={levelPerformanceData} options={chartOptions} />
          </Box>
        </TabPanel>

        {/* Onglet 3: Performance par matière */}
        <TabPanel value={tabValue} index={2}>
          {/* Ajout du sélecteur de niveau */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau éducatif</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Niveau éducatif"
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Tous niveaux</em>
                  </MenuItem>
                  {['CP', 'CE1', 'CE2', 'CM1', 'CM2'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ height: 300, mb: 3 }}>
            <Bar data={subjectPerformanceData} options={chartOptions} />
          </Box>
        </TabPanel>

        {/* Onglet 4: Performance par chapitre */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau éducatif</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Niveau éducatif"
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Sélectionnez un niveau</em>
                  </MenuItem>
                  {['CP', 'CE1', 'CE2', 'CM1', 'CM2'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Matière</InputLabel>
                <Select
                  value={selectedSubject}
                  label="Matière"
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!selectedLevel}
                >
                  <MenuItem value="">
                    <em>Sélectionnez une matière</em>
                  </MenuItem>
                  {['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Anglais'].map((subject) => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {chapterPerformanceData ? (
            <Box sx={{ height: 300, mb: 2 }}>
              <Bar data={chapterPerformanceData} options={chartOptions} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Veuillez sélectionner un niveau et une matière pour voir les performances par chapitre
              </Typography>
            </Box>
          )}
        </TabPanel>

        {/* Onglet 5: Performance par exercice */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Niveau éducatif</InputLabel>
                <Select
                  value={selectedLevel}
                  label="Niveau éducatif"
                  onChange={(e) => setSelectedLevel(e.target.value)}
                >
                  <MenuItem value="">
                    <em>Sélectionnez un niveau</em>
                  </MenuItem>
                  {['CP', 'CE1', 'CE2', 'CM1', 'CM2'].map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Matière</InputLabel>
                <Select
                  value={selectedSubject}
                  label="Matière"
                  onChange={(e) => {
                    setSelectedSubject(e.target.value);
                    // Réinitialiser le chapitre sélectionné quand on change de matière
                    setSelectedChapter('');
                  }}
                  disabled={!selectedLevel}
                >
                  <MenuItem value="">
                    <em>Sélectionnez une matière</em>
                  </MenuItem>
                  {['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Anglais'].map((subject) => (
                    <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Chapitre</InputLabel>
                <Select
                  value={selectedChapter}
                  label="Chapitre"
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  disabled={!selectedLevel || !selectedSubject}
                >
                  <MenuItem value="">
                    <em>Sélectionnez un chapitre</em>
                  </MenuItem>
                  {selectedSubject && ['Additions et Soustractions', 'Multiplications et Divisions', 'Lecture et Compréhension', 'Préhistoire et Antiquité']
                    .filter(chapter => {
                      // Filtrer les chapitres en fonction de la matière sélectionnée
                      switch (selectedSubject) {
                        case 'Mathématiques':
                          return ['Additions et Soustractions', 'Multiplications et Divisions', 'Géométrie de Base', 'Problèmes Simples'].includes(chapter);
                        case 'Français':
                          return ['Lecture et Compréhension', 'Écriture et Orthographe', 'Grammaire de Base', 'Vocabulaire'].includes(chapter);
                        case 'Histoire':
                          return ['Préhistoire et Antiquité', 'Moyen Âge', 'Renaissance', 'Révolution Française'].includes(chapter);
                        case 'Géographie':
                          return ['Mon Village et Ma Région', 'La France', 'LEurope', 'Le Monde'].includes(chapter);
                        case 'Anglais':
                          return ['Salutations et Présentations', 'Nombres et Couleurs', 'Animaux et Aliments', 'Phrases Simples'].includes(chapter);
                        default:
                          return true;
                      }
                    })
                    .map((chapter) => (
                      <MenuItem key={chapter} value={chapter}>{chapter}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {exercisePerformanceData ? (
            <Box sx={{ height: 300, mb: 2 }}>
              <Bar data={exercisePerformanceData} options={chartOptions} />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Veuillez sélectionner un niveau, une matière et un chapitre pour voir les performances par exercice
              </Typography>
            </Box>
          )}
        </TabPanel>
      </CardContent>
    </Card>
  );
};

export default PerformanceComparison;