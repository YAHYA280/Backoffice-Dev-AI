'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faTimes,
  faFilter,
  faSearch,
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
  useTheme,
  TableRow,
  TableBody,
  TextField,
  TableCell,
  Typography,
  IconButton,
  Breadcrumbs,
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
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import ChapitreItem from './ChapitreItem';
import { DIFFICULTE_OPTIONS } from '../../types';
import { FilterDropdown } from '../filters/FilterDropdown';
import { ColumnSelector } from '../filters/ColumnSelector';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';

import type { ColumnOption } from '../filters/ColumnSelector';
import type { Chapitre, Pagination, FilterParams } from '../../types';
/** 1) Import and define FilterDropdown / ColumnSelector + their props */
import type { ActiveFilter, FilterOption } from '../filters/FilterDropdown';

/** 2) Define your base table head */
const TABLE_HEAD = [
  { id: 'ordre', label: 'Ordre', align: 'center', width: 80 },
  { id: 'nom', label: 'Chapitre', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'difficulte', label: 'Difficulté', align: 'left', width: 120 },
  { id: 'exercicesCount', label: 'Exercices', align: 'center', width: 100 },
  { id: '', label: 'Actions', align: 'right', width: 100 },
];

/** 3) Column Options for ColumnSelector */
const COLUMN_OPTIONS: ColumnOption[] = [
  { id: 'ordre', label: 'Ordre' },
  { id: 'nom', label: 'Chapitre', required: true },
  { id: 'description', label: 'Description' },
  { id: 'difficulte', label: 'Difficulté' },
  { id: 'exercicesCount', label: 'Exercices' },
];

/** 4) Filter Options for FilterDropdown */
const FILTER_OPTIONS: FilterOption[] = [
  {
    id: 'ordre',
    label: 'Ordre',
    type: 'number',
    operators: [
      { value: 'equals', label: 'Est égal à' },
      { value: 'greaterThan', label: 'Plus grand que' },
      { value: 'lessThan', label: 'Plus petit que' },
    ],
  },
  {
    id: 'nom',
    label: 'Chapitre',
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
    id: 'difficulte',
    label: 'Difficulté',
    type: 'select',
    operators: [{ value: 'equals', label: 'Est' }],
    selectOptions: DIFFICULTE_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
  },
  {
    id: 'exercicesCount',
    label: "Nombre d'exercices",
    type: 'number',
    operators: [
      { value: 'equals', label: 'Est égal à' },
      { value: 'greaterThan', label: 'Plus grand que' },
      { value: 'lessThan', label: 'Plus petit que' },
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

/** 5) ColumnFilter for row-based searching under each column */
interface ColumnFilterProps {
  columnId: string;
  value: string;
  onChange: (columnId: string, value: string) => void;
  placeholder?: string;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ columnId, value, onChange, placeholder }) => {
  const theme = useTheme();

  return (
    <TextField
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(columnId, e.target.value)}
      placeholder={placeholder || `Rechercher par ${columnId}`}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
              icon={faSearch}
              style={{
                color: theme.palette.text.disabled,
                fontSize: '0.875rem',
              }}
            />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => onChange(columnId, '')}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.75rem' }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 1,
          bgcolor: 'background.paper',
          '& fieldset': {
            borderWidth: '1px !important',
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
        },
      }}
    />
  );
};

/** 6) Breadcrumb props & main props */
interface BreadcrumbProps {
  currentNiveauId?: string | null;
  currentNiveauName?: string | null;
  currentMatiereId?: string | null;
  currentMatiereName?: string | null;
  navigateToNiveaux: () => void;
  navigateToMatieres: (niveau: any) => void;
}

interface ChapitreListProps {
  chapitres: Chapitre[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
  onEditClick: (chapitre: Chapitre) => void;
  onDeleteClick: (chapitre: Chapitre) => void;
  onViewClick: (chapitre: Chapitre) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onViewExercices: (chapitre: Chapitre) => void;
  onAddClick?: () => void;
  onToggleActive?: (chapitre: Chapitre, active: boolean) => void;
  breadcrumbs?: BreadcrumbProps;
}

/** 7) Final integrated ChapitreList */
export const ChapitreList = ({
  chapitres,
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
  onViewExercices,
  onAddClick,
  onToggleActive,
  breadcrumbs,
}: ChapitreListProps) => {
  const confirm = useBoolean();
  const theme = useTheme();

  /** State for the row-based text filters (per column). */
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    ordre: '',
    nom: '',
    description: '',
    difficulte: '',
    exercicesCount: '',
  });

  /** 7a) State for FilterDropdown & ColumnSelector. */
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_OPTIONS.map((col) => col.id)
  );

  /** 7b) We'll filter out columns that are not in visibleColumns. */
  const visibleTableHead = TABLE_HEAD.filter(
    (col) => col.id === '' || visibleColumns.includes(col.id)
  );

  /** 7c) If you want to notify parent of the filter changes: */
  useEffect(() => {
    // This is only for the FilterDropdown's active filters.
    // If you also want to pass the column-based search filters up, you'd do that too.
    // But usually you'll handle that in your own API call or effect.
    // For now, we just pass them to onSearchChange or onColumnFilterChange as you already do.
  }, [activeFilters]);

  /** 7d) Table logic */
  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1, // Convert to 0-based for MUI
    defaultOrderBy: 'ordre', // Default sorting field
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

  /** 7f) Row-based column filter updates */
  const handleColumnFilterChange = (columnId: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    onColumnFilterChange?.(columnId, value);
  };

  /** 7g) FilterDropdown & ColumnSelector callbacks */
  const handleFilterDropdownChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
    // If you need to pass these to a parent, do so (onFilterChange).
    // Or you can do that here if you want to combine them with row-based filters.
  };

  const handleColumnSelectorChange = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  /** 7h) "No data" condition */
  const notFound = !chapitres.length && !loading;

  /** 8) Render the row of column filters below the table header. */
  const renderFilterRow = () => (
    <TableRow>
      <TableCell padding="checkbox" />
      {visibleTableHead
        .filter((col) => col.id) // Skip the empty Actions column
        .map((column) => (
          <TableCell key={column.id}>
            <ColumnFilter
              columnId={column.id}
              value={columnFilters[column.id] || ''}
              onChange={handleColumnFilterChange}
              placeholder={`Rechercher par ${column.label}`}
            />
          </TableCell>
        ))}
    </TableRow>
  );

  /** 9) Render breadcrumbs if needed */
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
        <Typography color="text.primary">{breadcrumbs.currentMatiereName}</Typography>
      </Breadcrumbs>
    );
  };

  return (
    <MotionContainer>
      {/* Title + Add Button */}
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Chapitres
          </Typography>

          <Stack direction="row" spacing={2}>
            {onAddClick && (
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
                Ajouter un chapitre
              </Button>
            )}
          </Stack>
        </Stack>
        {renderBreadcrumbs()}
      </m.div>

      {/* Main Card */}
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
            <Stack direction="row" alignContent="end" spacing={2}>
              {/* FilterDropdown (for multi-field filtering) */}
              <FilterDropdown
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterDropdownChange}
                buttonText="Filtres"
                icon={<FontAwesomeIcon icon={faFilter} />}
              />

              {/* ColumnSelector (for dynamic columns) */}
              <ColumnSelector
                columns={COLUMN_OPTIONS}
                visibleColumns={visibleColumns}
                onColumnChange={handleColumnSelectorChange}
                buttonText="Colonnes"
              />
            </Stack>
          </Box>
          {/* Bulk Actions (Selected Rows) */}
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={chapitres.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  chapitres.map((row) => row.id)
                )
              }
              action={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'fontWeightBold' }}>
                    {table.selected.length} sélectionné
                    {table.selected.length > 1 ? 's' : ''}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {onDeleteRows && (
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
                    )}
                  </Box>
                </Box>
              }
            />

            <Scrollbar>
              <TableContainer
                sx={{
                  position: 'relative',
                  overflow: 'unset',
                  minHeight: 240,
                }}
              >
                <Table size={table.dense ? 'small' : 'medium'}>
                  {/* Dynamic Table Head based on visibleColumns */}
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={visibleTableHead}
                    rowCount={chapitres.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        chapitres.map((row) => row.id)
                      )
                    }
                    sx={{
                      '& .MuiTableCell-head': {
                        bgcolor: alpha(theme.palette.primary.lighter, 0.2),
                        fontWeight: 'fontWeightBold',
                      },
                    }}
                  />

                  <TableBody>
                    {/* The row-based search bar under each column */}
                    {renderFilterRow()}

                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={visibleTableHead.length} />
                    ) : (
                      chapitres.map((chapitre) => (
                        <ChapitreItem
                          key={chapitre.id}
                          chapitre={chapitre}
                          selected={table.selected.includes(chapitre.id)}
                          onEditClick={() => onEditClick(chapitre)}
                          onDeleteClick={() => onDeleteClick(chapitre)}
                          onViewClick={() => onViewClick(chapitre)}
                          onSelectRow={() => table.onSelectRow(chapitre.id)}
                          onViewExercices={() => onViewExercices(chapitre)}
                          onToggleActive={onToggleActive}
                          // If you need the visible columns in your row item, pass them along:
                          visibleColumns={visibleColumns}
                        />
                      ))
                    )}

                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, chapitres.length)}
                    />

                    {notFound && (
                      <TableNoData
                        notFound={notFound}
                        sx={{
                          py: 10,
                        }}
                      />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Box>

          {/* Table Pagination */}
          <TablePaginationCustom
            count={pagination.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={(e, page) => {
              table.onChangePage(e, page);
              onPageChange(page + 1); // Convert 0-based to 1-based
            }}
            onRowsPerPageChange={(e) => {
              onLimitChange(parseInt(e.target.value, 10));
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </m.div>

      {/* Confirmation Dialog for bulk delete */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer les chapitres"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> chapitre
              {table.selected.length > 1 ? 's' : ''} ?
            </Typography>
            <Typography variant="caption" color="error.main">
              Cette action est irréversible et supprimera également tous les exercices associés.
            </Typography>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrash} />}
            onClick={handleDeleteRows}
            sx={{
              px: 2,
              py: 1,
              fontWeight: 'fontWeightBold',
              boxShadow: theme.customShadows?.z8,
            }}
          >
            Supprimer
          </Button>
        }
      />
    </MotionContainer>
  );
};
