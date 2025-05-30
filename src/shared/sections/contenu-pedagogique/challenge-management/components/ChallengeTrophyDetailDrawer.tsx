import { m } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedo,
  faList,
  faTimes,
  faMedal,
  faCheck,
  faTrophy,
  faStopwatch,
  faCalculator,
  faInfoCircle,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Chip,
  List,
  alpha,
  Paper,
  Stack,
  Drawer,
  Avatar,
  useTheme,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { varFade } from 'src/shared/components/animate/variants/fade';

import { useChallenges } from 'src/shared/sections/contenu-pedagogique/challenge-management';

import type { Trophy, Challenge } from '../types';

interface ChallengeTrophyDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  trophy: Trophy;
}

const TYPE_CONFIG = {
  OR: {
    label: 'Or',
    color: '#FFD700',
    textColor: '#8B7500',
    bgColor: '#FFF8DC',
    icon: faMedal,
  },
  ARGENT: {
    label: 'Argent',
    color: '#C0C0C0',
    textColor: '#708090',
    bgColor: '#F5F5F5',
    icon: faMedal,
  },
  BRONZE: {
    label: 'Bronze',
    color: '#CD7F32',
    textColor: '#8B4513',
    bgColor: '#FFE4C4',
    icon: faMedal,
  },
  BADGE_PERSONNALISE: {
    label: 'Badge Personnalisé',
    color: '#4B0082',
    textColor: '#4B0082',
    bgColor: '#E6E6FA',
    icon: faTrophy,
  },
};

export default function ChallengeTrophyDetailDrawer({
  open,
  onClose,
  trophy,
}: ChallengeTrophyDetailDrawerProps) {
  const theme = useTheme();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loadingChallenge, setLoadingChallenge] = useState(false);

  const { fetchChallengeDetails, selectedChallenge } = useChallenges();

  // Get trophy type configuration
  const typeConfig = TYPE_CONFIG[trophy.type] || TYPE_CONFIG.BRONZE;

  // Helper to safely format dates
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return fDate(new Date(dateString));
    } catch (error) {
      return 'Date invalide';
    }
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      if (trophy.challengeId) {
        setLoadingChallenge(true);
        try {
          await fetchChallengeDetails(trophy.challengeId);

        } catch (error) {
          console.error('Failed to fetch challenge:', error);
        } finally {
          setLoadingChallenge(false);
        }
      }
    };

    fetchChallenge();
  }, [trophy.challengeId, fetchChallengeDetails]);

  useEffect(() => {
    if (selectedChallenge && selectedChallenge.id === trophy.challengeId) {
      setChallenge(selectedChallenge);
    }
  }, [selectedChallenge, trophy.challengeId]);

  // Helper to render appropriate values based on criteria
  const renderCriteriaValue = (value?: number | null) =>
    value !== undefined && value !== null ? value.toString() : 'Non spécifié';

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450, md: 480 },
          overflow: 'hidden',
          borderRadius: 0,
          boxShadow: (t) => t.customShadows?.z24,
        },
      }}
    >
      {/* Header with background and icon */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 5,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(typeConfig.color, 0.8)} 0%, ${alpha(typeConfig.color, 0.6)} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha('#fff', 0.9),
              color: typeConfig.color,
              boxShadow: theme.customShadows?.z8,
            }}
          >
            <FontAwesomeIcon icon={typeConfig.icon} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {trophy.titre}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={typeConfig.label}
                size="small"
                sx={{
                  bgcolor: alpha(typeConfig.bgColor, 0.8),
                  color: typeConfig.textColor,
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      <Box
        sx={{
          p: 3,
          height: 'calc(100% - 170px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: alpha(theme.palette.grey[500], 0.48),
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: 8,
            backgroundColor: alpha(theme.palette.grey[500], 0.1),
          },
        }}
      >
        {/* Description */}
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(typeConfig.bgColor, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color={typeConfig.textColor} gutterBottom>
            Description du trophée
          </Typography>
          <Typography variant="body2">
            {trophy.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Trophy Image/Icon */}
        {trophy.iconeUrl ? (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 8 }} />
              Icône du trophée
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'center',
                boxShadow: theme.customShadows?.z8,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderRadius: 2,
                  border: `1px solid ${alpha(typeConfig.color, 0.3)}`,
                }}
              >
                <img
                  src={trophy.iconeUrl}
                  alt={trophy.titre}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </Box>
            </Paper>
          </Box>
        ) : null}

        {/* Critères d'attribution */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            <FontAwesomeIcon icon={faList} style={{ marginRight: 8 }} />
            Critères d&apos;attribution
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.info.lighter, 0.5),
              borderLeft: `4px solid ${theme.palette.info.main}`,
            }}
          >
            <Stack spacing={2}>
              {trophy.critereAttribution?.minScore !== undefined ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mr: 2,
                    }}
                  >
                    <FontAwesomeIcon icon={faCalculator} size="sm" />
                  </Box>
                  <Typography variant="body2">
                    <strong>Score minimum requis :</strong>{' '}
                    {renderCriteriaValue(trophy.critereAttribution?.minScore)} points
                  </Typography>
                </Box>
              ) : null}

              {trophy.critereAttribution?.maxTemps !== undefined ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: 'warning.main',
                      mr: 2,
                    }}
                  >
                    <FontAwesomeIcon icon={faStopwatch} size="sm" />
                  </Box>
                  <Typography variant="body2">
                    <strong>Temps maximum :</strong>{' '}
                    {renderCriteriaValue(trophy.critereAttribution?.maxTemps)} minutes
                  </Typography>
                </Box>
              ) : null}

              {trophy.critereAttribution?.maxTentatives !== undefined ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: 'error.main',
                      mr: 2,
                    }}
                  >
                    <FontAwesomeIcon icon={faRedo} size="sm" />
                  </Box>
                  <Typography variant="body2">
                    <strong>Tentatives maximum :</strong>{' '}
                    {renderCriteriaValue(trophy.critereAttribution?.maxTentatives)}
                  </Typography>
                </Box>
              ) : null}

              {trophy.critereAttribution?.tousLesQtsReussis ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      mr: 2,
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} size="sm" />
                  </Box>
                  <Typography variant="body2">
                    <strong>Toutes les questions doivent être réussies</strong>
                  </Typography>
                </Box>
              ) : null}

              {(!trophy.critereAttribution?.minScore &&
                !trophy.critereAttribution?.maxTemps &&
                !trophy.critereAttribution?.maxTentatives &&
                !trophy.critereAttribution?.tousLesQtsReussis) ? (
                  <Typography variant="body2" color="text.secondary">
                    Aucun critère spécifique défini pour ce trophée.
                  </Typography>
                ) : null}
            </Stack>
          </Paper>
        </Box>

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 8 }} />
            Informations détaillées
          </Typography>

          <List
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de création
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(trophy.createdAt)}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faTrophy} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Challenge associé
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {loadingChallenge
                      ? 'Chargement...'
                      : challenge
                        ? challenge.nom
                        : selectedChallenge
                          ? selectedChallenge.nom
                          : `ID: ${trophy.challengeId}`}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
