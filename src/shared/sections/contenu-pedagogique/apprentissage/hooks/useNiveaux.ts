'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, subMonths } from 'date-fns';

import { DEFAULT_PAGINATION } from '../types';

import type { Niveau, Pagination, ApiResponse, FilterParams } from '../types';

// Mock API function for demonstration purposes
const fetchNiveauxAPI = async (params: FilterParams): Promise<ApiResponse<Niveau[]>> => {
  // This would be an actual API call in a real application
  const mockData: Niveau[] = [
    {
      id: '1',
      nom: 'CP1 - Cours Préparatoire 1',
      description: 'Premier niveau du cycle préparatoire',
      code: 'NIV-CP1',
      matieresCount: 5,
      exercicesCount: 24,
      dateCreated: subMonths(new Date(), 9).toISOString(),
      lastUpdated: subDays(new Date(), 15).toISOString(),
      active: true,
    },
    {
      id: '2',
      nom: 'CP2 - Cours Préparatoire 2',
      description: 'Deuxième niveau du cycle préparatoire',
      code: 'NIV-CP2',
      matieresCount: 6,
      exercicesCount: 30,
      dateCreated: subMonths(new Date(), 8).toISOString(),
      lastUpdated: subDays(new Date(), 10).toISOString(),
      active: true,
    },
    {
      id: '3',
      nom: 'CE1 - Cours Élémentaire 1',
      description: 'Premier niveau du cycle élémentaire',
      code: 'NIV-CE1',
      matieresCount: 7,
      exercicesCount: 18,
      dateCreated: subMonths(new Date(), 7).toISOString(),
      lastUpdated: subDays(new Date(), 20).toISOString(),
      active: true,
    },
    {
      id: '4',
      nom: 'CE2 - Cours Élémentaire 2',
      description: 'Deuxième niveau du cycle élémentaire',
      code: 'NIV-CE2',
      matieresCount: 4,
      exercicesCount: 22,
      dateCreated: subMonths(new Date(), 6).toISOString(),
      lastUpdated: subDays(new Date(), 5).toISOString(),
      active: false,
    },
    {
      id: '5',
      nom: 'CM1 - Cours Moyen 1',
      description: 'Premier niveau du cycle moyen',
      code: 'NIV-CM1',
      matieresCount: 8,
      exercicesCount: 28,
      dateCreated: subMonths(new Date(), 5).toISOString(),
      lastUpdated: subDays(new Date(), 30).toISOString(),
      active: true,
    },
    {
      id: '6',
      nom: 'CM2 - Cours Moyen 2',
      description: 'Deuxième niveau du cycle moyen',
      code: 'NIV-CM2',
      matieresCount: 5,
      exercicesCount: 32,
      dateCreated: subMonths(new Date(), 4).toISOString(),
      lastUpdated: subDays(new Date(), 12).toISOString(),
      active: true,
    },
    {
      id: '7',
      nom: '6ème - Sixième',
      description: 'Premier niveau du collège',
      code: 'NIV-6EME',
      matieresCount: 8,
      dateCreated: addDays(new Date(), -15).toISOString(),
      active: false,
    },
    {
      id: '7',
      nom: '6ème - Sixième',
      description: 'Premier niveau du collège',
      code: 'NIV-6EME',
      matieresCount: 8,
      dateCreated: addDays(new Date(), -15).toISOString(),
      active: false,
    },
    {
      id: '8',
      nom: '6ème - Sixième',
      description: 'Premier niveau du collège',
      code: 'NIV-6EME',
      matieresCount: 8,
      dateCreated: addDays(new Date(), -15).toISOString(),
      active: false,
    },
    {
      id: '9',
      nom: '6ème - Sixième',
      description: 'Premier niveau du collège',
      code: 'NIV-6EME',
      matieresCount: 8,
      dateCreated: addDays(new Date(), -15).toISOString(),
      active: false,
    },
    {
      id: '10',
      nom: '6ème - Sixième',
      description: 'Premier niveau du collège',
      code: 'NIV-6EME',
      matieresCount: 8,
      dateCreated: addDays(new Date(), -15).toISOString(),
      active: false,
    },
    {
      id: '11',
      nom: '6ème - Sixième',
      description: 'Premier niveau du collège',
      code: 'NIV-6EME',
      matieresCount: 8,
      dateCreated: addDays(new Date(), -15).toISOString(),
      active: false,
    },
  ];

  // Apply filters
  let filteredData = [...mockData];

  // Filter by search term if present
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (niveau) =>
        niveau.nom.toLowerCase().includes(searchLower) ||
        niveau.description.toLowerCase().includes(searchLower) ||
        niveau.code.toLowerCase().includes(searchLower)
    );
  }

  // Apply column-specific filters
  if (params.nomFilter) {
    const filter = params.nomFilter.toLowerCase();
    filteredData = filteredData.filter((niveau) => niveau.nom.toLowerCase().includes(filter));
  }

  if (params.descriptionFilter) {
    const filter = params.descriptionFilter.toLowerCase();
    filteredData = filteredData.filter((niveau) =>
      niveau.description.toLowerCase().includes(filter)
    );
  }

  if (params.codeFilter) {
    const filter = params.codeFilter.toLowerCase();
    filteredData = filteredData.filter((niveau) => niveau.code.toLowerCase().includes(filter));
  }

  if (params.dateCreatedFilter) {
    const filter = params.dateCreatedFilter.toLowerCase();
    filteredData = filteredData.filter((niveau) => {
      if (!niveau.dateCreated) return false;
      const date = format(new Date(niveau.dateCreated), 'dd MMM yyyy');
      return date.toLowerCase().includes(filter);
    });
  }

  // Filter by active status
  if (params.activeOnly) {
    filteredData = filteredData.filter((niveau) => niveau.active !== false);
  }

  // Sort the data if needed
  if (params.sortBy) {
    const direction = params.sortDirection === 'desc' ? -1 : 1;
    filteredData.sort((a: any, b: any) => {
      const fieldA = a[params.sortBy as keyof Niveau];
      const fieldB = b[params.sortBy as keyof Niveau];

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

// Define the hook
function useNiveauxHook() {
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<Niveau | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'nom',
    sortDirection: 'asc',
    activeOnly: false,
  });

  const fetchNiveaux = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchNiveauxAPI(filters);
      if (response.success) {
        setNiveaux(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors du chargement des niveaux');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchNiveaux();
  }, [fetchNiveaux]);

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

  const handleToggleActive = (niveau: Niveau, active: boolean) => {
    // In a real application, this would call an API to update the status
    setNiveaux((prev) => prev.map((item) => (item.id === niveau.id ? { ...item, active } : item)));
  };

  const handleToggleActiveOnly = (activeOnly: boolean) => {
    setFilters((prev) => ({
      ...prev,
      activeOnly,
      page: 1,
    }));
  };

  const handleDeleteNiveau = async (id: string) => {
    // In a real application, this would call an API to delete the niveau
    setNiveaux((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDeleteMultipleNiveaux = async (ids: string[]) => {
    // In a real application, this would call an API to delete multiple niveaux
    setNiveaux((prev) => prev.filter((item) => !ids.includes(item.id)));
  };

  return {
    niveaux,
    loading,
    error,
    pagination,
    filters,
    selectedNiveau,
    setSelectedNiveau,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleColumnFilterChange,
    handleSortChange,
    handleToggleActive,
    handleToggleActiveOnly,
    handleDeleteNiveau,
    handleDeleteMultipleNiveaux,
    refetch: fetchNiveaux,
  };
}

// Export the hook
const niveauxHooks = {
  useNiveaux: useNiveauxHook,
};

export default niveauxHooks;
