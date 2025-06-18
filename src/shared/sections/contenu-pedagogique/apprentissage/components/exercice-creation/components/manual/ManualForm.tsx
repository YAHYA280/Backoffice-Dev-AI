// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/manual/ManualForm.tsx

'use client';

import React from 'react';
import { m } from 'framer-motion';

import { Box, Alert } from '@mui/material';

import { MANUAL_CREATION_STEPS } from '../../constants/creation-constants';
import CreationStepper from '../shared/CreationStepper';
import BasicInfoStep from './steps/BasicInfoStep';
import ContentStep from './steps/ContentStep';
import QuestionsStep from './steps/QuestionsStep';
import ConfigStep from './steps/ConfigStep';
import { useExerciseCreation } from '../../hooks/useExerciseCreation';
import type { Exercise } from '../../types/exercise-types';

interface ManualFormProps {
  chapitreId: string;
  onSuccess?: (exercise: Exercise) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

const ManualForm: React.FC<ManualFormProps> = ({ chapitreId, onSuccess, onCancel, onError }) => {
  const {
    currentStep,
    formData,
    errors,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    saveExercise,
    validateStep,
    canGoNext,
    canGoPrev,
    isLastStep,
    completedSteps,
  } = useExerciseCreation({
    initialMode: 'manual',
    chapitreId,
    onSuccess,
    onError,
  });

  const handleNext = async () => {
    if (isLastStep) {
      const success = await saveExercise();
      if (!success) {
        onError?.("Erreur lors de la sauvegarde de l'exercice");
      }
    } else {
      nextStep();
    }
  };

  const renderStepContent = () => {
    const stepProps = {
      data: formData,
      errors,
      onChange: updateFormData,
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
    <m.div variants={containerVariants} initial="hidden" animate="visible">
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Avertissement de changements non sauvegardés */}
        {hasUnsavedChanges && (
          <m.div variants={itemVariants}>
            <Alert
              severity="warning"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              Vous avez des modifications non sauvegardées. N&apos;oubliez pas de sauvegarder votre
              travail !
            </Alert>
          </m.div>
        )}

        {/* Stepper de navigation */}
        <m.div variants={itemVariants}>
          <CreationStepper
            steps={MANUAL_CREATION_STEPS}
            activeStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
            onNext={handleNext}
            onPrev={prevStep}
            onCancel={onCancel}
            nextLabel={isLastStep ? "Finaliser l'exercice" : 'Étape suivante'}
            prevLabel="Étape précédente"
            cancelLabel="Annuler"
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            isLoading={isSaving}
            showNavigation
          />
        </m.div>

        {/* Contenu de l'étape actuelle */}
        <m.div
          variants={itemVariants}
          key={currentStep} // Force re-animation sur changement d'étape
        >
          <Box
            sx={{
              mt: 3,
              minHeight: 600,
              bgcolor: 'background.paper',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            {renderStepContent()}
          </Box>
        </m.div>

        {/* Informations de progression */}
        <m.div variants={itemVariants}>
          <Box
            sx={{
              mt: 3,
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: hasUnsavedChanges ? 'warning.main' : 'success.main',
                  }}
                />
                <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                  {hasUnsavedChanges ? 'Modifications en cours' : 'Tout est sauvegardé'}
                </Box>
              </Box>
            </Box>

            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              Étape {currentStep + 1} sur {MANUAL_CREATION_STEPS.length} • Mode création manuelle
            </Box>
          </Box>
        </m.div>
      </Box>
    </m.div>
  );
};

export default ManualForm;
