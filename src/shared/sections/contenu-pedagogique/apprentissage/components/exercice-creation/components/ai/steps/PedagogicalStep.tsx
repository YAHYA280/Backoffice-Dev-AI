// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/PedagogicalStep.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTimes,
  faTarget,
  faBullseye,
  faLightbulb,
  faCheckCircle,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  useTheme,
  TextField,
  Typography,
  Autocomplete,
} from '@mui/material';

import { BLOOM_LEVELS } from '../../../constants/creation-constants';

import type { AiFormData, BloomLevel } from '../../../types/ai-types';

interface PedagogicalStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
}

const PedagogicalStep: React.FC<PedagogicalStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const suggestedObjectives = [
    'Identifier les différents temps de conjugaison',
    'Appliquer les règles de grammaire',
    'Analyser un texte littéraire',
    'Résoudre des équations du premier degré',
    'Comprendre les concepts fondamentaux',
    "Développer l'esprit critique",
    'Mémoriser les formules essentielles',
    'Créer des productions originales',
  ];

  const suggestedCompetencies = [
    'Expression écrite',
    'Compréhension de texte',
    'Raisonnement logique',
    'Analyse critique',
    'Résolution de problèmes',
    'Créativité',
    'Mémorisation',
    'Synthèse',
  ];

  const addLearningObjective = (objective: string) => {
    if (objective.trim() && !data.learningObjectives.includes(objective.trim())) {
      onChange({
        learningObjectives: [...data.learningObjectives, objective.trim()],
      });
    }
  };

  const removeLearningObjective = (objectiveToRemove: string) => {
    onChange({
      learningObjectives: data.learningObjectives.filter((obj) => obj !== objectiveToRemove),
    });
  };

  const addCompetency = (competency: string) => {
    if (competency.trim() && !data.competencies.includes(competency.trim())) {
      onChange({
        competencies: [...data.competencies, competency.trim()],
      });
    }
  };

  const removeCompetency = (competencyToRemove: string) => {
    onChange({
      competencies: data.competencies.filter((comp) => comp !== competencyToRemove),
    });
  };

  const handleBloomLevelToggle = (level: BloomLevel) => {
    const newLevels = data.bloomTaxonomyLevels.includes(level)
      ? data.bloomTaxonomyLevels.filter((l) => l !== level)
      : [...data.bloomTaxonomyLevels, level];

    onChange({ bloomTaxonomyLevels: newLevels });
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
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                }}
              >
                <FontAwesomeIcon icon={faGraduationCap} />
              </Box>
            </Stack>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Objectifs pédagogiques
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Définissez les compétences et objectifs d&apos;apprentissage visés
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Objectifs d'apprentissage */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FontAwesomeIcon icon={faTarget} style={{ marginRight: 8 }} />
                  Objectifs d&apos;apprentissage
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Que doivent apprendre ou maîtriser les étudiants avec cet exercice ?
                </Typography>

                <Autocomplete
                  multiple
                  freeSolo
                  options={suggestedObjectives}
                  value={data.learningObjectives}
                  onChange={(_, newValue) => onChange({ learningObjectives: newValue })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        data.learningObjectives.length === 0
                          ? "Ajoutez des objectifs d'apprentissage..."
                          : ''
                      }
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
                        sx={{
                          bgcolor: theme.palette.success.lighter,
                          color: theme.palette.success.main,
                          '& .MuiChip-deleteIcon': {
                            color: theme.palette.success.main,
                          },
                        }}
                        deleteIcon={
                          <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.8rem' }} />
                        }
                      />
                    ))
                  }
                />

                {errors.learningObjectives && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors.learningObjectives}
                  </Typography>
                )}

                {/* Suggestions rapides */}
                {data.learningObjectives.length === 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Suggestions basées sur votre sujet :
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {suggestedObjectives.slice(0, 4).map((objective) => (
                        <Chip
                          key={objective}
                          label={objective}
                          size="small"
                          variant="outlined"
                          onClick={() => addLearningObjective(objective)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: theme.palette.success.lighter,
                            },
                          }}
                          icon={<FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Card>
            </m.div>
          </Grid>

          {/* Compétences à développer */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FontAwesomeIcon icon={faBullseye} style={{ marginRight: 8 }} />
                  Compétences à développer
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Quelles compétences transversales cet exercice permet-il de travailler ?
                </Typography>

                <Autocomplete
                  multiple
                  freeSolo
                  options={suggestedCompetencies}
                  value={data.competencies}
                  onChange={(_, newValue) => onChange({ competencies: newValue })}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        data.competencies.length === 0 ? 'Ajoutez des compétences...' : ''
                      }
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
                        sx={{
                          bgcolor: theme.palette.info.lighter,
                          color: theme.palette.info.main,
                          '& .MuiChip-deleteIcon': {
                            color: theme.palette.info.main,
                          },
                        }}
                        deleteIcon={
                          <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.8rem' }} />
                        }
                      />
                    ))
                  }
                />

                {/* Suggestions rapides */}
                {data.competencies.length === 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Compétences courantes :
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {suggestedCompetencies.slice(0, 4).map((competency) => (
                        <Chip
                          key={competency}
                          label={competency}
                          size="small"
                          variant="outlined"
                          onClick={() => addCompetency(competency)}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: theme.palette.info.lighter,
                            },
                          }}
                          icon={<FontAwesomeIcon icon={faPlus} style={{ fontSize: '0.7rem' }} />}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Card>
            </m.div>
          </Grid>

          {/* Taxonomie de Bloom */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: 8 }} />
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
                          border: data.bloomTaxonomyLevels.includes(level.value)
                            ? `2px solid ${theme.palette.primary.main}`
                            : `1px solid ${theme.palette.divider}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: data.bloomTaxonomyLevels.includes(level.value)
                            ? level.color
                            : 'background.paper',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            bgcolor: level.color,
                          },
                        }}
                        onClick={() => handleBloomLevelToggle(level.value)}
                      >
                        <Stack spacing={1}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="subtitle2" fontWeight="bold">
                              {level.label}
                            </Typography>

                            {data.bloomTaxonomyLevels.includes(level.value) && (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.success.main,
                                  color: 'white',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faCheckCircle}
                                  style={{ fontSize: '0.7rem' }}
                                />
                              </Box>
                            )}
                          </Box>

                          <Typography variant="body2" color="text.secondary">
                            {level.description}
                          </Typography>
                        </Stack>
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
            </m.div>
          </Grid>

          {/* Résumé pédagogique */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.palette.success.lighter,
                  border: `1px solid ${theme.palette.success.light}`,
                }}
              >
                <Typography variant="h6" color="success.main" gutterBottom>
                  🎯 Résumé pédagogique
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Objectifs d&apos;apprentissage
                    </Typography>
                    {data.learningObjectives.length > 0 ? (
                      <Stack spacing={0.5}>
                        {data.learningObjectives.slice(0, 3).map((objective, index) => (
                          <Typography key={index} variant="body2" sx={{ fontSize: '0.875rem' }}>
                            • {objective}
                          </Typography>
                        ))}
                        {data.learningObjectives.length > 3 && (
                          <Typography variant="caption" color="text.secondary">
                            +{data.learningObjectives.length - 3} autres...
                          </Typography>
                        )}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        Aucun objectif défini
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Compétences visées
                    </Typography>
                    {data.competencies.length > 0 ? (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {data.competencies.slice(0, 3).map((competency) => (
                          <Chip
                            key={competency}
                            label={competency}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.info.lighter,
                              color: theme.palette.info.main,
                              fontSize: '0.7rem',
                            }}
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
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        Aucune compétence définie
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Niveaux cognitifs
                    </Typography>
                    {data.bloomTaxonomyLevels.length > 0 ? (
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {data.bloomTaxonomyLevels.map((level) => {
                          const bloomLevel = BLOOM_LEVELS.find((bl) => bl.value === level);
                          return (
                            <Chip
                              key={level}
                              label={bloomLevel?.label || level}
                              size="small"
                              sx={{
                                bgcolor: bloomLevel?.color || theme.palette.grey[200],
                                fontSize: '0.7rem',
                              }}
                            />
                          );
                        })}
                      </Stack>
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        Aucun niveau sélectionné
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Card>
            </m.div>
          </Grid>
        </Grid>
      </m.div>
    </Box>
  );
};

export default PedagogicalStep;
