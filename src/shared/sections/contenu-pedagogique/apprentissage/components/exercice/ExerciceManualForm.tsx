'use client';

import { z } from 'zod';
import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faTimes,
  faPlus,
  faClock,
  faPercent,
  faRedo,
  faEye,
  faQuestionCircle,
  faGripVertical,
  faEdit,
  faTrash,
  faListOl,
  faCheckCircle,
  faPenAlt,
  faAlignLeft,
  faGripLines,
  faChevronLeft,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  Switch,
  Slider,
  Tooltip,
  Divider,
  TextField,
  Typography,
  IconButton,
  FormControl,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
  Collapse,
  Paper,
  alpha,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate';
import { QuestionBuilder } from './manual/QuestionBuilder';
import { DocumentAttachment, type AttachmentFile } from './manual/DocumentAttachment';

import type { QuestionType, ManualExerciceData } from '../../types';

const schema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  instructions: z.string().min(10, 'Les instructions doivent contenir au moins 10 caractères'),
  timeLimit: z.number().min(0).max(180).optional(),
  passingScore: z.number().min(0).max(100),
  shuffleQuestions: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
  maxAttempts: z.number().min(1).max(10).optional(),
});

type FormData = z.infer<typeof schema>;

interface ExerciceManualFormProps {
  initialValues?: Partial<ManualExerciceData>;
  onSubmit: (data: ManualExerciceData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  chapitreId: string;
}

export const ExerciceManualForm = ({
  initialValues = {
    titre: '',
    description: '',
    instructions: '',
    questions: [],
    timeLimit: 30,
    passingScore: 70,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    maxAttempts: 3,
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  chapitreId,
}: ExerciceManualFormProps) => {
  const [questions, setQuestions] = useState<QuestionType[]>(initialValues.questions || []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionType | undefined>(undefined);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      titre: initialValues.titre || '',
      description: initialValues.description || '',
      instructions: initialValues.instructions || '',
      timeLimit: initialValues.timeLimit || 30,
      passingScore: initialValues.passingScore || 70,
      shuffleQuestions: initialValues.shuffleQuestions || false,
      showCorrectAnswers: initialValues.showCorrectAnswers || true,
      maxAttempts: initialValues.maxAttempts || 3,
    },
  });

  const handleFormSubmit = (formData: FormData) => {
    const exerciceData: ManualExerciceData = {
      ...formData,
      questions,
      timeLimit: formData.timeLimit || undefined,
      attachments: attachments
        .filter((att) => att.status === 'success')
        .map((att) => ({
          id: att.id,
          name: att.name,
          url: att.url || '',
          type: att.type,
        })),
    };
    onSubmit(exerciceData);
  };

  const addQuestion = () => {
    setEditingQuestion(undefined);
    setShowQuestionBuilder(true);
  };

  const handleEditQuestion = (question: QuestionType) => {
    setEditingQuestion(question);
    setShowQuestionBuilder(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  const handleSaveQuestion = (question: QuestionType) => {
    if (editingQuestion) {
      // Update existing question
      setQuestions(questions.map((q) => (q.id === question.id ? question : q)));
    } else {
      // Add new question
      const newQuestion = { ...question, order: questions.length };
      setQuestions([...questions, newQuestion]);
    }
    setShowQuestionBuilder(false);
    setEditingQuestion(undefined);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ];

    // Update order property
    newQuestions.forEach((q, i) => {
      q.order = i;
    });

    setQuestions(newQuestions);
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

  const calculateTotalPoints = () => questions.reduce((sum, q) => sum + q.points, 0);

  const handleAddAttachments = (files: File[]) => {
    const newAttachments: AttachmentFile[] = files.map((file) => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'uploading' as const,
      uploadProgress: 0,
    }));

    setAttachments([...attachments, ...newAttachments]);

    // Simulate upload progress
    newAttachments.forEach((attachment, index) => {
      const interval = setInterval(() => {
        setAttachments((prev) =>
          prev.map((att) => {
            if (att.id === attachment.id) {
              const newProgress = Math.min((att.uploadProgress || 0) + 10, 100);
              if (newProgress === 100) {
                clearInterval(interval);
                return {
                  ...att,
                  uploadProgress: 100,
                  status: 'success' as const,
                  url: URL.createObjectURL(files),
                };
              }
              return { ...att, uploadProgress: newProgress };
            }
            return att;
          })
        );
      }, 200);
    });
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter((att) => att.id !== attachmentId));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        {/* Section Info Générales */}
        <Grid item xs={12}>
          <Box component={m.div} variants={varFade().inUp}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
              Informations générales
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="titre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Titre de l'exercice"
                fullWidth
                error={!!errors.titre}
                helperText={errors.titre?.message}
                placeholder="Ex: Quiz sur les verbes du premier groupe"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Décrivez brièvement l'objectif de cet exercice"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="instructions"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Instructions pour les élèves"
                fullWidth
                multiline
                rows={3}
                error={!!errors.instructions}
                helperText={errors.instructions?.message}
                placeholder="Expliquez aux élèves comment compléter cet exercice"
              />
            )}
          />
        </Grid>

        {/* Section Paramètres */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Box component={m.div} variants={varFade().inUp}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <FontAwesomeIcon icon={faClock} />
              Paramètres de l'exercice
            </Typography>
            <Divider sx={{ mb: 3 }} />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            component={m.div}
            variants={varFade().inLeft}
            elevation={0}
            sx={{
              p: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.lighter, 0.4),
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Controller
              name="timeLimit"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faClock} />
                    Durée limite: {value ? `${value} minutes` : 'Illimitée'}
                  </Typography>
                  <Slider
                    value={value || 0}
                    onChange={(_, newValue) => onChange(newValue as number)}
                    min={0}
                    max={180}
                    step={5}
                    marks={[
                      { value: 0, label: '∞' },
                      { value: 30, label: '30m' },
                      { value: 60, label: '1h' },
                      { value: 120, label: '2h' },
                      { value: 180, label: '3h' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => (v === 0 ? 'Illimitée' : `${v}min`)}
                  />
                </>
              )}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            component={m.div}
            variants={varFade().inRight}
            elevation={0}
            sx={{
              p: 3,
              bgcolor: (theme) => alpha(theme.palette.success.lighter, 0.4),
              border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Controller
              name="passingScore"
              control={control}
              render={({ field: { onChange, value } }) => (
                <>
                  <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesomeIcon icon={faPercent} />
                    Score de réussite: {value}%
                  </Typography>
                  <Slider
                    value={value}
                    onChange={(_, newValue) => onChange(newValue as number)}
                    min={0}
                    max={100}
                    step={5}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 70, label: '70%' },
                      { value: 100, label: '100%' },
                    ]}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(v) => `${v}%`}
                    color="success"
                  />
                </>
              )}
            />
          </Paper>
        </Grid>

        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Button variant="text" onClick={() => setShowAdvanced(!showAdvanced)} sx={{ mb: 2 }}>
            {showAdvanced ? 'Masquer' : 'Afficher'} les paramètres avancés
          </Button>

          <Collapse in={showAdvanced}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="shuffleQuestions"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Mélanger les questions"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="showCorrectAnswers"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <FontAwesomeIcon icon={faEye} />
                          Afficher les corrections
                        </Box>
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="maxAttempts"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Nombre max de tentatives"
                      fullWidth
                      InputProps={{
                        inputProps: { min: 1, max: 10 },
                        startAdornment: (
                          <FontAwesomeIcon icon={faRedo} style={{ marginRight: 8 }} />
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Collapse>
        </Grid>

        {/* Section Questions */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Box component={m.div} variants={varFade().inUp}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Questions ({questions.length})
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={`Total: ${calculateTotalPoints()} points`}
                  color="primary"
                  size="small"
                />
                <Button
                  variant="contained"
                  startIcon={<FontAwesomeIcon icon={faPlus} />}
                  onClick={addQuestion}
                  size="small"
                >
                  Ajouter une question
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          {questions.length === 0 ? (
            <Card
              component={m.div}
              variants={varFade().in}
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                border: '2px dashed',
                borderColor: (theme) => alpha(theme.palette.grey[500], 0.24),
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Aucune question ajoutée
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Cliquez sur "Ajouter une question" pour commencer à créer votre exercice
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addQuestion}
              >
                Ajouter la première question
              </Button>
            </Card>
          ) : (
            <Stack spacing={2}>
              <AnimatePresence>
                {questions.map((question, index) => (
                  <Card
                    key={question.id}
                    component={m.div}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    sx={{
                      p: 2.5,
                      position: 'relative',
                      border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.24)}`,
                      '&:hover': {
                        boxShadow: (theme) => theme.customShadows?.z8,
                      },
                    }}
                  >
                    <Stack spacing={2}>
                      {/* Question Header */}
                      <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: 1,
                              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                              color: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <FontAwesomeIcon icon={getQuestionIcon(question.type)} />
                            <Typography variant="caption" fontWeight="fontWeightMedium">
                              Q{index + 1}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography variant="subtitle2" fontWeight="fontWeightBold">
                              {question.question}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                              <Chip
                                label={getQuestionTypeLabel(question.type)}
                                size="small"
                                variant="outlined"
                              />
                              <Chip
                                label={`${question.points} points`}
                                size="small"
                                color="primary"
                              />
                            </Stack>
                          </Box>
                        </Stack>

                        {/* Actions */}
                        <Stack direction="row" spacing={0.5}>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveQuestion(index, 'up')}
                            disabled={index === 0}
                            sx={{ opacity: index === 0 ? 0.5 : 1 }}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} rotation={90} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveQuestion(index, 'down')}
                            disabled={index === questions.length - 1}
                            sx={{ opacity: index === questions.length - 1 ? 0.5 : 1 }}
                          >
                            <FontAwesomeIcon icon={faChevronLeft} rotation={270} />
                          </IconButton>
                          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                          <IconButton
                            size="small"
                            onClick={() => handleEditQuestion(question)}
                            color="primary"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteQuestion(question.id)}
                            color="error"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </IconButton>
                        </Stack>
                      </Stack>

                      {/* Question Preview */}
                      <Box sx={{ pl: 6 }}>
                        {question.type === 'multiple_choice' && (
                          <Stack spacing={1}>
                            {question.options.map((option, optIndex) => (
                              <Box
                                key={option.id}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: question.allowMultiple ? 0.5 : '50%',
                                    border: '2px solid',
                                    borderColor: option.isCorrect ? 'success.main' : 'grey.400',
                                    bgcolor: option.isCorrect ? 'success.lighter' : 'transparent',
                                  }}
                                />
                                <Typography variant="body2">{option.text}</Typography>
                              </Box>
                            ))}
                          </Stack>
                        )}

                        {question.type === 'true_false' && (
                          <Typography variant="body2" color="success.main">
                            Réponse correcte: {question.correctAnswer ? 'Vrai' : 'Faux'}
                          </Typography>
                        )}

                        {question.type === 'short_answer' && (
                          <Typography variant="body2" color="text.secondary">
                            {question.acceptedAnswers.length} réponse(s) acceptée(s)
                          </Typography>
                        )}

                        {question.type === 'essay' && (
                          <Typography variant="body2" color="text.secondary">
                            {question.minWords}-{question.maxWords} mots requis
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </AnimatePresence>
            </Stack>
          )}
        </Grid>

        {/* Section Documents */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Box component={m.div} variants={varFade().inUp}>
            <Divider sx={{ mb: 3 }} />
            <DocumentAttachment
              attachments={attachments}
              onAdd={handleAddAttachments}
              onRemove={handleRemoveAttachment}
              maxFiles={5}
              maxSize={10}
            />
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12} sx={{ mt: 4 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={onCancel}
              disabled={isSubmitting}
              startIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || questions.length === 0}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSave} />
              }
            >
              {initialValues.titre ? 'Mettre à jour' : "Créer l'exercice"}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Question Builder Dialog */}
      <QuestionBuilder
        open={showQuestionBuilder}
        onClose={() => {
          setShowQuestionBuilder(false);
          setEditingQuestion(undefined);
        }}
        onSave={handleSaveQuestion}
        editQuestion={editingQuestion}
      />
    </Box>
  );
};
