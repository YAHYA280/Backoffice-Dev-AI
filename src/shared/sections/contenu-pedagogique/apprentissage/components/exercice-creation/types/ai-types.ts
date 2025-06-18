// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/types/ai-types.ts

import type { DifficultyLevel } from './exercise-types';
// Import des types de questions nécessaires
import type {
  BlankOption,
  QuestionType,
  MatchingItem,
  MultipleChoiceOption,
} from './question-types';

export type AiModel = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'gemini-pro';

export type GenerationStatus = 'idle' | 'generating' | 'completed' | 'error' | 'cancelled';

export interface AiGenerationConfig {
  // Configuration du modèle
  model: AiModel;
  temperature: number; // 0-1, créativité
  maxTokens: number;

  // Configuration du contenu
  topic: string;
  subtopics: string[];
  educationalLevel: string;
  language: 'fr' | 'en' | 'es';

  // Configuration des questions
  questionCount: number;
  questionTypes: QuestionType[];
  difficultyDistribution: DifficultyDistribution;

  // Objectifs pédagogiques
  learningObjectives: string[];
  competencies: string[];
  bloomTaxonomyLevels: BloomLevel[];

  // Options avancées
  includeExplanations: boolean;
  includeHints: boolean;
  generateRubrics: boolean;
  contextualResources: boolean;

  // Style et ton
  writingStyle: WritingStyle;
  complexityLevel: ComplexityLevel;
}

export interface DifficultyDistribution {
  easy: number;
  medium: number;
  hard: number;
}

export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export type WritingStyle = 'formal' | 'casual' | 'academic' | 'engaging' | 'concise';

export type ComplexityLevel = 'elementary' | 'intermediate' | 'advanced' | 'expert';

export interface AiPromptHistory {
  id: string;
  timestamp: string;
  promptType: PromptType;
  prompt: string;
  response: string;
  model: AiModel;
  config: Partial<AiGenerationConfig>;
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  success: boolean;
  error?: string;
}

export type PromptType =
  | 'exercise_generation'
  | 'question_generation'
  | 'content_refinement'
  | 'explanation_generation'
  | 'hint_generation';

export interface AiGenerationRequest {
  config: AiGenerationConfig;
  customPrompt?: string;
  previousContext?: AiPromptHistory[];
  regenerateSpecific?: {
    type: 'questions' | 'content' | 'explanations';
    items?: string[]; // IDs spécifiques à régénérer
  };
}

export interface AiGenerationResponse {
  success: boolean;
  data?: AiGeneratedContent;
  error?: AiError;
  metadata: {
    model: AiModel;
    tokens: {
      input: number;
      output: number;
      total: number;
    };
    processingTime: number;
    timestamp: string;
  };
}

export interface AiGeneratedContent {
  exercise: {
    title: string;
    description: string;
    content: string;
    tags: string[];
    estimatedDuration: number;
  };
  questions: AiGeneratedQuestion[];
  resources?: {
    suggestedReadings: string[];
    additionalMaterials: string[];
    relatedTopics: string[];
  };
  pedagogicalNotes?: {
    teachingTips: string[];
    commonMistakes: string[];
    assessmentGuidance: string[];
  };
}

export interface AiGeneratedQuestion {
  type: QuestionType;
  title: string;
  content: string;
  points: number;
  difficulty: DifficultyLevel;
  explanation?: string;
  hint?: string;
  tags: string[];

  // Données spécifiques selon le type
  options?: MultipleChoiceOption[];
  correctAnswer?: boolean;
  correctAnswers?: string[];
  textWithBlanks?: string;
  blanks?: BlankOption[];
  leftItems?: MatchingItem[];
  rightItems?: MatchingItem[];

  // Métadonnées IA
  confidence: number; // 0-1
  bloomLevel: BloomLevel;
  generationNotes?: string;
}

export interface AiError {
  code: string;
  message: string;
  details?: any;
  suggestions?: string[];
}

// Interfaces pour l'UI de génération IA
export interface AiGenerationState {
  status: GenerationStatus;
  progress: number; // 0-100
  currentStep?: string;
  generatedContent?: AiGeneratedContent;
  error?: AiError;
  canCancel: boolean;
}

export interface AiFormData {
  // Étape 1: Informations générales
  topic: string;
  subtopics: string[];
  educationalLevel: string;
  difficulty: DifficultyLevel;

  // Étape 2: Configuration des questions
  questionCount: number;
  questionTypes: QuestionType[];
  difficultyDistribution: DifficultyDistribution;

  // Étape 3: Objectifs pédagogiques
  learningObjectives: string[];
  competencies: string[];
  bloomTaxonomyLevels: BloomLevel[];

  // Étape 4: Options avancées
  includeExplanations: boolean;
  includeHints: boolean;
  writingStyle: WritingStyle;
  customPrompt?: string;
}

export interface AiPreset {
  id: string;
  name: string;
  description: string;
  config: Partial<AiGenerationConfig>;
  category: 'general' | 'subject-specific' | 'custom';
  popularity: number;
}
