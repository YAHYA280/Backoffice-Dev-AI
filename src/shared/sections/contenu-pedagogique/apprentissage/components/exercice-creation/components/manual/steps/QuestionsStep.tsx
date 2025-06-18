// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/QuestionsStep.tsx

'use client';

import React, { useState } from 'react';
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
} from '@mui/material';
import { Add, Edit, Delete, ContentCopy, QuestionMark } from '@mui/icons-material';

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
  { value: 'multiple_choice', label: 'Choix multiples', description: 'Questions avec options' },
  { value: 'true_false', label: 'Vrai/Faux', description: 'Questions binaires' },
  { value: 'short_answer', label: 'Réponse courte', description: 'Réponses textuelles brèves' },
  { value: 'long_answer', label: 'Réponse longue', description: 'Réponses développées' },
] as const;

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Facile', color: '#4CAF50' },
  { value: 'medium', label: 'Moyen', color: '#FF9800' },
  { value: 'hard', label: 'Difficile', color: '#F44336' },
] as const;

const QuestionsStep: React.FC<QuestionsStepProps> = ({ data, errors, onChange }) => {
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false);
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('multiple_choice');

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

  const getDifficultyColor = (difficulty: string) => {
    const option = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty);
    return option ? option.color : '#666';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Questions de l'exercice
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Créez et organisez les questions de votre exercice
      </Typography>

      <Grid container spacing={3}>
        {/* Statistics */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} alignItems="center">
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
                        {totalPoints}
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
                        {Math.round(totalPoints / stats.total || 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Pts / question
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<Add />}
                  onClick={handleAddQuestion}
                  sx={{ py: 2 }}
                >
                  Ajouter une question
                </Button>
              </Grid>
            </Grid>

            {/* Difficulty Distribution */}
            <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Répartition par difficulté :
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Questions List */}
        <Grid item xs={12}>
          {errors.questions && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.questions}
            </Alert>
          )}

          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderBottom: 1,
                borderColor: 'divider',
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
                <QuestionMark sx={{ fontSize: '4rem', mb: 2, opacity: 0.3 }} />
                <Typography variant="h6" gutterBottom>
                  Aucune question créée
                </Typography>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  Commencez par ajouter votre première question à l'exercice
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={handleAddQuestion}>
                  Créer la première question
                </Button>
              </Box>
            ) : (
              <List disablePadding>
                {questions.map((question, index) => (
                  <ListItem
                    key={question.id}
                    sx={{
                      borderBottom: index < questions.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {/* Question Number */}
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.875rem',
                          bgcolor: 'primary.main',
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    </ListItemIcon>

                    {/* Question Content */}
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="medium" sx={{ flex: 1 }}>
                            {question.title}
                          </Typography>

                          <Chip
                            label={QUESTION_TYPES.find((qt) => qt.value === question.type)?.label}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                            {question.content}
                          </Typography>

                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleEditQuestion(question)}
                        sx={{ color: 'primary.main' }}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => duplicateQuestion(question.id)}
                        sx={{ color: 'info.main' }}
                      >
                        <ContentCopy />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => removeQuestion(question.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Card>
        </Grid>

        {/* Question Types Helper */}
        {questions.length === 0 && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Types de questions disponibles
              </Typography>
              <Grid container spacing={2}>
                {QUESTION_TYPES.map((type) => (
                  <Grid item xs={12} sm={6} md={3} key={type.value}>
                    <Card
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'primary.lighter',
                        },
                      }}
                      onClick={() => {
                        setSelectedQuestionType(type.value);
                        handleAddQuestion();
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <QuestionMark sx={{ fontSize: '2rem', color: 'primary.main', mb: 1 }} />
                        <Typography variant="subtitle2" fontWeight="medium">
                          {type.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.description}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        )}
      </Grid>

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
  );
};

export default QuestionsStep;
