'use client';

import type { Subject, SubjectList, SubjectPageFilterParams } from 'src/types/subject';

import { useState, useEffect, useCallback } from 'react';

import { useSubjectStore } from 'src/shared/api/stores/subjectStore';

import { DEFAULT_PAGINATION } from '../types';

import type { Pagination, ApiResponse } from '../types';

const fetchMatieresAPI = async (
  niveauId: string,
  params: SubjectPageFilterParams
): Promise<ApiResponse<SubjectList[]>> => {
  await useSubjectStore.getState().fetchSubjects(niveauId, {
    page: params.page,
    size: params.size,
    nameSearch: params.nameSearch,
    descriptionSearch: params.descriptionSearch,
    chaptersSearch: params.chaptersSearch,
    dateSearch: params.dateSearch,
  });

  const { subjects, totalElements } = useSubjectStore.getState();

  return {
    data: subjects,
    pagination: {
      page: params.page ?? 0,
      size: params.size ?? 10,
      total: totalElements,
    },
    success: true,
  };
};

// Define the hook
function useMatieresHook(niveauId: string) {
  const [matieres, setMatieres] = useState<SubjectList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<SubjectList | null>(null);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState<SubjectPageFilterParams>({
    page: 0,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'asc',
    nameSearch: '',
    descriptionSearch: '',
    chaptersSearch: '',
    dateSearch: '',
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

  const handleLimitChange = (size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      nameSearch: value,
      descriptionSearch: value,
      chaptersSearch: value,
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
      case 'chapitresCount':
        filterKey = 'chaptersSearch';
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

  const handleToggleActive = async (matiere: Subject, active: boolean) => {
    try {
      await useSubjectStore.getState().toggleActivation(matiere.id, active);
      setMatieres((prev) =>
        prev.map((item) => (item.id === matiere.id ? { ...item, active } : item))
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

  const handleDeleteMatiere = async (id: string) => {
    try {
      await useSubjectStore.getState().deleteSubject(id);
      setMatieres((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du matière');
      console.error(err);
    }
  };

  const handleDeleteMultipleMatieres = async (ids: string[]) => {
    try {
      await useSubjectStore.getState().deleteMultipleSubjects(ids);
      setMatieres((prev) => prev.filter((item) => !ids.includes(item.id)));
    } catch (err) {
      setError('Erreur lors de la suppression des matières');
      console.error(err);
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
