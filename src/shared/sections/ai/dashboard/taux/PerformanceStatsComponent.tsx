"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faFilter,
  faThumbsUp,
  faChartLine,
  faChevronUp,
  faThumbsDown,
  faInfoCircle,
  faChevronDown,
  faCalendarAlt,
  faCommentSlash
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { CorrectionWidgetSummary } from '../correction/CorrectionWidgetSummary';

// Type pour les statistiques de performance avec données détaillées
export interface PerformanceStat {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
  details?: {
    description?: string;
    timeSeriesData?: {
      labels: string[];
      values: number[];
    };
    distribution?: {
      labels: string[];
      values: number[];
    };
    topSources?: {
      name: string;
      value: number;
    }[];
    comparisonPeriod?: string;
  };
}

interface PerformanceStatsProps {
  stats?: PerformanceStat[];
  title?: string;
  period?: string;
  showDetailedView?: boolean;
  isLoading?: boolean; // Add this line
}

// Données par défaut enrichies pour les statistiques
const defaultStats: PerformanceStat[] = [
  {
    id: 'total-feedbacks',
    label: 'Total des feedbacks',
    value: 1000,
    change: 5,
    changeDirection: 'up',
    details: {
      description: "Nombre total de retours utilisateurs reçus sur la période sélectionnée.",
      timeSeriesData: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        values: [125, 145, 132, 158, 175, 132, 133],
      },
      distribution: {
        labels: ['Web', 'Mobile', 'API', 'Autres'],
        values: [450, 320, 180, 50],
      },
      comparisonPeriod: "vs semaine précédente",
      topSources: [
        { name: "Page d'accueil", value: 320 },
        { name: "Recherche", value: 250 },
        { name: "Résultats", value: 210 },
        { name: "Profil", value: 220 },
      ]
    }
  },
  {
    id: 'satisfaction-rate',
    label: 'Taux de satisfaction global',
    value: 87,
    unit: '%',
    change: 2,
    changeDirection: 'up',
    details: {
      description: "Pourcentage des utilisateurs ayant donné une évaluation positive (4-5 étoiles).",
      timeSeriesData: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        values: [85, 86, 87, 88, 89, 87, 87],
      },
      distribution: {
        labels: ['5★', '4★', '3★', '2★', '1★'],
        values: [550, 320, 80, 30, 20],
      },
      comparisonPeriod: "vs semaine précédente",
      topSources: [
        { name: "Contenu", value: 92 },
        { name: "UX", value: 88 },
        { name: "Rapidité", value: 85 },
        { name: "Support", value: 83 },
      ]
    }
  },
  {
    id: 'dissatisfaction-rate',
    label: 'Taux d\'insatisfaction',
    value: 8,
    unit: '%',
    change: 1,
    changeDirection: 'down',
    color: 'warning',
    details: {
      description: "Pourcentage des utilisateurs ayant donné une évaluation négative (1-2 étoiles).",
      timeSeriesData: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        values: [9, 8.5, 8, 7.8, 7.5, 8, 8],
      },
      distribution: {
        labels: ['UX', 'Bugs', 'Contenu', 'Performance', 'Autres'],
        values: [30, 25, 15, 12, 8],
      },
      comparisonPeriod: "vs semaine précédente",
      topSources: [
        { name: "Chargement lent", value: 35 },
        { name: "Erreurs form.", value: 28 },
        { name: "Recherche", value: 22 },
        { name: "Navigation", value: 15 },
      ]
    }
  },
  {
    id: 'unanswered-feedbacks',
    label: 'Feedbacks sans réponse',
    value: 50,
    change: 10,
    changeDirection: 'down',
    color: 'info',
    details: {
      description: "Nombre de retours utilisateurs n'ayant pas encore reçu de réponse de l'équipe.",
      timeSeriesData: {
        labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        values: [62, 58, 54, 53, 52, 51, 50],
      },
      distribution: {
        labels: ['<1j', '1-2j', '2-3j', '>3j'],
        values: [15, 20, 10, 5],
      },
      comparisonPeriod: "vs semaine précédente",
      topSources: [
        { name: "Questions", value: 22 },
        { name: "Bugs", value: 15 },
        { name: "Suggestions", value: 8 },
        { name: "Autres", value: 5 },
      ]
    }
  },
];

// Mapping des icônes pour chaque type de stat
const getIconForStatId = (id: string) => {
  switch (id) {
    case 'total-feedbacks':
      return <FontAwesomeIcon icon={faChartLine} size="2x" />;
    case 'satisfaction-rate':
      return <FontAwesomeIcon icon={faThumbsUp} size="2x" />;
    case 'dissatisfaction-rate':
      return <FontAwesomeIcon icon={faThumbsDown} size="2x" />;
    case 'unanswered-feedbacks':
      return <FontAwesomeIcon icon={faCommentSlash} size="2x" />;
    default:
      return <FontAwesomeIcon icon={faChartLine} size="2x" />;
  }
};

// Mapping des couleurs pour chaque type de stat
const getColorForStatId = (id: string, stat: PerformanceStat): 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' => {
  if (stat.color) {
    return stat.color;
  }

  switch (id) {
    case 'total-feedbacks':
      return 'info';
    case 'satisfaction-rate':
      return 'success';
    case 'dissatisfaction-rate':
      return 'warning';
    case 'unanswered-feedbacks':
      return 'info';
    default:
      return 'primary';
  }
};

// Création des données de chart optimisées pour chaque type de stat
const getChartDataForStat = (stat: PerformanceStat) => {
  if (!stat.details?.timeSeriesData) {
    return {
      series: [25, 30, 20, 35, 20, 50, 55],
      categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    };
  }

  return {
    series: stat.details.timeSeriesData.values,
    categories: stat.details.timeSeriesData.labels
  };
};

const DetailedStatView = ({ stat }: { stat: PerformanceStat }) => {
  if (!stat.details) return null;

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
            {stat.details.description}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
            <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />
            {stat.details.comparisonPeriod}
          </Typography>
        </Box>

        {stat.details.distribution && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              <FontAwesomeIcon icon={faFilter} style={{ marginRight: '8px' }} />
              Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {stat.details.distribution.labels.map((label, index) => (
                <Box
                  key={label}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="caption">{label}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {stat.details?.distribution?.values[index]}
                    {stat.id.includes('rate') ? '%' : ''}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {stat.details.topSources && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
              Top Sources
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {stat.details.topSources.map((source) => (
                <Box
                  key={source.name}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="caption">{source.name}</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {source.value}
                    {stat.id.includes('satisfaction') || stat.id.includes('dissatisfaction') ? '%' : ''}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const PerformanceStatsComponent: React.FC<PerformanceStatsProps> = ({
  stats = defaultStats,
  title = "Statistiques Globales",
  period = "Cette semaine",
  showDetailedView = false,
  isLoading = false // Add this line
}) => {
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>({});

  const toggleStatExpansion = (statId: string) => {
    setExpandedStats(prev => ({
      ...prev,
      [statId]: !prev[statId]
    }));
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {/* You can add a title or period display here if needed */}
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => {
          const icon = getIconForStatId(stat.id);
          const color = getColorForStatId(stat.id, stat);
          const chartData = getChartDataForStat(stat);
          const isExpanded = expandedStats[stat.id] || false;

          return (
            <Grid item xs={12} sm={6} md={3} key={stat.id}>
              <Box sx={{ position: 'relative' }}>
                <CorrectionWidgetSummary
                  title={stat.label}
                  total={Number(stat.value)}
                  icon={icon}
                  color={color}
                  chart={chartData}
                  sx={{
                    mb: 0,
                    '&:hover': {
                      boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 4px 6px rgba(0,0,0,0.1)'
                    }
                  }}
                />

                {stat.details && showDetailedView && (
                  <IconButton
                    size="small"
                    onClick={() => toggleStatExpansion(stat.id)}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      boxShadow: '0 0 5px rgba(0,0,0,0.2)',
                      width: 24,
                      height: 24
                    }}
                  >
                    <FontAwesomeIcon
                      icon={isExpanded ? faChevronUp : faChevronDown}
                      size="xs"
                    />
                  </IconButton>
                )}

                {stat.details && showDetailedView && (
                  <Collapse in={isExpanded}>
                    <DetailedStatView stat={stat} />
                  </Collapse>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default PerformanceStatsComponent;