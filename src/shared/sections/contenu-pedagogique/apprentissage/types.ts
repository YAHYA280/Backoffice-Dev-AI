// In your types.ts file
export interface Niveau {
  id: string;
  nom: string;
  description: string;
  code: string;
  matieresCount?: number;
  dateCreated?: string;
  active?: boolean;
  exercicesCount?: number;
  lastUpdated?: string;
}

export interface Matiere {
  id: string;
  nom: string;
  description: string;
  niveauId: string;
  couleur: string;
  icon: string;
  chapitresCount: number;
  dateCreated?: string;
  lastUpdated?: string;
  active?: boolean;
  exercicesCount?: number;
}

export interface Chapitre {
  id: string;
  ordre: number;
  nom: string;
  description: string;
  difficulte: 'Facile' | 'Moyen' | 'Difficile';
  matiereId: string;
  exercicesCount: number;
  competencesCount: number;
  dureeEstimee: string;
  active?: boolean;
  dateCreated: string;
  lastUpdated: string;
}

export interface Exercice {
  id: string;
  titre: string;
  description: string;
  statut: 'Publié' | 'Brouillon' | 'Inactif';
  ressources: string[];
  chapitreId: string;
  dateCreated?: string;
  lastUpdated?: string;
  notation?: number;
  competencesCount?: number;
  active?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface FilterParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';

  // Filtres communs pour Niveau
  nomFilter?: string;
  descriptionFilter?: string;
  codeFilter?: string;
  dateCreatedFilter?: string;
  activeOnly?: boolean;

  // Filtres spécifiques pour Exercice
  titreFilter?: string;
  statutFilter?: string;
  ressourcesFilter?: string;
  resourceType?: string;

  // Filtres spécifiques pour Matière
  couleurFilter?: string;
  niveauIdFilter?: string;
  chapitresCountFilter?: string;
  exercicesCountFilter?: string;

  // Autres filtres potentiels
  [key: string]: any;
}

// Response interfaces
export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string;
  success: boolean;
}

// Adding the missing constants
export const DIFFICULTE_OPTIONS = [
  { value: 'Facile', label: 'Facile', color: '#2e7d32', bgColor: '#C8E6C9' },
  { value: 'Moyen', label: 'Moyen', color: '#e65100', bgColor: '#FFECB3' },
  { value: 'Difficile', label: 'Difficile', color: '#c62828', bgColor: '#EF9A9A' },
];

export const STATUT_OPTIONS = [
  { value: 'Publié', label: 'Publié', color: '#2e7d32', bgColor: '#C8E6C9' },
  { value: 'Brouillon', label: 'Brouillon', color: '#FF6F00', bgColor: '#FFF9C4' },
  { value: 'Inactif', label: 'Inactif', color: '#757575', bgColor: '#E0E0E0' },
];

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
};

export const MATIERE_COLORS = [
  { couleur: '#FF5722' }, // Mathématiques
  { couleur: '#2196F3' }, // Français
  { couleur: '#4CAF50' }, // Sciences
  { couleur: '#9C27B0' }, // Histoire-Géographie
  { couleur: '#FF9800' }, // Arts plastiques
  { couleur: '#795548' }, // Éducation physique
  { couleur: '#607D8B' }, // Langues étrangères
  { couleur: '#F44336' }, // Informatique
];
