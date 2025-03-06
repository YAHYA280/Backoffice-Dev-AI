// src/shared/sections/contenu-pedagogique/apprentissage/index.ts

export { ApprentissageView as default } from './view';

// Re-export types but exclude constants that are now in types.ts
export type {
  Niveau,
  Matiere,
  Chapitre,
  Exercice,
  Pagination,
  FilterParams,
  ApiResponse,
} from './types';

// Re-export constants from types.ts
export { DIFFICULTE_OPTIONS, STATUT_OPTIONS, DEFAULT_PAGINATION, MATIERE_COLORS } from './types';

// Export the hooks
export { default as niveauxHooks } from './hooks/useNiveaux';
export * from './hooks/useMatieres';
export * from './hooks/useChapitres';
export * from './hooks/useExercices';
