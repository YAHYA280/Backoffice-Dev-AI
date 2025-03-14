import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faToggleOn, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  Stack,
  alpha,
  Avatar,
  Switch,
  Tooltip,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  Typography,
  IconButton,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { varFade } from 'src/shared/components/animate';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import type { Matiere } from '../../types';

interface MatiereItemProps {
  matiere: Matiere;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: (matiere: Matiere) => void;
  onDeleteClick: (matiere?: Matiere) => void;
  onViewClick: (matiere: Matiere) => void;
  onViewChapitres: (matiere: Matiere) => void;
  onToggleActive?: (matiere: Matiere, active: boolean) => void;
  visibleColumns?: string[];
}

export const MatiereItem: React.FC<MatiereItemProps> = ({
  matiere,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onViewChapitres,
  onToggleActive,
  visibleColumns = ['nom', 'description', 'chapitresCount', 'dateCreated'],
}) => {
  const popover = usePopover();

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (onToggleActive) {
      onToggleActive(matiere, event.target.checked);
    }
  };

  // Format dates if available
  const formattedDate = matiere.dateCreated ? fDate(matiere.dateCreated) : 'Non définie';

  return (
    <>
      <TableRow
        component={m.tr}
        variants={varFade().inUp}
        hover
        selected={selected}
        onClick={() => onViewChapitres(matiere)}
        sx={{
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create(['background-color']),
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.lighter, 0.08),
          },
          ...(matiere.active === false && {
            opacity: 0.7,
            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.2),
          }),
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {visibleColumns.includes('nom') && (
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
              <Box sx={{ ml: 2, flexGrow: 1 }}>
                <Link
                  component="button"
                  variant="subtitle2"
                  color="text.primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewClick(matiere);
                  }}
                  sx={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontWeight: 'fontWeightMedium',
                    transition: (theme) => theme.transitions.create(['color']),
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  noWrap
                >
                  {matiere.nom}
                </Link>
              </Box>
            </Stack>
          </TableCell>
        )}

        {visibleColumns.includes('description') ? (
          <TableCell
            sx={{
              maxWidth: 280,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {matiere.description}
          </TableCell>
        ) : (
          <></>
        )}

        {visibleColumns.includes('chapitresCount') && (
          <TableCell align="center" sx={{ color: 'text.secondary' }}>
            <Typography
              variant="body2"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                bgcolor: (theme) => alpha(theme.palette.primary.lighter, 0.4),
                color: 'primary.dark',
                fontWeight: 'fontWeightMedium',
              }}
            >
              {matiere.chapitresCount || 0}
            </Typography>
          </TableCell>
        )}
        {visibleColumns.includes('dateCreated') && (
          <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {formattedDate}
          </TableCell>
        )}
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Voir détails">
              <IconButton
                color="info"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClick(matiere);
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.info.main, 0.08),
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
                  onEditClick(matiere);
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
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
                  onDeleteClick(matiere);
                }}
                sx={{
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                  },
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>

            {onToggleActive && (
              <Tooltip title={matiere.active ? 'Désactiver' : 'Activer'}>
                <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Switch
                    size="small"
                    checked={matiere.active !== false}
                    onChange={handleToggleActive}
                    color="success"
                  />
                </Box>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ paper: { sx: { width: 160 } } }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onViewClick(matiere);
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover .icon': {
              color: 'primary.main',
            },
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
            onViewChapitres(matiere);
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover .icon': {
              color: 'primary.main',
            },
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
          Voir chapitres
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditClick(matiere);
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover .icon': {
              color: 'primary.main',
            },
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
            onDeleteClick(matiere);
          }}
          sx={{
            color: 'error.main',
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (theme) => theme.transitions.create(['background-color']),
            '&:hover': {
              backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }}
        >
          <Box component={FontAwesomeIcon} icon={faTrash} sx={{ mr: 1, width: 16, height: 16 }} />
          Supprimer
        </MenuItem>

        {onToggleActive && (
          <MenuItem
            onClick={() => {
              if (onToggleActive) {
                onToggleActive(matiere, !matiere.active);
              }
              popover.onClose();
            }}
            sx={{
              typography: 'body2',
              py: 1.5,
              px: 2.5,
              transition: (theme) => theme.transitions.create(['background-color']),
              '&:hover .icon': {
                color: 'success.main',
              },
            }}
          >
            <Box
              component={FontAwesomeIcon}
              className="icon"
              icon={faToggleOn}
              sx={{
                mr: 1,
                width: 16,
                height: 16,
                color: 'text.secondary',
                transition: (theme) => theme.transitions.create(['color']),
              }}
            />
            {matiere.active ? 'Désactiver' : 'Activer'}
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
};
