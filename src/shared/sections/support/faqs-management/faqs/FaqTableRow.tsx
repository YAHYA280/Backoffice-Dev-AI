'use client';

import type { IFaqItem } from 'src/contexts/types/faq';

import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Box, Stack, Button, Tooltip, MenuItem } from '@mui/material';

import { useBoolean } from 'src/hooks';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import { ConfirmDialog } from 'src/shared/components/custom-dialog/confirm-dialog';

type Props = {
  row: IFaqItem;
  selected: boolean;
  onSelectRow: () => void;
  onEditRow: () => void;
  onAfficher: () => void;
  statusFilter?: string;
  columns: Array<{ id: string; label: string; width?: number }>;
};

export function FaqTableRow({
  row,
  selected,
  onSelectRow,
  columns,
  onEditRow,
  onAfficher,
  statusFilter = "Tous",
}: Props) {
  const popover = usePopover();
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
            inputProps={{ id: `row-checkbox-${row.id}`, 'aria-label': 'row checkbox' }}
          />
        );
      case 'title':
        return row.title;
      case 'categorie':
        return (
          <Label
            variant="soft"
            sx={{
              ...(row.categorie === 'Compte' && { bgcolor: 'rgb(186, 248, 193)', color: '#22bb33' }),
              ...(row.categorie === 'Facturation' && { bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' }),
              ...(row.categorie === 'Sécurité' && { bgcolor: 'rgba(33, 33, 33, 0.1)', color: '#212121' }),
              ...(!['Compte', 'Facturation', 'Sécurité'].includes(row.categorie) && {
                bgcolor: 'rgba(145, 158, 171, 0.16)',
                color: 'text.secondary',
              }),
            }}
          >
            {row.categorie}
          </Label>
        );
      case 'statut':
        return (
          <Label
            variant="soft"
            sx={{
              ...(row.statut === 'Publié' && { bgcolor: 'rgb(186, 248, 193)', color: '#22bb33' }),
              ...(row.statut === 'Brouillion' && { bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#F44336' }),
              ...(row.statut === 'Archivé' && { bgcolor: '#FF9800', color: '#FFFFFF' }),
              ...(!['Publié', 'Brouillion', 'Archivé'].includes(row.statut) && {
                bgcolor: 'rgba(145, 158, 171, 0.16)',
                color: 'text.secondary',
              }),
            }}
          >
            {row.statut}
          </Label>
        );
      case 'datePublication':
        return dayjs(row.datePublication).format('DD/MM/YYYY');
      case 'actions':
        return (
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Voir détails">
              <IconButton
                color="info"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAfficher();
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.info.lighter || 'rgba(0,0,0,0.08)',
                  },
                }}
              >
                <FontAwesomeIcon icon={faEye} />
              </IconButton>
            </Tooltip>
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
          <TableCell
            key={col.id}
            sx={{
              width: col.width,
              textAlign: col.id === 'actions' ? 'right' : 'left',
            }}
          >
            {renderCellContent(col.id)}
          </TableCell>
        ))}
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onAfficher();
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover .icon': { color: 'primary.main' },
          }}
        >
          <Box
            component={FontAwesomeIcon}
            className="icon"
            icon={faEye}
            sx={{
              mr: 1,
              width: 16,
              height: 16,
              color: 'text.secondary',
              transition: (theme) => theme.transitions.create(['color']),
            }}
          />
          Voir détails
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditRow();
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover .icon': { color: 'primary.main' },
          }}
        >
          <Box
            component={FontAwesomeIcon}
            className="icon"
            icon={faPenToSquare}
            sx={{
              mr: 1,
              width: 16,
              height: 16,
              color: 'text.secondary',
              transition: (theme) => theme.transitions.create(['color']),
            }}
          />
          Modifier
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            confirmDelete.onTrue();
          }}
          sx={{
            color: 'error.main',
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover': {
              backgroundColor: (theme) => theme.palette.error.lighter || 'rgba(0,0,0,0.08)',
            },
          }}
        >
          <Box
            component={FontAwesomeIcon}
            icon={faTrash}
            sx={{ mr: 1, width: 16, height: 16 }}
          />
          Supprimer
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={`Supprimer FAQ : ${row.title}`}
        content="Êtes-vous sûr de vouloir supprimer cette FAQ ?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              toast.success(`FAQ a été supprimée avec succès.`);
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

export default FaqTableRow;
