import { m } from 'framer-motion';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faTimes, faFilter, faSearch } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
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

import { NiveauItem } from './NiveauItem';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';

// -------------------------------------------
// 1) Import the FilterDropdown & ColumnSelector
//    plus the needed types (ColumnOption, FilterOption, ActiveFilter)
// -------------------------------------------

import { FilterDropdown } from '../filters/FilterDropdown';
import { ColumnSelector } from '../filters/ColumnSelector';

import type { ColumnOption } from '../filters/ColumnSelector';
import type { ActiveFilter, FilterOption } from '../filters/FilterDropdown';

// -------------------------------------------
// 5) Component Props
// -------------------------------------------
import type { Niveau, Pagination, FilterParams } from '../../types';

// -------------------------------------------
// 2) Define the same TABLE_HEAD but do NOT export it directly.
//    We'll derive the visible columns in the component.
// -------------------------------------------
const TABLE_HEAD = [
  { id: 'nom', label: 'Nom', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'dateCreated', label: 'Date de création', align: 'left' },
  { id: '', label: 'Actions', align: 'center' },
];

// -------------------------------------------
// 3) ColumnFilter (the per-column search bar)
// -------------------------------------------
interface ColumnFilterProps {
  columnId: string;
  value: string;
  onChange: (columnId: string, value: string) => void;
  placeholder?: string;
}

const ColumnFilter = ({ columnId, value, onChange, placeholder }: ColumnFilterProps) => (
  <TextField
    size="small"
    fullWidth
    value={value}
    onChange={(e) => onChange(columnId, e.target.value)}
    placeholder={placeholder || `Filtrer par ${columnId}`}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FontAwesomeIcon
            icon={faSearch}
            style={{ color: 'text.disabled', fontSize: '0.875rem' }}
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

// -------------------------------------------
// 4) Define your filter options & column options
//    for the FilterDropdown & ColumnSelector
// -------------------------------------------

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
  // You can exclude the actions column since it's not data-based
];

interface NiveauListProps {
  niveaux: Niveau[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;

  // OPTIONAL: If you want to capture advanced filtering from FilterDropdown
  // you can add onFilterChange?: (filters: ActiveFilter[]) => void;
  // and handle it.

  onEditClick: (niveau: Niveau) => void;
  onDeleteClick: (niveau: Niveau) => void;
  onViewClick: (niveau: Niveau) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onViewMatieres: (niveau: Niveau) => void;
  onAddClick?: () => void;
  onToggleActive?: (niveau: Niveau, active: boolean) => void;
}

// -------------------------------------------
// 6) NiveauList Implementation
// -------------------------------------------
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
  onViewMatieres,
  onAddClick,
  onToggleActive,
}) => {
  const confirm = useBoolean();
  const theme = useTheme();

  // State for column-based text filters
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    nom: '',
    description: '',
    code: '',
    dateCreated: '',
  });

  // -------------------------------------------
  // 7) State for FilterDropdown & ColumnSelector
  // -------------------------------------------
  // Active filters from the FilterDropdown
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  // Visible columns from the ColumnSelector
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_OPTIONS.map((col) => col.id)
  );

  // If you want to send these activeFilters up to a parent, you'd do so here.
  // e.g. useEffect(() => { onFilterChange?.(activeFilters); }, [activeFilters]);

  // FilterDropdown callback
  const handleFilterChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
    // If you need to push these to a parent or do an API call, do it here.
  };

  // ColumnSelector callback
  const handleColumnChange = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  // -------------------------------------------
  // 9) Table logic
  // -------------------------------------------
  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1, // Convert to 0-based for MUI
    defaultOrderBy: 'nom', // Default sorting field
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

  // -------------------------------------------
  // 10) Per-column filter
  // -------------------------------------------
  const handleColumnFilterChangeLocal = (columnId: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    onColumnFilterChange?.(columnId, value);
  };

  // -------------------------------------------
  // 11) Which columns to show in the table
  // -------------------------------------------
  const visibleTableHead = TABLE_HEAD.filter(
    (col) => col.id === '' || visibleColumns.includes(col.id)
  );

  // -------------------------------------------
  // 12) "No data" condition
  // -------------------------------------------
  const notFound = !niveaux.length && !loading;

  // -------------------------------------------
  // 13) Render row for filter inputs (below header)
  //     We only render these columns that are visible.
  // -------------------------------------------
  const renderFilterRow = () => (
    <TableRow>
      <TableCell padding="checkbox" />
      {visibleTableHead
        .filter((col) => col.id) // skip the empty 'Actions' column
        .map((column) => (
          <TableCell key={column.id}>
            <ColumnFilter
              columnId={column.id}
              value={columnFilters[column.id as keyof typeof columnFilters] || ''}
              onChange={handleColumnFilterChangeLocal}
              placeholder={`Rechercher par ${column.label}`}
            />
          </TableCell>
        ))}
    </TableRow>
  );

  // -------------------------------------------
  // 14) Simple breadcrumb
  // -------------------------------------------
  const renderBreadcrumbs = () => (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
      <Typography color="text.primary">Niveaux d&apos;enseignement</Typography>
    </Breadcrumbs>
  );

  return (
    <MotionContainer>
      {/* Title + Add Button */}
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Niveaux
          </Typography>

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
              Ajouter un niveau
            </Button>
          )}
        </Stack>
        {renderBreadcrumbs()}
      </m.div>

      {/* Filter Controls (FilterDropdown + ColumnSelector + Advanced Filter) */}
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
          {/* 
            Advanced Filter Button + FilterDropdown + ColumnSelector 
            You can arrange them in a row or however you like 
          */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'end', flexWrap: 'wrap', gap: 4 }}>
            <Stack direction="row" alignContent="end" spacing={2}>
              <FilterDropdown
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                buttonText="Filtres"
                icon={<FontAwesomeIcon icon={faFilter} />}
              />

              {/* ColumnSelector from your first snippet */}
              <ColumnSelector
                columns={COLUMN_OPTIONS}
                visibleColumns={visibleColumns}
                onColumnChange={handleColumnChange}
                buttonText="Colonnes"
              />
            </Stack>
          </Box>

          {/* Bulk Actions (Selected Rows) */}
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={niveaux.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  niveaux.map((row) => row.id)
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
                    {/* Delete action button */}
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

            {/* TABLE + SCROLLBAR */}
            <Scrollbar>
              <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 240 }}>
                <Table size={table.dense ? 'small' : 'medium'}>
                  {/* Dynamic Table Head based on visibleColumns */}
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={visibleTableHead}
                    rowCount={niveaux.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        niveaux.map((row) => row.id)
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
                    {/* Add the filter row below the header */}
                    {renderFilterRow()}

                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={visibleTableHead.length} />
                    ) : (
                      niveaux.map((niveau) => (
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
                          // Pass visibleColumns if you want conditional cell rendering in NiveauItem
                          visibleColumns={visibleColumns}
                        />
                      ))
                    )}

                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, niveaux.length)}
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
              onPageChange(page + 1); // Convert 0-based back to 1-based
            }}
            onRowsPerPageChange={(e) => {
              onLimitChange(parseInt(e.target.value, 10));
            }}
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </m.div>

      {/* Confirmation dialog for bulk delete */}
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
