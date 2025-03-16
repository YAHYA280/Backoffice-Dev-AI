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

import { Challenge, ChallengeStatus } from '../types';

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
    'nom',
    'description',
    'statut',
    'datePublication',
    'dateMiseAJour',
    'difficulte',
    'participantsCount',
  ],
}: ChallengeItemProps) => {
  const popover = usePopover();

  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === challenge.statut) || STATUT_OPTIONS[0];

  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === challenge.difficulte) ||
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

  const isDeleted = challenge.statut === ChallengeStatus.SUPPRIME;
  const participantsCount = challenge.participantsCount || 0;
  const questionsCount = challenge.questionsCount || 0;
  const nbTentatives = challenge.nbTentatives || 1;

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
          ...(isDeleted && {
            opacity: 0.6,
            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.3),
          }),
          ...(!challenge.active &&
            !isDeleted && {
              opacity: 0.7,
              bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.1),
            }),
        }}
      >
        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {visibleColumns.includes('nom') && (
          <TableCell>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: (theme) =>
                    isDeleted
                      ? alpha(theme.palette.grey[500], 0.2)
                      : alpha(theme.palette.primary.main, 0.08),
                  color: isDeleted ? 'text.disabled' : 'primary.main',
                }}
              >
                <FontAwesomeIcon icon={faTrophy} size="sm" />
              </Avatar>
              <Box sx={{ ml: 1, flexGrow: 1 }}>
                <Typography
                  variant="subtitle2"
                  color={isDeleted ? 'text.disabled' : 'text.primary'}
                  noWrap
                  sx={{
                    fontWeight: 'medium',
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {challenge.nom}
                </Typography>
                {questionsCount > 0 && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {questionsCount} question{questionsCount > 1 ? 's' : ''}
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
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'text.secondary',
            }}
          >
            {challenge.description}
          </TableCell>
        )}

        {visibleColumns.includes('statut') && (
          <TableCell align="center">
            <Chip
              label={statutOption.label}
              size="small"
              sx={{
                backgroundColor: statutOption.bgColor,
                color: statutOption.color,
                fontWeight: 'medium',
                px: 1,
              }}
            />
          </TableCell>
        )}

        {visibleColumns.includes('datePublication') && (
          <TableCell align="center" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {formatDate(challenge.datePublication)}
          </TableCell>
        )}

        {visibleColumns.includes('dateMiseAJour') && (
          <TableCell align="center" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
            {challenge.dateMiseAJour ? formatDate(challenge.dateMiseAJour) : '-'}
          </TableCell>
        )}

        {visibleColumns.includes('difficulte') && (
          <TableCell align="center">
            <Chip
              label={difficulteOption.label}
              size="small"
              sx={{
                backgroundColor: difficulteOption.bgColor,
                color: difficulteOption.color,
                fontWeight: 'medium',
                px: 1,
              }}
            />
          </TableCell>
        )}

        {visibleColumns.includes('nbTentatives') && (
          <TableCell align="center">
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={faClock}
                style={{ marginRight: 4, fontSize: '0.75rem', color: 'text.secondary' }}
              />
              <Typography variant="body2">{nbTentatives === -1 ? '∞' : nbTentatives}</Typography>
            </Box>
          </TableCell>
        )}

        {visibleColumns.includes('participantsCount') && (
          <TableCell align="center">
            <Typography
              variant="body2"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: 'info.dark',
                fontWeight: 'medium',
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: (theme) => alpha(theme.palette.info.main, 0.1),
                  color: 'info.main',
                  mr: 0.5,
                }}
              >
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: '0.65rem' }} />
              </Box>
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

            {!isDeleted && (
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
                  <Box
                    component="span"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Switch
                      size="small"
                      checked={challenge.active}
                      onChange={handleToggleActive}
                      color="success"
                      sx={{ transform: 'scale(0.8)' }}
                    />
                  </Box>
                )}
              </>
            )}

            {isDeleted && onRestoreClick && (
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

        {!isDeleted && (
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

        {isDeleted && onRestoreClick && (
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
