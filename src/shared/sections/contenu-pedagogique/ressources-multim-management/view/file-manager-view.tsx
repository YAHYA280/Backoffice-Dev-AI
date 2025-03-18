'use client';

import type { MouseEvent } from 'react';
import type { SelectChangeEvent } from '@mui/material';
import type { IFile, IFileFilters, IFolderManager } from 'src/contexts/types/file';

import { useState, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTimes,
  faTrash,
  faTable,
  faFilter,
  faTableList,
  faGripVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';
import {
  Box,
  Menu,
  Stack,
  Button,
  Select,
  Divider,
  Tooltip,
  MenuItem,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  FormControl,
  ListItemText,
  ToggleButton,
  InputAdornment,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { _allFiles } from 'src/shared/_mock';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { toast } from 'src/shared/components/snackbar';
import { fileFormat } from 'src/shared/components/file-thumbnail';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import {
  useTable,
  rowInPage,
  TableNoData,
  getComparator,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { FileManagerGridView } from '../components/file-manager-grid-view';
import { FileManagerTableRow } from '../components/file-manager-table-row';
import { TableFileHeadCustom } from '../components/file-table-head-custom';
import { FileManagerNewFolderDialog } from '../components/file-manager-new-folder-dialog';

export const FILE_TYPE_OPTIONS = [
  'txt',
  'zip',
  'audio',
  'image',
  'video',
  'word',
  'excel',
  'powerpoint',
  'pdf',
];

function compareValue(fileValue: any, filterValue: string, operator: string): boolean {
  const fileStr = fileValue.toString().toLowerCase();
  const filterStr = filterValue.toLowerCase();
  switch (operator) {
    case 'contains':
      return fileStr.includes(filterStr);
    case 'equals':
      return fileStr === filterStr;
    case 'starts-with':
      return fileStr.startsWith(filterStr);
    case 'ends-with':
      return fileStr.endsWith(filterStr);
    case 'is-empty':
      return fileStr === '';
    case 'is-not-empty':
      return fileStr !== '';
    case 'is':
      return fileStr === filterStr;
    case 'is-not':
      return fileStr !== filterStr;
    default:
      return false;
  }
}

const COLUMN_OPTIONS = [
  { value: 'name', label: 'Nom' },
  { value: 'size', label: 'Taille' },
  { value: 'type', label: 'Type' },
  { value: 'createdAt', label: 'Créé le' },
  { value: 'modifiedAt', label: 'Modifié le' },
];

const OPERATOR_OPTIONS_TYPE = [
  { value: 'is', label: 'est' },
  { value: 'is-not', label: "n'est pas" },
];

const OPERATOR_OPTIONS_COMMON = [
  { value: 'contains', label: 'contient' },
  { value: 'equals', label: 'égal à' },
  { value: 'starts-with', label: 'commence par' },
  { value: 'ends-with', label: 'se termine par' },
  { value: 'is-empty', label: 'est vide' },
  { value: 'is-not-empty', label: "n'est pas vide" },
  { value: 'is-any-of', label: "est l'un de" },
];

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IFile[];
  filters: IFileFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { name, type, startDate, endDate } = filters;
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  inputData = stabilizedThis.map((el) => el[0]);
  if (name) {
    inputData = inputData.filter((file) =>
      file.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (type.length) {
    inputData = inputData.filter((file) => type.includes(fileFormat(file.type)));
  }
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((file) => fIsBetween(file.createdAt, startDate, endDate));
  }
  return inputData;
}

type FileManagerTableProps = {
  table: ReturnType<typeof useTable>;
  notFound: boolean;
  dataFiltered: IFile[];
  onOpenConfirm: () => void;
  onDeleteRow: (id: string) => void;
  columns?: string[];
  onSearchColumnChange?: (columnId: string, value: string | Date | null) => void;
  searchValues?: {
    name: string;
    type: string;
    size?: string;
    createdAt?: Date | null;
    modifiedAt?: Date | null;
  };
};

const defaultFolder: IFolderManager = {
  id: 'default-folder-id',
  name: 'Default Folder',
  size: 0,
  type: '',
  url: '',
  tags: [],
  isFavorited: false,
  shared: null,
  createdAt: null,
  modifiedAt: null,
};


function FileManagerTable({
  table,
  notFound,
  onDeleteRow,
  dataFiltered,
  onOpenConfirm,
  columns,
  onSearchColumnChange,
  searchValues,
}: FileManagerTableProps) {
  const theme = useTheme();
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = table;
  const TABLE_HEAD = [
    { id: 'name', label: 'Nom' },
    { id: 'size', label: 'Taille', width: 120 },
    { id: 'type', label: 'Type', width: 120 },
    { id: 'createdAt', label: 'Créé le', width: 140 },
    { id: 'modifiedAt', label: 'Modifié le', width: 140 },
    { id: 'actions', label: '', width: 88 },
  ];
  const filteredTableHead = columns
    ? TABLE_HEAD.filter((col) => columns.includes(col.id))
    : TABLE_HEAD;
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          m: { md: theme.spacing(-2, -3, 0, -3) },
        }}
      >
        <TableSelectedAction
          numSelected={selected.length}
          rowCount={dataFiltered.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(checked, dataFiltered.map((row) => row.id))
          }
          action={
            <Tooltip title="Supprimer">
              <IconButton color="primary" onClick={onOpenConfirm}>
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Tooltip>
          }
          sx={{
            pl: 1,
            pr: 2,
            top: 16,
            left: 24,
            zIndex: theme.zIndex.appBar + 1,
            right: 24,
            width: 'auto',
            borderRadius: 2.5,
          }}
        />
        <TableContainer
          sx={{
            px: { md: 3 },
            maxHeight: 600,
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableFileHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={filteredTableHead}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(checked, dataFiltered.map((row) => row.id))
              }
              onSearchColumnChange={onSearchColumnChange}
              searchValues={searchValues}
              sx={{
                position: 'sticky',
                top: 0,
                backgroundColor: theme.palette.background.paper,
                zIndex: theme.zIndex.appBar,
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />
            <TableBody>
              {notFound ? (
                <TableNoData notFound />
              ) : (
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <FileManagerTableRow
                      key={row.id}
                      row={row}
                      folder={defaultFolder}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => onDeleteRow(row.id)}
                      columns={filteredTableHead}
                    />
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePaginationCustom
        page={page}
        rowsPerPage={rowsPerPage}
        count={dataFiltered.length}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </>
  );
}

export function FileManagerView() {
  const table = useTable({ defaultRowsPerPage: 10 });
  const [tableData, setTableData] = useState<IFile[]>(_allFiles);
  const confirm = useBoolean();
  const upload = useBoolean();
  const [view, setView] = useState('list');
  const defaultColumns = [
    { id: 'name', label: 'Nom' },
    { id: 'size', label: 'Taille' },
    { id: 'type', label: 'Type' },
    { id: 'createdAt', label: 'Créé le' },
    { id: 'modifiedAt', label: 'Modifié le' },
    { id: 'actions', label: 'Actions' },
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultColumns.map((col) => col.id));
  const [anchorElColumns, setAnchorElColumns] = useState<null | HTMLElement>(null);
  const [columnSearch, setColumnSearch] = useState('');
  const defaultColumnIds = defaultColumns.map((col) => col.id);
  const allColumnsSelected =
    visibleColumns.length === defaultColumnIds.length &&
    defaultColumnIds.every((id) => visibleColumns.includes(id));
  const handleOpenColumnsMenu = (event: MouseEvent<HTMLButtonElement>) => {
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
  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setVisibleColumns(defaultColumns.map((col) => col.id));
    } else {
      setVisibleColumns(['name']);
    }
  };
  const handleResetColumns = () => {
    setVisibleColumns(defaultColumns.map((col) => col.id));
    setColumnSearch('');
  };
  const filteredColumns = defaultColumns.filter((col) =>
    col.label.toLowerCase().includes(columnSearch.toLowerCase())
  );
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [filterColumn, setFilterColumn] = useState('name');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const [customFilter, setCustomFilter] = useState({
    column: 'name',
    operator: 'contains',
    value: '',
  });
  const handleOpenFilterMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilter(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setAnchorElFilter(null);
  };
  const handleChangeFilterColumn = (event: SelectChangeEvent) => {
    const newCol = event.target.value as string;
    setFilterColumn(newCol);
    if (newCol === 'type') {
      setFilterOperator('is');
    } else {
      setFilterOperator('contains');
    }
  };
  const handleChangeFilterOperator = (event: SelectChangeEvent) => {
    setFilterOperator(event.target.value as string);
  };
  const handleApplyFilter = () => {
    setCustomFilter({ column: filterColumn, operator: filterOperator, value: filterValue });
    setAnchorElFilter(null);
  };
  const filters = useSetState<IFileFilters>({
    name: '',
    type: [],
    startDate: null,
    endDate: null,
  });
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  let dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
    dateError,
  });
  if (customFilter.value) {
    dataFiltered = dataFiltered.filter((file) => {
      const fileValue = (file as any)[customFilter.column];
      if (fileValue === undefined || fileValue === null) return false;
      return compareValue(fileValue, customFilter.value, customFilter.operator);
    });
  }
  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);
  const notFound = dataFiltered.length === 0;
  const handleChangeView = useCallback(
    (event: MouseEvent<HTMLElement>, newView: string | null) => {
      if (newView !== null) {
        setView(newView);
      }
    },
    []
  );
  const handleDeleteItem = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      toast.success('Suppression réussie !');
      setTableData(deleteRow);
      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );
  const handleDeleteItems = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    toast.success('Suppression réussie !');
    setTableData(deleteRows);
    table.onUpdatePageDeleteRows({
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);
  return (
    <DashboardContent>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <CustomBreadcrumbs
            heading="Gestion des ressources"
            links={[
              { name: 'Tableau de bord', href: paths.dashboard.root },
              {
                name: 'Contenu pédagogique',
                href: paths.dashboard.contenu_pedagogique.ressourcesMultimedia,
              },
              { name: 'Ressources multimedias' },
            ]}
            sx={{ flex: 1 }}
          />
        </Box>
        <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
          <CustomBreadcrumbs
            heading="Gestion des ressources"
            links={[
              { name: 'Tableau de bord', href: paths.dashboard.root },
              { name: 'Contenu pédagogique', href: paths.dashboard.user.root },
              { name: 'Ressources multimédias' },
            ]}
            sx={{ mb: 2 }}
          />
        </Box>
      </Box>
      <Stack spacing={2.5} sx={{ my: { xs: 1, md: 2 } }}>
        <Stack
          spacing={2}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
          justifyContent="flex-end"
        >
          <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
              onClick={upload.onTrue}
            >
              Ajouter une ressource
            </Button>
            <Button
              variant="outlined"
              endIcon={<FontAwesomeIcon icon={faTable} />}
              onClick={handleOpenColumnsMenu}
            >
              Colonnes
            </Button>
            <Tooltip title="Filtres">
              <Button
                variant="outlined"
                onClick={handleOpenFilterMenu}
                aria-label="Filtres"
                sx={{
                  width: 40,
                  height: 40,
                  minWidth: 0,
                  padding: 0,
                  borderRadius: '50%',
                }}
              >
                <FontAwesomeIcon icon={faFilter} />
              </Button>
            </Tooltip>
          </Box>
          <ToggleButtonGroup value={view} exclusive onChange={handleChangeView}>
            <ToggleButton value="list">
              <FontAwesomeIcon icon={faTableList} />
            </ToggleButton>
            <ToggleButton value="grid">
              <FontAwesomeIcon icon={faGripVertical} />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Stack>
      <Menu
        anchorEl={anchorElColumns}
        open={Boolean(anchorElColumns)}
        onClose={handleCloseColumnsMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { p: 1.5, width: 300 } }}
      >
        <Box sx={{ mb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Recherche"
            value={columnSearch}
            onChange={(e) => setColumnSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: 14 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <AnimatePresence>
          {filteredColumns.map((col) => {
            const isNameColumn = col.id === 'name';
            const isChecked = visibleColumns.includes(col.id);
            return (
              <m.div
                key={col.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <MenuItem
                  disabled={isNameColumn}
                  onClick={() => {
                    if (!isNameColumn) handleToggleColumn(col.id);
                  }}
                  sx={{ px: 1, py: 0.5 }}
                >
                  <Checkbox checked={isChecked} disabled={isNameColumn} sx={{ mr: 1 }} />
                  <ListItemText primary={col.label} />
                </MenuItem>
              </m.div>
            );
          })}
        </AnimatePresence>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
          <FormControlLabel
            label="Afficher/Masquer tout"
            control={
              <Checkbox
                checked={visibleColumns.length === defaultColumns.length}
                onChange={(e) => handleToggleAll(e.target.checked)}
              />
            }
            sx={{ mr: 1 }}
          />
          <Button
            size="small"
            onClick={handleResetColumns}
            disabled={allColumnsSelected}
            sx={{ textTransform: 'none' }}
          >
            Réinitialiser
          </Button>
        </Box>
      </Menu>
      <Menu
        anchorEl={anchorElFilter}
        open={Boolean(anchorElFilter)}
        onClose={handleCloseFilterMenu}
        PaperProps={{
          sx: {
            p: 1.5,
            width: 600,
            borderRadius: 2,
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={handleCloseFilterMenu} size="small" sx={{ ml: 'auto' }}>
            <FontAwesomeIcon icon={faTimes} style={{ fontSize: 14 }} />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="caption" sx={{ mb: 0.25, color: 'text.secondary' }}>
              Colonnes
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={filterColumn}
                onChange={handleChangeFilterColumn}
                renderValue={(selected) => {
                  if (!selected) return 'Colonnes';
                  const item = COLUMN_OPTIONS.find((option) => option.value === selected);
                  return item ? item.label : selected;
                }}
                sx={{ borderRadius: 1 }}
              >
                {COLUMN_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
              Opérateur
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={filterOperator}
                onChange={handleChangeFilterOperator}
                renderValue={(selected) => {
                  if (!selected) return 'Opérateur';
                  const operators =
                    filterColumn === 'type' ? OPERATOR_OPTIONS_TYPE : OPERATOR_OPTIONS_COMMON;
                  const item = operators.find((option) => option.value === selected);
                  return item ? item.label : selected;
                }}
                sx={{ borderRadius: 1 }}
              >
                {filterColumn === 'type'
                  ? OPERATOR_OPTIONS_TYPE.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))
                  : OPERATOR_OPTIONS_COMMON.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 2 }}>
            <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary' }}>
              Valeur
            </Typography>
            {filterColumn === 'type' ? (
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  renderValue={(selected) => selected || ''}
                  sx={{ borderRadius: 1 }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 200,
                      },
                    },
                  }}
                >
                  <MenuItem
                    disabled
                    sx={{
                      bgcolor: '#1976d2',
                      height: '36px',
                      opacity: 1,
                      p: 0,
                      '&.Mui-disabled': {
                        opacity: 1,
                      },
                    }}
                  />
                  <MenuItem value="txt">txt</MenuItem>
                  <MenuItem value="zip">zip</MenuItem>
                  <MenuItem value="audio">audio</MenuItem>
                  <MenuItem value="image">image</MenuItem>
                  <MenuItem value="video">video</MenuItem>
                  <MenuItem value="word">word</MenuItem>
                  <MenuItem value="excel">excel</MenuItem>
                  <MenuItem value="powerpoint">powerpoint</MenuItem>
                  <MenuItem value="pdf">pdf</MenuItem>
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                placeholder="Valeur du filtre"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
              />
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleApplyFilter}
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              bgcolor: '#1A2536',
              '&:hover': { bgcolor: '#111927' },
            }}
          >
            Appliquer
          </Button>
        </Box>
      </Menu>
      {view === 'list' ? (
        <FileManagerTable
          table={table}
          dataFiltered={dataFiltered}
          notFound={notFound}
          onOpenConfirm={confirm.onTrue}
          onDeleteRow={handleDeleteItem}
          columns={visibleColumns}
          searchValues={{
            name: filters.state.name,
            type: filters.state.type.length ? filters.state.type[0] : '',
            size: '',
            createdAt: null,
            modifiedAt: null,
          }}
          onSearchColumnChange={(columnId, value) => {
            if (columnId === 'name') {
              filters.setState({ name: value as string });
            } else if (columnId === 'type') {
              if (value) {
                filters.setState({ type: [value as string] });
              } else {
                filters.setState({ type: [] });
              }
            }
          }}
        />
      ) : (
        <FileManagerGridView
          table={table}
          dataFiltered={dataFiltered}
          onDeleteItem={handleDeleteItem}
          onOpenConfirm={confirm.onTrue}
        />
      )}
      <FileManagerNewFolderDialog open={upload.value} onClose={upload.onFalse} />
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer <strong>{table.selected.length}</strong> éléments ?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteItems();
              confirm.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </DashboardContent>
  );
}