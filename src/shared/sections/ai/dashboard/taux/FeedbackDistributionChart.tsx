"use client";

import { Doughnut } from 'react-chartjs-2';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faPieChart, faChartPie } from '@fortawesome/free-solid-svg-icons';
import { 
  Legend, 
  ArcElement, 
  Chart as ChartJS, 
  Tooltip as ChartTooltip
} from 'chart.js';

import { 
  Box, 
  Card, 
  Chip, 
  alpha, 
  Button, 
  Tooltip, 
  useTheme, 
  CardHeader, 
  Typography,
  CardContent,
  ButtonGroup,
  CircularProgress  
} from '@mui/material';

import type { RatingDistribution } from './type';

// Register necessary Chart.js elements
ChartJS.register(ArcElement, ChartTooltip, Legend);

// Define color palette - gradient friendly
const COLORS = ['#4caf50', '#8bc34a', '#ffeb3b', '#ff9800', '#f44336'];
const HOVER_COLORS = ['#43a047', '#7cb342', '#fdd835', '#fb8c00', '#e53935'];

interface FeedbackDistributionChartProps {
  data: RatingDistribution[];
  title?: string;
  isLoading: boolean;
}

const FeedbackDistributionChart: React.FC<FeedbackDistributionChartProps> = ({ 
  data,
  title = "Répartition des Feedbacks",
  isLoading
}) => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'doughnut' | 'list'>('doughnut');
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [animatedData, setAnimatedData] = useState<number[]>([]);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Animation effect for the list view
  useEffect(() => {
    if (data && data.length > 0) {
      if (isInitialRender) {
        // Start with zeros and animate to actual values
        setAnimatedData(new Array(data.length).fill(0));
        setIsInitialRender(false);
        
        // Animate to actual values
        const timer = setTimeout(() => {
          setAnimatedData(data.map(item => item.count));
        }, 300);
        
        return () => clearTimeout(timer);
      }
    }
    
    // Add an empty return to satisfy the consistent-return rule
    return undefined;
  }, [data, isInitialRender]);

  // Check if data is valid or is loading
  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography align="center" color="text.secondary">
            Données indisponibles
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Calculate total count and percentage
  const totalCount = data.reduce((sum, item) => sum + item.count, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: Math.round((item.count / totalCount) * 100)
  }));
  
  // Find the most common rating
  const maxRating = [...dataWithPercentage].sort((a, b) => b.count - a.count)[0];
  
  // Find the average rating
  const weightedSum = data.reduce((sum, item) => sum + (item.rating * item.count), 0);
  const averageRating = totalCount > 0 ? (weightedSum / totalCount).toFixed(1) : '0.0';

  // Prepare chart data
  const chartData = {
    labels: dataWithPercentage.map(item => `${item.rating} étoiles`),
    datasets: [{
      data: dataWithPercentage.map(item => item.percentage),
      backgroundColor: COLORS,
      hoverBackgroundColor: HOVER_COLORS,
      borderColor: theme.palette.background.paper,
      borderWidth: 2,
      hoverOffset: 10
    }]
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            family: theme.typography.fontFamily,
            size: 12
          },
          boxWidth: 15,
          padding: 15,
          generateLabels: (chart: any) => {
            const chartDataLocal = chart.data; // Renamed to chartDataLocal
            if (chartDataLocal.labels.length && chartDataLocal.datasets.length) {
              return chartDataLocal.labels.map((label: string, i: number) => {
                const dataset = chartDataLocal.datasets[0];
                const value = dataset.data[i];
                return {
                  text: `${label} (${value}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const itemCount = data[context.dataIndex]?.count || 0;
            return [`${label}: ${value}%`, `${itemCount} réponses`];
          }
        },
        titleFont: {
          family: theme.typography.fontFamily,
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          family: theme.typography.fontFamily,
          size: 13
        },
        boxPadding: 8,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
      easing: 'easeOutQuart' as const
    },
    layout: {
      padding: 10
    }
  };

  // Render feedback items as a list
  const renderList = () => (
    <Box sx={{ p: 2, mt: 1, height: '100%', overflowY: 'auto' }}>
      {dataWithPercentage.map((item, index) => (
        <Box 
          key={`rating-${item.rating}`}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 1.5,
            borderRadius: 1,
            mb: 1.5,
            backgroundColor: alpha(COLORS[index % COLORS.length], 0.15),
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.shadows[2],
              backgroundColor: alpha(COLORS[index % COLORS.length], 0.25),
            },
            transition: 'all 0.25s ease-in-out'
          }}
          onMouseEnter={() => setIsHovered(index)}
          onMouseLeave={() => setIsHovered(null)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                backgroundColor: COLORS[index % COLORS.length],
                mr: 2,
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 14
              }}
            >
              {item.rating}
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600}>
                {item.rating} {item.rating > 1 ? 'étoiles' : 'étoile'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.count} réponses
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip 
              label={`${item.percentage}%`}
              size="small"
              sx={{ 
                fontWeight: 700,
                backgroundColor: isHovered === index ? COLORS[index % COLORS.length] : alpha(COLORS[index % COLORS.length], 0.2),
                color: isHovered === index ? '#fff' : 'inherit',
                transition: 'all 0.2s ease'
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Card sx={{ height: '100%', overflow: 'hidden' }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faChartPie} style={{ marginRight: '8px', color: theme.palette.primary.main }} />
              <Typography variant="h6">{title}</Typography>
            </Box>
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
      />
      <CardContent sx={{ position: 'relative', height: 300, p: theme.spacing(2) }}>
        {viewMode === 'doughnut' ? (
          <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
           </Box>
        ) : (
          renderList()
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackDistributionChart;