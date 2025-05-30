import type { ColumnOption } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/ColumnSelector';
import type {
  ActiveFilter,
  FilterOption,
} from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/FilterDropdown';

import { m } from 'framer-motion';
import React, { useRef, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faTimes,
  faFilter,
  faSearch,
  faSyncAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
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
  FormControl,
  TableContainer,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { varFade, MotionContainer } from 'src/shared/components/animate';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { ColumnSelector } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/ColumnSelector';
import { FilterDropdown } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/FilterDropdown';
import { TableSkeletonLoader } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/common/TableSkeletonLoader';
import { AdvancedExportDropdown } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/export/AdvancedExportDropdown ';

import { ChallengeItem } from './ChallengeItem';
import { STATUT_OPTIONS, DIFFICULTE_OPTIONS } from '../constants';

import type { Challenge, Pagination, FilterParams } from '../types';

interface TableColumn {
  id: string;
  label: string;
  align: 'left' | 'center' | 'right';
  width?: number | string;
  type?: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
}

const TABLE_HEAD: TableColumn[] = [
  { id: 'select', label: '', align: 'center' },
  { id: 'nom', label: 'Nom', align: 'left', type: 'text' },
  { id: 'description', label: 'Description', align: 'left', type: 'text' },
  {
    id: 'statut',
    label: 'Statut',
    align: 'left',
    type: 'select',
    options: STATUT_OPTIONS,
  },
  { id: 'datePublication', label: 'Date publication', align: 'center', type: 'date' },
  { id: 'dateMiseAJour', label: 'Dernière modification', align: 'center', type: 'date' },
  {
    id: 'difficulte',
    label: 'Difficulté',
    align: 'center',
    type: 'select',
    options: DIFFICULTE_OPTIONS,
  },
  { id: 'nbTentatives', label: 'Tentatives', align: 'center', type: 'number' },
  { id: 'participantsCount', label: 'Participants', align: 'center', type: 'number' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

const COLUMN_OPTIONS: ColumnOption[] = [
  { id: 'nom', label: 'Nom', required: true },
  { id: 'description', label: 'Description' },
  { id: 'statut', label: 'Statut' },
  { id: 'datePublication', label: 'Date publication' },
  { id: 'dateMiseAJour', label: 'Dernière modification' },
  { id: 'difficulte', label: 'Difficulté' },
  { id: 'nbTentatives', label: 'Tentatives' },
  { id: 'participantsCount', label: 'Participants' },
];

const DEFAULT_VISIBLE_COLUMNS = [
  'nom',
  'description',
  'statut',
  'datePublication',
  'dateMiseAJour',
  'difficulte',
  'nbTentatives',
  'participantsCount',
];

const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'nom',
    label: 'Nom',
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
    selectOptions: STATUT_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  },
  {
    id: 'dateCreation',
    label: 'Date création',
    type: 'date',
    operators: [
      { value: 'equals', label: 'Est égal à' },
      { value: 'before', label: 'Avant le' },
      { value: 'after', label: 'Après le' },
    ],
  },
  {
    id: 'datePublication',
    label: 'Date publication',
    type: 'date',
    operators: [
      { value: 'equals', label: 'Est égal à' },
      { value: 'before', label: 'Avant le' },
      { value: 'after', label: 'Après le' },
    ],
  },
  {
    id: 'difficulte',
    label: 'Difficulté',
    type: 'select',
    operators: [{ value: 'equals', label: 'Est' }],
    selectOptions: DIFFICULTE_OPTIONS.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
  },
  {
    id: 'isActive',
    label: 'Actif/inactif',
    type: 'select',
    operators: [{ value: 'equals', label: 'Est' }],
    selectOptions: [
      { value: 'true', label: 'Actif' },
      { value: 'false', label: 'Inactif' },
    ],
  },
];

function applySingleFilter(challenge: Challenge, filter: ActiveFilter, filterOption: FilterOption) {
  const { field, operator, value } = filter;
  if (!value) return true;
  const fieldVal = (challenge as any)[field];
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
    maxWidth: isExpanded ? '100%' : 28,
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
    '&:hover': {
      opacity: 1,
      transform: 'scale(1.1)',
    },
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

interface ChallengeListProps {
  challenges: Challenge[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
  onFilterChange?: (filters: ActiveFilter[]) => void;
  onColumnChange?: (columns: string[]) => void;
  onEditClick: (challenge: Challenge) => void;
  onDeleteClick: (challenge: Challenge) => void;
  onViewClick: (challenge: Challenge) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onAddClick?: () => void;
  onToggleActive?: (challenge: Challenge, active: boolean) => void;
}

export const ChallengeList = ({
  challenges,
  loading,
  pagination,
  filters,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onColumnFilterChange,
  onFilterChange,
  onColumnChange,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onDeleteRows,
  onAddClick,
  onToggleActive,
}: ChallengeListProps) => {
  const confirm = useBoolean();
  const theme = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    nom: '',
    description: '',
    statut: '',
    datePublication: '',
    dateMiseAJour: '',
    difficulte: '',
    participantsCount: '',
    nbTentatives: '',
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1,
    defaultOrderBy: 'nom',
  });

  const filteredChallenges = useMemo(() => {
    let data = challenges.filter((ch) => ch.statut !== 'Supprimé');
    activeFilters.forEach((filter) => {
      const filterOption = FILTER_OPTIONS.find((fo) => fo.id === filter.field);
      if (filterOption) {
        data = data.filter((challenge) => applySingleFilter(challenge, filter, filterOption));
      }
    });
    return data;
  }, [challenges, activeFilters]);

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

  const handleFilterChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleColumnChange = (columns: string[]) => {
    setVisibleColumns(columns);
    onColumnChange?.(columns);
  };

  const handleExport = (format: string, options?: any) => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExporting(false), 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleReset = () => {
    setVisibleColumns(DEFAULT_VISIBLE_COLUMNS);
    onColumnChange?.(DEFAULT_VISIBLE_COLUMNS);
    setActiveFilters([]);
    onFilterChange?.([]);
    setColumnFilters({
      nom: '',
      description: '',
      statut: '',
      datePublication: '',
      dateMiseAJour: '',
      difficulte: '',
      nbTentatives: '',
      participantsCount: '',
    });
    Object.keys(columnFilters).forEach((colId) => onColumnFilterChange?.(colId, ''));
    onPageChange(1);
    onLimitChange(10);
  };

  const handleTrophyConfigClick = (challenge: Challenge) => {
    setSelectedChallengeId((prev) => (prev === challenge.id ? null : challenge.id));
  };

  const visibleTableHead = useMemo(
    () =>
      TABLE_HEAD.filter(
        (col) => col.id === 'select' || col.id === 'actions' || visibleColumns.includes(col.id)
      ),
    [visibleColumns]
  );

  const notFound = !filteredChallenges.length && !loading;

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
            padding: table.dense ? '2px 12px 2px 6px' : '4px 8px',
          }}
        >
          <Checkbox
            indeterminate={
              table.selected.length > 0 && table.selected.length < filteredChallenges.length
            }
            checked={
              filteredChallenges.length > 0 && table.selected.length === filteredChallenges.length
            }
            onChange={(event) =>
              table.onSelectAllRows(
                event.target.checked,
                filteredChallenges.map((row) => row.id)
              )
            }
            size={table.dense ? 'small' : 'medium'}
          />
        </TableCell>
        {visibleTableHead
          .filter((col) => col.id !== 'select')
          .map((column) => (
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
                padding: table.dense ? '2px 6px' : '8px 8px',
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
        {visibleTableHead
          .filter((col) => col.id !== 'select')
          .map((column) => {
            if (column.id === 'actions') {
              return (
                <TableCell
                  key={`${column.id}-filter`}
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
                key={`${column.id}-filter`}
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
                  value={columnFilters[column.id as keyof typeof columnFilters] || ''}
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

  const renderBreadcrumbs = () => (
      <CustomBreadcrumbs
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Contenu pédagogique', href: paths.dashboard.contenu_pedagogique.challenges },
          { name: "Gestion des challenges" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }} />
    );

  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Challenges
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
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: theme.customShadows?.z16 },
                }}
              >
                Ajouter un challenge
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
                onColumnChange={handleColumnChange}
                buttonText="Colonnes"
              />
              <FilterDropdown
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
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
              rowCount={filteredChallenges.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  filteredChallenges.map((row) => row.id)
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
                        size="medium"
                        onClick={handleOpenConfirm}
                        sx={{
                          minWidth: 'auto',
                          px: 1,
                          py: 1,
                          m: 0.5,
                          fontWeight: 'fontWeightBold',
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              }
            />

            <Scrollbar sx={{ maxHeight: 550 }}>
              <TableContainer
                sx={{
                  position: 'relative',
                  minHeight: 240,
                  maxHeight: 500,
                }}
              >
                <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
                  {renderTableHeader()}
                  <TableBody>
                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={visibleTableHead.length} />
                    ) : (
                      filteredChallenges.map((challenge) => (
                        <ChallengeItem
                          key={challenge.id}
                          challenge={challenge}
                          selected={table.selected.includes(challenge.id)}
                          onEditClick={() => onEditClick(challenge)}
                          onDeleteClick={() => onDeleteClick(challenge)}
                          onViewClick={() => onViewClick(challenge)}
                          onSelectRow={() => table.onSelectRow(challenge.id)}
                          onToggleActive={onToggleActive}
                          visibleColumns={visibleColumns}
                          onTrophyConfigClick={handleTrophyConfigClick}
                        />
                      ))
                    )}
                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(
                        table.page,
                        table.rowsPerPage,
                        filteredChallenges.length
                      )}
                    />
                    {notFound ? <TableNoData notFound sx={{ py: 10 }} /> : null}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            count={pagination.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={(e, page) => {
              table.onChangePage(e, page);
              onPageChange(page + 1);
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
        title="Supprimer les challenges"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> challenge
              {table.selected.length > 1 ? 's' : ''} ?
            </Typography>
            <Typography variant="caption" color="error.main">
              Cette action est irréversible. Les données de participation des élèves seront
              également supprimées.
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

export default ChallengeList;
