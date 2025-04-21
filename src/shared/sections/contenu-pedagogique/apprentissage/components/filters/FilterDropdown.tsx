import React, { useState, useEffect } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box ,
  Stack,
  Badge,
  Button,
  Select,
  Tooltip,
  Popover,
  Divider,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  IconButton,
  InputLabel,
  FormControl,
} from '@mui/material';


// A single filter option type
export interface FilterOption {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  placeholder?: string;
  operators?: Array<{
    value: string;
    label: string;
  }>;
  selectOptions?: Array<{
    value: string;
    label: string;
  }>;
}

// A single active filter
export interface ActiveFilter {
  field: string;
  operator: string;
  value: string | number | Date | null;
}

interface FilterDropdownProps {
  filterOptions: FilterOption[];
  activeFilters: ActiveFilter[];
  onFilterChange: (filters: ActiveFilter[]) => void;
  buttonText?: string;
  icon?: React.ReactNode;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterOptions,
  activeFilters,
  onFilterChange,
  buttonText = '',
  icon,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ActiveFilter[]>(activeFilters);

  useEffect(() => {
    setCurrentFilters(activeFilters);
  }, [activeFilters]);

  // Add a new empty filter
  const [tempFilter, setTempFilter] = useState<ActiveFilter | null>(null);

  const handleOpenFilters = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseFilters = () => {
    setAnchorEl(null);
  };

  const handleAddFilter = () => {
    if (filterOptions.length > 0) {
      const defaultOption = filterOptions[0];
      const defaultOperator = defaultOption.operators?.[0]?.value || 'equals';

      setTempFilter({
        field: defaultOption.id,
        operator: defaultOperator,
        value: '',
      });
    }
  };

  const handleConfirmFilter = () => {
    if (tempFilter) {
      setCurrentFilters([...currentFilters, tempFilter]);
      setTempFilter(null);
    }
  };

  const handleCancelFilter = () => {
    setTempFilter(null);
  };

  const handleUpdateTempFilter = (
    key: 'field' | 'operator' | 'value',
    value: string | number | Date | null
  ) => {
    if (tempFilter) {
      if (key === 'field') {
        // When field changes, reset operator to the first available for the new field
        const fieldOption = filterOptions.find((option) => option.id === value);
        const defaultOperator = fieldOption?.operators?.[0]?.value || 'equals';

        setTempFilter({
          ...tempFilter,
          field: value as string,
          operator: defaultOperator,
          value: '',
        });
      } else {
        setTempFilter({
          ...tempFilter,
          [key]: value,
        });
      }
    }
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...currentFilters];
    newFilters.splice(index, 1);
    setCurrentFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(currentFilters);
    handleCloseFilters();
  };

  const handleResetFilters = () => {
    setCurrentFilters([]);
  };

  const open = Boolean(anchorEl);
  const filterCount = currentFilters.length;

  const getFilterOptionLabel = (field: string) => {
    const option = filterOptions.find((opt) => opt.id === field);
    return option ? option.label : field;
  };

  const getOperatorLabel = (field: string, operator: string) => {
    const option = filterOptions.find((opt) => opt.id === field);
    const operatorOption = option?.operators?.find((op) => op.value === operator);
    return operatorOption ? operatorOption.label : operator;
  };

  return (
    <>
      <Button
        color="primary"
        onClick={handleOpenFilters}
        startIcon={
          <Tooltip title='Filtres' arrow>
            <Badge badgeContent={filterCount} color="error" invisible={filterCount === 0}>
              {icon}
            </Badge>
          </Tooltip>
        }
        sx={{
          minWidth: 10,
          borderRadius: 1,
          justifyContent: 'center',
          '.MuiButton-startIcon': {
            marginLeft: 0,
            marginRight: 0,
          },
          transition: (t) => t.transitions.create(['background-color']),
          ...(open && {
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseFilters}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            p: 3,
            boxShadow: theme.customShadows?.z20,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Current Filters List */}
        {currentFilters.length > 0 ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters
            </Typography>
            <Stack spacing={1.5}>
              {currentFilters.map((filter, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: 'background.neutral',
                  }}
                >
                  <Typography variant="body2">
                    <strong>{getFilterOptionLabel(filter.field)}</strong>{' '}
                    {getOperatorLabel(filter.field, filter.operator)}{' '}
                    <em>
                      {filter.value instanceof Date
                        ? filter.value.toLocaleDateString()
                        : String(filter.value)}
                    </em>
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFilter(index)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.75rem' }} />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Aucun filtre appliqué
          </Typography>
        )}

        {/* Add new filter section */}
        {tempFilter ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Ajouter un filtre
            </Typography>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Champ</InputLabel>
                <Select
                  value={tempFilter.field}
                  label="Field"
                  onChange={(e) => handleUpdateTempFilter('field', e.target.value)}
                >
                  {filterOptions.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Operator Selection */}
              {(() => {
                const fieldOption = filterOptions.find((option) => option.id === tempFilter.field);
                if (fieldOption?.operators && fieldOption.operators.length > 0) {
                  return (
                    <FormControl fullWidth size="small">
                      <InputLabel>Opérateur</InputLabel>
                      <Select
                        value={tempFilter.operator}
                        label="Operator"
                        onChange={(e) => handleUpdateTempFilter('operator', e.target.value)}
                      >
                        {fieldOption.operators.map((op) => (
                          <MenuItem key={op.value} value={op.value}>
                            {op.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  );
                }
                return null;
              })()}

              {/* Value Input */}
              {(() => {
                const fieldOption = filterOptions.find((option) => option.id === tempFilter.field);

                if (fieldOption) {
                  switch (fieldOption.type) {
                    case 'select':
                      return (
                        <FormControl fullWidth size="small">
                          <InputLabel>Valeur</InputLabel>
                          <Select
                            value={tempFilter.value || ''}
                            label="Value"
                            onChange={(e) => handleUpdateTempFilter('value', e.target.value)}
                          >
                            {fieldOption.selectOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      );
                    case 'number':
                      return (
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label="Value"
                          value={tempFilter.value || ''}
                          onChange={(e) => handleUpdateTempFilter('value', e.target.value)}
                          placeholder={fieldOption.placeholder}
                        />
                      );
                    case 'date':
                      return (
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="Value"
                          value={tempFilter.value || ''}
                          onChange={(e) => handleUpdateTempFilter('value', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      );
                    default: // text
                      return (
                        <TextField
                          fullWidth
                          size="small"
                          label="Value"
                          value={tempFilter.value || ''}
                          onChange={(e) => handleUpdateTempFilter('value', e.target.value)}
                          placeholder={fieldOption.placeholder}
                        />
                      );
                  }
                }
                return null;
              })()}

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                <Button size="small" color="primary" onClick={handleCancelFilter}>
                  Annuler
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleConfirmFilter}
                  disabled={!tempFilter.value}
                >
                  Ajouter un filtre
                </Button>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Button
            size="small"
            variant="outlined"
            onClick={handleAddFilter}
            sx={{ mb: 3, width: '100%' }}
          >
            Ajouter un filtre
          </Button>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleResetFilters}
            disabled={currentFilters.length === 0}
          >
            Réinitialiser
          </Button>
          <Button variant="contained" size="small" onClick={handleApplyFilters}>
            Appliquer les filtres
          </Button>
        </Box>
      </Popover>
    </>
  );
};
