// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/hooks/useQuestionManager.ts

import { useState, useCallback, useMemo } from 'react';
import type {
  Question,
  QuestionType,
  QuestionFormData,
  QuestionValidation,
  MultipleChoiceOption,
  BlankOption,
  MatchingItem,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  ShortAnswerQuestion,
  LongAnswerQuestion,
  FillBlanksQuestion,
  MatchingQuestion,
} from '../types/question-types';

interface UseQuestionManagerProps {
  initialQuestions?: Question[];
  onQuestionsChange?: (questions: Question[]) => void;
  maxQuestions?: number;
}

export const useQuestionManager = ({
  initialQuestions = [],
  onQuestionsChange,
  maxQuestions = 50,
}: UseQuestionManagerProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [draggedQuestion, setDraggedQuestion] = useState<Question | null>(null);

  // État du formulaire de question
  const [questionForm, setQuestionForm] = useState<QuestionFormData>({
    type: 'multiple_choice',
    title: '',
    content: '',
    points: 10,
    difficulty: 'medium',
    required: true,
    tags: [],
  });

  // Validation d'une question
  const validateQuestion = useCallback((question: QuestionFormData): QuestionValidation => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validation générale
    if (!question.title.trim()) {
      errors.push('Le titre est obligatoire');
    } else if (question.title.length < 5) {
      errors.push('Le titre doit contenir au moins 5 caractères');
    }

    if (!question.content.trim()) {
      errors.push('Le contenu est obligatoire');
    } else if (question.content.length < 10) {
      errors.push('Le contenu doit contenir au moins 10 caractères');
    }

    if (question.points <= 0) {
      errors.push('Les points doivent être supérieurs à 0');
    } else if (question.points > 100) {
      warnings.push("Un score élevé de points pourrait déséquilibrer l'exercice");
    }

    // Validation spécifique par type
    switch (question.type) {
      case 'multiple_choice':
        if (!question.options || question.options.length < 2) {
          errors.push('Au moins 2 options sont requises');
        } else {
          const correctOptions = question.options.filter((opt) => opt.isCorrect);
          if (correctOptions.length === 0) {
            errors.push('Au moins une option correcte est requise');
          }
          if (!question.allowMultiple && correctOptions.length > 1) {
            errors.push('Une seule option correcte autorisée pour ce type de question');
          }
        }
        break;

      case 'true_false':
        if (question.correctAnswer === undefined) {
          errors.push('Veuillez sélectionner la réponse correcte');
        }
        break;

      case 'short_answer':
        if (!question.correctAnswers || question.correctAnswers.length === 0) {
          errors.push('Au moins une réponse correcte est requise');
        }
        if (question.maxLength && question.maxLength < 1) {
          errors.push('La longueur maximale doit être supérieure à 0');
        }
        break;

      case 'long_answer':
        if (!question.minLength || question.minLength < 1) {
          errors.push('La longueur minimale est requise');
        }
        if (!question.maxLength || question.maxLength < question.minLength!) {
          errors.push('La longueur maximale doit être supérieure à la longueur minimale');
        }
        break;

      case 'fill_blanks':
        if (!question.textWithBlanks?.trim()) {
          errors.push('Le texte avec trous est obligatoire');
        }
        if (!question.blanks || question.blanks.length === 0) {
          errors.push('Au moins un trou est requis');
        }
        break;

      case 'matching':
        if (!question.leftItems || question.leftItems.length < 2) {
          errors.push('Au moins 2 éléments à gauche sont requis');
        }
        if (!question.rightItems || question.rightItems.length < 2) {
          errors.push('Au moins 2 éléments à droite sont requis');
        }
        break;

      default:
        // Handle unknown question types
        errors.push('Type de question non reconnu');
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }, []);

  // Helper function to create a properly typed Question from QuestionFormData
  const createTypedQuestion = useCallback(
    (questionData: QuestionFormData | Question, id: string, order: number): Question => {
      const baseProps = {
        id,
        title: questionData.title,
        content: questionData.content,
        points: questionData.points,
        difficulty: questionData.difficulty,
        explanation: questionData.explanation,
        hint: questionData.hint,
        order,
        required: questionData.required,
        tags: questionData.tags,
      };

      switch (questionData.type) {
        case 'multiple_choice': {
          const question: MultipleChoiceQuestion = {
            ...baseProps,
            type: 'multiple_choice',
            options: (questionData as any).options || [],
            allowMultiple: (questionData as any).allowMultiple || false,
            randomizeOptions: (questionData as any).randomizeOptions || false,
          };
          return question;
        }

        case 'true_false': {
          const question: TrueFalseQuestion = {
            ...baseProps,
            type: 'true_false',
            correctAnswer: (questionData as any).correctAnswer ?? false,
          };
          return question;
        }

        case 'short_answer': {
          const question: ShortAnswerQuestion = {
            ...baseProps,
            type: 'short_answer',
            correctAnswers: (questionData as any).correctAnswers || [],
            caseSensitive: (questionData as any).caseSensitive ?? false,
            exactMatch: (questionData as any).exactMatch ?? false,
            maxLength: (questionData as any).maxLength || 100,
          };
          return question;
        }

        case 'long_answer': {
          const question: LongAnswerQuestion = {
            ...baseProps,
            type: 'long_answer',
            minLength: (questionData as any).minLength || 50,
            maxLength: (questionData as any).maxLength || 1000,
            evaluationCriteria: (questionData as any).evaluationCriteria || [],
          };
          return question;
        }

        case 'fill_blanks': {
          const question: FillBlanksQuestion = {
            ...baseProps,
            type: 'fill_blanks',
            textWithBlanks: (questionData as any).textWithBlanks || '',
            blanks: (questionData as any).blanks || [],
            caseSensitive: (questionData as any).caseSensitive ?? false,
          };
          return question;
        }

        case 'matching': {
          const question: MatchingQuestion = {
            ...baseProps,
            type: 'matching',
            leftItems: (questionData as any).leftItems || [],
            rightItems: (questionData as any).rightItems || [],
            allowPartialCredit: (questionData as any).allowPartialCredit ?? true,
          };
          return question;
        }

        default: {
          // Fallback to multiple choice for unknown types
          const question: MultipleChoiceQuestion = {
            ...baseProps,
            type: 'multiple_choice',
            options: [],
            allowMultiple: false,
            randomizeOptions: false,
          };
          return question;
        }
      }
    },
    []
  );

  // Ajouter une question
  const addQuestion = useCallback(
    (questionData: QuestionFormData) => {
      const validation = validateQuestion(questionData);
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      const id = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newQuestion = createTypedQuestion(questionData, id, questions.length);

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);

      return { success: true, question: newQuestion };
    },
    [questions, validateQuestion, onQuestionsChange, createTypedQuestion]
  );

  // Mettre à jour une question
  const updateQuestion = useCallback(
    (questionId: string, updates: Partial<QuestionFormData>) => {
      const questionIndex = questions.findIndex((q) => q.id === questionId);
      if (questionIndex === -1) {
        return { success: false, errors: ['Question non trouvée'] };
      }

      const currentQuestion = questions[questionIndex];
      const updatedData = { ...currentQuestion, ...updates } as QuestionFormData;
      const validation = validateQuestion(updatedData);

      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }

      const updatedQuestions = [...questions];

      // Create a properly typed updated question based on the current question's type
      const updatedQuestion = createTypedQuestion(
        updatedData,
        currentQuestion.id,
        currentQuestion.order
      );

      updatedQuestions[questionIndex] = updatedQuestion;

      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);

      return { success: true, question: updatedQuestions[questionIndex] };
    },
    [questions, validateQuestion, onQuestionsChange, createTypedQuestion]
  );

  // Supprimer une question
  const removeQuestion = useCallback(
    (questionId: string) => {
      const updatedQuestions = questions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({ ...q, order: index }));

      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);

      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
      if (editingQuestion?.id === questionId) {
        setEditingQuestion(null);
      }
    },
    [questions, selectedQuestion, editingQuestion, onQuestionsChange]
  );

  // Dupliquer une question
  const duplicateQuestion = useCallback(
    (questionId: string) => {
      const questionToDuplicate = questions.find((q) => q.id === questionId);
      if (!questionToDuplicate) return;

      const newId = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newTitle = `${questionToDuplicate.title} (copie)`;

      // Create a properly typed duplicated question
      const duplicatedQuestion = createTypedQuestion(
        {
          ...questionToDuplicate,
          title: newTitle,
        } as QuestionFormData,
        newId,
        questions.length
      );

      const updatedQuestions = [...questions, duplicatedQuestion];
      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);
    },
    [questions, onQuestionsChange, createTypedQuestion]
  );

  // Réorganiser les questions (drag & drop)
  const reorderQuestions = useCallback(
    (startIndex: number, endIndex: number) => {
      const result = Array.from(questions);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      // Mettre à jour les ordres
      const reorderedQuestions = result.map((question, index) => ({
        ...question,
        order: index,
      }));

      setQuestions(reorderedQuestions);
      onQuestionsChange?.(reorderedQuestions);
    },
    [questions, onQuestionsChange]
  );

  // Gestion des options pour les choix multiples
  const addOption = useCallback(
    (questionId: string) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question || question.type !== 'multiple_choice') return;

      const mcQuestion = question as MultipleChoiceQuestion;
      const newOption: MultipleChoiceOption = {
        id: `option_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        text: '',
        isCorrect: false,
        order: mcQuestion.options?.length || 0,
      };

      updateQuestion(questionId, {
        options: [...(mcQuestion.options || []), newOption],
      });
    },
    [questions, updateQuestion]
  );

  const updateOption = useCallback(
    (questionId: string, optionId: string, updates: Partial<MultipleChoiceOption>) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question || question.type !== 'multiple_choice') return;

      const mcQuestion = question as MultipleChoiceQuestion;
      const options = mcQuestion.options || [];
      const updatedOptions = options.map((opt: MultipleChoiceOption) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      );

      updateQuestion(questionId, { options: updatedOptions });
    },
    [questions, updateQuestion]
  );

  const removeOption = useCallback(
    (questionId: string, optionId: string) => {
      const question = questions.find((q) => q.id === questionId);
      if (!question || question.type !== 'multiple_choice') return;

      const mcQuestion = question as MultipleChoiceQuestion;
      const options = mcQuestion.options || [];
      const updatedOptions = options
        .filter((opt: MultipleChoiceOption) => opt.id !== optionId)
        .map((opt: MultipleChoiceOption, index: number) => ({ ...opt, order: index }));

      updateQuestion(questionId, { options: updatedOptions });
    },
    [questions, updateQuestion]
  );

  // Utilitaires
  const getQuestionByType = useCallback(
    (type: QuestionType) => questions.filter((q) => q.type === type),
    [questions]
  );

  const getTotalPoints = useMemo(
    () => questions.reduce((total, question) => total + question.points, 0),
    [questions]
  );

  const getQuestionStats = useMemo(() => {
    const stats = {
      total: questions.length,
      byType: {} as Record<QuestionType, number>,
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
      totalPoints: getTotalPoints,
    };

    questions.forEach((question) => {
      // Par type
      stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;

      // Par difficulté
      stats.byDifficulty[question.difficulty] += 1;
    });

    return stats;
  }, [questions, getTotalPoints]);

  // Réinitialiser le formulaire
  const resetForm = useCallback(() => {
    setQuestionForm({
      type: 'multiple_choice',
      title: '',
      content: '',
      points: 10,
      difficulty: 'medium',
      required: true,
      tags: [],
    });
  }, []);

  return {
    // État
    questions,
    selectedQuestion,
    editingQuestion,
    draggedQuestion,
    questionForm,

    // Actions sur les questions
    addQuestion,
    updateQuestion,
    removeQuestion,
    duplicateQuestion,
    reorderQuestions,

    // Actions sur les options
    addOption,
    updateOption,
    removeOption,

    // Gestion de l'UI
    setSelectedQuestion,
    setEditingQuestion,
    setDraggedQuestion,
    setQuestionForm,
    resetForm,

    // Utilitaires
    validateQuestion,
    getQuestionByType,
    getQuestionStats,
    getTotalPoints,

    // État calculé
    canAddMore: questions.length < maxQuestions,
    hasQuestions: questions.length > 0,
    isEmpty: questions.length === 0,
  };
};
