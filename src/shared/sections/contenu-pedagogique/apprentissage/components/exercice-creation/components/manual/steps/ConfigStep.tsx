// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/ConfigStep.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCog,
  faCheckCircle,
  faRedo,
  faClock,
  faEye,
  faRandom,
  faLightbulb,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  Slider,
  Divider,
  useTheme,
  TextField,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from '@mui/material';

import type { CreationFormData, ExerciseConfig } from '../../../types/exercise-types';

interface ConfigStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const ConfigStep: React.FC<ConfigStepProps> = ({ data, errors, onChange }) => {
  const theme = useTheme();

  const handleConfigChange = (configUpdates: Partial<ExerciseConfig>) => {
    onChange({
      config: {
        ...data.config,
        ...configUpdates,
      },
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

  const configSections = [
    {
      title: 'Tentatives et temps',
      icon: faRedo,
      color: theme.palette.primary.main,
      description: 'Gérez le nombre de tentatives et les limites de temps',
    },
    {
      title: 'Affichage des résultats',
      icon: faEye,
      color: theme.palette.success.main,
      description: 'Contrôlez ce qui est visible pour les étudiants',
    },
    {
      title: 'Comportement des questions',
      icon: faRandom,
      color: theme.palette.info.main,
      description: "Personnalisez l'ordre et la présentation des questions",
    },
    {
      title: 'Aide et indices',
      icon: faLightbulb,
      color: theme.palette.warning.main,
      description: 'Activez les aides pour les étudiants',
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <m.div variants={containerVariants} initial="hidden" animate="visible">
        {/* En-tête */}
        <m.div variants={itemVariants}>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Configuration avancée
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Personnalisez le comportement et les paramètres de votre exercice
            </Typography>
          </Box>
        </m.div>

        <Grid container spacing={3}>
          {/* Section Tentatives et temps */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: `${theme.palette.primary.main}20`,
                    borderBottom: `1px solid ${theme.palette.primary.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faRedo} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                      Tentatives et temps
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Gérez le nombre de tentatives et les limites de temps
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl component="fieldset" fullWidth>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.config.allowRetries}
                              onChange={(e) =>
                                handleConfigChange({
                                  allowRetries: e.target.checked,
                                  maxRetries: e.target.checked ? data.config.maxRetries : undefined,
                                })
                              }
                            />
                          }
                          label="Autoriser les tentatives multiples"
                        />
                        <FormHelperText>
                          Permet aux étudiants de refaire l&apos;exercice plusieurs fois
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    {data.config.allowRetries && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Nombre maximum de tentatives"
                          value={data.config.maxRetries || 3}
                          onChange={(e) =>
                            handleConfigChange({
                              maxRetries: Math.max(1, parseInt(e.target.value, 10) || 1),
                            })
                          }
                          inputProps={{ min: 1, max: 10 }}
                          helperText="0 = tentatives illimitées"
                        />
                      </Grid>
                    )}

                    <Grid item xs={12}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <FontAwesomeIcon icon={faClock} />
                            <Typography variant="subtitle2">
                              Limite de temps (optionnelle)
                            </Typography>
                          </Stack>
                        </FormLabel>

                        <TextField
                          type="number"
                          label="Temps limite en minutes"
                          value={data.config.timeLimit || ''}
                          onChange={(e) =>
                            handleConfigChange({
                              timeLimit: e.target.value ? parseInt(e.target.value, 10) : undefined,
                            })
                          }
                          placeholder="Aucune limite"
                          inputProps={{ min: 1, max: 180 }}
                          helperText="Laissez vide pour aucune limite de temps"
                          sx={{ maxWidth: 300 }}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </m.div>
          </Grid>

          {/* Section Score et résultats */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: `${theme.palette.success.main}20`,
                    borderBottom: `1px solid ${theme.palette.success.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: theme.palette.success.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="success.main">
                      Score et affichage des résultats
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Contrôlez le scoring et ce qui est visible pour les étudiants
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ mb: 2 }}>
                          Score de réussite requis: {data.config.passingScore}%
                        </FormLabel>
                        <Slider
                          value={data.config.passingScore}
                          onChange={(_, value) =>
                            handleConfigChange({ passingScore: value as number })
                          }
                          min={0}
                          max={100}
                          step={5}
                          marks={[
                            { value: 0, label: '0%' },
                            { value: 50, label: '50%' },
                            { value: 70, label: '70%' },
                            { value: 100, label: '100%' },
                          ]}
                          valueLabelDisplay="auto"
                          sx={{
                            '& .MuiSlider-markLabel': {
                              fontSize: '0.75rem',
                            },
                          }}
                        />
                        <FormHelperText>
                          Pourcentage minimum pour valider l&apos;exercice
                        </FormHelperText>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.config.showCorrectAnswers}
                              onChange={(e) =>
                                handleConfigChange({ showCorrectAnswers: e.target.checked })
                              }
                            />
                          }
                          label="Afficher les bonnes réponses"
                        />
                        <FormHelperText>Montre les corrections après soumission</FormHelperText>
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </m.div>
          </Grid>

          {/* Section Comportement des questions */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: `${theme.palette.info.main}20`,
                    borderBottom: `1px solid ${theme.palette.info.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: theme.palette.info.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faRandom} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                      Comportement des questions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Personnalisez l&apos;ordre et la présentation des questions
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.config.shuffleQuestions}
                              onChange={(e) =>
                                handleConfigChange({ shuffleQuestions: e.target.checked })
                              }
                            />
                          }
                          label="Mélanger l'ordre des questions"
                        />
                        <FormHelperText>
                          Présente les questions dans un ordre aléatoire
                        </FormHelperText>
                      </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.config.shuffleAnswers}
                              onChange={(e) =>
                                handleConfigChange({ shuffleAnswers: e.target.checked })
                              }
                            />
                          }
                          label="Mélanger les options de réponse"
                        />
                        <FormHelperText>
                          Mélange les choix multiples et correspondances
                        </FormHelperText>
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Box>
              </Card>
            </m.div>
          </Grid>

          {/* Section Aide et indices */}
          <Grid item xs={12}>
            <m.div variants={itemVariants}>
              <Card sx={{ overflow: 'hidden' }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: `${theme.palette.warning.main}20`,
                    borderBottom: `1px solid ${theme.palette.warning.light}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: theme.palette.warning.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FontAwesomeIcon icon={faLightbulb} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="warning.main">
                      Aide et indices
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Activez les aides pour accompagner les étudiants
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.config.enableHints}
                              onChange={(e) =>
                                handleConfigChange({ enableHints: e.target.checked })
                              }
                            />
                          }
                          label="Activer les indices"
                        />
                        <FormHelperText>
                          Affiche un bouton d&apos;aide sur les questions qui en ont
                        </FormHelperText>
                      </FormGroup>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={data.config.enableExplanations}
                              onChange={(e) =>
                                handleConfigChange({ enableExplanations: e.target.checked })
                              }
                            />
                          }
                          label="Activer les explications"
                        />
                        <FormHelperText>
                          Montre les explications détaillées dans les résultats
                        </FormHelperText>
                      </FormGroup>
                    </Grid>
                  </Grid>
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
                  bgcolor: theme.palette.primary.lighter,
                  border: `1px solid ${theme.palette.primary.light}`,
                }}
              >
                <Typography variant="h6" color="primary.main" gutterBottom>
                  <FontAwesomeIcon icon={faCog} style={{ marginRight: 8 }} />
                  Résumé de la configuration
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Tentatives
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {data.config.allowRetries
                        ? `${data.config.maxRetries || 'Illimitées'} max`
                        : 'Une seule'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Temps limite
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {data.config.timeLimit ? `${data.config.timeLimit} min` : 'Aucune'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Score requis
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {data.config.passingScore}%
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="caption" color="text.secondary">
                      Fonctionnalités
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {[
                        data.config.showCorrectAnswers && 'Corrections',
                        data.config.enableHints && 'Indices',
                        data.config.shuffleQuestions && 'Mélange',
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Aucune'}
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

export default ConfigStep;
