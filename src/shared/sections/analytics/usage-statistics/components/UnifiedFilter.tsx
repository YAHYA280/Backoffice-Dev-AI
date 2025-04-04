// /usagestatistics/components/UnifiedFilter.tsx
import { useState } from 'react';
import fr from 'date-fns/locale/fr';
import { format, subDays, subMonths } from 'date-fns';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { FontAwesome } from 'src/shared/components/fontawesome';

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

export default function UnifiedFilter({ filters, onFilterChange, view }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  // Local states for date range
  const [startDate, setStartDate] = useState<Date | null>(filters.dateRange.startDate);
  const [endDate, setEndDate] = useState<Date | null>(filters.dateRange.endDate);

  // Local states for other filters
  const [level, setLevel] = useState(filters.level);
  const [engagementRate, setEngagementRate] = useState(filters.engagementRate || 'all');
  const [connectionFrequency, setConnectionFrequency] = useState(
    filters.connectionFrequency || 'all'
  );
  const [parentActivity, setParentActivity] = useState(filters.parentActivity || 'all');

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

  // Final apply
  const handleApply = () => {
    if (startDate && endDate) {
      onFilterChange({
        dateRange: {
          startDate,
          endDate,
          label: 'Personnalisé',
        },
        level,
        engagementRate,
        connectionFrequency,
        parentActivity,
      });
    }
    handleClose();
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'dd/MM/yyyy', { locale: fr })} - ${format(endDate, 'dd/MM/yyyy', {
        locale: fr,
      })}`;
    }
    return 'Sélectionner une période';
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      {/* Filter button aligned to the right, usage is controlled by parent */}
      <Button
        variant="outlined"
        color="inherit"
        onClick={handleClick}
        endIcon={<FontAwesome icon={faFilter} />}
        sx={{ height: '100%', px: 2.5 }}
      >
        Filtres
      </Button>

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
          sx: { width: 400, p: 2 }, // Make it a bit bigger (400px)
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

        {/* Level */}
        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
          <InputLabel id="level-select-label">
            {view === 'children' ? 'Niveau' : "Niveau de l'enfant"}
          </InputLabel>
          <Select
            labelId="level-select-label"
            id="level-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            label={view === 'children' ? 'Niveau' : "Niveau de l'enfant"}
          >
            {view === 'children' ? (
              <>
                <MenuItem value="all">Tous les niveaux</MenuItem>
                <MenuItem value="CP">CP</MenuItem>
                <MenuItem value="CM1">CM1</MenuItem>
                <MenuItem value="CM2">CM2</MenuItem>
              </>
            ) : (
              <>
                <MenuItem value="all">Tous les enfants</MenuItem>
                <MenuItem value="CP">Parents d'élèves CP</MenuItem>
                <MenuItem value="CM1">Parents d'élèves CM1</MenuItem>
                <MenuItem value="CM2">Parents d'élèves CM2</MenuItem>
              </>
            )}
          </Select>
        </FormControl>

        {/* Engagement for children, or connection freq + parentActivity for parents */}
        {view === 'children' ? (
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
            <InputLabel id="engagement-rate-label">Taux d'engagement</InputLabel>
            <Select
              labelId="engagement-rate-label"
              id="engagement-rate-select"
              value={engagementRate}
              onChange={(e) => setEngagementRate(e.target.value)}
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
                onChange={(e) => setConnectionFrequency(e.target.value)}
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
                onChange={(e) => setParentActivity(e.target.value)}
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
