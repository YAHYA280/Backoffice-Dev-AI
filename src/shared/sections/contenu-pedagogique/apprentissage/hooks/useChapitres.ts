'use client';

import type { Chapter, ChapterList, ChapterPageFilterParams } from 'src/types/chapter';

import { useState, useEffect, useCallback } from 'react';

import { useChapterStore } from 'src/shared/api/stores/chapterStore';

import { DEFAULT_PAGINATION } from '../types';

import type { Pagination, ApiResponse } from '../types';

const fetchChapitresAPI = async (
  matiereId: string,
  params: ChapterPageFilterParams
): Promise<ApiResponse<ChapterList[]>> => {
  await useChapterStore.getState().fetchChapters(matiereId, {
    page: params.page,
    size: params.size,
    orderSearch: params.orderSearch,
    nameSearch: params.nameSearch,
    descriptionSearch: params.descriptionSearch,
    difficultySearch: params.difficultySearch,
    dateSearch: params.dateSearch,
  });

  const { chapters, totalElements } = useChapterStore.getState();

  return {
    data: chapters,
    pagination: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      total: totalElements,
    },
    success: true,
  };
};

function useChapitresHook(matiereId: string) {
  const [chapitres, setChapitres] = useState<ChapterList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapitre, setSelectedChapitre] = useState<Chapter | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<ChapterPageFilterParams>({
    page: 0,
    size: 10,
    sortBy: 'ordre',
    sortDirection: 'asc',
    orderSearch: '',
    nameSearch: '',
    descriptionSearch: '',
    difficultySearch: '',
    dateSearch: '',
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

  const handleLimitChange = (size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      nameSearch: value,
      descriptionSearch: value,
      orderSearch: value,
      difficultySearch: value,
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
      case 'ordre':
        filterKey = 'orderSearch';
        break;
      case 'difficulte':
        filterKey = 'difficultySearch';
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

  const handleToggleActive = async (chapitre: Chapter, active: boolean) => {
      try {
        await useChapterStore.getState().toggleActivation(chapitre.id, active);
        setChapitres((prev) =>
          prev.map((item) => (item.id === chapitre.id ? { ...item, active } : item))
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

  const handleSetDifficulteFilter = (difficulte: string | null) => {
    setFilters((prev) => ({
      ...prev,
      difficulte,
      page: 0,
    }));
  };

  const handleSetMinMaxExercices = (min: number | null, max: number | null) => {
    setFilters((prev) => ({
      ...prev,
      minExercices: min,
      maxExercices: max,
      page: 0,
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
    try {
      await useChapterStore.getState().deleteChapter(id);
      setChapitres((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du chapitre');
      console.error(err);
    }
  };

  const handleDeleteMultipleChapitres = async (ids: string[]) => {
    try {
      await useChapterStore.getState().deleteMultipleChapters(ids);
      setChapitres((prev) => prev.filter((item) => !ids.includes(item.id)));
    } catch (err) {
      setError('Erreur lors de la suppression des chapitres');
      console.error(err);
    }
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
    handleToggleActive,
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
