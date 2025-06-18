// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/AiForm.tsx

'use client';

import React, { useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Paper, Alert } from '@mui/material';

// Import step components
import GeneralInfoStep from './steps/GeneralInfoStep';
import QuestionConfigStep from './steps/QuestionConfigStep';
import PedagogicalStep from './steps/PedagogicalStep';
import FinalizationStep from './steps/FinalizationStep';

import type { CreationFormData } from '../../types/exercise-types';
import type { AiGenerationState, AiGenerationRequest, AiFormData } from '../../types/ai-types';

interface AiFormProps {
  chapitreId: string;
  formData: CreationFormData;
  aiState: AiGenerationState;
  errors: Record<string, string>;
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  onUpdateFormData: (updates: Partial<CreationFormData>) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onGoToStep: (step: number) => void;
  onGenerateWithAI: (request: AiGenerationRequest) => void;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
}

const AI_STEPS = [
  { label: 'Informations générales', description: 'Sujet et paramètres de base' },
  { label: 'Configuration des questions', description: 'Types et nombre de questions' },
  { label: 'Objectifs pédagogiques', description: 'Compétences et objectifs' },
  { label: 'Finalisation', description: 'Génération et révision' },
];

const AiForm: React.FC<AiFormProps> = ({
  chapitreId,
  formData,
  aiState,
  errors,
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrev,
  isLastStep,
  onUpdateFormData,
  onNextStep,
  onPrevStep,
  onGoToStep,
  onGenerateWithAI,
  onSave,
  onCancel,
}) => {
  // AI-specific form data
  const [aiFormData, setAiFormData] = useState<AiFormData>({
    topic: '',
    subtopics: [],
    educationalLevel: '',
    difficulty: 'medium',
    questionCount: 10,
    questionTypes: ['multiple_choice', 'true_false'],
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
    learningObjectives: [],
    competencies: [],
    bloomTaxonomyLevels: [],
    includeExplanations: true,
    includeHints: true,
    writingStyle: 'engaging',
    customPrompt: '',
  });

  const handleAiFormDataChange = (updates: Partial<AiFormData>) => {
    setAiFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleGenerate = async () => {
    const aiRequest: AiGenerationRequest = {
      config: {
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 4000,
        topic: aiFormData.topic,
        subtopics: aiFormData.subtopics,
        educationalLevel: aiFormData.educationalLevel,
        language: 'fr',
        questionCount: aiFormData.questionCount,
        questionTypes: aiFormData.questionTypes,
        difficultyDistribution: aiFormData.difficultyDistribution,
        learningObjectives: aiFormData.learningObjectives,
        competencies: aiFormData.competencies,
        bloomTaxonomyLevels: aiFormData.bloomTaxonomyLevels,
        includeExplanations: aiFormData.includeExplanations,
        includeHints: aiFormData.includeHints,
        generateRubrics: false,
        contextualResources: true,
        writingStyle: aiFormData.writingStyle,
        complexityLevel: 'intermediate',
      },
      customPrompt: aiFormData.customPrompt,
    };

    await onGenerateWithAI(aiRequest);
  };

  const renderStepContent = () => {
    const stepProps = {
      data: aiFormData,
      errors,
      onChange: handleAiFormDataChange,
    };

    switch (currentStep) {
      case 0:
        return <GeneralInfoStep {...stepProps} />;
      case 1:
        return <QuestionConfigStep {...stepProps} />;
      case 2:
        return <PedagogicalStep {...stepProps} />;
      case 3:
        return (
          <FinalizationStep {...stepProps} onGenerate={handleGenerate} generationState={aiState} />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* AI Generation Status */}
      {aiState.status === 'generating' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          🤖 L'IA génère votre exercice... {aiState.currentStep} ({Math.round(aiState.progress)}%)
        </Alert>
      )}

      {aiState.status === 'completed' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✨ Exercice généré avec succès ! Vous pouvez maintenant le réviser.
        </Alert>
      )}

      {aiState.status === 'error' && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ❌ Erreur lors de la génération. {aiState.error?.message || 'Veuillez réessayer.'}
        </Alert>
      )}

      {/* Stepper */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
          {AI_STEPS.map((step, index) => (
            <Step key={index}>
              <StepLabel onClick={() => onGoToStep(index)} sx={{ cursor: 'pointer' }}>
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Navigation Buttons */}
        {currentStep < 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button onClick={onCancel} color="inherit">
              Annuler
            </Button>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {canGoPrev && <Button onClick={onPrevStep}>Précédent</Button>}
              <Button variant="contained" onClick={onNextStep} disabled={!canGoNext}>
                {isLastStep ? 'Finaliser' : 'Suivant'}
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Step Content */}
      <Paper sx={{ p: 3, minHeight: 400 }}>{renderStepContent()}</Paper>

      {/* Progress Info */}
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            Étape {currentStep + 1} sur {totalSteps} • Mode génération IA 🤖
          </Box>
          <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
            {aiState.status === 'generating'
              ? 'Génération en cours...'
              : aiState.status === 'completed'
                ? 'Exercice généré'
                : aiState.status === 'error'
                  ? 'Erreur de génération'
                  : 'Configuration en cours'}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AiForm;
