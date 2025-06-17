// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/QuestionsStep.tsx

'use client';

import React, { useState } from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faQuestionCircle,
  faGripVertical,
  faPenToSquare,
  faTrash,
  faCopy,
  faCheckCircle,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Grid,
  Stack,
  Button,
  useTheme,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
  Alert,
} from '@mui/material';

import { useQuestionManager } from '../../../hooks/useQuestionManager';
import { QUESTION_TYPE_CONFIGS, DIFFICULTY_OPTIONS } from '../../../constants/creation-constants';
import QuestionDialog from '../QuestionDialog';
import type { CreationFormData, Question, QuestionType } from '../../../types';

interface QuestionsStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('multiple_choice');

  const {
    questions,
    selectedQuestion,
    editingQuestion,
    addQuestion,
    updateQuestion,
    removeQuestion,
    duplicateQuestion,
    reorderQuestions,
    setSelectedQuestion,
    setEditingQuestion,
    getQuestionStats,
    getTotalPoints,
  } = useQuestionManager({
    initialQuestions: data.questions,
    onQuestionsChange: (newQuestions) => onChange({ questions: newQuestions }),
    maxQuestions: 20,
  });

  const stats = getQuestionStats();

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setOpenQuestionDialog(true);
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

  const getQuestionTypeIcon = (type: QuestionType) => {
    const config = QUESTION_TYPE_CONFIGS[type];
    return config ? faQuestionCircle : faQuestionCircle; // Placeholder pour les icônes
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    const colors: Record<QuestionType, string> = {
      multiple_choice: theme.palette.primary.main,
      true_false: theme.palette.success.main,
      short_answer: theme.palette.info.main,
      long_answer: theme.palette.warning.main,
      fill_blanks: theme.palette.secondary.main,
      matching: theme.palette.error.main,
    };
    return colors[type] || theme.palette.grey[500];
  };

  const getDifficultyColor = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty);
    return option ? option.color : theme.palette.grey[500];
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box sx={{ p: 4 }}>
      <m.div variants={containerVariants} initial="hidden" animate="visible">
        {/* En-tête */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Questions de l'exercice
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Créez et organisez les questions de votre exercice
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Statistiques et actions */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3} alignItems="center">
                  {/* Statistiques */}
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary.main" fontWeight="bold">
                            {stats.total}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Questions
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success.main" fontWeight="bold">
                            {getTotalPoints}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Points total
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="info.main" fontWeight="bold">
                            {Object.keys(stats.byType).length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Types
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="warning.main" fontWeight="bold">
                            {Math.round(getTotalPoints / stats.total || 0)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Pts / question
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Bouton d'ajout */}
                  <Grid item xs={12} md={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={handleAddQuestion}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                      }}
                    >
                      Ajouter une question
                    </Button>
                  </Grid>
                </Grid>

                {/* Répartition par difficulté */}
                <Divider sx={{ my: 2 }} />
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="subtitle2" color="text.secondary">
                    Répartition par difficulté :
                  </Typography>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <Chip
                      key={option.value}
                      label={`${option.label}: ${stats.byDifficulty[option.value] || 0}`}
                      size="small"
                      sx={{
                        bgcolor: `${option.color}20`,
                        color: option.color,
                        fontWeight: 'medium',
                      }}
                    />
                  ))}
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Liste des questions */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              {errors.questions && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.questions}
                </Alert>
              )}

              <Card sx={{ overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.grey[50],
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    📝 Liste des questions ({questions.length})
                  </Typography>

                  {questions.length > 1 && (
                    <Typography variant="caption" color="text.secondary">
                      Glissez-déposez pour réorganiser
                    </Typography>
                  )}
                </Box>

                {questions.length === 0 ? (
                  <Box
                    sx={{
                      p: 6,
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faQuestionCircle}
                      style={{ fontSize: '4rem', marginBottom: '16px', opacity: 0.3 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Aucune question créée
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      Commencez par ajouter votre première question à l'exercice
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<FontAwesomeIcon icon={faPlus} />}
                      onClick={handleAddQuestion}
                    >
                      Créer la première question
                    </Button>
                  </Box>
                ) : (
                  <List disablePadding>
                    {questions.map((question, index) => (
                      <ListItem
                        key={question.id}
                        component={m.div}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        sx={{
                          borderBottom:
                            index < questions.length - 1
                              ? `1px solid ${theme.palette.divider}`
                              : 'none',
                          '&:hover': {
                            bgcolor: theme.palette.action.hover,
                          },
                        }}
                      >
                        {/* Poignée de glisser-déposer */}
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <IconButton size="small" sx={{ cursor: 'grab' }}>
                            <FontAwesomeIcon icon={faGripVertical} style={{ fontSize: '0.9rem' }} />
                          </IconButton>
                        </ListItemIcon>

                        {/* Numéro de question */}
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
                            mr: 2,
                          }}
                        >
                          {index + 1}
                        </Box>

                        {/* Contenu de la question */}
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle2" fontWeight="medium" sx={{ flex: 1 }}>
                                {question.title}
                              </Typography>

                              <Chip
                                label={QUESTION_TYPE_CONFIGS[question.type]?.label}
                                size="small"
                                sx={{
                                  bgcolor: `${getQuestionTypeColor(question.type)}20`,
                                  color: getQuestionTypeColor(question.type),
                                  fontWeight: 'medium',
                                }}
                              />
                            </Box>
                          }
                          secondary={
                            <Stack spacing={1}>
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {question.content}
                              </Typography>

                              <Stack direction="row" spacing={1} alignItems="center">
                                <Chip
                                  label={`${question.points} pts`}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={
                                    DIFFICULTY_OPTIONS.find((d) => d.value === question.difficulty)
                                      ?.label
                                  }
                                  size="small"
                                  sx={{
                                    bgcolor: `${getDifficultyColor(question.difficulty)}20`,
                                    color: getDifficultyColor(question.difficulty),
                                  }}
                                />
                                {question.required && (
                                  <Chip
                                    label="Obligatoire"
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    icon={
                                      <FontAwesomeIcon
                                        icon={faCheckCircle}
                                        style={{ fontSize: '0.7rem' }}
                                      />
                                    }
                                  />
                                )}
                              </Stack>
                            </Stack>
                          }
                        />

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="Modifier">
                            <IconButton
                              size="small"
                              onClick={() => handleEditQuestion(question)}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Dupliquer">
                            <IconButton
                              size="small"
                              onClick={() => duplicateQuestion(question.id)}
                              sx={{ color: theme.palette.info.main }}
                            >
                              <FontAwesomeIcon icon={faCopy} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Supprimer">
                            <IconButton
                              size="small"
                              onClick={() => removeQuestion(question.id)}
                              sx={{ color: theme.palette.error.main }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Card>
            </m.div>
          </Grid>

          {/* Types de questions disponibles */}
          {questions.length === 0 && (
            <Grid item xs={12}>
              <m.div variants={itemVariants}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Types de questions disponibles
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.values(QUESTION_TYPE_CONFIGS).map((config) => (
                      <Grid item xs={12} sm={6} md={4} key={config.type}>
                        <Card
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: getQuestionTypeColor(config.type),
                              bgcolor: `${getQuestionTypeColor(config.type)}05`,
                            },
                          }}
                          onClick={() => {
                            setSelectedQuestionType(config.type);
                            handleAddQuestion();
                          }}
                        >
                          <Stack spacing={1} alignItems="center" textAlign="center">
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: `${getQuestionTypeColor(config.type)}20`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getQuestionTypeColor(config.type),
                              }}
                            >
                              <FontAwesomeIcon icon={getQuestionTypeIcon(config.type)} size="lg" />
                            </Box>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {config.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {config.description}
                            </Typography>
                          </Stack>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Card>
              </m.div>
            </Grid>
          )}
        </Grid>
      </m.div>

      {/* Dialog de création/édition de question */}
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
  );
};

export default QuestionsStep;
