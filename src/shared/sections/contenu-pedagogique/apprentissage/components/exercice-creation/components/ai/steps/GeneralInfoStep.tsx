// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/GeneralInfoStep.tsx

'use client';

import React from 'react';
import {
  Box,
  Grid,
  Card,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Autocomplete,
} from '@mui/material';

import type { AiFormData } from '../../../types/ai-types';
import type { DifficultyLevel } from '../../../types/exercise-types';

interface GeneralInfoStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Facile', description: 'Concepts de base' },
  { value: 'medium', label: 'Moyen', description: 'Application pratique' },
  { value: 'hard', label: 'Difficile', description: 'Analyse avancée' },
] as const;

const SUGGESTED_TOPICS = [
  'Grammaire française',
  'Conjugaison des verbes',
  'Mathématiques niveau collège',
  'Histoire de France',
  'Sciences physiques',
  'Géographie mondiale',
  'Littérature classique',
  'Anglais débutant',
];

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ data, errors, onChange }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Informations générales
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
      Décrivez votre sujet pour que l'IA génère un exercice adapté
    </Typography>

    <Grid container spacing={3}>
      {/* Topic */}
      <Grid item xs={12}>
        <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Sujet de l'exercice
          </Typography>

          <Autocomplete
            freeSolo
            options={SUGGESTED_TOPICS}
            value={data.topic}
            onChange={(_, newValue) => onChange({ topic: newValue || '' })}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Sujet principal"
                error={!!errors.topic}
                helperText={errors.topic || 'Ex: Conjugaison des verbes du premier groupe'}
                placeholder="Décrivez le sujet de votre exercice..."
                fullWidth
              />
            )}
          />
        </Card>
      </Grid>

      {/* Subtopics */}
      <Grid item xs={12}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Sous-sujets spécifiques
        </Typography>

        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={data.subtopics}
          onChange={(_, newValue) => onChange({ subtopics: newValue })}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Ajoutez des sous-sujets spécifiques..."
              helperText="Précisez les aspects particuliers à couvrir"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="secondary"
              />
            ))
          }
        />
      </Grid>

      {/* Educational Level and Difficulty */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Niveau éducatif"
          value={data.educationalLevel}
          onChange={(e) => onChange({ educationalLevel: e.target.value })}
          placeholder="Ex: 6ème, Terminale, Licence..."
          helperText="Précisez le niveau scolaire ou académique visé"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.difficulty}>
          <InputLabel>Niveau de difficulté</InputLabel>
          <Select
            value={data.difficulty}
            label="Niveau de difficulté"
            onChange={(e) => onChange({ difficulty: e.target.value as DifficultyLevel })}
          >
            {DIFFICULTY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.description}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Preview */}
      <Grid item xs={12}>
        <Card sx={{ p: 3, border: '2px dashed', borderColor: 'secondary.light' }}>
          <Typography variant="subtitle2" color="secondary.main" gutterBottom>
            🎯 Aperçu de ce que l'IA va générer
          </Typography>

          {data.topic ? (
            <Box>
              <Typography variant="body2">
                <strong>Sujet :</strong> {data.topic}
                {data.educationalLevel && ` (niveau ${data.educationalLevel})`}
              </Typography>

              {data.subtopics.length > 0 && (
                <Typography variant="body2">
                  <strong>Focus sur :</strong> {data.subtopics.join(', ')}
                </Typography>
              )}

              <Typography variant="body2">
                <strong>Difficulté :</strong>{' '}
                {DIFFICULTY_OPTIONS.find((d) => d.value === data.difficulty)?.label}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              Commencez par définir un sujet pour voir l'aperçu...
            </Typography>
          )}
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default GeneralInfoStep;
