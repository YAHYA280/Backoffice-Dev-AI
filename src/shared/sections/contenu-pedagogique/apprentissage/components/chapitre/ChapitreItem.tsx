'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faPenToSquare,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  Chip,
  Avatar,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { DIFFICULTE_OPTIONS } from '../../types';

import type { Chapitre } from '../../types';

interface ChapitreItemProps {
  chapitre: Chapitre;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onViewClick: () => void;
  onViewExercices: () => void;
}

export const ChapitreItem = ({
  chapitre,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onViewExercices,
}: ChapitreItemProps) => {
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

  // Find difficulty option based on chapitre.difficulte
  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === chapitre.difficulte) ||
    DIFFICULTE_OPTIONS[0];

  return (
    <>
      <TableRow hover selected={selected} onClick={onViewExercices} sx={{ cursor: 'pointer' }}>
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell align="center">
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: '#E9F2FF',
              color: '#2065D1',
              fontSize: '0.875rem',
              margin: '0 auto',
            }}
          >
            {chapitre.ordre}
          </Avatar>
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
            {chapitre.nom}
          </Link>
        </TableCell>

        <TableCell sx={{ color: 'text.secondary' }}>{chapitre.description}</TableCell>

        <TableCell>
          <Chip
            label={difficulteOption.label}
            size="small"
            sx={{
              backgroundColor: difficulteOption.bgColor,
              color: difficulteOption.color,
            }}
          />
        </TableCell>

        <TableCell align="center">{chapitre.exercicesCount}</TableCell>

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
          Voir exercices
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
        content={`Êtes-vous sûr de vouloir supprimer le chapitre "${chapitre.nom}" ? Cette action supprimera également tous les exercices associés.`}
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
