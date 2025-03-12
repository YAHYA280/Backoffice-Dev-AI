'use client';

import { format, subDays, subMonths } from 'date-fns';
import { useState, useEffect, useCallback } from 'react';

import { DEFAULT_PAGINATION } from '../types';

import type { Exercice, Pagination, ApiResponse, FilterParams } from '../types';

const fetchExercicesAPI = async (
  chapitreId: string,
  params: FilterParams
): Promise<ApiResponse<Exercice[]>> => {
  const mockData: Exercice[] = [
    {
      id: '1',
      titre: "Le présent de l'indicatif",
      description: "Conjuguer les verbes du 1er groupe au présent de l'indicatif",
      statut: 'Publié',
      ressources: ['PDF', 'Audio'],
      chapitreId,
      dateCreated: subMonths(new Date(), 3).toISOString(),
      lastUpdated: subDays(new Date(), 15).toISOString(),
      notation: 20,
      competencesCount: 3,
      active: true,
    },
    {
      id: '2',
      titre: 'Le futur simple',
      description: 'Conjuguer au futur simple les verbes du 1er groupe',
      statut: 'Publié',
      ressources: ['PDF', 'Interactive'],
      chapitreId,
      dateCreated: subMonths(new Date(), 2).toISOString(),
      lastUpdated: subDays(new Date(), 10).toISOString(),
      notation: 15,
      competencesCount: 2,
      active: true,
    },
    {
      id: '3',
      titre: "L'imparfait",
      description: "Conjuguer à l'imparfait les verbes du 1er groupe",
      statut: 'Publié',
      ressources: ['PDF'],
      chapitreId,
      dateCreated: subMonths(new Date(), 1).toISOString(),
      lastUpdated: subDays(new Date(), 5).toISOString(),
      notation: 20,
      competencesCount: 3,
      active: true,
    },
    {
      id: '4',
      titre: 'Le passé composé',
      description: 'Conjuguer au passé composé les verbes du 1er groupe',
      statut: 'Brouillon',
      ressources: ['PDF', 'Video'],
      chapitreId,
      dateCreated: subDays(new Date(), 20).toISOString(),
      lastUpdated: subDays(new Date(), 2).toISOString(),
      notation: 18,
      competencesCount: 2,
      active: true,
    },
    {
      id: '5',
      titre: 'Les verbes pronominaux',
      description: 'Conjuguer les verbes pronominaux du 1er groupe',
      statut: 'Inactif',
      ressources: ['PDF'],
      chapitreId,
      dateCreated: subDays(new Date(), 10).toISOString(),
      lastUpdated: subDays(new Date(), 1).toISOString(),
      notation: 25,
      competencesCount: 4,
      active: false,
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

  // Apply column-specific filters
  if (params.titreFilter) {
    const filter = params.titreFilter.toLowerCase();
    filteredData = filteredData.filter((exercice) => exercice.titre.toLowerCase().includes(filter));
  }

  if (params.descriptionFilter) {
    const filter = params.descriptionFilter.toLowerCase();
    filteredData = filteredData.filter((exercice) =>
      exercice.description.toLowerCase().includes(filter)
    );
  }

  if (params.statutFilter) {
    const filter = params.statutFilter.toLowerCase();
    filteredData = filteredData.filter((exercice) => exercice.statut.toLowerCase() === filter);
  }

  if (params.ressourcesFilter) {
    const filter = params.ressourcesFilter.toLowerCase();
    filteredData = filteredData.filter((exercice) =>
      exercice.ressources.some((resource) => resource.toLowerCase().includes(filter))
    );
  }

  if (params.dateCreatedFilter) {
    const filter = params.dateCreatedFilter.toLowerCase();
    filteredData = filteredData.filter((exercice) => {
      if (!exercice.dateCreated) return false;
      const date = format(new Date(exercice.dateCreated), 'dd MMM yyyy');
      return date.toLowerCase().includes(filter);
    });
  }

  // Filter by active status
  if (params.activeOnly) {
    filteredData = filteredData.filter((exercice) => exercice.active !== false);
  }

  // Filter by resource type
  if (params.resourceType) {
    filteredData = filteredData.filter((exercice) =>
      exercice.ressources.includes(params.resourceType as string)
    );
  }

  // Sort the data if needed
  if (params.sortBy) {
    const direction = params.sortDirection === 'desc' ? -1 : 1;
    filteredData.sort((a: any, b: any) => {
      const fieldA = a[params.sortBy as keyof Exercice];
      const fieldB = b[params.sortBy as keyof Exercice];

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

function useExercicesHook(chapitreId: string) {
  const [exercices, setExercices] = useState<Exercice[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedExercice, setSelectedExercice] = useState<Exercice | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'titre',
    sortDirection: 'asc',
    activeOnly: false,
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

  const handleSetResourceTypeFilter = (resourceType: string | null) => {
    setFilters((prev) => ({
      ...prev,
      resourceType,
      page: 1,
    }));
  };

  const handleDeleteExercice = async (id: string) => {
    // API to delete the exercice
    setExercices((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteMultipleExercices = async (ids: string[]) => {
    //  API to delete multiple exercices
    setExercices((prev) => prev.filter((item) => !ids.includes(item.id)));
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
    handleColumnFilterChange,
    handleSortChange,
    handleToggleActiveOnly,
    handleSetResourceTypeFilter,
    handleDeleteExercice,
    handleDeleteMultipleExercices,
    refetch: fetchExercices,
  };
}

// Export the hook
const exerciceHooks = {
  useExercices: useExercicesHook,
};

export default exerciceHooks;
export { useExercicesHook as useExercices };
