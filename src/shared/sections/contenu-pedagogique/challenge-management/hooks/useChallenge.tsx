'use client';

import { addDays, subDays, subMonths } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';

import { Difficulty, ScoreMethod, QuestionType, MultimediaType, ChallengeStatus } from '../types';
import {
  DEFAULT_PAGINATION,
  MESSAGE_FINAL_DEFAUT,
  DEFAULT_SCORE_CONFIGURATION,
} from '../constants';

import type { Question, Challenge, Pagination, ApiResponse, FilterParams } from '../types';

// Generate mock questions with the updated structure
const generateMockQuestions = (): Question[] => [
  {
    id: '1',
    texte: 'Quelle est la capitale de la France?',
    type: QuestionType.QCM,
    ordre: 1,
    points: 10, // Added points
    duree: 30, // Added duration in seconds
    isRequired: true, // Added isRequired
    reponses: [
      { id: '1-1', texte: 'Paris', estCorrecte: true },
      { id: '1-2', texte: 'Lyon', estCorrecte: false },
      { id: '1-3', texte: 'Marseille', estCorrecte: false },
      { id: '1-4', texte: 'Bordeaux', estCorrecte: false },
    ],
    elements: [], // Added empty elements array
  },
  {
    id: '2',
    texte: 'Quelles sont les couleurs du drapeau français?',
    type: QuestionType.QCM,
    ordre: 2,
    points: 15, // Added points
    duree: 45, // Added duration in seconds
    isRequired: true, // Added isRequired
    reponses: [
      { id: '2-1', texte: 'Rouge et blanc', estCorrecte: false },
      { id: '2-2', texte: 'Bleu, blanc et rouge', estCorrecte: true },
      { id: '2-3', texte: 'Noir, jaune et rouge', estCorrecte: false },
      { id: '2-4', texte: 'Vert, blanc et rouge', estCorrecte: false },
    ],
    elements: [], // Added empty elements array
  },
  {
    id: '3',
    texte: 'Expliquez brièvement le principe de la photosynthèse.',
    type: QuestionType.OUVERTE,
    ordre: 3,
    points: 20, // Added points
    duree: 120, // Added duration in seconds
    isRequired: false, // Added isRequired
    reponses: [
      { id: '3-1', texte: 'photosynthèse', estCorrecte: true },
      { id: '3-2', texte: 'lumière', estCorrecte: true },
      { id: '3-3', texte: 'plantes', estCorrecte: true },
    ],
    reponseAttendue:
      'La photosynthèse est un processus utilisé par les plantes pour convertir la lumière du soleil en énergie chimique.', // Added expected answer
    elements: [], // Added empty elements array
  },
  // Added a new question with visual elements
  {
    id: '4',
    texte: 'Placez les éléments au bon endroit sur la carte.',
    type: QuestionType.VISUEL,
    ordre: 4,
    points: 25,
    duree: 90,
    isRequired: true,
    elements: [
      {
        id: '4-1',
        texte: 'Paris',
        position: 1,
        cible: 'center',
      },
      {
        id: '4-2',
        texte: 'Lyon',
        position: 2,
        cible: 'southeast',
      },
      {
        id: '4-3',
        texte: 'Marseille',
        position: 3,
        cible: 'south',
      },
    ],
  },
];

// Mock API function for demonstration purposes
const fetchChallengesAPI = async (params: FilterParams): Promise<ApiResponse<Challenge[]>> => {
  // In a real application, this would be an API call
  const mockData: Challenge[] = [
    {
      id: '1',
      nom: 'Challenge de mathématiques',
      description: 'Résoudre 10 problèmes de mathématiques en 30 minutes',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 2).toISOString(),
      datePublication: subDays(new Date(), 5).toISOString(),
      dateMiseAJour: subDays(new Date(), 1).toISOString(),
      difficulte: Difficulty.MOYEN,
      participantsCount: 78,
      questionsCount: 10,
      questions: generateMockQuestions(),
      timer: 30,
      nbTentatives: 2,
      isRandomQuestions: false,
      scoreConfiguration: {
        id: '1',
        methode: ScoreMethod.NB_BONNES_REPONSES,
        parametres: JSON.stringify({ pointsParBonneReponse: 10 }),
      },
      messageSucces: 'Félicitations ! Vous avez réussi ce challenge !',
      messageEchec: "Dommage, vous n'avez pas réussi ce challenge. Réessayez pour faire mieux !",
      niveau: {
        id: '1',
        nom: 'CP1 - Cours Préparatoire 1',
      },
      multimedias: [
        {
          id: '1-1',
          type: MultimediaType.IMAGE,
          url: 'https://example.com/images/math-challenge.jpg',
        },
      ],
      active: true,
    },
    {
      id: '2',
      nom: 'Quiz sur la nature',
      description: 'Testez vos connaissances sur les animaux et les plantes',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 1).toISOString(),
      datePublication: addDays(new Date(), 5).toISOString(),
      difficulte: Difficulty.FACILE,
      questionsCount: 15,
      timer: 20,
      nbTentatives: 3,
      isRandomQuestions: true,
      scoreConfiguration: {
        id: '2',
        methode: ScoreMethod.TEMPS,
        parametres: JSON.stringify({ pointsParBonneReponse: 10, bonusTemps: 2 }),
      },
      messageSucces: 'Bravo, vous êtes un expert de la nature !',
      messageEchec: 'Vous pouvez encore améliorer vos connaissances sur la nature.',
      niveau: {
        id: '2',
        nom: 'CP2 - Cours Préparatoire 2',
      },
      multimedias: [
        {
          id: '2-1',
          type: MultimediaType.IMAGE,
          url: 'https://example.com/images/nature-quiz.jpg',
        },
        {
          id: '2-2',
          type: MultimediaType.VIDEO,
          url: 'https://example.com/videos/nature-intro.mp4',
        },
      ],
      active: true,
    },
    {
      id: '3',
      nom: 'Challenge de sciences',
      description: 'Réaliser une expérience scientifique simple et la documenter',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 3).toISOString(),
      datePublication: subDays(new Date(), 30).toISOString(),
      dateMiseAJour: subDays(new Date(), 15).toISOString(),
      difficulte: Difficulty.DIFFICILE,
      participantsCount: 45,
      questionsCount: 5,
      timer: 60,
      nbTentatives: 1,
      isRandomQuestions: false,
      scoreConfiguration: {
        id: '3',
        methode: ScoreMethod.PENALITES,
        parametres: JSON.stringify({ pointsParBonneReponse: 20, penaliteParErreur: -5 }),
      },
      messageSucces: 'Félicitations pour cette expérience réussie !',
      messageEchec: "Votre expérience n'a pas abouti, réessayez avec une autre approche.",
      niveau: {
        id: '3',
        nom: 'CE1 - Cours Élémentaire 1',
      },
      prerequis: {
        id: '1',
        nom: 'Challenge de mathématiques',
        pourcentageMinimum: 70,
      },
      active: false,
    },
    {
      id: '4',
      nom: 'Quiz de français',
      description: 'Testez vos connaissances en orthographe et grammaire',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 1.5).toISOString(),
      datePublication: subDays(new Date(), 15).toISOString(),
      difficulte: Difficulty.MOYEN,
      participantsCount: 62,
      questionsCount: 20,
      timer: 25,
      nbTentatives: 2,
      isRandomQuestions: true,
      scoreConfiguration: {
        id: '4',
        methode: ScoreMethod.TEMPS,
        parametres: JSON.stringify({ pointsParBonneReponse: 5, bonusTemps: 1 }),
      },
      messageSucces: 'Bravo pour votre maîtrise de la langue française !',
      messageEchec: 'Continuez à pratiquer pour améliorer votre français.',
      active: true,
    },
    {
      id: '5',
      nom: "Challenge d'histoire",
      description: "Découvrir les grands événements de l'histoire",
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 4).toISOString(),
      datePublication: subMonths(new Date(), 3).toISOString(),
      dateMiseAJour: subMonths(new Date(), 2).toISOString(),
      difficulte: Difficulty.MOYEN,
      participantsCount: 38,
      questionsCount: 12,
      timer: 40,
      nbTentatives: 1,
      isRandomQuestions: false,
      scoreConfiguration: {
        id: '5',
        methode: ScoreMethod.NB_BONNES_REPONSES,
        parametres: JSON.stringify({ pointsParBonneReponse: 15 }),
      },
      messageSucces: "Vous avez une excellente connaissance de l'histoire !",
      messageEchec: 'Révisez vos connaissances historiques et réessayez.',
      niveau: {
        id: '4',
        nom: 'CE2 - Cours Élémentaire 2',
      },
      active: false,
    },
    {
      id: '7',
      nom: 'Challenge de sciences',
      description: 'Réaliser une expérience scientifique simple et la documenter',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 3).toISOString(),
      datePublication: subDays(new Date(), 30).toISOString(),
      dateMiseAJour: subDays(new Date(), 15).toISOString(),
      difficulte: Difficulty.DIFFICILE,
      participantsCount: 45,
      questionsCount: 5,
      timer: 60,
      nbTentatives: 1,
      isRandomQuestions: false,
      scoreConfiguration: {
        id: '3',
        methode: ScoreMethod.PENALITES,
        parametres: JSON.stringify({ pointsParBonneReponse: 20, penaliteParErreur: -5 }),
      },
      messageSucces: 'Félicitations pour cette expérience réussie !',
      messageEchec: "Votre expérience n'a pas abouti, réessayez avec une autre approche.",
      niveau: {
        id: '3',
        nom: 'CE1 - Cours Élémentaire 1',
      },
      prerequis: {
        id: '1',
        nom: 'Challenge de mathématiques',
        pourcentageMinimum: 70,
      },
      active: false,
    },
    {
      id: '8',
      nom: 'Challenge de sciences',
      description: 'Réaliser une expérience scientifique simple et la documenter',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 3).toISOString(),
      datePublication: subDays(new Date(), 30).toISOString(),
      dateMiseAJour: subDays(new Date(), 15).toISOString(),
      difficulte: Difficulty.DIFFICILE,
      participantsCount: 45,
      questionsCount: 5,
      timer: 60,
      nbTentatives: 1,
      isRandomQuestions: false,
      scoreConfiguration: {
        id: '3',
        methode: ScoreMethod.PENALITES,
        parametres: JSON.stringify({ pointsParBonneReponse: 20, penaliteParErreur: -5 }),
      },
      messageSucces: 'Félicitations pour cette expérience réussie !',
      messageEchec: "Votre expérience n'a pas abouti, réessayez avec une autre approche.",
      niveau: {
        id: '3',
        nom: 'CE1 - Cours Élémentaire 1',
      },
      prerequis: {
        id: '1',
        nom: 'Challenge de mathématiques',
        pourcentageMinimum: 70,
      },
      active: false,
    },
    {
      id: '9',
      nom: 'Challenge de sciences',
      description: 'Réaliser une expérience scientifique simple et la documenter',
      statut: ChallengeStatus.ACTIF,
      dateCreation: subMonths(new Date(), 3).toISOString(),
      datePublication: subDays(new Date(), 30).toISOString(),
      dateMiseAJour: subDays(new Date(), 15).toISOString(),
      difficulte: Difficulty.DIFFICILE,
      participantsCount: 45,
      questionsCount: 5,
      timer: 60,
      nbTentatives: 1,
      isRandomQuestions: false,
      scoreConfiguration: {
        id: '3',
        methode: ScoreMethod.PENALITES,
        parametres: JSON.stringify({ pointsParBonneReponse: 20, penaliteParErreur: -5 }),
      },
      messageSucces: 'Félicitations pour cette expérience réussie !',
      messageEchec: "Votre expérience n'a pas abouti, réessayez avec une autre approche.",
      niveau: {
        id: '3',
        nom: 'CE1 - Cours Élémentaire 1',
      },
      prerequis: {
        id: '1',
        nom: 'Challenge de mathématiques',
        pourcentageMinimum: 70,
      },
      active: false,
    },
  ];

  // Filter by search term if present
  let filteredData = [...mockData];
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (challenge) =>
        challenge.nom.toLowerCase().includes(searchLower) ||
        challenge.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply column-specific filters
  if (params.nomFilter) {
    const filter = params.nomFilter.toLowerCase();
    filteredData = filteredData.filter((challenge) => challenge.nom.toLowerCase().includes(filter));
  }

  if (params.descriptionFilter) {
    const filter = params.descriptionFilter.toLowerCase();
    filteredData = filteredData.filter((challenge) =>
      challenge.description.toLowerCase().includes(filter)
    );
  }

  if (params.statutFilter) {
    const filter = params.statutFilter;
    filteredData = filteredData.filter((challenge) => challenge.statut === filter);
  }

  if (params.niveauIdFilter) {
    const filter = params.niveauIdFilter;
    filteredData = filteredData.filter((challenge) => challenge.niveau?.id === filter);
  }

  if (params.difficulteFilter) {
    const filter = params.difficulteFilter;
    filteredData = filteredData.filter((challenge) => challenge.difficulte === filter);
  }

  // Date filters
  if (params.dateCreationFilter) {
    const filter = new Date(params.dateCreationFilter);
    filteredData = filteredData.filter((challenge) => {
      const date = new Date(challenge.dateCreation);
      return date.toDateString() === filter.toDateString();
    });
  }

  if (params.datePublicationFilter) {
    const filter = new Date(params.datePublicationFilter);
    filteredData = filteredData.filter((challenge) => {
      const date = new Date(challenge.datePublication);
      return date.toDateString() === filter.toDateString();
    });
  }

  // Filter by active status
  if (params.activeOnly) {
    filteredData = filteredData.filter(
      (challenge) => challenge.active && challenge.statut !== ChallengeStatus.SUPPRIME
    );
  }

  // Sort the data if needed
  if (params.sortBy) {
    const direction = params.sortDirection === 'desc' ? -1 : 1;
    filteredData.sort((a: any, b: any) => {
      const fieldA = a[params.sortBy as keyof Challenge];
      const fieldB = b[params.sortBy as keyof Challenge];

      if (fieldA < fieldB) return -1 * direction;
      if (fieldA > fieldB) return 1 * direction;
      return 0;
    });
  }

  // Simulate pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const total = filteredData.length;
  const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
    },
    success: true,
  };
};

// Get challenge details API (mock)
const fetchChallengeDetailsAPI = async (challengeId: string): Promise<ApiResponse<Challenge>> => {
  // Mock get challenge detail
  const response = await fetchChallengesAPI({ searchTerm: '' });
  const challenge = response.data.find((c) => c.id === challengeId);

  if (!challenge) {
    return {
      data: {} as Challenge,
      success: false,
      message: 'Challenge non trouvé',
    };
  }

  // Generate mock questions if not present
  if (!challenge.questions) {
    challenge.questions = generateMockQuestions();
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    data: challenge,
    success: true,
  };
};

// Interface for the hook's return values
interface UseChallengesReturn {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: FilterParams;
  selectedChallenge: Challenge | null;
  setSelectedChallenge: (challenge: Challenge | null) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  handleSearch: (searchTerm: string) => void;
  handleColumnFilterChange: (columnId: string, value: string) => void;
  handleSortChange: (field: string, direction: 'asc' | 'desc') => void;
  handleToggleActive: (challenge: Challenge, active: boolean) => void;
  handleToggleActiveOnly: (activeOnly: boolean) => void;
  handleAddChallenge: (challenge: Partial<Challenge>) => Promise<Challenge>;
  handleUpdateChallenge: (id: string, data: Partial<Challenge>) => Promise<Challenge>;
  handleDeleteChallenge: (id: string) => Promise<boolean>;
  handleRestoreChallenge: (id: string) => Promise<boolean>;
  handleDeleteMultipleChallenges: (ids: string[]) => Promise<boolean>;
  handleResetChallengeParticipations: (id: string) => Promise<boolean>;
  handleUpdateChallengeQuestions: (
    challengeId: string,
    questions: Question[]
  ) => Promise<Question[]>;
  fetchChallengeDetails: (challengeId: string) => Promise<Challenge | null>;
  refetch: () => Promise<void>;

  // Additional methods inspired by the UML diagram
  ajouterQuestionToChallenge: (challengeId: string, question: Question) => Promise<Question>;
  retirerQuestionFromChallenge: (challengeId: string, questionId: string) => Promise<boolean>;
  reinitialiserChallenge: (challengeId: string) => Promise<boolean>;
}

export function useChallenges(): UseChallengesReturn {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'nom',
    sortDirection: 'asc',
    activeOnly: false,
  });

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchChallengesAPI(filters);
      if (response.success) {
        setChallenges(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors du chargement des challenges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchChallengeDetails = useCallback(async (challengeId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchChallengeDetailsAPI(challengeId);
      if (response.success) {
        setSelectedChallenge(response.data);
        return response.data;
      }

      setError(response.message || 'Une erreur est survenue');
      return null;
    } catch (err) {
      setError('Erreur lors du chargement des détails du challenge');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));
  };

  const handleColumnFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [`${columnId}Filter`]: value,
      page: 1,
    }));
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection: direction,
    }));
  };

  const handleToggleActive = (challenge: Challenge, active: boolean) => {
    // In a real app, call API to update the status
    setChallenges((prev) =>
      prev.map((item) => (item.id === challenge.id ? { ...item, active } : item))
    );

    if (selectedChallenge && selectedChallenge.id === challenge.id) {
      setSelectedChallenge({
        ...selectedChallenge,
        active,
      });
    }
  };

  const handleToggleActiveOnly = (activeOnly: boolean) => {
    setFilters((prev) => ({
      ...prev,
      activeOnly,
      page: 1,
    }));
  };

  const handleAddChallenge = async (challenge: Partial<Challenge>): Promise<Challenge> => {
    // In a real app, call API to add challenge
    const newChallenge: Challenge = {
      id: `${challenges.length + 1}`,
      nom: challenge.nom || '',
      description: challenge.description || '',
      statut: challenge.statut || ChallengeStatus.ACTIF,
      dateCreation: new Date().toISOString(),
      datePublication: challenge.datePublication || new Date().toISOString(),
      dateMiseAJour: challenge.dateMiseAJour,
      difficulte: challenge.difficulte || Difficulty.MOYEN,
      questionsCount: 0,
      timer: challenge.timer || 30,
      nbTentatives: challenge.nbTentatives || 1,
      isRandomQuestions: challenge.isRandomQuestions || false,
      scoreConfiguration: challenge.scoreConfiguration || DEFAULT_SCORE_CONFIGURATION,
      messageSucces: challenge.messageSucces || MESSAGE_FINAL_DEFAUT.success,
      messageEchec: challenge.messageEchec || MESSAGE_FINAL_DEFAUT.failure,
      prerequis: challenge.prerequis,
      niveau: challenge.niveau,
      multimedias: challenge.multimedias || [],
      active: challenge.active !== undefined ? challenge.active : true,
    };

    setChallenges((prev) => [...prev, newChallenge]);
    return newChallenge;
  };

  const handleUpdateChallenge = async (
    id: string,
    data: Partial<Challenge>
  ): Promise<Challenge> => {
    // In a real app, call API to update challenge
    setChallenges((prev) => prev.map((item) => (item.id === id ? { ...item, ...data } : item)));

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        ...data,
      });
    }

    return { ...selectedChallenge, ...data } as Challenge;
  };

  const handleDeleteChallenge = async (id: string): Promise<boolean> => {
    // In a real app, call API to delete challenge
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              statut: ChallengeStatus.SUPPRIME,
              active: false,
              dateMiseAJour: new Date().toISOString(),
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        statut: ChallengeStatus.SUPPRIME,
        active: false,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return true;
  };

  const handleRestoreChallenge = async (id: string): Promise<boolean> => {
    // In a real app, call API to restore challenge
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              statut: ChallengeStatus.INACTIF,
              active: false,
              dateMiseAJour: new Date().toISOString(),
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        statut: ChallengeStatus.INACTIF,
        active: false,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return true;
  };

  const handleDeleteMultipleChallenges = async (ids: string[]): Promise<boolean> => {
    // In a real app, call API to delete multiple challenges
    setChallenges((prev) =>
      prev.map((item) =>
        ids.includes(item.id)
          ? {
              ...item,
              statut: ChallengeStatus.SUPPRIME,
              active: false,
              dateMiseAJour: new Date().toISOString(),
            }
          : item
      )
    );

    if (selectedChallenge && ids.includes(selectedChallenge.id)) {
      setSelectedChallenge(null);
    }

    return true;
  };

  const handleResetChallengeParticipations = async (id: string): Promise<boolean> => {
    // In a real app, call API to reset participations
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              participantsCount: 0,
              dateMiseAJour: new Date().toISOString(),
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        participantsCount: 0,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return true;
  };

  const handleUpdateChallengeQuestions = async (
    challengeId: string,
    questions: Question[]
  ): Promise<Question[]> => {
    // In a real app, call API to update challenge questions
    const updatedQuestions = questions.map((q, idx) => ({
      ...q,
      ordre: idx + 1,
    }));

    setChallenges((prev) =>
      prev.map((item) =>
        item.id === challengeId
          ? {
              ...item,
              questions: updatedQuestions,
              questionsCount: updatedQuestions.length,
              dateMiseAJour: new Date().toISOString(),
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === challengeId) {
      setSelectedChallenge({
        ...selectedChallenge,
        questions: updatedQuestions,
        questionsCount: updatedQuestions.length,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return updatedQuestions;
  };

  // Additional methods inspired by the UML diagram
  const ajouterQuestionToChallenge = async (
    challengeId: string,
    question: Question
  ): Promise<Question> => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const existingQuestions = challenge.questions || [];
    const newQuestion = {
      ...question,
      id: question.id || `q-${Date.now()}`,
      ordre: existingQuestions.length + 1,
    };

    const updatedQuestions = [...existingQuestions, newQuestion];

    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              questions: updatedQuestions,
              questionsCount: updatedQuestions.length,
              dateMiseAJour: new Date().toISOString(),
            }
          : c
      )
    );

    if (selectedChallenge && selectedChallenge.id === challengeId) {
      setSelectedChallenge({
        ...selectedChallenge,
        questions: updatedQuestions,
        questionsCount: updatedQuestions.length,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return newQuestion;
  };

  const retirerQuestionFromChallenge = async (
    challengeId: string,
    questionId: string
  ): Promise<boolean> => {
    const challenge = challenges.find((c) => c.id === challengeId);
    if (!challenge || !challenge.questions) {
      throw new Error('Challenge or questions not found');
    }

    const updatedQuestions = challenge.questions
      .filter((q) => q.id !== questionId)
      .map((q, idx) => ({ ...q, ordre: idx + 1 }));

    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              questions: updatedQuestions,
              questionsCount: updatedQuestions.length,
              dateMiseAJour: new Date().toISOString(),
            }
          : c
      )
    );

    if (selectedChallenge && selectedChallenge.id === challengeId) {
      setSelectedChallenge({
        ...selectedChallenge,
        questions: updatedQuestions,
        questionsCount: updatedQuestions.length,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return true;
  };

  const reinitialiserChallenge = async (challengeId: string): Promise<boolean> => {
    // Reset the challenge's statistics and participation data
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId
          ? {
              ...c,
              participantsCount: 0,
              dateMiseAJour: new Date().toISOString(),
            }
          : c
      )
    );

    if (selectedChallenge && selectedChallenge.id === challengeId) {
      setSelectedChallenge({
        ...selectedChallenge,
        participantsCount: 0,
        dateMiseAJour: new Date().toISOString(),
      });
    }

    return true;
  };

  return {
    challenges,
    loading,
    error,
    pagination,
    filters,
    selectedChallenge,
    setSelectedChallenge,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleColumnFilterChange,
    handleSortChange,
    handleToggleActive,
    handleToggleActiveOnly,
    handleAddChallenge,
    handleUpdateChallenge,
    handleDeleteChallenge,
    handleRestoreChallenge,
    handleDeleteMultipleChallenges,
    handleResetChallengeParticipations,
    handleUpdateChallengeQuestions,
    fetchChallengeDetails,
    refetch: fetchChallenges,

    // New methods from UML diagram
    ajouterQuestionToChallenge,
    retirerQuestionFromChallenge,
    reinitialiserChallenge,
  };
}

export default useChallenges;
