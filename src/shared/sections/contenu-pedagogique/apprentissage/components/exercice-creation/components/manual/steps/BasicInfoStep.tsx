// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/BasicInfoStep.tsx

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
  Autocomplete,
} from '@mui/material';

import type { CreationFormData, DifficultyLevel } from '../../../types/exercise-types';

interface BasicInfoStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Facile', description: 'Concepts de base et rappels' },
  { value: 'medium', label: 'Moyen', description: 'Application et analyse' },
  { value: 'hard', label: 'Difficile', description: 'Synthèse et évaluation' },
] as const;

const SUGGESTED_TAGS = [
  'grammaire',
  'conjugaison',
  'orthographe',
  'vocabulaire',
  'compréhension',
  'mathématiques',
  'sciences',
  'histoire',
  'géographie',
];

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, errors, onChange }) => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h6" gutterBottom>
      Informations de base
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
      Définissez les informations principales de votre exercice
    </Typography>

    <Grid container spacing={3}>
      {/* Title */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Titre de l'exercice"
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          error={!!errors.title}
          helperText={errors.title || `${data.title.length}/200 caractères`}
          inputProps={{ maxLength: 200 }}
          placeholder="Ex: Les verbes du premier groupe au présent"
        />
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          error={!!errors.description}
          helperText={errors.description || `${data.description.length}/1000 caractères`}
          inputProps={{ maxLength: 1000 }}
          placeholder="Décrivez les objectifs et le contenu de l'exercice..."
        />
      </Grid>

      {/* Subject and Chapter */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Sujet"
          value={data.subject}
          onChange={(e) => onChange({ subject: e.target.value })}
          error={!!errors.subject}
          helperText={errors.subject}
          placeholder="Ex: Français, Mathématiques, Sciences..."
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Chapitre"
          value={data.chapter}
          disabled
          helperText="Le chapitre est défini automatiquement"
        />
      </Grid>

      {/* Difficulty and Duration */}
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

      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          type="number"
          label="Durée estimée (minutes)"
          value={data.estimatedDuration}
          onChange={(e) =>
            onChange({
              estimatedDuration: Math.max(1, parseInt(e.target.value, 10) || 1),
            })
          }
          inputProps={{ min: 1, max: 300 }}
          helperText="Entre 1 et 300 minutes"
        />
      </Grid>

      {/* Tags */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Mots-clés ({data.tags.length}/20)
        </Typography>

        <Autocomplete
          multiple
          freeSolo
          options={SUGGESTED_TAGS}
          value={data.tags}
          onChange={(_, newValue) => {
            const validTags = newValue.slice(0, 20);
            onChange({ tags: validTags });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={data.tags.length === 0 ? 'Ajouter des mots-clés...' : ''}
              helperText="Appuyez sur Entrée pour ajouter un mot-clé"
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="primary"
              />
            ))
          }
          disabled={data.tags.length >= 20}
        />
      </Grid>

      {/* Summary */}
      <Grid item xs={12}>
        <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
          <Typography variant="subtitle2" color="primary.main" gutterBottom>
            📋 Résumé des informations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Niveau
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {DIFFICULTY_OPTIONS.find((d) => d.value === data.difficulty)?.label || 'Non défini'}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Durée estimée
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {data.estimatedDuration} min
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Mots-clés
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {data.tags.length} ajoutés
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" color="text.secondary">
                Progression
              </Typography>
              <Typography variant="body2" fontWeight="medium" color="success.main">
                ✓ Étape 1/4
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  </Box>
);

export default BasicInfoStep;
