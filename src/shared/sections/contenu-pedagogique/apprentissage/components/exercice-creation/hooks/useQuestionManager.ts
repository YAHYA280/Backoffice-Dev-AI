// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/hooks/useQuestionManager.ts

import { useState, useCallback } from 'react';
import type { Question, QuestionFormData, QuestionType } from '../types/question-types';

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

  // Simple validation function
  const validateQuestion = useCallback((questionData: QuestionFormData): string[] => {
    const errors: string[] = [];

    if (!questionData.title.trim()) {
      errors.push('Le titre est obligatoire');
    }
    if (!questionData.content.trim()) {
      errors.push('Le contenu est obligatoire');
    }
    if (questionData.points <= 0) {
      errors.push('Les points doivent être supérieurs à 0');
    }

    // Type-specific validation
    switch (questionData.type) {
      case 'multiple_choice':
        if (!questionData.options || questionData.options.length < 2) {
          errors.push('Au moins 2 options sont requises');
        } else {
          const correctOptions = questionData.options.filter((opt) => opt.isCorrect);
          if (correctOptions.length === 0) {
            errors.push('Au moins une option correcte est requise');
          }
        }
        break;
      case 'true_false':
        if (questionData.correctAnswer === undefined) {
          errors.push('Sélectionnez la réponse correcte');
        }
        break;
      case 'short_answer':
        if (!questionData.correctAnswers || questionData.correctAnswers.length === 0) {
          errors.push('Au moins une réponse correcte est requise');
        }
        break;
      default:
        break;
    }

    return errors;
  }, []);

  // Create a typed question from form data
  const createTypedQuestion = useCallback(
    (questionData: QuestionFormData, id: string, order: number): Question => {
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
        case 'multiple_choice':
          return {
            ...baseProps,
            type: 'multiple_choice',
            options: questionData.options || [],
            allowMultiple: questionData.allowMultiple || false,
            randomizeOptions: false,
          };
        case 'true_false':
          return {
            ...baseProps,
            type: 'true_false',
            correctAnswer: questionData.correctAnswer ?? false,
          };
        case 'short_answer':
          return {
            ...baseProps,
            type: 'short_answer',
            correctAnswers: questionData.correctAnswers || [],
            caseSensitive: questionData.caseSensitive ?? false,
            exactMatch: questionData.exactMatch ?? false,
            maxLength: questionData.maxLength || 100,
          };
        case 'long_answer':
          return {
            ...baseProps,
            type: 'long_answer',
            minLength: questionData.minLength || 50,
            maxLength: questionData.maxLength || 1000,
            evaluationCriteria: [],
          };
        case 'fill_blanks':
          return {
            ...baseProps,
            type: 'fill_blanks',
            textWithBlanks: questionData.textWithBlanks || '',
            blanks: questionData.blanks || [],
            caseSensitive: questionData.caseSensitive ?? false,
          };
        case 'matching':
          return {
            ...baseProps,
            type: 'matching',
            leftItems: questionData.leftItems || [],
            rightItems: questionData.rightItems || [],
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

  // Add question
  const addQuestion = useCallback(
    (questionData: QuestionFormData) => {
      const errors = validateQuestion(questionData);
      if (errors.length > 0) {
        return { success: false, errors };
      }

      const id = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newQuestion = createTypedQuestion(questionData, id, questions.length);

      const updatedQuestions = [...questions, newQuestion];
      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);

      return { success: true, question: newQuestion };
    },
    [questions, validateQuestion, createTypedQuestion, onQuestionsChange]
  );

  // Update question
  const updateQuestion = useCallback(
    (questionId: string, updates: Partial<QuestionFormData>) => {
      const questionIndex = questions.findIndex((q) => q.id === questionId);
      if (questionIndex === -1) {
        return { success: false, errors: ['Question non trouvée'] };
      }

      const currentQuestion = questions[questionIndex];
      const updatedData = { ...currentQuestion, ...updates } as QuestionFormData;
      const errors = validateQuestion(updatedData);

      if (errors.length > 0) {
        return { success: false, errors };
      }

      const updatedQuestions = [...questions];
      const updatedQuestion = createTypedQuestion(
        updatedData,
        currentQuestion.id,
        currentQuestion.order
      );
      updatedQuestions[questionIndex] = updatedQuestion;

      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);

      return { success: true, question: updatedQuestion };
    },
    [questions, validateQuestion, createTypedQuestion, onQuestionsChange]
  );

  // Remove question
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

  // Duplicate question
  const duplicateQuestion = useCallback(
    (questionId: string) => {
      const questionToDuplicate = questions.find((q) => q.id === questionId);
      if (!questionToDuplicate) return;

      const newId = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newTitle = `${questionToDuplicate.title} (copie)`;

      const duplicatedQuestion = createTypedQuestion(
        { ...questionToDuplicate, title: newTitle } as QuestionFormData,
        newId,
        questions.length
      );

      const updatedQuestions = [...questions, duplicatedQuestion];
      setQuestions(updatedQuestions);
      onQuestionsChange?.(updatedQuestions);
    },
    [questions, createTypedQuestion, onQuestionsChange]
  );

  // Get statistics
  const getQuestionStats = () => {
    const stats = {
      total: questions.length,
      byType: {} as Record<QuestionType, number>,
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
      },
    };

    questions.forEach((question) => {
      stats.byType[question.type] = (stats.byType[question.type] || 0) + 1;
      stats.byDifficulty[question.difficulty] += 1;
    });

    return stats;
  };

  const getTotalPoints = () => questions.reduce((total, question) => total + question.points, 0);

  return {
    // State
    questions,
    selectedQuestion,
    editingQuestion,

    // Actions
    addQuestion,
    updateQuestion,
    removeQuestion,
    duplicateQuestion,
    setSelectedQuestion,
    setEditingQuestion,

    // Utilities
    validateQuestion,
    getQuestionStats,
    getTotalPoints,

    // Computed
    canAddMore: questions.length < maxQuestions,
    hasQuestions: questions.length > 0,
    isEmpty: questions.length === 0,
  };
};
