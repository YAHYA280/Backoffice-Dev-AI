// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/QuestionsStep.tsx

'use client';

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faEdit,
  faTrash,
  faCopy,
  faQuestionCircle,
  faCheckCircle,
  faExclamationTriangle,
  faChartPie,
  faAward,
  faClock,
  faEye,
  faRocket,
  faMagic,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Grid,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert,
  Avatar,
  Stack,
  Tooltip,
  LinearProgress,
  alpha,
  useTheme,
  Fab,
  Zoom,
  Collapse,
  Divider,
} from '@mui/material';

import { useQuestionManager } from '../../../hooks/useQuestionManager';
import QuestionDialog from '../QuestionDialog';

import type { CreationFormData } from '../../../types/exercise-types';
import type { Question, QuestionType } from '../../../types/question-types';

interface QuestionsStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const QUESTION_TYPES = [
  {
    value: 'multiple_choice',
    label: 'Choix multiples',
    description: 'Questions avec options de réponse',
    icon: faCheckCircle,
    color: '#1976d2',
    bgColor: '#e3f2fd',
    difficulty: 'Facile à créer',
    avgTime: '2-3 min',
  },
  {
    value: 'true_false',
    label: 'Vrai/Faux',
    description: 'Questions binaires simples',
    icon: faQuestionCircle,
    color: '#388e3c',
    bgColor: '#e8f5e8',
    difficulty: 'Très facile',
    avgTime: '1-2 min',
  },
  {
    value: 'short_answer',
    label: 'Réponse courte',
    description: 'Réponses textuelles brèves',
    icon: faEdit,
    color: '#f57c00',
    bgColor: '#fff3e0',
    difficulty: 'Modéré',
    avgTime: '3-4 min',
  },
  {
    value: 'long_answer',
    label: 'Réponse longue',
    description: 'Réponses développées',
    icon: faEdit,
    color: '#7b1fa2',
    bgColor: '#f3e5f5',
    difficulty: 'Avancé',
    avgTime: '5-7 min',
  },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Facile', color: '#4CAF50', icon: '🟢' },
  { value: 'medium', label: 'Moyen', color: '#FF9800', icon: '🟠' },
  { value: 'hard', label: 'Difficile', color: '#F44336', icon: '🔴' },
] as const;

const QuestionsStep: React.FC<QuestionsStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('multiple_choice');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const {
    questions,
    editingQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    duplicateQuestion,
    setEditingQuestion,
    getQuestionStats,
    getTotalPoints,
  } = useQuestionManager({
    initialQuestions: data.questions,
    onQuestionsChange: (newQuestions) => onChange({ questions: newQuestions }),
    maxQuestions: 20,
  });

  const stats = getQuestionStats();
  const totalPoints = getTotalPoints();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  const questionVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleAddQuestion = () => {
    if (questions.length === 0) {
      setShowTypeSelector(true);
    } else {
      setEditingQuestion(null);
      setOpenQuestionDialog(true);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setOpenQuestionDialog(true);
  };

  const handleQuestionSubmit = (questionData: any) => {
    if (editingQuestion) {
      updateQuestion(editingQuestion.id, questionData);
    } else {
      addQuestion(questionData);
    }
    setOpenQuestionDialog(false);
    setEditingQuestion(null);
  };

  const handleTypeSelect = (type: QuestionType) => {
    setSelectedQuestionType(type);
    setShowTypeSelector(false);
    setOpenQuestionDialog(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty);
    return option ? option.color : '#666';
  };

  const getDifficultyIcon = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty);
    return option ? option.icon : '⚪';
  };

  const getQuestionTypeConfig = (type: string) => {
    return QUESTION_TYPES.find((qt) => qt.value === type);
  };

  const renderEmptyState = () => (
    <m.div variants={itemVariants}>
      <Card
        sx={{
          p: 6,
          textAlign: 'center',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 3,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontSize: '2rem',
            }}
          >
            <FontAwesomeIcon icon={faRocket} />
          </Avatar>

          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Créons vos premières questions ! 🚀
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}
          >
            Commencez par ajouter des questions pour évaluer les connaissances de vos étudiants.
            Choisissez parmi plusieurs types de questions adaptés à vos objectifs.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleAddQuestion}
          sx={{
            py: 2,
            px: 4,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: theme.customShadows?.z16,
            },
            transition: 'all 0.2s ease',
          }}
        >
          Créer ma première question
        </Button>
      </Card>
    </m.div>
  );

  const renderQuestionTypeSelector = () => (
    <AnimatePresence>
      {showTypeSelector && (
        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Card sx={{ p: 4, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom textAlign="center">
              Choisissez le type de question
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
              Sélectionnez le format le plus adapté à votre objectif pédagogique
            </Typography>

            <Grid container spacing={2}>
              {QUESTION_TYPES.map((type) => (
                <Grid item xs={12} sm={6} md={3} key={type.value}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: 2,
                      borderColor: 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: type.color,
                        transform: 'translateY(-4px)',
                        boxShadow: theme.customShadows?.z12,
                        bgcolor: type.bgColor,
                      },
                    }}
                    onClick={() => handleTypeSelect(type.value)}
                  >
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: type.bgColor,
                        color: type.color,
                      }}
                    >
                      <FontAwesomeIcon icon={type.icon} />
                    </Avatar>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {type.label}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontSize: '0.875rem' }}
                    >
                      {type.description}
                    </Typography>

                    <Stack spacing={1}>
                      <Chip
                        label={type.difficulty}
                        size="small"
                        sx={{
                          bgcolor: alpha(type.color, 0.1),
                          color: type.color,
                          fontWeight: 'medium',
                        }}
                      />
                      <Chip
                        label={type.avgTime}
                        size="small"
                        variant="outlined"
                        icon={<FontAwesomeIcon icon={faClock} />}
                      />
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setShowTypeSelector(false)}
                sx={{ borderRadius: 2 }}
              >
                Annuler
              </Button>
            </Box>
          </Card>
        </m.div>
      )}
    </AnimatePresence>
  );

  const renderStats = () => (
    <m.div variants={itemVariants}>
      <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          📊 Vue d'ensemble de l'exercice
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '1.5rem',
                }}
              >
                {stats.total}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Questions
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: theme.palette.success.main,
                  fontSize: '1.5rem',
                }}
              >
                {totalPoints}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Points total
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: theme.palette.info.main,
                  fontSize: '1.5rem',
                }}
              >
                {Object.keys(stats.byType).length}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Types utilisés
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  mx: 'auto',
                  mb: 1,
                  bgcolor: theme.palette.warning.main,
                  fontSize: '1.5rem',
                }}
              >
                {Math.round(totalPoints / stats.total || 0)}
              </Avatar>
              <Typography variant="caption" color="text.secondary">
                Pts/question
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Difficulty Distribution */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Répartition par difficulté :
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {DIFFICULTY_OPTIONS.map((option) => {
              const count = stats.byDifficulty[option.value] || 0;
              const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

              return (
                <Tooltip
                  key={option.value}
                  title={`${count} questions (${Math.round(percentage)}%)`}
                >
                  <Box>
                    <Chip
                      icon={<Box sx={{ fontSize: '0.875rem' }}>{option.icon}</Box>}
                      label={`${option.label}: ${count}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(option.color, 0.1),
                        color: option.color,
                        fontWeight: 'medium',
                        '& .MuiChip-icon': {
                          color: option.color,
                        },
                      }}
                    />
                  </Box>
                </Tooltip>
              );
            })}
          </Stack>

          {stats.total > 0 && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, 
                      ${DIFFICULTY_OPTIONS[0].color} 0%, 
                      ${DIFFICULTY_OPTIONS[0].color} ${(stats.byDifficulty.easy / stats.total) * 100}%,
                      ${DIFFICULTY_OPTIONS[1].color} ${(stats.byDifficulty.easy / stats.total) * 100}%,
                      ${DIFFICULTY_OPTIONS[1].color} ${((stats.byDifficulty.easy + stats.byDifficulty.medium) / stats.total) * 100}%,
                      ${DIFFICULTY_OPTIONS[2].color} ${((stats.byDifficulty.easy + stats.byDifficulty.medium) / stats.total) * 100}%,
                      ${DIFFICULTY_OPTIONS[2].color} 100%)`,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Card>
    </m.div>
  );

  const renderQuestionsList = () => (
    <m.div variants={itemVariants}>
      <Card sx={{ overflow: 'hidden', borderRadius: 3 }}>
        <Box
          sx={{
            p: 3,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            📝 Questions de l'exercice ({questions.length})
          </Typography>

          <Button
            variant="contained"
            size="small"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleAddQuestion}
            sx={{ borderRadius: 2 }}
          >
            Ajouter
          </Button>
        </Box>

        <List disablePadding>
          <AnimatePresence>
            {questions.map((question, index) => {
              const typeConfig = getQuestionTypeConfig(question.type);
              const isExpanded = expandedQuestion === question.id;

              return (
                <m.div
                  key={question.id}
                  variants={questionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <ListItem
                    sx={{
                      borderBottom: index < questions.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      p: 0,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        width: '100%',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                        },
                        transition: 'background-color 0.2s ease',
                      }}
                      onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        {/* Question Number */}
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: typeConfig?.bgColor || theme.palette.grey[100],
                            color: typeConfig?.color || theme.palette.grey[600],
                            fontSize: '1rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </Avatar>

                        {/* Question Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" fontWeight="medium" noWrap>
                            {question.title}
                          </Typography>

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Chip
                              label={typeConfig?.label || question.type}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                            <Chip
                              icon={
                                <Box sx={{ fontSize: '0.75rem' }}>
                                  {getDifficultyIcon(question.difficulty)}
                                </Box>
                              }
                              label={`${question.points} pts`}
                              size="small"
                              sx={{
                                bgcolor: alpha(getDifficultyColor(question.difficulty), 0.1),
                                color: getDifficultyColor(question.difficulty),
                                fontSize: '0.75rem',
                              }}
                            />
                            {question.required && (
                              <Chip
                                label="Obligatoire"
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem' }}
                              />
                            )}
                          </Stack>
                        </Box>

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Voir/Modifier">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditQuestion(question);
                              }}
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Dupliquer">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateQuestion(question.id);
                              }}
                              sx={{
                                color: theme.palette.info.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.info.main, 0.1),
                                },
                              }}
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(question.id);
                              }}
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  bgcolor: alpha(theme.palette.error.main, 0.1),
                                },
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                          </Tooltip>

                          <IconButton
                            size="small"
                            sx={{
                              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                            }}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Box>

                    {/* Expanded Content */}
                    <Collapse in={isExpanded} timeout={300}>
                      <Box sx={{ p: 3, pt: 0, bgcolor: alpha(theme.palette.grey[500], 0.03) }}>
                        <Divider sx={{ mb: 2 }} />

                        <Typography variant="body2" gutterBottom>
                          <strong>Énoncé :</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {question.content}
                        </Typography>

                        {question.explanation && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Explication :</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {question.explanation}
                            </Typography>
                          </Box>
                        )}

                        {question.hint && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Indice :</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {question.hint}
                            </Typography>
                          </Box>
                        )}

                        {question.tags.length > 0 && (
                          <Box>
                            <Typography variant="body2" gutterBottom>
                              <strong>Tags :</strong>
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                              {question.tags.map((tag) => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </ListItem>
                </m.div>
              );
            })}
          </AnimatePresence>
        </List>
      </Card>
    </m.div>
  );

  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                bgcolor: theme.palette.primary.main,
                fontSize: '2rem',
              }}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Avatar>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Questions de l'exercice
            </Typography>

            <Typography variant="h6" color="text.secondary">
              Créez et organisez les questions de votre exercice
            </Typography>
          </Box>
        </m.div>

        {/* Error Alert */}
        {errors.questions && (
          <m.div variants={itemVariants}>
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
            >
              {errors.questions}
            </Alert>
          </m.div>
        )}

        {/* Type Selector */}
        {renderQuestionTypeSelector()}

        {/* Content */}
        {questions.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {renderStats()}
            {renderQuestionsList()}
          </>
        )}

        {/* Floating Action Button */}
        {questions.length > 0 && (
          <Zoom in timeout={300}>
            <Fab
              color="primary"
              sx={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                zIndex: 1000,
              }}
              onClick={handleAddQuestion}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Fab>
          </Zoom>
        )}

        {/* Question Dialog */}
        <QuestionDialog
          open={openQuestionDialog}
          onClose={() => {
            setOpenQuestionDialog(false);
            setEditingQuestion(null);
          }}
          onSubmit={handleQuestionSubmit}
          question={editingQuestion}
          initialType={selectedQuestionType}
        />
      </Box>
    </m.div>
  );
};

export default QuestionsStep;
