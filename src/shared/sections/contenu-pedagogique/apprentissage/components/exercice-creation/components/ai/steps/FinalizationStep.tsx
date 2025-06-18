'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWand,
  faCheck,
  faExclamationTriangle,
  faRobot,
  faCog,
  faClipboardCheck,
  faLightbulb,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  Chip,
  Stack,
  Button,
  Switch,
  useTheme,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  LinearProgress,
  Alert,
} from '@mui/material';

import { WRITING_STYLES } from '../../../constants/creation-constants';

import type { AiFormData, WritingStyle, AiGenerationState } from '../../../types/ai-types';

interface FinalizationStepProps {
  data: AiFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<AiFormData>) => void;
  onGenerate: () => void;
  generationState: AiGenerationState;
}

const FinalizationStep: React.FC<FinalizationStepProps> = ({
  data,
  errors,
  onChange,
  onGenerate,
  generationState,
}) => {
  const theme = useTheme();

  const isGenerating = generationState.status === 'generating';
  const isCompleted = generationState.status === 'completed';
  const hasError = generationState.status === 'error';

  const getValidationIssues = () => {
    const issues = [];

    if (!data.topic.trim()) {
      issues.push('Sujet principal manquant');
    }
    if (data.questionCount < 1) {
      issues.push('Nombre de questions invalide');
    }
    if (data.questionTypes.length === 0) {
      issues.push('Aucun type de question sélectionné');
    }
    if (data.learningObjectives.length === 0) {
      issues.push("Objectifs d'apprentissage manquants");
    }
    if (data.bloomTaxonomyLevels.length === 0) {
      issues.push('Niveaux cognitifs non définis');
    }

    return issues;
  };

  const validationIssues = getValidationIssues();
  const canGenerate = validationIssues.length === 0 && !isGenerating;

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
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.5rem',
                }}
              >
                <FontAwesomeIcon icon={faWand} />
              </Box>
            </Stack>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Finalisation et génération
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vérifiez votre configuration et lancez la génération IA
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* État de validation */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              {validationIssues.length > 0 ? (
                <Alert
                  severity="warning"
                  sx={{ mb: 2 }}
                  icon={<FontAwesomeIcon icon={faExclamationTriangle} />}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Configuration incomplète
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {validationIssues.map((issue, index) => (
                      <li key={index}>
                        <Typography variant="body2">{issue}</Typography>
                      </li>
                    ))}
                  </ul>
                </Alert>
              ) : (
                <Alert severity="success" icon={<FontAwesomeIcon icon={faCheck} />}>
                  <Typography variant="subtitle2">
                    Configuration prête pour la génération !
                  </Typography>
                </Alert>
              )}
            </m.div>
          </Grid>

          {/* Résumé de la configuration */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FontAwesomeIcon icon={faClipboardCheck} style={{ marginRight: 8 }} />
                  Résumé de votre exercice
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Sujet principal
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {data.topic || 'Non défini'}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Niveau et difficulté
                        </Typography>
                        <Typography variant="body1">
                          {data.educationalLevel || 'Non précisé'} • {data.difficulty}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Sous-sujets ({data.subtopics.length})
                        </Typography>
                        {data.subtopics.length > 0 ? (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                            {data.subtopics.slice(0, 3).map((subtopic) => (
                              <Chip
                                key={subtopic}
                                label={subtopic}
                                size="small"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            ))}
                            {data.subtopics.length > 3 && (
                              <Chip
                                label={`+${data.subtopics.length - 3}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem' }}
                              />
                            )}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Aucun sous-sujet spécifique
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Questions à générer
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {data.questionCount} questions • {data.questionTypes.length} types
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Répartition difficulté
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={`${data.difficultyDistribution.easy}% facile`}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.success.lighter,
                              color: theme.palette.success.main,
                              fontSize: '0.7rem',
                            }}
                          />
                          <Chip
                            label={`${data.difficultyDistribution.medium}% moyen`}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.warning.lighter,
                              color: theme.palette.warning.main,
                              fontSize: '0.7rem',
                            }}
                          />
                          <Chip
                            label={`${data.difficultyDistribution.hard}% difficile`}
                            size="small"
                            sx={{
                              bgcolor: theme.palette.error.lighter,
                              color: theme.palette.error.main,
                              fontSize: '0.7rem',
                            }}
                          />
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Objectifs pédagogiques
                        </Typography>
                        <Typography variant="body2">
                          {data.learningObjectives.length} objectifs • {data.competencies.length}{' '}
                          compétences • {data.bloomTaxonomyLevels.length} niveaux cognitifs
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </m.div>
          </Grid>

          {/* Options avancées */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: 8 }} />
                  Options avancées
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={data.includeExplanations}
                            onChange={(e) => onChange({ includeExplanations: e.target.checked })}
                          />
                        }
                        label="Inclure des explications détaillées"
                      />

                      <FormControlLabel
                        control={
                          <Switch
                            checked={data.includeHints}
                            onChange={(e) => onChange({ includeHints: e.target.checked })}
                          />
                        }
                        label="Générer des indices d'aide"
                      />
                    </FormGroup>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      fullWidth
                      label="Style d'écriture"
                      value={data.writingStyle}
                      onChange={(e) => onChange({ writingStyle: e.target.value as WritingStyle })}
                      SelectProps={{ native: true }}
                    >
                      {WRITING_STYLES.map((style) => (
                        <option key={style.value} value={style.value}>
                          {style.label} - {style.description}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Card>
            </m.div>
          </Grid>

          {/* Prompt personnalisé */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <FontAwesomeIcon icon={faEdit} style={{ marginRight: 8 }} />
                  Instructions personnalisées (optionnel)
                </Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Instructions spéciales pour l'IA"
                  value={data.customPrompt || ''}
                  onChange={(e) => onChange({ customPrompt: e.target.value })}
                  placeholder="Ex: Mettez l'accent sur les exemples concrets, utilisez un vocabulaire simple..."
                  helperText="Donnez des instructions spécifiques à l'IA pour personnaliser la génération"
                />
              </Card>
            </m.div>
          </Grid>

          {/* État de génération */}
          {(isGenerating || isCompleted || hasError) && (
            <Grid item xs={12}>
              <m.div variants={itemVariants}>
                <Card sx={{ p: 3 }}>
                  {isGenerating && (
                    <Box>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: theme.palette.secondary.main,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'pulse 2s infinite',
                          }}
                        >
                          <FontAwesomeIcon icon={faRobot} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Génération en cours...
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {generationState.currentStep || 'Préparation de la génération'}
                          </Typography>
                        </Box>
                        <Typography variant="h6" color="secondary.main" fontWeight="bold">
                          {Math.round(generationState.progress)}%
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={generationState.progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: theme.palette.grey[200],
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: `linear-gradient(90deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.light} 100%)`,
                          },
                        }}
                      />
                    </Box>
                  )}

                  {isCompleted && (
                    <Alert severity="success" icon={<FontAwesomeIcon icon={faCheck} />}>
                      <Typography variant="subtitle2" gutterBottom>
                        Génération terminée avec succès !
                      </Typography>
                      <Typography variant="body2">
                        Votre exercice a été généré et est prêt à être révisé et sauvegardé.
                      </Typography>
                    </Alert>
                  )}

                  {hasError && (
                    <Alert severity="error">
                      <Typography variant="subtitle2" gutterBottom>
                        Erreur lors de la génération
                      </Typography>
                      <Typography variant="body2">
                        {generationState.error?.message || "Une erreur inattendue s'est produite"}
                      </Typography>
                      {generationState.error?.suggestions && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Suggestions :
                          </Typography>
                          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                            {generationState.error.suggestions.map((suggestion, index) => (
                              <li key={index}>
                                <Typography variant="body2">{suggestion}</Typography>
                              </li>
                            ))}
                          </ul>
                        </Box>
                      )}
                    </Alert>
                  )}
                </Card>
              </m.div>
            </Grid>
          )}

          {/* Bouton de génération */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={onGenerate}
                  disabled={!canGenerate}
                  startIcon={<FontAwesomeIcon icon={faWand} />}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    background: canGenerate
                      ? `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`
                      : undefined,
                    boxShadow: canGenerate ? theme.customShadows?.z16 : undefined,
                    '&:hover': {
                      boxShadow: canGenerate ? theme.customShadows?.z20 : undefined,
                      transform: canGenerate ? 'translateY(-2px)' : undefined,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isGenerating
                    ? 'Génération en cours...'
                    : isCompleted
                      ? "Régénérer l'exercice"
                      : "Générer l'exercice avec l'IA"}
                </Button>

                {!canGenerate && !isGenerating && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Complétez la configuration pour activer la génération
                  </Typography>
                )}
              </Box>
            </m.div>
          </Grid>

          {/* Conseils de génération */}
          {!isGenerating && !isCompleted && (
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
                    <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: 8 }} />
                    Conseils pour une génération optimale
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Temps de génération :</strong> 2-5 minutes
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Plus votre configuration est détaillée, meilleur sera le résultat
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Après génération :</strong> Vous pourrez modifier
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Toutes les questions et contenus seront éditables
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              </m.div>
            </Grid>
          )}
        </Grid>
      </m.div>
    </Box>
  );
};

export default FinalizationStep;
