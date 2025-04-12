'use client';

import type {
  IAIAssistantItem,
  IAIAssistantTableFilters,
  IAIAssistantTableColumns,
} from 'src/types/ai-assistant';

import { useRouter } from 'next/navigation';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { _mockAIAssistants } from 'src/shared/_mock/_ai-assistant';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { useTable, rowInPage, getComparator } from 'src/shared/components/table';

import { AIAssistantTable } from './table/ai-assistant-table';
import { AIAssistantForm } from './modification/ai-assistant-form';
import { updateAssistantsWithFakeDates } from './ai-assistant-service';

// Interface pour les filtres avancés
interface IAdvancedFilter {
  column: string;
  operator: string;
  value: string;
}

export function PersonalizationAiView() {
  const router = useRouter();
  const addDialog = useBoolean();
  const editDialog = useBoolean();
  const [tableData, setTableData] = useState<IAIAssistantItem[]>([]);
  const [currentAssistant, setCurrentAssistant] = useState<IAIAssistantItem | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // États pour les popovers de colonnes et de filtrage
  const [columnsAnchorEl, setColumnsAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  // État pour le filtre avancé
  const [advancedFilter, setAdvancedFilter] = useState<IAdvancedFilter | null>(null);

  // État pour suivre si des filtres sont actifs
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const initialLoadDone = useRef(false);

  const table = useTable({
    defaultRowsPerPage: 10,
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
  });

  const defaultVisibleColumns: IAIAssistantTableColumns = {
    name: true,
    type: true,
    educationLevel: true,
    subject: true,
    chapter: true,
    exercise: true,
    status: true,
    dateAjoute: true,
  };

  const [filters, setFilters] = useState<IAIAssistantTableFilters>({
    name: '',
    type: [],
    status: '',
    educationLevel: '',
    subject: '',
    chapter: '',
    exercise: '',
    dateAjoute: '',
    visibleColumns: defaultVisibleColumns,
  });

  const isApprentissgeSelected = filters.type.includes('Apprentissge');

  // Fonctions pour les popovers de colonnes
  const handleOpenColumnsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setColumnsAnchorEl(event.currentTarget);
  };

  const handleCloseColumnsMenu = () => {
    setColumnsAnchorEl(null);
  };

  // Fonctions pour les popovers de filtrage
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setFilterAnchorEl(null);
  };

  // Objets pour les états des popovers
  const columnsPopoverState = {
    open: Boolean(columnsAnchorEl),
    anchorEl: columnsAnchorEl,
    onOpen: handleOpenColumnsMenu,
    onClose: handleCloseColumnsMenu,
  };

  const filterPopoverState = {
    open: Boolean(filterAnchorEl),
    anchorEl: filterAnchorEl,
    onOpen: handleOpenFilterMenu,
    onClose: handleCloseFilterMenu,
  };

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      try {
        updateAssistantsWithFakeDates();
        const storedAssistants = JSON.parse(localStorage.getItem('assistants') || '[]');
        if (storedAssistants.length > 0) {
          setTableData(storedAssistants);
        } else {
          setTableData(_mockAIAssistants);
          localStorage.setItem('assistants', JSON.stringify(_mockAIAssistants));
        }
      } catch (error) {
        console.error('Error initializing assistants data:', error);
        setTableData(_mockAIAssistants);
      }
      setIsMounted(true);
    }
  }, []);

  const saveToLocalStorageRef = useRef(false);

  useEffect(() => {
    if (tableData.length > 0 && saveToLocalStorageRef.current) {
      try {
        const updatedData = tableData.map((assistant) => ({
          ...assistant,
          description: assistant.description || 'Description non disponible',
        }));
        localStorage.setItem('assistants', JSON.stringify(updatedData));
      } catch (error) {
        console.error('Error saving assistants to localStorage:', error);
      }
    } else if (tableData.length > 0) {
      saveToLocalStorageRef.current = true;
    }
  }, [tableData]);

  // Calcul pour déterminer si des filtres sont actifs
  const areFiltersActive = useMemo(() => {
    // Vérifiez si des filtres de base sont actifs
    const basicFiltersActive =
      !!filters.name ||
      filters.type.length > 0 ||
      !!filters.status ||
      !!filters.educationLevel ||
      !!filters.subject ||
      !!filters.chapter ||
      !!filters.exercise;

    // Vérifiez si un filtre avancé est actif
    const advancedFilterActive = !!advancedFilter;

    return basicFiltersActive || advancedFilterActive;
  }, [filters, advancedFilter]);

  // Mettre à jour hasActiveFilters quand areFiltersActive change
  useEffect(() => {
    setHasActiveFilters(areFiltersActive);
  }, [areFiltersActive]);

  const getFilteredData = useCallback(
    () =>
      applyFilter({
        inputData: tableData.map((assistant) => ({
          ...assistant,
          createdAt: assistant.createdAt || '-',
        })),
        comparator: getComparator(table.order, table.orderBy),
        filters,
        advancedFilter,
      }),
    [tableData, table.order, table.orderBy, filters, advancedFilter]
  );

  const dataFiltered = getFilteredData();
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = !dataFiltered.length;

  const handleSettingsRow = useCallback(
    (id: string) => {
      if (isMounted) {
        router.push(`/dashboard/personalization-ai/settings/${id}`);
      }
    },
    [router, isMounted]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      setTableData((prevData) => prevData.filter((row) => row.id !== id));
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      const assistantToEdit = tableData.find((assistant) => assistant.id === id);
      if (assistantToEdit) {
        setCurrentAssistant(assistantToEdit);
        editDialog.onTrue();
      }
    },
    [tableData, editDialog]
  );

  const handleAddAssistant = useCallback((newAssistant: IAIAssistantItem) => {
    if (!newAssistant.id) {
      newAssistant.id = `ai-assistant-${Date.now()}`;
    }
    if (!newAssistant.createdAt) {
      newAssistant.createdAt = new Date().toISOString();
    }
    if (!newAssistant.dateAjoute) {
      newAssistant.dateAjoute = new Date().toISOString();
    }
    setTableData((prevData) => [...prevData, newAssistant]);
  }, []);

  const handleUpdateAssistant = useCallback((updatedAssistant: IAIAssistantItem) => {
    setTableData((prevData) =>
      prevData.map((item) => (item.id === updatedAssistant.id ? updatedAssistant : item))
    );
  }, []);

  const handleFilterChange = useCallback((filterName: string, value: any) => {
    if (filterName === 'advancedFilter') {
      setAdvancedFilter(value);
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [filterName]: value,
      }));
    }
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      name: '',
      type: [],
      dateAjoute: '',
      status: '',
      educationLevel: '',
      subject: '',
      chapter: '',
      exercise: '',
      visibleColumns: filters.visibleColumns,
    });

    // Réinitialiser également le filtre avancé
    setAdvancedFilter(null);
  }, [filters.visibleColumns]);

  const handleExportData = useCallback(() => {
    try {
      const dataToExport =
        selectedRows.length > 0
          ? tableData.filter((assistant) => selectedRows.includes(assistant.id))
          : tableData;
      const exportData = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `ai-assistants-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erreur lors de l'exportation :", error);
    }
  }, [selectedRows, tableData]);

  return (
    <>
      <DashboardContent maxWidth="xl">
        <CustomBreadcrumbs
          heading="Assistant IA"
          links={[
            { name: 'Tableau de bord', href: paths.dashboard.root },
            { name: 'Assistant IA', href: paths.dashboard.ai.assistants_management },
            { name: 'Gestion des assistants' },
          ]}
          sx={{ mb: { xs: 3, md: 5 } }}
        />
        <AIAssistantTable
          table={table}
          dataFiltered={dataFiltered}
          notFound={notFound}
          onDeleteRow={handleDeleteItem}
          onEditRow={handleEditRow}
          onSettingsRow={handleSettingsRow}
          filters={filters}
          isApprentissgeSelected={isApprentissgeSelected}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          columnsPopoverState={columnsPopoverState}
          filterPopoverState={filterPopoverState}
          hasActiveFilters={hasActiveFilters}
          onAddAssistant={addDialog.onTrue}
          onExportData={handleExportData}
        />
      </DashboardContent>

      {addDialog.value && (
        <AIAssistantForm
          open={addDialog.value}
          onClose={addDialog.onFalse}
          onSubmit={handleAddAssistant}
          isEdit={false}
        />
      )}

      {editDialog.value && currentAssistant && (
        <AIAssistantForm
          open={editDialog.value}
          onClose={() => {
            editDialog.onFalse();
            setTimeout(() => setCurrentAssistant(null), 300);
          }}
          onSubmit={handleUpdateAssistant}
          onDelete={handleDeleteItem}
          initialData={currentAssistant}
          isEdit
        />
      )}
    </>
  );
}

function applyFilter({
  inputData,
  comparator,
  filters,
  advancedFilter,
}: {
  inputData: IAIAssistantItem[];
  comparator: (a: any, b: any) => number;
  filters: IAIAssistantTableFilters;
  advancedFilter: IAdvancedFilter | null;
}) {
  const { name, type, status, educationLevel, subject, chapter, exercise, dateAjoute } = filters;

  const filtered = inputData.filter((item) => {
    // Filtres de base
    if (name && !item.name.toLowerCase().includes(name.toLowerCase())) {
      return false;
    }
    if (type && type.length > 0 && !type.includes(item.type)) {
      return false;
    }
    if (status && item.status !== status) {
      return false;
    }
    if (educationLevel && item.educationLevel !== educationLevel) {
      return false;
    }
    if (
      dateAjoute &&
      (!item.dateAjoute || new Date(item.dateAjoute).toISOString().split('T')[0] !== dateAjoute)
    ) {
      return false;
    }
    if (type && type.includes('Apprentissge')) {
      if (subject && (!item.subject || item.subject !== subject)) {
        return false;
      }
      if (chapter && (!item.chapter || item.chapter !== chapter)) {
        return false;
      }
      if (exercise && (!item.exercise || item.exercise !== exercise)) {
        return false;
      }
    }

    // Filtre avancé
    if (advancedFilter) {
      const itemValue = getItemValue(item, advancedFilter.column).toLowerCase();
      const filterValue = advancedFilter.value ? advancedFilter.value.toLowerCase() : '';
      switch (advancedFilter.operator) {
        case 'equals':
          if (itemValue !== filterValue) return false;
          break;
        case 'notequals':
          if (itemValue === filterValue) return false;
          break;
        case 'contains':
          if (!itemValue.includes(filterValue)) return false;
          break;
        case 'startswith':
          if (!itemValue.startsWith(filterValue)) return false;
          break;
        case 'endswith':
          if (!itemValue.endsWith(filterValue)) return false;
          break;
        default:
          // Cas par défaut : si l'opérateur n'est pas reconnu, on ne filtre pas l'élément
          break;
      }
    }
    return true;
  });

  const stabilizedThis = filtered.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

// Helper function to get item value by column name
function getItemValue(item: IAIAssistantItem, column: string): string {
  switch (column) {
    case 'name':
      return item.name?.toString() || '';
    case 'type':
      return item.type?.toString() || '';
    case 'dateAjoute':
      return item.dateAjoute ? new Date(item.dateAjoute).toISOString().split('T')[0] : '';
    case 'educationLevel':
      return item.educationLevel?.toString() || '';
    case 'subject':
      return item.subject?.toString() || '';
    case 'chapter':
      return item.chapter?.toString() || '';
    case 'exercise':
      return item.exercise?.toString() || '';
    case 'status':
      return item.status?.toString() || '';
    default:
      return '';
  }
}
