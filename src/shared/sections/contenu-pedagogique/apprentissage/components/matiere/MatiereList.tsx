import { m } from 'framer-motion';
import React, { useState } from 'react';
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
  Switch,
  Popover,
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
  FormControlLabel,
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

import { MatiereItem } from './MatiereItem';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';

import type { Matiere, Pagination, FilterParams } from '../../types';

// Define table head with explicit column configurations
const TABLE_HEAD = [
  { id: 'nom', label: 'Matière', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'chapitresCount', label: 'Chapitres', align: 'center' },
  { id: 'dateCreated', label: 'Date de création', align: 'left' },
  { id: '', label: 'Actions', align: 'right' },
];

interface ColumnFilterProps {
  columnId: string;
  value: string;
  onChange: (columnId: string, value: string) => void;
  placeholder?: string;
}
interface BreadcrumbProps {
  currentNiveauId?: string | null;
  currentNiveauName?: string | null;
  navigateToNiveaux: () => void;
}

const ColumnFilter: React.FC<ColumnFilterProps> = ({ columnId, value, onChange, placeholder }) => (
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
            style={{
              color: 'text.disabled',
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

interface MatiereListProps {
  matieres: Matiere[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
  onEditClick: (matiere: Matiere) => void;
  onDeleteClick: (matiere: Matiere) => void;
  onViewClick: (matiere: Matiere) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onViewChapitres: (matiere: Matiere) => void;
  onAddClick?: () => void;
  onToggleActive?: (matiere: Matiere, active: boolean) => void;
  breadcrumbs?: BreadcrumbProps;
}

export const MatiereList: React.FC<MatiereListProps> = ({
  matieres,
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
  onViewChapitres,
  onAddClick,
  onToggleActive,
  breadcrumbs,
}) => {
  const confirm = useBoolean();
  const theme = useTheme();

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    nom: '',
    description: '',
    chapitresCount: '',
    dateCreated: '',
  });

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

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterReset = () => {
    setColumnFilters({
      nom: '',
      description: '',
      chapitresCount: '',
      dateCreated: '',
    });
    if (onColumnFilterChange) {
      Object.keys(columnFilters).forEach((key) => {
        onColumnFilterChange(key, '');
      });
    }
  };

  const handleColumnFilterChange = (columnId: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    if (onColumnFilterChange) {
      onColumnFilterChange(columnId, value);
    }
  };

  const notFound = !matieres.length && !loading;
  const filterOpen = Boolean(filterAnchorEl);

  // Render filter row under table header
  const renderFilterRow = () => (
    <TableRow>
      <TableCell padding="checkbox" />
      {TABLE_HEAD.filter((col) => col.id).map(
        (column) =>
          column.id && (
            <TableCell key={column.id}>
              <ColumnFilter
                columnId={column.id}
                value={columnFilters[column.id] || ''}
                onChange={handleColumnFilterChange}
                placeholder={`Rechercher par ${column.label}`}
              />
            </TableCell>
          )
      )}
    </TableRow>
  );

  // Render breadcrumbs
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
        <Typography color="text.primary">{breadcrumbs.currentNiveauName}</Typography>
      </Breadcrumbs>
    );
  };

  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Matières
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
              Ajouter une matière
            </Button>
          )}
        </Stack>
        {breadcrumbs && renderBreadcrumbs()}
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
          <Box
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleFilterClick}
              startIcon={<FontAwesomeIcon icon={faFilter} />}
              sx={{
                minWidth: 120,
                borderRadius: 1,
                transition: theme.transitions.create(['background-color']),
                ...(filterOpen && {
                  bgcolor: 'primary.lighter',
                }),
              }}
            >
              Filtres avancés
            </Button>

            <Popover
              open={filterOpen}
              anchorEl={filterAnchorEl}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              slotProps={{
                paper: {
                  sx: {
                    width: 300,
                    p: 2,
                    boxShadow: theme.customShadows?.z20,
                  },
                },
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Filtres avancés
              </Typography>

              <Stack spacing={2} sx={{ mb: 2 }}>
                <FormControlLabel
                  control={<Switch size="small" color="primary" />}
                  label="Matières actives uniquement"
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Chapitres minimum"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Exercices minimum"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />

                <FormControlLabel
                  control={<Switch size="small" color="primary" />}
                  label="Matières avec chapitres uniquement"
                />
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" size="small" onClick={handleFilterReset}>
                  Réinitialiser
                </Button>
                <Button variant="contained" size="small" onClick={handleFilterClose}>
                  Appliquer
                </Button>
              </Box>
            </Popover>
          </Box>

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={matieres.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  matieres.map((row) => row.id)
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
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={matieres.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        matieres.map((row) => row.id)
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
                    {/* Add filter row below header */}
                    {renderFilterRow()}

                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={4} />
                    ) : (
                      matieres.map((matiere) => (
                        <MatiereItem
                          key={matiere.id}
                          matiere={matiere}
                          selected={table.selected.includes(matiere.id)}
                          onEditClick={() => onEditClick(matiere)}
                          onDeleteClick={() => onDeleteClick(matiere)}
                          onViewClick={() => onViewClick(matiere)}
                          onSelectRow={() => table.onSelectRow(matiere.id)}
                          onViewChapitres={() => onViewChapitres(matiere)}
                          onToggleActive={onToggleActive}
                        />
                      ))
                    )}

                    <TableEmptyRows
                      height={table.dense ? 52 : 72}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, matieres.length)}
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

          <TablePaginationCustom
            count={pagination.total}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={(e, page) => {
              table.onChangePage(e, page);
              onPageChange(page + 1);
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
        title="Supprimer les matières"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> matière
              {table.selected.length > 1 ? 's' : ''} ?
            </Typography>
            <Typography variant="caption" color="error.main">
              Cette action est irréversible et supprimera également tous les chapitres et exercices
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
