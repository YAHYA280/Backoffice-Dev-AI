import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faPen,
  faStar,
  faTrash,
  faClock,
  faMedal,
  faTrophy,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Stack,
  alpha,
  Avatar,
  Divider,
  MenuList,
  MenuItem,
  useTheme,
  Typography,
  IconButton,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

import ChallengeTrophyDetailDrawer from './ChallengeTrophyDetailDrawer';

import type { Trophy } from '../types';

type Props = {
  trophy: Trophy;
  onView: () => void;
  onEdit: (trophy: Trophy) => Promise<void>;
  onDelete: () => void;
};

export function ChallengeTrophyCard({ trophy, onView, onEdit, onDelete }: Props) {
  const popover = usePopover();
  const theme = useTheme();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditTrophy = () => {
    popover.onClose();
    router.push(paths.dashboard.contenu_pedagogique.editTrophy(trophy.challengeId, trophy.id));
  };

  const handleOpenTrophyDetail = () => {
    setIsModalOpen(true);
  };

  const handleViewTrophy = () => {
    handleOpenTrophyDetail();
    popover.onClose();
    onView();
  };

  const renderCriteriaBadges = () => {
    const c = trophy.critereAttribution;
    const criteria = [];

    if (c.minScore) criteria.push({ type: 'score', label: `Score ≥ ${c.minScore}`, icon: faStar });
    if (c.maxTemps) criteria.push({ type: 'temps', label: `≤ ${c.maxTemps} min`, icon: faClock });
    if (c.maxTentatives)
      criteria.push({ type: 'tentatives', label: `Tentative ≤ ${c.maxTentatives}`, icon: faMedal });
    if (c.tousLesQtsReussis)
      criteria.push({ type: 'reussite', label: 'Tout réussi', icon: faTrophy });

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
        {criteria.map((crit, index) => (
          <Chip
            key={`${crit.type}-${index}`}
            size="small"
            icon={<FontAwesomeIcon icon={crit.icon} size="xs" />}
            label={crit.label}
            sx={{
              borderRadius: '4px',
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              color: theme.palette.primary.darker,
              '& .MuiChip-icon': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                color: theme.palette.primary.main,
                '& .MuiChip-icon': {
                  color: theme.palette.primary.dark,
                },
              },
              fontSize: '0.75rem',
              height: '24px',
              mb: 0.5,
            }}
          />
        ))}
      </Stack>
    );
  };

  return (
    <>
      <Card
        sx={{
          p: 0,
          position: 'relative',
          overflow: 'visible',
          transition: 'all 0.2s ease-in-out',
          boxShadow:
            theme.customShadows?.card ||
            '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 24px -4px rgba(145, 158, 171, 0.12)',
          '&:hover': {
            boxShadow:
              theme.customShadows?.z16 ||
              '0 0 2px 0 rgba(145, 158, 171, 0.2), 0 12px 28px -4px rgba(145, 158, 171, 0.26)',
            transform: 'translateY(-4px)',
          },
          cursor: 'pointer',
        }}
        onClick={handleOpenTrophyDetail}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 9,
          }}
        >
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              popover.onOpen(e);
            }}
            size="small"
            sx={{
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
              '&:hover': {
                backgroundColor: theme.palette.background.neutral,
              },
            }}
          >
            <FontAwesomeIcon icon={faEllipsisV} size="xs" />
          </IconButton>
        </Box>

        <Box sx={{ p: 2, pb: 0 }}>
          <Stack direction="row" spacing={2}>
            <Avatar
              src={trophy.iconeUrl}
              alt={trophy.titre}
              variant="rounded"
              sx={{
                width: 64,
                height: 64,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                boxShadow: `0 0 12px 0 ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            />
            <Stack spacing={0.5} flex={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                {trophy.titre}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  height: '42px',
                }}
              >
                {trophy.description}
              </Typography>
            </Stack>
          </Stack>

          {renderCriteriaBadges()}
        </Box>

        <Divider sx={{ mt: 2 }} />

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: alpha(theme.palette.background.neutral, 0.4),
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            Créé le {fDate(trophy.createdAt)}
          </Typography>
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
        sx={{
          '& .MuiPaper-root': {
            width: 160,
            boxShadow: theme.customShadows?.z16 || '0 4px 16px rgba(0,0,0,0.16)',
          },
        }}
      >
        <MenuList sx={{ py: 1 }}>
          <MenuItem
            onClick={handleViewTrophy}
            sx={{
              py: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                color: theme.palette.primary.main,
              },
            }}
          >
            <FontAwesomeIcon icon={faEye} style={{ marginRight: 8, fontSize: '0.875rem' }} />
            Voir
          </MenuItem>

          <MenuItem
            onClick={handleEditTrophy}
            sx={{
              py: 1,
              '&:hover': {
                backgroundColor: alpha(theme.palette.info.main, 0.08),
                color: theme.palette.info.main,
              },
            }}
          >
            <FontAwesomeIcon icon={faPen} style={{ marginRight: 8, fontSize: '0.875rem' }} />
            Modifier
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              onDelete();
            }}
            sx={{
              py: 1,
              color: theme.palette.error.main,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
              },
            }}
          >
            <FontAwesomeIcon icon={faTrash} style={{ marginRight: 8, fontSize: '0.875rem' }} />
            Supprimer
          </MenuItem>
        </MenuList>
      </CustomPopover>

      {/* Trophy Detail Modal */}
      <ChallengeTrophyDetailDrawer
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trophy={trophy}
      />
    </>
  );
}
