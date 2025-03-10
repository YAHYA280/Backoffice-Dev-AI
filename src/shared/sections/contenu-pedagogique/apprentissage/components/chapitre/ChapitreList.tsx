'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faFilter, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Table,
  alpha,
  Stack,
  Button,
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
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';
import { DIFFICULTE_OPTIONS } from '../../types';

import type { Chapitre, Pagination, FilterParams } from '../../types';

const TABLE_HEAD = [
  { id: 'ordre', label: 'Ordre', align: 'center', width: 80 },
  { id: 'nom', label: 'Chapitre', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'difficulte', label: 'Difficulté', align: 'left', width: 120 },
  { id: 'exercicesCount', label: 'Exercices', align: 'center', width: 100 },
  { id: '', label: 'Actions', align: 'right', width: 100 },
];

// Column Filter Component
interface ColumnFilterProps {
  columnId: string;
  value: string;
  onChange: (columnId: string, value: string) => void;
  placeholder?: string;
}

const ColumnFilter = ({ columnId, value, onChange, placeholder }: ColumnFilterProps) => {
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
}: ChapitreListProps) => {
  const confirm = useBoolean();
  const theme = useTheme();

  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({
    ordre: '',
    nom: '',
    description: '',
    difficulte: '',
    exercicesCount: '',
  });

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

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterReset = () => {
    setColumnFilters({
      ordre: '',
      nom: '',
      description: '',
      difficulte: '',
      exercicesCount: '',
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

  const notFound = !chapitres.length && !loading;
  const filterOpen = Boolean(filterAnchorEl);

  return (
    <MotionContainer>
      <m.div variants={varFade().inUp}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Chapitres
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
              Ajouter un chapitre
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
                <FormControl fullWidth size="small">
                  <InputLabel>Difficulté</InputLabel>
                  <Select label="Difficulté" value="" onChange={() => {}}>
                    <MenuItem value="">Toutes les difficultés</MenuItem>
                    {DIFFICULTE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  label="Exercices minimum"
                  type="number"
                  InputProps={{
                    inputProps: { min: 0 },
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Ordre minimum"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                />

                <TextField
                  fullWidth
                  size="small"
                  label="Ordre maximum"
                  type="number"
                  InputProps={{
                    inputProps: { min: 1 },
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

          {/* Column Filters - Always visible */}
          <Box sx={{ px: 2, pb: 2 }}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Recherche par colonne
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 2,
              }}
            >
              {TABLE_HEAD.filter((col) => col.id).map(
                (column) =>
                  column.id && (
                    <ColumnFilter
                      key={column.id}
                      columnId={column.id}
                      value={columnFilters[column.id] || ''}
                      onChange={handleColumnFilterChange}
                      placeholder={`Rechercher par ${column.label}`}
                    />
                  )
              )}
            </Box>
          </Box>

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
                    {table.selected.length} sélectionné{table.selected.length > 1 ? 's' : ''}
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
                    {loading ? (
                      <TableSkeletonLoader rows={5} columns={6} />
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
