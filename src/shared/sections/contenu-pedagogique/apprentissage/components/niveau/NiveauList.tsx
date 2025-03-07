import { m } from 'framer-motion';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faTimes,
  faFilter,
  faSearch,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Table,
  alpha,
  Stack,
  Button,
  Switch,
  Divider,
  Tooltip,
  Popover,
  useTheme,
  TableBody,
  TextField,
  Typography,
  IconButton,
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

import { NiveauItem } from './NiveauItem';
import { SearchBar } from '../common/Searchbar';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';

import type { Niveau, Pagination, FilterParams } from '../../types';

// Modified to include date created column
const TABLE_HEAD = [
  { id: 'nom', label: 'Nom', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'code', label: 'Code', align: 'left' },
  { id: 'dateCreated', label: 'Date de création', align: 'left' },
  { id: '', label: 'Actions', align: 'right' },
];

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

// Grid component for layout
const Grid = ({
  container,
  item,
  children,
  spacing = 0,
  xs,
  sm,
  md,
  lg,
  ...rest
}: {
  container?: boolean;
  item?: boolean;
  children?: React.ReactNode;
  spacing?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  [key: string]: any;
}) => {
  if (container) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          margin: -spacing / 2,
          ...rest.sx,
        }}
        {...rest}
      >
        {children}
      </Box>
    );
  }

  // Convert the size to percentage
  const getWidth = (size?: number) => (size ? `${(size / 12) * 100}%` : undefined);

  return (
    <Box
      sx={{
        padding: spacing / 2,
        flexGrow: 0,
        maxWidth: {
          xs: getWidth(xs),
          sm: getWidth(sm),
          md: getWidth(md),
          lg: getWidth(lg),
        },
        flexBasis: {
          xs: getWidth(xs),
          sm: getWidth(sm),
          md: getWidth(md),
          lg: getWidth(lg),
        },
        ...rest.sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

interface NiveauListProps {
  niveaux: Niveau[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onColumnFilterChange?: (columnId: string, value: string) => void;
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
  onViewMatieres,
  onAddClick,
  onToggleActive,
}) => {
  const confirm = useBoolean();
  const theme = useTheme();
  const [showColumnFilters, setShowColumnFilters] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    nom: '',
    description: '',
    code: '',
    dateCreated: '',
  });

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

  const handleToggleColumnFilters = () => {
    setShowColumnFilters(!showColumnFilters);
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
      code: '',
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

  const notFound = !niveaux.length && !loading;
  const filterOpen = Boolean(filterAnchorEl);

  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Niveaux d&apos;apprentissage
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
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <SearchBar
              filterName={filters.searchTerm || ''}
              onFilterName={onSearchChange}
              placeholder="Rechercher un niveau..."
              hasFilters={Boolean(true)}
              onOpenFilter={handleFilterClick}
              sx={{ flexGrow: 1 }}
            />

            <Tooltip title="Afficher/Masquer les filtres par colonne">
              <Button
                variant="outlined"
                color="primary"
                onClick={handleToggleColumnFilters}
                startIcon={<FontAwesomeIcon icon={faFilter} />}
                sx={{
                  minWidth: 120,
                  borderRadius: 1,
                  transition: theme.transitions.create(['background-color']),
                  ...(showColumnFilters && {
                    bgcolor: 'primary.lighter',
                  }),
                }}
              >
                Filtres
              </Button>
            </Tooltip>

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
                  label="Niveaux actifs uniquement"
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Date de création après"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </InputAdornment>
                    ),
                  }}
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

          {showColumnFilters && (
            <Box sx={{ px: 2, pb: 2 }}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Filtres par colonne
              </Typography>
              <Grid container spacing={2}>
                {TABLE_HEAD.filter((col) => col.id).map(
                  (column) =>
                    column.id && (
                      <Grid item xs={12} sm={6} md={3} key={column.id}>
                        <ColumnFilter
                          columnId={column.id}
                          value={columnFilters[column.id] || ''}
                          onChange={handleColumnFilterChange}
                          placeholder={`Filtrer par ${column.label}`}
                        />
                      </Grid>
                    )
                )}
              </Grid>
            </Box>
          )}

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
                    {table.selected.length} sélectionné{table.selected.length > 1 ? 's' : ''}
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

            <Scrollbar>
              <TableContainer sx={{ position: 'relative', overflow: 'unset', minHeight: 240 }}>
                <Table size={table.dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
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
                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={5} />
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
