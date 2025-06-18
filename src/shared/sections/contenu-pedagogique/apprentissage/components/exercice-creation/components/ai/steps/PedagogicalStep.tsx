// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/PedagogicalStep.tsx

'use client';

import React from 'react';
import { Box, Grid, Card, Chip, TextField, Typography, Autocomplete } from '@mui/material';

import type { AiFormData, BloomLevel } from '../../../types/ai-types';

interface PedagogicalStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
}

const SUGGESTED_OBJECTIVES = [
  'Identifier les différents temps de conjugaison',
  'Appliquer les règles de grammaire',
  'Analyser un texte littéraire',
  'Résoudre des équations du premier degré',
  'Comprendre les concepts fondamentaux',
  "Développer l'esprit critique",
  'Mémoriser les formules essentielles',
  'Créer des productions originales',
];

const SUGGESTED_COMPETENCIES = [
  'Expression écrite',
  'Compréhension de texte',
  'Raisonnement logique',
  'Analyse critique',
  'Résolution de problèmes',
  'Créativité',
  'Mémorisation',
  'Synthèse',
];

const BLOOM_LEVELS = [
  {
    value: 'remember',
    label: 'Se souvenir',
    description: 'Mémoriser et rappeler',
    color: '#E3F2FD',
  },
  {
    value: 'understand',
    label: 'Comprendre',
    description: 'Expliquer des idées',
    color: '#E8F5E8',
  },
  {
    value: 'apply',
    label: 'Appliquer',
    description: 'Utiliser dans de nouvelles situations',
    color: '#FFF3E0',
  },
  { value: 'analyze', label: 'Analyser', description: 'Décomposer et examiner', color: '#FCE4EC' },
  { value: 'evaluate', label: 'Évaluer', description: 'Porter des jugements', color: '#F3E5F5' },
  {
    value: 'create',
    label: 'Créer',
    description: 'Produire quelque chose de nouveau',
    color: '#FFEBEE',
  },
] as const;

const PedagogicalStep: React.FC<PedagogicalStepProps> = ({ data, errors, onChange }) => {
  const handleBloomLevelToggle = (level: BloomLevel) => {
    const newLevels = data.bloomTaxonomyLevels.includes(level)
      ? data.bloomTaxonomyLevels.filter((l) => l !== level)
      : [...data.bloomTaxonomyLevels, level];
    onChange({ bloomTaxonomyLevels: newLevels });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Objectifs pédagogiques
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Définissez les compétences et objectifs d'apprentissage visés
      </Typography>

      <Grid container spacing={3}>
        {/* Learning Objectives */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Objectifs d'apprentissage
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Que doivent apprendre ou maîtriser les étudiants avec cet exercice ?
            </Typography>

            <Autocomplete
              multiple
              freeSolo
              options={SUGGESTED_OBJECTIVES}
              value={data.learningObjectives}
              onChange={(_, newValue) => onChange({ learningObjectives: newValue })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ajoutez des objectifs d'apprentissage..."
                  helperText="Décrivez ce que les étudiants doivent acquérir"
                  error={!!errors.learningObjectives}
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="success"
                  />
                ))
              }
            />

            {errors.learningObjectives && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errors.learningObjectives}
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Competencies */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Compétences à développer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Quelles compétences transversales cet exercice permet-il de travailler ?
            </Typography>

            <Autocomplete
              multiple
              freeSolo
              options={SUGGESTED_COMPETENCIES}
              value={data.competencies}
              onChange={(_, newValue) => onChange({ competencies: newValue })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Ajoutez des compétences..."
                  helperText="Compétences générales ou transversales"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                  />
                ))
              }
            />
          </Card>
        </Grid>

        {/* Bloom Taxonomy */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Niveaux cognitifs (Taxonomie de Bloom)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Sélectionnez les niveaux de complexité cognitive à cibler
            </Typography>

            <Grid container spacing={2}>
              {BLOOM_LEVELS.map((level) => (
                <Grid item xs={12} sm={6} md={4} key={level.value}>
                  <Card
                    sx={{
                      p: 2,
                      border: data.bloomTaxonomyLevels.includes(level.value) ? 2 : 1,
                      borderColor: data.bloomTaxonomyLevels.includes(level.value)
                        ? 'primary.main'
                        : 'divider',
                      cursor: 'pointer',
                      bgcolor: data.bloomTaxonomyLevels.includes(level.value)
                        ? level.color
                        : 'background.paper',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: level.color,
                      },
                    }}
                    onClick={() => handleBloomLevelToggle(level.value)}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      {level.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {level.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {data.bloomTaxonomyLevels.length === 0 && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                Veuillez sélectionner au moins un niveau cognitif
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Summary */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, bgcolor: 'success.lighter' }}>
            <Typography variant="subtitle1" fontWeight="bold" color="success.main" gutterBottom>
              🎯 Résumé pédagogique
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Objectifs d'apprentissage
                </Typography>
                {data.learningObjectives.length > 0 ? (
                  <Box>
                    {data.learningObjectives.slice(0, 2).map((objective, index) => (
                      <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                        • {objective}
                      </Typography>
                    ))}
                    {data.learningObjectives.length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{data.learningObjectives.length - 2} autres...
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aucun objectif défini
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Compétences visées
                </Typography>
                {data.competencies.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {data.competencies.slice(0, 3).map((competency) => (
                      <Chip
                        key={competency}
                        label={competency}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                    {data.competencies.length > 3 && (
                      <Chip
                        label={`+${data.competencies.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aucune compétence définie
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Niveaux cognitifs
                </Typography>
                {data.bloomTaxonomyLevels.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {data.bloomTaxonomyLevels.map((level) => {
                      const bloomLevel = BLOOM_LEVELS.find((bl) => bl.value === level);
                      return (
                        <Chip
                          key={level}
                          label={bloomLevel?.label || level}
                          size="small"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      );
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aucun niveau sélectionné
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PedagogicalStep;
