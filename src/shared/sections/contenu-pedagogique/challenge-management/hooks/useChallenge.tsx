'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, subMonths } from 'date-fns';

import { DEFAULT_PAGINATION, MESSAGE_FINAL_DEFAUT } from '../constants';

import type {
  Challenge,
  Pagination,
  ApiResponse,
  FilterParams,
  Question,
  MessageFinal,
} from '../types';

const generateMockQuestions = (): Question[] => [
  {
    id: '1',
    type: 'QCM',
    contenu: 'Quelle est la capitale de la France?',
    options: ['Paris', 'Lyon', 'Marseille', 'Bordeaux'],
    reponses: ['Paris'],
    pointsMax: 10,
    ordre: 1,
  },
  {
    id: '2',
    type: 'QCM',
    contenu: 'Quelles sont les couleurs du drapeau français?',
    options: [
      'Rouge et blanc',
      'Bleu, blanc et rouge',
      'Noir, jaune et rouge',
      'Vert, blanc et rouge',
    ],
    reponses: ['Bleu, blanc et rouge'],
    pointsMax: 10,
    ordre: 2,
  },
  {
    id: '3',
    type: 'OUVERTE',
    contenu: 'Expliquez brièvement le principe de la photosynthèse.',
    reponses: ['photosynthèse', 'lumière', 'plantes'],
    indices: ["Il s'agit d'un processus utilisé par les plantes"],
    pointsMax: 20,
    ordre: 3,
  },
];

// Mock API function for demonstration purposes
const fetchChallengesAPI = async (params: FilterParams): Promise<ApiResponse<Challenge[]>> => {
  // In a real application, this would be an API call
  const mockData: Challenge[] = [
    {
      id: '1',
      titre: 'Challenge de mathématiques',
      description: 'Résoudre 10 problèmes de mathématiques en 30 minutes',
      statut: 'Actif',
      dateCreation: subMonths(new Date(), 2).toISOString(),
      datePublication: subDays(new Date(), 5).toISOString(),
      dateFin: addDays(new Date(), 10).toISOString(),
      niveauId: '1',
      niveauNom: 'CP1 - Cours Préparatoire 1',
      niveauDifficulte: 'Moyen',
      participantsCount: 78,
      questionsCount: 10,
      questions: generateMockQuestions(),
      timeMaxMinutes: 30,
      tentativesMax: 2,
      isRandomQuestions: false,
      pointsRecompense: 100,
      badgeRecompense: 'Mathématicien en herbe',
      methodeCalculScore: 'SIMPLE',
      messageFinaux: MESSAGE_FINAL_DEFAUT,
      active: true,
    },
    {
      id: '2',
      titre: 'Quiz sur la nature',
      description: 'Testez vos connaissances sur les animaux et les plantes',
      statut: 'Brouillon',
      dateCreation: subMonths(new Date(), 1).toISOString(),
      datePublication: addDays(new Date(), 5).toISOString(),
      niveauId: '2',
      niveauNom: 'CP2 - Cours Préparatoire 2',
      niveauDifficulte: 'Facile',
      questionsCount: 15,
      timeMaxMinutes: 20,
      tentativesMax: 3,
      isRandomQuestions: true,
      pointsRecompense: 150,
      badgeRecompense: 'Ami de la nature',
      methodeCalculScore: 'SIMPLE',
      messageFinaux: MESSAGE_FINAL_DEFAUT,
      active: true,
    },
    {
      id: '3',
      titre: 'Challenge de sciences',
      description: 'Réaliser une expérience scientifique simple et la documenter',
      statut: 'Terminé',
      dateCreation: subMonths(new Date(), 3).toISOString(),
      datePublication: subDays(new Date(), 30).toISOString(),
      dateFin: subDays(new Date(), 10).toISOString(),
      niveauId: '3',
      niveauNom: 'CE1 - Cours Élémentaire 1',
      niveauDifficulte: 'Difficile',
      participantsCount: 45,
      questionsCount: 5,
      timeMaxMinutes: 60,
      tentativesMax: 1,
      isRandomQuestions: false,
      pointsRecompense: 200,
      badgeRecompense: 'Scientifique en herbe',
      methodeCalculScore: 'PENALITES',
      messageFinaux: MESSAGE_FINAL_DEFAUT,
      active: false,
    },
    {
      id: '4',
      titre: 'Quiz de français',
      description: 'Testez vos connaissances en orthographe et grammaire',
      statut: 'Actif',
      dateCreation: subMonths(new Date(), 1.5).toISOString(),
      datePublication: subDays(new Date(), 15).toISOString(),
      dateFin: addDays(new Date(), 20).toISOString(),
      niveauDifficulte: 'Moyen',
      participantsCount: 62,
      questionsCount: 20,
      timeMaxMinutes: 25,
      tentativesMax: 2,
      isRandomQuestions: true,
      pointsRecompense: 120,
      badgeRecompense: 'Expert en français',
      methodeCalculScore: 'TEMPS',
      messageFinaux: MESSAGE_FINAL_DEFAUT,
      active: true,
    },
    {
      id: '5',
      titre: "Challenge d'histoire",
      description: "Découvrir les grands événements de l'histoire",
      statut: 'Archivé',
      dateCreation: subMonths(new Date(), 4).toISOString(),
      datePublication: subMonths(new Date(), 3).toISOString(),
      dateFin: subMonths(new Date(), 2).toISOString(),
      niveauId: '4',
      niveauNom: 'CE2 - Cours Élémentaire 2',
      niveauDifficulte: 'Moyen',
      participantsCount: 38,
      questionsCount: 12,
      timeMaxMinutes: 40,
      tentativesMax: 1,
      isRandomQuestions: false,
      pointsRecompense: 180,
      badgeRecompense: 'Historien en herbe',
      methodeCalculScore: 'SIMPLE',
      messageFinaux: MESSAGE_FINAL_DEFAUT,
      active: false,
      suppressionDate: subMonths(new Date(), 1).toISOString(),
      restaurable: true,
    },
  ];

  // Filter by search term if present
  let filteredData = [...mockData];
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (challenge) =>
        challenge.titre.toLowerCase().includes(searchLower) ||
        challenge.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply column-specific filters
  if (params.titreFilter) {
    const filter = params.titreFilter.toLowerCase();
    filteredData = filteredData.filter((challenge) =>
      challenge.titre.toLowerCase().includes(filter)
    );
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
    filteredData = filteredData.filter((challenge) => challenge.niveauId === filter);
  }

  if (params.niveauDifficulteFilter) {
    const filter = params.niveauDifficulteFilter;
    filteredData = filteredData.filter((challenge) => challenge.niveauDifficulte === filter);
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
      (challenge) => challenge.active && challenge.statut !== 'Archivé'
    );
  }

  // Filter for restaurable challenges
  if (params.restaurableOnly) {
    filteredData = filteredData.filter(
      (challenge) => challenge.restaurable === true && challenge.statut === 'Archivé'
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

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'titre',
    sortDirection: 'asc',
    activeOnly: false,
    restaurableOnly: false,
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
      } else {
        setError(response.message || 'Une erreur est survenue');
        return null;
      }
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

  const handleToggleRestaurableOnly = (restaurableOnly: boolean) => {
    setFilters((prev) => ({
      ...prev,
      restaurableOnly,
      page: 1,
    }));
  };

  const handleAddChallenge = async (challenge: Partial<Challenge>) => {
    // In a real app, call API to add challenge
    const newChallenge: Challenge = {
      id: `${challenges.length + 1}`,
      titre: challenge.titre || '',
      description: challenge.description || '',
      statut: challenge.statut || 'Brouillon',
      dateCreation: new Date().toISOString(),
      datePublication: challenge.datePublication || new Date().toISOString(),
      dateFin: challenge.dateFin,
      niveauId: challenge.niveauId,
      niveauNom: challenge.niveauNom,
      niveauDifficulte: challenge.niveauDifficulte || 'Moyen',
      questionsCount: 0,
      timeMaxMinutes: challenge.timeMaxMinutes || 30,
      tentativesMax: challenge.tentativesMax || 1,
      isRandomQuestions: challenge.isRandomQuestions || false,
      pointsRecompense: challenge.pointsRecompense || 100,
      badgeRecompense: challenge.badgeRecompense,
      methodeCalculScore: challenge.methodeCalculScore || 'SIMPLE',
      messageFinaux: challenge.messageFinaux || MESSAGE_FINAL_DEFAUT,
      prerequisChallenge: challenge.prerequisChallenge,
      active: challenge.active !== undefined ? challenge.active : true,
    };

    setChallenges((prev) => [...prev, newChallenge]);
    return newChallenge;
  };

  const handleUpdateChallenge = async (id: string, data: Partial<Challenge>) => {
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

  const handleDeleteChallenge = async (id: string) => {
    // In a real app, call API to delete (or archive) challenge
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              statut: 'Archivé',
              active: false,
              suppressionDate: new Date().toISOString(),
              restaurable: true,
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        statut: 'Archivé',
        active: false,
        suppressionDate: new Date().toISOString(),
        restaurable: true,
      });
    }

    return true;
  };

  const handleRestoreChallenge = async (id: string) => {
    // In a real app, call API to restore challenge
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              statut: 'Brouillon',
              active: false,
              suppressionDate: undefined,
              restaurable: undefined,
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        statut: 'Brouillon',
        active: false,
        suppressionDate: undefined,
        restaurable: undefined,
      });
    }

    return true;
  };

  const handleDeleteMultipleChallenges = async (ids: string[]) => {
    // In a real app, call API to delete multiple challenges
    setChallenges((prev) =>
      prev.map((item) =>
        ids.includes(item.id)
          ? {
              ...item,
              statut: 'Archivé',
              active: false,
              suppressionDate: new Date().toISOString(),
              restaurable: true,
            }
          : item
      )
    );

    if (selectedChallenge && ids.includes(selectedChallenge.id)) {
      setSelectedChallenge(null);
    }

    return true;
  };

  const handleResetChallengeParticipations = async (id: string) => {
    // In a real app, call API to reset participations
    setChallenges((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              participantsCount: 0,
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === id) {
      setSelectedChallenge({
        ...selectedChallenge,
        participantsCount: 0,
      });
    }

    return true;
  };

  // Fonction pour ajouter/modifier des questions dans un challenge
  const handleUpdateChallengeQuestions = async (challengeId: string, questions: Question[]) => {
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
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === challengeId) {
      setSelectedChallenge({
        ...selectedChallenge,
        questions: updatedQuestions,
        questionsCount: updatedQuestions.length,
      });
    }

    return updatedQuestions;
  };

  // Fonction pour mettre à jour les messages finaux
  const handleUpdateChallengeMessages = async (challengeId: string, messages: MessageFinal[]) => {
    // In a real app, call API to update challenge messages
    const sortedMessages = [...messages].sort((a, b) => b.seuil - a.seuil);

    setChallenges((prev) =>
      prev.map((item) =>
        item.id === challengeId
          ? {
              ...item,
              messageFinaux: sortedMessages,
            }
          : item
      )
    );

    if (selectedChallenge && selectedChallenge.id === challengeId) {
      setSelectedChallenge({
        ...selectedChallenge,
        messageFinaux: sortedMessages,
      });
    }

    return sortedMessages;
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
    handleToggleRestaurableOnly,
    handleAddChallenge,
    handleUpdateChallenge,
    handleDeleteChallenge,
    handleRestoreChallenge,
    handleDeleteMultipleChallenges,
    handleResetChallengeParticipations,
    handleUpdateChallengeQuestions,
    handleUpdateChallengeMessages,
    fetchChallengeDetails,
    refetch: fetchChallenges,
  };
}

export default useChallenges;
