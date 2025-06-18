import type { DifficultyLevel } from './exercise-types';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'long_answer'
  | 'fill_blanks'
  | 'matching';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  content: string;
  points: number;
  difficulty: DifficultyLevel;
  explanation?: string;
  hint?: string;
  order: number;
  required: boolean;
  tags: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: MultipleChoiceOption[];
  allowMultiple: boolean;
  randomizeOptions: boolean;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short_answer';
  correctAnswers: string[];
  caseSensitive: boolean;
  exactMatch: boolean;
  maxLength: number;
}

export interface LongAnswerQuestion extends BaseQuestion {
  type: 'long_answer';
  minLength: number;
  maxLength: number;
  evaluationCriteria: string[];
  rubric?: EvaluationRubric;
}

export interface FillBlanksQuestion extends BaseQuestion {
  type: 'fill_blanks';
  textWithBlanks: string;
  blanks: BlankOption[];
  caseSensitive: boolean;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: MatchingItem[];
  rightItems: MatchingItem[];
  allowPartialCredit: boolean;
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | ShortAnswerQuestion
  | LongAnswerQuestion
  | FillBlanksQuestion
  | MatchingQuestion;

// Interfaces pour les options des questions
export interface MultipleChoiceOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
  order: number;
}

export interface BlankOption {
  id: string;
  position: number;
  correctAnswers: string[];
  placeholder?: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  matchId?: string; // ID de l'élément correspondant
  order: number;
}

export interface EvaluationRubric {
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  levels: RubricLevel[];
  weight: number;
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
}

// Types pour la création de questions
export interface QuestionFormData {
  type: QuestionType;
  title: string;
  content: string;
  points: number;
  difficulty: DifficultyLevel;
  explanation?: string;
  hint?: string;
  required: boolean;
  tags: string[];

  // Données spécifiques selon le type
  options?: MultipleChoiceOption[];
  allowMultiple?: boolean;
  correctAnswer?: boolean;
  correctAnswers?: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
  maxLength?: number;
  minLength?: number;
  textWithBlanks?: string;
  blanks?: BlankOption[];
  leftItems?: MatchingItem[];
  rightItems?: MatchingItem[];
}

// Interfaces utilitaires
export interface QuestionTypeConfig {
  type: QuestionType;
  label: string;
  description: string;
  icon: string;
  category: 'objective' | 'subjective' | 'interactive';
  complexity: 'simple' | 'medium' | 'complex';
  supportedFeatures: string[];
}

export interface QuestionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
