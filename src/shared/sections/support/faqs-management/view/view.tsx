'use client';

import type { IDateValue } from "src/contexts/types/common";
import type { ICategoryItem } from 'src/shared/_mock/_categories';
import type { IFaqItem, IFAQTableFilters } from 'src/contexts/types/faq';

import dayjs from 'dayjs';
import { toast } from 'sonner';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, { useMemo, useState, useEffect } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTrash,
  faTable,
  faTimes,
  faFilter,
  faFileExport,
  faArrowsRotate,
} from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Tab,
  Card,
  Tabs,
  Menu,
  Table,
  Button,
  Tooltip,
  Divider,
  MenuItem,
  Checkbox,
  TableBody,
  TextField,
  IconButton,
  FormControl,
  ListItemText,
  InputAdornment,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { _faqList } from 'src/shared/_mock/_faq';
import { varAlpha } from 'src/shared/theme/styles';
import { _categoriesList } from 'src/shared/_mock/_categories';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { FaqNewForm } from '../faqs/FaqNewForm';
import { FaqTableRow } from '../faqs/FaqTableRow';
import { FaqTableHead } from '../faqs/FaqTableHead';
import { FaqDetailDrawer } from '../faqs/FaqDetailDrawer';
import { FaqModifierDialog } from '../faqs/FaqModifierDialog';
import { CategoryTableRow } from '../categories/CategoryTableRow';
import { CategoryNewDialog } from '../categories/CategoryNewDialog';
import { CategoryTableHead } from '../categories/CategoryTableHead';
import { CategoryModifierDialog } from '../categories/CategoryModifierDialog';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const FIXED_COLUMNS = [
  { id: 'select', label: '', width: 50 },
  { id: 'actions', label: 'Actions', width: 60, sx: { textAlign: 'right' } },
];

const DEFAULT_COLUMNS = [
  { id: 'title', label: 'Titre', width: 300 },
  { id: 'categorie', label: 'Catégorie', width: 150 },
  { id: 'statut', label: 'Statut', width: 130 },
  { id: 'datePublication', label: 'Date de création', width: 130 },
];

const DEFAULT_CATEGORY_COLUMNS = [
  { id: 'title', label: 'Titre', width: 200 },
  { id: 'description', label: 'Description', width: 300 },
  { id: 'numberFaq', label: 'Nombre FAQ', width: 120 },
  { id: 'datePublication', label: 'Date de création', width: 150 },
];

const FILTER_COLUMN_OPTIONS = [
  { value: 'title', label: 'Titre' },
  { value: 'categorie', label: 'Catégorie' },
  { value: 'statut', label: 'Statut' },
  { value: 'datePublication', label: 'Date de création' },
];

const FILTER_CATEGORIE_OPTIONS = [
  { value: 'title', label: 'Titre' },
  { value: 'description', label: 'Description' },
  { value: 'numberFaq', label: 'Nombre FAQ' },
  { value: 'datePublication', label: 'Date de création' },
];

const OPERATOR_OPTIONS_COMMON = [
  { value: 'contains', label: 'contient' },
  { value: 'equals', label: 'égal à' },
  { value: 'starts-with', label: 'commence par' },
  { value: 'ends-with', label: 'se termine par' },
  { value: 'is-empty', label: 'est vide' },
  { value: 'is-not-empty', label: "n'est pas vide" },
];

const OPERATOR_OPTIONS_NUMBER = [
  { value: 'inferieur', label: 'inférieur à' },
  { value: 'equals', label: 'égal à' },
  { value: 'superieur', label: 'supérieur à' },
];

const OPERATOR_OPTIONS_DATE = [
  { value: 'avant', label: 'avant' },
  { value: 'egal', label: 'égal à' },
  { value: 'apres', label: 'après' },
];

const OPERATOR_OPTIONS_TYPE = [
  { value: 'is', label: 'est' },
  { value: 'is-not', label: "n'est pas" },
];

export type ICategoryFilters = {
  title: string;
  description: string;
  numberFaq: string;
  datePublication: IDateValue;
};

type Props = { title?: string };

export function FaqsView({ title = 'Gestion des FAQs' }: Props) {
  const newForm = useBoolean();
  const newCategory = useBoolean();
  const [currentTab, setCurrentTab] = useState<'articles' | 'categories'>('articles');
  // Updated the type to ICategoryItem (which includes `numberFaq`)
  const [currentCategoryToEdit, setCurrentCategoryToEdit] = useState<ICategoryItem | null>(null);
  const [currentFaqToEdit, setCurrentFaqToEdit] = useState<{
    id: string;
    title: string;
    reponse: string | null | undefined;
    categorie: string;
    statut: string;
    datePublication: IDateValue;
  } | null>(null);
  const [currentFaqToAfficher, setCurrentFaqToAfficher] = useState<{
    id: string;
    title: string;
    reponse: string;
    categorie: string;
    statut: string;
    datePublication: IDateValue;
  } | null>(null);
  const table = useTable();
  const [tableData, setTableData] = useState<IFaqItem[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<IFaqItem[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const catTable = useTable();
  const [categoriesSelected, setCategoriesSelected] = useState<string[]>([]);
  const [catTableData, setCatTableData] = useState<ICategoryItem[]>([]);
  const [baseFilteredCatData, setBaseFilteredCatData] = useState<ICategoryItem[]>([]);
  const [catTotalRows, setCatTotalRows] = useState<number>(0);
  const filters = useSetState<IFAQTableFilters>({
    title: '',
    categorie: [],
    statut: [],
    datePublication: null,
  });
  const [customFilter, setCustomFilter] = useState({
    column: 'title',
    operator: 'contains',
    value: '',
  });
  const [filterColumn, setFilterColumn] = useState('title');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const categoryFilters = useSetState<ICategoryFilters>({
    title: '',
    description: '',
    numberFaq: '',
    datePublication: null,
  });
  const [customCategoryFilter, setCustomCategoryFilter] = useState({
    column: 'title',
    operator: 'contains',
    value: '',
  });
  const [categoryFilterColumn, setCategoryFilterColumn] = useState('title');
  const [categoryFilterOperator, setCategoryFilterOperator] = useState('contains');
  const [categoryFilterValue, setCategoryFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_COLUMNS.map((col) => col.id));
  const [visibleCategoryColumns, setVisibleCategoryColumns] = useState<string[]>(DEFAULT_CATEGORY_COLUMNS.map((col) => col.id));
  const [anchorElColumns, setAnchorElColumns] = useState<null | HTMLElement>(null);
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [anchorElColumnsCategory, setAnchorElColumnsCategory] = useState<null | HTMLElement>(null);
  const [anchorElFilterCategory, setAnchorElFilterCategory] = useState<null | HTMLElement>(null);
  const notFound = tableData.length === 0;

  const handleChangeTab = (event: React.SyntheticEvent, newValue: 'articles' | 'categories') => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    let baseFiltered = applyFilter({
      inputData: _faqList,
      comparator: getComparator(table.order, table.orderBy),
      filters: filters.state,
    });
    if (customFilter.value) {
      baseFiltered = baseFiltered.filter((faq) => {
        const faqValue = (faq as any)[customFilter.column];
        if (faqValue == null) return false;
        return compareValue(faqValue, customFilter.value, customFilter.operator);
      });
    }
    setBaseFilteredData(baseFiltered);
    setTotalRows(baseFiltered.length);
    const start = table.page * table.rowsPerPage;
    const end = start + table.rowsPerPage;
    setTableData(baseFiltered.slice(start, end));
  }, [filters.state, table.order, table.orderBy, table.page, table.rowsPerPage, customFilter]);

  const handleSelectAllClick = (checked: boolean) => {
    table.onSelectAllRows(checked, baseFilteredData.map((row) => row.id));
  };

  const computedTableHead = useMemo(() => {
    const toggable = DEFAULT_COLUMNS.filter((col) => visibleColumns.includes(col.id));
    return [...FIXED_COLUMNS.slice(0, 1), ...toggable, ...FIXED_COLUMNS.slice(1)];
  }, [visibleColumns]);

  const handleOpenColumnsMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElColumns(event.currentTarget);
  };
  const handleCloseColumnsMenu = () => {
    setAnchorElColumns(null);
  };
  const handleToggleColumn = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
    );
  };

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilter(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setAnchorElFilter(null);
  };
  const handleChangeFilterColumn = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newCol = event.target.value as string;
    setFilterColumn(newCol);
    if (newCol === 'categorie' || newCol === 'statut') {
      setFilterOperator('is');
    } else if (newCol === 'datePublication') {
      setFilterOperator('avant');
    } else {
      setFilterOperator('contains');
    }
    setFilterValue('');
  };
  const handleChangeFilterOperator = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterOperator(event.target.value as string);
  };
  const handleApplyFilters = () => {
    setCustomFilter({ column: filterColumn, operator: filterOperator, value: filterValue });
    handleCloseFilterMenu();
  };

  const handleDeleteSelected = () => {
    toast.success(`Suppression réussie de ${table.selected.length} FAQ sélectionnées.`);
  };

  useEffect(() => {
    let baseFiltered = applyCategoryFilter({
      inputData: _categoriesList,
      comparator: getComparator(catTable.order, catTable.orderBy),
      categoryFilters: categoryFilters.state,
    });
    if (customCategoryFilter.value) {
      baseFiltered = baseFiltered.filter((cat) => {
        const catValue = (cat as any)[customCategoryFilter.column];
        if (catValue == null) return false;
        return compareValue(catValue, customCategoryFilter.value, customCategoryFilter.operator);
      });
    }
    setBaseFilteredCatData(baseFiltered);
    setCatTotalRows(baseFiltered.length);
    const start = catTable.page * catTable.rowsPerPage;
    const end = start + catTable.rowsPerPage;
    setCatTableData(baseFiltered.slice(start, end));
  }, [
    categoryFilters.state,
    catTable.order,
    catTable.orderBy,
    catTable.page,
    catTable.rowsPerPage,
    customCategoryFilter,
  ]);

  const handleOpenColumnsMenuCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElColumnsCategory(event.currentTarget);
  };
  const handleCloseColumnsMenuCategory = () => {
    setAnchorElColumnsCategory(null);
  };
  const handleToggleCategoryColumn = (columnId: string) => {
    setVisibleCategoryColumns((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
    );
  };

  const computedCategoryTableHead = useMemo(() => {
    const toggable = DEFAULT_CATEGORY_COLUMNS.filter((col) =>
      visibleCategoryColumns.includes(col.id)
    );
    return [{ id: 'select', label: '', width: 50 }, ...toggable, { id: 'actions', label: 'Actions', width: 60, sx: { textAlign: 'right' }  }];
  }, [visibleCategoryColumns]);

  const handleOpenFilterMenuCategory = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilterCategory(event.currentTarget);
  };
  const handleCloseFilterMenuCategory = () => {
    setAnchorElFilterCategory(null);
  };
  const handleApplyCategoryFilters = () => {
    categoryFilters.setState({
      title: '',
      description: '',
      numberFaq: '',
      datePublication: null,
    });
    setCustomCategoryFilter({
      column: categoryFilterColumn,
      operator: categoryFilterOperator,
      value: categoryFilterValue,
    });
    handleCloseFilterMenuCategory();
  };

  const handleRefresh = () => {
    if (currentTab === 'articles') {
      setFilterColumn('title');
      setFilterOperator('contains');
      setFilterValue('');
      setCustomFilter({ column: 'title', operator: 'contains', value: '' });
      filters.setState({ title: '', categorie: [], statut: [], datePublication: null });
      setVisibleColumns(DEFAULT_COLUMNS.map((col) => col.id));
    } else {
      setCategoryFilterColumn('title');
      setCategoryFilterOperator('contains');
      setCategoryFilterValue('');
      setCustomCategoryFilter({ column: 'title', operator: 'contains', value: '' });
      categoryFilters.setState({
        title: '',
        description: '',
        numberFaq: '',
        datePublication: null,
      });
      setVisibleCategoryColumns(DEFAULT_CATEGORY_COLUMNS.map((col) => col.id));
    }
  };

  const handleSelectAllCategories = (checked: boolean) => {
    if (checked) {
      setCategoriesSelected(baseFilteredCatData.map((cat) => cat.id));
    } else {
      setCategoriesSelected([]);
    }
  };
  const handleSelectCategoryRow = (id: string) => {
    setCategoriesSelected((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };
  const handleDeleteSelectedCategories = () => {
    toast.success(`Suppression réussie de ${categoriesSelected.length} catégories sélectionnées.`);
  };

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomBreadcrumbs
            heading="Gestion des FAQs"
            links={[
              { name: 'Tableau de bord', href: paths.dashboard.root },
              { name: 'Support', href: paths.dashboard.support.faqs },
              { name: 'Gestion des FAQs' },
            ]}
            sx={{ flex: 1 }}
          />
          {currentTab === 'articles' ? (
            <Button
              onClick={newForm.onTrue}
              variant="contained"
              color="primary"
              startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
            >
              Ajouter une FAQ
            </Button>
          ) : (
            <Button
              onClick={newCategory.onTrue}
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
              color="primary"
            >
              Ajouter une catégorie
            </Button>
          )}
        </Box>
      </Box>
      <Menu
        anchorEl={anchorElColumns}
        open={Boolean(anchorElColumns)}
        onClose={handleCloseColumnsMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 1.5, width: 300 } } }}
      >
        {DEFAULT_COLUMNS.map((col, index) => {
          const isFirst = index === 0;
          const isChecked = isFirst || visibleColumns.includes(col.id);
          return (
            <MenuItem
              key={col.id}
              onClick={isFirst ? undefined : () => handleToggleColumn(col.id)}
              sx={{ px: 1, py: 0.5 }}
            >
              <Checkbox checked={isChecked} disabled={isFirst} sx={{ mr: 1 }} />
              <ListItemText primary={col.label} />
            </MenuItem>
          );
        })}
        <Divider sx={{ my: 1 }} />
        <MenuItem>
          <Checkbox
            checked={
              visibleColumns.filter((id) => id !== DEFAULT_COLUMNS[0].id).length ===
              DEFAULT_COLUMNS.slice(1).length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setVisibleColumns(DEFAULT_COLUMNS.map((col) => col.id));
              } else {
                setVisibleColumns([DEFAULT_COLUMNS[0].id]);
              }
            }}
            sx={{ mr: 1 }}
          />
          <ListItemText primary="Afficher/Masquer tout" />
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorElFilter}
        open={Boolean(anchorElFilter)}
        onClose={handleCloseFilterMenu}
        slotProps={{ paper: { sx: { p: 2, width: 600, borderRadius: 2 } } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Box component="span" sx={{ fontWeight: 600 }}>
            Filtres
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={handleCloseFilterMenu} size="small" sx={{ ml: 'auto' }}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 2 }}>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Colonne"
              value={filterColumn}
              onChange={handleChangeFilterColumn}
              SelectProps={{ native: false }}
            >
              {FILTER_COLUMN_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Opérateur"
              value={filterOperator}
              onChange={handleChangeFilterOperator}
              SelectProps={{ native: false }}
            >
              {(filterColumn === 'categorie' || filterColumn === 'statut'
                ? OPERATOR_OPTIONS_TYPE
                : filterColumn === 'datePublication'
                ? OPERATOR_OPTIONS_DATE
                : OPERATOR_OPTIONS_COMMON
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            {filterColumn === 'datePublication' ? (
              <DatePicker
                label="Valeur"
                value={filterValue ? dayjs(filterValue, 'DD/MM/YYYY') : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setFilterValue(newValue.format('DD/MM/YYYY'));
                  } else {
                    setFilterValue('');
                  }
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    placeholder: 'JJ/MM/AAAA',
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 1 } },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faFilter} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            ) : filterColumn === 'categorie' ? (
              <TextField
                select
                label="Valeur"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="Compte">Compte</MenuItem>
                <MenuItem value="Facturation">Facturation</MenuItem>
                <MenuItem value="Sécurité">Sécurité</MenuItem>
              </TextField>
            ) : filterColumn === 'statut' ? (
              <TextField
                select
                label="Valeur"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Publié">Publié</MenuItem>
                <MenuItem value="Brouillion">Brouillion</MenuItem>
                <MenuItem value="Archivé">Archivé</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Valeur"
                size="small"
                placeholder={filterColumn === 'datePublication' ? 'JJ/MM/AAAA' : ''}
                value={filterValue}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                onChange={(e) => setFilterValue(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faFilter} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button variant="contained" size="small" onClick={handleApplyFilters}>
            Appliquer
          </Button>
        </Box>
      </Menu>
      <Menu
        anchorEl={anchorElColumnsCategory}
        open={Boolean(anchorElColumnsCategory)}
        onClose={handleCloseColumnsMenuCategory}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 1.5, width: 300 } } }}
      >
        {DEFAULT_CATEGORY_COLUMNS.map((col, index) => {
          const isFirst = index === 0;
          const isChecked = isFirst || visibleCategoryColumns.includes(col.id);
          return (
            <MenuItem
              key={col.id}
              onClick={isFirst ? undefined : () => handleToggleCategoryColumn(col.id)}
              sx={{ px: 1, py: 0.5 }}
            >
              <Checkbox checked={isChecked} disabled={isFirst} sx={{ mr: 1 }} />
              <ListItemText primary={col.label} />
            </MenuItem>
          );
        })}
        <Divider sx={{ my: 1 }} />
        <MenuItem>
          <Checkbox
            checked={
              visibleCategoryColumns.filter((id) => id !== DEFAULT_CATEGORY_COLUMNS[0].id)
                .length === DEFAULT_CATEGORY_COLUMNS.slice(1).length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setVisibleCategoryColumns(DEFAULT_CATEGORY_COLUMNS.map((col) => col.id));
              } else {
                setVisibleCategoryColumns([DEFAULT_CATEGORY_COLUMNS[0].id]);
              }
            }}
            sx={{ mr: 1 }}
          />
          <ListItemText primary="Afficher/Masquer tout" />
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorElFilterCategory}
        open={Boolean(anchorElFilterCategory)}
        onClose={handleCloseFilterMenuCategory}
        slotProps={{ paper: { sx: { p: 2, width: 600, borderRadius: 2 } } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Box component="span" sx={{ fontWeight: 600 }}>
            Filtres
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={handleCloseFilterMenuCategory} size="small" sx={{ ml: 'auto' }}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 2 }}>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Colonne"
              value={categoryFilterColumn}
              onChange={(e) => {
                const newVal = e.target.value as string;
                setCategoryFilterColumn(newVal);
                if (newVal === 'datePublication') {
                  setCategoryFilterOperator('avant');
                } else if (newVal === 'numberFaq') {
                  setCategoryFilterOperator('inferieur');
                } else {
                  setCategoryFilterOperator('contains');
                }
                setCategoryFilterValue('');
              }}
              SelectProps={{ native: false }}
            >
              {FILTER_CATEGORIE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Opérateur"
              value={categoryFilterOperator}
              onChange={(e) => setCategoryFilterOperator(e.target.value as string)}
              SelectProps={{ native: false }}
            >
              {(categoryFilterColumn === 'numberFaq'
                ? OPERATOR_OPTIONS_NUMBER
                : categoryFilterColumn === 'datePublication'
                ? OPERATOR_OPTIONS_DATE
                : OPERATOR_OPTIONS_COMMON
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            {categoryFilterColumn === 'datePublication' ? (
              <DatePicker
                label="Valeur"
                value={categoryFilterValue ? dayjs(categoryFilterValue, 'DD/MM/YYYY') : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setCategoryFilterValue(newValue.format('DD/MM/YYYY'));
                  } else {
                    setCategoryFilterValue('');
                  }
                }}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    placeholder: 'JJ/MM/AAAA',
                    sx: { '& .MuiOutlinedInput-root': { borderRadius: 1 } },
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faFilter} />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            ) : (
              <TextField
                fullWidth
                label="Valeur"
                size="small"
                value={categoryFilterValue}
                onChange={(e) => setCategoryFilterValue(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={faFilter} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button variant="contained" size="small" onClick={handleApplyCategoryFilters}>
            Appliquer
          </Button>
        </Box>
      </Menu>
      <FaqNewForm open={newForm.value} onClose={newForm.onFalse} />
      <CategoryNewDialog open={newCategory.value} onClose={newCategory.onFalse} />
      {currentCategoryToEdit ? (
        <CategoryModifierDialog
          open
          onClose={() => setCurrentCategoryToEdit(null)}
          currentCategory={currentCategoryToEdit}
        />
      ):(
        <>
        </>
      )}
      {currentFaqToEdit ? (
        <FaqModifierDialog
          open
          onClose={() => setCurrentFaqToEdit(null)}
          currentFaq={currentFaqToEdit}
        />
      ):(
        <>
        </>
      )}
      {currentFaqToAfficher ? (
        <FaqDetailDrawer
          open
          onClose={() => setCurrentFaqToAfficher(null)}
          faq={currentFaqToAfficher}
        />
      ):(
        <>
        </>
      )}
      {currentTab === 'articles' ? (
        <Card>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
              width: '100%',
              mt: 2,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                px: 2.5,
                boxShadow: (theme) =>
                  `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                flex: 1,
              }}
            >
              <Tab label="Articles FAQ" value="articles" />
              <Tab label="Catégories" value="categories" />
            </Tabs>
            <Box sx={{ gap: 2, flexShrink: 0 }}>
              <Button
                size="small"
                variant="outlined"
                endIcon={<FontAwesomeIcon icon={faTable} />}
                onClick={handleOpenColumnsMenu}
                color="primary"
              >
                Colonnes
              </Button>
              <Tooltip title="Filtres" arrow>
                <IconButton
                  onClick={handleOpenFilterMenu}
                  color="primary"
                  size="small"
                  sx={{ width: 50, height: 50, minWidth: 0, padding: 0, borderRadius: '50%' }}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rafraichir" arrow>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={handleRefresh}
                  sx={{ width: 50, height: 50, minWidth: 0, padding: 0, borderRadius: '50%' }}
                >
                  <FontAwesomeIcon icon={faArrowsRotate} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exporter" arrow>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => {}}
                  sx={{ width: 50, height: 50, minWidth: 0, padding: 0, borderRadius: '50%' }}
                >
                  <FontAwesomeIcon icon={faFileExport} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 450, overflow: 'auto', position: 'relative' }}>
            <Table stickyHeader>
              <FaqTableHead
                columns={computedTableHead}
                filters={filters}
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                totalResults={totalRows}
                numSelected={table.selected.length}
                rowCount={totalRows}
                onSelectAllRows={handleSelectAllClick}
              />
              {table.selected.length > 0 ? (
                <TableSelectedAction
                  numSelected={table.selected.length}
                  rowCount={totalRows}
                  onSelectAllRows={handleSelectAllClick}
                  action={
                    <Tooltip title="Supprimer">
                      <IconButton color="primary" onClick={handleDeleteSelected}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                />
              ):(
                <>
                </>
              )}
              <TableBody>
                {tableData.map((row) => (
                  <FaqTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    columns={computedTableHead}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    onEditRow={() =>
                      setCurrentFaqToEdit({
                        id: row.id,
                        title: row.title ?? '',
                        reponse: row.reponse ?? '',
                        categorie: row.categorie ?? '',
                        statut: row.statut ?? '',
                        datePublication: row.datePublication,
                      })
                    }
                    onAfficher={() =>
                      setCurrentFaqToAfficher({
                        id: row.id,
                        title: row.title,
                        reponse: row.reponse ?? '',
                        categorie: row.categorie,
                        statut: row.statut,
                        datePublication: row.datePublication,
                      })
                    }
                  />
                ))}
                {notFound && <TableNoData notFound />}
              </TableBody>
            </Table>
          </TableContainer>
          {totalRows > 5 ? (
            <TablePaginationCustom
              page={table.page}
              count={totalRows}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          ):(
            <>
            </>
          )}
        </Card>
      ):(
        <>
        </>
      )}
      {currentTab === 'categories' ? (
        <Card>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'nowrap',
              width: '100%',
              mt: 2,
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                px: 2.5,
                boxShadow: (theme) =>
                  `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
                flex: 1,
              }}
            >
              <Tab label="Articles FAQ" value="articles" />
              <Tab label="Catégories" value="categories" />
            </Tabs>
            <Box sx={{ gap: 2, flexShrink: 0 }}>
              <Button
                size="small"
                variant="outlined"
                endIcon={<FontAwesomeIcon icon={faTable} />}
                onClick={handleOpenColumnsMenuCategory}
                color="primary"
              >
                Colonnes
              </Button>
              <Tooltip title="Filtres" arrow>
                <IconButton
                  size="small"
                  onClick={handleOpenFilterMenuCategory}
                  color="primary"
                  sx={{ width: 50, height: 50, minWidth: 0, padding: 0, borderRadius: '50%' }}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Rafraichir" arrow>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleRefresh}
                  sx={{ width: 50, height: 50, minWidth: 0, padding: 0, borderRadius: '50%' }}
                >
                  <FontAwesomeIcon icon={faArrowsRotate} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Exporter" arrow>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {}}
                  sx={{ width: 50, height: 50, minWidth: 0, padding: 0, borderRadius: '50%' }}
                >
                  <FontAwesomeIcon icon={faFileExport} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TableContainer sx={{ maxHeight: 450, overflow: 'auto', position: 'relative' }}>
            <Table stickyHeader>
              <CategoryTableHead
                columns={computedCategoryTableHead}
                categoryFilters={categoryFilters}
                order={catTable.order}
                orderBy={catTable.orderBy}
                onSort={catTable.onSort}
                totalResults={catTotalRows}
                numSelected={categoriesSelected.length}
                rowCount={catTotalRows}
                onSelectAllRows={(checked) => handleSelectAllCategories(checked)}
              />
              {categoriesSelected.length > 0 ? (
                <TableSelectedAction
                  numSelected={categoriesSelected.length}
                  rowCount={catTotalRows}
                  onSelectAllRows={(checked) => handleSelectAllCategories(checked)}
                  action={
                    <Tooltip title="Supprimer">
                      <IconButton color="primary" onClick={handleDeleteSelectedCategories}>
                        <FontAwesomeIcon icon={faTrash} />
                      </IconButton>
                    </Tooltip>
                  }
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                />
              ):(
                <>
                </>
              )}
              <TableBody>
                {catTableData.map((cat) => (
                  <CategoryTableRow
                    key={cat.id}
                    row={cat}
                    selected={categoriesSelected.includes(cat.id)}
                    columns={computedCategoryTableHead}
                    onSelectRow={() => handleSelectCategoryRow(cat.id)}
                    onEditRow={() =>
                      setCurrentCategoryToEdit({
                        id: cat.id,
                        title: cat.title,
                        description: cat.description,
                        datePublication: cat.datePublication,
                        numberFaq: cat.numberFaq,
                      })
                    }
                  />
                ))}
                {catTableData.length === 0 && <TableNoData notFound />}
              </TableBody>
            </Table>
          </TableContainer>
          {catTotalRows > 5 ? (
            <TablePaginationCustom
              page={catTable.page}
              count={catTotalRows}
              rowsPerPage={catTable.rowsPerPage}
              onPageChange={catTable.onChangePage}
              onRowsPerPageChange={catTable.onChangeRowsPerPage}
            />
          ):(
            <>
            </>
          )}
        </Card>
      ):(
        <>
        </>
      )}
    </DashboardContent>
  );
}

function compareValue(value: any, filterValue: string, operator: string): boolean {
  if (operator === 'avant' || operator === 'apres' || operator === 'egal') {
    const dateValue = dayjs(value);
    const filterDate = dayjs(filterValue, 'DD/MM/YYYY', true);
    if (!dateValue.isValid() || !filterDate.isValid()) {
      return false;
    }
    if (operator === 'avant') {
      return dateValue.isSameOrBefore(filterDate, 'day');
    }
    if (operator === 'apres') {
      return dateValue.isSameOrAfter(filterDate, 'day');
    }
    if (operator === 'egal') {
      return dateValue.isSame(filterDate, 'day');
    }
  }
  if (operator === 'inferieur' || operator === 'superieur') {
    const numValue = Number(value);
    const numFilter = Number(filterValue);
    if (Number.isNaN(numValue) || Number.isNaN(numFilter)) {
      return false;
    }
    if (operator === 'inferieur') {
      return numValue <= numFilter;
    }
    if (operator === 'superieur') {
      return numValue >= numFilter;
    }
  }
  const valueStr = value.toString().toLowerCase();
  const filterStr = filterValue.toLowerCase();
  switch (operator) {
    case 'contains':
      return valueStr.includes(filterStr);
    case 'equals':
      return valueStr === filterStr;
    case 'starts-with':
      return valueStr.startsWith(filterStr);
    case 'ends-with':
      return valueStr.endsWith(filterStr);
    case 'is-empty':
      return valueStr === '';
    case 'is-not-empty':
      return valueStr !== '';
    case 'is':
      return valueStr === filterStr;
    case 'is-not':
      return valueStr !== filterStr;
    default:
      return false;
  }
}

type ApplyFilterProps = {
  inputData: IFaqItem[];
  filters: IFAQTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters }: ApplyFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (filters.title) {
    data = data.filter((faq) => faq.title.toLowerCase().includes(filters.title.toLowerCase()));
  }
  if (filters.categorie.length) {
    data = data.filter((faq) => filters.categorie.includes(faq.categorie));
  }
  if (filters.statut.length) {
    data = data.filter((faq) => filters.statut.includes(faq.statut));
  }
  if (filters.datePublication) {
    const filterDate = dayjs(filters.datePublication, 'DD/MM/YYYY', true);
    data = data.filter((faq) => {
      const publicationDate = dayjs(faq.datePublication);
      return publicationDate.isValid() && filterDate.isValid() && publicationDate.isSameOrAfter(filterDate, 'day');
    });
  }
  return data;
}

type ApplyCategoryFilterProps = {
  inputData: ICategoryItem[];
  categoryFilters: ICategoryFilters;
  comparator: (a: any, b: any) => number;
};

function applyCategoryFilter({ inputData, comparator, categoryFilters }: ApplyCategoryFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (categoryFilters.title) {
    data = data.filter((cat) =>
      cat.title.toLowerCase().includes(categoryFilters.title.toLowerCase())
    );
  }
  if (categoryFilters.description) {
    data = data.filter((cat) =>
      cat.description.toLowerCase().includes(categoryFilters.description.toLowerCase())
    );
  }
  if (categoryFilters.numberFaq) {
    const numberFaqParam = Number(categoryFilters.numberFaq);
    data = data.filter((cat) => cat.numberFaq >= numberFaqParam);
  }
  if (categoryFilters.datePublication) {
    const filterDate = dayjs(categoryFilters.datePublication, 'DD/MM/YYYY', true);
    data = data.filter((cat) => {
      const catDate = dayjs(cat.datePublication);
      return catDate.isValid() && filterDate.isValid() && catDate.isSameOrAfter(filterDate, 'day');
    });
  }
  return data;
}