import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedo,
  faTimes,
  faUsers,
  faMedal,
  faTrophy,
  faToggleOn,
  faStopwatch,
  faCalendarAlt,
  faGraduationCap,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  Switch,
  Tooltip,
  Divider,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { varFade } from 'src/shared/components/animate/variants/fade';

import { STATUT_OPTIONS, DIFFICULTE_OPTIONS } from '../constants';

import type { Challenge } from '../types';

interface ChallengeDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  challenge: Challenge;
  onToggleActive?: (challenge: Challenge, active: boolean) => void;
}

export const ChallengeDetailDrawer = ({
  open,
  onClose,
  challenge,
  onToggleActive,
}: ChallengeDetailDrawerProps) => {
  const theme = useTheme();

  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === challenge.statut) || STATUT_OPTIONS[0];

  const difficulteOption =
    DIFFICULTE_OPTIONS.find((option) => option.value === challenge.niveauDifficulte) ||
    DIFFICULTE_OPTIONS[0];

  const handleToggleActive = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onToggleActive) {
      onToggleActive(challenge, event.target.checked);
    }
  };

  // Helper to safely format dates
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return fDate(new Date(dateString));
    } catch (error) {
      return 'Date invalide';
    }
  };

  const exercicesCount = challenge.exercicesCount || challenge.questionsCount || 0;
  const participantsCount = challenge.participantsCount || 0;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
          p: 0,
          boxShadow: theme.customShadows?.z16,
          overflowY: 'auto',
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
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
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
              color: 'primary.main',
              boxShadow: theme.customShadows?.z8,
            }}
          >
            <FontAwesomeIcon icon={faTrophy} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {challenge.titre}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={statutOption.label}
                size="small"
                sx={{
                  bgcolor: alpha(statutOption.bgColor, 0.8),
                  color: statutOption.color,
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />

              <Chip
                label={difficulteOption.label}
                size="small"
                sx={{
                  bgcolor: alpha(difficulteOption.bgColor, 0.8),
                  color: difficulteOption.color,
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 3 }}>
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Description du challenge
          </Typography>
          <Typography variant="body2">
            {challenge.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Information Cards */}
        <Stack
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          direction="row"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.info.lighter, 0.5),
            }}
          >
            <FontAwesomeIcon
              icon={faUsers}
              style={{
                color: theme.palette.info.main,
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <Typography variant="h5" color="text.primary">
              {participantsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Participants
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              flex: 1,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.success.lighter, 0.5),
            }}
          >
            <FontAwesomeIcon
              icon={faQuestionCircle}
              style={{
                color: theme.palette.success.main,
                fontSize: 24,
                marginBottom: 8,
              }}
            />
            <Typography variant="h5" color="text.primary">
              {exercicesCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Questions
            </Typography>
          </Paper>
        </Stack>

        {/* Récompenses */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Récompenses
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.warning.lighter, 0.5),
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.warning.main, 0.2),
                  color: 'warning.main',
                }}
              >
                <FontAwesomeIcon icon={faMedal} />
              </Box>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Points de récompense
                </Typography>
                <Typography variant="h6" color="warning.main">
                  {challenge.pointsRecompense} points
                </Typography>
              </Stack>
            </Stack>
            {challenge.badgeRecompense && (
              <Box
                sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}
              >
                <Typography variant="subtitle2" color="text.primary" gutterBottom>
                  Badge obtenu
                </Typography>
                <Chip
                  label={challenge.badgeRecompense}
                  color="warning"
                  sx={{ fontWeight: 'medium' }}
                />
              </Box>
            )}
          </Paper>
        </Box>

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
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
                      Date de début
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(challenge.dateDebut)}
                  </Typography>
                }
              />
            </ListItem>

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
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de fin
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(challenge.dateFin)}
                  </Typography>
                }
              />
            </ListItem>

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
                        bgcolor: alpha(theme.palette.warning.main, 0.1),
                        color: 'warning.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faStopwatch} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Durée limite
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {challenge.timeMaxMinutes || 30} minutes
                  </Typography>
                }
              />
            </ListItem>

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
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faRedo} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Tentatives autorisées
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {challenge.tentativesMax === -1
                      ? 'Illimité'
                      : `${challenge.tentativesMax} tentative${challenge.tentativesMax > 1 ? 's' : ''}`}
                  </Typography>
                }
              />
            </ListItem>

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
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faGraduationCap} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Niveau associé
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {challenge.niveauId ? `Niveau ${challenge.niveauId}` : 'Tous niveaux'}
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
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faToggleOn} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Statut
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box
                    sx={{
                      mt: 0.5,
                      ml: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body1">
                      {challenge.active !== false ? 'Actif' : 'Inactif'}
                    </Typography>

                    {onToggleActive && (
                      <Tooltip title={challenge.active !== false ? 'Désactiver' : 'Activer'}>
                        <Switch
                          size="small"
                          checked={challenge.active !== false}
                          onChange={handleToggleActive}
                          color="success"
                        />
                      </Tooltip>
                    )}
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChallengeDetailDrawer;
