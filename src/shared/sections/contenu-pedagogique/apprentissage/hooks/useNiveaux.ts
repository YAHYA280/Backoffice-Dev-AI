'use client';

// src/shared/sections/contenu-pedagogique/apprentissage/hooks/useNiveaux.ts
import { useState, useCallback, useEffect } from 'react';
import { Niveau, FilterParams, ApiResponse, Pagination, DEFAULT_PAGINATION } from '../types';

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
    },
    {
      id: '2',
      nom: 'CP2 - Cours Préparatoire 2',
      description: 'Second niveau du cycle préparatoire',
      code: 'NIV-CP2',
      matieresCount: 5,
    },
    {
      id: '3',
      nom: 'CE1 - Cours Élémentaire 1',
      description: 'Premier niveau du cycle élémentaire',
      code: 'NIV-CE1',
      matieresCount: 4,
    },
    {
      id: '4',
      nom: 'CE2 - Cours Élémentaire 2',
      description: 'Second niveau du cycle élémentaire',
      code: 'NIV-CE2',
      matieresCount: 5,
    },
    {
      id: '5',
      nom: 'CM1 - Cours Moyen 1',
      description: 'Premier niveau du cycle moyen',
      code: 'NIV-CM1',
      matieresCount: 6,
    },
  ];

  // Filter by search term if present
  let filteredData = [...mockData];
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (niveau) =>
        niveau.nom.toLowerCase().includes(searchLower) ||
        niveau.description.toLowerCase().includes(searchLower) ||
        niveau.code.toLowerCase().includes(searchLower)
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

// Define the hook as a regular function
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
    refetch: fetchNiveaux,
  };
}

// Export an object with the hook as a property
const niveauxHooks = {
  useNiveaux: useNiveauxHook,
};

// Direct export of the object
export default niveauxHooks;
