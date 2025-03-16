// src/shared/sections/contenu-pedagogique/challenge-management/index.ts

// Hooks
export * from './hooks/useChallenge';

// Main components
export { ChallengesManagementView as default } from './view';

// Challenge components
export { ChallengeList } from './components/ChallengeList';
export { ChallengeItem } from './components/ChallengeItem';
export { ChallengeForm } from './components/ChallengeForm';
export { ChallengeDialog } from './components/ChallengeDialog';
export { ChallengeDetailDrawer } from './components/ChallengeDetailDrawer';
export { ChallengeDeleteDialog } from './components/ChallengeDeleteDialog';

// Types
export type {
  Question,
  Challenge,
  Pagination,
  ApiResponse,
  MessageFinal,
  FilterParams,
  ChallengeStats,
  PrerequisChallenge,
} from './types';

// Constants
export {
  TIMER_OPTIONS,
  STATUT_OPTIONS,
  RECOMPENSE_TYPES,
  DIFFICULTE_OPTIONS,
  TENTATIVES_OPTIONS,
  MESSAGE_FINAL_DEFAUT,
  TYPE_QUESTION_OPTIONS,
  METHODE_CALCUL_SCORE_OPTIONS,
} from './constants';
