"use client";

import type { ApexOptions } from 'apexcharts';
import type { CardProps } from '@mui/material/Card';

import Chart from 'react-apexcharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

import { fNumber, fPercent, fShortenNumber } from 'src/utils/format-number';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/shared/theme/styles';

import { SvgColor } from 'src/shared/components/svg-color/svg-color';

// ----------------------------------------------------------------------
export type ColorType = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

type Props = CardProps & {
  title: string;
  total: number;
  percent?: number;
  color?: ColorType;
  icon: React.ReactNode;
  chart?: {
    series: number[];
    categories: string[];
    options?: ApexOptions;
  };
  showPercentWithTotal?: boolean;
  showPercentAsTotal?: boolean;
  isNegativeMetric?: boolean;
  isNeutralMetric?: boolean;
};

export function CorrectionWidgetSummary({
  icon,
  title,
  total,
  chart,
  percent,
  color = 'primary',
  sx,
  showPercentWithTotal = false,
  showPercentAsTotal = false,
  isNegativeMetric = false,
  isNeutralMetric = false,
  ...other
}: Props) {
  const theme = useTheme();

  let dynamicColor = color;

  if (percent !== undefined && !isNeutralMetric) {
    if (isNegativeMetric) {
      dynamicColor = percent >= 0 ? 'error' : 'success';
    } else {
      dynamicColor = percent >= 0 ? 'success' : 'error';
    }
  }

  const chartColors = chart ? [theme.palette[dynamicColor].dark] : [];

  const chartOptions: ApexOptions = chart ? {
    chart: { sparkline: { enabled: true } },
    colors: chartColors,
    xaxis: { categories: chart.categories },
    grid: {
      padding: {
        top: 6,
        left: 6,
        right: 6,
        bottom: 6,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fNumber(value),
        title: { formatter: () => '' }
      },
    },
    ...chart?.options,
  } : {};

  const getPercentColor = () => {
    if (percent === undefined) return '';

    if (isNeutralMetric) {
      return `${color}.main`;
    }  if (isNegativeMetric) {
      return percent >= 0 ? 'error.main' : 'success.main';
    } 
      return percent >= 0 ? 'success.main' : 'error.main';
  };

  const getTrendIcon = () => {
    if (isNeutralMetric) {
      return faMinus;
    } 
      return percent !== undefined && percent < 0 ? faArrowDown : faArrowUp;
  };

  const renderTrending = percent !== undefined && !showPercentAsTotal && (
    <Box
      sx={{
        top: 16,
        gap: 0.5,
        right: 16,
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        color: getPercentColor(),
      }}
    >
      <FontAwesomeIcon icon={getTrendIcon()} width={20} />
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
      </Box>
    </Box>
  );

  const displayValue = showPercentAsTotal && percent !== undefined
    ? (
      <Box sx={{ typography: 'h4', display: 'flex', alignItems: 'center' }}>
        {percent > 0 && '+'}
        {fPercent(percent)}
        <FontAwesomeIcon
          icon={getTrendIcon()}
          style={{
            marginLeft: '8px',
            fontSize: '0.8em',
            color: isNeutralMetric
              ? theme.palette[color].main
              : (isNegativeMetric
                ? (percent !== undefined && percent >= 0 ? theme.palette.error.main : theme.palette.success.main)
                : (percent !== undefined && percent >= 0 ? theme.palette.success.main : theme.palette.error.main))
          }}
        />
      </Box>
    )
    : (
      <Box sx={{ typography: 'h4' }}>
        {typeof total === 'number' ? fShortenNumber(total) : total}
        {showPercentWithTotal && percent !== undefined && (
          <Box component="span" sx={{
            ml: 1,
            typography: 'subtitle2',
            color: getPercentColor(),
          }}>
            {percent > 0 && '+'}
            {fPercent(percent)}
          </Box>
        )}
      </Box>
    );

  return (
    <Card
      sx={{
        ...bgGradient({
          color: `135deg, ${varAlpha(theme.vars.palette[dynamicColor].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[dynamicColor].lightChannel, 0.48)}`,
        }),
        p: 3,
        boxShadow: 'none',
        position: 'relative',
        color: `${dynamicColor}.darker`,
        backgroundColor: 'common.white',
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ width: 48, height: 48, mb: 3 }}>{icon}</Box>

      {!showPercentAsTotal && renderTrending}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 112 }}>
          <Box sx={{ mb: 1, typography: 'subtitle2' }}>{title}</Box>
          {displayValue}
        </Box>

        {chart && (
          <Chart
            type="line"
            series={[{ data: chart.series }]}
            options={chartOptions}
            width={84}
            height={56}
          />
        )}
      </Box>

      <SvgColor
        src={`${CONFIG.site.basePath}/assets/background/shape-square.svg`}
        sx={{
          top: 0,
          left: -20,
          width: 240,
          zIndex: -1,
          height: 240,
          opacity: 0.24,
          position: 'absolute',
          color: `${dynamicColor}.main`,
        }}
      />
    </Card>
  );
}
