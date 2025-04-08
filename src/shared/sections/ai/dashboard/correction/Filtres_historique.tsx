// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\shared\sections\ai\dashboard\correction\Filtres_historique.tsx

import React, { useState } from 'react';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Grid,
  Chip,
  Button,
  Dialog,
  Select,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

import { 
  mockAssistants, 
  correctionTypes,
  defaultFilterOptions
} from '../../../../_mock/_correction_ai';

import type {
  FilterOptions} from '../../../../_mock/_correction_ai';

interface FiltresHistoriqueProps {
  onApplyFilters: (filters: FilterOptions) => void;
  defaultFilters?: FilterOptions;
}

const FiltresHistorique: React.FC<FiltresHistoriqueProps> = ({ 
  onApplyFilters,
  defaultFilters = defaultFilterOptions
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (field: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    handleClose();
  };

  const handleReset = () => {
    setFilters(defaultFilterOptions);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FontAwesomeIcon icon={faFilter} />}
        onClick={handleOpen}
        sx={{ mb: 2 }}
      >
        Filtrer l&apos;historique
      </Button>
      
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Filtrage de l&apos;historique des corrections</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={3}>
              {/* Période */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="period-label">Période</InputLabel>
                  <Select
                    labelId="period-label"
                    value={filters.period}
                    label="Période"
                    onChange={(e) => handleChange('period', e.target.value)}
                  >
                    <MenuItem value="today">Aujourd&apos;hui</MenuItem>
                    <MenuItem value="yesterday">Hier</MenuItem>
                    <MenuItem value="last7days">7 derniers jours</MenuItem>
                    <MenuItem value="last30days">30 derniers jours</MenuItem>
                    <MenuItem value="custom">Période personnalisée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Recherche */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Recherche"
                  variant="outlined"
                  value={filters.searchTerm}
                  onChange={(e) => handleChange('searchTerm', e.target.value)}
                  sx={{ mt: 2 }}
                  placeholder="Rechercher par mot-clé..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        🔍
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Période personnalisée */}
              {filters.period === 'custom' && (
                <>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date de début"
                        value={filters.startDate}
                        onChange={(date) => handleChange('startDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date de fin"
                        value={filters.endDate}
                        onChange={(date) => handleChange('endDate', date)}
                        slotProps={{ textField: { fullWidth: true } }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Filtres avancés
                  </Typography>
                </Divider>
              </Grid>

              {/* Type d'assistant */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="assistant-type-label">Type d&apos;assistant</InputLabel>
                  <Select
                    labelId="assistant-type-label"
                    value={filters.type || 'all'}
                    label="Type d'assistant"
                    onChange={(e) => handleChange('type', e.target.value)}
                  >
                    <MenuItem value="all">Tous les types</MenuItem>
                    <MenuItem value="japprends">J&apos;apprends</MenuItem>
                    <MenuItem value="accueil">Accueil</MenuItem>
                    <MenuItem value="recherche">Recherche</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Niveau d'éducation */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="education-level-label">Niveau d&apos;éducation</InputLabel>
                  <Select
                    labelId="education-level-label"
                    value={filters.level || 'all'}
                    label="Niveau d'éducation"
                    onChange={(e) => handleChange('level', e.target.value)}
                  >
                    <MenuItem value="all">Tous les niveaux</MenuItem>
                    <MenuItem value="CP">CP</MenuItem>
                    <MenuItem value="CE1">CE1</MenuItem>
                    <MenuItem value="CE2">CE2</MenuItem>
                    <MenuItem value="CM1">CM1</MenuItem>
                    <MenuItem value="CM2">CM2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Assistants spécifiques */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="assistants-label">Assistants</InputLabel>
                  <Select
                    labelId="assistants-label"
                    multiple
                    value={filters.assistants || []}
                    onChange={(e) => handleChange('assistants', e.target.value)}
                    input={<OutlinedInput label="Assistants" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {mockAssistants.map((assistant) => (
                      <MenuItem key={assistant} value={assistant}>
                        {assistant}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Types de correction */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="correction-types-label">Types de correction</InputLabel>
                  <Select
                    labelId="correction-types-label"
                    multiple
                    value={filters.correctionTypes || []}
                    onChange={(e) => handleChange('correctionTypes', e.target.value)}
                    input={<OutlinedInput label="Types de correction" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {correctionTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleReset} color="inherit">
            Réinitialiser
          </Button>
          <Button onClick={handleClose} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleApply} variant="contained" color="primary">
            Appliquer les filtres
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FiltresHistorique;