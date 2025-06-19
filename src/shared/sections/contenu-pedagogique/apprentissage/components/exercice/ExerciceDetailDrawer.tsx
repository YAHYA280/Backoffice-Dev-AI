'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faRedo,
  faTimes,
  faVideo,
  faImage,
  faRobot,
  faClock,
  faLaptop,
  faListOl,
  faPenAlt,
  faFileAlt,
  faFilePdf,
  faPercent,
  faShuffle,
  faClipboard,
  faHandPaper,
  faAlignLeft,
  faGripLines,
  faPaperclip,
  faHeadphones,
  faCheckCircle,
  faGraduationCap,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Grid,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  ListItem,
  useTheme,
  Accordion,
  IconButton,
  Typography,
  ListItemText,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';

import { STATUT_OPTIONS } from '../../types';

import type { Exercice, QuestionType, ManualExerciceData } from '../../types';

interface ExerciceDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  exercice: Exercice & Partial<ManualExerciceData> & { mode?: 'ai' | 'manual' };
}

const ExerciceDetailDrawer = ({ open, onClose, exercice }: ExerciceDetailDrawerProps) => {
  const theme = useTheme();

  const statutOption =
    STATUT_OPTIONS.find((option) => option.value === exercice.statut) || STATUT_OPTIONS[0];

  const isManualMode = exercice.mode === 'manual' || exercice.questions;

  const getResourceIcon = (resource: string) => {
    switch (resource.toLowerCase()) {
      case 'pdf':
        return faFilePdf;
      case 'audio':
        return faHeadphones;
      case 'vidéo':
      case 'video':
        return faVideo;
      case 'interactive':
        return faLaptop;
      case 'image':
        return faImage;
      default:
        return faFileAlt;
    }
  };

  const getQuestionIcon = (type: QuestionType['type']) => {
    switch (type) {
      case 'multiple_choice':
        return faListOl;
      case 'true_false':
        return faCheckCircle;
      case 'short_answer':
        return faPenAlt;
      case 'essay':
        return faAlignLeft;
      case 'fill_blank':
        return faGripLines;
      default:
        return faQuestionCircle;
    }
  };

  const getQuestionTypeLabel = (type: QuestionType['type']) => {
    switch (type) {
      case 'multiple_choice':
        return 'Choix multiple';
      case 'true_false':
        return 'Vrai/Faux';
      case 'short_answer':
        return 'Réponse courte';
      case 'essay':
        return 'Rédaction';
      case 'fill_blank':
        return 'Texte à trous';
      default:
        return 'Question';
    }
  };

  const calculateTotalPoints = () => {
    if (!exercice.questions) return 0;
    return exercice.questions.reduce((sum, q) => sum + q.points, 0);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 500 },
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
            <FontAwesomeIcon icon={isManualMode ? faHandPaper : faRobot} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {exercice.titre}
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
                icon={<FontAwesomeIcon icon={isManualMode ? faHandPaper : faRobot} />}
                label={isManualMode ? 'Mode Manuel' : 'Mode IA'}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.9),
                  color: 'primary.main',
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
            Description de l&apos;exercice
          </Typography>
          <Typography variant="body2">
            {exercice.description || 'Aucune description disponible.'}
          </Typography>
        </Paper>

        {/* Instructions (for manual mode) */}
        {isManualMode && exercice.instructions && (
          <Paper
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade().inUp}
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              bgcolor: alpha(theme.palette.info.lighter, 0.2),
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="info.main" gutterBottom>
              Instructions pour les élèves
            </Typography>
            <Typography variant="body2">{exercice.instructions}</Typography>
          </Paper>
        )}

        {/* Exercise Settings (for manual mode) */}
        {isManualMode && (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Paramètres de l&apos;exercice
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z1,
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FontAwesomeIcon
                      icon={faClock}
                      style={{ color: theme.palette.primary.main, marginBottom: 4 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Durée limite
                    </Typography>
                    <Typography variant="h6" fontWeight="fontWeightBold">
                      {exercice.timeLimit ? `${exercice.timeLimit} min` : 'Illimitée'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FontAwesomeIcon
                      icon={faPercent}
                      style={{ color: theme.palette.success.main, marginBottom: 4 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Score de réussite
                    </Typography>
                    <Typography variant="h6" fontWeight="fontWeightBold">
                      {exercice.passingScore || 70}%
                    </Typography>
                  </Box>
                </Grid>
                {exercice.maxAttempts && (
                  <Grid item xs={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <FontAwesomeIcon
                        icon={faRedo}
                        style={{ color: theme.palette.warning.main, marginBottom: 4 }}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Tentatives max
                      </Typography>
                      <Typography variant="h6" fontWeight="fontWeightBold">
                        {exercice.maxAttempts}
                      </Typography>
                    </Box>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      style={{ color: theme.palette.info.main, marginBottom: 4 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      Questions
                    </Typography>
                    <Typography variant="h6" fontWeight="fontWeightBold">
                      {exercice.questions?.length || 0}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {exercice.shuffleQuestions !== undefined && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      icon={<FontAwesomeIcon icon={faShuffle} />}
                      label={exercice.shuffleQuestions ? 'Questions mélangées' : 'Ordre fixe'}
                      size="small"
                      color={exercice.shuffleQuestions ? 'primary' : 'default'}
                    />
                    <Chip
                      icon={<FontAwesomeIcon icon={faEye} />}
                      label={
                        exercice.showCorrectAnswers
                          ? 'Corrections visibles'
                          : 'Corrections masquées'
                      }
                      size="small"
                      color={exercice.showCorrectAnswers ? 'success' : 'default'}
                    />
                  </Stack>
                </Box>
              )}
            </Paper>
          </Box>
        )}

        {/* Questions (for manual mode) */}
        {isManualMode && exercice.questions && exercice.questions.length > 0 && (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Questions ({exercice.questions.length}) - {calculateTotalPoints()} points au total
            </Typography>

            <Stack spacing={1}>
              {exercice.questions.map((question, index) => (
                <Accordion key={question.id}>
                  <AccordionSummary sx={{ minHeight: 48 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <FontAwesomeIcon icon={getQuestionIcon(question.type)} size="sm" />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>
                          Q{index + 1}: {question.question}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label={getQuestionTypeLabel(question.type)}
                            size="small"
                            variant="outlined"
                          />
                          <Chip label={`${question.points} pts`} size="small" color="primary" />
                        </Stack>
                      </Box>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ pl: 1 }}>
                      {question.explanation && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          <strong>Explication:</strong> {question.explanation}
                        </Typography>
                      )}

                      {question.type === 'multiple_choice' && (
                        <Stack spacing={1}>
                          <Typography variant="caption" color="text.secondary">
                            Options de réponse:
                          </Typography>
                          {question.options.map((option, optIndex) => (
                            <Box
                              key={option.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: option.isCorrect
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.grey[500], 0.05),
                              }}
                            >
                              <Box
                                sx={{
                                  width: 16,
                                  height: 16,
                                  borderRadius: question.allowMultiple ? 0.5 : '50%',
                                  border: '2px solid',
                                  borderColor: option.isCorrect ? 'success.main' : 'grey.400',
                                  bgcolor: option.isCorrect ? 'success.main' : 'transparent',
                                }}
                              />
                              <Typography variant="body2">{option.text}</Typography>
                            </Box>
                          ))}
                        </Stack>
                      )}

                      {question.type === 'true_false' && (
                        <Typography variant="body2" color="success.main">
                          <strong>Réponse correcte:</strong>{' '}
                          {question.correctAnswer ? 'Vrai' : 'Faux'}
                        </Typography>
                      )}

                      {question.type === 'short_answer' && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Réponses acceptées:
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {question.acceptedAnswers.map((answer, ansIndex) => (
                              <Chip
                                key={ansIndex}
                                label={answer}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                          {question.caseSensitive && (
                            <Typography variant="caption" color="warning.main">
                              (Sensible à la casse)
                            </Typography>
                          )}
                        </Box>
                      )}

                      {question.type === 'essay' && (
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Longueur requise:</strong> {question.minWords || 50} -{' '}
                            {question.maxWords || 500} mots
                          </Typography>
                          {question.rubric && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Grille d&apos;évaluation:
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {question.rubric}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>
        )}

        {/* Ressources */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Ressources
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z1,
            }}
          >
            <Grid container spacing={1}>
              {exercice.ressources && exercice.ressources.length > 0 ? (
                exercice.ressources.map((resource, index) => (
                  <Grid item key={index}>
                    <Chip
                      icon={<FontAwesomeIcon icon={getResourceIcon(resource)} />}
                      label={resource}
                      sx={{
                        borderRadius: 1,
                        bgcolor: alpha(theme.palette.info.lighter, 0.5),
                        color: 'text.primary',
                      }}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Aucune ressource disponible
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>

        {/* Attachments (for manual mode) */}
        {isManualMode && exercice.attachments && exercice.attachments.length > 0 && (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Documents attachés
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z1,
              }}
            >
              <Stack spacing={1}>
                {exercice.attachments.map((attachment) => (
                  <Box
                    key={attachment.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.grey[500], 0.05),
                    }}
                  >
                    <FontAwesomeIcon icon={faPaperclip} color={theme.palette.text.secondary} />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {attachment.name}
                    </Typography>
                    <Chip label={attachment.type} size="small" variant="outlined" />
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Box>
        )}

        {/* Évaluation et objectifs (for AI mode or general info) */}
        {!isManualMode && (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Évaluation et objectifs
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
                        <FontAwesomeIcon icon={faClipboard} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Notation
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {exercice.notation || 20} points
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
                        <FontAwesomeIcon icon={faGraduationCap} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Compétences visées
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {exercice.competencesCount || 3} compétences
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default ExerciceDetailDrawer;
