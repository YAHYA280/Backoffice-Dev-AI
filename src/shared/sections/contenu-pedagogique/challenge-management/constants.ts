// src/shared/sections/contenu-pedagogique/challenge-management/constants.ts

import { ChallengeStatus, Difficulty, ScoreMethod, QuestionType, MultimediaType } from './types';

// Updated to use new ChallengeStatus enum
export const STATUT_OPTIONS = [
  { value: ChallengeStatus.ACTIF, label: 'Actif', color: '#2e7d32', bgColor: '#C8E6C9' },
  { value: ChallengeStatus.INACTIF, label: 'Inactif', color: '#FF6F00', bgColor: '#FFF9C4' },
  { value: ChallengeStatus.SUPPRIME, label: 'Supprimé', color: '#455A64', bgColor: '#CFD8DC' },
];

// Updated to use new Difficulty enum
export const DIFFICULTE_OPTIONS = [
  { value: Difficulty.FACILE, label: 'Facile', color: '#2e7d32', bgColor: '#C8E6C9' },
  { value: Difficulty.MOYEN, label: 'Moyen', color: '#e65100', bgColor: '#FFECB3' },
  { value: Difficulty.DIFFICILE, label: 'Difficile', color: '#c62828', bgColor: '#EF9A9A' },
];

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
};

// Updated to use QuestionType enum
export const TYPE_QUESTION_OPTIONS = [
  { value: QuestionType.QCM, label: 'Choix multiple' },
  { value: QuestionType.OUVERTE, label: 'Question ouverte' },
  { value: QuestionType.MINIJEU, label: 'Mini-jeu interactif' },
  { value: QuestionType.VISUEL, label: 'Question visuelle' },
];

// Updated to use ScoreMethod enum
export const METHODE_CALCUL_SCORE_OPTIONS = [
  {
    value: ScoreMethod.NB_BONNES_REPONSES,
    label: 'Somme des points',
    description: 'Additionne simplement les points obtenus à chaque question.',
  },
  {
    value: ScoreMethod.TEMPS,
    label: 'Basé sur le temps',
    description: "Plus l'élève répond vite, plus il obtient de points.",
  },
  {
    value: ScoreMethod.PENALITES,
    label: 'Avec pénalités',
    description: 'Des points sont déduits pour chaque tentative infructueuse.',
  },
];

// Multimedia type options
export const MULTIMEDIA_TYPE_OPTIONS = [
  { value: MultimediaType.IMAGE, label: 'Image' },
  { value: MultimediaType.VIDEO, label: 'Vidéo' },
  { value: MultimediaType.AUDIO, label: 'Audio' },
  { value: MultimediaType.DOCUMENT, label: 'Document' },
];

export const TENTATIVES_OPTIONS = [
  { value: 1, label: '1 tentative' },
  { value: 2, label: '2 tentatives' },
  { value: 3, label: '3 tentatives' },
  { value: 5, label: '5 tentatives' },
  { value: -1, label: 'Illimité' },
];

export const TIMER_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 heure' },
  { value: 90, label: '1 heure 30' },
  { value: 120, label: '2 heures' },
];

// Default messages for success/failure
export const MESSAGE_FINAL_DEFAUT = {
  success: 'Félicitations ! Vous avez réussi ce challenge !',
  failure: "Dommage, vous n'avez pas réussi ce challenge. Réessayez pour faire mieux !",
};

// Default ScoreConfiguration
export const DEFAULT_SCORE_CONFIGURATION = {
  id: '1',
  methode: ScoreMethod.NB_BONNES_REPONSES,
  parametres: JSON.stringify({
    pointsParBonneReponse: 10,
    pointsTotal: 100,
  }),
};
