import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faTrash,
  faToggleOn,
  faPenToSquare,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  Stack,
  alpha,
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

import { varFade } from 'src/shared/components/animate/variants/fade';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import type { Niveau } from '../../types';

interface NiveauItemProps {
  niveau: Niveau;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: () => void;
  onDeleteClick: (niveau?: Niveau) => void;
  onViewClick: () => void;
  onViewMatieres: () => void;
  onToggleActive?: (niveau: Niveau, active: boolean) => void;
  visibleColumns?: string[]; // Add this prop for column visibility
}

export const NiveauItem: React.FC<NiveauItemProps> = ({
  niveau,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onViewMatieres,
  onToggleActive,
  visibleColumns = ['nom', 'description', 'code', 'dateCreated'], // Default to all columns
}) => {
  const popover = usePopover();

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (onToggleActive) {
      onToggleActive(niveau, event.target.checked);
    }
  };

  const formattedDate = niveau.dateCreated ? fDate(niveau.dateCreated) : 'Non définie';

  return (
    <>
      <TableRow
        component={m.tr}
        variants={varFade().inUp}
        hover
        selected={selected}
        onClick={onViewMatieres}
        sx={{
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create(['background-color']),
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.lighter, 0.08),
          },
          ...(niveau.active === false && {
            opacity: 0.7,
            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.2),
          }),
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {/* Nom */}
        {visibleColumns.includes('nom') && (
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  color: 'primary.main',
                }}
              >
                <FontAwesomeIcon icon={faGraduationCap} size="sm" />
              </Box>
              <div>
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
                    transition: (theme) => theme.transitions.create(['color']),
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                  noWrap
                >
                  {niveau.nom}
                </Link>
                {niveau.active === false && (
                  <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                    Inactif
                  </Typography>
                )}
              </div>
            </Stack>
          </TableCell>
        )}

        {/* Description */}
        {visibleColumns.includes('description') && (
          <TableCell
            sx={{
              whiteSpace: 'nowrap',
              color: 'text.secondary',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {niveau.description}
          </TableCell>
        )}

        {/* Code */}
        {visibleColumns.includes('code') && (
          <TableCell sx={{ whiteSpace: 'nowrap' }}>
            <Typography
              variant="body2"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block',
                bgcolor: 'primary.lighter',
                color: 'primary.dark',
                fontWeight: 'fontWeightMedium',
              }}
            >
              {niveau.code}
            </Typography>
          </TableCell>
        )}

        {/* Date Created */}
        {visibleColumns.includes('dateCreated') && (
          <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {formattedDate}
          </TableCell>
        )}

        {/* Actions */}
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
                  onEditClick();
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
                  onDeleteClick(niveau);
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

            <Tooltip title={niveau.active ? 'Désactiver' : 'Activer'}>
              <Box
                onClick={(e) => e.stopPropagation()}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <Switch
                  size="small"
                  checked={niveau.active !== false}
                  onChange={handleToggleActive}
                  color="success"
                />
              </Box>
            </Tooltip>
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
          onClick={onViewClick}
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
          Voir
        </MenuItem>

        <MenuItem
          onClick={onEditClick}
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
            onDeleteClick(niveau);
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

        <MenuItem
          onClick={() => {
            if (onToggleActive) {
              onToggleActive(niveau, !niveau.active);
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
          {niveau.active ? 'Désactiver' : 'Activer'}
        </MenuItem>
      </CustomPopover>
    </>
  );
};
