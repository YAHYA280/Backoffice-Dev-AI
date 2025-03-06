import { useState, useCallback, useEffect } from 'react';
import {
  Matiere,
  FilterParams,
  ApiResponse,
  Pagination,
  DEFAULT_PAGINATION,
  MATIERE_COLORS,
} from '../types';

// Mock API function for demonstration purposes
const fetchMatieresAPI = async (
  niveauId: string,
  params: FilterParams
): Promise<ApiResponse<Matiere[]>> => {
  // This would be an actual API call in a real application
  const mockData: Matiere[] = [
    {
      id: '1',
      nom: 'Mathématiques',
      description: 'Apprentissage des fondements mathématiques',
      couleur: '#FF5722',
      icon: 'M',
      chapitresCount: 4,
      niveauId,
    },
    {
      id: '2',
      nom: 'Français',
      description: 'Apprentissage de la langue française',
      couleur: '#2196F3',
      icon: 'F',
      chapitresCount: 5,
      niveauId,
    },
    {
      id: '3',
      nom: 'Sciences',
      description: 'Découverte du monde scientifique',
      couleur: '#4CAF50',
      icon: 'S',
      chapitresCount: 3,
      niveauId,
    },
    {
      id: '4',
      nom: 'Histoire-Géographie',
      description: 'Découverte du monde et de son histoire',
      couleur: '#9C27B0',
      icon: 'H',
      chapitresCount: 2,
      niveauId,
    },
    {
      id: '5',
      nom: 'Arts plastiques',
      description: 'Expression artistique et créativité',
      couleur: '#FF9800',
      icon: 'A',
      chapitresCount: 2,
      niveauId,
    },
  ];

  // Filter by search term if present
  let filteredData = [...mockData];
  if (params.searchTerm) {
    const searchLower = params.searchTerm.toLowerCase();
    filteredData = filteredData.filter(
      (matiere) =>
        matiere.nom.toLowerCase().includes(searchLower) ||
        matiere.description.toLowerCase().includes(searchLower)
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

export const useMatieres = (niveauId: string) => {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<FilterParams>({
    searchTerm: '',
    page: 1,
    limit: 10,
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
    refetch: fetchMatieres,
  };
};
