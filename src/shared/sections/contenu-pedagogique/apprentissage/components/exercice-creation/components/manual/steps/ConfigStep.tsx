// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/steps/ConfigStep.tsx

'use client';

import React from 'react';
import {
  Box,
  Card,
  Grid,
  Switch,
  Slider,
  Typography,
  FormGroup,
  FormLabel,
  FormControl,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { Settings, Replay, Visibility, Shuffle, Help } from '@mui/icons-material';

import type { CreationFormData, ExerciseConfig } from '../../../types/exercise-types';

interface ConfigStepProps {
  data: CreationFormData;
  errors: Record<string, string>;
  onChange: (updates: Partial<CreationFormData>) => void;
}

const ConfigStep: React.FC<ConfigStepProps> = ({ data, errors, onChange }) => {
  const handleConfigChange = (configUpdates: Partial<ExerciseConfig>) => {
    onChange({
      config: {
        ...data.config,
        ...configUpdates,
      },
    });
  };

  const configSections = [
    {
      title: 'Tentatives et temps',
      icon: Replay,
      color: '#1976d2',
      description: 'Gérez le nombre de tentatives et les limites de temps',
    },
    {
      title: 'Affichage des résultats',
      icon: Visibility,
      color: '#388e3c',
      description: 'Contrôlez ce qui est visible pour les étudiants',
    },
    {
      title: 'Comportement des questions',
      icon: Shuffle,
      color: '#1976d2',
      description: "Personnalisez l'ordre et la présentation des questions",
    },
    {
      title: 'Aide et indices',
      icon: Help,
      color: '#f57c00',
      description: 'Activez les aides pour les étudiants',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configuration avancée
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Personnalisez le comportement et les paramètres de votre exercice
      </Typography>

      <Grid container spacing={3}>
        {/* Attempts and Time */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.lighter',
                borderBottom: 1,
                borderColor: 'primary.light',
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
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Replay />
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
                    <Typography variant="caption" color="text.secondary">
                      Permet aux étudiants de refaire l'exercice plusieurs fois
                    </Typography>
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
                  <TextField
                    type="number"
                    label="Temps limite en minutes (optionnel)"
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
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Score and Results */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'success.lighter',
                borderBottom: 1,
                borderColor: 'success.light',
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
                  bgcolor: 'success.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Visibility />
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
                      onChange={(_, value) => handleConfigChange({ passingScore: value as number })}
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
                    />
                    <Typography variant="caption" color="text.secondary">
                      Pourcentage minimum pour valider l'exercice
                    </Typography>
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
                    <Typography variant="caption" color="text.secondary">
                      Montre les corrections après soumission
                    </Typography>
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Question Behavior */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'info.lighter',
                borderBottom: 1,
                borderColor: 'info.light',
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
                  bgcolor: 'info.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shuffle />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" color="info.main">
                  Comportement des questions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Personnalisez l'ordre et la présentation des questions
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
                    <Typography variant="caption" color="text.secondary">
                      Présente les questions dans un ordre aléatoire
                    </Typography>
                  </FormGroup>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={data.config.shuffleAnswers}
                          onChange={(e) => handleConfigChange({ shuffleAnswers: e.target.checked })}
                        />
                      }
                      label="Mélanger les options de réponse"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Mélange les choix multiples et correspondances
                    </Typography>
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Help and Hints */}
        <Grid item xs={12}>
          <Card sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'warning.lighter',
                borderBottom: 1,
                borderColor: 'warning.light',
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
                  bgcolor: 'warning.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Help />
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
                          onChange={(e) => handleConfigChange({ enableHints: e.target.checked })}
                        />
                      }
                      label="Activer les indices"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Affiche un bouton d'aide sur les questions qui en ont
                    </Typography>
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
                    <Typography variant="caption" color="text.secondary">
                      Montre les explications détaillées dans les résultats
                    </Typography>
                  </FormGroup>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Configuration Summary */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, bgcolor: 'primary.lighter' }}>
            <Typography variant="h6" color="primary.main" gutterBottom>
              <Settings sx={{ mr: 1, verticalAlign: 'middle' }} />
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default ConfigStep;
