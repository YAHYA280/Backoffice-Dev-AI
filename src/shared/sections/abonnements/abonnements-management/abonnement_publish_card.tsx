'use client';

import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faArchive, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// Metric color key type
type MetricColorKey = 'published' | 'draft' | 'archived';

// Metrics data interface
interface SubscriptionMetricsData {
  published: number;
  draft: number;
  archived: number;
}

const AbonnementPublishCard: React.FC<{ abonnements?: IAbonnementItem[] }> = ({
  abonnements = [],
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Metrics data state
  const [metricsData, setMetricsData] = useState<SubscriptionMetricsData>({
    published: 0,
    draft: 0,
    archived: 0,
  });

  // Calculer les métriques depuis les données des abonnements
  useEffect(() => {
    if (abonnements.length > 0) {
      setIsLoading(true);
      try {
        // Calculer les métriques réelles à partir des données
        const published = abonnements.filter((item) => item.publish === 'published').length;
        const draft = abonnements.filter((item) => item.publish === 'draft').length;
        const archived = abonnements.filter((item) => item.publish === 'archived').length;

        setMetricsData({ published, draft, archived });
      } catch (error) {
        console.error('Error calculating subscription metrics:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [abonnements]);

  const metrics = [
    {
      icon: faFileAlt,
      label: 'Abonnements publiés',
      value: metricsData.published,
      colorKey: 'published' as MetricColorKey,
    },
    {
      icon: faPencilAlt,
      label: 'Abonnements brouillon',
      value: metricsData.draft,
      colorKey: 'draft' as MetricColorKey,
    },
    {
      icon: faArchive,
      label: 'Abonnements archivés',
      value: metricsData.archived,
      colorKey: 'archived' as MetricColorKey,
    },
  ];

  return (
    <CardContent>
      {/* Metrics cards */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexWrap: 'wrap',
          gap: 2,
          opacity: isLoading ? 0.7 : 1,
          transition: 'opacity 0.3s ease',
        }}
      >
        {metrics.map((metric, index) => (
          <Card
            key={index}
            sx={{
              p: 3,
              boxShadow: 0,
              bgcolor: 'background.neutral',
              borderRadius: 2,
              flex: '1 1 0',
              minWidth: { xs: '100%', sm: '45%', md: '22%' },
            }}
          >
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
              <Box sx={{ typography: 'subtitle2', flexGrow: 1, color: 'text.secondary' }}>
                {metric.label}
              </Box>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '50%',
                  bgcolor: getBackgroundColor(metric.colorKey),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesomeIcon
                  icon={metric.icon}
                  style={{
                    color: getIconColor(metric.colorKey),
                    fontSize: 20,
                  }}
                />
              </Box>
            </Stack>

            <Typography variant="h3" sx={{ mb: 0.5 }}>
              {metric.value}
            </Typography>
          </Card>
        ))}
      </Box>
    </CardContent>
  );
};

// Helper functions for colors
function getBackgroundColor(colorKey: MetricColorKey) {
  switch (colorKey) {
    case 'published':
      return '#E8F7F0'; // Light green
    case 'draft':
      return '#ECF2FF'; // Light blue
    case 'archived':
      return '#FFF8E7'; // Light yellow
    default:
      return '#ECF2FF';
  }
}

function getIconColor(colorKey: MetricColorKey) {
  switch (colorKey) {
    case 'published':
      return '#31A76C'; // Green
    case 'draft':
      return '#5B8AF5'; // Blue
    case 'archived':
      return '#FFB547'; // Yellow/Orange
    default:
      return '#5B8AF5';
  }
}

export default AbonnementPublishCard;
