'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
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

import { STATUT_OPTIONS } from '../../types';
import { ExerciceItem } from './ExerciceItem';
import { ColumnSelector } from '../filters/ColumnSelector';
import { FilterDropdown } from '../filters/FilterDropdown';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';
import { AdvancedExportDropdown } from '../export/AdvancedExportDropdown ';

import type { ColumnOption } from '../filters/ColumnSelector';
import type { Exercice, Pagination, FilterParams } from '../../types';
import type { ActiveFilter, FilterOption } from '../filters/FilterDropdown';

/** 2) Base table head */
const TABLE_HEAD = [
  { id: 'titre', label: 'Titre', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'statut', label: 'Statut', align: 'left' },
  { id: 'ressources', label: 'Ressources', align: 'left' },
  { id: '', label: 'Actions', align: 'center' },
];

/** 3) Column Options for ColumnSelector */
const COLUMN_OPTIONS: ColumnOption[] = [
  { id: 'titre', label: 'Titre', required: true },
  { id: 'description', label: 'Description' },
  { id: 'statut', label: 'Statut' },
  { id: 'ressources', label: 'Ressources' },
];

/** 4) Filter Options for FilterDropdown */
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

/** 5) Per-column filter: row-based searching below each column header */
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
  // State for exporting data
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    titre: '',
    description: '',
    statut: '',
    ressources: '',
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    COLUMN_OPTIONS.map((col) => col.id)
  );

  const visibleTableHead = TABLE_HEAD.filter(
    (col) => col.id === '' || visibleColumns.includes(col.id)
  );

  useEffect(() => {
    onFilterChange?.(activeFilters);
  }, [activeFilters, onFilterChange]);

  /** 7e) Table logic */
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

  const handleColumnFilterChange = (columnId: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const handleFilterDropdownChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
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
  const handleColumnSelectorChange = (columns: string[]) => {
    setVisibleColumns(columns);
    onColumnChange?.(columns);
  };

  const notFound = !exercices.length && !loading;

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
      {/* Title + Add Button + FilterDropdown + ColumnSelector */}
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Exercices
          </Typography>

          <Stack direction="row" spacing={2}>
            {/* Add Button */}
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
                Ajouter un exercice
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

          {/* Bulk Actions (selected rows) */}
          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={exercices.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  exercices.map((row) => row.id)
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
                  {/* Dynamic table head based on visibleColumns */}
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={visibleTableHead}
                    rowCount={exercices.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        exercices.map((row) => row.id)
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
                    {/* The row of per-column search bars below the header */}
                    {renderFilterRow()}

                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={visibleTableHead.length} />
                    ) : (
                      exercices.map((exercice) => (
                        <ExerciceItem
                          key={exercice.id}
                          exercice={exercice}
                          selected={table.selected.includes(exercice.id)}
                          onEditClick={() => onEditClick(exercice)}
                          onDeleteClick={() => onDeleteClick(exercice)}
                          onViewClick={() => onViewClick(exercice)}
                          onSelectRow={() => table.onSelectRow(exercice.id)}
                          onToggleActive={onToggleActive}
                          // If you want to conditionally render columns inside the row:
                          visibleColumns={visibleColumns}
                        />
                      ))
                    )}

                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, exercices.length)}
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

          {/* Pagination */}
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
