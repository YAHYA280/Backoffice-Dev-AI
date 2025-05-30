'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type {
  IAIAssistantItem,
  IAIAssistantTableFilters,
  IAIAssistantTableColumns,
} from 'src/types/ai-assistant';

import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faColumns,
  faSyncAlt,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

import { usePopover } from 'src/shared/components/custom-popover';

import MetricsCardContent from './MetricsCardContent';

interface IAdvancedFilter {
  column: string;
  operator?: string;
  value?: string;
  startDate?: string;
  endDate?: string;
}

export type AIAssistantTableHeadProps = {
  TABLE_HEAD: {
    id: string;
    label: string;
    align?: 'left' | 'center' | 'right';
    width?: string;
    flexGrow?: number;
  }[];
  selectedRows: string[];
  assistants: IAIAssistantItem[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  sx?: any;
  cellStyle?: any;
};

export function AIAssistantTableHead({
  TABLE_HEAD,
  selectedRows,
  assistants,
  setSelectedRows,
  sx,
  cellStyle,
}: AIAssistantTableHeadProps) {
  return (
    <TableHead sx={sx}>
      <TableRow>
        <TableCell padding="checkbox" sx={cellStyle}>
          <Checkbox
            indeterminate={selectedRows.length > 0 && selectedRows.length < assistants.length}
            checked={assistants.length > 0 && selectedRows.length === assistants.length}
            onChange={() => {
              if (selectedRows.length === assistants.length) {
                setSelectedRows([]);
              } else {
                setSelectedRows(assistants.map((row) => row.id));
              }
            }}
          />
        </TableCell>
        {TABLE_HEAD.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.align || 'left'} sx={cellStyle}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

type ToolbarProps = {
  onResetPage: () => void;
  clearAllColumnFilters: () => void;
  filters: UseSetStateReturn<IAIAssistantTableFilters>;
  options: {
    types: {
      value: string;
      label: string;
    }[];
    educationLevels: {
      value: string;
      label: string;
    }[];
    subjects: {
      value: string;
      label: string;
    }[];
    statuses: {
      value: string;
      label: string;
    }[];
  };
  onFilterChange: (filterName: string, value: string | string[] | IAdvancedFilter | null) => void;
  onClearFilters: () => void;
  visibleColumns: IAIAssistantTableColumns;
  onColumnVisibilityChange: (column: keyof IAIAssistantTableColumns, visible: boolean) => void;
  onUpdateAllColumns?: (newColumns: IAIAssistantTableColumns) => void;
  onResetColumns?: () => void;
  columnsPopoverState: {
    open: boolean;
    anchorEl: HTMLElement | null;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
  };
  filterPopoverState: {
    open: boolean;
    anchorEl: HTMLElement | null;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
  };
  onAddAssistant: () => void;
  onExportData: () => void;
  hasActiveFilters: boolean;
};

const initialTableColumns = {
  name: true,
  type: true,
  dateAjoute: true,
  educationLevel: true,
  subject: true,
  chapter: true,
  exercise: true,
  status: true,
};

const initialCheckedColumns = {
  name: false,
  type: false,
  dateAjoute: false,
  educationLevel: false,
  subject: false,
  chapter: false,
  exercise: false,
  status: false,
};

const COLUMN_LABELS: Record<keyof IAIAssistantTableColumns, string> = {
  name: 'Nom',
  type: 'Type',
  dateAjoute: 'Date Ajoutée',
  educationLevel: "Niveau d'Éducation",
  subject: 'Matière',
  chapter: 'Chapitre',
  exercise: 'Exercice',
  status: 'Statut',
};

export function AIAssistantTableToolbar({
  filters,
  options,
  onResetPage,
  onFilterChange,
  onClearFilters,
  visibleColumns,
  onColumnVisibilityChange,
  onUpdateAllColumns,
  onResetColumns,
  columnsPopoverState,
  filterPopoverState,
  onAddAssistant,
  onExportData,
  clearAllColumnFilters,
  hasActiveFilters,
}: ToolbarProps) {
  const popover = usePopover();
  const theme = useTheme();

  const [filterColumn, setFilterColumn] = useState('');
  const [filterOperator, setFilterOperator] = useState('equals');
  const [filterValue, setFilterValue] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [, setIsAdvancedFilterActive] = useState(false);
  const [popoverPreviouslyOpened, setPopoverPreviouslyOpened] = useState(false);

  const [tempColumnState, setTempColumnState] = useState<IAIAssistantTableColumns>({
    ...initialCheckedColumns,
  });

  useEffect(() => {
    if (columnsPopoverState.open) {
      if (!popoverPreviouslyOpened) {
        // Première ouverture - toutes les colonnes sont décochées
        setTempColumnState({ ...initialCheckedColumns }); // Tout est décoché
        setPopoverPreviouslyOpened(true);
      } else {
        // Ouvertures suivantes - on conserve l'état précédent du popover
        // Ne rien faire ici, car tempColumnState garde déjà l'état
      }
    }
  }, [columnsPopoverState.open, popoverPreviouslyOpened]);

  const handleToggleColumn = (column: keyof IAIAssistantTableColumns, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setTempColumnState((prevState) => ({
      ...prevState,
      [column]: !prevState[column],
    }));
  };

  const saveColumnChanges = () => {
    // Créer un nouvel objet avec toutes les colonnes invisibles par défaut
    const newVisibleColumns = Object.keys(initialTableColumns).reduce((acc, key) => {
      acc[key as keyof IAIAssistantTableColumns] = false;
      return acc;
    }, {} as IAIAssistantTableColumns);

    // Rendre visible seulement les colonnes cochées
    Object.keys(tempColumnState).forEach((key) => {
      const column = key as keyof IAIAssistantTableColumns;
      if (tempColumnState[column]) {
        newVisibleColumns[column] = true;
      }
    });

    // Appliquer les changements
    if (onUpdateAllColumns) {
      onUpdateAllColumns(newVisibleColumns);
    } else {
      Object.keys(newVisibleColumns).forEach((key) => {
        const column = key as keyof IAIAssistantTableColumns;
        onColumnVisibilityChange(column, newVisibleColumns[column]);
      });
    }

    columnsPopoverState.onClose();
  };

  const cancelColumnChanges = () => {
    columnsPopoverState.onClose();
  };

  const applyCustomFilter = () => {
    if (filterColumn) {
      const advancedFilter: IAdvancedFilter = {
        column: filterColumn,
        ...(filterColumn === 'dateAjoute'
          ? { startDate, endDate }
          : { operator: filterOperator, value: filterValue }),
      };
      onFilterChange('advancedFilter', advancedFilter);
      setIsAdvancedFilterActive(true);
      filterPopoverState.onClose();
    }
  };

  // Define clearAdvancedFilter with proper dependencies
  const clearAdvancedFilter = useCallback(() => {
    setFilterColumn('');
    setFilterOperator('equals');
    setFilterValue('');
    setStartDate('');
    setEndDate('');
    setIsAdvancedFilterActive(false);
    onFilterChange('advancedFilter', null);
  }, [onFilterChange]);

  // Run this effect only ONCE when the component mounts
  useEffect(() => {
    // Initialize filters without calling clearAdvancedFilter
    setFilterColumn('');
    setFilterOperator('equals');
    setFilterValue('');
    setStartDate('');
    setEndDate('');
    setIsAdvancedFilterActive(false);
    // Do NOT call onFilterChange here - that's what's causing the problem
  }, []); // Empty dependency array means this runs only once

  const resetColumns = () => {
    // Décocher toutes les colonnes dans le popover
    setTempColumnState({ ...initialCheckedColumns });

    // Mais rendre toutes les colonnes visibles dans le tableau
    const resetState = { ...initialTableColumns };

    if (onUpdateAllColumns) {
      onUpdateAllColumns(resetState);
      columnsPopoverState.onClose();
      return;
    }

    if (onResetColumns) {
      onResetColumns();
      columnsPopoverState.onClose();
      return;
    }

    Object.keys(resetState).forEach((column) => {
      const key = column as keyof IAIAssistantTableColumns;
      onColumnVisibilityChange(key, true);
    });

    columnsPopoverState.onClose();
  };

  return (
    <Box maxWidth="xl">
      <Card sx={{ mb: { xs: 3, md: 5 } }}>
        {/* Métriques en haut de la page */}
        <MetricsCardContent />
      </Card>
      <Card>
        {/* Columns selection row below */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mb: 1 }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={columnsPopoverState.onOpen}
              startIcon={<FontAwesomeIcon icon={faColumns} />}
              sx={{
                minWidth: 100,
                borderRadius: 1,
                transition: theme.transitions.create(['background-color']),
                ...(columnsPopoverState.open && {
                  bgcolor: 'primary.lighter',
                }),
              }}
            >
              colonnes
            </Button>
            <Tooltip title="Filtres avancés">
              <IconButton
                color="primary"
                aria-label="filtre"
                onClick={filterPopoverState.onOpen}
                sx={{
                  p: 1,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                size="small"
              >
                <FontAwesomeIcon icon={faFilter} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Réinitialiser les filtres et colonnes">
              <IconButton
                color="primary"
                aria-label="effacer les filtres"
                onClick={() => {
                  onClearFilters();
                  clearAdvancedFilter();
                  resetColumns();
                  clearAllColumnFilters();
                }}
                sx={{
                  p: 1,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                size="small"
              >
                <FontAwesomeIcon icon={faSyncAlt} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exporter les données">
              <IconButton
                color="primary"
                aria-label="exporter"
                onClick={onExportData}
                sx={{
                  p: 1,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                size="small"
              >
                <FontAwesomeIcon icon={faFileExport} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <Popover
          anchorEl={columnsPopoverState.anchorEl}
          open={columnsPopoverState.open}
          onClose={cancelColumnChanges}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { p: 1, width: '250px' },
          }}
        >
          <Typography variant="subtitle1" sx={{ p: 1 }}>
            Sélectionner les colonnes
          </Typography>
          <MenuList>
            {Object.keys(visibleColumns).map((column) => {
              const columnKey = column as keyof IAIAssistantTableColumns;
              return (
                <MenuItem
                  key={column}
                  dense
                  disableRipple
                  disableTouchRipple
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    height: '40px',
                  }}
                >
                  <Box
                    onClick={() => handleToggleColumn(columnKey)}
                    sx={{
                      display: 'flex',
                      flexGrow: 1,
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Typography variant="body2">{COLUMN_LABELS[columnKey] || column}</Typography>
                  </Box>
                  <Checkbox
                    checked={tempColumnState[columnKey]}
                    size="small"
                    sx={{ p: 0 }}
                    onChange={() => handleToggleColumn(columnKey)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </MenuItem>
              );
            })}
          </MenuList>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, gap: 1 }}>
            <Button variant="outlined" size="small" onClick={cancelColumnChanges}>
              Annuler
            </Button>
            <Button variant="contained" size="small" onClick={saveColumnChanges}>
              Enregistrer
            </Button>
          </Box>
        </Popover>

        <Popover
          anchorEl={filterPopoverState.anchorEl}
          open={filterPopoverState.open}
          onClose={filterPopoverState.onClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { p: 2, width: '700px', maxWidth: '95vw' },
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Filtrage avancé
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <FormControl size="small" sx={{ minWidth: '30%' }}>
                <InputLabel>Colonne</InputLabel>
                <Select
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                  input={<OutlinedInput label="Colonne" />}
                >
                  {Object.keys(COLUMN_LABELS).map((column) => (
                    <MenuItem key={column} value={column}>
                      {COLUMN_LABELS[column as keyof IAIAssistantTableColumns]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {filterColumn === 'dateAjoute' ? (
                <>
                  <TextField
                    size="small"
                    label="Date début"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ minWidth: '30%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    size="small"
                    label="Date fin"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ minWidth: '30%' }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </>
              ) : (
                <>
                  <FormControl size="small" sx={{ minWidth: '30%' }}>
                    <InputLabel>Opérateur</InputLabel>
                    <Select
                      value={filterOperator}
                      onChange={(e) => setFilterOperator(e.target.value)}
                      input={<OutlinedInput label="Opérateur" />}
                    >
                      <MenuItem value="equals">égal à</MenuItem>
                      <MenuItem value="notequals">différent de</MenuItem>
                      <MenuItem value="contains">contient</MenuItem>
                      <MenuItem value="startswith">commence par</MenuItem>
                      <MenuItem value="endswith">termine par</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    label="Valeur"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    sx={{ minWidth: '30%' }}
                  />
                </>
              )}
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" size="small" onClick={filterPopoverState.onClose}>
                Annuler
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={applyCustomFilter}
                disabled={!filterColumn || (!startDate && !filterValue)}
              >
                Appliquer
              </Button>
            </Stack>
          </Box>
        </Popover>
      </Card>
    </Box>
  );
}
