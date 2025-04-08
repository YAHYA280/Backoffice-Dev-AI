"use client";

import type { CardProps } from '@mui/material/Card';
import type { SelectChangeEvent } from '@mui/material/Select';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  faFileExport
} from '@fortawesome/free-solid-svg-icons';
import { Line, Area, XAxis, YAxis, CartesianGrid,
  ComposedChart, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Select  from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import InfoIcon from '@mui/icons-material/Info';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import { alpha, useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import { applyCustomFilters, getMockSatisfactionTrendByPeriod, getMockComparativeSatisfactionData } from './_mock_satisfaction_trend';

import type { FilterOptions, ChartDataPoint } from './type';

type PeriodOption = 'none' | 'previousPeriod' | 'previousMonth' | 'previousYear';

interface SatisfactionTrendProps extends CardProps {
  title?: string;
  subheader?: string;
  data?: ChartDataPoint[];
  filters: FilterOptions;
  height?: number;
  objectiveValue?: number;
  showControls?: boolean;
  isLoading?: boolean;
}
export function SatisfactionTrendChart({
  title = "Évolution du Taux de Satisfaction",
  subheader,
  data,
  filters,
  height = 320,
  objectiveValue = 90,
  showControls = true,
  ...other
}: SatisfactionTrendProps) {
  const theme = useTheme();

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>('none');
  const [comparativeData, setComparativeData] = useState<ChartDataPoint[]>([]);
  const [showComparison, setShowComparison] = useState<boolean>(true);

  const chartColors = {
    line: theme.palette.success.main,
    comparativeLine: theme.palette.info.main,
    gradient: alpha(theme.palette.success.main, 0.2),
    comparativeGradient: alpha(theme.palette.info.main, 0.1),
  };

  const performanceStats = useMemo(() => {
    if (chartData.length < 2) return null;

    const currentValue = chartData[chartData.length - 1].value;
    const previousValue = chartData[0].value;
    const difference = currentValue - previousValue;
    const percentChange = (difference / previousValue) * 100;

    return {
      difference,
      percentChange,
      isPositive: difference >= 0,
    };
  }, [chartData]);

  useEffect(() => {
    let newChartData: ChartDataPoint[];

    if (data) {
      newChartData = [...data];
    } else {
      const periodData = getMockSatisfactionTrendByPeriod(filters.period || 'last7days');
      newChartData = applyCustomFilters(periodData, filters.level, filters.type , 
        {
          levels: filters.levels,
          types: filters.types,
          subjects: filters.subjects,
          chapters: filters.chapters,
          exercises: filters.exercises,
          searchTerm: filters.searchTerm,
        }
      );
    }

    setChartData(newChartData);

    if (selectedPeriod !== 'none') {
      const newComparativeData = getMockComparativeSatisfactionData(newChartData, selectedPeriod);
      setComparativeData(newComparativeData);
      setShowComparison(true);
    } else {
      setShowComparison(false);
    }
  }, [data, filters, selectedPeriod]);

  const handleChangePeriod = useCallback((event: SelectChangeEvent<PeriodOption>) => {
    const newPeriod = event.target.value as PeriodOption;
    setSelectedPeriod(newPeriod);

    if (newPeriod === 'none') {
      setShowComparison(false);
    } else {
      setShowComparison(true);
      const newComparativeData = getMockComparativeSatisfactionData(chartData, newPeriod);
      setComparativeData(newComparativeData);
    }
  }, [chartData]);

  const handleExportCSV = () => {
    const csvData = chartData.map((item, index) => ({
      period: item.period,
      value: item.value,
      comparativeValue: showComparison ? (comparativeData[index]?.value || null) : null,
    }));

    const csvLink = document.createElement('a');
    csvLink.href = `data:text/csv;charset=utf-8,${encodeURIComponent(
      csvData.map(row => Object.values(row).join(',')).join('\n')
    )}`;
    csvLink.setAttribute('download', 'satisfaction_trend.csv');
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {label}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: chartColors.line,
                mr: 1,
              }}
            />
            <Typography variant="body2">
              Satisfaction: <strong>{payload[0].value.toFixed(1)}%</strong>
            </Typography>
          </Box>

          {payload.length > 1 && payload[1] && payload[1].value !== null && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: chartColors.comparativeLine,
                  mr: 1,
                }}
              />
              <Typography variant="body2">
                {selectedPeriod === 'previousPeriod' ? 'Période précédente' :
                 selectedPeriod === 'previousMonth' ? 'Mois précédent' : 'Année précédente'}:
                <strong> {payload[1].value.toFixed(1)}%</strong>
              </Typography>
            </Box>
          )}

          {payload[0].payload.totalResponses && (
            <Typography variant="caption" color="text.secondary">
              Total de réponses: {payload[0].payload.totalResponses}
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  return (
    <Card {...other} sx={{
      boxShadow: theme.shadows[3],
      borderRadius: 2,
      overflow: 'hidden',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: theme.shadows[6],
      },
      ...other.sx
    }}>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6">{title}</Typography>
            {showControls && (
              <Tooltip title="Évolution du taux de satisfaction sur la période sélectionnée">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoIcon fontSize="small" color="info" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        }
        subheader={
          <Box sx={{ mt: 1 }}>
            {subheader && <Typography variant="body2" color="text.secondary">{subheader}</Typography>}
            {performanceStats && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    ml: 2,
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: performanceStats.isPositive
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.error.main, 0.1)
                  }}
                >
                  {performanceStats.isPositive ? (
                    <TrendingUpIcon color="success" fontSize="small" sx={{ mr: 0.5 }} />
                  ) : (
                    <TrendingDownIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                  )}
                  <Typography
                    variant="body2"
                    color={performanceStats.isPositive ? "success.main" : "error.main"}
                  >
                    {performanceStats.isPositive ? "+" : ""}
                    {performanceStats.percentChange.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        }
        action={
          showControls && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={selectedPeriod}
                  onChange={handleChangePeriod}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Comparer à' }}
                  startAdornment={<CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="none">Sans comparaison</MenuItem>
                  <MenuItem value="previousPeriod">Période précédente</MenuItem>
                  <MenuItem value="previousMonth">Mois précédent</MenuItem>
                  <MenuItem value="previousYear">Année précédente</MenuItem>
                </Select>
              </FormControl>
              <Button
    variant="text"
    startIcon={<FontAwesomeIcon icon={faFileExport} />}
    color="primary"
    onClick={handleExportCSV}
    size="small"
  />
</Box>
          )
        }
      />
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={showComparison ?
              chartData.map((item, index) => ({
                ...item,
                comparativeValue: comparativeData[index]?.value || null
              })) :
              chartData
            }
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSatisfaction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.line} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColors.line} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorComparative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.comparativeLine} stopOpacity={0.2} />
                <stop offset="95%" stopColor={chartColors.comparativeLine} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.3)} />

            <XAxis
              dataKey="period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
            />

            <YAxis
              domain={[0, 100]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              width={30}
            />

            <RechartsTooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="value"
              fill="url(#colorSatisfaction)"
              stroke="none"
              name=""
            />

            <Line
              type="monotone"
              dataKey="value"
              name="Taux de satisfaction actuel (%)"
              stroke={chartColors.line}
              strokeWidth={2}
              dot={{ r: 3, fill: theme.palette.background.paper, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: chartColors.line, stroke: theme.palette.background.paper, strokeWidth: 2 }}
            />

            {showComparison && (
              <>
                <Area
                  type="monotone"
                  dataKey="comparativeValue"
                  fill="url(#colorComparative)"
                  stroke="none"
                />

                <Line
                  type="monotone"
                  dataKey="comparativeValue"
                  name={selectedPeriod === 'previousPeriod' ? 'Période précédente' :
                        selectedPeriod === 'previousMonth' ? 'Mois précédent' : 'Année précédente'}
                  stroke={chartColors.comparativeLine}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2, fill: theme.palette.background.paper, strokeWidth: 2 }}
                  activeDot={{ r: 5, fill: chartColors.comparativeLine, stroke: theme.palette.background.paper, strokeWidth: 2 }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default SatisfactionTrendChart;