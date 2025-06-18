// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/hooks/useExerciseCreation.ts

import { useState } from 'react';
import type { CreationMode, CreationFormData, Exercise } from '../types/exercise-types';
import type { AiGenerationState, AiGenerationRequest } from '../types/ai-types';

interface UseExerciseCreationProps {
  initialMode?: CreationMode;
  chapitreId: string;
  onSuccess?: (exercise: Exercise) => void;
  onError?: (error: string) => void;
}

export const useExerciseCreation = ({
  initialMode = 'manual',
  chapitreId,
  onSuccess,
  onError,
}: UseExerciseCreationProps) => {
  // Ultra simple state - no useEffect, no complex objects
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simple form data - static initial state
  const [formData, setFormData] = useState<CreationFormData>(() => ({
    title: '',
    description: '',
    subject: '',
    chapter: chapitreId,
    difficulty: 'medium',
    estimatedDuration: 15,
    tags: [],
    questions: [],
    config: {
      allowRetries: true,
      maxRetries: 3,
      showCorrectAnswers: true,
      shuffleQuestions: false,
      shuffleAnswers: false,
      passingScore: 70,
      enableHints: true,
      enableExplanations: true,
    },
  }));

  // AI state - simple
  const [aiState, setAiState] = useState<AiGenerationState>(() => ({
    status: 'idle',
    progress: 0,
    canCancel: false,
  }));

  // Simple validation - no useCallback, just inline
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 0:
        if (!formData.title.trim()) newErrors.title = 'Le titre est obligatoire';
        if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
        break;
      case 1:
        if (initialMode === 'manual' && !formData.content?.trim()) {
          newErrors.content = 'Le contenu est obligatoire';
        }
        break;
      case 2:
        if (initialMode === 'manual' && formData.questions.length === 0) {
          newErrors.questions = 'Au moins une question est requise';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Simple navigation functions - no useCallback
  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step <= 3) {
      setCurrentStep(step);
    }
  };

  // Simple update function - no useCallback
  const updateFormData = (updates: Partial<CreationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));

    // Clear related errors
    const updatedFields = Object.keys(updates);
    if (updatedFields.length > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        updatedFields.forEach((field) => {
          delete newErrors[field];
        });
        return newErrors;
      });
    }
  };

  // AI Generation - simple async function
  const generateWithAI = async (request: AiGenerationRequest) => {
    try {
      setAiState({
        status: 'generating',
        progress: 0,
        canCancel: true,
        currentStep: 'Initialisation...',
      });

      // Simple simulation
      const steps = ['Analyse...', 'Génération...', 'Finalisation...'];

      for (let i = 0; i < steps.length; i++) {
        setAiState((prev) => ({
          ...prev,
          progress: ((i + 1) / steps.length) * 100,
          currentStep: steps[i],
        }));

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Simple mock content
      const generatedContent = {
        title: request.config.topic || 'Exercice généré',
        description: 'Description générée automatiquement',
        content: 'Contenu pédagogique généré par IA',
        tags: ['IA', 'généré'],
        questions: [
          {
            id: 'generated_1',
            type: 'multiple_choice' as const,
            title: 'Question générée 1',
            content: 'Contenu de la question générée',
            points: 10,
            difficulty: 'medium' as const,
            explanation: 'Explication générée',
            hint: 'Indice généré',
            order: 0,
            required: true,
            tags: [],
            options: [
              { id: '1', text: 'Option A', isCorrect: true, order: 0 },
              { id: '2', text: 'Option B', isCorrect: false, order: 1 },
            ],
            allowMultiple: false,
            randomizeOptions: false,
          },
        ],
      };

      // Update data
      setFormData((prev) => ({
        ...prev,
        ...generatedContent,
      }));

      setAiState({
        status: 'completed',
        progress: 100,
        canCancel: false,
      });
    } catch (error) {
      setAiState({
        status: 'error',
        progress: 0,
        error: {
          code: 'GENERATION_FAILED',
          message: 'Erreur lors de la génération',
          suggestions: ['Vérifiez votre connexion', 'Réessayez'],
        },
        canCancel: false,
      });
      if (onError) onError('Erreur lors de la génération IA');
    }
  };

  // Save function - simple
  const saveExercise = async (): Promise<boolean> => {
    try {
      setIsSaving(true);

      if (!validateCurrentStep()) {
        return false;
      }

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const savedExercise: Exercise = {
        id: `exercise_${Date.now()}`,
        ...formData,
        mode: initialMode,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Exercise;

      if (onSuccess) onSuccess(savedExercise);
      return true;
    } catch (error) {
      if (onError) onError('Erreur lors de la sauvegarde');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Reset function - simple
  const reset = () => {
    setCurrentStep(0);
    setFormData({
      title: '',
      description: '',
      subject: '',
      chapter: chapitreId,
      difficulty: 'medium',
      estimatedDuration: 15,
      tags: [],
      questions: [],
      config: {
        allowRetries: true,
        maxRetries: 3,
        showCorrectAnswers: true,
        shuffleQuestions: false,
        shuffleAnswers: false,
        passingScore: 70,
        enableHints: true,
        enableExplanations: true,
      },
    });
    setAiState({
      status: 'idle',
      progress: 0,
      canCancel: false,
    });
    setErrors({});
  };

  // Return all values and functions - no computed values to avoid re-renders
  return {
    // State
    mode: initialMode,
    currentStep,
    formData,
    aiState,
    isLoading,
    isSaving,
    errors,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    generateWithAI,
    saveExercise,
    reset,
    validateCurrentStep,

    // Simple computed values
    canGoNext: Object.keys(errors).length === 0,
    canGoPrev: currentStep > 0,
    isLastStep: currentStep === 3,
    totalSteps: 4,
  };
};
