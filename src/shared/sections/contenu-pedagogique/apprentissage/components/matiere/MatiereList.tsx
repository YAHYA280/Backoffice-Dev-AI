'use client';

import React from 'react';
// Import table components from Minimals
import {
  useTable,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  Checkbox,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { Matiere, FilterParams, Pagination } from '../../types';
import { MatiereItem } from './MatiereItem';
import { SearchBar } from '../common/Searchbar';
import { EmptyContent } from '../common/EmptyContent';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';

const TABLE_HEAD = [
  { id: 'nom', label: 'Matière', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'chapitresCount', label: 'Chapitres', align: 'center' },
  { id: '', label: 'Actions', align: 'right' },
];

interface MatiereListProps {
  matieres: Matiere[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onEditClick: (matiere: Matiere) => void;
  onDeleteClick: (matiere: Matiere) => void;
  onViewClick: (matiere: Matiere) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onViewChapitres: (matiere: Matiere) => void;
}

export const MatiereList = ({
  matieres,
  loading,
  pagination,
  filters,
  onPageChange,
  onLimitChange,
  onSearchChange,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onDeleteRows,
  onViewChapitres,
}: MatiereListProps) => {
  const confirm = useBoolean();

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

  const notFound = !matieres.length && !loading;

  return (
    <>
      <Card>
        <Box sx={{ p: 2, pb: 1 }}>
          <SearchBar
            filterName={filters.searchTerm || ''}
            onFilterName={onSearchChange}
            placeholder="Rechercher une matière..."
          />
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
                <Typography variant="subtitle1">
                  {table.selected.length} sélectionné{table.selected.length > 1 ? 's' : ''}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {/* Delete action button */}
                  {onDeleteRows && (
                    <Box
                      component="button"
                      sx={{
                        p: '6px 8px',
                        bgcolor: 'error.main',
                        borderRadius: 1,
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                      onClick={handleOpenConfirm}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Supprimer
                    </Box>
                  )}
                </Box>
              </Box>
            }
          />

          <Scrollbar>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
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
                />

                <TableBody>
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
                      />
                    ))
                  )}

                  <TableEmptyRows
                    height={table.dense ? 52 : 72}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, matieres.length)}
                  />

                  {notFound && <TableNoData notFound={notFound} />}
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
            // table.onChangeRowsPerPage(e);
            onLimitChange(parseInt(e.target.value, 10));
          }}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>

      {/* Confirmation dialog for bulk delete */}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> matière
            {table.selected.length > 1 ? 's' : ''} ?
          </>
        }
        action={
          <Box
            component="button"
            sx={{
              p: '8px 16px',
              bgcolor: 'error.main',
              borderRadius: 1,
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'error.dark' },
            }}
            onClick={handleDeleteRows}
          >
            Supprimer
          </Box>
        }
      />
    </>
  );
};
