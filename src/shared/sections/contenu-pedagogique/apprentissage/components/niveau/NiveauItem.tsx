import React from 'react';
import {
  TableRow,
  TableCell,
  Checkbox,
  Stack,
  Typography,
  IconButton,
  MenuItem,
  Link,
  Box,
} from '@mui/material';
import { useBoolean } from 'src/hooks/use-boolean';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPenToSquare,
  faTrash,
  faEye,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import { Niveau } from '../../types';

interface NiveauItemProps {
  niveau: Niveau;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onViewClick: () => void;
  onViewMatieres: () => void;
}

export const NiveauItem: React.FC<NiveauItemProps> = ({
  niveau,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onViewMatieres,
}) => {
  const confirm = useBoolean();
  const popover = usePopover();

  const handleOpenConfirm = () => {
    popover.onClose();
    confirm.onTrue();
  };

  const handleDelete = () => {
    onDeleteClick();
    confirm.onFalse();
  };

  return (
    <>
      <TableRow hover selected={selected} onClick={onViewMatieres} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <div>
              <Link
                component="button"
                variant="subtitle2"
                color="text.primary"
                onClick={onViewClick}
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                noWrap
              >
                {niveau.nom}
              </Link>
            </div>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{niveau.description}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{niveau.code}</TableCell>

        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            color="default"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>

          <IconButton
            color="default"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              popover.onOpen(e);
            }}
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ paper: { sx: { width: 160 } } }}
      >
        <MenuItem onClick={onViewClick} sx={{ typography: 'body2', py: 1, px: 2.5 }}>
          <FontAwesomeIcon icon={faEye} style={{ marginRight: 8, color: 'text.secondary' }} />
          Voir
        </MenuItem>

        <MenuItem onClick={onEditClick} sx={{ typography: 'body2', py: 1, px: 2.5 }}>
          <FontAwesomeIcon
            icon={faPenToSquare}
            style={{ marginRight: 8, color: 'text.secondary' }}
          />
          Modifier
        </MenuItem>

        <MenuItem
          onClick={handleOpenConfirm}
          sx={{ color: 'error.main', typography: 'body2', py: 1, px: 2.5 }}
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8 }} />
          Supprimer
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content="Êtes-vous sûr de vouloir supprimer ce niveau ?"
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
            onClick={handleDelete}
          >
            Supprimer
          </Box>
        }
      />
    </>
  );
};
