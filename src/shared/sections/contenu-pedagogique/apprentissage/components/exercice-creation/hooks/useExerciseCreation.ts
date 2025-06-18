// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/hooks/useExerciseCreation.ts

import { useState, useCallback, useRef } from 'react';

import type { CreationMode, CreationFormData, Exercise } from '../types/exercise-types';
import type {
  AiGenerationState,
  AiGenerationRequest,
  AiGenerationResponse,
  AiGeneratedQuestion,
} from '../types/ai-types';
import type { Question } from '../types/question-types';

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
  // Simple state management without complex dependencies
  const [mode] = useState<CreationMode>(initialMode);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs to prevent issues
  const isMountedRef = useRef(true);

  // Initial form data
  const [formData, setFormData] = useState<CreationFormData>({
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

  // AI state
  const [aiState, setAiState] = useState<AiGenerationState>({
    status: 'idle',
    progress: 0,
    canCancel: false,
  });

  // Simple validation function
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case 0:
          if (!formData.title.trim()) {
            newErrors.title = 'Le titre est obligatoire';
          }
          if (!formData.description.trim()) {
            newErrors.description = 'La description est obligatoire';
          }
          break;
        case 1:
          if (mode === 'manual' && !formData.content?.trim()) {
            newErrors.content = 'Le contenu est obligatoire';
          }
          break;
        case 2:
          if (mode === 'manual' && formData.questions.length === 0) {
            newErrors.questions = 'Au moins une question est requise';
          }
          break;
        default:
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData.title, formData.description, formData.content, formData.questions.length, mode]
  );

  // Helper function to convert AI questions
  const convertAiQuestionToQuestion = useCallback(
    (aiQuestion: AiGeneratedQuestion, index: number): Question => {
      const baseProps = {
        id: `generated_${index}`,
        type: aiQuestion.type,
        title: aiQuestion.title,
        content: aiQuestion.content,
        points: aiQuestion.points,
        difficulty: aiQuestion.difficulty,
        explanation: aiQuestion.explanation,
        hint: aiQuestion.hint,
        order: index,
        required: true,
        tags: aiQuestion.tags,
      };

      switch (aiQuestion.type) {
        case 'multiple_choice':
          return {
            ...baseProps,
            type: 'multiple_choice',
            options: aiQuestion.options || [],
            allowMultiple: false,
            randomizeOptions: false,
          };
        case 'true_false':
          return {
            ...baseProps,
            type: 'true_false',
            correctAnswer: aiQuestion.correctAnswer ?? false,
          };
        case 'short_answer':
          return {
            ...baseProps,
            type: 'short_answer',
            correctAnswers: aiQuestion.correctAnswers || [],
            caseSensitive: false,
            exactMatch: false,
            maxLength: 100,
          };
        case 'long_answer':
          return {
            ...baseProps,
            type: 'long_answer',
            minLength: 50,
            maxLength: 1000,
            evaluationCriteria: [],
          };
        case 'fill_blanks':
          return {
            ...baseProps,
            type: 'fill_blanks',
            textWithBlanks: aiQuestion.textWithBlanks || '',
            blanks: aiQuestion.blanks || [],
            caseSensitive: false,
          };
        case 'matching':
          return {
            ...baseProps,
            type: 'matching',
            leftItems: aiQuestion.leftItems || [],
            rightItems: aiQuestion.rightItems || [],
            allowPartialCredit: true,
          };
        default:
          return {
            ...baseProps,
            type: 'multiple_choice',
            options: [],
            allowMultiple: false,
            randomizeOptions: false,
          };
      }
    },
    []
  );

  // Navigation functions
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  // Form data update function
  const updateFormData = useCallback((updates: Partial<CreationFormData>) => {
    if (!isMountedRef.current) return;

    setFormData((prev) => {
      const newData = { ...prev, ...updates };
      return newData;
    });

    setHasUnsavedChanges(true);

    // Clear errors for updated fields
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  }, []);

  // AI Generation function
  const generateWithAI = useCallback(
    async (request: AiGenerationRequest) => {
      try {
        setAiState({
          status: 'generating',
          progress: 0,
          canCancel: true,
          currentStep: 'Initialisation...',
        });

        // Mock AI generation
        const steps = [
          'Analyse du contexte...',
          'Génération du contenu...',
          'Création des questions...',
          'Optimisation pédagogique...',
          'Finalisation...',
        ];

        for (let i = 0; i < steps.length; i += 1) {
          if (!isMountedRef.current) break;

          setAiState((prev) => ({
            ...prev,
            progress: ((i + 1) / steps.length) * 100,
            currentStep: steps[i],
          }));

          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Mock response
        const mockResponse: AiGenerationResponse = {
          success: true,
          data: {
            exercise: {
              title: request.config.topic || 'Exercice généré',
              description: 'Description générée automatiquement...',
              content: 'Contenu pédagogique généré...',
              tags: ['IA', 'généré'],
              estimatedDuration: 20,
            },
            questions: [
              {
                type: 'multiple_choice',
                title: 'Question générée 1',
                content: 'Quelle est la bonne réponse ?',
                points: 10,
                difficulty: 'medium',
                explanation: 'Explication générée...',
                tags: [],
                options: [
                  { id: '1', text: 'Réponse A', isCorrect: true, order: 0 },
                  { id: '2', text: 'Réponse B', isCorrect: false, order: 1 },
                ],
                confidence: 0.9,
                bloomLevel: 'understand',
              },
            ],
          },
          metadata: {
            model: 'gpt-4',
            tokens: { input: 500, output: 1000, total: 1500 },
            processingTime: 5000,
            timestamp: new Date().toISOString(),
          },
        };

        if (mockResponse.success && mockResponse.data && isMountedRef.current) {
          const convertedQuestions = mockResponse.data.questions.map((q, index) =>
            convertAiQuestionToQuestion(q, index)
          );

          updateFormData({
            title: mockResponse.data.exercise.title,
            description: mockResponse.data.exercise.description,
            content: mockResponse.data.exercise.content,
            tags: mockResponse.data.exercise.tags,
            estimatedDuration: mockResponse.data.exercise.estimatedDuration,
            questions: convertedQuestions,
          });

          setAiState({
            status: 'completed',
            progress: 100,
            generatedContent: mockResponse.data,
            canCancel: false,
          });
        }
      } catch (error) {
        if (isMountedRef.current) {
          setAiState({
            status: 'error',
            progress: 0,
            error: {
              code: 'GENERATION_FAILED',
              message: 'Erreur lors de la génération',
              suggestions: ['Vérifiez votre connexion', 'Réessayez avec des paramètres différents'],
            },
            canCancel: false,
          });
          onError?.('Erreur lors de la génération IA');
        }
      }
    },
    [updateFormData, onError, convertAiQuestionToQuestion]
  );

  // Cancel AI generation
  const cancelAiGeneration = useCallback(() => {
    setAiState((prev) => ({ ...prev, status: 'cancelled', canCancel: false }));
  }, []);

  // Save exercise
  const saveExercise = useCallback(async (): Promise<boolean> => {
    try {
      setIsSaving(true);

      if (!validateStep(currentStep)) {
        return false;
      }

      // Mock save
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (!isMountedRef.current) return false;

      const savedExercise: Exercise = {
        id: `exercise_${Date.now()}`,
        ...formData,
        mode,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Exercise;

      setHasUnsavedChanges(false);
      onSuccess?.(savedExercise);

      return true;
    } catch (error) {
      onError?.('Erreur lors de la sauvegarde');
      return false;
    } finally {
      if (isMountedRef.current) {
        setIsSaving(false);
      }
    }
  }, [formData, mode, currentStep, validateStep, onSuccess, onError]);

  // Reset function
  const reset = useCallback(() => {
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
    setHasUnsavedChanges(false);
  }, [chapitreId]);

  return {
    // État
    mode,
    currentStep,
    formData,
    aiState,
    isLoading,
    isSaving,
    errors,
    hasUnsavedChanges,

    // Actions
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    generateWithAI,
    cancelAiGeneration,
    saveExercise,
    reset,
    validateStep,

    // Utilitaires
    canGoNext: validateStep(currentStep),
    canGoPrev: currentStep > 0,
    isLastStep: currentStep === 3,
    completedSteps: currentStep,
    totalSteps: 4,
  };
};
