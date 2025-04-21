"use client";

import type { Theme } from '@mui/material/styles';
import type { Dispatch, SetStateAction } from 'react';
import type { TableProps } from 'src/shared/components/table';
import type { IAIAssistantItem, IAIAssistantTableFilters, IAIAssistantTableColumns } from 'src/types/ai-assistant';

import { useRouter } from 'next/navigation';
import React, { useRef, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import DialogContentText from '@mui/material/DialogContentText';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import {
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_STATUS_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS,
} from 'src/shared/_mock/_ai-assistant';

import {
  TableNoData,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { AIAssistantTableRow } from './ai-assistant-table-row';
import { AIAssistantTableHead, AIAssistantTableToolbar } from './ai-assistant-table-toolbar';
import { AIAssistantTableFiltersResult } from '../filters/ai-assistant-table-filters-result';

interface TableHeadItem {
  id: string;
  label: string;
  width: string;
  flexGrow?: number;
  minWidth?: number; // Ajout pour éviter l'erreur TypeScript
}

type Props = {
  table: TableProps;
  notFound: boolean;
  dataFiltered: IAIAssistantItem[];
  onDeleteRow: (id: string) => void;
  onEditRow: (id: string) => void;
  onSettingsRow: (id: string) => void;
  filters?: IAIAssistantTableFilters;
  isApprentissgeSelected?: boolean;
  onFilterChange?: (filterName: string, value: any) => void;
  onClearFilters?: () => void;
  selectedRows: string[];
  setSelectedRows: Dispatch<SetStateAction<string[]>>;
  columnsPopoverState?: {
    open: boolean;
    anchorEl: HTMLElement | null;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
  };
  filterPopoverState?: {
    open: boolean;
    anchorEl: HTMLElement | null;
    onOpen: (event: React.MouseEvent<HTMLElement>) => void;
    onClose: () => void;
  };
  hasActiveFilters?: boolean;
  onAddAssistant?: () => void;
  onExportData?: () => void;
};

export function AIAssistantTable({
  table,
  notFound,
  onDeleteRow,
  onEditRow,
  onSettingsRow,
  dataFiltered,
  filters = {} as IAIAssistantTableFilters,
  isApprentissgeSelected = false,
  onFilterChange = () => {},
  onClearFilters = () => {},
  selectedRows,
  setSelectedRows,
  columnsPopoverState,
  filterPopoverState,
  hasActiveFilters = false,
  onAddAssistant = () => {},
  onExportData = () => {},
}: Props) {
  const router = useRouter();
  const handleResetColumnsAndFilters = () => {
    const defaultVisibleColumns = {
      name: true,
      type: true,
      dateAjoute: true,
      educationLevel: true,
      subject: true,
      chapter: true,
      exercise: true,
      status: true,
    };


    setVisibleColumns(defaultVisibleColumns);

    // Réinitialiser tous les filtres de recherche de colonne
    clearAllColumnFilters();

    // Informer le parent du changement
    if (onFilterChange) {
      onFilterChange('visibleColumns', defaultVisibleColumns);
    }
  };

  const [visibleColumns, setVisibleColumns] = useState<IAIAssistantTableColumns>({
    name: true,
    type: true,
    dateAjoute: true,
    educationLevel: true,
    subject: true,
    chapter: true,
    exercise: true,
    status: true,
  });

  const cellStyle = {
    backgroundColor: (theme: Theme) => theme.palette.background.paper,
    color: (theme: Theme) => theme.palette.text.primary,
    borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
    fontWeight: 'normal',
    padding: '12px 16px',
  };

  const TABLE_HEAD: TableHeadItem[] = [
    ...(visibleColumns.name ? [{ id: 'name', label: 'Nom', width: '30%' }] : []),
    ...(visibleColumns.type ? [{ id: 'type', label: 'Type', width: '8%' }] : []),
    ...(visibleColumns.dateAjoute ? [{ id: 'dateAjoute', label: 'Date Ajoutée', width: '9%' }] : []),
    ...(visibleColumns.educationLevel ? [{ id: 'educationLevel', label: "Niveau d'éducation", width: '9%' }] : []),
    ...(visibleColumns.subject ? [{ id: 'subject', label: 'Matière', width: '6%' }] : []),
    ...(visibleColumns.chapter ? [{ id: 'chapter', label: 'Chapitre', width: '10%' }] : []),
    ...(visibleColumns.exercise ? [{ id: 'exercise', label: 'Exercice', width: '10%' }] : []),
    ...(visibleColumns.status ? [{ id: 'status', label: 'Statut', width: '7%' }] : []),
    { id: 'actions', label: 'Actions', width: '11%', flexGrow: 0 }
  ];

  const handleSettings = (id: string) => {
    router.push(`/dashboard/personalization-ai/settings/${id}`);
  };

  const internalFilters = useSetState({
    name: filters.name || '',
    type: filters.type || [],
    dateAjoute: filters.dateAjoute || '',
    status: filters.status || '',
    educationLevel: filters.educationLevel || '',
    subject: filters.subject || '',
    chapter: filters.chapter || '',
    exercise: filters.exercise || '',
    visibleColumns: filters.visibleColumns || visibleColumns,
  });

  const [searchFilters, setSearchFilters] = useState<{ [key: string]: string }>({
    name: '',
    type: '',
    dateAjoute: '',
    educationLevel: '',
    subject: '',
    chapter: '',
    exercise: '',
    status: '',
  });

  const [advancedFilter, setAdvancedFilter] = useState<{
    column: string;
    operator?: string;
    value?: string;
    startDate?: string;
    endDate?: string;
  } | null>(null);

  const handleUpdateAllColumns = (newColumns: IAIAssistantTableColumns) => {
    setVisibleColumns(newColumns);
    if (onFilterChange) {
      onFilterChange('visibleColumns', newColumns);
    }
  };

  const {
    dense,
    page,
    rowsPerPage,
    onChangePage,
    onChangeRowsPerPage,
  } = table;

  const [tableDataFiltered, setTableDataFiltered] = useState(dataFiltered);

  const handleItemValue = (item: IAIAssistantItem, column: string): string => {
    switch (column) {
      case 'name': return item.name?.toString().toLowerCase() || '';
      case 'type': return item.type?.toString().toLowerCase() || '';
      case 'dateAjoute': return item.dateAjoute ? new Date(item.dateAjoute).toISOString().split('T')[0] : '';
      case 'educationLevel': return item.educationLevel?.toString().toLowerCase() || '';
      case 'subject': return item.subject?.toString().toLowerCase() || '';
      case 'chapter': return item.chapter?.toString().toLowerCase() || '';
      case 'exercise': return item.exercise?.toString().toLowerCase() || '';
      case 'status': return item.status?.toString().toLowerCase() || '';
      default: return '';
    }
  };

  const handleSearchChange = (column: string, value: string) => {
    if (column === 'dateAjoute' && value) {
      const formattedValue = new Date(value).toISOString().split('T')[0];
      setSearchFilters((prev) => ({ ...prev, [column]: formattedValue }));
    } else {
      setSearchFilters((prev) => ({ ...prev, [column]: value }));
    }
  };

  const handleColumnVisibilityChange = (column: keyof IAIAssistantTableColumns, visible: boolean) => {
    const newVisibleColumns = {
      ...visibleColumns,
      [column]: visible
    };

    setVisibleColumns(newVisibleColumns);

    if (onFilterChange) {
      onFilterChange('visibleColumns', newVisibleColumns);
    }
  };

  useEffect(() => {
    let filtered = [...dataFiltered];

    Object.entries(searchFilters).forEach(([column, value]) => {
      if (value) {
        const searchValue = value.toLowerCase();
        filtered = filtered.filter(item => {
          const itemValue = handleItemValue(item, column);
          if (column === 'dateAjoute') {
            return itemValue === searchValue;
          }
          return itemValue.includes(searchValue);
        });
      }
    });

    if (advancedFilter) {
      filtered = filtered.filter(item => {
        const itemValue = handleItemValue(item, advancedFilter.column);

        if (advancedFilter.column === 'dateAjoute') {
          const itemDate = new Date(itemValue);
          const startDate = new Date(advancedFilter.startDate!);
          const endDate = new Date(advancedFilter.endDate!);
          return itemDate >= startDate && itemDate <= endDate;
        }

        if (advancedFilter.operator) {
          switch (advancedFilter.operator) {
            case 'equals':
              return itemValue === advancedFilter.value!.toLowerCase();
            case 'notequals':
              return itemValue !== advancedFilter.value!.toLowerCase();
            case 'contains':
              return itemValue.includes(advancedFilter.value!.toLowerCase());
            case 'startswith':
              return itemValue.startsWith(advancedFilter.value!.toLowerCase());
            case 'endswith':
              return itemValue.endsWith(advancedFilter.value!.toLowerCase());
            default:
              return true;
          }
        }
        return true;
      });
    }

    setTableDataFiltered(filtered);
  }, [searchFilters, dataFiltered, advancedFilter]);

  const [, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  useEffect(() => {
    const hasChanged =
      filters.name !== internalFilters.state.name ||
      filters.status !== internalFilters.state.status ||
      filters.educationLevel !== internalFilters.state.educationLevel ||
      filters.subject !== internalFilters.state.subject ||
      filters.chapter !== internalFilters.state.chapter ||
      filters.exercise !== internalFilters.state.exercise ||
      JSON.stringify(filters.type) !== JSON.stringify(internalFilters.state.type) ||
      JSON.stringify(filters.visibleColumns) !== JSON.stringify(internalFilters.state.visibleColumns);

    if (hasChanged) {
      internalFilters.setState({
        name: filters.name || '',
        type: filters.type || [],
        status: filters.status || '',
        educationLevel: filters.educationLevel || '',
        subject: filters.subject || '',
        chapter: filters.chapter || '',
        exercise: filters.exercise || '',
        visibleColumns: filters.visibleColumns || visibleColumns,
      });

      if (filters.visibleColumns) {
        setVisibleColumns(filters.visibleColumns);
      }
    }
  }, [filters, internalFilters, visibleColumns]);

  useEffect(() => {
    if (page) {
      onChangePage(null, 0);
    }
  }, [searchFilters, onChangePage, page]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteDialog = useBoolean();

  const filterOptions = {
    types: AI_ASSISTANT_TYPE_OPTIONS,
    educationLevels: AI_ASSISTANT_EDUCATION_LEVELS,
    subjects: AI_ASSISTANT_SUBJECTS,
    statuses: AI_ASSISTANT_STATUS_OPTIONS,
  };

  const handleFilterChange = (filterName: string, value: any) => {
    if (filterName === 'advancedFilter') {
      setAdvancedFilter(value);
      onFilterChange(filterName, value);
    } else {
      internalFilters.setState({
        [filterName]: value,
      });
      onFilterChange(filterName, value);
    }
  };

  const handleOpenDeleteConfirm = (id: string) => {
    setDeleteId(id);
    deleteDialog.onTrue();
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      onDeleteRow(deleteId);
      deleteDialog.onFalse();
      setDeleteId(null);
    }
  };

  const clearColumnFilter = (column: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [column]: ''
    }));
  };

  const clearAllColumnFilters = () => {
    setSearchFilters({
      name: '',
      type: '',
      dateAjoute: '',
      educationLevel: '',
      subject: '',
      chapter: '',
      exercise: '',
      status: ''
    });
    setAdvancedFilter(null);
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <AIAssistantTableToolbar
        filters={internalFilters}
        options={filterOptions}
        onResetColumns={handleResetColumnsAndFilters}
        onResetPage={() => onChangePage(null, 0)}
        onFilterChange={handleFilterChange}
        onClearFilters={onClearFilters}
        clearAllColumnFilters={clearAllColumnFilters}
        visibleColumns={visibleColumns}
        onUpdateAllColumns={handleUpdateAllColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        columnsPopoverState={columnsPopoverState || {
          open: false,
          anchorEl: null,
          onOpen: () => {},
          onClose: () => {},
        }}
        filterPopoverState={filterPopoverState || {
          open: false,
          anchorEl: null,
          onOpen: () => {},
          onClose: () => {},
        }}
        onAddAssistant={onAddAssistant}
        onExportData={onExportData}
        hasActiveFilters={hasActiveFilters}
      />

      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <AIAssistantTableFiltersResult
          filters={internalFilters.state}
          onFilters={onFilterChange}
          results={tableDataFiltered.length}
          onResetPage={() => onChangePage(null, 0)}
          onResetFilters={onClearFilters}
          options={filterOptions}
        />
      </Box>

      <Box sx={{ position: 'relative', height: '60vh', overflow: 'hidden', border: '1px solid', borderColor: 'divider', borderRadius: 1,
       mt: -5
        // Ajuste cette valeur pour remonter la table
 }}>
        <TableContainer sx={{ overflow: 'visible', width: '100%' }}>
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              tableLayout: 'fixed',
              width: '100%',
            }}
          >
            <AIAssistantTableHead
              TABLE_HEAD={TABLE_HEAD}
              selectedRows={selectedRows}
              assistants={tableDataFiltered}
              setSelectedRows={setSelectedRows}
              cellStyle={cellStyle}
            />

            <TableRow>
              <TableCell padding="checkbox" sx={cellStyle} />

              {visibleColumns.name && (
  <TableCell sx={{ ...cellStyle, minWidth: '220px', flexGrow: 1 }}>
  <TextField
    fullWidth
    size="small"
    value={searchFilters.name}
    onChange={(e) => handleSearchChange('name', e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch}  />
        </InputAdornment>
      ),
      endAdornment: searchFilters.name && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => clearColumnFilter('name')}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
      ),
      sx: {
        '& fieldset': { border: 'none' }
      }
    }}
  />
</TableCell>
)}

{visibleColumns.type && (
  <TableCell sx={cellStyle}>
    <Select
      fullWidth
      size="small"
      value={searchFilters.type}
      onChange={(e) => handleSearchChange('type', e.target.value)}
      onOpen={handleOpen} // Ouvre seulement en cliquant sur le champ
      onClose={handleClose}
      displayEmpty
      renderValue={(selected) =>
        selected ? filterOptions.types.find(s => s.value === selected)?.label : ''
      }
      sx={{
        '& fieldset': { border: 'none' }, // Supprime la bordure
        '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
        '& .MuiSelect-icon': { display: 'none' } // Cache l'icône par défaut
      }}
      startAdornment={(
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch}   />
        </InputAdornment>
      )}
      endAdornment={searchFilters.type && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => clearColumnFilter('type')}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
      )}
    >
      <MenuItem value="">Tous</MenuItem>
      {filterOptions.types.map((type) => (
        <MenuItem key={type.value} value={type.value}>
          {type.label}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
)}
{visibleColumns.dateAjoute && (
  <TableCell sx={cellStyle}>
    <TextField
      fullWidth
      size="small"
      type="date"
      value={searchFilters.dateAjoute || ''}
      onChange={(e) => handleSearchChange('dateAjoute', e.target.value)}
      inputRef={dateInputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon
              icon={faSearch}
              onClick={() => dateInputRef.current?.focus()}
            />
          </InputAdornment>
        ),
        endAdornment: searchFilters.dateAjoute && (
          <InputAdornment position="end">
            <IconButton size="small" onClick={() => clearColumnFilter('dateAjoute')}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </InputAdornment>
        ),
        sx: {
          '& fieldset': { border: 'none' },
          '& input': {
            opacity: 0,
            cursor: 'pointer',
            '&:focus': {
              opacity: 1
            }
          }
        }
      }}
      onClick={() => {
        dateInputRef.current?.focus();
      }}
    />
  </TableCell>
)}
{visibleColumns.educationLevel && (
  <TableCell sx={cellStyle}>
    <Select
      fullWidth
      size="small"
      value={searchFilters.educationLevel}
      onChange={(e) => handleSearchChange('educationLevel', e.target.value)}
      onOpen={handleOpen} // Ouvre seulement en cliquant sur le champ
      onClose={handleClose}
      displayEmpty
      renderValue={(selected) =>
        selected ? filterOptions.educationLevels.find(s => s.value === selected)?.label : ''
      }
      sx={{
        '& fieldset': { border: 'none' }, // Supprime la bordure
        '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
        '& .MuiSelect-icon': { display: 'none' } // Cache l'icône par défaut
      }}
      startAdornment={(
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch} />
        </InputAdornment>
      )}
      endAdornment={searchFilters.educationLevel && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => clearColumnFilter('educationLevel')}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
      )}
    >
      <MenuItem value="">Tous</MenuItem>
      {filterOptions.educationLevels.map((level) => (
        <MenuItem key={level.value} value={level.value}>
          {level.label}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
)}

{visibleColumns.subject && (
<TableCell sx={cellStyle}>
  <TextField
    fullWidth
    size="small"
    value={searchFilters.subject}
    onChange={(e) => handleSearchChange('subject', e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch}/>
        </InputAdornment>
      ),
      endAdornment: searchFilters.subject && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => clearColumnFilter('subject')}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
      ),
      sx: {
        '& fieldset': { border: 'none' }
      }
    }}
  />
</TableCell>
)}

{visibleColumns.chapter && (
<TableCell sx={cellStyle}>
  <TextField
    fullWidth
    size="small"
    value={searchFilters.chapter}
    onChange={(e) => handleSearchChange('chapter', e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch} />
        </InputAdornment>
      ),
      endAdornment: searchFilters.chapter && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => clearColumnFilter('chapter')}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
      ),
      sx: {
        '& fieldset': { border: 'none' }
      }
    }}
  />
</TableCell>
)}

{visibleColumns.exercise && (
<TableCell sx={cellStyle}>
  <TextField
    fullWidth
    size="small"
    value={searchFilters.exercise}
    onChange={(e) => handleSearchChange('exercise', e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch} />
        </InputAdornment>
      ),
      endAdornment: searchFilters.exercise && (
        <InputAdornment position="end">
          <IconButton size="small" onClick={() => clearColumnFilter('exercise')}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
      ),
      sx: {
        '& fieldset': { border: 'none' }
      }
    }}
  />
</TableCell>
)}
{visibleColumns.status && (
  <TableCell sx={cellStyle}>
    <Select
      fullWidth
      size="small"
      value={searchFilters.status}
      onChange={(e) => handleSearchChange('status', e.target.value)}
      onOpen={handleOpen} // Ouvre seulement en cliquant sur le champ
      onClose={handleClose}
      displayEmpty
      renderValue={(selected) =>
        selected ? filterOptions.statuses.find(s => s.value === selected)?.label : ''
      }
      sx={{
        '& fieldset': { border: 'none' }, // Supprime la bordure
        '& .MuiSelect-select': { display: 'flex', alignItems: 'center' },
        '& .MuiSelect-icon': { display: 'none' } // Cache l'icône par défaut
      }}
      startAdornment={(
        <InputAdornment position="start">
          <FontAwesomeIcon icon={faSearch} />
        </InputAdornment>
      )}
    >
      <MenuItem value="">Tous</MenuItem>
      {filterOptions.statuses.map((status) => (
        <MenuItem key={status.value} value={status.value}>
          {status.label}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
)}

              <TableCell sx={cellStyle} />
            </TableRow>
          </Table>
        </TableContainer>
        <TableContainer
          sx={{
            position: 'relative',
            height: 'calc(100% - 90px)',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              tableLayout: 'fixed',
              position: 'relative',
              width: '100%',
            }}
          >
            <AIAssistantTableHead
              TABLE_HEAD={TABLE_HEAD}
              selectedRows={selectedRows}
              assistants={tableDataFiltered}
              setSelectedRows={setSelectedRows}
              cellStyle={cellStyle}
              sx={{ visibility: 'collapse', height: 0, padding: 0 }}
            />

            <TableBody>
              {notFound ? (
                <TableNoData notFound={notFound} />
              ) : (
                <>
                  {tableDataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <AIAssistantTableRow
                        key={row.id}
                        row={row}
                        selected={selectedRows.includes(row.id)}
                        onSelectRow={() => handleSelectRow(row.id)}
                        onDeleteRow={() => onDeleteRow(row.id)}
                        onEditRow={() => onEditRow(row.id)}
                        onSettingsRow={() => handleSettings(row.id)}
                        onOpenDeleteConfirm={() => handleOpenDeleteConfirm(row.id)}
                        visibleColumns={visibleColumns}
                        cellStyle={cellStyle}
                      />
                    ))}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TablePaginationCustom
        count={tableDataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        dense={dense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />

      <Dialog
        open={deleteDialog.value}
        onClose={deleteDialog.onFalse}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Supprimer l&apos;assistant
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer cet assistant IA ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteDialog.onFalse} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
