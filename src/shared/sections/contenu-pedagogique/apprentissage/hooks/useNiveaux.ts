'use client';

import type {Level, LevelList, LevelPageFilterParams } from 'src/types/level';

import { useState, useEffect, useCallback } from 'react';

import { useLevelStore } from 'src/shared/api/stores/levelStore';

import { DEFAULT_PAGINATION } from '../types';

import type { Pagination, ApiResponse } from '../types';

const fetchNiveauxAPI = async (params: LevelPageFilterParams): Promise<ApiResponse<LevelList[]>> => {
  await useLevelStore.getState().fetchLevels({
    page: params.page,
    size: params.size,
    nameSearch: params.nameSearch,
    codeSearch: params.codeSearch,
    descriptionSearch: params.descriptionSearch,
    dateSearch: params.dateSearch,
  });

  const { levels, totalElements } = useLevelStore.getState();

  return {
    data: levels,
    pagination: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      total: totalElements,
    },
    success: true,
  };
};

// Define the hook
function useNiveauxHook() {
  const [niveaux, setNiveaux] = useState<LevelList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNiveau, setSelectedNiveau] = useState<LevelList | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<LevelPageFilterParams>({
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'asc',
    nameSearch: '',
    codeSearch: '',
    descriptionSearch: '',
    dateSearch: '',
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

  const handleLimitChange = (size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      nameSearch: value,
      codeSearch: value,
      descriptionSearch: value,
      dateSearch: value,
      page: 0,
    }));
  };

  const handleColumnFilterChange = (columnId: string, value: string) => {
    let filterKey = '';
    switch (columnId) {
      case 'nom':
        filterKey = 'nameSearch';
        break;
      case 'description':
        filterKey = 'descriptionSearch';
        break;
      case 'code':
        filterKey = 'codeSearch';
        break;
      case 'dateCreated':
        filterKey = 'dateSearch';
        break;
      default:
        filterKey = columnId;
    }
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
      page: 0,
    }));
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setFilters((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection: direction,
    }));
  };

  const handleToggleActive = async (niveau: Level, active: boolean) => {
    try {
      await useLevelStore.getState().toggleActivation(niveau.id, active);
      setNiveaux((prev) =>
        prev.map((item) => (item.id === niveau.id ? { ...item, active } : item))
      );
    } catch (err) {
      setError('Erreur lors du changement de statut actif');
      console.error(err);
    }
  };

  const handleToggleActiveOnly = (activeOnly: boolean) => {
    setFilters((prev) => ({
      ...prev,
      activeOnly,
      page: 0,
    }));
  };

  const handleDeleteNiveau = async (id: string) => {
    try {
      await useLevelStore.getState().deleteLevel(id);
      setNiveaux((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du niveau');
      console.error(err);
    }
  };

  const handleDeleteMultipleNiveaux = async (ids: string[]) => {
    try {
      await useLevelStore.getState().deleteMultipleLevels(ids);
      setNiveaux((prev) => prev.filter((item) => !ids.includes(item.id)));
    } catch (err) {
      setError('Erreur lors de la suppression des niveaux');
      console.error(err);
    }
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
