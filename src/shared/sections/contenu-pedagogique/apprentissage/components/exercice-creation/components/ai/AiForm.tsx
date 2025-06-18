// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/components/ai/AiForm.tsx

'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { Box, Alert } from '@mui/material';

import GeneralInfoStep from './steps/GeneralInfoStep';
import PedagogicalStep from './steps/PedagogicalStep';
import CreationStepper from '../shared/CreationStepper';
import FinalizationStep from './steps/FinalizationStep';
import QuestionConfigStep from './steps/QuestionConfigStep';
import { useExerciseCreation } from '../../hooks/useExerciseCreation';
import { AI_CREATION_STEPS } from '../../constants/creation-constants';

import type { Exercise } from '../../types/exercise-types';
import type { AiFormData, AiGenerationRequest } from '../../types/ai-types';

interface AiFormProps {
  chapitreId: string;
  onSuccess?: (exercise: Exercise) => void;
  onCancel?: () => void;
  onError?: (error: string) => void;
}

const AiForm: React.FC<AiFormProps> = ({ chapitreId, onSuccess, onCancel, onError }) => {
  const [aiFormData, setAiFormData] = useState<AiFormData>({
    // Étape 1: Informations générales
    topic: '',
    subtopics: [],
    educationalLevel: '',
    difficulty: 'medium',

    // Étape 2: Configuration des questions
    questionCount: 10,
    questionTypes: ['multiple_choice', 'true_false'],
    difficultyDistribution: { easy: 30, medium: 50, hard: 20 },

    // Étape 3: Objectifs pédagogiques
    learningObjectives: [],
    competencies: [],
    bloomTaxonomyLevels: [],

    // Étape 4: Options avancées
    includeExplanations: true,
    includeHints: true,
    writingStyle: 'engaging',
    customPrompt: '',
  });

  const {
    currentStep,
    formData,
    errors,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    aiState,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    generateWithAI,
    saveExercise,
    validateStep,
    canGoNext,
    canGoPrev,
    isLastStep,
    completedSteps,
  } = useExerciseCreation({
    initialMode: 'ai',
    chapitreId,
    onSuccess,
    onError,
  });

  // Validation spécifique pour les étapes IA
  const validateAiStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    // eslint-disable-next-line default-case
    switch (step) {
      case 0: // Informations générales
        if (!aiFormData.topic.trim()) {
          newErrors.topic = 'Le sujet est obligatoire';
        }
        if (!aiFormData.difficulty) {
          newErrors.difficulty = 'Le niveau de difficulté est requis';
        }
        break;

      case 1: // Configuration des questions
        if (aiFormData.questionCount < 1 || aiFormData.questionCount > 50) {
          newErrors.questionCount = 'Le nombre de questions doit être entre 1 et 50';
        }
        if (aiFormData.questionTypes.length === 0) {
          newErrors.questionTypes = 'Sélectionnez au moins un type de question';
        }
        break;

      case 2: // Objectifs pédagogiques
        if (aiFormData.learningObjectives.length === 0) {
          newErrors.learningObjectives = "Ajoutez au moins un objectif d'apprentissage";
        }
        if (aiFormData.bloomTaxonomyLevels.length === 0) {
          newErrors.bloomTaxonomyLevels = 'Sélectionnez au moins un niveau cognitif';
        }
        break;

      case 3: // Finalisation
        // Validation globale avant génération
        if (!aiFormData.topic || aiFormData.questionTypes.length === 0) {
          newErrors.global = 'Configuration incomplète';
        }
        break;
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      if (validateAiStep(currentStep)) {
        nextStep();
      }
    }
  };

  const handleGenerate = async () => {
    if (!validateAiStep(currentStep)) {
      onError?.('Configuration incomplète');
      return;
    }

    // Construire la requête de génération IA
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

    try {
      await generateWithAI(aiRequest);

      // Une fois la génération terminée, sauvegarder automatiquement
      if (aiState.status === 'completed' && aiState.generatedContent) {
        const success = await saveExercise();
        if (!success) {
          onError?.("Erreur lors de la sauvegarde de l'exercice généré");
        }
      }
    } catch (error) {
      onError?.('Erreur lors de la génération IA');
    }
  };

  const handleAiFormDataChange = (updates: Partial<AiFormData>) => {
    setAiFormData((prev) => ({ ...prev, ...updates }));
  };

  // Synchroniser les données IA avec les données générales du formulaire
  useEffect(() => {
    updateFormData({
      title: aiFormData.topic || 'Exercice généré par IA',
      description: `Exercice sur ${aiFormData.topic}${aiFormData.subtopics.length > 0 ? ` - ${aiFormData.subtopics.join(', ')}` : ''}`,
      subject: aiFormData.topic.split(' ')[0] || 'Matière',
      difficulty: aiFormData.difficulty,
      estimatedDuration: Math.round(aiFormData.questionCount * 2),
      tags: ['IA', 'généré', ...aiFormData.subtopics.slice(0, 3)],
      aiConfig: {
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
    });
  }, [aiFormData, updateFormData]);

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
        {/* Avertissement spécifique IA */}
        {aiState.status === 'generating' && (
          <m.div variants={itemVariants}>
            <Alert
              severity="info"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              🤖 L&apos;IA génère votre exercice... Ne fermez pas cette page pendant le processus.
            </Alert>
          </m.div>
        )}

        {aiState.status === 'completed' && (
          <m.div variants={itemVariants}>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              ✨ Exercice généré avec succès ! Vous pouvez maintenant le réviser et l&apos;ajuster
              si nécessaire.
            </Alert>
          </m.div>
        )}

        {aiState.status === 'error' && (
          <m.div variants={itemVariants}>
            <Alert
              severity="error"
              sx={{
                mb: 2,
                borderRadius: 2,
              }}
            >
              ❌ Erreur lors de la génération. {aiState.error?.message || 'Veuillez réessayer.'}
            </Alert>
          </m.div>
        )}

        {/* Stepper de navigation */}
        <m.div variants={itemVariants}>
          <CreationStepper
            steps={AI_CREATION_STEPS}
            activeStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={goToStep}
            onNext={handleNext}
            onPrev={prevStep}
            onCancel={onCancel}
            nextLabel={isLastStep ? 'Finaliser' : 'Étape suivante'}
            prevLabel="Étape précédente"
            cancelLabel="Annuler"
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
            isLoading={aiState.status === 'generating' || isSaving}
            showNavigation={currentStep < 3} // Masquer la navigation sur l'étape finale
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
                    bgcolor:
                      aiState.status === 'generating'
                        ? 'warning.main'
                        : aiState.status === 'completed'
                          ? 'success.main'
                          : aiState.status === 'error'
                            ? 'error.main'
                            : 'info.main',
                  }}
                />
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
            </Box>

            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              Étape {currentStep + 1} sur {AI_CREATION_STEPS.length} • Mode génération IA 🤖
            </Box>
          </Box>
        </m.div>
      </Box>
    </m.div>
  );
};

export default AiForm;
