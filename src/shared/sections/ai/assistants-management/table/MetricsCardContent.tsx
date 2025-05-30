'use client';

import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faGauge,
  faFilter,
  faSyncAlt,
  faChartLine,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// Types definition
type MetricColorKey = 'totalRequests' | 'avgResponseTime' | 'utilizationRate' | 'latencyAlerts';

interface MetricsData {
  totalRequests: number;
  avgResponseTime: number;
  utilizationRate: number;
  latencyAlerts: number;
}

// Interface pour les paramètres de filtrage
interface FilterParams {
  startDate: string | null;
  endDate: string | null;
}

const MetricsCardContent: React.FC = () => {
  // État pour le menu de filtre
  const [anchorElOverviewFilter, setAnchorElOverviewFilter] = useState<null | HTMLElement>(null);
  const [overviewStartDate, setOverviewStartDate] = useState<Dayjs | null>(
    dayjs().subtract(30, 'day')
  );
  const [overviewEndDate, setOverviewEndDate] = useState<Dayjs | null>(dayjs());
  const [activeFilters, setActiveFilters] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // État pour les données de métriques
  const [metricsData, setMetricsData] = useState<MetricsData>({
    totalRequests: 12458,
    avgResponseTime: 1.4,
    utilizationRate: 78.5,
    latencyAlerts: 2,
  });

  // État pour les paramètres de filtrage actuels
  const [currentFilters, setCurrentFilters] = useState<FilterParams>({
    startDate: null,
    endDate: null,
  });

  // Ouvrir le menu de filtre
  const handleOpenOverviewFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElOverviewFilter(event.currentTarget);
  };

  // Fermer le menu de filtre
  const handleCloseOverviewFilterMenu = () => {
    setAnchorElOverviewFilter(null);
  };

  // Fonction pour récupérer les données d'API - à connecter à votre backend
  const fetchMetricsData = async (params: FilterParams) => {
    setIsLoading(true);
    try {
      // Simuler un appel API - À remplacer par votre appel API réel
      // const response = await fetch('/api/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(params)
      // });
      // const data = await response.json();
      // setMetricsData(data);

      // Simulation pour l'exemple - À REMPLACER par l'appel API réel
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Si les paramètres de filtre sont définis, utilisez des données simulées différentes
      if (params.startDate && params.endDate) {
        const start = dayjs(params.startDate);
        const end = dayjs(params.endDate);
        const days = end.diff(start, 'day');

        setMetricsData({
          totalRequests: Math.floor(400 * days),
          avgResponseTime: parseFloat((1 + Math.random()).toFixed(1)),
          utilizationRate: parseFloat((60 + Math.random() * 30).toFixed(1)),
          latencyAlerts: Math.floor(Math.random() * 5),
        });
      } else {
        // Données par défaut si pas de filtre
        setMetricsData({
          totalRequests: 12458,
          avgResponseTime: 1.4,
          utilizationRate: 78.5,
          latencyAlerts: 2,
        });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      // Gestion d'erreur - peut-être définir un état d'erreur ou afficher une notification
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial des données
  useEffect(() => {
    fetchMetricsData({ startDate: null, endDate: null });
  }, []);

  // Appliquer les filtres
  const handleApplyFilters = () => {
    const formattedStartDate = overviewStartDate ? overviewStartDate.format('YYYY-MM-DD') : null;
    const formattedEndDate = overviewEndDate ? overviewEndDate.format('YYYY-MM-DD') : null;

    const newFilters = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    setCurrentFilters(newFilters);
    setActiveFilters(true);
    handleCloseOverviewFilterMenu();

    // Appeler l'API avec les nouveaux filtres
    fetchMetricsData(newFilters);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setOverviewStartDate(dayjs().subtract(30, 'day'));
    setOverviewEndDate(dayjs());
    setActiveFilters(false);

    const resetFilters = {
      startDate: null,
      endDate: null,
    };

    setCurrentFilters(resetFilters);

    // Récupérer les données sans filtre
    fetchMetricsData(resetFilters);
  };

  const metrics = [
    {
      icon: faChartLine,
      label: 'Requêtes totales',
      value: metricsData.totalRequests,
      colorKey: 'totalRequests' as MetricColorKey,
    },
    {
      icon: faClock,
      label: 'Temps de réponse moyen',
      value: `${metricsData.avgResponseTime} s`,
      colorKey: 'avgResponseTime' as MetricColorKey,
    },
    {
      icon: faGauge,
      label: "Taux d'utilisation",
      value: `${metricsData.utilizationRate}%`,
      colorKey: 'utilizationRate' as MetricColorKey,
    },
    {
      icon: faExclamationTriangle,
      label: 'Alertes de latence',
      value: metricsData.latencyAlerts,
      colorKey: 'latencyAlerts' as MetricColorKey,
    },
  ];

  return (
    <CardContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" component="h2" fontWeight="bold">
          Statistiques Générales
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Using ConditionalComponent for date display */}
          <ConditionalComponent
            isValid={activeFilters}
            defaultComponent={null}
          >
            <Typography variant="caption" sx={{ alignSelf: 'center', mr: 1, color: 'text.secondary' }}>
              Période: {overviewStartDate?.format('DD/MM/YYYY')} -{' '}
              {overviewEndDate?.format('DD/MM/YYYY')}
            </Typography>
          </ConditionalComponent>

          <Tooltip title="Reset">
            <IconButton color="primary" onClick={handleResetFilters} disabled={isLoading}>
              <FontAwesomeIcon icon={faSyncAlt} size='sm' className={isLoading ? 'fa-spin' : ''} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtrer par date">
            <IconButton color="primary" onClick={handleOpenOverviewFilterMenu}>
              <Badge color="primary" variant="dot" invisible={!activeFilters}>
                <FontAwesomeIcon icon={faFilter} size='sm' />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Menu de filtres */}
      <Menu
        anchorEl={anchorElOverviewFilter}
        open={Boolean(anchorElOverviewFilter)}
        onClose={handleCloseOverviewFilterMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, width: 450, borderRadius: 2 } } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <FormControl size="small">
              <DatePicker
                label="Date début"
                value={overviewStartDate}
                onChange={(newValue) => setOverviewStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: false,
                    size: 'small',
                    placeholder: 'JJ/MM/AAAA',
                    sx: {
                      width: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                    },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faFilter} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </FormControl>
            <FormControl size="small">
              <DatePicker
                label="Date fin"
                value={overviewEndDate}
                onChange={(newValue) => setOverviewEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: false,
                    size: 'small',
                    placeholder: 'JJ/MM/AAAA',
                    sx: {
                      width: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                    },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faFilter} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilters}
              disabled={isLoading}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Appliquer
            </Button>
          </Box>
        </Box>
      </Menu>

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
    case 'totalRequests':
      return '#ECF2FF';
    case 'avgResponseTime':
      return '#E8F7F0';
    case 'utilizationRate':
      return '#FFF8E7';
    case 'latencyAlerts':
      return '#FEECEB';
    default:
      return '#ECF2FF';
  }
}

function getIconColor(colorKey: MetricColorKey) {
  switch (colorKey) {
    case 'totalRequests':
      return '#5B8AF5'; // Bleu
    case 'avgResponseTime':
      return '#31A76C'; // Vert
    case 'utilizationRate':
      return '#FFB547'; // Jaune
    case 'latencyAlerts':
      return '#F15B50'; // Rouge
    default:
      return '#5B8AF5';
  }
}

export default MetricsCardContent;
