import React from 'react';
import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faCog,
  faUndo,
  faTrash,
  faClock,
  faUsers,
  faTrophy,
  faToggleOn,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
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

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { varFade } from 'src/shared/components/animate';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { ChallengeStatus } from '../types';
import { STATUT_OPTIONS, DIFFICULTE_OPTIONS } from '../constants';

import type { Challenge } from '../types';

// Define column widths to match the header
const COLUMN_WIDTHS = {
  select: 50,
  nom: 200,
  description: 300,
  statut: 120,
  datePublication: 150,
  dateMiseAJour: 150,
  difficulte: 120,
  nbTentatives: 100,
  participantsCount: 120,
  actions: 150,
};

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
  onTrophyConfigClick?: (challenge: Challenge) => void;
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
  onTrophyConfigClick,
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
  const router = useRouter();
  const navigate = (path: string) => {
    router.push(path);
  };
  
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

  const handleTrophyConfigClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(paths.dashboard.contenu_pedagogique.trophies(challenge.id));
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

  // Helper function to get cell styling based on column ID
  const getCellProps = (columnId: string, align: 'left' | 'center' | 'right' = 'left') => ({
    align,
    sx: {
      width: COLUMN_WIDTHS[columnId as keyof typeof COLUMN_WIDTHS],
      minWidth: COLUMN_WIDTHS[columnId as keyof typeof COLUMN_WIDTHS],
      maxWidth: COLUMN_WIDTHS[columnId as keyof typeof COLUMN_WIDTHS],
    },
  });

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
          ...(isDeleted ? {
            opacity: 0.6,
            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.3),
          } : {}),
          ...((!challenge.active && !isDeleted) ? {
              opacity: 0.7,
              bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.1),
            } : {}),
        }}
      >
        <TableCell
          padding="checkbox"
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: COLUMN_WIDTHS.select,
            minWidth: COLUMN_WIDTHS.select,
            maxWidth: COLUMN_WIDTHS.select,
          }}
        >
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        {visibleColumns.includes('nom') ? (
          <TableCell {...getCellProps('nom')}>
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
                  flexShrink: 0, // Prevent avatar from shrinking
                }}
              >
                <FontAwesomeIcon icon={faTrophy} size="sm" />
              </Avatar>
              <Box sx={{ ml: 1, flexGrow: 1, maxWidth: 'calc(100% - 40px)' }}>
                <Tooltip title={challenge.nom} placement="top-start">
                  <Typography
                    variant="subtitle2"
                    color={isDeleted ? 'text.disabled' : 'text.primary'}
                    noWrap
                    sx={{
                      fontWeight: 'medium',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {challenge.nom}
                  </Typography>
                </Tooltip>
                <ConditionalComponent isValid = {questionsCount > 0}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {questionsCount} question{questionsCount > 1 ? 's' : ''}
                  </Typography>
                </ConditionalComponent>
              </Box>
            </Stack>
          </TableCell>
        ) : (
          <></>
        )}

        {visibleColumns.includes('description') ? (
          <TableCell
            {...getCellProps('description')}
            sx={{
              ...getCellProps('description').sx,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: 'text.secondary',
            }}
          >
            <Tooltip title={challenge.description} placement="top-start">
              <Box component="span">{challenge.description}</Box>
            </Tooltip>
          </TableCell>
        ) : (
          <></>
        )}

        {visibleColumns.includes('statut') ? (
          <TableCell {...getCellProps('statut', 'center')}>
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
        ) : (
          <></>
        )}

        {visibleColumns.includes('datePublication') ? (
          <TableCell
            {...getCellProps('datePublication', 'center')}
            sx={{
              ...getCellProps('datePublication').sx,
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {formatDate(challenge.datePublication)}
          </TableCell>
        ) : (
          <></>
        )}

        {visibleColumns.includes('dateMiseAJour') ? (
          <TableCell
            {...getCellProps('dateMiseAJour', 'center')}
            sx={{
              ...getCellProps('dateMiseAJour').sx,
              whiteSpace: 'nowrap',
              color: 'text.secondary',
            }}
          >
            {challenge.dateMiseAJour ? formatDate(challenge.dateMiseAJour) : '-'}
          </TableCell>
        ) : (
          <></>
        )}

        {visibleColumns.includes('difficulte') ? (
          <TableCell {...getCellProps('difficulte', 'center')}>
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
        ) : (
          <></>
        )}

        {visibleColumns.includes('nbTentatives') ? (
          <TableCell {...getCellProps('nbTentatives', 'center')}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesomeIcon
                icon={faClock}
                style={{ marginRight: 4, fontSize: '0.75rem', color: 'text.secondary' }}
              />
              <Typography variant="body2">{nbTentatives === -1 ? '∞' : nbTentatives}</Typography>
            </Box>
          </TableCell>
        ) : (
          <></>
        )}

        {visibleColumns.includes('participantsCount') ? (
          <TableCell {...getCellProps('participantsCount', 'center')}>
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
        ) : (
          <></>
        )}

        <TableCell
          {...getCellProps('actions', 'right')}
          sx={{
            ...getCellProps('actions').sx,
            whiteSpace: 'nowrap',
            maxWidth: 190,
          }}
        >
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

            {!isDeleted ? (
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

                <Tooltip title="Configurer les trophées">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={(e) => {
                      handleTrophyConfigClick(e)
                    }}
                    sx={{
                      transition: (theme) => theme.transitions.create(['background-color']),
                      '&:hover': {
                        backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                      },
                    }}
                  >
                    <FontAwesomeIcon icon={faCog} />
                  </IconButton>
                </Tooltip>

                { (onResetClick && participantsCount > 0) ? (
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
                ) : (
                  <></>
                )}

                {onToggleActive ? (
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
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}

            {isDeleted && onRestoreClick ? (
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

        {!isDeleted ? (
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

            {onResetClick && participantsCount > 0 ? (
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
            ) : (
              <></>
            )}

            {onToggleActive ? (
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
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {isDeleted && onRestoreClick ? (
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
        ) : (
          <></>
        )}
      </CustomPopover>
    </>
  );
};

export default ChallengeItem;
