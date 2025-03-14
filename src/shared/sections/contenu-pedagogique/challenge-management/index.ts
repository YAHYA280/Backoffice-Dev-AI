// src/shared/sections/contenu-pedagogique/challenge-management/index.ts

// Hooks
export * from './hooks/useChallenge';

// Composants principaux
export { ChallengesManagementView as default } from './view';

// Composants de challenge
export { default as ChallengeList } from './components/ChallengeList';
export { default as ChallengeItem } from './components/ChallengeItem';
export { default as ChallengeForm } from './components/ChallengeForm';
export { default as ChallengeDialog } from './components/ChallengeDialog';
export { default as ChallengeDetailDrawer } from './components/ChallengeDetailDrawer';
export { default as ChallengeDeleteDialog } from './components/ChallengeDeleteDialog';

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
