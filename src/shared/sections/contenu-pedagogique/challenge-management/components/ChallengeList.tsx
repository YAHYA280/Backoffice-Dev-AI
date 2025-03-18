import type { ColumnOption } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/ColumnSelector';
import type {
  ActiveFilter,
  FilterOption,
} from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/FilterDropdown';

import { m } from 'framer-motion';
import React, { useRef, useState, useMemo } from 'react';
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
  TableContainer,
  InputAdornment,
  TableHead,
  Checkbox,
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

import { FilterDropdown } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/FilterDropdown';
import { ColumnSelector } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/filters/ColumnSelector';
import { TableSkeletonLoader } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/common/TableSkeletonLoader';
import { AdvancedExportDropdown } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/export/AdvancedExportDropdown ';

import { ChallengeItem } from './ChallengeItem';
import { STATUT_OPTIONS, DIFFICULTE_OPTIONS } from '../constants';

import type { Challenge, Pagination, FilterParams, ChallengeStatus, Difficulty } from '../types';

// Define interface for table columns
interface TableColumn {
  id: string;
  label: string;
  align: 'left' | 'center' | 'right';
  width?: number | string;
}

// Updated to match screenshot columns exactly
const TABLE_HEAD: TableColumn[] = [
  { id: 'select', label: '', align: 'center', width: 50 },
  { id: 'nom', label: 'Nom', align: 'center', width: 260 },
  { id: 'description', label: 'Description', align: 'left', width: 300 },
  { id: 'statut', label: 'Statut', align: 'left', width: 120 },
  { id: 'datePublication', label: 'Date publication', align: 'center', width: 150 },
  { id: 'dateMiseAJour', label: 'Dernière modification', align: 'center', width: 150 },
  { id: 'difficulte', label: 'Difficulté', align: 'center', width: 120 },
  { id: 'nbTentatives', label: 'Tentatives', align: 'center', width: 100 },
  { id: 'participantsCount', label: 'Participants', align: 'center', width: 120 },
  { id: 'actions', label: 'Actions', align: 'center', width: 150 },
];

// Column options for the ColumnSelector - Updated to match screenshot
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

// Filter options for the FilterDropdown
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
    selectOptions: STATUT_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
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
    selectOptions: DIFFICULTE_OPTIONS.map((option) => ({
      value: option.value,
      label: option.label,
    })),
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

// Per-column filter component
interface ColumnFilterProps {
  columnId: string;
  value: string;
  onChange: (columnId: string, value: string) => void;
  align?: 'left' | 'center' | 'right';
  dense?: boolean;
}

const ColumnFilter = ({
  columnId,
  value,
  onChange,
  align = 'left',
  dense = false,
}: ColumnFilterProps) => {
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
      onBlur={() => !value && setIsExpanded(false)} // Only collapse if no value
      sx={{
        width: isExpanded ? 'auto' : 'auto',
        minWidth: isExpanded ? 80 : 24, // Just enough width for the icon when not expanded
        transition: 'all 0.2s ease-in-out',
        marginTop: dense ? '-3px' : '-6px', // Reduce space between search icon and column title in dense mode
        '& .MuiOutlinedInput-root': {
          height: dense ? '24px' : '28px', // Smaller height in dense mode
          background: 'transparent',
          '& fieldset': {
            border: 'none !important',
          },
          '&:hover fieldset': {
            border: 'none !important',
          },
        },
        // Make the input text smaller and remove padding
        '& .MuiInputBase-input': {
          padding: dense ? '0px 0px' : '2px 0px', // Reduced padding in dense mode
          fontSize: dense ? '0.7rem' : '0.75rem', // Smaller font in dense mode
          textAlign: align, // Match alignment with column header
        },
      }}
      InputProps={{
        // Always show the search icon at the start
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
              icon={faSearch}
              onClick={handleSearchIconClick}
              style={{
                color: 'text.disabled',
                fontSize: dense ? '0.8rem' : '1rem', // Smaller icon in dense mode
                cursor: 'pointer',
              }}
            />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              onClick={() => onChange(columnId, '')}
              sx={{
                padding: 0,
                '&:hover': {
                  background: 'transparent',
                },
              }}
            >
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: dense ? '0.8rem' : '1rem' }} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
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

  // State for exporting data
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // State for column-based text filters
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

  // State for FilterDropdown & ColumnSelector
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  // Default visible columns set to match the screenshot
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'nom',
    'description',
    'statut',
    'datePublication',
    'dateMiseAJour',
    'difficulte',
    'nbTentatives',
    'participantsCount',
  ]);

  // Table logic
  const table = useTable({
    defaultRowsPerPage: pagination.limit,
    defaultCurrentPage: pagination.page - 1,
    defaultOrderBy: 'nom',
  });

  // Filter out deleted challenges
  const filteredChallenges = useMemo(
    () => challenges.filter((challenge) => challenge.statut !== 'Supprimé'),
    [challenges]
  );

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
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    onColumnFilterChange?.(columnId, value);
  };

  // FilterDropdown callback
  const handleFilterChange = (newFilters: ActiveFilter[]) => {
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  // ColumnSelector callback
  const handleColumnChange = (columns: string[]) => {
    setVisibleColumns(columns);
    onColumnChange?.(columns);
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

  // Create the visible table headers based on selected columns
  const visibleTableHead = useMemo(
    () =>
      TABLE_HEAD.filter(
        (col) => col.id === 'select' || col.id === 'actions' || visibleColumns.includes(col.id)
      ),
    [visibleColumns]
  );

  const notFound = !filteredChallenges.length && !loading;

  // Custom table head to ensure perfect column alignment
  // Custom table head to ensure perfect column alignment
  const renderTableHeader = () => (
    <TableHead
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        '& .MuiTableCell-head': {
          bgcolor: alpha(theme.palette.primary.lighter, 0.2),
          fontWeight: 'fontWeightBold',
          padding: table.dense ? '2px 6px' : '8px 8px', // Reduced padding in both modes
        },
      }}
    >
      {/* First row - Column Headers */}
      <TableRow>
        {/* Checkbox column for row selection */}
        <TableCell
          padding="checkbox"
          sx={{
            width: table.dense ? 60 : 50, // Increased width in dense mode
            minWidth: table.dense ? 60 : 50, // Increased min-width in dense mode
            maxWidth: table.dense ? 60 : 50, // Increased max-width in dense mode
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            position: 'sticky',
            top: 0,
            zIndex: 12,
            padding: table.dense ? '2px 12px 2px 6px' : '4px 8px', // Reduced padding in both modes
            height: table.dense ? '28px' : '23px', // For non-dense, 38px * 0.6 ≈ 23px
          }}
        >
          <Checkbox
            indeterminate={table.selected.length > 0 && table.selected.length < challenges.length}
            checked={challenges.length > 0 && table.selected.length === challenges.length}
            onChange={(event) =>
              table.onSelectAllRows(
                event.target.checked,
                challenges.map((row) => row.id)
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
              width={column.width}
              sx={{
                whiteSpace: 'nowrap',
                borderBottom: 'none',
                fontSize: table.dense ? '0.8125rem' : '0.875rem',
                minWidth: column.width,
                maxWidth: column.width,
                width: column.width,
                bgcolor: alpha(theme.palette.primary.lighter, 0.2),
                position: 'sticky',
                top: 0,
                zIndex: 11,
                padding: table.dense ? '2px 6px' : '8px 8px', // Reduced padding in both modes
                height: table.dense ? '28px' : '23px', // For non-dense, 38px * 0.6 ≈ 23px
              }}
            >
              {column.label}
            </TableCell>
          ))}
      </TableRow>

      {/* Second row - Filters */}
      <TableRow
        sx={{
          bgcolor: alpha(theme.palette.primary.lighter, 0.2),
          '& .MuiTableCell-root': {
            padding: table.dense ? '0px 6px 2px' : '0px 8px 4px', // Reduced bottom padding in both modes
            borderTop: 'none',
            height: table.dense ? '20px' : '18px', // For non-dense, 30px * 0.6 = 18px
          },
        }}
      >
        {/* Empty checkbox cell for filter row */}
        <TableCell
          padding="checkbox"
          sx={{
            width: table.dense ? 60 : 50, // Match first row width
            minWidth: table.dense ? 60 : 50, // Match first row min-width
            maxWidth: table.dense ? 60 : 50, // Match first row max-width
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            position: 'sticky',
            top: table.dense ? '28px' : '23px', // Non-dense: first row height is now 23px
            zIndex: 11,
            height: table.dense ? '20px' : '18px', // For non-dense, 30px * 0.6 = 18px
            padding: table.dense ? '0 12px 0 6px' : '0 8px', // Match first row padding
          }}
        />

        {visibleTableHead
          .filter((col) => col.id !== 'select')
          .map((column) => {
            if (column.id === 'actions') {
              return (
                <TableCell
                  key={`${column.id}-filter-cell`}
                  align={column.align}
                  width={column.width}
                  sx={{
                    minWidth: column.width,
                    maxWidth: column.width,
                    width: column.width,
                    bgcolor: alpha(theme.palette.primary.lighter, 0.2),
                    position: 'sticky',
                    top: table.dense ? '28px' : '23px', // Non-dense: updated to match the new first row height
                    zIndex: 11,
                    height: table.dense ? '20px' : '18px', // For non-dense, 30px * 0.6 = 18px
                  }}
                >
                  {/* Empty cell for action columns */}
                </TableCell>
              );
            }

            // Regular filter cells for data columns
            return (
              <TableCell
                key={`${column.id}-filter`}
                align={column.align}
                width={column.width}
                sx={{
                  minWidth: column.width,
                  maxWidth: column.width,
                  width: column.width,
                  bgcolor: alpha(theme.palette.primary.lighter, 0.2),
                  position: 'sticky',
                  top: table.dense ? '28px' : '23px', // Non-dense: updated to match the new first row height
                  zIndex: 11,
                  height: table.dense ? '20px' : '18px', // For non-dense, 30px * 0.6 = 18px
                }}
              >
                <ColumnFilter
                  columnId={column.id}
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

  return (
    <MotionContainer>
      {/* Title + Add Button */}
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Challenges
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
                Ajouter un challenge
              </Button>
            )}
          </Stack>
        </Stack>
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
          {/* Filter Controls (FilterDropdown + ColumnSelector + Advanced Filter) */}
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'end', flexWrap: 'wrap', gap: 4 }}>
            <Stack direction="row" alignContent="end" spacing={2}>
              <FilterDropdown
                filterOptions={FILTER_OPTIONS}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                buttonText="Filtres"
                icon={<FontAwesomeIcon icon={faFilter} />}
              />

              <ColumnSelector
                columns={COLUMN_OPTIONS}
                visibleColumns={visibleColumns}
                onColumnChange={handleColumnChange}
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
              rowCount={filteredChallenges.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  filteredChallenges.map((row) => row.id)
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
                        size="medium"
                        onClick={handleOpenConfirm}
                        sx={{
                          minWidth: 'auto',
                          px: 1,
                          py: 1,
                          m: 0.5,
                          fontWeight: 'fontWeightBold',
                          transition: theme.transitions.create(['background-color']),
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    )}
                  </Box>
                </Box>
              }
            />

            {/* TABLE + SCROLLBAR */}
            <Scrollbar sx={{ maxHeight: 550 }}>
              <TableContainer
                sx={{
                  position: 'relative',
                  minHeight: 240,
                  maxHeight: 500,
                  tableLayout: 'fixed', // Important for fixed column widths
                }}
              >
                <Table
                  size={table.dense ? 'small' : 'medium'}
                  stickyHeader
                  sx={{ tableLayout: 'fixed' }} // Important for fixed column widths
                >
                  {/* Custom Table Head for better column alignment */}
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
                          // tableHead={visibleTableHead}
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
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Card>
      </m.div>

      {/* Confirmation dialog for bulk delete */}
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

export default ChallengeList;
