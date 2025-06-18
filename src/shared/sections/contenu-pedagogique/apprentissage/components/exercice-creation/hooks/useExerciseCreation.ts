// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/hooks/useExerciseCreation.ts

import { useState, useCallback, useEffect } from 'react';

import type { CreationMode, CreationFormData, Exercise } from '../types/exercise-types';
import type {
  AiGenerationState,
  AiGenerationRequest,
  AiGenerationResponse,
  AiGeneratedQuestion,
} from '../types/ai-types';
import type { Question, QuestionType } from '../types/question-types';

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
  // États principaux
  const [mode, setMode] = useState<CreationMode>(initialMode);
  const [currentStep, setCurrentStep] = useState(0);
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

  // États pour la génération IA
  const [aiState, setAiState] = useState<AiGenerationState>({
    status: 'idle',
    progress: 0,
    canCancel: false,
  });

  // États UI
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Validation des étapes
  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: Record<string, string> = {};

      switch (step) {
        case 0: // Informations générales
          if (!formData.title.trim()) {
            newErrors.title = 'Le titre est obligatoire';
          } else if (formData.title.length < 5) {
            newErrors.title = 'Le titre doit contenir au moins 5 caractères';
          }

          if (!formData.description.trim()) {
            newErrors.description = 'La description est obligatoire';
          } else if (formData.description.length < 10) {
            newErrors.description = 'La description doit contenir au moins 10 caractères';
          }

          if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est obligatoire';
          }
          break;

        case 1: // Contenu/Configuration questions
          if (mode === 'manual') {
            if (!formData.content?.trim()) {
              newErrors.content = 'Le contenu pédagogique est obligatoire';
            } else if (formData.content.length < 50) {
              newErrors.content = 'Le contenu doit contenir au moins 50 caractères';
            }
          } else {
            if (!formData.aiConfig?.topic?.trim()) {
              newErrors.topic = 'Le sujet est obligatoire';
            }
            if (!formData.aiConfig?.questionCount || formData.aiConfig.questionCount < 1) {
              newErrors.questionCount = 'Veuillez spécifier le nombre de questions';
            }
          }
          break;

        case 2: // Questions/Objectifs pédagogiques
          if (mode === 'manual') {
            if (formData.questions.length === 0) {
              newErrors.questions = 'Au moins une question est requise';
            }
          } else if (!formData.aiConfig?.learningObjectives?.length) {
            newErrors.learningObjectives = 'Au moins un objectif pédagogique est requis';
          }
          break;

        case 3: // Configuration finale
          if (formData.config.passingScore < 0 || formData.config.passingScore > 100) {
            newErrors.passingScore = 'Le score de réussite doit être entre 0 et 100';
          }
          break;

        default:
          // No validation needed for unknown steps
          break;
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData, mode]
  );

  // Helper function to convert AiGeneratedQuestion to proper Question type
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
          // Default fallback to multiple choice
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

  // Navigation entre les étapes
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

  // Mise à jour des données du formulaire
  const updateFormData = useCallback((updates: Partial<CreationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);

    // Effacer les erreurs des champs mis à jour
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  }, []);

  // Génération IA
  const generateWithAI = useCallback(
    async (request: AiGenerationRequest) => {
      try {
        setAiState({
          status: 'generating',
          progress: 0,
          canCancel: true,
          currentStep: 'Initialisation...',
        });

        // Simulation de l'API de génération IA
        const steps = [
          'Analyse du contexte...',
          'Génération du contenu...',
          'Création des questions...',
          'Optimisation pédagogique...',
          'Finalisation...',
        ];

        for (let i = 0; i < steps.length; i += 1) {
          if (aiState.status === 'cancelled') break;

          setAiState((prev) => ({
            ...prev,
            progress: (i / steps.length) * 100,
            currentStep: steps[i],
          }));

          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Simulation d'une réponse IA
        const mockResponse: AiGenerationResponse = {
          success: true,
          data: {
            exercise: {
              title: formData.aiConfig?.topic || 'Exercice généré',
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

        if (mockResponse.success && mockResponse.data) {
          // Convert AI questions to proper Question types
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
    },
    [formData.aiConfig, updateFormData, onError, aiState.status, convertAiQuestionToQuestion]
  );

  // Annulation de la génération IA
  const cancelAiGeneration = useCallback(() => {
    setAiState((prev) => ({ ...prev, status: 'cancelled', canCancel: false }));
  }, []);

  // Sauvegarde de l'exercice
  const saveExercise = useCallback(async (): Promise<boolean> => {
    try {
      setIsSaving(true);

      // Validation finale
      const isValid = validateStep(currentStep);
      if (!isValid) {
        return false;
      }

      // Simulation de l'API de sauvegarde
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      setIsSaving(false);
    }
  }, [formData, mode, currentStep, validateStep, onSuccess, onError]);

  // Réinitialisation
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

  // Changement de mode
  const changeMode = useCallback((newMode: CreationMode) => {
    setMode(newMode);
    setCurrentStep(0);
    setErrors({});
  }, []);

  // Effet pour surveiller les changements
  useEffect(() => {
    const hasContent = Boolean(
      formData.title || formData.description || formData.questions.length > 0
    );
    setHasUnsavedChanges(hasContent);
  }, [formData]);

  return {
    // États
    mode,
    currentStep,
    formData,
    aiState,
    isLoading,
    isSaving,
    errors,
    hasUnsavedChanges,

    // Actions
    changeMode,
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
    isLastStep: currentStep === (mode === 'manual' ? 3 : 3),
    completedSteps: currentStep,
    totalSteps: 4,
  };
};
