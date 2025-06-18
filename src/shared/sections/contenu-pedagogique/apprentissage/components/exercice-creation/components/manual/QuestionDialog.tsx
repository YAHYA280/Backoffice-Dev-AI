'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faSave,
  faTimes,
  faTrash,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Select,
  Switch,
  useTheme,
  MenuItem,
  TextField,
  FormGroup,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  DialogTitle,
  Autocomplete,
  DialogContent,
  DialogActions,
  FormControlLabel,
} from '@mui/material';

import { Editor } from 'src/shared/components/editor';

import { DIFFICULTY_OPTIONS, QUESTION_TYPE_CONFIGS } from '../../constants/creation-constants';

import type {
  Question,
  QuestionType,
  QuestionFormData,
  MultipleChoiceOption,
} from '../../types/question-types';

interface QuestionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: QuestionFormData) => void;
  question?: Question | null;
  initialType?: QuestionType;
}

const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onClose,
  onSubmit,
  question,
  initialType = 'multiple_choice',
}) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<QuestionFormData>({
    type: initialType,
    title: '',
    content: '',
    points: 10,
    difficulty: 'medium',
    required: true,
    tags: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialiser le formulaire quand le dialog s'ouvre
  useEffect(() => {
    if (open) {
      if (question) {
        // Mode édition
        setFormData({
          type: question.type,
          title: question.title,
          content: question.content,
          points: question.points,
          difficulty: question.difficulty,
          required: question.required,
          tags: question.tags,
          ...(question.type === 'multiple_choice' && {
            options: (question as any).options || [],
            allowMultiple: (question as any).allowMultiple || false,
          }),
          ...(question.type === 'true_false' && {
            correctAnswer: (question as any).correctAnswer,
          }),
          ...(question.type === 'short_answer' && {
            correctAnswers: (question as any).correctAnswers || [],
            caseSensitive: (question as any).caseSensitive || false,
            exactMatch: (question as any).exactMatch || false,
            maxLength: (question as any).maxLength || 100,
          }),
        });
      } else {
        // Mode création
        setFormData({
          type: initialType,
          title: '',
          content: '',
          points: 10,
          difficulty: 'medium',
          required: true,
          tags: [],
          ...(initialType === 'multiple_choice' && {
            options: [
              { id: '1', text: '', isCorrect: false, order: 0 },
              { id: '2', text: '', isCorrect: false, order: 1 },
            ],
            allowMultiple: false,
          }),
        });
      }
      setErrors({});
    }
  }, [open, question, initialType]);

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    // Validation générale
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Le contenu est obligatoire';
    }
    if (formData.points <= 0) {
      newErrors.points = 'Les points doivent être supérieurs à 0';
    }

    // Validation spécifique par type
    if (formData.type === 'multiple_choice') {
      if (!formData.options || formData.options.length < 2) {
        newErrors.options = 'Au moins 2 options sont requises';
      } else {
        const correctOptions = formData.options.filter((opt) => opt.isCorrect);
        if (correctOptions.length === 0) {
          newErrors.options = 'Au moins une option correcte est requise';
        }
      }
    }

    if (formData.type === 'true_false' && formData.correctAnswer === undefined) {
      newErrors.correctAnswer = 'Veuillez sélectionner la réponse correcte';
    }

    if (formData.type === 'short_answer') {
      if (!formData.correctAnswers || formData.correctAnswers.length === 0) {
        newErrors.correctAnswers = 'Au moins une réponse correcte est requise';
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handleTypeChange = (newType: QuestionType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      // Réinitialiser les données spécifiques au type
      ...(newType === 'multiple_choice' && {
        options: [
          { id: '1', text: '', isCorrect: false, order: 0 },
          { id: '2', text: '', isCorrect: false, order: 1 },
        ],
        allowMultiple: false,
      }),
      ...(newType === 'true_false' && {
        correctAnswer: undefined,
      }),
      ...(newType === 'short_answer' && {
        correctAnswers: [],
        caseSensitive: false,
        exactMatch: false,
        maxLength: 100,
      }),
    }));
  };

  const addOption = () => {
    if (formData.options) {
      const newOption: MultipleChoiceOption = {
        id: `${Date.now()}`,
        text: '',
        isCorrect: false,
        order: formData.options.length,
      };
      setFormData((prev) => ({
        ...prev,
        options: [...(prev.options || []), newOption],
      }));
    }
  };

  const updateOption = (optionId: string, updates: Partial<MultipleChoiceOption>) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).map((opt) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      ),
    }));
  };

  const removeOption = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      options: (prev.options || []).filter((opt) => opt.id !== optionId),
    }));
  };

  const addCorrectAnswer = () => {
    setFormData((prev) => ({
      ...prev,
      correctAnswers: [...(prev.correctAnswers || []), ''],
    }));
  };

  const updateCorrectAnswer = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswers: (prev.correctAnswers || []).map((answer, i) =>
        i === index ? value : answer
      ),
    }));
  };

  const removeCorrectAnswer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      correctAnswers: (prev.correctAnswers || []).filter((_, i) => i !== index),
    }));
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'multiple_choice':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Options de réponse
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={formData.allowMultiple || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      allowMultiple: e.target.checked,
                    }))
                  }
                />
              }
              label="Autoriser plusieurs réponses correctes"
              sx={{ mb: 2 }}
            />

            <Stack spacing={2}>
              {(formData.options || []).map((option, index) => (
                <Card key={option.id} sx={{ p: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <IconButton size="small">
                      <FontAwesomeIcon icon={faGripVertical} />
                    </IconButton>

                    <TextField
                      fullWidth
                      label={`Option ${index + 1}`}
                      value={option.text}
                      onChange={(e) => updateOption(option.id, { text: e.target.value })}
                      placeholder="Texte de l'option..."
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={option.isCorrect}
                          onChange={(e) => updateOption(option.id, { isCorrect: e.target.checked })}
                          color="success"
                        />
                      }
                      label="Correcte"
                    />

                    {(formData.options || []).length > 2 && (
                      <IconButton
                        onClick={() => removeOption(option.id)}
                        color="error"
                        size="small"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    )}
                  </Stack>
                </Card>
              ))}

              <Button
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addOption}
                variant="outlined"
                disabled={(formData.options || []).length >= 6}
              >
                Ajouter une option
              </Button>
            </Stack>

            {errors.options && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.options}
              </Typography>
            )}
          </Box>
        );

      case 'true_false':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Réponse correcte
            </Typography>
            <FormControl component="fieldset">
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.correctAnswer === true}
                      onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: true }))}
                      color="success"
                    />
                  }
                  label="Vrai"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.correctAnswer === false}
                      onChange={() => setFormData((prev) => ({ ...prev, correctAnswer: false }))}
                      color="error"
                    />
                  }
                  label="Faux"
                />
              </FormGroup>
            </FormControl>
            {errors.correctAnswer && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.correctAnswer}
              </Typography>
            )}
          </Box>
        );

      case 'short_answer':
        return (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Réponses acceptées
            </Typography>

            <Stack spacing={2}>
              {(formData.correctAnswers || []).map((answer, index) => (
                <Stack key={index} direction="row" spacing={2} alignItems="center">
                  <TextField
                    fullWidth
                    label={`Réponse ${index + 1}`}
                    value={answer}
                    onChange={(e) => updateCorrectAnswer(index, e.target.value)}
                    placeholder="Réponse acceptée..."
                  />

                  {(formData.correctAnswers || []).length > 1 && (
                    <IconButton
                      onClick={() => removeCorrectAnswer(index)}
                      color="error"
                      size="small"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  )}
                </Stack>
              ))}

              <Button
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                onClick={addCorrectAnswer}
                variant="outlined"
              >
                Ajouter une réponse alternative
              </Button>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.caseSensitive || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        caseSensitive: e.target.checked,
                      }))
                    }
                  />
                }
                label="Sensible à la casse"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.exactMatch || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        exactMatch: e.target.checked,
                      }))
                    }
                  />
                }
                label="Correspondance exacte"
              />
            </Stack>

            {errors.correctAnswers && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.correctAnswers}
              </Typography>
            )}
          </Box>
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Configuration spécifique pour ce type de question à venir...
          </Typography>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          position: 'relative',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {question ? 'Modifier la question' : 'Nouvelle question'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          {QUESTION_TYPE_CONFIGS[formData.type]?.label || 'Question personnalisée'}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Type de question */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Type de question</InputLabel>
              <Select
                value={formData.type}
                label="Type de question"
                onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
              >
                {Object.values(QUESTION_TYPE_CONFIGS).map((config) => (
                  <MenuItem key={config.type} value={config.type}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Chip label={config.category} size="small" variant="outlined" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {config.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {config.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Titre */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Titre de la question"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Ex: Quelle est la forme correcte du verbe ?"
            />
          </Grid>

          {/* Contenu */}
          <Grid item xs={12}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Énoncé de la question
              </Typography>
              <Editor
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                error={!!errors.content}
                helperText={errors.content}
                placeholder="Rédigez l'énoncé complet de votre question..."
              />
            </Box>
          </Grid>

          {/* Points et difficulté */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Points"
              value={formData.points}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  points: Math.max(1, parseInt(e.target.value, 10) || 1),
                }))
              }
              inputProps={{ min: 1, max: 100 }}
              error={!!errors.points}
              helperText={errors.points}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Difficulté</InputLabel>
              <Select
                value={formData.difficulty}
                label="Difficulté"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    difficulty: e.target.value as any,
                  }))
                }
              >
                {DIFFICULTY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: option.color,
                        }}
                      />
                      <Typography>{option.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Configuration spécifique au type */}
          <Grid item xs={12}>
            {renderTypeSpecificFields()}
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.tags}
              onChange={(_, newValue) => setFormData((prev) => ({ ...prev, tags: newValue }))}
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Ajouter des tags..." />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
            />
          </Grid>

          {/* Options avancées */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.required}
                  onChange={(e) => setFormData((prev) => ({ ...prev, required: e.target.checked }))}
                />
              }
              label="Question obligatoire"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          startIcon={<FontAwesomeIcon icon={faSave} />}
          sx={{ minWidth: 120 }}
        >
          {question ? 'Mettre à jour' : 'Créer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionDialog;
