// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/QuestionConfigStep.tsx

'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  Chip,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  IconButton,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

import type { AiFormData, DifficultyDistribution } from '../../../types/ai-types';
import type { QuestionType } from '../../../types/question-types';

interface QuestionConfigStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
}

const QUESTION_TYPES = [
  { value: 'multiple_choice', label: 'Choix multiples', description: 'Questions avec options' },
  { value: 'true_false', label: 'Vrai/Faux', description: 'Questions binaires' },
  { value: 'short_answer', label: 'Réponse courte', description: 'Réponses textuelles brèves' },
  { value: 'long_answer', label: 'Réponse longue', description: 'Réponses développées' },
] as const;

const QuestionConfigStep: React.FC<QuestionConfigStepProps> = ({ data, errors, onChange }) => {
  const handleQuestionTypeToggle = (type: QuestionType) => {
    const newTypes = data.questionTypes.includes(type)
      ? data.questionTypes.filter((t) => t !== type)
      : [...data.questionTypes, type];
    onChange({ questionTypes: newTypes });
  };

  const handleDifficultyChange = (difficulty: keyof DifficultyDistribution, value: number) => {
    const newDistribution = { ...data.difficultyDistribution };
    newDistribution[difficulty] = value;

    // Ensure total is 100%
    const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      const others = Object.keys(newDistribution).filter((k) => k !== difficulty) as Array<
        keyof DifficultyDistribution
      >;
      const remainingTotal = 100 - value;
      const otherTotal = others.reduce((sum, key) => sum + newDistribution[key], 0);

      if (otherTotal > 0) {
        others.forEach((key) => {
          newDistribution[key] = Math.round((newDistribution[key] / otherTotal) * remainingTotal);
        });
      }
    }

    onChange({ difficultyDistribution: newDistribution });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configuration des questions
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Définissez le nombre et les types de questions à générer
      </Typography>

      <Grid container spacing={3}>
        {/* Number of questions */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Nombre de questions
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconButton
                onClick={() => onChange({ questionCount: Math.max(1, data.questionCount - 1) })}
                disabled={data.questionCount <= 1}
              >
                <Remove />
              </IconButton>

              <TextField
                type="number"
                value={data.questionCount}
                onChange={(e) =>
                  onChange({
                    questionCount: Math.max(1, Math.min(50, parseInt(e.target.value, 10) || 1)),
                  })
                }
                inputProps={{ min: 1, max: 50 }}
                sx={{ width: 100 }}
                error={!!errors.questionCount}
              />

              <IconButton
                onClick={() => onChange({ questionCount: Math.min(50, data.questionCount + 1) })}
                disabled={data.questionCount >= 50}
              >
                <Add />
              </IconButton>

              <Typography variant="body2" color="text.secondary">
                questions au total
              </Typography>
            </Box>

            {errors.questionCount && (
              <Typography variant="body2" color="error">
                {errors.questionCount}
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Question types */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Types de questions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sélectionnez les types de questions que l'IA peut utiliser
            </Typography>

            <Grid container spacing={2}>
              {QUESTION_TYPES.map((type) => (
                <Grid item xs={12} sm={6} key={type.value}>
                  <Card
                    sx={{
                      p: 2,
                      border: data.questionTypes.includes(type.value) ? 2 : 1,
                      borderColor: data.questionTypes.includes(type.value)
                        ? 'primary.main'
                        : 'divider',
                      cursor: 'pointer',
                      bgcolor: data.questionTypes.includes(type.value)
                        ? 'primary.lighter'
                        : 'background.paper',
                    }}
                    onClick={() => handleQuestionTypeToggle(type.value)}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {type.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {type.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {data.questionTypes.length === 0 && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Veuillez sélectionner au moins un type de question
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Difficulty distribution */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Répartition de la difficulté
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Définissez la proportion de questions par niveau de difficulté
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Questions faciles: {data.difficultyDistribution.easy}%
                </Typography>
                <Slider
                  value={data.difficultyDistribution.easy}
                  onChange={(_, value) => handleDifficultyChange('easy', value as number)}
                  min={0}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                  color="success"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Questions moyennes: {data.difficultyDistribution.medium}%
                </Typography>
                <Slider
                  value={data.difficultyDistribution.medium}
                  onChange={(_, value) => handleDifficultyChange('medium', value as number)}
                  min={0}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                  color="warning"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                  Questions difficiles: {data.difficultyDistribution.hard}%
                </Typography>
                <Slider
                  value={data.difficultyDistribution.hard}
                  onChange={(_, value) => handleDifficultyChange('hard', value as number)}
                  min={0}
                  max={100}
                  step={5}
                  valueLabelDisplay="auto"
                  color="error"
                />
              </Grid>
            </Grid>

            {/* Preview */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="medium" gutterBottom>
                Aperçu pour {data.questionCount} questions :
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`${Math.round((data.difficultyDistribution.easy / 100) * data.questionCount)} faciles`}
                  size="small"
                  color="success"
                />
                <Chip
                  label={`${Math.round((data.difficultyDistribution.medium / 100) * data.questionCount)} moyennes`}
                  size="small"
                  color="warning"
                />
                <Chip
                  label={`${Math.round((data.difficultyDistribution.hard / 100) * data.questionCount)} difficiles`}
                  size="small"
                  color="error"
                />
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionConfigStep;
