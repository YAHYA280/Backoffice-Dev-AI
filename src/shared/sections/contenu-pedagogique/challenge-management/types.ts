export enum ChallengeStatus {
  ACTIF = 'Actif',
  INACTIF = 'Inactif',
  SUPPRIME = 'Supprimé',
}

// Enum for Difficulty levels
export enum Difficulty {
  FACILE = 'Facile',
  MOYEN = 'Moyen',
  DIFFICILE = 'Difficile',
}

// Enum for Question Types
export enum QuestionType {
  QCM = 'QCM',
  OUVERTE = 'Ouverte',
  MINIJEU = 'MiniJeu',
  VISUEL = 'Visuel',
}

// Enum for Score Methods
export enum ScoreMethod {
  NB_BONNES_REPONSES = 'NbBonnesReponses',
  TEMPS = 'Temps',
  PENALITES = 'Penalites',
}

// Enum for Multimedia Types
export enum MultimediaType {
  IMAGE = 'Image',
  VIDEO = 'Video',
  AUDIO = 'Audio',
  DOCUMENT = 'Document',
}

// Interface for Response (Réponse in the diagram)
export interface Reponse {
  id: string;
  texte: string;
  estCorrecte: boolean;
}

// Interface for Question
export interface Question {
  id: string;
  texte: string;
  type: QuestionType;
  ordre: number;
  reponses?: Reponse[];
  // Methods from diagram
  ajouterReponse?: (reponse: Reponse) => void;
  retirerReponse?: (reponse: Reponse) => void;
}

// Interface for ScoreConfiguration
export interface ScoreConfiguration {
  id: string;
  methode: ScoreMethod;
  parametres: string; // JSON string containing method parameters
}

// Interface for Multimedia
export interface Multimedia {
  id: string;
  type: MultimediaType;
  url: string;
}

// Interface for prerequisite Challenge
export interface PrerequisChallenge {
  id: string;
  nom: string;
  pourcentageMinimum: number; // Added for business logic
}

// Updated Challenge interface
export interface Challenge {
  id: string;
  nom: string; // Renamed from 'titre' to match diagram
  description: string;
  statut: ChallengeStatus;
  difficulte: Difficulty; // Renamed from 'niveauDifficulte'
  timer: number; // In minutes
  nbTentatives: number; // Renamed from 'tentativesMax'
  datePublication: string;
  dateCreation: string;
  dateMiseAJour?: string; // Added to match diagram
  messageSucces: string; // Renamed from 'messageFinalSuccess'
  messageEchec: string; // Renamed from 'messageFinalFailure'
  prerequis?: PrerequisChallenge;
  niveau?: {
    id: string;
    nom: string;
  };
  scoreConfiguration: ScoreConfiguration;
  multimedias?: Multimedia[];
  questions?: Question[];

  // Business properties from original code, not in diagram but needed for UI
  isRandomQuestions?: boolean;
  participantsCount?: number;
  questionsCount?: number;
  active?: boolean;

  // Methods from diagram
  ajouterQuestion?: (question: Question) => void;
  retirerQuestion?: (question: Question) => void;
  reinitialiser?: () => void;
  modifierChallenge?: (updatedData: Partial<Challenge>) => void;
}

// Pagination interface (carried over from original)
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

// Filter parameters interface (carried over from original with updates)
export interface FilterParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';

  // Updated filter names to match new property names
  nomFilter?: string;
  descriptionFilter?: string;
  statutFilter?: ChallengeStatus;
  dateCreationFilter?: string;
  datePublicationFilter?: string;
  dateMiseAJourFilter?: string;
  niveauIdFilter?: string;
  difficulteFilter?: Difficulty;
  activeOnly?: boolean;
  nbTentativesFilter?: string;
  prerequisFilter?: string;

  // Other filters
  [key: string]: any;
}

// API Response interface (carried over from original)
export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  message?: string;
  success: boolean;
}

// Challenge stats interface (carried over from original)
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

// Niveau interface (simplified from original)
export interface Niveau {
  id: string;
  nom: string;
}
