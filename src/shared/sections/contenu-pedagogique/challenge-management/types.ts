export interface Question {
  id: string;
  type: 'QCM' | 'OUVERTE' | 'MINIJEU' | 'VISUEL';
  contenu: string;
  options?: string[];
  reponses: string[];
  indices?: string[];
  pointsMax: number;
  mediaUrl?: string;
  tempsMaxSeconds?: number;
  ordre: number;
}

export interface PrerequisChallenge {
  id: string;
  titre: string;
  pourcentageMinimum: number;
}

export interface MessageFinal {
  seuil: number;
  message: string;
}

export interface Challenge {
  id: string;
  titre: string;
  description: string;
  statut: 'Actif' | 'Brouillon' | 'Terminé' | 'Archivé';
  dateCreation: string;
  datePublication: string;
  dateFin?: string;
  niveauId?: string;
  niveauNom?: string;
  niveauDifficulte: 'Facile' | 'Moyen' | 'Difficile';
  participantsCount?: number;
  questionsCount?: number;
  questions?: Question[];
  timeMaxMinutes?: number;
  tentativesMax: number;
  isRandomQuestions: boolean;
  pointsRecompense: number;
  badgeRecompense?: string;
  methodeCalculScore: 'SIMPLE' | 'TEMPS' | 'PENALITES';
  messageFinaux: MessageFinal[];
  prerequisChallenge?: PrerequisChallenge;
  mediaIntro?: string;
  active: boolean;
  suppressionDate?: string;
  restaurable?: boolean;
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

  // Filtres spécifiques pour Challenge
  titreFilter?: string;
  descriptionFilter?: string;
  statutFilter?: string;
  dateCreationFilter?: string;
  datePublicationFilter?: string;
  dateFinFilter?: string;
  niveauIdFilter?: string;
  niveauDifficulteFilter?: string;
  activeOnly?: boolean;
  restaurableOnly?: boolean;
  prerequisChallengeIdFilter?: string;
  tentativesMaxFilter?: string;

  // Autres filtres potentiels
  [key: string]: any;
}

// Réponse API
export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string;
  success: boolean;
}

// Interface pour gérer les statistiques d'un challenge
export interface ChallengeStats {
  id: string;
  challengeId: string;
  totalParticipants: number;
  participantsSuccess: number;
  participantsFailure: number;
  averageScore: number;
  averageTime: number;
  tentativesTotal: number;
  tentativesMoyennes: number;
  dateGeneration: string;
}

// Interface pour les niveaux simplifiés (puisque les challenges sont liés aux niveaux uniquement)
export interface NiveauSimple {
  id: string;
  nom: string;
}
