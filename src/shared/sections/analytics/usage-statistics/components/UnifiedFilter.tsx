// /usagestatistics/components/UnifiedFilter.tsx
import type { SelectChangeEvent } from '@mui/material/Select';

import fr from 'date-fns/locale/fr';
import { useState, useEffect } from 'react';
import { format, subDays, subMonths } from 'date-fns';
import { faRedo, faFilter } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FontAwesome } from 'src/shared/components/fontawesome';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// ----------------------------------------------
// Types
// ----------------------------------------------
export type DateRange = {
  startDate: Date;
  endDate: Date;
  label?: string;
};

export type FilterValues = {
  level: string;
  dateRange: DateRange;
  searchQuery: string;
  engagementRate?: string; // For children
  connectionFrequency?: string; // For parents
  parentActivity?: string; // For parents
};

type Props = {
  filters: FilterValues;
  onFilterChange: (newFilters: Partial<FilterValues>) => void;
  view: 'children' | 'parents';
};

// Default date range - 30 days
const getDefaultDateRange = (): DateRange => ({
  startDate: subDays(new Date(), 30),
  endDate: new Date(),
  label: '30 derniers jours',
});

export default function UnifiedFilter({ filters, onFilterChange, view }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  // Local states for date range
  const [startDate, setStartDate] = useState<Date | null>(filters.dateRange.startDate);
  const [endDate, setEndDate] = useState<Date | null>(filters.dateRange.endDate);

  // Local states for other filters - initialize from props
  const [level, setLevel] = useState(filters.level);
  const [engagementRate, setEngagementRate] = useState(filters.engagementRate || 'all');
  const [connectionFrequency, setConnectionFrequency] = useState(
    filters.connectionFrequency || 'all'
  );
  const [parentActivity, setParentActivity] = useState(filters.parentActivity || 'all');

  // Update local state when props change
  useEffect(() => {
    setStartDate(filters.dateRange.startDate);
    setEndDate(filters.dateRange.endDate);
    setLevel(filters.level);
    setEngagementRate(filters.engagementRate || 'all');
    setConnectionFrequency(filters.connectionFrequency || 'all');
    setParentActivity(filters.parentActivity || 'all');
  }, [filters]);

  // Predefined ranges
  const predefinedRanges = [
    {
      label: '7 derniers jours',
      range: {
        startDate: subDays(new Date(), 7),
        endDate: new Date(),
        label: '7 derniers jours',
      },
    },
    {
      label: '30 derniers jours',
      range: {
        startDate: subDays(new Date(), 30),
        endDate: new Date(),
        label: '30 derniers jours',
      },
    },
    {
      label: '3 derniers mois',
      range: {
        startDate: subMonths(new Date(), 3),
        endDate: new Date(),
        label: '3 derniers mois',
      },
    },
    {
      label: '6 derniers mois',
      range: {
        startDate: subMonths(new Date(), 6),
        endDate: new Date(),
        label: '6 derniers mois',
      },
    },
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Quick pick date
  const handlePredefinedRangeClick = (range: DateRange) => {
    setStartDate(range.startDate);
    setEndDate(range.endDate);
  };

  // Handle engagement rate change
  const handleEngagementRateChange = (event: SelectChangeEvent) => {
    setEngagementRate(event.target.value);
  };

  // Handle connection frequency change
  const handleConnectionFrequencyChange = (event: SelectChangeEvent) => {
    setConnectionFrequency(event.target.value);
  };

  // Handle parent activity change
  const handleParentActivityChange = (event: SelectChangeEvent) => {
    setParentActivity(event.target.value);
  };

  // Apply a single filter change directly
  const applyFilterDirectly = (filterName: string, value: any) => {
    const newFilter: Partial<FilterValues> = {};
    newFilter[filterName as keyof FilterValues] = value;
    onFilterChange(newFilter);
  };

  // Final apply - send all filter changes back up to parent
  const handleApply = () => {
    if (startDate && endDate) {
      const newFilters: Partial<FilterValues> = {
        dateRange: {
          startDate,
          endDate,
          label: 'Personnalisé',
        },
        level,
      };

      // Add view-specific filters
      if (view === 'children') {
        newFilters.engagementRate = engagementRate;
      } else {
        newFilters.connectionFrequency = connectionFrequency;
        newFilters.parentActivity = parentActivity;
      }

      // Debug log

      onFilterChange(newFilters);
    }
    handleClose();
  };

  // Handle refresh/reset filters
  const handleResetFilters = () => {
    // Reset to default values
    const defaultFilters: Partial<FilterValues> = {
      level: 'all',
      dateRange: getDefaultDateRange(),
      searchQuery: '',
      engagementRate: 'all',
      connectionFrequency: 'all',
      parentActivity: 'all',
    };

    // Apply default filters
    onFilterChange(defaultFilters);
  };

  // Format date range for display
  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM/yyyy', { locale: fr })} - ${format(endDate, 'dd/MM/yyyy', {
        locale: fr,
      })}`;
    }
    return 'Sélectionner une période';
  };

  // Calculate active filter count for the button badge
  const getActiveFilterCount = () => {
    let count = 0;
    if (level !== 'all') count += 1;
    if (view === 'children' && engagementRate !== 'all') count += 1;
    if (view === 'parents' && connectionFrequency !== 'all') count += 1;
    if (view === 'parents' && parentActivity !== 'all') count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* Refresh button to reset filters */}
        <Tooltip title="Réinitialiser les filtres">
          <IconButton
            color="inherit"
            onClick={handleResetFilters}
            sx={{
              height: 40,
              width: 40,
              bgcolor: 'background.paper',
              '&:hover': { bgcolor: (theme) => theme.palette.grey[200] },
              boxShadow: (theme) => `0 0 2px ${theme.palette.grey[400]}`,
            }}
          >
            <FontAwesome icon={faRedo} width={16} />
          </IconButton>
        </Tooltip>

        {/* Filter button with badge for active filters */}
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{
            height: 40,
            width: 40,
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': { bgcolor: (theme) => theme.palette.grey[200] },
            position: 'relative',
          }}
        >
          <FontAwesome icon={faFilter} width={16} />
          <ConditionalComponent isValid={activeFilterCount > 0}>
            <Chip
              label={activeFilterCount}
              color="primary"
              size="small"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                height: 20,
                minWidth: 20,
                fontSize: '0.625rem',
              }}
            />
          </ConditionalComponent>
        </IconButton>
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, p: 2 },
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Filtrer par
        </Typography>

        {/* Predefined date range buttons */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {predefinedRanges.map((item) => (
            <Button
              key={item.label}
              variant="outlined"
              size="small"
              onClick={() => handlePredefinedRangeClick(item.range)}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Start/end date pickers */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <DatePicker
            label="Date de début"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            format="dd/MM/yyyy"
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label="Date de fin"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            minDate={startDate || undefined}
            format="dd/MM/yyyy"
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Box>

        <Typography variant="body2" sx={{ mb: 2, fontStyle: 'italic' }}>
          Période sélectionnée: {formatDateRange()}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Engagement for children, or connection freq + parentActivity for parents */}
        {view === 'children' ? (
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
            <InputLabel id="engagement-rate-label">Taux d&apos;engagement</InputLabel>
            <Select
              labelId="engagement-rate-label"
              id="engagement-rate-select"
              value={engagementRate}
              onChange={handleEngagementRateChange}
              label="Taux d'engagement"
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="high">Élevé (&gt;75%)</MenuItem>
              <MenuItem value="medium">Moyen (50-75%)</MenuItem>
              <MenuItem value="low">Faible (25-50%)</MenuItem>
              <MenuItem value="critical">Critique (&lt;25%)</MenuItem>
            </Select>
          </FormControl>
        ) : (
          <>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel id="connection-frequency-label">Fréquence de connexion</InputLabel>
              <Select
                labelId="connection-frequency-label"
                id="connection-frequency-select"
                value={connectionFrequency}
                onChange={handleConnectionFrequencyChange}
                label="Fréquence de connexion"
              >
                <MenuItem value="all">Toutes fréquences</MenuItem>
                <MenuItem value="daily">Quotidienne</MenuItem>
                <MenuItem value="weekly">Hebdomadaire</MenuItem>
                <MenuItem value="monthly">Mensuelle</MenuItem>
                <MenuItem value="rarely">Rare</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel id="parent-activity-label">Activité parentale</InputLabel>
              <Select
                labelId="parent-activity-label"
                id="parent-activity-select"
                value={parentActivity}
                onChange={handleParentActivityChange}
                label="Activité parentale"
              >
                <MenuItem value="all">Toutes activités</MenuItem>
                <MenuItem value="high">Très active</MenuItem>
                <MenuItem value="medium">Moyennement active</MenuItem>
                <MenuItem value="low">Peu active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="outlined" color="inherit" onClick={handleClose} sx={{ mr: 1 }}>
            Annuler
          </Button>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Appliquer
          </Button>
        </Box>
      </Popover>
    </LocalizationProvider>
  );
}
