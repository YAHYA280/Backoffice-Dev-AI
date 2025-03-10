// In your types.ts file
export interface Niveau {
  id: string;
  nom: string;
  description: string;
  code: string;
  matieresCount?: number;
  dateCreated?: string;
  active?: boolean;
  // Add these new properties
  exercicesCount?: number;
  lastUpdated?: string;
}

export interface Matiere {
  id: string;
  nom: string;
  description: string;
  niveauId: string;
  couleur: string; // For the colored circle in the UI
  icon: string; // Letter for the circle icon
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
}

export interface Exercice {
  id: string;
  titre: string;
  description: string;
  statut: 'Publié' | 'Brouillon' | 'Inactif';
  ressources: string[];
  chapitreId: string;
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
  // New column specific filters
  nomFilter?: string;
  descriptionFilter?: string;
  codeFilter?: string;
  dateCreatedFilter?: string;
  activeOnly?: boolean;
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

// export const MATIERE_COLORS = [
//   { couleur: '#FF5722', icon: 'M' }, // Mathématiques
//   { couleur: '#2196F3', icon: 'F' }, // Français
//   { couleur: '#4CAF50', icon: 'S' }, // Sciences
//   { couleur: '#9C27B0', icon: 'H' }, // Histoire-Géographie
//   { couleur: '#FF9800', icon: 'A' }, // Arts plastiques
//   { couleur: '#795548', icon: 'E' }, // Éducation physique
//   { couleur: '#607D8B', icon: 'L' }, // Langues étrangères
//   { couleur: '#F44336', icon: 'I' }, // Informatique
// ];

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
