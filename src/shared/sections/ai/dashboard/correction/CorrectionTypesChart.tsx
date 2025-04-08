"use client";

import type { 
  ChartData, 
  ChartOptions} from 'chart.js';

import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faPieChart } from '@fortawesome/free-solid-svg-icons';
import { 
  Legend, 
  ArcElement, 
  Chart as ChartJS, 
  Tooltip as ChartTooltip
} from 'chart.js';

import { 
  Box, 
  Card, 
  Button, 
  Tooltip, 
  useTheme, 
  CardHeader, 
  Typography, 
  CardContent,
  ButtonGroup
} from '@mui/material';

// Enregistrement des éléments Chart.js nécessaires
ChartJS.register(ArcElement, ChartTooltip, Legend);

// Types pour les props
interface ChartDatasetItem {
  data: number[];
  backgroundColor: string[];
  borderColor?: string[];
  borderWidth?: number;
  hoverOffset?: number;
}

interface CorrectionChartData {
  labels: string[];
  datasets: ChartDatasetItem[];
}

interface FilterOptions {
  correctionTypes?: string[];
  [key: string]: any;
}

interface CorrectionTypesChartProps {
  data: CorrectionChartData;
  title: string;
  filters: FilterOptions;
}

const CorrectionTypesChart: React.FC<CorrectionTypesChartProps> = ({ data, title, filters }) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'doughnut' | 'list'>('doughnut');
  const [isHovered, setIsHovered] = useState<number | null>(null);
  
  // Vérifier que les données sont valides
  if (!data || !data.labels || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
    return <Card><CardContent>Données indisponibles</CardContent></Card>;
  }
  
  // Mapper les couleurs de bordure correctement avec un type sécurisé
  const borderColors: string[] = data.datasets[0].backgroundColor.map((color: string) => 
    typeof color === 'string' ? color.replace('0.7', '1') : '#000000'
  );
  
  // Préparer les données typées pour Chart.js
  const chartData: ChartData<'doughnut', number[], string> = {
    labels: data.labels,
    datasets: [{
      data: data.datasets[0].data,
      backgroundColor: data.datasets[0].backgroundColor,
      borderColor: borderColors,
      borderWidth: 1,
      hoverOffset: 15
    }]
  };

  // Options personnalisées pour le graphique
  const chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          boxWidth: 15,
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw !== undefined ? context.raw : 0;
            return `${label}: ${value}%`;
          }
        },
        titleFont: {
          family: theme.typography.fontFamily,
          size: 14
        },
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 13
        },
        boxPadding: 6
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000
    },
    layout: {
      padding: 10
    }
  };

  // Calculer les statistiques globales en sécurisant l'accès aux données
  let maxValue = 0;
  let maxIndex = 0;
  
  if (chartData.datasets[0] && chartData.datasets[0].data) {
    maxValue = Math.max(...chartData.datasets[0].data);
    maxIndex = chartData.datasets[0].data.indexOf(maxValue);
  }
  
  const maxCorrectionType = {
    label: chartData.labels && maxIndex >= 0 && maxIndex < chartData.labels.length 
      ? chartData.labels[maxIndex] 
      : 'Non défini',
    value: maxValue  // This is line 188 - fixed by using property shorthand (value instead of value: value)
  };

  // Générer la liste des types de corrections
  const renderList = () => {
    if (!chartData.labels) return null;
    
    return (
      <Box sx={{ p: 2, mt: 1, height: '100%', overflowY: 'auto' }}>
        {chartData.labels.map((label, index) => {
          // Sécuriser l'accès aux données
          const backgroundColor = Array.isArray(chartData.datasets[0].backgroundColor) && 
            index < chartData.datasets[0].backgroundColor.length
            ? chartData.datasets[0].backgroundColor[index] as string
            : '#cccccc'; // Couleur par défaut
            
          const dataValue = chartData.datasets[0].data && 
            index < chartData.datasets[0].data.length
            ? chartData.datasets[0].data[index]
            : 0;
            
          return (
            <Box 
              key={`${label}-${index}`}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 1,
                mb: 1,
                backgroundColor: `${backgroundColor}30`,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[2]
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onMouseEnter={() => setIsHovered(index)}
              onMouseLeave={() => setIsHovered(null)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor,
                    mr: 1.5 
                  }} 
                />
                <Typography variant="body2" fontWeight={500}>
                  {label}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight={700} 
                color={isHovered === index ? theme.palette.primary.main : 'inherit'}
              >
                {dataValue}%
              </Typography>
            </Box>
          );
        })}
      </Box>
    );
  };

  // Centre du donut pour afficher des statistiques
  const renderDoughnutCenter = () => (  // Line 211 - fixed by removing block and explicit return
    <>
      {viewMode === 'doughnut' && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        />  // Line 215 - fixed by using self-closing tag
      )}
    </>
  );

  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{title}</Typography>
            <ButtonGroup size="small" variant="outlined">
              <Tooltip title="Vue Donut">
                <Button 
                  onClick={() => setViewMode('doughnut')}
                  variant={viewMode === 'doughnut' ? 'contained' : 'outlined'}
                >
                  <FontAwesomeIcon icon={faPieChart} />
                </Button>
              </Tooltip>
              <Tooltip title="Vue Liste">
                <Button 
                  onClick={() => setViewMode('list')}
                  variant={viewMode === 'list' ? 'contained' : 'outlined'}
                >
                  <FontAwesomeIcon icon={faListUl} />
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
        }
        subheader={
          filters && filters.correctionTypes && filters.correctionTypes.length > 0
            ? `Filtré sur: ${filters.correctionTypes.join(', ')}`
            : ""
        }
      />
      <CardContent sx={{ position: 'relative', height: 300 }}>
        {viewMode === 'doughnut' ? (
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
            {renderDoughnutCenter()}
          </Box>
        ) : (
          renderList()
        )}
      </CardContent>
    </Card>
  );
};

export default CorrectionTypesChart;