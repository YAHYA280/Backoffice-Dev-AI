// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/GeneralInfoStep.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faBrain, faMagic } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Chip,
  Card,
  Stack,
  Select,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  Autocomplete,
  FormHelperText,
} from '@mui/material';

import { DIFFICULTY_OPTIONS } from '../../../constants/creation-constants';

import type { AiFormData } from '../../../types/ai-types';
import type { DifficultyLevel } from '../../../types/exercise-types';

interface GeneralInfoStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
}

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const handleSubtopicAdd = (subtopic: string) => {
    if (subtopic.trim() && !data.subtopics.includes(subtopic.trim())) {
      onChange({
        subtopics: [...data.subtopics, subtopic.trim()],
      });
    }
  };

  const handleSubtopicRemove = (subtopicToRemove: string) => {
    onChange({
      subtopics: data.subtopics.filter((subtopic) => subtopic !== subtopicToRemove),
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

  const suggestedTopics = [
    'Grammaire française',
    'Conjugaison des verbes',
    'Mathématiques niveau collège',
    'Histoire de France',
    'Sciences physiques',
    'Géographie mondiale',
    'Littérature classique',
    'Anglais débutant',
  ];

  const suggestedSubtopics = {
    'Grammaire française': ['Adjectifs', 'Pronoms', 'Compléments', 'Nature des mots'],
    'Conjugaison des verbes': ['Présent', 'Passé composé', 'Imparfait', 'Futur simple'],
    'Mathématiques niveau collège': ['Fractions', 'Équations', 'Géométrie', 'Statistiques'],
    default: ['Concepts de base', 'Applications pratiques', 'Exercices avancés'],
  };

  const getSubtopicSuggestions = () =>
    suggestedSubtopics[data.topic as keyof typeof suggestedSubtopics] || suggestedSubtopics.default;

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
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                }}
              >
                <FontAwesomeIcon icon={faBrain} />
              </Box>
            </Stack>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Informations générales
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Décrivez votre sujet pour que l&apos;IA génère un exercice adapté
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Sujet principal */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  p: 3,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.lighter} 0%, ${theme.palette.secondary.light} 100%)`,
                  border: `1px solid ${theme.palette.secondary.main}`,
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6" color="secondary.main" fontWeight="bold">
                    <FontAwesomeIcon icon={faMagic} style={{ marginRight: 8 }} />
                    Sujet de l&apos;exercice
                  </Typography>

                  <Autocomplete
                    freeSolo
                    options={suggestedTopics}
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
                </Stack>
              </Card>
            </m.div>
          </Grid>

          {/* Sous-sujets */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Sous-sujets spécifiques
              </Typography>

              <Autocomplete
                multiple
                freeSolo
                options={getSubtopicSuggestions()}
                value={data.subtopics}
                onChange={(_, newValue) => onChange({ subtopics: newValue })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={
                      data.subtopics.length === 0 ? 'Ajoutez des sous-sujets spécifiques...' : ''
                    }
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
                      sx={{
                        bgcolor: theme.palette.secondary.lighter,
                        color: theme.palette.secondary.main,
                        '& .MuiChip-deleteIcon': {
                          color: theme.palette.secondary.main,
                        },
                      }}
                      deleteIcon={<FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.8rem' }} />}
                    />
                  ))
                }
              />
            </m.div>
          </Grid>

          {/* Niveau éducatif et difficulté */}
          <Grid item xs={12} md={6}>
            <m.div variants={itemVariants}>
              <TextField
                fullWidth
                label="Niveau éducatif"
                value={data.educationalLevel}
                onChange={(e) => onChange({ educationalLevel: e.target.value })}
                placeholder="Ex: 6ème, Terminale, Licence..."
                helperText="Précisez le niveau scolaire ou académique visé"
              />
            </m.div>
          </Grid>

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

          {/* Aperçu intelligent */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  p: 3,
                  border: `2px dashed ${theme.palette.secondary.light}`,
                  bgcolor: 'transparent',
                }}
              >
                <Typography variant="subtitle2" color="secondary.main" gutterBottom>
                  🎯 Aperçu de ce que l&apos;IA va générer
                </Typography>

                {data.topic ? (
                  <Stack spacing={1}>
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

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, fontStyle: 'italic' }}
                    >
                      L&apos;IA créera un exercice adapté avec des questions personnalisées et du
                      contenu pédagogique optimisé.
                    </Typography>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Commencez par définir un sujet pour voir l&apos;aperçu...
                  </Typography>
                )}
              </Card>
            </m.div>
          </Grid>

          {/* Conseils IA */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.palette.info.lighter,
                  border: `1px solid ${theme.palette.info.light}`,
                }}
              >
                <Typography variant="subtitle2" color="info.main" gutterBottom>
                  💡 Conseils pour une meilleure génération IA
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Soyez spécifique :</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      &quot;Conjugaison du présent&quot; plutôt que &quot;français&quot;
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Précisez le niveau :</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Le niveau aide l&apos;IA à adapter la complexité
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Utilisez les sous-sujets :</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pour cibler des aspects précis du cours
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Choisissez la bonne difficulté :</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Influence le type et la complexité des questions
                    </Typography>
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

export default GeneralInfoStep;
