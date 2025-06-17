// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/QuestionConfigStep.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
  faCheckCircle,
  faPenToSquare,
  faAlignLeft,
  faFillDrip,
  faLink,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Slider,
  Button,
  useTheme,
  TextField,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  IconButton,
  Divider,
} from '@mui/material';

import { QUESTION_TYPE_CONFIGS } from '../../../constants/creation-constants';
import type { AiFormData, QuestionType, DifficultyDistribution } from '../../../types';

interface QuestionConfigStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
}

const QuestionConfigStep: React.FC<QuestionConfigStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const handleQuestionTypeToggle = (type: QuestionType) => {
    const newTypes = data.questionTypes.includes(type)
      ? data.questionTypes.filter((t) => t !== type)
      : [...data.questionTypes, type];

    onChange({ questionTypes: newTypes });
  };

  const handleDifficultyChange = (difficulty: keyof DifficultyDistribution, value: number) => {
    const newDistribution = {
      ...data.difficultyDistribution,
      [difficulty]: value,
    };

    // Assurer que le total fait 100%
    const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      // Réajuster proportionnellement les autres valeurs
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

  const getQuestionTypeIcon = (type: QuestionType) => {
    const icons = {
      multiple_choice: faCheckCircle,
      true_false: faQuestionCircle,
      short_answer: faPenToSquare,
      long_answer: faAlignLeft,
      fill_blanks: faFillDrip,
      matching: faLink,
    };
    return icons[type] || faQuestionCircle;
  };

  const getQuestionTypeColor = (type: QuestionType) => {
    const colors = {
      multiple_choice: theme.palette.primary.main,
      true_false: theme.palette.success.main,
      short_answer: theme.palette.info.main,
      long_answer: theme.palette.warning.main,
      fill_blanks: theme.palette.secondary.main,
      matching: theme.palette.error.main,
    };
    return colors[type] || theme.palette.grey[500];
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
              Configuration des questions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Définissez le nombre et les types de questions à générer
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Nombre de questions */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📊 Nombre de questions
                </Typography>

                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <IconButton
                    onClick={() => onChange({ questionCount: Math.max(1, data.questionCount - 1) })}
                    disabled={data.questionCount <= 1}
                    sx={{
                      bgcolor: theme.palette.error.lighter,
                      color: theme.palette.error.main,
                      '&:hover': { bgcolor: theme.palette.error.light },
                    }}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </IconButton>

                  <TextField
                    type="number"
                    value={data.questionCount}
                    onChange={(e) =>
                      onChange({
                        questionCount: Math.max(1, Math.min(50, parseInt(e.target.value) || 1)),
                      })
                    }
                    inputProps={{ min: 1, max: 50 }}
                    sx={{ width: 100 }}
                    error={!!errors.questionCount}
                    helperText={errors.questionCount}
                  />

                  <IconButton
                    onClick={() =>
                      onChange({ questionCount: Math.min(50, data.questionCount + 1) })
                    }
                    disabled={data.questionCount >= 50}
                    sx={{
                      bgcolor: theme.palette.success.lighter,
                      color: theme.palette.success.main,
                      '&:hover': { bgcolor: theme.palette.success.light },
                    }}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </IconButton>

                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    questions au total
                  </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  L'IA générera exactement ce nombre de questions adaptées à votre sujet
                </Typography>
              </Card>
            </m.div>
          </Grid>

          {/* Types de questions */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  🎯 Types de questions
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Sélectionnez les types de questions que l'IA peut utiliser
                </Typography>

                <Grid container spacing={2}>
                  {Object.values(QUESTION_TYPE_CONFIGS).map((config) => (
                    <Grid item xs={12} sm={6} md={4} key={config.type}>
                      <Card
                        sx={{
                          p: 2,
                          border: data.questionTypes.includes(config.type)
                            ? `2px solid ${getQuestionTypeColor(config.type)}`
                            : `1px solid ${theme.palette.divider}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          bgcolor: data.questionTypes.includes(config.type)
                            ? `${getQuestionTypeColor(config.type)}10`
                            : 'background.paper',
                          '&:hover': {
                            borderColor: getQuestionTypeColor(config.type),
                            bgcolor: `${getQuestionTypeColor(config.type)}05`,
                          },
                        }}
                        onClick={() => handleQuestionTypeToggle(config.type)}
                      >
                        <Stack spacing={1} alignItems="center" textAlign="center">
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: 2,
                              bgcolor: data.questionTypes.includes(config.type)
                                ? getQuestionTypeColor(config.type)
                                : `${getQuestionTypeColor(config.type)}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: data.questionTypes.includes(config.type)
                                ? 'white'
                                : getQuestionTypeColor(config.type),
                              transition: 'all 0.2s',
                            }}
                          >
                            <FontAwesomeIcon icon={getQuestionTypeIcon(config.type)} size="lg" />
                          </Box>

                          <Typography variant="subtitle2" fontWeight="medium">
                            {config.label}
                          </Typography>

                          <Typography variant="caption" color="text.secondary">
                            {config.description}
                          </Typography>

                          <Chip
                            label={config.category}
                            size="small"
                            sx={{
                              bgcolor: `${getQuestionTypeColor(config.type)}20`,
                              color: getQuestionTypeColor(config.type),
                              fontSize: '0.7rem',
                            }}
                          />

                          {data.questionTypes.includes(config.type) && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                width: 24,
                                height: 24,
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
                                style={{ fontSize: '0.8rem' }}
                              />
                            </Box>
                          )}
                        </Stack>
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
            </m.div>
          </Grid>

          {/* Répartition de la difficulté */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ⚖️ Répartition de la difficulté
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Définissez la proportion de questions par niveau de difficulté
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <FormLabel
                        sx={{ mb: 1, color: theme.palette.success.main, fontWeight: 'medium' }}
                      >
                        Questions faciles: {data.difficultyDistribution.easy}%
                      </FormLabel>
                      <Slider
                        value={data.difficultyDistribution.easy}
                        onChange={(_, value) => handleDifficultyChange('easy', value as number)}
                        min={0}
                        max={100}
                        step={5}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 50, label: '50%' },
                          { value: 100, label: '100%' },
                        ]}
                        valueLabelDisplay="auto"
                        sx={{
                          color: theme.palette.success.main,
                          '& .MuiSlider-markLabel': {
                            fontSize: '0.7rem',
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <FormLabel
                        sx={{ mb: 1, color: theme.palette.warning.main, fontWeight: 'medium' }}
                      >
                        Questions moyennes: {data.difficultyDistribution.medium}%
                      </FormLabel>
                      <Slider
                        value={data.difficultyDistribution.medium}
                        onChange={(_, value) => handleDifficultyChange('medium', value as number)}
                        min={0}
                        max={100}
                        step={5}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 50, label: '50%' },
                          { value: 100, label: '100%' },
                        ]}
                        valueLabelDisplay="auto"
                        sx={{
                          color: theme.palette.warning.main,
                          '& .MuiSlider-markLabel': {
                            fontSize: '0.7rem',
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <FormLabel
                        sx={{ mb: 1, color: theme.palette.error.main, fontWeight: 'medium' }}
                      >
                        Questions difficiles: {data.difficultyDistribution.hard}%
                      </FormLabel>
                      <Slider
                        value={data.difficultyDistribution.hard}
                        onChange={(_, value) => handleDifficultyChange('hard', value as number)}
                        min={0}
                        max={100}
                        step={5}
                        marks={[
                          { value: 0, label: '0%' },
                          { value: 50, label: '50%' },
                          { value: 100, label: '100%' },
                        ]}
                        valueLabelDisplay="auto"
                        sx={{
                          color: theme.palette.error.main,
                          '& .MuiSlider-markLabel': {
                            fontSize: '0.7rem',
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Aperçu de la répartition */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Aperçu pour {data.questionCount} questions :
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <Chip
                      label={`${Math.round((data.difficultyDistribution.easy / 100) * data.questionCount)} faciles`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.success.lighter,
                        color: theme.palette.success.main,
                      }}
                    />
                    <Chip
                      label={`${Math.round((data.difficultyDistribution.medium / 100) * data.questionCount)} moyennes`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.warning.lighter,
                        color: theme.palette.warning.main,
                      }}
                    />
                    <Chip
                      label={`${Math.round((data.difficultyDistribution.hard / 100) * data.questionCount)} difficiles`}
                      size="small"
                      sx={{
                        bgcolor: theme.palette.error.lighter,
                        color: theme.palette.error.main,
                      }}
                    />
                  </Stack>
                </Box>
              </Card>
            </m.div>
          </Grid>

          {/* Résumé de la configuration */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card
                sx={{
                  p: 3,
                  bgcolor: theme.palette.secondary.lighter,
                  border: `1px solid ${theme.palette.secondary.light}`,
                }}
              >
                <Typography variant="h6" color="secondary.main" gutterBottom>
                  📋 Résumé de la configuration
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Nombre total
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {data.questionCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      questions
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Types sélectionnés
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {data.questionTypes.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      sur {Object.keys(QUESTION_TYPE_CONFIGS).length} disponibles
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Difficulté principale
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {Math.max(
                        data.difficultyDistribution.easy,
                        data.difficultyDistribution.medium,
                        data.difficultyDistribution.hard
                      )}
                      %
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      du niveau dominant
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Temps estimé
                    </Typography>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {Math.round(data.questionCount * 2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      minutes environ
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

export default QuestionConfigStep;
