'use client';

import type { Dayjs } from 'dayjs';
import type { SelectChangeEvent } from '@mui/material/Select';
import type { ICGUFilters } from 'src/contexts/types/configuration';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { LocalizationProvider } from 'src/shared/locales';

interface ConfigurationFilterInputsProps {
  filters: ICGUFilters;
  onFiltersChange: (name: string, value: any) => void;
  onResetFilters: () => void;
  isExpanded: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  onFilterCountChange?: (count: number) => void;
  resetTriggered?: boolean;
}

const FILTER_COLUMNS = [
  { id: 'title', label: 'Titre' },
  { id: 'version', label: 'Version' },
  { id: 'authorName', label: 'Auteur' },
  { id: 'publishDate', label: 'Date de publication' },
  { id: 'expirationDate', label: "Date d'expiration" },
  { id: 'lastModifiedAt', label: 'Dernière modification' },
];

const FILTER_OPERATORS = [
  { id: 'contains', label: 'Contient', textBased: true, dateBased: false },
  { id: 'equals', label: 'Égal à', textBased: true, dateBased: true },
  { id: 'startsWith', label: 'Commence par', textBased: true, dateBased: false },
  { id: 'endsWith', label: 'Termine par', textBased: true, dateBased: false },
  { id: 'empty', label: 'Vide', textBased: true, dateBased: false },
  { id: 'notEmpty', label: 'Non vide', textBased: true, dateBased: false },
  { id: 'greaterThan', label: 'Supérieur à', textBased: false, dateBased: true },
  { id: 'lessThan', label: 'Inférieur à', textBased: false, dateBased: true },
  { id: 'between', label: 'Entre', textBased: false, dateBased: true },
];

export function ConfigurationFilterInputs({
  filters,
  onFiltersChange,
  onResetFilters,
  isExpanded,
  anchorEl,
  onClose,
  onFilterCountChange,
  resetTriggered,
}: ConfigurationFilterInputsProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>('');
  const [selectedOperator, setSelectedOperator] = useState<string>('contains');
  const [filterValue, setFilterValue] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // Maintain two separate filter states - pending (in popover) and applied (visible outside)
  const [pendingFilters, setPendingFilters] = useState<
    Array<{
      id: string;
      column: string;
      operator: string;
      value: any;
      displayValue: string;
    }>
  >([]);

  const [appliedFilters, setAppliedFilters] = useState<
    Array<{
      id: string;
      column: string;
      operator: string;
      value: any;
      displayValue: string;
    }>
  >([]);

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  // Notify parent component when filter count changes
  useEffect(() => {
    if (onFilterCountChange) {
      onFilterCountChange(appliedFilters.length);
    }
  }, [appliedFilters, onFilterCountChange]);

  // Effect to handle the reset trigger
  useEffect(() => {
    setAppliedFilters([]);
    setPendingFilters([]);
  }, [resetTriggered]);

  // Initialize applied filters from props on component mount
  useEffect(() => {
    const initialFilters = [];

    if (filters.title) {
      initialFilters.push({
        id: `title-${Date.now()}`,
        column: 'title',
        operator: 'contains',
        value: filters.title,
        displayValue: `Titre: ${filters.title}`,
      });
    }

    if (filters.version) {
      initialFilters.push({
        id: `version-${Date.now()}`,
        column: 'version',
        operator: 'contains',
        value: filters.version,
        displayValue: `Version: ${filters.version}`,
      });
    }

    if (filters.authorName) {
      initialFilters.push({
        id: `authorName-${Date.now()}`,
        column: 'authorName',
        operator: 'contains',
        value: filters.authorName,
        displayValue: `Auteur: ${filters.authorName}`,
      });
    }

    if (filters.publishDate) {
      initialFilters.push({
        id: `publishDate-${Date.now()}`,
        column: 'publishDate',
        operator: 'equals',
        value: filters.publishDate,
        displayValue: `Date de publication: ${new Date(filters.publishDate).toLocaleDateString()}`,
      });
    }

    if (filters.expirationDate) {
      initialFilters.push({
        id: `expirationDate-${Date.now()}`,
        column: 'expirationDate',
        operator: 'equals',
        value: filters.expirationDate,
        displayValue: `Date d'expiration: ${new Date(filters.expirationDate).toLocaleDateString()}`,
      });
    }

    if (filters.lastModifiedAt) {
      initialFilters.push({
        id: `lastModifiedAt-${Date.now()}`,
        column: 'lastModifiedAt',
        operator: 'equals',
        value: filters.lastModifiedAt,
        displayValue: `Dernière modification: ${new Date(filters.lastModifiedAt).toLocaleDateString()}`,
      });
    }

    if (initialFilters.length > 0) {
      setAppliedFilters(initialFilters);
      setPendingFilters([]);
    }
  }, [filters]);

  // Reset form when popover opens, but initialize pending filters with currently applied filters
  useEffect(() => {
    if (open) {
      setPendingFilters([...appliedFilters]);
      setSelectedColumn('title');
      setSelectedOperator('contains');
      setFilterValue('');
      setSelectedDate(null);
    }
  }, [open, appliedFilters]);

  const handleColumnChange = (event: SelectChangeEvent<string>) => {
    setSelectedColumn(event.target.value);
    // Reset operator and value when column changes
    if (['publishDate', 'expirationDate', 'lastModifiedAt'].includes(event.target.value)) {
      setSelectedOperator('equals');
    } else {
      setSelectedOperator('contains');
    }
    setFilterValue('');
    setSelectedDate(null);
  };

  const handleOperatorChange = (event: SelectChangeEvent<string>) => {
    setSelectedOperator(event.target.value as string);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const isColumnDateBased = ['publishDate', 'expirationDate', 'lastModifiedAt'].includes(
    selectedColumn
  );
  const isOperatorValid = FILTER_OPERATORS.find(
    (op) => op.id === selectedOperator && (isColumnDateBased ? op.dateBased : op.textBased)
  );

  const handleAddFilter = () => {
    // Add the current filter to pending filters only
    if (selectedColumn && isOperatorValid) {
      const value = isColumnDateBased ? selectedDate?.toISOString() : filterValue;
      if (value || ['empty', 'notEmpty'].includes(selectedOperator)) {
        const columnLabel = FILTER_COLUMNS.find((col) => col.id === selectedColumn)?.label;
        const operatorLabel = FILTER_OPERATORS.find((op) => op.id === selectedOperator)?.label;
        const valueLabel =
          isColumnDateBased && value ? new Date(value).toLocaleDateString() : value;
        const displayValue = `${columnLabel} ${operatorLabel} ${valueLabel || ''}`;

        const newFilter = {
          id: `${selectedColumn}-${Date.now()}`,
          column: selectedColumn,
          operator: selectedOperator,
          value,
          displayValue,
        };

        setPendingFilters((prev) => [...prev, newFilter]);

        setSelectedColumn('');
        setSelectedOperator('contains');
        setFilterValue('');
        setSelectedDate(null);
      }
    }
  };

  const handleApplyAllFilters = () => {
    const newAppliedFilters = [...appliedFilters];

    pendingFilters.forEach((pendingFilter) => {
      // Remove any existing filter for the same column
      const existingIndex = newAppliedFilters.findIndex((f) => f.column === pendingFilter.column);
      if (existingIndex !== -1) {
        newAppliedFilters.splice(existingIndex, 1);
      }
      // Add the new filter
      newAppliedFilters.push(pendingFilter);
    });

    // Update the applied filters state
    setAppliedFilters(newAppliedFilters);

    const newFilters: ICGUFilters = {
      title: '',
      version: '',
      authorName: '',
      publishDate: undefined,
      expirationDate: undefined,
      lastModifiedAt: undefined,
    };

    newAppliedFilters.forEach((filter) => {
      if (filter.column === 'title') {
        newFilters.title = filter.value;
      } else if (filter.column === 'version') {
        newFilters.version = filter.value;
      } else if (filter.column === 'authorName') {
        newFilters.authorName = filter.value;
      } else if (filter.column === 'publishDate') {
        newFilters.publishDate = filter.value;
      } else if (filter.column === 'expirationDate') {
        newFilters.expirationDate = filter.value;
      } else if (filter.column === 'lastModifiedAt') {
        newFilters.lastModifiedAt = filter.value;
      }
    });

    Object.keys(newFilters).forEach((key) => {
      const typedKey = key as keyof ICGUFilters;
      onFiltersChange(typedKey, newFilters[typedKey]);
    });

    setPendingFilters([]);
    onClose();
  };

  const handleRemovePendingFilter = (filterId: string) => {
    setPendingFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const handleRemoveAppliedFilter = (filterId: string) => {
    const filterToRemove = appliedFilters.find((f) => f.id === filterId);

    if (filterToRemove) {
      setAppliedFilters((prev) => prev.filter((f) => f.id !== filterId));

      // Check if it's a date field
      const isDateField = ['publishDate', 'expirationDate', 'lastModifiedAt'].includes(
        filterToRemove.column
      );

      // Use undefined for date fields, empty string for text fields
      const newValue = isDateField ? undefined : '';

      onFiltersChange(filterToRemove.column, newValue);
    }
  };

  const handleClearAllFilters = () => {
    setAppliedFilters([]);
    setPendingFilters([]);

    onFiltersChange('title', '');
    onFiltersChange('version', '');
    onFiltersChange('authorName', '');
    onFiltersChange('publishDate', undefined);
    onFiltersChange('expirationDate', undefined);
    onFiltersChange('lastModifiedAt', undefined);

    onResetFilters();
  };

  const hasActiveFilters = appliedFilters.length > 0;

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 600,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtres
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <FormControl sx={{ flex: 1 }} size="small">
              <InputLabel>Colonne</InputLabel>
              <Select value={selectedColumn} onChange={handleColumnChange} label="Colonne">
                {FILTER_COLUMNS.map((col) => (
                  <MenuItem key={col.id} value={col.id}>
                    {col.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Opérateur</InputLabel>
              <Select
                size="small"
                value={selectedOperator}
                onChange={handleOperatorChange}
                label="Opérateur"
              >
                {FILTER_OPERATORS.filter((op) =>
                  isColumnDateBased ? op.dateBased : op.textBased
                ).map((op) => (
                  <MenuItem key={op.id} value={op.id}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
              {isColumnDateBased ? (
                <LocalizationProvider>
                  <DatePicker
                    label="Valeur"
                    value={selectedDate}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        sx: { mt: 0 },
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <TextField
                  fullWidth
                  label="Valeur"
                  value={filterValue}
                  onChange={handleValueChange}
                  size="small"
                />
              )}
            </Box>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={handleAddFilter}
              disabled={
                !selectedColumn ||
                !isOperatorValid ||
                (!filterValue && !selectedDate && !['empty', 'notEmpty'].includes(selectedOperator))
              }
              sx={{
                minWidth: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                },
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </Box>

          {/* Display all pending filters inside the popover */}
          {pendingFilters.length > 0 ? (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Filtres à appliquer:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {pendingFilters.map((filter) => (
                  <Chip
                    key={filter.id}
                    label={filter.displayValue}
                    onDelete={() => handleRemovePendingFilter(filter.id)}
                    color="primary"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <></>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              Fermer
            </Button>
            <Button variant="contained" color="primary" onClick={handleApplyAllFilters}>
              Appliquer
            </Button>
          </Box>
        </Box>
      </Popover>

      {/* Display active filters outside the popover */}
      {hasActiveFilters ? (
        <Box
          sx={{
            mt: 2,
            mb: 2,
            p: 2,
            bgcolor: 'background.neutral',
            borderRadius: 1,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle2" sx={{ mr: 1, color: 'primary.main' }}>
            Filtres ({appliedFilters.length}):
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
            {appliedFilters.map((filter) => (
              <Chip
                key={filter.id}
                label={filter.displayValue}
                onDelete={() => handleRemoveAppliedFilter(filter.id)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleClearAllFilters}
            startIcon={<FontAwesomeIcon icon={faTimes} />}
          >
            Effacer
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
