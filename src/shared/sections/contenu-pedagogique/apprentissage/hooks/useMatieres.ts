'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, addDays, subDays, subMonths } from 'date-fns';

import { DEFAULT_PAGINATION } from '../types';

import type { Matiere, Pagination, ApiResponse, FilterParams } from '../types';

const fetchMatieresAPI = async (
  niveauId: string,
  params: FilterParams
): Promise<ApiResponse<Matiere[]>> => {
  const mockData: Matiere[] = [
    {
      id: '1',
      nom: 'Mathématiques',
      description: 'Apprentissage des fondements mathématiques',
      couleur: '#FF5722',
      icon: 'M',
      chapitresCount: 4,
      niveauId,
      dateCreated: subMonths(new Date(), 9).toISOString(),
      lastUpdated: subDays(new Date(), 15).toISOString(),
      active: true,
    },
    {
      id: '2',
      nom: 'Français',
      description: 'Apprentissage de la langue française',
      couleur: '#2196F3',
      icon: 'F',
      chapitresCount: 5,
      niveauId,
      dateCreated: subMonths(new Date(), 8).toISOString(),
      lastUpdated: subDays(new Date(), 10).toISOString(),
      active: true,
    },
    {
      id: '3',
      nom: 'Sciences',
      description: 'Découverte du monde scientifique',
      couleur: '#4CAF50',
      icon: 'S',
      chapitresCount: 3,
      niveauId,
      dateCreated: subMonths(new Date(), 7).toISOString(),
      lastUpdated: subDays(new Date(), 20).toISOString(),
      active: true,
    },
    {
      id: '4',
      nom: 'Histoire-Géographie',
      description: 'Découverte du monde et de son histoire',
      couleur: '#9C27B0',
      icon: 'H',
      chapitresCount: 2,
      niveauId,
      dateCreated: subMonths(new Date(), 6).toISOString(),
      lastUpdated: subDays(new Date(), 5).toISOString(),
      active: false,
    },
    {
      id: '5',
      nom: 'Arts plastiques',
      description: 'Expression artistique et créativité',
      couleur: '#FF9800',
      icon: 'A',
      chapitresCount: 2,
      niveauId,
      dateCreated: subMonths(new Date(), 5).toISOString(),
      lastUpdated: subDays(new Date(), 30).toISOString(),
      active: true,
    },
    {
      id: '6',
      nom: 'Musique',
      description: 'Développement des compétences musicales',
      couleur: '#795548',
      icon: 'Mu',
      chapitresCount: 3,
      niveauId,
      dateCreated: subMonths(new Date(), 4).toISOString(),
      lastUpdated: subDays(new Date(), 12).toISOString(),
      active: true,
    },
    {
      id: '7',
      nom: 'Éducation physique',
      description: 'Activités sportives et jeux collectifs',
      couleur: '#F44336',
      icon: 'EP',
      chapitresCount: 4,
      niveauId,
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
      (matiere) =>
        matiere.nom.toLowerCase().includes(searchLower) ||
        matiere.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply column-specific filters
  if (params.nomFilter) {
    const filter = params.nomFilter.toLowerCase();
    filteredData = filteredData.filter((matiere) => matiere.nom.toLowerCase().includes(filter));
  }

  if (params.descriptionFilter) {
    const filter = params.descriptionFilter.toLowerCase();
    filteredData = filteredData.filter((matiere) =>
      matiere.description.toLowerCase().includes(filter)
    );
  }

  if (params.dateCreatedFilter) {
    const filter = params.dateCreatedFilter.toLowerCase();
    filteredData = filteredData.filter((matiere) => {
      if (!matiere.dateCreated) return false;
      const date = format(new Date(matiere.dateCreated), 'dd MMM yyyy');
      return date.toLowerCase().includes(filter);
    });
  }

  // Filter by active status
  if (params.activeOnly) {
    filteredData = filteredData.filter((matiere) => matiere.active !== false);
  }

  // Sort the data if needed
  if (params.sortBy) {
    const direction = params.sortDirection === 'desc' ? -1 : 1;
    filteredData.sort((a: any, b: any) => {
      const fieldA = a[params.sortBy as keyof Matiere];
      const fieldB = b[params.sortBy as keyof Matiere];

      if (fieldA < fieldB) return -1 * direction;
      if (fieldA > fieldB) return 1 * direction;
      return 0;
    });
  } else {
    // Default sort by nom
    filteredData.sort((a, b) => a.nom.localeCompare(b.nom));
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
function useMatieresHook(niveauId: string) {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
    sortBy: 'nom',
    sortDirection: 'asc',
    activeOnly: false,
  });

  const fetchMatieres = useCallback(async () => {
    if (!niveauId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetchMatieresAPI(niveauId, filters);
      if (response.success) {
        setMatieres(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        setError(response.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Erreur lors du chargement des matières');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [niveauId, filters]);

  useEffect(() => {
    fetchMatieres();
  }, [fetchMatieres]);

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

  const handleToggleActive = (matiere: Matiere, active: boolean) => {
    //  API to update the status
    setMatieres((prev) =>
      prev.map((item) => (item.id === matiere.id ? { ...item, active } : item))
    );

    if (selectedMatiere && selectedMatiere.id === matiere.id) {
      setSelectedMatiere({
        ...selectedMatiere,
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

  const handleDeleteMatiere = async (id: string) => {
    // API to delete the matiere
    setMatieres((prev) => prev.filter((item) => item.id !== id));

    if (selectedMatiere && selectedMatiere.id === id) {
      setSelectedMatiere(null);
    }
  };

  const handleDeleteMultipleMatieres = async (ids: string[]) => {
    //  API to delete multiple matieres
    setMatieres((prev) => prev.filter((item) => !ids.includes(item.id)));

    if (selectedMatiere && ids.includes(selectedMatiere.id)) {
      setSelectedMatiere(null);
    }
  };

  return {
    matieres,
    loading,
    error,
    pagination,
    filters,
    selectedMatiere,
    setSelectedMatiere,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleColumnFilterChange,
    handleSortChange,
    handleToggleActive,
    handleToggleActiveOnly,
    handleDeleteMatiere,
    handleDeleteMultipleMatieres,
    refetch: fetchMatieres,
  };
}

// Export the hook
export const useMatieres = useMatieresHook;
