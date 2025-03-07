import { useState, useEffect, useCallback } from 'react';

import { DEFAULT_PAGINATION } from '../types';

import type { Chapitre, Pagination, ApiResponse, FilterParams } from '../types';

// Mock API function for demonstration purposes
const fetchChapitresAPI = async (
  matiereId: string,
  params: FilterParams
): Promise<ApiResponse<Chapitre[]>> => {
  // This would be an actual API call in a real application
  const mockData: Chapitre[] = [
    {
      id: '1',
      ordre: 1,
      nom: 'Lecture',
      description: 'Apprentissage de la lecture et compréhension de textes',
      difficulte: 'Facile',
      matiereId,
      exercicesCount: 8,
    },
    {
      id: '2',
      ordre: 2,
      nom: 'Grammaire',
      description: 'Règles grammaticales de base et construction de phrases',
      difficulte: 'Moyen',
      matiereId,
      exercicesCount: 6,
    },
    {
      id: '3',
      ordre: 3,
      nom: 'Conjugaison',
      description: 'Temps verbaux et conjugaison des verbes du premier groupe',
      difficulte: 'Moyen',
      matiereId,
      exercicesCount: 7,
    },
    {
      id: '4',
      ordre: 4,
      nom: 'Orthographe',
      description: "Règles d'orthographe et dictées",
      difficulte: 'Difficile',
      matiereId,
      exercicesCount: 5,
    },
    {
      id: '5',
      ordre: 5,
      nom: 'Expression écrite',
      description: 'Rédaction de textes courts et expression écrite',
      difficulte: 'Moyen',
      matiereId,
      exercicesCount: 4,
    },
  ];

  // Filter by search term if present
  let filteredData = [...mockData];
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (chapitre) =>
        chapitre.nom.toLowerCase().includes(searchLower) ||
        chapitre.description.toLowerCase().includes(searchLower)
    );
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

export const useChapitres = (matiereId: string) => {
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapitre, setSelectedChapitre] = useState<Chapitre | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
  });

  const fetchChapitres = useCallback(async () => {
    if (!matiereId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchChapitresAPI(matiereId, filters);
      if (response.success) {
        setChapitres(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors du chargement des chapitres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [matiereId, filters]);

  useEffect(() => {
    fetchChapitres();
  }, [fetchChapitres]);

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm, page: 1 }));
  };

  return {
    chapitres,
    loading,
    error,
    pagination,
    filters,
    selectedChapitre,
    setSelectedChapitre,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    refetch: fetchChapitres,
  };
};
