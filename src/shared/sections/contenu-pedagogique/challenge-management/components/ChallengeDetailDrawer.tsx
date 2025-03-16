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
  faImage,
  faVideo,
  faFileAlt,
  faCalculator,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Card,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  Switch,
  Tooltip,
  ListItem,
  useTheme,
  CardMedia,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { varFade } from 'src/shared/components/animate/variants/fade';

import { MultimediaType } from '../types';
import { STATUT_OPTIONS, DIFFICULTE_OPTIONS, METHODE_CALCUL_SCORE_OPTIONS } from '../constants';

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
    DIFFICULTE_OPTIONS.find((option) => option.value === challenge.difficulte) ||
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

  const questionsCount = challenge.questionsCount || 0;
  const participantsCount = challenge.participantsCount || 0;

  // Get score method display name
  const getScoreMethodName = () => {
    if (!challenge.scoreConfiguration) return 'Non défini';

    const method = METHODE_CALCUL_SCORE_OPTIONS.find(
      (option) => option.value === challenge.scoreConfiguration.methode
    );

    return method ? method.label : 'Non défini';
  };

  // Render multimedia items
  const renderMultimedias = () => {
    if (!challenge.multimedias || challenge.multimedias.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          Aucun contenu multimédia disponible.
        </Typography>
      );
    }

    return (
      <Stack spacing={2}>
        {challenge.multimedias.map((media, index) => (
          <Card key={index} sx={{ maxWidth: 400 }}>
            {media.type === MultimediaType.IMAGE ? (
              <CardMedia
                component="img"
                image={media.url}
                alt={`Image ${index + 1}`}
                sx={{ height: 200, objectFit: 'cover' }}
              />
            ) : media.type === MultimediaType.VIDEO ? (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <FontAwesomeIcon icon={faVideo} style={{ marginRight: 8 }} />
                  Vidéo
                </Typography>
                <Box
                  component="a"
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {media.url}
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  <FontAwesomeIcon icon={faFileAlt} style={{ marginRight: 8 }} />
                  Document
                </Typography>
                <Box
                  component="a"
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {media.url}
                </Box>
              </Box>
            )}
          </Card>
        ))}
      </Stack>
    );
  };

  // Render prerequisite challenge information
  const renderPrerequisInfo = () => {
    if (!challenge.prerequis) {
      return (
        <Typography variant="body2" color="text.secondary">
          Aucun prérequis
        </Typography>
      );
    }

    return (
      <Stack direction="column" spacing={1}>
        <Typography variant="body2">
          <strong>Challenge requis :</strong> {challenge.prerequis.nom}
        </Typography>
        <Typography variant="body2">
          <strong>Pourcentage minimum :</strong> {challenge.prerequis.pourcentageMinimum}%
        </Typography>
      </Stack>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
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
              {challenge.nom}
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
              {questionsCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Questions
            </Typography>
          </Paper>
        </Stack>

        {/* Configuration du Score */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Configuration du Score
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.info.lighter, 0.5),
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
                  bgcolor: alpha(theme.palette.info.main, 0.2),
                  color: 'info.main',
                }}
              >
                <FontAwesomeIcon icon={faCalculator} />
              </Box>
              <Stack>
                <Typography variant="subtitle2" color="text.primary">
                  Méthode de calcul
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getScoreMethodName()}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Prérequis */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Prérequis
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            {renderPrerequisInfo()}
          </Paper>
        </Box>

        {/* Messages finaux */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Messages finaux
          </Typography>

          <Stack spacing={2} mb={3}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z8,
                bgcolor: alpha(theme.palette.success.lighter, 0.5),
                borderLeft: `4px solid ${theme.palette.success.main}`,
              }}
            >
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Message de succès
              </Typography>
              <Typography variant="body2">
                {challenge.messageSucces || 'Message de succès par défaut'}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z8,
                bgcolor: alpha(theme.palette.error.lighter, 0.5),
                borderLeft: `4px solid ${theme.palette.error.main}`,
              }}
            >
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Message d&apos;échec
              </Typography>
              <Typography variant="body2">
                {challenge.messageEchec || "Message d'échec par défaut"}
              </Typography>
            </Paper>
          </Stack>
        </Box>

        {/* Multimédia */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Contenu Multimédia
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            {renderMultimedias()}
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
                      Date de création
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(challenge.dateCreation)}
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
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de publication
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(challenge.datePublication)}
                  </Typography>
                }
              />
            </ListItem>

            {challenge.dateMiseAJour && (
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
                        Dernière mise à jour
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {safeFormatDate(challenge.dateMiseAJour)}
                    </Typography>
                  }
                />
              </ListItem>
            )}

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
                    {challenge.timer || 30} minutes
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
                    {challenge.nbTentatives === -1
                      ? 'Illimité'
                      : `${challenge.nbTentatives} tentative${challenge.nbTentatives > 1 ? 's' : ''}`}
                  </Typography>
                }
              />
            </ListItem>

            {challenge.niveau && (
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
                      {challenge.niveau.nom || 'Tous niveaux'}
                    </Typography>
                  }
                />
              </ListItem>
            )}

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
