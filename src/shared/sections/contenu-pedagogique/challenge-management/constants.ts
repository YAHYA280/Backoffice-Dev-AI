export const STATUT_OPTIONS = [
  { value: 'Actif', label: 'Actif', color: '#2e7d32', bgColor: '#C8E6C9' },
  { value: 'Brouillon', label: 'Brouillon', color: '#FF6F00', bgColor: '#FFF9C4' },
  { value: 'Terminé', label: 'Terminé', color: '#757575', bgColor: '#E0E0E0' },
  { value: 'Archivé', label: 'Archivé', color: '#455A64', bgColor: '#CFD8DC' },
];

export const DIFFICULTE_OPTIONS = [
  { value: 'Facile', label: 'Facile', color: '#2e7d32', bgColor: '#C8E6C9' },
  { value: 'Moyen', label: 'Moyen', color: '#e65100', bgColor: '#FFECB3' },
  { value: 'Difficile', label: 'Difficile', color: '#c62828', bgColor: '#EF9A9A' },
];

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
};

export const TYPE_QUESTION_OPTIONS = [
  { value: 'QCM', label: 'Choix multiple' },
  { value: 'OUVERTE', label: 'Question ouverte' },
  { value: 'MINIJEU', label: 'Mini-jeu interactif' },
  { value: 'VISUEL', label: 'Question visuelle' },
];

export const METHODE_CALCUL_SCORE_OPTIONS = [
  {
    value: 'SIMPLE',
    label: 'Somme des points',
    description: 'Additionne simplement les points obtenus à chaque question.',
  },
  {
    value: 'TEMPS',
    label: 'Basé sur le temps',
    description: "Plus l'élève répond vite, plus il obtient de points.",
  },
  {
    value: 'PENALITES',
    label: 'Avec pénalités',
    description: 'Des points sont déduits pour chaque tentative infructueuse.',
  },
];

export const RECOMPENSE_TYPES = [
  { value: 'badge', label: 'Badge' },
  { value: 'trophy', label: 'Trophée' },
  { value: 'points', label: 'Points' },
  { value: 'certificat', label: 'Certificat' },
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

export const MESSAGE_FINAL_DEFAUT = [
  {
    seuil: 80,
    message: 'Félicitations ! Vous avez brillamment réussi ce challenge !',
  },
  {
    seuil: 60,
    message: 'Bien joué ! Vous avez réussi ce challenge avec succès.',
  },
  {
    seuil: 40,
    message: 'Pas mal ! Vous avez réussi ce challenge, mais vous pouvez encore vous améliorer.',
  },
  {
    seuil: 0,
    message: "Dommage, vous n'avez pas réussi ce challenge. Réessayez pour faire mieux !",
  },
];
