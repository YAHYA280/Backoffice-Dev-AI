import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faUndo,
  faTrash,
  faClock,
  faUsers,
  faTrophy,
  faToggleOn,
  faPenToSquare,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  Chip,
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

import { STATUT_OPTIONS, DIFFICULTE_OPTIONS } from '../constants';

import type { Challenge } from '../types';

interface ChallengeItemProps {
  challenge: Challenge;
  selected: boolean;
  onSelectRow: () => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onViewClick: () => void;
  onRestoreClick?: () => void;
  onToggleActive?: (challenge: Challenge, active: boolean) => void;
  onResetClick?: () => void;
  visibleColumns?: string[];
}

export const ChallengeItem = ({
  challenge,
  selected,
  onSelectRow,
  onEditClick,
  onDeleteClick,
  onViewClick,
  onRestoreClick,
  onToggleActive,
  onResetClick,
  visibleColumns = [
    'titre',
    'statut',
    'niveauNom',
    'niveauDifficulte',
    'datePublication',
    'participantsCount',
    'tentativesMax',
  ],
}: ChallengeItemProps) => {
  const popover = usePopover();

  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === challenge.statut) || STATUT_OPTIONS[0];

  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === challenge.niveauDifficulte) ||
    DIFFICULTE_OPTIONS[0];

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (onToggleActive) {
      onToggleActive(challenge, event.target.checked);
    }
  };

  const formatDate = (date: string) => {
    try {
      return fDate(new Date(date));
    } catch (error) {
      return 'Date invalide';
    }
  };

  const isArchived = challenge.statut === 'Archivé';
  const participantsCount = challenge.participantsCount || 0;

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
          transition: (theme) => theme.transitions.create(['background-color']),
          '&:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.lighter, 0.08),
          },
          ...(isArchived && {
            opacity: 0.6,
            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.3),
          }),
          ...(!challenge.active &&
            !isArchived && {
              opacity: 0.7,
              bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.1),
            }),
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {visibleColumns.includes('titre') && (
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: (theme) =>
                    isArchived
                      ? alpha(theme.palette.grey[500], 0.2)
                      : alpha(theme.palette.primary.main, 0.08),
                  color: isArchived ? 'text.disabled' : 'primary.main',
                }}
              >
                <FontAwesomeIcon icon={faTrophy} />
              </Avatar>
              <Box sx={{ ml: 2, flexGrow: 1 }}>
                <Link
                  component="button"
                  variant="subtitle2"
                  color={isArchived ? 'text.disabled' : 'text.primary'}
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
                      color: isArchived ? 'text.secondary' : 'primary.main',
                    },
                  }}
                  noWrap
                >
                  {challenge.titre}
                </Link>
                {challenge.questionsCount && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {challenge.questionsCount} question{challenge.questionsCount > 1 ? 's' : ''}
                  </Typography>
                )}
              </Box>
            </Stack>
          </TableCell>
        )}

        {visibleColumns.includes('description') && (
          <TableCell
            sx={{
              maxWidth: 280,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {challenge.description}
          </TableCell>
        )}

        {visibleColumns.includes('statut') && (
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
        )}

        {visibleColumns.includes('niveauNom') && (
          <TableCell>
            {challenge.niveauNom ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                <FontAwesomeIcon
                  icon={faGraduationCap}
                  style={{ color: 'text.secondary', fontSize: '0.75rem' }}
                />
                <Typography variant="body2">{challenge.niveauNom}</Typography>
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Tous niveaux
              </Typography>
            )}
          </TableCell>
        )}

        {visibleColumns.includes('niveauDifficulte') && (
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
        )}

        {visibleColumns.includes('dateCreation') && (
          <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {formatDate(challenge.dateCreation)}
          </TableCell>
        )}

        {visibleColumns.includes('datePublication') && (
          <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {formatDate(challenge.datePublication)}
          </TableCell>
        )}

        {visibleColumns.includes('dateFin') && challenge.dateFin && (
          <TableCell sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {formatDate(challenge.dateFin)}
          </TableCell>
        )}

        {visibleColumns.includes('tentativesMax') && (
          <TableCell align="center">
            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
              <FontAwesomeIcon
                icon={faClock}
                style={{ color: 'text.secondary', fontSize: '0.75rem' }}
              />
              <Typography variant="body2">
                {challenge.tentativesMax === -1 ? '∞' : challenge.tentativesMax}
              </Typography>
            </Stack>
          </TableCell>
        )}

        {visibleColumns.includes('participantsCount') && (
          <TableCell align="center">
            <Typography
              variant="body2"
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: (theme) => alpha(theme.palette.info.lighter, 0.4),
                color: 'info.dark',
                fontWeight: 'fontWeightMedium',
              }}
            >
              <FontAwesomeIcon icon={faUsers} style={{ fontSize: '0.75rem' }} />
              {participantsCount}
            </Typography>
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

            {!isArchived && (
              <>
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
                      onDeleteClick();
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

                {onResetClick && participantsCount > 0 && (
                  <Tooltip title="Réinitialiser les participations">
                    <IconButton
                      color="warning"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onResetClick();
                      }}
                      sx={{
                        transition: (theme) => theme.transitions.create(['background-color']),
                        '&:hover': {
                          backgroundColor: (theme) => alpha(theme.palette.warning.main, 0.08),
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faUndo} />
                    </IconButton>
                  </Tooltip>
                )}

                {onToggleActive && (
                  <Tooltip title={challenge.active ? 'Désactiver' : 'Activer'}>
                    <Box
                      onClick={(e) => e.stopPropagation()}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <Switch
                        size="small"
                        checked={challenge.active}
                        onChange={handleToggleActive}
                        color="success"
                      />
                    </Box>
                  </Tooltip>
                )}
              </>
            )}

            {isArchived && onRestoreClick && (
              <Tooltip title="Restaurer">
                <IconButton
                  color="success"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestoreClick();
                  }}
                  sx={{
                    transition: (theme) => theme.transitions.create(['background-color']),
                    '&:hover': {
                      backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
                    },
                  }}
                >
                  <FontAwesomeIcon icon={faUndo} />
                </IconButton>
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

        {!isArchived && (
          <>
            <MenuItem
              onClick={() => {
                popover.onClose();
                onEditClick();
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
                onDeleteClick();
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
              <Box
                component={FontAwesomeIcon}
                icon={faTrash}
                sx={{ mr: 1, width: 16, height: 16 }}
              />
              Supprimer
            </MenuItem>

            {onResetClick && participantsCount > 0 && (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  onResetClick();
                }}
                sx={{
                  typography: 'body2',
                  py: 1.5,
                  px: 2.5,
                  transition: (theme) => theme.transitions.create(['background-color']),
                  '&:hover .icon': {
                    color: 'warning.main',
                  },
                }}
              >
                <Box
                  component={FontAwesomeIcon}
                  className="icon"
                  icon={faUndo}
                  sx={{
                    mr: 1,
                    width: 16,
                    height: 16,
                    color: 'text.secondary',
                    transition: (theme) => theme.transitions.create(['color']),
                  }}
                />
                Réinitialiser
              </MenuItem>
            )}

            {onToggleActive && (
              <MenuItem
                onClick={() => {
                  if (onToggleActive) {
                    onToggleActive(challenge, !challenge.active);
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
                {challenge.active ? 'Désactiver' : 'Activer'}
              </MenuItem>
            )}
          </>
        )}

        {isArchived && onRestoreClick && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              onRestoreClick();
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
              icon={faUndo}
              sx={{
                mr: 1,
                width: 16,
                height: 16,
                color: 'text.secondary',
                transition: (theme) => theme.transitions.create(['color']),
              }}
            />
            Restaurer
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
};

export default ChallengeItem;
