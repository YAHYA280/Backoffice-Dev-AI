'use client';

import { z } from 'zod';
import { useState } from 'react';
import { m } from 'framer-motion';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTimes,
  faCheck,
  faTrash,
  faListOl,
  faCheckCircle,
  faTimesCircle,
  faPenAlt,
  faAlignLeft,
  faGripLines,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Stack,
  Radio,
  Button,
  Dialog,
  Switch,
  TextField,
  Typography,
  IconButton,
  RadioGroup,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  FormControlLabel,
  alpha,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate';

import type { QuestionType } from '../../../types';

const questionTypes = [
  { value: 'multiple_choice', label: 'Choix multiple', icon: faListOl, color: 'primary' },
  { value: 'true_false', label: 'Vrai/Faux', icon: faCheckCircle, color: 'success' },
  { value: 'short_answer', label: 'Réponse courte', icon: faPenAlt, color: 'info' },
  { value: 'essay', label: 'Rédaction', icon: faAlignLeft, color: 'warning' },
  { value: 'fill_blank', label: 'Texte à trous', icon: faGripLines, color: 'error' },
] as const;

type QuestionTypeValue = (typeof questionTypes)[number]['value'];

// Generate a simple ID without uuid
const generateId = () => `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Generic form data interface
interface BaseFormData {
  question: string;
  points: number;
  explanation?: string;
}

interface MultipleChoiceFormData extends BaseFormData {
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  allowMultiple?: boolean;
}

interface TrueFalseFormData extends BaseFormData {
  correctAnswer: boolean;
}

interface ShortAnswerFormData extends BaseFormData {
  caseSensitive?: boolean;
}

interface EssayFormData extends BaseFormData {
  minWords?: number;
  maxWords?: number;
  rubric?: string;
}

// Use a generic schema that accepts all fields
const formSchema = z.object({
  question: z.string().min(10, 'La question doit contenir au moins 10 caractères'),
  points: z.number().min(1, 'Les points doivent être supérieurs à 0'),
  explanation: z.string().optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, 'Le texte est requis'),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  allowMultiple: z.boolean().optional(),
  correctAnswer: z.boolean().optional(),
  caseSensitive: z.boolean().optional(),
  minWords: z.number().optional(),
  maxWords: z.number().optional(),
  rubric: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface QuestionBuilderProps {
  open: boolean;
  onClose: () => void;
  onSave: (question: QuestionType) => void;
  editQuestion?: QuestionType;
}

export const QuestionBuilder = ({ open, onClose, onSave, editQuestion }: QuestionBuilderProps) => {
  const [selectedType, setSelectedType] = useState<QuestionTypeValue>(
    editQuestion?.type || 'multiple_choice'
  );
  const [acceptedAnswers, setAcceptedAnswers] = useState<string[]>(
    editQuestion?.type === 'short_answer' ? editQuestion.acceptedAnswers : ['']
  );

  const getDefaultValues = (): FormData => {
    const baseDefaults = {
      question: '',
      points: 10,
      explanation: '',
    };

    if (editQuestion) {
      const baseEditData = {
        question: editQuestion.question,
        points: editQuestion.points,
        explanation: editQuestion.explanation || '',
      };

      switch (editQuestion.type) {
        case 'multiple_choice':
          return {
            ...baseEditData,
            options: editQuestion.options,
            allowMultiple: editQuestion.allowMultiple || false,
          };
        case 'true_false':
          return {
            ...baseEditData,
            correctAnswer: editQuestion.correctAnswer,
          };
        case 'short_answer':
          setAcceptedAnswers(editQuestion.acceptedAnswers);
          return {
            ...baseEditData,
            caseSensitive: editQuestion.caseSensitive || false,
          };
        case 'essay':
          return {
            ...baseEditData,
            minWords: editQuestion.minWords || 50,
            maxWords: editQuestion.maxWords || 500,
            rubric: editQuestion.rubric || '',
          };
        default:
          return baseEditData;
      }
    }

    switch (selectedType) {
      case 'multiple_choice':
        return {
          ...baseDefaults,
          options: [
            { id: generateId(), text: '', isCorrect: true },
            { id: generateId(), text: '', isCorrect: false },
          ],
          allowMultiple: false,
        };
      case 'true_false':
        return {
          ...baseDefaults,
          points: 5,
          correctAnswer: true,
        };
      case 'short_answer':
        return {
          ...baseDefaults,
          caseSensitive: false,
        };
      case 'essay':
        return {
          ...baseDefaults,
          points: 20,
          minWords: 50,
          maxWords: 500,
          rubric: '',
        };
      default:
        return baseDefaults;
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'options',
  });

  const watchAllowMultiple = watch('allowMultiple');

  const handleTypeChange = (newType: QuestionTypeValue) => {
    setSelectedType(newType);
    reset(getDefaultValues());
    if (newType === 'short_answer') {
      setAcceptedAnswers(['']);
    }
  };

  const handleSave = (data: FormData) => {
    const baseQuestion = {
      id: editQuestion?.id || generateId(),
      question: data.question,
      points: data.points,
      explanation: data.explanation || undefined,
      order: editQuestion?.order || 0,
    };

    let question: QuestionType;

    switch (selectedType) {
      case 'multiple_choice':
        if (!data.options || data.options.length < 2) return;
        question = {
          ...baseQuestion,
          type: 'multiple_choice',
          options: data.options,
          allowMultiple: data.allowMultiple || false,
        };
        break;
      case 'true_false':
        question = {
          ...baseQuestion,
          type: 'true_false',
          correctAnswer: data.correctAnswer || true,
        };
        break;
      case 'short_answer':
        question = {
          ...baseQuestion,
          type: 'short_answer',
          acceptedAnswers: acceptedAnswers.filter((answer) => answer.trim() !== ''),
          caseSensitive: data.caseSensitive || false,
        };
        break;
      case 'essay':
        question = {
          ...baseQuestion,
          type: 'essay',
          minWords: data.minWords,
          maxWords: data.maxWords,
          rubric: data.rubric,
        };
        break;
      case 'fill_blank':
        question = {
          ...baseQuestion,
          type: 'fill_blank',
          blanks: [],
        };
        break;
      default:
        return;
    }

    onSave(question);
    handleClose();
  };

  const handleClose = () => {
    reset();
    setSelectedType('multiple_choice');
    setAcceptedAnswers(['']);
    onClose();
  };

  const handleRadioChange = (index: number) => {
    fields.forEach((field, i) => {
      update(i, { ...field, isCorrect: i === index });
    });
  };

  const renderQuestionTypeSelector = () => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Type de question
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {questionTypes.map((type) => (
          <Chip
            key={type.value}
            label={type.label}
            icon={<FontAwesomeIcon icon={type.icon} />}
            onClick={() => handleTypeChange(type.value)}
            color={selectedType === type.value ? (type.color as any) : 'default'}
            variant={selectedType === type.value ? 'filled' : 'outlined'}
            sx={{ m: 0.5, cursor: 'pointer' }}
          />
        ))}
      </Stack>
    </Box>
  );

  const renderQuestionFields = () => {
    switch (selectedType) {
      case 'multiple_choice':
        return (
          <Box component={m.div} variants={varFade().in}>
            <Controller
              name="allowMultiple"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value || false} />}
                  label="Autoriser plusieurs réponses correctes"
                  sx={{ mb: 2 }}
                />
              )}
            />

            <Typography variant="subtitle2" gutterBottom>
              Options de réponse
            </Typography>

            <Stack spacing={2}>
              {fields.map((field, index) => (
                <Card
                  key={field.id}
                  component={m.div}
                  variants={varFade().inUp}
                  sx={{
                    p: 2,
                    bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Controller
                      name={`options.${index}.isCorrect`}
                      control={control}
                      render={({ field: radioField }) =>
                        watchAllowMultiple ? (
                          <Switch {...radioField} checked={radioField.value} color="success" />
                        ) : (
                          <Radio
                            checked={radioField.value}
                            onChange={() => handleRadioChange(index)}
                            color="success"
                          />
                        )
                      }
                    />

                    <Controller
                      name={`options.${index}.text`}
                      control={control}
                      render={({ field: textField }) => (
                        <TextField
                          {...textField}
                          fullWidth
                          placeholder={`Option ${index + 1}`}
                          error={!!errors.options?.[index]?.text}
                          helperText={errors.options?.[index]?.text?.message}
                        />
                      )}
                    />

                    {fields.length > 2 && (
                      <IconButton size="small" onClick={() => remove(index)} color="error">
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>

            <Button
              variant="outlined"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={() => append({ id: generateId(), text: '', isCorrect: false })}
              sx={{ mt: 2 }}
              fullWidth
            >
              Ajouter une option
            </Button>
          </Box>
        );

      case 'true_false':
        return (
          <Box component={m.div} variants={varFade().in}>
            <Controller
              name="correctAnswer"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <Typography variant="subtitle2" gutterBottom>
                    Réponse correcte
                  </Typography>
                  <RadioGroup
                    row
                    value={field.value ? 'true' : 'false'}
                    onChange={(e) => field.onChange(e.target.value === 'true')}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio color="success" />}
                      label={
                        <Chip
                          icon={<FontAwesomeIcon icon={faCheckCircle} />}
                          label="Vrai"
                          color="success"
                          variant={field.value === true ? 'filled' : 'outlined'}
                        />
                      }
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio color="error" />}
                      label={
                        <Chip
                          icon={<FontAwesomeIcon icon={faTimesCircle} />}
                          label="Faux"
                          color="error"
                          variant={field.value === false ? 'filled' : 'outlined'}
                        />
                      }
                    />
                  </RadioGroup>
                </FormControl>
              )}
            />
          </Box>
        );

      case 'short_answer':
        return (
          <Box component={m.div} variants={varFade().in}>
            <Typography variant="subtitle2" gutterBottom>
              Réponses acceptées
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={acceptedAnswers.join('\n')}
              onChange={(e) => setAcceptedAnswers(e.target.value.split('\n'))}
              placeholder="Entrez les réponses acceptées, une par ligne"
              helperText="Séparez chaque réponse acceptée par un retour à la ligne"
              sx={{ mb: 2 }}
            />

            <Controller
              name="caseSensitive"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch {...field} checked={field.value || false} />}
                  label="Sensible à la casse"
                />
              )}
            />
          </Box>
        );

      case 'essay':
        return (
          <Box component={m.div} variants={varFade().in}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <Controller
                  name="minWords"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Nombre min de mots"
                      fullWidth
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                      }
                    />
                  )}
                />
                <Controller
                  name="maxWords"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Nombre max de mots"
                      fullWidth
                      onChange={(e) =>
                        field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)
                      }
                    />
                  )}
                />
              </Stack>

              <Controller
                name="rubric"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Grille d'évaluation"
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Décrivez les critères d'évaluation pour cette rédaction"
                  />
                )}
              />
            </Stack>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ position: 'relative', p: 3 }}>
        <Typography variant="h6">
          {editQuestion ? 'Modifier la question' : 'Nouvelle question'}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <form onSubmit={handleSubmit(handleSave)}>
          {!editQuestion && renderQuestionTypeSelector()}

          <Stack spacing={3}>
            <Controller
              name="question"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question"
                  multiline
                  rows={3}
                  fullWidth
                  error={!!errors.question}
                  helperText={errors.question?.message}
                  placeholder="Entrez votre question ici..."
                />
              )}
            />

            <Stack direction="row" spacing={2}>
              <Controller
                name="points"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="number"
                    label="Points"
                    onChange={(e) => field.onChange(parseInt(e.target.value || '0', 10))}
                    sx={{ width: 120 }}
                    error={!!errors.points}
                    helperText={errors.points?.message}
                  />
                )}
              />

              <Controller
                name="explanation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Explication (optionnel)"
                    fullWidth
                    placeholder="Explication affichée après la réponse"
                  />
                )}
              />
            </Stack>

            {renderQuestionFields()}
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleClose} variant="outlined">
          Annuler
        </Button>
        <Button
          onClick={handleSubmit(handleSave)}
          variant="contained"
          startIcon={<FontAwesomeIcon icon={editQuestion ? faCheck : faPlus} />}
        >
          {editQuestion ? 'Mettre à jour' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
