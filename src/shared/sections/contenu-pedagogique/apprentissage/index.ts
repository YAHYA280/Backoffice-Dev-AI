// src/shared/sections/contenu-pedagogique/apprentissage/index.ts

export * from './hooks/useMatieres';

export * from './hooks/useChapitres';

export * from './hooks/useExercices';

export { ApprentissageView as default } from './view';
export { default as niveauxHooks } from './hooks/useNiveaux';
export { STATUT_OPTIONS, MATIERE_COLORS, DIFFICULTE_OPTIONS, DEFAULT_PAGINATION } from './types';
export type {
  Niveau,
  Matiere,
  Chapitre,
  Exercice,
  Pagination,
  ApiResponse,
  FilterParams,
} from './types';
