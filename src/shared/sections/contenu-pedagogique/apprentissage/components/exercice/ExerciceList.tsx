'use client';

import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  faPlus,
  faTrash,
  faTimes,
  faFilter,
  faSearch,
  faSyncAlt,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Link,
  Table,
  alpha,
  Stack,
  Button,
  Select,
  Tooltip,
  useTheme,
  TableRow,
  Checkbox,
  MenuItem,
  TableBody,
  TextField,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  Breadcrumbs,
  FormControl,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { varFade, MotionContainer } from 'src/shared/components/animate';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { STATUT_OPTIONS } from '../../types';
import { ExerciceItem } from './ExerciceItem';
import { ColumnSelector } from '../filters/ColumnSelector';
import { FilterDropdown } from '../filters/FilterDropdown';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';
import { AdvancedExportDropdown } from '../export/AdvancedExportDropdown ';

import type { ColumnOption } from '../filters/ColumnSelector';
import type { Exercice, Pagination, FilterParams } from '../../types';
import type { ActiveFilter, FilterOption } from '../filters/FilterDropdown';

interface TableColumn {
  id: string;
  label: string;
  align: 'left' | 'center' | 'right';
  type?: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
  width?: number | string;
}

const TABLE_HEAD: TableColumn[] = [
  { id: 'titre', label: 'Titre', align: 'left', type: 'text' },
  { id: 'description', label: 'Description', align: 'left', type: 'text' },
  { id: 'statut', label: 'Statut', align: 'left', type: 'select', options: STATUT_OPTIONS },
  { id: 'ressources', label: 'Ressources', align: 'left', type: 'text' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

const COLUMN_OPTIONS: ColumnOption[] = [
  { id: 'titre', label: 'Titre', required: true },
  { id: 'description', label: 'Description' },
  { id: 'statut', label: 'Statut' },
  { id: 'ressources', label: 'Ressources' },
];

const DEFAULT_VISIBLE_COLUMNS = ['titre', 'description', 'statut', 'ressources'];

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'titre',
    label: 'Titre',
    type: 'text',
    operators: [
      { value: 'contains', label: 'Contient' },
      { value: 'equals', label: 'Est égal à' },
      { value: 'startsWith', label: 'Commence par' },
      { value: 'endsWith', label: 'Termine par' },
    ],
  },
  {
    id: 'description',
    label: 'Description',
    type: 'text',
    operators: [
      { value: 'contains', label: 'Contient' },
      { value: 'equals', label: 'Est égal à' },
    ],
  },
  {
    id: 'statut',
    label: 'Statut',
    type: 'select',
    operators: [{ value: 'equals', label: 'Est' }],
    selectOptions: STATUT_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  },
  {
    id: 'ressourceType',
    label: 'Type de ressource',
    type: 'select',
    operators: [
      { value: 'equals', label: 'Est' },
      { value: 'contains', label: 'Contient' },
    ],
    selectOptions: [
      { value: 'PDF', label: 'PDF' },
      { value: 'Audio', label: 'Audio' },
      { value: 'Vidéo', label: 'Vidéo' },
      { value: 'Interactive', label: 'Interactive' },
      { value: 'Image', label: 'Image' },
    ],
  },
  {
    id: 'isPublished',
    label: 'Publié',
    type: 'select',
    operators: [{ value: 'equals', label: 'Est' }],
    selectOptions: [
      { value: 'true', label: 'Oui' },
      { value: 'false', label: 'Non' },
    ],
  },
];

function applySingleFilter(exercice: Exercice, filter: ActiveFilter, filterOption: FilterOption) {
  const { field, operator, value } = filter;
  if (!value) return true;
  const fieldVal = (exercice as any)[field];
  if (!filterOption) return true;

  if (filterOption.type === 'text') {
    const fieldStr = fieldVal ? String(fieldVal).toLowerCase() : '';
    const valStr = String(value).toLowerCase();
    if (operator === 'contains') return fieldStr.includes(valStr);
    if (operator === 'equals') return fieldStr === valStr;
    if (operator === 'startsWith') return fieldStr.startsWith(valStr);
    if (operator === 'endsWith') return fieldStr.endsWith(valStr);
    return true;
  }
  if (filterOption.type === 'select') {
    return String(fieldVal) === String(value);
  }
  if (filterOption.type === 'date') {
    const cDate = fieldVal ? new Date(fieldVal) : null;
    const fDate = value ? new Date(value) : null;
    if (!cDate || !fDate || Number.isNaN(cDate.getTime()) || Number.isNaN(fDate.getTime()))
      return false;
    if (operator === 'equals') return cDate.toDateString() === fDate.toDateString();
    if (operator === 'before') return cDate.getTime() < fDate.getTime();
    if (operator === 'after') return cDate.getTime() > fDate.getTime();
    return true;
  }
  if (filterOption.type === 'number') {
    const cNum = Number(fieldVal);
    const fNum = Number(value);
    if (Number.isNaN(cNum) || Number.isNaN(fNum)) return false;
    if (operator === 'equals') return cNum === fNum;
    if (operator === 'greaterThan') return cNum > fNum;
    if (operator === 'lessThan') return cNum < fNum;
    return true;
  }
  return true;
}

interface ColumnFilterProps {
  columnId: string;
  columnType?: string;
  options?: any[];
  value: string;
  onChange: (columnId: string, value: string) => void;
  align?: 'left' | 'center' | 'right';
  dense?: boolean;
}

const ColumnFilter = ({
  columnId,
  columnType = 'text',
  options = [],
  value,
  onChange,
  align = 'left',
  dense = false,
}: ColumnFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(Boolean(value));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const selectRef = useRef<HTMLElement | null>(null);

  const handleSearchIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
    if (columnType === 'select' && selectRef.current) {
      setTimeout(() => {
        const selectElement = selectRef.current as HTMLElement;
        selectElement.click();
        const clickEvent = new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          view: window,
        });
        selectElement.dispatchEvent(clickEvent);
      }, 50);
    } else {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    }
  };

  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(columnId, '');
    if (columnType !== 'text' && columnType !== 'number') {
      setIsExpanded(false);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const inputStyles = {
    width: isExpanded ? 'auto' : '28px',
    minWidth: isExpanded ? 80 : 28,
    transition: 'all 0.2s ease-in-out',
    marginTop: dense ? '-3px' : '-6px',
    position: 'relative',
    '& .MuiOutlinedInput-root': {
      height: dense ? '24px' : '28px',
      background: 'transparent',
      '& fieldset': { border: 'none !important' },
      '&:hover fieldset': { border: 'none !important' },
      '&.Mui-focused fieldset': { border: 'none !important' },
    },
    '& .MuiInputBase-input': {
      padding: dense ? '0px 0px' : '2px 0px',
      fontSize: dense ? '0.7rem' : '0.75rem',
      textAlign: align,
      width: isExpanded ? 'auto' : '0px',
      opacity: isExpanded ? 1 : 0,
      transition: 'opacity 0.2s, width 0.2s',
    },
    '& .MuiSelect-select': {
      paddingRight: '24px !important',
      width: isExpanded ? 'auto' : '0px',
      opacity: isExpanded ? 1 : 0,
      transition: 'opacity 0.2s, width 0.2s',
    },
  };

  const iconStyles = {
    color: value ? 'primary.main' : 'text.disabled',
    fontSize: dense ? '0.8rem' : '1rem',
    cursor: 'pointer',
    opacity: value ? 1 : 0.6,
    '&:hover': { opacity: 1, transform: 'scale(1.1)' },
    transition: 'all 0.2s ease',
  };

  const renderEndAdornment = () =>
    value ? (
      <InputAdornment position="end">
        <IconButton
          size="small"
          onClick={handleClearClick}
          sx={{ padding: 0, '&:hover': { background: 'transparent' } }}
        >
          <FontAwesomeIcon icon={faTimes} style={{ fontSize: dense ? '0.8rem' : '1rem' }} />
        </IconButton>
      </InputAdornment>
    ) : null;

  const renderStartAdornment = () => (
    <InputAdornment position="start" sx={{ ml: 0 }}>
      <Box
        onClick={handleSearchIconClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          width: 24,
          height: 24,
          borderRadius: '50%',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
        }}
      >
        <FontAwesomeIcon icon={faSearch} style={iconStyles} />
      </Box>
    </InputAdornment>
  );

  if (columnType === 'select') {
    return (
      <FormControl size="small" sx={inputStyles}>
        <Select
          value={value}
          onChange={(e) => onChange(columnId, e.target.value)}
          displayEmpty
          variant="outlined"
          sx={{
            fontSize: dense ? '0.7rem' : '0.75rem',
            '& .MuiSelect-icon': {
              opacity: isExpanded ? 1 : 0,
              transition: 'opacity 0.2s',
              display: isExpanded ? 'block' : 'none',
            },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
            paddingRight: isExpanded ? '32px' : '0px',
          }}
          MenuProps={{
            anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
            transformOrigin: { vertical: 'top', horizontal: 'left' },
            PaperProps: {
              elevation: 3,
              sx: {
                maxHeight: 300,
                mt: 1,
                '& .MuiMenuItem-root': {
                  fontSize: dense ? '0.7rem' : '0.75rem',
                  py: dense ? 0.5 : 1,
                },
              },
            },
          }}
          startAdornment={renderStartAdornment()}
          endAdornment={renderEndAdornment()}
          ref={selectRef}
          onOpen={() => setIsExpanded(true)}
          onClose={() => !value && setIsExpanded(false)}
          inputProps={{ sx: { p: dense ? '3px' : '5px', paddingRight: 0 } }}
        >
          <MenuItem value="">
            <em>Tous</em>
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                fontSize: dense ? '0.7rem' : '0.75rem',
                minHeight: 'auto',
                py: dense ? 0.5 : 1,
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (columnType === 'date') {
    return (
      <TextField
        size="small"
        type="date"
        value={value}
        onChange={(e) => onChange(columnId, e.target.value)}
        inputRef={inputRef}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => !value && setIsExpanded(false)}
        onClick={() => setIsExpanded(true)}
        variant="outlined"
        InputProps={{
          startAdornment: renderStartAdornment(),
          endAdornment: renderEndAdornment(),
          sx: {
            pl: 0,
            '& input': {
              pl: isExpanded ? 1 : 0,
              width: isExpanded ? 'auto' : '0px',
              opacity: isExpanded ? 1 : 0,
            },
          },
        }}
        InputLabelProps={{ shrink: true }}
        sx={inputStyles}
      />
    );
  }

  if (columnType === 'number') {
    return (
      <TextField
        size="small"
        type="number"
        inputRef={inputRef}
        value={value}
        onChange={(e) => onChange(columnId, e.target.value)}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => !value && setIsExpanded(false)}
        onClick={() => setIsExpanded(true)}
        variant="outlined"
        InputProps={{
          startAdornment: renderStartAdornment(),
          endAdornment: renderEndAdornment(),
          sx: { pl: 0, '& input': { pl: isExpanded ? 1 : 0 } },
        }}
        sx={inputStyles}
      />
    );
  }

  return (
    <TextField
      size="small"
      inputRef={inputRef}
      value={value}
      onChange={(e) => onChange(columnId, e.target.value)}
      onFocus={() => setIsExpanded(true)}
      onBlur={() => !value && setIsExpanded(false)}
      onClick={() => setIsExpanded(true)}
      variant="outlined"
      InputProps={{
        startAdornment: renderStartAdornment(),
        endAdornment: renderEndAdornment(),
        sx: { pl: 0, '& input': { pl: isExpanded ? 1 : 0 } },
      }}
      sx={inputStyles}
    />
  );
};

interface BreadcrumbProps {
  currentNiveauId?: string | null;
  currentNiveauName?: string | null;
  currentMatiereId?: string | null;
  currentMatiereName?: string | null;
  currentChapitreId?: string | null;
  currentChapitreName?: string | null;
  navigateToNiveaux: () => void;
  navigateToMatieres: (niveau: any) => void;
  navigateToChapitres: (matiere: any) => void;
}

interface ExerciceListProps {
  exercices: Exercice[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onFilterChange?: (filters: ActiveFilter[]) => void;
  onColumnChange?: (columns: string[]) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
  onEditClick: (exercice: Exercice) => void;
  onDeleteClick: (exercice: Exercice) => void;
  onViewClick: (exercice: Exercice) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onAddClick?: () => void;
  onToggleActive?: (exercice: Exercice, active: boolean) => void;
  breadcrumbs?: BreadcrumbProps;
}

export const ExerciceList: React.FC<ExerciceListProps> = ({
  exercices,
  loading,
  pagination,
  filters,
  onPageChange,
  onLimitChange,
  onFilterChange,
  onColumnChange,
  onColumnFilterChange,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onDeleteRows,
  onAddClick,
  onToggleActive,
  breadcrumbs,
}) => {
  const confirm = useBoolean();
  const theme = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    titre: '',
    description: '',
    statut: '',
    ressources: '',
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);

  const filteredExercices = useMemo(() => {
    let data = exercices;
    activeFilters.forEach((filter) => {
      const filterOption = FILTER_OPTIONS.find((fo) => fo.id === filter.field);
      if (filterOption) {
        data = data.filter((ex) => applySingleFilter(ex, filter, filterOption));
      }
    });
    Object.entries(columnFilters).forEach(([colId, val]) => {
      if (val) {
        data = data.filter((exercice) => {
          const fieldVal = (exercice as any)[colId];
          if (fieldVal === undefined || fieldVal === null) return false;
          return String(fieldVal).toLowerCase().includes(String(val).toLowerCase());
        });
      }
    });
    return data;
  }, [exercices, activeFilters, columnFilters]);

  const visibleTableHead = useMemo(
    () => TABLE_HEAD.filter((col) => col.id === 'actions' || visibleColumns.includes(col.id)),
    [visibleColumns]
  );

  useEffect(() => {
    onFilterChange?.(activeFilters);
  }, [activeFilters, onFilterChange]);

  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1,
    defaultOrderBy: 'titre',
  });

  const handleOpenConfirm = () => {
    confirm.onTrue();
  };

  const handleDeleteRows = () => {
    if (onDeleteRows) {
      onDeleteRows(table.selected);
      table.onSelectAllRows(false, []);
    }
    confirm.onFalse();
  };

  const handleColumnFilterChangeLocal = (columnId: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [columnId]: value }));
    onColumnFilterChange?.(columnId, value);
  };

  const handleFilterDropdownChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleColumnSelectorChange = (columns: string[]) => {
    setVisibleColumns(columns);
    onColumnChange?.(columns);
  };

  const handleExport = (format: string, options?: any) => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prevProgress) => {
        const newProg = prevProgress + Math.random() * 15;
        if (newProg >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
          }, 500);
          return 100;
        }
        return newProg;
      });
    }, 300);
  };

  const handleReset = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS);
    onColumnChange?.(DEFAULT_VISIBLE_COLUMNS);
    setActiveFilters([]);
    onFilterChange?.([]);
    setColumnFilters({
      titre: '',
      description: '',
      statut: '',
      ressources: '',
    });
    Object.keys(columnFilters).forEach((colId) => onColumnFilterChange?.(colId, ''));
    onPageChange(1);
    onLimitChange(10);
  };

  const notFound = !filteredExercices.length && !loading;

  const renderTableHeader = () => (
    <TableHead
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        '& .MuiTableCell-head': {
          bgcolor: alpha(theme.palette.primary.lighter, 0.2),
          fontWeight: 'fontWeightBold',
          padding: table.dense ? '2px 6px' : '8px 8px',
        },
      }}
    >
      <TableRow>
        <TableCell
          padding="checkbox"
          sx={{
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            position: 'sticky',
            top: 0,
            zIndex: 12,
            width: table.dense ? 60 : 50,
            minWidth: table.dense ? 60 : 50,
            maxWidth: table.dense ? 60 : 50,
          }}
        >
          <Checkbox
            indeterminate={
              table.selected.length > 0 && table.selected.length < filteredExercices.length
            }
            checked={
              filteredExercices.length > 0 && table.selected.length === filteredExercices.length
            }
            onChange={(e) =>
              table.onSelectAllRows(
                e.target.checked,
                filteredExercices.map((row) => row.id)
              )
            }
            size={table.dense ? 'small' : 'medium'}
          />
        </TableCell>
        {visibleTableHead.map((column) => (
          <TableCell
            key={column.id}
            align={column.align}
            sx={{
              bgcolor: alpha(theme.palette.primary.lighter, 0.2),
              position: 'sticky',
              top: 0,
              zIndex: 11,
              whiteSpace: 'nowrap',
              borderBottom: 'none',
              fontSize: table.dense ? '0.8125rem' : '0.875rem',
              width: column.width,
            }}
          >
            {column.label}
          </TableCell>
        ))}
      </TableRow>
      <TableRow
        sx={{
          bgcolor: alpha(theme.palette.primary.lighter, 0.2),
          '& .MuiTableCell-root': {
            padding: table.dense ? '0px 6px 2px' : '0px 8px 4px',
            borderTop: 'none',
          },
        }}
      >
        <TableCell
          padding="checkbox"
          sx={{
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            position: 'sticky',
            top: table.dense ? '28px' : '23px',
            zIndex: 11,
            width: table.dense ? 60 : 50,
            minWidth: table.dense ? 60 : 50,
            maxWidth: table.dense ? 60 : 50,
          }}
        />
        {visibleTableHead.map((column) => {
          if (column.id === 'actions') {
            return (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{
                  bgcolor: alpha(theme.palette.primary.lighter, 0.2),
                  position: 'sticky',
                  top: table.dense ? '28px' : '23px',
                  zIndex: 11,
                }}
              />
            );
          }
          return (
            <TableCell
              key={column.id}
              align={column.align}
              sx={{
                bgcolor: alpha(theme.palette.primary.lighter, 0.2),
                position: 'sticky',
                top: table.dense ? '28px' : '23px',
                zIndex: 11,
              }}
            >
              <ColumnFilter
                columnId={column.id}
                columnType={column.type}
                options={column.options}
                value={columnFilters[column.id] || ''}
                onChange={handleColumnFilterChangeLocal}
                align={column.align}
                dense={table.dense}
              />
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );

  const renderBreadcrumbs = () => {
    if (!breadcrumbs) return null;
    return (
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
        <Link
          component="button"
          color="inherit"
          onClick={breadcrumbs.navigateToNiveaux}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '4px' }} />
          Niveaux
        </Link>
        <Link
          component="button"
          color="inherit"
          onClick={() =>
            breadcrumbs.currentNiveauId &&
            breadcrumbs.navigateToMatieres({
              id: breadcrumbs.currentNiveauId,
              nom: breadcrumbs.currentNiveauName,
            })
          }
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {breadcrumbs.currentNiveauName}
        </Link>
        <Link
          component="button"
          color="inherit"
          onClick={() =>
            breadcrumbs.currentMatiereId &&
            breadcrumbs.navigateToChapitres({
              id: breadcrumbs.currentMatiereId,
              nom: breadcrumbs.currentMatiereName,
            })
          }
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {breadcrumbs.currentMatiereName}
        </Link>
        <Typography color="text.primary">{breadcrumbs.currentChapitreName}</Typography>
      </Breadcrumbs>
    );
  };

  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Exercices
          </Typography>
          <Stack direction="row" spacing={2}>
            {onAddClick ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={onAddClick}
                sx={{
                  px: 2.5,
                  py: 1,
                  boxShadow: theme.customShadows?.z8,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.customShadows?.z16,
                  },
                }}
              >
                Ajouter un exercice
              </Button>
            ) : (
              <></>
            )}
          </Stack>
        </Stack>
        {renderBreadcrumbs()}
      </m.div>

      <m.div variants={varFade().inUp}>
        <Card
          sx={{
            boxShadow: theme.customShadows?.z8,
            transition: theme.transitions.create(['box-shadow']),
            '&:hover': { boxShadow: theme.customShadows?.z16 },
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'end', flexWrap: 'wrap', gap: 4 }}>
            <Stack direction="row" alignContent="end" spacing={2}>
              <ColumnSelector
                columns={COLUMN_OPTIONS}
                visibleColumns={visibleColumns}
                onColumnChange={handleColumnSelectorChange}
                buttonText="Colonnes"
              />
              <FilterDropdown
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterDropdownChange}
                buttonText="Filtres"
                icon={<FontAwesomeIcon icon={faFilter} size='sm'/>}
              />

              <Tooltip title="Réinitialiser" arrow>
                <IconButton
                  color="primary"
                  onClick={handleReset}
                  sx={{
                    p: 1,
                    transition: theme.transitions.create(['transform', 'box-shadow']),
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <FontAwesomeIcon icon={faSyncAlt} size='sm'/>
                </IconButton>
              </Tooltip>
              <AdvancedExportDropdown
                onExport={handleExport}
                isExporting={isExporting}
                exportProgress={exportProgress}
                withExportOptions
                title="Exporter les données"
              />
            </Stack>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={filteredExercices.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  filteredExercices.map((row) => row.id)
                )
              }
              action={
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'fontWeightBold' }}>
                    {table.selected.length} sélectionné
                    {table.selected.length > 1 ? 's' : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {onDeleteRows ? (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={handleOpenConfirm}
                        sx={{
                          px: 2,
                          py: 1,
                          fontWeight: 'fontWeightBold',
                          transition: theme.transitions.create(['background-color']),
                        }}
                      >
                        Supprimer
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              }
            />

            <Scrollbar sx={{ maxHeight: 550 }}>
              <TableContainer sx={{ position: 'relative', minHeight: 240 }}>
                <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
                  {renderTableHeader()}
                  <TableBody>
                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={visibleTableHead.length + 1} />
                    ) : (
                      filteredExercices.map((exercice) => (
                        <ExerciceItem
                          key={exercice.id}
                          exercice={exercice}
                          selected={table.selected.includes(exercice.id)}
                          onEditClick={() => onEditClick(exercice)}
                          onDeleteClick={() => onDeleteClick(exercice)}
                          onViewClick={() => onViewClick(exercice)}
                          onSelectRow={() => table.onSelectRow(exercice.id)}
                          onToggleActive={onToggleActive}
                          visibleColumns={visibleColumns}
                        />
                      ))
                    )}

                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, filteredExercices.length)}
                    />

                    {notFound && <TableNoData notFound sx={{ py: 10 }} />}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            count={pagination.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={(e, newPage) => {
              table.onChangePage(e, newPage);
              onPageChange(newPage + 1);
            }}
            onRowsPerPageChange={(e) => onLimitChange(parseInt(e.target.value, 10))}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      </m.div>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer les exercices"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> exercice
              {table.selected.length > 1 ? 's' : ''} ?
            </Typography>
            <Typography variant="caption" color="error.main">
              Cette action est irréversible.
            </Typography>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrash} />}
            onClick={handleDeleteRows}
            sx={{ px: 2, py: 1, fontWeight: 'fontWeightBold', boxShadow: theme.customShadows?.z8 }}
          >
            Supprimer
          </Button>
        }
      />
    </MotionContainer>
  );
};

export default ExerciceList;
