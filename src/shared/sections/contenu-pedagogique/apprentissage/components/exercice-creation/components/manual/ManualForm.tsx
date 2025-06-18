// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/ManualForm.tsx

'use client';

import React from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Alert } from '@mui/material';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import ContentStep from './steps/ContentStep';
import QuestionsStep from './steps/QuestionsStep';
import ConfigStep from './steps/ConfigStep';

import type { CreationFormData } from '../../types/exercise-types';

interface ManualFormProps {
  chapitreId: string;
  formData: CreationFormData;
  errors: Record<string, string>;
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  isSaving: boolean;
  onUpdateFormData: (updates: Partial<CreationFormData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onGoToStep: (step: number) => void;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
}

const MANUAL_STEPS = [
  { label: 'Informations de base', description: 'Titre, description et paramètres' },
  { label: 'Contenu pédagogique', description: 'Contenu et ressources' },
  { label: 'Questions', description: 'Création des questions' },
  { label: 'Configuration', description: 'Paramètres avancés' },
];

const ManualForm: React.FC<ManualFormProps> = ({
  chapitreId,
  formData,
  errors,
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrev,
  isLastStep,
  isSaving,
  onUpdateFormData,
  onNextStep,
  onPrevStep,
  onGoToStep,
  onSave,
  onCancel,
}) => {
  const handleSave = async () => {
    const success = await onSave();
    if (!success) {
      console.error('Failed to save exercise');
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      data: formData,
      errors,
      onChange: onUpdateFormData,
    };

    switch (currentStep) {
      case 0:
        return <BasicInfoStep {...stepProps} />;
      case 1:
        return <ContentStep {...stepProps} />;
      case 2:
        return <QuestionsStep {...stepProps} />;
      case 3:
        return <ConfigStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
          {MANUAL_STEPS.map((step, index) => (
            <Step key={index}>
              <StepLabel onClick={() => onGoToStep(index)} sx={{ cursor: 'pointer' }}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onCancel} color="inherit" disabled={isSaving}>
            Annuler
          </Button>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {canGoPrev && (
              <Button onClick={onPrevStep} disabled={isSaving}>
                Précédent
              </Button>
            )}

            {isLastStep ? (
              <Button variant="contained" onClick={handleSave} disabled={!canGoNext || isSaving}>
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            ) : (
              <Button variant="contained" onClick={onNextStep} disabled={!canGoNext}>
                Suivant
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, minHeight: 400 }}>{renderStepContent()}</Paper>

      {/* Final Step Save Button */}
      {isLastStep && (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            Votre exercice est prêt ! Vous pouvez maintenant le sauvegarder.
          </Alert>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={!canGoNext || isSaving}
              sx={{ minWidth: 200 }}
            >
              {isSaving ? 'Sauvegarde en cours...' : "Sauvegarder l'exercice"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Progress Info */}
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Étape {currentStep + 1} sur {totalSteps} • Mode création manuelle ✋
          </Box>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {formData.questions.length} question(s) • {formData.tags.length} tag(s)
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ManualForm;
