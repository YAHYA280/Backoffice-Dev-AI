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

import { NiveauItem } from './NiveauItem';
import { FilterDropdown } from '../filters/FilterDropdown';
import { ColumnSelector } from '../filters/ColumnSelector';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';
import { AdvancedExportDropdown } from '../export/AdvancedExportDropdown ';

import type { ColumnOption } from '../filters/ColumnSelector';
import type { Niveau, Pagination, FilterParams } from '../../types';
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
  { id: 'nom', label: 'Nom', align: 'left', type: 'text' },
  { id: 'description', label: 'Description', align: 'left', type: 'text' },
  { id: 'code', label: 'Code', align: 'left', type: 'text' },
  { id: 'dateCreated', label: 'Date de création', align: 'left', type: 'date' },
  { id: 'actions', label: 'Actions', align: 'center' },
];

interface ColumnFilterProps {
  columnId: string;
  value: string;
  options?: any[];
  onChange: (columnId: string, value: string) => void;
  align?: 'left' | 'center' | 'right';
  dense?: boolean;
  columnType?: string;
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
        sx: {
          pl: 0,
          '& input': {
            pl: isExpanded ? 1 : 0,
          },
        },
      }}
      sx={inputStyles}
    />
  );
};

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
    id: 'code',
    label: 'Code',
    type: 'text',
    operators: [
      { value: 'equals', label: 'Est égal à' },
      { value: 'contains', label: 'Contient' },
    ],
  },
  {
    id: 'dateCreated',
    label: 'Date de création',
    type: 'date',
    operators: [
      { value: 'equals', label: 'Est égal à' },
      { value: 'before', label: 'Avant le' },
      { value: 'after', label: 'Après le' },
    ],
  },
  {
    id: 'isActive',
    label: 'Statut',
    type: 'select',
    operators: [{ value: 'equals', label: 'Est' }],
    selectOptions: [
      { value: 'true', label: 'Actif' },
      { value: 'false', label: 'Inactif' },
    ],
  },
];

const COLUMN_OPTIONS: ColumnOption[] = [
  { id: 'nom', label: 'Nom', required: true },
  { id: 'description', label: 'Description' },
  { id: 'code', label: 'Code' },
  { id: 'dateCreated', label: 'Date de création' },
];

function applySingleFilter(niveau: Niveau, filter: ActiveFilter, filterOption: FilterOption) {
  const { field, operator, value } = filter;
  if (!value) return true;
  const fieldVal = (niveau as any)[field];
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

interface NiveauListProps {
  niveaux: Niveau[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
  onFilterChange?: (filters: ActiveFilter[]) => void;
  onEditClick: (niveau: Niveau) => void;
  onDeleteClick: (niveau: Niveau) => void;
  onViewClick: (niveau: Niveau) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onViewMatieres: (niveau: Niveau) => void;
  onAddClick?: () => void;
  onToggleActive?: (niveau: Niveau, active: boolean) => void;
}

export const NiveauList: React.FC<NiveauListProps> = ({
  niveaux,
  loading,
  pagination,
  filters,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onColumnFilterChange,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onDeleteRows,
  onFilterChange,
  onViewMatieres,
  onAddClick,
  onToggleActive,
}) => {
  const confirm = useBoolean();
  const theme = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    nom: '',
    description: '',
    code: '',
    dateCreated: '',
  });
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_OPTIONS.map((col) => col.id)
  );

  const filteredNiveaux = useMemo(() => {
    let data = niveaux;
    activeFilters.forEach((filter) => {
      const filterOption = FILTER_OPTIONS.find((fo) => fo.id === filter.field);
      if (filterOption) {
        data = data.filter((niveau) => applySingleFilter(niveau, filter, filterOption));
      }
    });
    Object.entries(columnFilters).forEach(([colId, val]) => {
      if (val) {
        data = data.filter((niveau) => {
          const fieldVal = (niveau as any)[colId];
          if (!fieldVal) return false;
          return String(fieldVal).toLowerCase().includes(String(val).toLowerCase());
        });
      }
    });
    return data;
  }, [niveaux, activeFilters, columnFilters]);

  const handleFilterChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleColumnChange = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const handleReset = () => {
    setVisibleColumns(COLUMN_OPTIONS.map((col) => col.id));
    setActiveFilters([]);
    onFilterChange?.([]);
    setColumnFilters({ nom: '', description: '', code: '', dateCreated: '' });
    Object.keys(columnFilters).forEach((colId) => {
      onColumnFilterChange?.(colId, '');
    });
    onPageChange(1);
    onLimitChange(10);
  };

  const handleExport = (format: string, options?: any) => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        const newProg = prev + Math.random() * 15;
        if (newProg >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsExporting(false), 500);
          return 100;
        }
        return newProg;
      });
    }, 300);
  };

  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1,
    defaultOrderBy: 'nom',
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

  const handleColumnFilterChangeLocal = (columnId: string, val: string) => {
    setColumnFilters((prev) => ({ ...prev, [columnId]: val }));
    onColumnFilterChange?.(columnId, val);
  };

  const visibleTableHead = TABLE_HEAD.filter(
    (col) => col.id === '' || col.id === 'actions' || visibleColumns.includes(col.id)
  );

  const notFound = !filteredNiveaux.length && !loading;

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
              table.selected.length > 0 && table.selected.length < filteredNiveaux.length
            }
            checked={filteredNiveaux.length > 0 && table.selected.length === filteredNiveaux.length}
            onChange={(e) =>
              table.onSelectAllRows(
                e.target.checked,
                filteredNiveaux.map((row) => row.id)
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

  const renderBreadcrumbs = () => (
    <CustomBreadcrumbs
      links={[
        { name: 'Tableau de bord', href: paths.dashboard.root },
        { name: 'Contenu pédagogique', href: paths.dashboard.contenu_pedagogique.apprentissage },
        { name: "Gestion d'apprentissage" },
      ]}
      sx={{ mb: { xs: 3, md: 5 } }} />
  );

  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'fontWeightBold' }}>
            Niveaux d&apos;enseignement
          </Typography>
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
              Ajouter un niveau
            </Button>
          ) : (
            <></>
          )}
        </Stack>
        {renderBreadcrumbs()}
      </m.div>

      <m.div variants={varFade().inUp}>
        <Card
          sx={{
            boxShadow: theme.customShadows?.z8,
            transition: theme.transitions.create(['box-shadow']),
            '&:hover': {
              boxShadow: theme.customShadows?.z16,
            },
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'end', flexWrap: 'wrap', gap: 4 }}>
            <Stack direction="row" spacing={2}>
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
                icon={<FontAwesomeIcon icon={faFilter} size='sm'/>}
              />
              <Tooltip title="Réinitialiser" arrow>
                <IconButton
                  onClick={handleReset}
                  color="primary"
                  sx={{
                    p: 1,
                    transition: theme.transitions.create(['transform', 'box-shadow']),
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
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
              rowCount={niveaux.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  filteredNiveaux.map((row) => row.id)
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
                        sx={{ px: 2, py: 1, fontWeight: 'fontWeightBold' }}
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

            <Scrollbar style={{ maxHeight: 550 }}>
              <TableContainer
                sx={{
                  position: 'relative',
                  minHeight: 400,
                  maxHeight: 500,
                }}
              >
                <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
                  {renderTableHeader()}
                  <TableBody>
                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={visibleTableHead.length} />
                    ) : (
                      filteredNiveaux.map((niveau) => (
                        <NiveauItem
                          key={niveau.id}
                          niveau={niveau}
                          selected={table.selected.includes(niveau.id)}
                          onEditClick={() => onEditClick(niveau)}
                          onDeleteClick={() => onDeleteClick(niveau)}
                          onViewClick={() => onViewClick(niveau)}
                          onSelectRow={() => table.onSelectRow(niveau.id)}
                          onViewMatieres={() => onViewMatieres(niveau)}
                          onToggleActive={onToggleActive}
                          visibleColumns={visibleColumns}
                        />
                      ))
                    )}
                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, niveaux.length)}
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
          />
        </Card>
      </m.div>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer les niveaux"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> niveau
              {table.selected.length > 1 ? 'x' : ''} ?
            </Typography>
            <Typography variant="caption" color="error.main">
              Cette action est irréversible et supprimera également toutes les matières et chapitres
              associés.
            </Typography>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrash} />}
            onClick={handleDeleteRows}
            sx={{ px: 2, py: 1, fontWeight: 'fontWeightBold' }}
          >
            Supprimer
          </Button>
        }
      />
    </MotionContainer>
  );
};
