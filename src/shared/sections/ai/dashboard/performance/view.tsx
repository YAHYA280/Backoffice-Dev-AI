'use client';

import type { Dayjs } from 'dayjs';
import type { ComparisonType } from 'src/contexts/types/ai-performance';

import dayjs from 'dayjs';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import Badge from '@mui/material/Badge';
import { DatePicker } from '@mui/x-date-pickers';
import {
  Box,
  Grid,
  Menu,
  Button,
  Tooltip,
  IconButton,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { CATEGORIES_AI_ASSISTANT } from 'src/shared/_mock/_ai';

import { AiQueryAnalysis } from './aiQueryAnalysis';
import { AssistantComparison } from './assistantComparison';

// ----------------------------------------------------------------------
type Props = {
  title?: string;
};

export default function AIPerformanceView({ title = 'Performance des Assistants' }: Props) {
  // Date states
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [queryComparisonType, setQueryComparisonType] =
    useState<ComparisonType>('Sans comparaison');
  const [assistantComparisonType, setAssistantComparisonType] =
    useState<ComparisonType>('Sans comparaison');

  // Handlers for filter menu
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setAnchorElFilter(null);
  };

  const handleApplyFilters = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setActiveFilters(true);
      setIsLoading(false);
      handleCloseFilterMenu();
    }, 500);
  };

  const handleResetFilters = () => {
    setIsLoading(true);
    setStartDate(dayjs().subtract(7, 'day'));
    setEndDate(dayjs());
    setQueryComparisonType('Sans comparaison');
    setAssistantComparisonType('Sans comparaison');

    // Simulate API call
    setTimeout(() => {
      setActiveFilters(false);
      setIsLoading(false);
    }, 500);
  };

  // Créer des fonctions distinctes pour chaque composant
  const handleQueryComparisonChange = (newType: ComparisonType) => {
    setQueryComparisonType(newType);
  };

  const handleAssistantComparisonChange = (newType: ComparisonType) => {
    setAssistantComparisonType(newType);
  };

  // Data generation for charts
  const generateRandomData = (length: number, min: number, max: number) =>
    Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min);

  // Generate chart data for both normal and comparison periods
  const chartData = {
    categories: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    series: CATEGORIES_AI_ASSISTANT.map((category) => ({
      name: category,
      data: [
        {
          name: 'Nombre de requêtes',
          data: generateRandomData(
            ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].length,
            10,
            100
          ),
        },
        {
          name: 'Temps de réponse',
          data: generateRandomData(['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].length, 1, 10),
        },
        {
          name: "Taux d'utilisation",
          data: generateRandomData(
            ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].length,
            20,
            80
          ),
        },
      ],
    })),
  };

  // For the assistant comparison chart
  const generateComparisonChartData = () => {
    // Generate base comparison data
    const baseData = {
      'Nombre de requêtes': generateRandomData(CATEGORIES_AI_ASSISTANT.length, 10, 100),
      'Temps de réponse': generateRandomData(CATEGORIES_AI_ASSISTANT.length, 1, 10),
      "Taux d'utilisation": generateRandomData(CATEGORIES_AI_ASSISTANT.length, 20, 80),
    };

    // Generate comparison data
    const comparisonData =
      assistantComparisonType !== 'Sans comparaison'
        ? {
            factor:
              assistantComparisonType === 'Période précédente'
                ? 0.9
                : assistantComparisonType === 'Mois précédent'
                  ? 0.8
                  : 0.7,
            label: assistantComparisonType,
          }
        : null;

    return {
      series: [
        {
          name: 'Nombre de requêtes',
          categories: CATEGORIES_AI_ASSISTANT,
          data: [baseData['Nombre de requêtes']],
          comparisonData: comparisonData
            ? [
                [...baseData['Nombre de requêtes']].map((val) =>
                  Math.floor(val * comparisonData.factor)
                ),
              ]
            : undefined,
          comparisonLabel: comparisonData?.label,
        },
        {
          name: 'Temps de réponse',
          categories: CATEGORIES_AI_ASSISTANT,
          data: [baseData['Temps de réponse']],
          comparisonData: comparisonData
            ? [
                [...baseData['Temps de réponse']].map((val) =>
                  Math.floor(val * comparisonData.factor)
                ),
              ]
            : undefined,
          comparisonLabel: comparisonData?.label,
        },
        {
          name: "Taux d'utilisation",
          categories: CATEGORIES_AI_ASSISTANT,
          data: [baseData["Taux d'utilisation"]],
          comparisonData: comparisonData
            ? [
                [...baseData["Taux d'utilisation"]].map((val) =>
                  Math.floor(val * comparisonData.factor)
                ),
              ]
            : undefined,
          comparisonLabel: comparisonData?.label,
        },
      ],
    };
  };

  return (
    <>
      {/* Date Range Filter Box */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          m: 2,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Reset">
            <IconButton color="primary" onClick={handleResetFilters} disabled={isLoading}>
              <FontAwesomeIcon icon={faSyncAlt} className={isLoading ? 'fa-spin' : ''} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtrer par date">
            <IconButton color="primary" onClick={handleOpenFilterMenu}>
              <Badge color="primary" variant="dot" invisible={!activeFilters}>
                <FontAwesomeIcon icon={faFilter} />
              </Badge>
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Menu de filtres */}
      <Menu
        anchorEl={anchorElFilter}
        open={Boolean(anchorElFilter)}
        onClose={handleCloseFilterMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, width: 450, borderRadius: 2 } } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <FormControl size="small">
              <DatePicker
                label="Date début"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
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
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
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

      {/* Charts Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <AiQueryAnalysis
            id="demo__4"
            title="Analyse des Requêtes"
            subheader={
              activeFilters
                ? `${startDate?.format('DD/MM/YYYY')} - ${endDate?.format('DD/MM/YYYY')}`
                : '(+43%) than last year'
            }
            startDate={startDate}
            endDate={endDate}
            chart={chartData}
            comparisonType={queryComparisonType}
            onComparisonTypeChange={handleQueryComparisonChange}
          />
        </Grid>

        {/* Assistant Comparison Chart */}
        <Grid item xs={12} md={12} lg={12}>
          <AssistantComparison
            title="Analyse Comparative des Assistants"
            subheader={
              activeFilters
                ? `${startDate?.format('DD/MM/YYYY')} - ${endDate?.format('DD/MM/YYYY')}`
                : undefined
            }
            chart={generateComparisonChartData()}
            comparisonType={assistantComparisonType}
            onComparisonTypeChange={handleAssistantComparisonChange}
          />
        </Grid>
      </Grid>
    </>
  );
}
