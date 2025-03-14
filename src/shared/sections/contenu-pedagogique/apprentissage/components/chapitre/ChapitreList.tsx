'use client';

import { m } from 'framer-motion';
import React, { useRef, useState, useEffect } from 'react';
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
import { AdvancedExportDropdown } from '../export/AdvancedExportDropdown ';

import type { ColumnOption } from '../filters/ColumnSelector';
import type { Chapitre, Pagination, FilterParams } from '../../types';
import type { ActiveFilter, FilterOption } from '../filters/FilterDropdown';

const TABLE_HEAD = [
  { id: 'ordre', label: 'Ordre', align: 'center', width: 80 },
  { id: 'nom', label: 'Chapitre', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'difficulte', label: 'Difficulté', align: 'left', width: 120 },
  { id: 'exercicesCount', label: 'Exercices', align: 'center', width: 100 },
  { id: '', label: 'Actions', align: 'center', width: 100 },
];

const COLUMN_OPTIONS: ColumnOption[] = [
  { id: 'ordre', label: 'Ordre' },
  { id: 'nom', label: 'Chapitre', required: true },
  { id: 'description', label: 'Description' },
  { id: 'difficulte', label: 'Difficulté' },
  { id: 'exercicesCount', label: 'Exercices' },
];

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

interface ColumnFilterProps {
  columnId: string;
  value: string;
  onChange: (columnId: string, value: string) => void;
}

const ColumnFilter = ({ columnId, value, onChange }: ColumnFilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSearchIconClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <TextField
      size="small"
      inputRef={inputRef}
      value={value}
      onChange={(e) => onChange(columnId, e.target.value)}
      onFocus={() => setIsExpanded(true)}
      onBlur={() => setIsExpanded(false)}
      sx={{
        width: isExpanded ? 200 : 50,
        transition: 'width 0.3s ease-in-out',
        '& .MuiOutlinedInput-root': {
          borderRadius: 1,
          bgcolor: 'background.paper',
          '& fieldset': {
            border: 'none !important',
          },
          '&:hover fieldset': {
            border: 'none !important',
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
              icon={faSearch}
              onClick={handleSearchIconClick}
              style={{
                color: 'text.disabled',
                fontSize: '0.875rem',
                cursor: 'pointer',
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
    />
  );
};

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
  // State for exporting data
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    ordre: '',
    nom: '',
    description: '',
    difficulte: '',
    exercicesCount: '',
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_OPTIONS.map((col) => col.id)
  );

  const visibleTableHead = TABLE_HEAD.filter(
    (col) => col.id === '' || visibleColumns.includes(col.id)
  );

  useEffect(() => {}, [activeFilters]);

  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1,
    defaultOrderBy: 'ordre',
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
  // Export handler
  const handleExport = (format: string, options?: any) => {
    console.log(`Exporting data in ${format} format with options:`, options);

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prevProgress) => {
        const newProgress = prevProgress + Math.random() * 15;

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            // Show success notification if needed
          }, 500);
          return 100;
        }

        return newProgress;
      });
    }, 300);
  };

  const handleColumnFilterChange = (columnId: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    onColumnFilterChange?.(columnId, value);
  };

  const handleFilterDropdownChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
  };

  const handleColumnSelectorChange = (columns: string[]) => {
    setVisibleColumns(columns);
  };

  const isChapterFound = !chapitres.length && !loading;

  const renderFilterRow = () => (
    <TableRow
      sx={{
        position: 'sticky',
        top: table.dense ? '37px' : '57px',
        bgcolor: 'background.paper',
        zIndex: 2,
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        '& .MuiTableCell-root': {
          padding: '2px 4px',
          lineHeight: 1,
        },
      }}
    >
      <TableCell padding="checkbox" />
      {visibleTableHead.map((column) => {
        if (column.id === '') {
          return (
            <TableCell
              key="actions-filter-cell"
              align="center"
              sx={{ bgcolor: 'background.paper' }}
            >
              {/* Empty cell for actions column */}
            </TableCell>
          );
        }

        // Regular filter cells for data columns
        return (
          <TableCell key={column.id}>
            <ColumnFilter
              columnId={column.id}
              value={columnFilters[column.id as keyof typeof columnFilters] || ''}
              onChange={handleColumnFilterChange}
            />
          </TableCell>
        );
      })}
    </TableRow>
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
                Ajouter un chapitre
              </Button>
            ) : (
              <></>
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
              <FilterDropdown
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterDropdownChange}
                buttonText="Filtres"
                icon={<FontAwesomeIcon icon={faFilter} />}
              />

              <ColumnSelector
                columns={COLUMN_OPTIONS}
                visibleColumns={visibleColumns}
                onColumnChange={handleColumnSelectorChange}
                buttonText="Colonnes"
              />
              <AdvancedExportDropdown
                onExport={handleExport}
                isExporting={isExporting}
                exportProgress={exportProgress}
                withExportOptions
                title="Exporter les données"
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

            <Scrollbar sx={{ height: 550 }}>
              <TableContainer
                sx={{
                  position: 'relative',
                  minHeight: 240,
                  maxHeight: 500,
                }}
              >
                <Table size={table.dense ? 'small' : 'medium'} stickyHeader>
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

                    {isChapterFound ? (
                      <TableNoData
                        notFound={isChapterFound}
                        sx={{
                          py: 10,
                        }}
                      />
                    ) : (
                      <></>
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
