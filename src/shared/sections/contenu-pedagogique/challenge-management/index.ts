// src/shared/sections/contenu-pedagogique/challenge-management/index.ts

// Hooks
export * from './hooks/useChallenge';

// Challenge components
export { ChallengeList } from './components/ChallengeList';

export { ChallengeItem } from './components/ChallengeItem';
export { default as ChallengeForm } from './components/ChallengeForm/index';
// Main components
export { ChallengesManagementView as default } from './view';
export { ChallengeDialog } from './components/ChallengeDialog';
export { ChallengeDetailDrawer } from './components/ChallengeDetailDrawer';
export { ChallengeDeleteDialog } from './components/ChallengeDeleteDialog';

// Types and Enums
export { Difficulty, ScoreMethod, QuestionType, MultimediaType, ChallengeStatus } from './types';

export type {
  Niveau,
  Reponse,
  Question,
  Challenge,
  Pagination,
  Multimedia,
  ApiResponse,
  FilterParams,
  ChallengeStats,
  PrerequisChallenge,
  ScoreConfiguration,
} from './types';

// Constants
export {
  TIMER_OPTIONS,
  STATUT_OPTIONS,
  DIFFICULTE_OPTIONS,
  TENTATIVES_OPTIONS,
  MESSAGE_FINAL_DEFAUT,
  TYPE_QUESTION_OPTIONS,
  MULTIMEDIA_TYPE_OPTIONS,
  DEFAULT_SCORE_CONFIGURATION,
  METHODE_CALCUL_SCORE_OPTIONS,
} from './constants';
