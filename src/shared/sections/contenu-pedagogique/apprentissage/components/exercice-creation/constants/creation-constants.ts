import {
  faWand,
  faBrain,
  faRobot,
  faHandPaper,
  faCheckCircle,
  faPenToSquare,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

import type { DifficultyLevel } from '../types/exercise-types';
import type { QuestionTypeConfig } from '../types/question-types';
import type { AiModel, BloomLevel, WritingStyle, ComplexityLevel } from '../types/ai-types';
// Configuration des types de questions
export const QUESTION_TYPE_CONFIGS: Record<string, QuestionTypeConfig> = {
  multiple_choice: {
    type: 'multiple_choice',
    label: 'Choix multiples',
    description: 'Questions avec plusieurs options de réponse',
    icon: 'faCheckCircle',
    category: 'objective',
    complexity: 'simple',
    supportedFeatures: ['hints', 'explanations', 'randomization'],
  },
  true_false: {
    type: 'true_false',
    label: 'Vrai/Faux',
    description: 'Questions binaires avec réponse vraie ou fausse',
    icon: 'faQuestionCircle',
    category: 'objective',
    complexity: 'simple',
    supportedFeatures: ['hints', 'explanations'],
  },
  short_answer: {
    type: 'short_answer',
    label: 'Réponse courte',
    description: 'Questions nécessitant une réponse textuelle brève',
    icon: 'faPenToSquare',
    category: 'subjective',
    complexity: 'medium',
    supportedFeatures: ['hints', 'multiple_correct_answers', 'case_sensitivity'],
  },
  long_answer: {
    type: 'long_answer',
    label: 'Réponse longue',
    description: 'Questions nécessitant une réponse développée',
    icon: 'faAlignLeft',
    category: 'subjective',
    complexity: 'complex',
    supportedFeatures: ['rubrics', 'word_count', 'evaluation_criteria'],
  },
  fill_blanks: {
    type: 'fill_blanks',
    label: 'Texte à trous',
    description: 'Compléter les mots manquants dans un texte',
    icon: 'faFillDrip',
    category: 'interactive',
    complexity: 'medium',
    supportedFeatures: ['hints', 'multiple_blanks', 'case_sensitivity'],
  },
  matching: {
    type: 'matching',
    label: 'Correspondance',
    description: 'Associer des éléments entre deux listes',
    icon: 'faLink',
    category: 'interactive',
    complexity: 'medium',
    supportedFeatures: ['partial_credit', 'randomization'],
  },
};

// Options de difficulté
export const DIFFICULTY_OPTIONS = [
  {
    value: 'easy' as DifficultyLevel,
    label: 'Facile',
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    description: 'Concepts de base et rappels',
  },
  {
    value: 'medium' as DifficultyLevel,
    label: 'Moyen',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    description: 'Application et analyse',
  },
  {
    value: 'hard' as DifficultyLevel,
    label: 'Difficile',
    color: '#F44336',
    bgColor: '#FFEBEE',
    description: 'Synthèse et évaluation',
  },
];

// Modèles IA disponibles
export const AI_MODELS: Array<{ value: AiModel; label: string; description: string }> = [
  {
    value: 'gpt-4',
    label: 'GPT-4',
    description: 'Modèle le plus avancé, excellent pour des contenus complexes',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    description: 'Équilibre optimal entre qualité et rapidité',
  },
  {
    value: 'claude-3',
    label: 'Claude 3',
    description: "Excellent pour l'analyse et le raisonnement",
  },
  {
    value: 'gemini-pro',
    label: 'Gemini Pro',
    description: 'Performant pour les contenus multimodaux',
  },
];

// Styles d'écriture
export const WRITING_STYLES: Array<{ value: WritingStyle; label: string; description: string }> = [
  {
    value: 'formal',
    label: 'Formel',
    description: 'Langage soutenu et académique',
  },
  {
    value: 'casual',
    label: 'Décontracté',
    description: 'Langage accessible et familier',
  },
  {
    value: 'academic',
    label: 'Académique',
    description: 'Terminologie scientifique et précise',
  },
  {
    value: 'engaging',
    label: 'Engageant',
    description: "Captivant et motivant pour l'étudiant",
  },
  {
    value: 'concise',
    label: 'Concis',
    description: 'Direct et synthétique',
  },
];

// Niveaux de complexité
export const COMPLEXITY_LEVELS: Array<{
  value: ComplexityLevel;
  label: string;
  description: string;
}> = [
  {
    value: 'elementary',
    label: 'Élémentaire',
    description: 'Niveau primaire et début collège',
  },
  {
    value: 'intermediate',
    label: 'Intermédiaire',
    description: 'Niveau collège et lycée',
  },
  {
    value: 'advanced',
    label: 'Avancé',
    description: 'Niveau supérieur et professionnel',
  },
  {
    value: 'expert',
    label: 'Expert',
    description: 'Niveau recherche et spécialisation',
  },
];

// Taxonomie de Bloom
export const BLOOM_LEVELS: Array<{
  value: BloomLevel;
  label: string;
  description: string;
  color: string;
}> = [
  {
    value: 'remember',
    label: 'Se souvenir',
    description: 'Mémoriser et rappeler des informations',
    color: '#E3F2FD',
  },
  {
    value: 'understand',
    label: 'Comprendre',
    description: 'Expliquer des idées et concepts',
    color: '#E8F5E8',
  },
  {
    value: 'apply',
    label: 'Appliquer',
    description: 'Utiliser les connaissances dans de nouvelles situations',
    color: '#FFF3E0',
  },
  {
    value: 'analyze',
    label: 'Analyser',
    description: 'Décomposer en parties et examiner les relations',
    color: '#FCE4EC',
  },
  {
    value: 'evaluate',
    label: 'Évaluer',
    description: 'Porter des jugements basés sur des critères',
    color: '#F3E5F5',
  },
  {
    value: 'create',
    label: 'Créer',
    description: 'Produire quelque chose de nouveau ou original',
    color: '#FFEBEE',
  },
];

// Configuration des modes de création
export const CREATION_MODES = [
  {
    id: 'manual',
    title: 'Création manuelle',
    description: 'Contrôle total sur chaque aspect de votre exercice',
    icon: faHandPaper,
    color: '#1976D2',
    gradient: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
    features: [
      'Contrôle complet du contenu',
      'Éditeur riche intégré',
      'Gestion avancée des questions',
      'Ressources personnalisées',
    ],
    estimatedTime: '15-30 min',
  },
  {
    id: 'ai',
    title: 'Génération IA',
    description: "Laissez l'IA créer un exercice adapté à vos besoins",
    icon: faRobot,
    color: '#7B1FA2',
    gradient: 'linear-gradient(135deg, #7B1FA2 0%, #AB47BC 100%)',
    features: [
      'Génération automatique',
      'Questions adaptées au niveau',
      'Contenu pédagogique optimisé',
      'Gain de temps considérable',
    ],
    estimatedTime: '3-5 min',
  },
];

// Étapes de création manuelle
export const MANUAL_CREATION_STEPS = [
  {
    id: 'basic-info',
    title: 'Informations de base',
    description: 'Titre, description et paramètres généraux',
    icon: faBrain,
  },
  {
    id: 'content',
    title: 'Contenu pédagogique',
    description: 'Rédaction du contenu et ajout de ressources',
    icon: faPenToSquare,
  },
  {
    id: 'questions',
    title: 'Questions',
    description: 'Création et gestion des questions',
    icon: faQuestionCircle,
  },
  {
    id: 'config',
    title: 'Configuration',
    description: 'Paramètres avancés et finalisation',
    icon: faCheckCircle,
  },
];

// Étapes de création IA
export const AI_CREATION_STEPS = [
  {
    id: 'general-info',
    title: 'Informations générales',
    description: 'Sujet, thème et niveau de difficulté',
    icon: faBrain,
  },
  {
    id: 'question-config',
    title: 'Configuration des questions',
    description: 'Types et nombre de questions à générer',
    icon: faQuestionCircle,
  },
  {
    id: 'pedagogical',
    title: 'Objectifs pédagogiques',
    description: "Compétences et objectifs d'apprentissage",
    icon: faWand,
  },
  {
    id: 'finalization',
    title: 'Finalisation',
    description: "Révision et génération de l'exercice",
    icon: faCheckCircle,
  },
];

// Limites et contraintes
export const CREATION_LIMITS = {
  title: {
    min: 5,
    max: 200,
  },
  description: {
    min: 10,
    max: 1000,
  },
  content: {
    min: 50,
    max: 10000,
  },
  questions: {
    min: 1,
    max: 50,
  },
  questionTitle: {
    min: 5,
    max: 300,
  },
  questionContent: {
    min: 10,
    max: 2000,
  },
  options: {
    min: 2,
    max: 10,
  },
  tags: {
    max: 20,
  },
  estimatedDuration: {
    min: 1,
    max: 300,
  },
};

// Messages par défaut
export const DEFAULT_MESSAGES = {
  loading: {
    general: 'Chargement en cours...',
    aiGeneration: "Génération de l'exercice en cours...",
    questionCreation: 'Création de la question...',
    saving: 'Sauvegarde en cours...',
  },
  success: {
    exerciseCreated: 'Exercice créé avec succès !',
    exerciseUpdated: 'Exercice mis à jour avec succès !',
    questionAdded: 'Question ajoutée avec succès !',
    aiGenerated: 'Exercice généré avec succès !',
  },
  error: {
    general: 'Une erreur est survenue',
    network: 'Erreur de connexion réseau',
    aiGeneration: 'Erreur lors de la génération IA',
    validation: 'Veuillez corriger les erreurs de validation',
    required: 'Ce champ est obligatoire',
  },
};

// Presets IA populaires
export const AI_PRESETS = [
  {
    id: 'quiz-rapide',
    name: 'Quiz rapide',
    description: 'Questions de révision simples et directes',
    category: 'general' as const,
    popularity: 95,
    config: {
      questionCount: 10,
      questionTypes: ['multiple_choice', 'true_false'],
      difficultyDistribution: { easy: 60, medium: 30, hard: 10 },
      writingStyle: 'casual' as WritingStyle,
      includeHints: true,
    },
  },
  {
    id: 'evaluation-complete',
    name: 'Évaluation complète',
    description: "Exercice d'évaluation avec questions variées",
    category: 'general' as const,
    popularity: 85,
    config: {
      questionCount: 20,
      questionTypes: ['multiple_choice', 'short_answer', 'long_answer'],
      difficultyDistribution: { easy: 20, medium: 50, hard: 30 },
      writingStyle: 'formal' as WritingStyle,
      includeExplanations: true,
    },
  },
];

export default {
  QUESTION_TYPE_CONFIGS,
  DIFFICULTY_OPTIONS,
  AI_MODELS,
  WRITING_STYLES,
  COMPLEXITY_LEVELS,
  BLOOM_LEVELS,
  CREATION_MODES,
  MANUAL_CREATION_STEPS,
  AI_CREATION_STEPS,
  CREATION_LIMITS,
  DEFAULT_MESSAGES,
  AI_PRESETS,
};
