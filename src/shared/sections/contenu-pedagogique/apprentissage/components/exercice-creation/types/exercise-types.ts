// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/types/exercise-types.ts

import type { Question } from './question-types';
import type { AiPromptHistory, AiGenerationConfig } from './ai-types';

export type CreationMode = 'manual' | 'ai';

export type ExerciseStatus = 'draft' | 'published' | 'archived';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface BaseExercise {
  id?: string;
  title: string;
  description: string;
  subject: string;
  chapter: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // en minutes
  status: ExerciseStatus;
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ManualExercise extends BaseExercise {
  mode: 'manual';
  content: string; // Contenu pédagogique riche
  resources: ExerciseResource[];
  questions: Question[];
  config: ExerciseConfig;
}

export interface AiExercise extends BaseExercise {
  mode: 'ai';
  aiConfig: AiGenerationConfig;
  generatedContent?: string;
  generatedQuestions?: Question[];
  aiPrompts: AiPromptHistory[];
  config: ExerciseConfig;
}

export type Exercise = ManualExercise | AiExercise;

export interface ExerciseResource {
  id: string;
  type: 'pdf' | 'video' | 'audio' | 'image' | 'link';
  name: string;
  url: string;
  description?: string;
  size?: number;
}

export interface ExerciseConfig {
  allowRetries: boolean;
  maxRetries?: number;
  timeLimit?: number; // en minutes
  showCorrectAnswers: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  passingScore: number; // pourcentage
  enableHints: boolean;
  enableExplanations: boolean;
}

// Types pour les formulaires de création
export interface CreationFormData {
  // Informations générales
  title: string;
  description: string;
  subject: string;
  chapter: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number;
  tags: string[];

  // Contenu (pour manuel)
  content?: string;
  resources?: ExerciseResource[];

  // Configuration IA (pour IA)
  aiConfig?: AiGenerationConfig;

  // Questions
  questions: Question[];

  // Configuration avancée
  config: ExerciseConfig;
}

export interface CreationStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isValid: boolean;
  component: React.ComponentType<any>;
}
