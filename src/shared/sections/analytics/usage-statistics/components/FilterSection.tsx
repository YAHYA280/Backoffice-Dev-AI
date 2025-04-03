import type { SelectChangeEvent } from '@mui/material/Select';

import { useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';

import { FontAwesome } from 'src/shared/components/fontawesome';

// ----------------------------------------------------------------------

type FilterValues = {
  level: string;
  dateRange: string;
  searchQuery: string;
  engagementRate?: string; // Pour la vue enfants
  connectionFrequency?: string; // Pour la vue parents
  parentActivity?: string; // Pour la vue parents
};

type Props = {
  filters: FilterValues;
  onFilterChange: (newFilters: Partial<FilterValues>) => void;
  view: 'children' | 'parents';
};

export default function FilterSection({ filters, onFilterChange, view }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: SelectChangeEvent<string>, filterName: keyof FilterValues) => {
    onFilterChange({ [filterName]: event.target.value });
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  // Obtenir les options de niveau en fonction de la vue sélectionnée
  const getLevelOptions = () => {
    if (view === 'children') {
      return (
        <>
          <MenuItem value="all">Tous les niveaux</MenuItem>
          <MenuItem value="CP">CP</MenuItem>
          <MenuItem value="CM1">CM1</MenuItem>
          <MenuItem value="CM2">CM2</MenuItem>
        </>
      );
    }
    return (
      <>
        <MenuItem value="all">Tous les enfants</MenuItem>
        <MenuItem value="CP">Parents d&apos;élèves CP</MenuItem>
        <MenuItem value="CM1">Parents d&apos;élèves CM1</MenuItem>
        <MenuItem value="CM2">Parents d&apos;élèves CM2</MenuItem>
      </>
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClick}
          endIcon={<FontAwesome icon={faFilter} />}
          sx={{ height: '100%', px: 2.5 }}
        >
          Filtres
        </Button>
      </Box>

      <Popover
        id={id}
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
          sx: { width: 300, p: 3 },
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Filtrer par
        </Typography>

        <Stack spacing={2.5}>
          {/* Options de niveau */}
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="level-select-label">
              {view === 'children' ? 'Niveau' : "Niveau de l'enfant"}
            </InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              value={filters.level}
              onChange={(e) => handleChange(e, 'level')}
              label={view === 'children' ? 'Niveau' : "Niveau de l'enfant"}
            >
              {getLevelOptions()}
            </Select>
          </FormControl>

          {/* Options de période */}
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="date-range-select-label">Période</InputLabel>
            <Select
              labelId="date-range-select-label"
              id="date-range-select"
              value={filters.dateRange}
              onChange={(e) => handleChange(e, 'dateRange')}
              label="Période"
            >
              <MenuItem value="last7days">7 derniers jours</MenuItem>
              <MenuItem value="last30days">30 derniers jours</MenuItem>
              <MenuItem value="last3months">3 derniers mois</MenuItem>
              <MenuItem value="last6months">6 derniers mois</MenuItem>
              <MenuItem value="lastYear">Dernière année</MenuItem>
            </Select>
          </FormControl>

          {/* Options spécifiques à la vue enfants */}
          {view === 'children' && (
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="engagement-rate-label">Taux d&apos;engagement</InputLabel>
              <Select
                labelId="engagement-rate-label"
                id="engagement-rate-select"
                value={filters.engagementRate || 'all'}
                onChange={(e) => handleChange(e, 'engagementRate')}
                label="Taux d'engagement"
              >
                <MenuItem value="all">Tous</MenuItem>
                <MenuItem value="high">Élevé (&gt;75%)</MenuItem>
                <MenuItem value="medium">Moyen (50-75%)</MenuItem>
                <MenuItem value="low">Faible (25-50%)</MenuItem>
                <MenuItem value="critical">Critique ({`<`}25%)</MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Options spécifiques à la vue parents */}
          {view === 'parents' && (
            <>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="connection-frequency-label">Fréquence de connexion</InputLabel>
                <Select
                  labelId="connection-frequency-label"
                  id="connection-frequency-select"
                  value={filters.connectionFrequency || 'all'}
                  onChange={(e) => handleChange(e, 'connectionFrequency')}
                  label="Fréquence de connexion"
                >
                  <MenuItem value="all">Toutes fréquences</MenuItem>
                  <MenuItem value="daily">Quotidienne</MenuItem>
                  <MenuItem value="weekly">Hebdomadaire</MenuItem>
                  <MenuItem value="monthly">Mensuelle</MenuItem>
                  <MenuItem value="rarely">Rare</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="parent-activity-label">Activité parentale</InputLabel>
                <Select
                  labelId="parent-activity-label"
                  id="parent-activity-select"
                  value={filters.parentActivity || 'all'}
                  onChange={(e) => handleChange(e, 'parentActivity')}
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

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Appliquer
            </Button>
          </Box>
        </Stack>
      </Popover>
    </>
  );
}
