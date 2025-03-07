'use client';

import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box, Card, Table, TableBody, Typography, TableContainer } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
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

import { ChapitreItem } from './ChapitreItem';
import { SearchBar } from '../common/Searchbar';
import { TableSkeletonLoader } from '../common/TableSkeletonLoader';

import type { Chapitre, Pagination, FilterParams } from '../../types';

const TABLE_HEAD = [
  { id: 'ordre', label: 'Ordre', align: 'center', width: 80 },
  { id: 'nom', label: 'Chapitre', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'difficulte', label: 'Difficulté', align: 'left', width: 120 },
  { id: 'exercicesCount', label: 'Exercices', align: 'center', width: 100 },
  { id: '', label: 'Actions', align: 'right', width: 100 },
];

interface ChapitreListProps {
  chapitres: Chapitre[];
  loading: boolean;
  pagination: Pagination;
  filters: FilterParams;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearchChange: (searchTerm: string) => void;
  onEditClick: (chapitre: Chapitre) => void;
  onDeleteClick: (chapitre: Chapitre) => void;
  onViewClick: (chapitre: Chapitre) => void;
  onDeleteRows?: (selectedRows: string[]) => void;
  onViewExercices: (chapitre: Chapitre) => void;
}

export const ChapitreList = ({
  chapitres,
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
  onViewExercices,
}: ChapitreListProps) => {
  const confirm = useBoolean();

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

  const notFound = !chapitres.length && !loading;

  return (
    <>
      <Card>
        <Box sx={{ p: 2, pb: 1 }}>
          <SearchBar
            filterName={filters.searchTerm || ''}
            onFilterName={onSearchChange}
            placeholder="Rechercher un chapitre..."
          />
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
                  rowCount={chapitres.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      chapitres.map((row) => row.id)
                    )
                  }
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
            Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> chapitre
            {table.selected.length > 1 ? 's' : ''} ? Cette action supprimera également tous les
            exercices associés.
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
