'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faFileAlt,
  faToggleOn,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  Chip,
  alpha,
  Stack,
  Avatar,
  Switch,
  Tooltip,
  TableRow,
  Checkbox,
  MenuItem,
  useTheme,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate';
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
  onToggleActive?: (exercice: Exercice, active: boolean) => void;
}

export const ExerciceItem = ({
  exercice,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onToggleActive,
}: ExerciceItemProps) => {
  const popover = usePopover();
  const theme = useTheme();

  // Find status option based on exercice.statut
  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === exercice.statut) || STATUT_OPTIONS[0];

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (onToggleActive) {
      onToggleActive(exercice, event.target.checked);
    }
  };

  // Check if exercice is active based on its status
  const isActive = exercice.statut !== 'Inactif';

  return (
    <>
      <TableRow
        component={m.tr}
        variants={varFade().inUp}
        hover
        selected={selected}
        onClick={onViewClick}
        sx={{
          cursor: 'pointer',
          transition: theme.transitions.create(['background-color']),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.lighter, 0.08),
          },
          ...(!isActive && {
            opacity: 0.7,
            bgcolor: alpha(theme.palette.action.disabledBackground, 0.2),
          }),
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha(statutOption.bgColor, 0.2),
                color: statutOption.color,
                fontSize: '0.875rem',
              }}
            >
              <FontAwesomeIcon icon={faFileAlt} size="sm" />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Link
                component="button"
                variant="subtitle2"
                color="text.primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClick();
                }}
                sx={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontWeight: 'fontWeightMedium',
                  transition: (t) => t.transitions.create(['color']),
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
                noWrap
              >
                {exercice.titre}
              </Link>
              {!isActive && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  Inactif
                </Typography>
              )}
            </Box>
          </Stack>
        </TableCell>

        <TableCell
          sx={{
            maxWidth: 280,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: 'text.secondary',
          }}
        >
          {exercice.description}
        </TableCell>

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
          {exercice.ressources && exercice.ressources.length > 0 ? (
            <Stack direction="row" spacing={0.5} flexWrap="wrap">
              {exercice.ressources.map((ressource, index) => (
                <Chip
                  key={index}
                  label={ressource}
                  size="small"
                  sx={{
                    my: 0.25,
                    bgcolor: alpha(theme.palette.info.lighter, 0.5),
                    color: 'text.primary',
                  }}
                />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Aucune
            </Typography>
          )}
        </TableCell>

        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Voir détails">
              <IconButton
                color="info"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClick();
                }}
                sx={{
                  transition: (t) => t.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.info.main, 0.08),
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
                  onEditClick();
                }}
                sx={{
                  transition: (t) => t.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
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
                  onDeleteClick();
                }}
                sx={{
                  transition: theme.transitions.create(['background-color']),
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                  },
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>

            {onToggleActive && (
              <Tooltip title={isActive ? 'Désactiver' : 'Activer'}>
                <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Switch
                    size="small"
                    checked={isActive}
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
            onViewClick();
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: theme.transitions.create(['background-color']),
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
              transition: theme.transitions.create(['color']),
            }}
          />
          Voir détails
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditClick();
          }}
          sx={{
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (t) => t.transitions.create(['background-color']),
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
              transition: (t) => t.transitions.create(['color']),
            }}
          />
          Modifier
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onDeleteClick();
          }}
          sx={{
            color: 'error.main',
            typography: 'body2',
            py: 1.5,
            px: 2.5,
            transition: (t) => t.transitions.create(['background-color']),
            '&:hover': {
              backgroundColor: (t) => alpha(t.palette.error.main, 0.08),
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
                onToggleActive(exercice, !isActive);
              }
              popover.onClose();
            }}
            sx={{
              typography: 'body2',
              py: 1.5,
              px: 2.5,
              transition: theme.transitions.create(['background-color']),
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
                transition: (t) => t.transitions.create(['color']),
              }}
            />
            {isActive ? 'Désactiver' : 'Activer'}
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
};

export default ExerciceItem;
