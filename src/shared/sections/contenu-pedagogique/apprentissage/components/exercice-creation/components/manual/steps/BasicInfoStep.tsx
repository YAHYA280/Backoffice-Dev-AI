// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/BasicInfoStep.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Chip,
  Stack,
  Select,
  MenuItem,
  TextField,
  useTheme,
  Typography,
  InputLabel,
  FormControl,
  Autocomplete,
  FormHelperText,
} from '@mui/material';

import { DIFFICULTY_OPTIONS, CREATION_LIMITS } from '../../../constants/creation-constants';
import type { CreationFormData, DifficultyLevel } from '../../../types/exercise-types';

interface BasicInfoStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !data.tags.includes(tag.trim())) {
      onChange({
        tags: [...data.tags, tag.trim()],
      });
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    onChange({
      tags: data.tags.filter((tag) => tag !== tagToRemove),
    });
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
              Informations de base
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Définissez les informations principales de votre exercice
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Titre */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Titre de l'exercice"
                value={data.title}
                onChange={(e) => onChange({ title: e.target.value })}
                error={!!errors.title}
                helperText={
                  errors.title || `${data.title.length}/${CREATION_LIMITS.title.max} caractères`
                }
                inputProps={{
                  maxLength: CREATION_LIMITS.title.max,
                }}
                placeholder="Ex: Les verbes du premier groupe au présent"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </m.div>
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={data.description}
                onChange={(e) => onChange({ description: e.target.value })}
                error={!!errors.description}
                helperText={
                  errors.description ||
                  `${data.description.length}/${CREATION_LIMITS.description.max} caractères`
                }
                inputProps={{
                  maxLength: CREATION_LIMITS.description.max,
                }}
                placeholder="Décrivez les objectifs et le contenu de l'exercice..."
              />
            </m.div>
          </Grid>

          {/* Sujet et Chapitre */}
          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Sujet"
                value={data.subject}
                onChange={(e) => onChange({ subject: e.target.value })}
                error={!!errors.subject}
                helperText={errors.subject}
                placeholder="Ex: Français, Mathématiques, Sciences..."
              />
            </m.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Chapitre"
                value={data.chapter}
                onChange={(e) => onChange({ chapter: e.target.value })}
                placeholder="Ex: Grammaire, Conjugaison..."
                disabled
                helperText="Le chapitre est défini automatiquement"
              />
            </m.div>
          </Grid>

          {/* Difficulté et Durée */}
          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Niveau de difficulté</InputLabel>
                <Select
                  value={data.difficulty}
                  label="Niveau de difficulté"
                  onChange={(e) => onChange({ difficulty: e.target.value as DifficultyLevel })}
                >
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: option.color,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {option.label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
                {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
              </FormControl>
            </m.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
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
                inputProps={{
                  min: CREATION_LIMITS.estimatedDuration.min,
                  max: CREATION_LIMITS.estimatedDuration.max,
                }}
                helperText={`Entre ${CREATION_LIMITS.estimatedDuration.min} et ${CREATION_LIMITS.estimatedDuration.max} minutes`}
              />
            </m.div>
          </Grid>

          {/* Tags */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom>
                  <FontAwesomeIcon icon={faTag} style={{ marginRight: 8 }} />
                  Mots-clés ({data.tags.length}/{CREATION_LIMITS.tags.max})
                </Typography>

                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={data.tags}
                  onChange={(_, newValue) => {
                    const validTags = newValue.slice(0, CREATION_LIMITS.tags.max);
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
                        sx={{
                          bgcolor: theme.palette.primary.lighter,
                          color: theme.palette.primary.main,
                          '& .MuiChip-deleteIcon': {
                            color: theme.palette.primary.main,
                            '&:hover': {
                              color: theme.palette.primary.dark,
                            },
                          },
                        }}
                        deleteIcon={
                          <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.8rem' }} />
                        }
                      />
                    ))
                  }
                  disabled={data.tags.length >= CREATION_LIMITS.tags.max}
                />
              </FormControl>
            </m.div>
          </Grid>

          {/* Aperçu des tags populaires */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Suggestions populaires :
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {['grammaire', 'conjugaison', 'orthographe', 'vocabulaire', 'compréhension'].map(
                  (tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      onClick={() => handleTagAdd(tag)}
                      disabled={
                        data.tags.includes(tag) || data.tags.length >= CREATION_LIMITS.tags.max
                      }
                      sx={{
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: theme.palette.primary.lighter,
                        },
                      }}
                      icon={<FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />}
                    />
                  )
                )}
              </Stack>
            </m.div>
          </Grid>

          {/* Résumé des informations */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Box
                sx={{
                  mt: 2,
                  p: 3,
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.lighter,
                  border: `1px solid ${theme.palette.primary.light}`,
                }}
              >
                <Typography variant="subtitle2" color="primary.main" gutterBottom>
                  📋 Résumé des informations
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Niveau
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {DIFFICULTY_OPTIONS.find((d) => d.value === data.difficulty)?.label ||
                        'Non défini'}
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
              </Box>
            </m.div>
          </Grid>
        </Grid>
      </m.div>
    </Box>
  );
};

export default BasicInfoStep;
