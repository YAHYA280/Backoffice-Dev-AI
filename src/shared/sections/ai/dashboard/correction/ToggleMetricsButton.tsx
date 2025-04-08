// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\shared\sections\ai\dashboard\correction\ToggleMetricsButton.tsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import { Box, Button, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';

export type MetricType = 'utilization' | 'precision';

interface ToggleMetricsButtonProps {
  currentMetric: MetricType;
  onChange: (metricType: MetricType) => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'simple' | 'full';
}

/**
 * Bouton de basculement entre les différents types de métriques
 * (taux d'utilisation et scores de précision)
 */
const ToggleMetricsButton: React.FC<ToggleMetricsButtonProps> = ({
  currentMetric,
  onChange,
  size = 'small',
  variant = 'simple'
}) => {
  // Gestion du changement de métrique
  const handleMetricChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMetric: MetricType | null
  ) => {
    if (newMetric !== null) {
      onChange(newMetric);
    }
  };

  // Variante simple avec un seul bouton qui alterne
  if (variant === 'simple') {
    return (
      <Tooltip 
        title={`Afficher les ${currentMetric === 'utilization' ? 'scores de précision' : 'taux d\'utilisation'}`}
        arrow
      >
        <Button
          size={size}
          variant="outlined"
          color="primary"
          onClick={() => onChange(currentMetric === 'utilization' ? 'precision' : 'utilization')}
          startIcon={
            <FontAwesomeIcon 
              icon={currentMetric === 'utilization' ? faLayerGroup : faChartBar} 
            />
          }
        >
          {currentMetric === 'utilization' ? 'Voir scores de précision' : 'Voir taux d\'utilisation'}
        </Button>
      </Tooltip>
    );
  }

  // Variante complète avec ToggleButtonGroup
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <ToggleButtonGroup
        value={currentMetric}
        exclusive
        onChange={handleMetricChange}
        aria-label="type de métrique"
        size={size}
      >
        <ToggleButton value="utilization" aria-label="taux d'utilisation">
          <FontAwesomeIcon icon={faChartBar} style={{ marginRight: '8px' }} />
          Taux d&lsquo;utilisation
        </ToggleButton>
        <ToggleButton value="precision" aria-label="scores de précision">
          <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: '8px' }} />
          Scores de précision
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ToggleMetricsButton;