import { useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { FontAwesome } from 'src/shared/components/fontawesome';

// ----------------------------------------------------------------------

type FilterValues = {
  level: string;
  dateRange: string;
  searchQuery: string;
};

type Props = {
  filters: FilterValues;
  onFilterChange: (newFilters: Partial<FilterValues>) => void;
};

export default function FilterSection({ filters, onFilterChange }: Props) {
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
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="level-select-label">Niveau</InputLabel>
            <Select
              labelId="level-select-label"
              id="level-select"
              value={filters.level}
              onChange={(e) => handleChange(e, 'level')}
              label="Niveau"
            >
              <MenuItem value="all">Tous les niveaux</MenuItem>
              <MenuItem value="CP">CP</MenuItem>
              <MenuItem value="CM1">CM1</MenuItem>
              <MenuItem value="CM2">CM2</MenuItem>
            </Select>
          </FormControl>

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
