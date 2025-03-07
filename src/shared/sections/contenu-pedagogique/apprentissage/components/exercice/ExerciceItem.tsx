'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrash,
  faInfoCircle,
  faPenToSquare,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  Chip,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { STATUT_OPTIONS } from '../../types';

import type { Exercice } from '../../types';

interface ExerciceItemProps {
  exercice: Exercice;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onViewClick: () => void;
}

export const ExerciceItem = ({
  exercice,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
}: ExerciceItemProps) => {
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

  // Find status option based on exercice.statut
  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === exercice.statut) || STATUT_OPTIONS[0];

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Link
            component="button"
            variant="subtitle2"
            color="text.primary"
            onClick={onViewClick}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
            noWrap
          >
            {exercice.titre}
          </Link>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>{exercice.description}</TableCell>

        <TableCell>
          <Chip
            label={statutOption.label}
            size="small"
            sx={{
              backgroundColor: statutOption.bgColor,
              color: statutOption.color,
            }}
          />
        </TableCell>

        <TableCell>
          {exercice.ressources.map((ressource, index) => (
            <React.Fragment key={index}>
              {index > 0 && ', '}
              {ressource}
            </React.Fragment>
          ))}
        </TableCell>

        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <IconButton color="default" onClick={onEditClick} size="small">
            <FontAwesomeIcon icon={faPenToSquare} />
          </IconButton>

          <IconButton color="default" onClick={popover.onOpen} size="small">
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
            icon={faInfoCircle}
            sx={{ mr: 1, width: 16, height: 16, color: 'text.secondary' }}
          />
          Détails
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
        content={`Êtes-vous sûr de vouloir supprimer l'exercice "${exercice.titre}" ?`}
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
