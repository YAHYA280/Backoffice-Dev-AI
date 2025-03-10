'use client';

import { subDays, subMonths } from 'date-fns';
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
      dateCreated: subMonths(new Date(), 3).toISOString(),
      lastUpdated: subDays(new Date(), 15).toISOString(),
      competencesCount: 3,
      dureeEstimee: '2h30',
      active: true,
    },
    {
      id: '2',
      ordre: 2,
      nom: 'Grammaire',
      description: 'Règles grammaticales de base et construction de phrases',
      difficulte: 'Moyen',
      matiereId,
      exercicesCount: 6,
      dateCreated: subMonths(new Date(), 2).toISOString(),
      lastUpdated: subDays(new Date(), 10).toISOString(),
      competencesCount: 4,
      dureeEstimee: '3h00',
      active: true,
    },
    {
      id: '3',
      ordre: 3,
      nom: 'Conjugaison',
      description: 'Temps verbaux et conjugaison des verbes du premier groupe',
      difficulte: 'Moyen',
      matiereId,
      exercicesCount: 7,
      dateCreated: subMonths(new Date(), 1).toISOString(),
      lastUpdated: subDays(new Date(), 5).toISOString(),
      competencesCount: 5,
      dureeEstimee: '3h30',
      active: true,
    },
    {
      id: '4',
      ordre: 4,
      nom: 'Orthographe',
      description: "Règles d'orthographe et dictées",
      difficulte: 'Difficile',
      matiereId,
      exercicesCount: 5,
      dateCreated: subDays(new Date(), 20).toISOString(),
      lastUpdated: subDays(new Date(), 2).toISOString(),
      competencesCount: 3,
      dureeEstimee: '2h45',
      active: true,
    },
    {
      id: '5',
      ordre: 5,
      nom: 'Expression écrite',
      description: 'Rédaction de textes courts et expression écrite',
      difficulte: 'Moyen',
      matiereId,
      exercicesCount: 4,
      dateCreated: subDays(new Date(), 10).toISOString(),
      lastUpdated: subDays(new Date(), 1).toISOString(),
      competencesCount: 4,
      dureeEstimee: '2h15',
      active: false,
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

  // Apply column-specific filters
  if (params.nomFilter) {
    const filter = params.nomFilter.toLowerCase();
    filteredData = filteredData.filter((chapitre) => chapitre.nom.toLowerCase().includes(filter));
  }

  if (params.descriptionFilter) {
    const filter = params.descriptionFilter.toLowerCase();
    filteredData = filteredData.filter((chapitre) =>
      chapitre.description.toLowerCase().includes(filter)
    );
  }

  if (params.ordreFilter) {
    const filter = params.ordreFilter;
    filteredData = filteredData.filter((chapitre) => chapitre.ordre.toString().includes(filter));
  }

  if (params.difficulteFilter) {
    const filter = params.difficulteFilter.toLowerCase();
    filteredData = filteredData.filter((chapitre) =>
      chapitre.difficulte.toLowerCase().includes(filter)
    );
  }

  if (params.exercicesCountFilter) {
    const filter = params.exercicesCountFilter;
    filteredData = filteredData.filter((chapitre) =>
      chapitre.exercicesCount?.toString().includes(filter)
    );
  }

  // Filter by min/max exercices
  if (params.minExercices) {
    const minCount = parseInt(params.minExercices as string, 10);
    filteredData = filteredData.filter((chapitre) => (chapitre.exercicesCount || 0) >= minCount);
  }

  if (params.maxExercices) {
    const maxCount = parseInt(params.maxExercices as string, 10);
    filteredData = filteredData.filter((chapitre) => (chapitre.exercicesCount || 0) <= maxCount);
  }

  // Filter by min/max ordre
  if (params.minOrdre) {
    const minOrdre = parseInt(params.minOrdre as string, 10);
    filteredData = filteredData.filter((chapitre) => chapitre.ordre >= minOrdre);
  }

  if (params.maxOrdre) {
    const maxOrdre = parseInt(params.maxOrdre as string, 10);
    filteredData = filteredData.filter((chapitre) => chapitre.ordre <= maxOrdre);
  }

  // Filter by difficulté spécifique
  if (params.difficulte) {
    filteredData = filteredData.filter((chapitre) => chapitre.difficulte === params.difficulte);
  }

  // Filter by active status
  if (params.activeOnly) {
    filteredData = filteredData.filter((chapitre) => chapitre.active !== false);
  }

  // Sort the data if needed
  if (params.sortBy) {
    const direction = params.sortDirection === 'desc' ? -1 : 1;
    filteredData.sort((a: any, b: any) => {
      const fieldA = a[params.sortBy as keyof Chapitre];
      const fieldB = b[params.sortBy as keyof Chapitre];

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

function useChapitresHook(matiereId: string) {
  const [chapitres, setChapitres] = useState<Chapitre[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapitre, setSelectedChapitre] = useState<Chapitre | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'ordre',
    sortDirection: 'asc',
    activeOnly: false,
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

  const handleToggleActiveOnly = (activeOnly: boolean) => {
    setFilters((prev) => ({
      ...prev,
      activeOnly,
      page: 1,
    }));
  };

  const handleSetDifficulteFilter = (difficulte: string | null) => {
    setFilters((prev) => ({
      ...prev,
      difficulte,
      page: 1,
    }));
  };

  const handleSetMinMaxExercices = (min: number | null, max: number | null) => {
    setFilters((prev) => ({
      ...prev,
      minExercices: min,
      maxExercices: max,
      page: 1,
    }));
  };

  const handleSetMinMaxOrdre = (min: number | null, max: number | null) => {
    setFilters((prev) => ({
      ...prev,
      minOrdre: min,
      maxOrdre: max,
      page: 1,
    }));
  };

  const handleDeleteChapitre = async (id: string) => {
    // In a real application, this would call an API to delete the chapitre
    setChapitres((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteMultipleChapitres = async (ids: string[]) => {
    // In a real application, this would call an API to delete multiple chapitres
    setChapitres((prev) => prev.filter((item) => !ids.includes(item.id)));
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
    handleColumnFilterChange,
    handleSortChange,
    handleToggleActiveOnly,
    handleSetDifficulteFilter,
    handleSetMinMaxExercices,
    handleSetMinMaxOrdre,
    handleDeleteChapitre,
    handleDeleteMultipleChapitres,
    refetch: fetchChapitres,
  };
}

// Export the hook
const chapitreHooks = {
  useChapitres: useChapitresHook,
};

export default chapitreHooks;
export { useChapitresHook as useChapitres };
