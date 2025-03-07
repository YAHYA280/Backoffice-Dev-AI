import { useState, useEffect, useCallback } from 'react';

import { DEFAULT_PAGINATION } from '../types';

import type { Exercice, Pagination, ApiResponse, FilterParams } from '../types';

// Mock API function for demonstration purposes
const fetchExercicesAPI = async (
  chapitreId: string,
  params: FilterParams
): Promise<ApiResponse<Exercice[]>> => {
  // This would be an actual API call in a real application
  const mockData: Exercice[] = [
    {
      id: '1',
      titre: "Le présent de l'indicatif",
      description: "Conjuguer les verbes du 1er groupe au présent de l'indicatif",
      statut: 'Publié',
      ressources: ['PDF', 'Audio'],
      chapitreId,
    },
    {
      id: '2',
      titre: 'Le futur simple',
      description: 'Conjuguer au futur simple les verbes du 1er groupe',
      statut: 'Publié',
      ressources: ['PDF', 'Interactive'],
      chapitreId,
    },
    {
      id: '3',
      titre: "L'imparfait",
      description: "Conjuguer à l'imparfait les verbes du 1er groupe",
      statut: 'Publié',
      ressources: ['PDF'],
      chapitreId,
    },
    {
      id: '4',
      titre: 'Le passé composé',
      description: 'Conjuguer au passé composé les verbes du 1er groupe',
      statut: 'Brouillon',
      ressources: ['PDF', 'Video'],
      chapitreId,
    },
    {
      id: '5',
      titre: 'Les verbes pronominaux',
      description: 'Conjuguer les verbes pronominaux du 1er groupe',
      statut: 'Inactif',
      ressources: ['PDF'],
      chapitreId,
    },
  ];

  // Filter by search term if present
  let filteredData = [...mockData];
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (exercice) =>
        exercice.titre.toLowerCase().includes(searchLower) ||
        exercice.description.toLowerCase().includes(searchLower)
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

export const useExercices = (chapitreId: string) => {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercice, setSelectedExercice] = useState<Exercice | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
  });

  const fetchExercices = useCallback(async () => {
    if (!chapitreId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchExercicesAPI(chapitreId, filters);
      if (response.success) {
        setExercices(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors du chargement des exercices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [chapitreId, filters]);

  useEffect(() => {
    fetchExercices();
  }, [fetchExercices]);

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
    exercices,
    loading,
    error,
    pagination,
    filters,
    selectedExercice,
    setSelectedExercice,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    refetch: fetchExercices,
  };
};
