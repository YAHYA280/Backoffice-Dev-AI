'use client';

import type { ICategoryItem } from 'src/shared/_mock/_categories';

import React from 'react';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import { Stack, Button, Tooltip, TableRow, Checkbox, TableCell, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog/confirm-dialog';

type Props = {
  row: ICategoryItem;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  columns: Array<{ id: string; label: string; width?: number }>;
};

export function CategoryTableRow({ row, selected, onSelectRow, onEditRow, columns }: Props) {
  const confirmDelete = useBoolean();

  const renderCellContent = (colId: string) => {
    switch (colId) {
      case 'select':
        return (
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
            inputProps={{ 'aria-label': 'row checkbox' }}
          />
        );
      case 'title':
        return row.title;
      case 'description':
        return row.description;
      case 'numberFaq':
        return row.numberFaq;
      case 'datePublication':
        return dayjs(row.datePublication).format('DD/MM/YYYY');
      case 'actions':
        return (
          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
            <Tooltip title="Modifier">
              <IconButton
                color="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRow();
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.primary.lighter || 'rgba(0,0,0,0.08)',
                  },
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Supprimer">
              <IconButton
                color="error"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  confirmDelete.onTrue();
                }}
                sx={{
                  color: 'error.main',
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.error.lighter || 'rgba(0,0,0,0.08)',
                  },
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      default:
        return (row as any)[colId];
    }
  };

  return (
    <>
      <TableRow hover selected={selected} tabIndex={-1}>
        {columns.map((col) => (
          <TableCell key={col.id} sx={{ width: col.width }}>
            {renderCellContent(col.id)}
          </TableCell>
        ))}
      </TableRow>
      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={`Supprimer la catégorie : ${row.title}`}
        content="Êtes-vous sûr de vouloir supprimer cette catégorie ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              toast.success(`Catégorie supprimée avec succès.`);
              confirmDelete.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </>
  );
}

export default CategoryTableRow;