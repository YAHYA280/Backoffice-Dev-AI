// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/steps/FinalizationStep.tsx

'use client';

import React from 'react';
import {
  Box,
  Card,
  Grid,
  Chip,
  Button,
  Typography,
  TextField,
  LinearProgress,
  Alert,
} from '@mui/material';

import type { AiFormData, AiGenerationState } from '../../../types/ai-types';

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
  const isGenerating = generationState.status === 'generating';
  const isCompleted = generationState.status === 'completed';
  const hasError = generationState.status === 'error';

  const getValidationIssues = () => {
    const issues = [];
    if (!data.topic.trim()) issues.push('Sujet principal manquant');
    if (data.questionCount < 1) issues.push('Nombre de questions invalide');
    if (data.questionTypes.length === 0) issues.push('Aucun type de question sélectionné');
    if (data.learningObjectives.length === 0) issues.push("Objectifs d'apprentissage manquants");
    return issues;
  };

  const validationIssues = getValidationIssues();
  const canGenerate = validationIssues.length === 0 && !isGenerating;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Finalisation et génération
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Vérifiez votre configuration et lancez la génération IA
      </Typography>

      <Grid container spacing={3}>
        {/* Validation Status */}
        <Grid item xs={12}>
          {validationIssues.length > 0 ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
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
            <Alert severity="success">
              <Typography variant="subtitle2">Configuration prête pour la génération !</Typography>
            </Alert>
          )}
        </Grid>

        {/* Configuration Summary */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Résumé de votre exercice
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Sujet principal
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {data.topic || 'Non défini'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Niveau et difficulté
                </Typography>
                <Typography variant="body2">
                  {data.educationalLevel || 'Non précisé'} • {data.difficulty}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Questions à générer
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {data.questionCount} questions • {data.questionTypes.length} types
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Objectifs pédagogiques
                </Typography>
                <Typography variant="body2">
                  {data.learningObjectives.length} objectifs • {data.competencies.length}{' '}
                  compétences
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Custom Prompt */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
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
        </Grid>

        {/* Generation Status */}
        {(isGenerating || isCompleted || hasError) && (
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              {isGenerating && (
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Génération en cours...
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {generationState.currentStep || 'Préparation de la génération'}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={generationState.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      mb: 1,
                    }}
                  />

                  <Typography variant="body2" color="text.secondary" align="right">
                    {Math.round(generationState.progress)}%
                  </Typography>
                </Box>
              )}

              {isCompleted && (
                <Alert severity="success">
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
          </Grid>
        )}

        {/* Generation Button */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={onGenerate}
              disabled={!canGenerate}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                minWidth: 250,
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinalizationStep;
