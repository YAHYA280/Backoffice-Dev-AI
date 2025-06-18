'use client';

import type{ Chapter, ChapterList } from 'src/types/chapter';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash, faToggleOn, faPenToSquare } from '@fortawesome/free-solid-svg-icons';

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
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import { DIFFICULTE_OPTIONS } from '../../types';


interface ChapitreItemProps {
  chapitre: ChapterList;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: (chapitre: Chapter) => void;
  onDeleteClick: (chapitre?: Chapter) => void;
  onViewClick: (chapitre: Chapter) => void;
  onViewExercices: (chapitre: Chapter) => void;
  onToggleActive?: (chapitre: Chapter, active: boolean) => void;
  visibleColumns?: string[];

}

const ChapitreItem = ({
  chapitre,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onViewExercices,
  onToggleActive,
  visibleColumns = ['ordre', 'nom', 'description', 'difficulte', 'exercicesCount'],
}: ChapitreItemProps) => {
  const popover = usePopover();

  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === chapitre.difficulty) ||
    DIFFICULTE_OPTIONS[0];

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (onToggleActive) {
      onToggleActive(chapitre, event.target.checked);
    }
  };

  return (
    <>
      <TableRow
        component={m.tr}
        variants={varFade().inUp}
        hover
        selected={selected}
        onClick={() => onViewExercices(chapitre)}
        sx={{
          cursor: 'pointer',
          transition: (theme) => theme.transitions.create(['background-color']),
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.lighter, 0.08),
          },
          ...(chapitre.active === false && {
            opacity: 0.7,
            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.2),
          }),
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        {visibleColumns.includes('ordre') && (
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
              {chapitre.order}
            </Avatar>
          </TableCell>
        )}
        {visibleColumns.includes('nom') && (
          <TableCell>
            <Link
              component="button"
              variant="subtitle2"
              color="text.primary"
              onClick={(e) => {
                e.stopPropagation();
                onViewClick(chapitre);
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
              {chapitre.name}
            </Link>
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
            {chapitre.description}
          </TableCell>
        ) : (
          <></>
        )}
        {visibleColumns.includes('difficulte') ? (
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
        ) : (
          <></>
        )}

        {visibleColumns.includes('exercicesCount') ? (
          <TableCell align="center">
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
              {/* {chapitre.exercicesCount || 0} */}
              {0}
            </Typography>
          </TableCell>
        ) : (
          <></>
        )}
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
            <Tooltip title="Voir détails">
              <IconButton
                color="info"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewClick(chapitre);
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
                  onEditClick(chapitre);
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
                  onDeleteClick(chapitre);
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

            {onToggleActive ? (
              <Tooltip title={chapitre.active !== false ? 'Désactiver' : 'Activer'}>
                <Box
                  onClick={(e) => e.stopPropagation()}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Switch
                    size="small"
                    checked={chapitre.active !== false}
                    onChange={handleToggleActive}
                    color="success"
                  />
                </Box>
              </Tooltip>
            ) : (
              <></>
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
            onViewClick(chapitre);
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
            onViewExercices(chapitre);
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
          Voir exercices
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEditClick(chapitre);
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
            onDeleteClick(chapitre);
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

        {onToggleActive ? (
          <MenuItem
            onClick={() => {
              if (onToggleActive) {
                onToggleActive(chapitre, !(chapitre.active !== false));
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
            {chapitre.active !== false ? 'Désactiver' : 'Activer'}
          </MenuItem>
        ) : (
          <></>
        )}
      </CustomPopover>
    </>
  );
};

export default ChapitreItem;
