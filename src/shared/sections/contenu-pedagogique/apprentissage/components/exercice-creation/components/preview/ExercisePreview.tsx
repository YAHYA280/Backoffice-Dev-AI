// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/preview/ExercisePreview.tsx

'use client';

import { m } from 'framer-motion';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEdit,
  faClock,
  faQuestionCircle,
  faCheckCircle,
  faRobot,
  faUser,
  faChevronDown,
  faChevronUp,
  faLightbulb,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Drawer,
  useTheme,
  Divider,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';

import { DIFFICULTY_OPTIONS, QUESTION_TYPE_CONFIGS } from '../../constants/creation-constants';

import type { Question } from '../../types/question-types';
import type { Exercise, CreationMode } from '../../types/exercise-types';

interface ExercisePreviewProps {
  open: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  onEdit?: () => void;
  onSave?: () => void;
  mode?: CreationMode;
}

const ExercisePreview: React.FC<ExercisePreviewProps> = ({
  open,
  onClose,
  exercise,
  onEdit,
  onSave,
  mode = 'manual',
}) => {
  const theme = useTheme();
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showAiDetails, setShowAiDetails] = useState(false);

  if (!exercise) return null;

  const isAiGenerated = exercise.mode === 'ai';
  const questions = isAiGenerated
    ? (exercise as any).generatedQuestions || []
    : exercise.questions || [];

  const totalPoints = questions.reduce((sum: number, q: Question) => sum + q.points, 0);
  const avgDifficulty =
    questions.length > 0
      ? questions.reduce((sum: number, q: Question) => {
          const difficultyValue = q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : 3;
          return sum + difficultyValue;
        }, 0) / questions.length
      : 0;

  const getDifficultyLabel = (avg: number) => {
    if (avg <= 1.3) return 'Facile';
    if (avg <= 2.3) return 'Moyen';
    return 'Difficile';
  };

  const getDifficultyColor = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find(
      (d) => d.label.toLowerCase() === difficulty.toLowerCase()
    );
    return option ? option.color : theme.palette.grey[500];
  };

  const getQuestionTypeIcon = (type: string) =>
    QUESTION_TYPE_CONFIGS[type as keyof typeof QUESTION_TYPE_CONFIGS]?.type || 'question';

  const renderQuestionPreview = (question: Question, index: number) => {
    const isExpanded = expandedQuestion === question.id;

    return (
      <Card
        key={question.id}
        sx={{
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: theme.customShadows?.z8,
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: theme.palette.primary.main,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}
            >
              {index + 1}
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                {question.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={QUESTION_TYPE_CONFIGS[question.type]?.label || question.type}
                  size="small"
                  variant="outlined"
                />
                <Chip label={`${question.points} pts`} size="small" color="primary" />
                <Chip
                  label={DIFFICULTY_OPTIONS.find((d) => d.value === question.difficulty)?.label}
                  size="small"
                  sx={{
                    bgcolor: `${getDifficultyColor(DIFFICULTY_OPTIONS.find((d) => d.value === question.difficulty)?.label || 'Moyen')}20`,
                    color: getDifficultyColor(
                      DIFFICULTY_OPTIONS.find((d) => d.value === question.difficulty)?.label ||
                        'Moyen'
                    ),
                  }}
                />
              </Stack>
            </Box>
          </Stack>

          <IconButton size="small">
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
          </IconButton>
        </Box>

        <Collapse in={isExpanded}>
          <Divider />
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              <strong>Énoncé :</strong>
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: theme.palette.grey[50],
                borderRadius: 1,
                mb: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
              dangerouslySetInnerHTML={{ __html: question.content }}
            />

            {/* Options pour choix multiples */}
            {question.type === 'multiple_choice' && (question as any).options && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Options de réponse :
                </Typography>
                <List dense>
                  {(question as any).options.map((option: any, optIndex: number) => (
                    <ListItem
                      key={option.id}
                      sx={{
                        py: 0.5,
                        bgcolor: option.isCorrect ? theme.palette.success.lighter : 'transparent',
                        borderRadius: 1,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <FontAwesomeIcon
                          icon={option.isCorrect ? faCheckCircle : faQuestionCircle}
                          color={
                            option.isCorrect ? theme.palette.success.main : theme.palette.grey[400]
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={option.text}
                        primaryTypographyProps={{
                          variant: 'body2',
                          fontWeight: option.isCorrect ? 'medium' : 'normal',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Réponse pour vrai/faux */}
            {question.type === 'true_false' && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Réponse correcte :
                </Typography>
                <Chip
                  label={(question as any).correctAnswer ? 'Vrai' : 'Faux'}
                  color={(question as any).correctAnswer ? 'success' : 'error'}
                  icon={<FontAwesomeIcon icon={faCheckCircle} />}
                />
              </Box>
            )}

            {/* Explications et indices */}
            {question.explanation && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: 4 }} />
                  Explication :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {question.explanation}
                </Typography>
              </Box>
            )}

            {question.hint && (
              <Box>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: 4 }} />
                  Indice :
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {question.hint}
                </Typography>
              </Box>
            )}
          </Box>
        </Collapse>
      </Card>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '60%', md: '50%', lg: '40%' },
          maxWidth: 800,
          p: 0,
        },
      }}
    >
      <m.div variants={containerVariants} initial="hidden" animate="visible">
        {/* En-tête */}
        <m.div variants={itemVariants}>
          <Box
            sx={{
              p: 3,
              background:
                mode === 'ai'
                  ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: 'white',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <FontAwesomeIcon icon={faEye} size="lg" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  Aperçu de l&apos;exercice
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FontAwesomeIcon
                    icon={mode === 'ai' ? faRobot : faUser}
                    style={{ fontSize: '0.9rem' }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {mode === 'ai' ? 'Généré par IA' : 'Création manuelle'}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="space-between">
              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onClose}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Fermer
                </Button>
              </Box>

              <Stack direction="row" spacing={1}>
                {onEdit && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faEdit} />}
                    onClick={onEdit}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    Modifier
                  </Button>
                )}

                {onSave && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={onSave}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    Sauvegarder
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </m.div>

        {/* Contenu principal */}
        <Box sx={{ p: 3, pb: 6 }}>
          {/* Informations générales */}
          <m.div variants={itemVariants}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {exercise.title}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {exercise.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {questions.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Questions
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {totalPoints}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Points total
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {exercise.estimatedDuration}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Minutes
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      sx={{ color: getDifficultyColor(getDifficultyLabel(avgDifficulty)) }}
                    >
                      {getDifficultyLabel(avgDifficulty)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Difficulté
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </m.div>

          {/* Tags */}
          {exercise.tags && exercise.tags.length > 0 && (
            <m.div variants={itemVariants}>
              <Card sx={{ p: 2, mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Mots-clés
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {exercise.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" variant="outlined" />
                  ))}
                </Stack>
              </Card>
            </m.div>
          )}

          {/* Contenu pédagogique */}
          {((exercise.mode === 'manual' && (exercise as any).content) ||
            (exercise.mode === 'ai' && (exercise as any).generatedContent)) && (
            <m.div variants={itemVariants}>
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Contenu pédagogique
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.grey[50],
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                    dangerouslySetInnerHTML={{
                      __html:
                        exercise.mode === 'manual'
                          ? (exercise as any).content || 'Aucun contenu'
                          : (exercise as any).generatedContent || 'Contenu généré par IA',
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            </m.div>
          )}

          {/* Détails IA */}
          {isAiGenerated && (exercise as any).aiConfig && (
            <m.div variants={itemVariants}>
              <Accordion sx={{ mb: 3 }}>
                <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    <FontAwesomeIcon icon={faRobot} style={{ marginRight: 8 }} />
                    Détails de génération IA
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Modèle utilisé
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {(exercise as any).aiConfig.model || 'GPT-4'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Style d&apos;écriture
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {(exercise as any).aiConfig.writingStyle || 'Engageant'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Objectifs d&apos;apprentissage
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={0.5}
                        flexWrap="wrap"
                        useFlexGap
                        sx={{ mt: 0.5 }}
                      >
                        {((exercise as any).aiConfig.learningObjectives || []).map(
                          (objective: string) => (
                            <Chip
                              key={objective}
                              label={objective}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </m.div>
          )}

          {/* Questions */}
          <m.div variants={itemVariants}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Questions ({questions.length})
            </Typography>

            {questions.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <FontAwesomeIcon
                  icon={faQuestionCircle}
                  style={{
                    fontSize: '3rem',
                    marginBottom: '16px',
                    color: theme.palette.grey[400],
                  }}
                />
                <Typography variant="body1" color="text.secondary">
                  Aucune question dans cet exercice
                </Typography>
              </Card>
            ) : (
              <Box>
                {questions.map((question: Question, index: number) =>
                  renderQuestionPreview(question, index)
                )}
              </Box>
            )}
          </m.div>

          {/* Configuration */}
          <m.div variants={itemVariants}>
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<FontAwesomeIcon icon={faChevronDown} />}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Configuration de l&apos;exercice
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tentatives autorisées
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {exercise.config.allowRetries
                        ? `${exercise.config.maxRetries || 'Illimitées'} tentatives`
                        : 'Une seule tentative'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Score de réussite
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {exercise.config.passingScore}%
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Temps limite
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {exercise.config.timeLimit
                        ? `${exercise.config.timeLimit} minutes`
                        : 'Aucune limite'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Options activées
                    </Typography>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {exercise.config.showCorrectAnswers && (
                        <Chip label="Corrections" size="small" />
                      )}
                      {exercise.config.enableHints && <Chip label="Indices" size="small" />}
                      {exercise.config.shuffleQuestions && (
                        <Chip label="Mélange questions" size="small" />
                      )}
                      {exercise.config.enableExplanations && (
                        <Chip label="Explications" size="small" />
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </m.div>
        </Box>
      </m.div>
    </Drawer>
  );
};

export default ExercisePreview;
