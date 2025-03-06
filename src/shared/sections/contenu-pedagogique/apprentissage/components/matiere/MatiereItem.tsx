'use client';

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
  Avatar,
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
import { Matiere } from '../../types';

interface MatiereItemProps {
  matiere: Matiere;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onViewClick: () => void;
  onViewChapitres: () => void;
}

export const MatiereItem = ({
  matiere,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onViewChapitres,
}: MatiereItemProps) => {
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
      <TableRow hover selected={selected} onClick={onViewChapitres} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: matiere.couleur,
                width: 36,
                height: 36,
                fontSize: '0.875rem',
              }}
            >
              {matiere.icon}
            </Avatar>
            <div>
              <Link
                component="button"
                variant="subtitle2"
                color="text.primary"
                onClick={onViewClick}
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
                noWrap
              >
                {matiere.nom}
              </Link>
            </div>
          </Stack>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>{matiere.description}</TableCell>

        <TableCell align="center" sx={{ color: 'text.secondary' }}>
          {matiere.chapitresCount}
        </TableCell>

        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <IconButton
            color="default"
            onClick={(e) => {
              e.stopPropagation();
              onEditClick();
            }}
            size="small"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>

          <IconButton
            color="default"
            onClick={(e) => {
              e.stopPropagation();
              popover.onOpen(e);
            }}
            size="small"
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
          <Box
            component={FontAwesomeIcon}
            icon={faEye}
            sx={{ mr: 1, width: 16, height: 16, color: 'text.secondary' }}
          />
          Voir chapitres
        </MenuItem>

        <MenuItem onClick={onEditClick} sx={{ typography: 'body2', py: 1, px: 2.5 }}>
          <Box
            component={FontAwesomeIcon}
            icon={faPenToSquare}
            sx={{ mr: 1, width: 16, height: 16, color: 'text.secondary' }}
          />
          Modifier
        </MenuItem>

        <MenuItem
          onClick={handleOpenConfirm}
          sx={{ color: 'error.main', typography: 'body2', py: 1, px: 2.5 }}
        >
          <Box component={FontAwesomeIcon} icon={faTrash} sx={{ mr: 1, width: 16, height: 16 }} />
          Supprimer
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={`Êtes-vous sûr de vouloir supprimer la matière "${matiere.nom}" ? Cette action supprimera également tous les chapitres et exercices associés.`}
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
