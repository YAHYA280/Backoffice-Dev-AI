// src/shared/sections/contenu-pedagogique/apprentissage/index.ts

export * from './hooks/useMatieres';

export * from './hooks/useChapitres';

export * from './hooks/useExercices';

export { ApprentissageView as default } from './view';
// Export the hooks
export { default as niveauxHooks } from './hooks/useNiveaux';
// Re-export constants from types.ts
export { STATUT_OPTIONS, MATIERE_COLORS, DIFFICULTE_OPTIONS, DEFAULT_PAGINATION } from './types';
// Re-export types but exclude constants that are now in types.ts
export type {
  Niveau,
  Matiere,
  Chapitre,
  Exercice,
  Pagination,
  ApiResponse,
  FilterParams,
} from './types';
