'use client';

import type { AuditEvent, IAuditFilters } from 'src/contexts/types/audit';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  faTimes,
  faFilter,
  faColumns,
  faSyncAlt,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Card,
  List,
  Menu,
  Stack,
  Table,
  Button,
  Divider,
  Tooltip,
  Checkbox,
  ListItem,
  MenuItem,
  TableBody,
  TextField,
  IconButton,
  FormControl,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { useSetState } from 'src/hooks';
import { mockAuditEvents } from 'src/shared/_mock/_audit';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import {
  useTable,
  TableNoData,
  getComparator,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { AuditTableRow } from './components/audit-table-row';
import { TableHeadWithFilters } from './components/table-head-with-filters';

// ----------------------------------------------------------------------

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const AUDIT_ACTION_OPTIONS = [
  { value: 'CREATE', label: 'Création' },
  { value: 'UPDATE', label: 'Mise à jour' },
  { value: 'DELETE', label: 'Suppression' },
  { value: 'EXPORT', label: 'Exportation' },
];

const AUDIT_ENTITY_OPTIONS = [
  { value: 'USER', label: 'Utilisateur' },
  { value: 'MATIERE', label: 'Matière' },
  { value: 'CHAPITRE', label: 'Chapitre' },
  { value: 'NIVEAU', label: 'Niveau' },
  { value: 'PAYMENT', label: 'Paiement' },
];

const FILTER_COLUMN_OPTIONS = [
  { value: 'userName', label: 'Utilisateur' },
  { value: 'actionType', label: 'Action' },
  { value: 'entityType', label: 'Entité' },
  { value: 'entityId', label: 'ID Entité' },
  { value: 'timestamp', label: 'Date' },
];

const OPERATOR_OPTIONS_COMMON = [
  { value: 'contains', label: 'contient' },
  { value: 'equals', label: 'égal à' },
  { value: 'starts-with', label: 'commence par' },
  { value: 'ends-with', label: 'se termine par' },
  { value: 'is-empty', label: 'est vide' },
  { value: 'is-not-empty', label: "n'est pas vide" },
];

const OPERATOR_OPTIONS_TYPE = [
  { value: 'is', label: 'est' },
  { value: 'is-not', label: "n'est pas" },
];

const OPERATOR_OPTIONS_DATE = [
  { value: 'avant', label: 'avant' },
  { value: 'egal', label: 'égal à' },
  { value: 'apres', label: 'après' },
];

const TABLE_HEAD = [
  { id: '', label: '', width: 50, isFilterable: false },
  { id: 'timestamp', label: 'Date et heure', width: 120, isFilterable: false },
  {
    id: 'userName',
    label: 'Utilisateur',
    width: 140,
    isFilterable: true,
  },
  { id: 'actionType', label: 'Action', width: 100, isFilterable: true },
  { id: 'entityType', label: 'Entité', width: 130, isFilterable: true },
  { id: 'entityId', label: 'ID Entité', width: 130, isFilterable: true },
  {
    id: 'details',
    label: 'Détails',
    width: 70,
    sx: { textAlign: 'center' },
    isFilterable: false,
  },
];

type Props = {
  title?: string;
};

export function AuditPage({ title = "Journal d'audit" }: Props) {
  const theme = useTheme();
  const table = useTable();
  const popover = usePopover();
  const [tableData, setTableData] = useState<AuditEvent[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<AuditEvent[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(TABLE_HEAD);
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [filterColumn, setFilterColumn] = useState('userName');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const [customFilter, setCustomFilter] = useState({
    column: 'userName',
    operator: 'contains',
    value: '',
  });
  const filters = useSetState<IAuditFilters>({
    userName: '',
    actionType: '',
    entityType: '',
    entityId: '',
    startDate: null,
    endDate: null,
  });
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  const notFound = tableData.length === 0;
  const handleColumnFilter = useCallback(
    (columnId: string, value: string) => {
      setColumnFilters((prev) => ({
        ...prev,
        [columnId]: value,
      }));
      table.onResetPage();
    },
    [table]
  );
  // Détermine les colonnes à afficher en fonction du filtre de statut et des colonnes visibles
  const visibleTableHead = useMemo(
    () =>
      TABLE_HEAD.filter((column) => {
        if (!column.isFilterable) {
          return true;
        }
        // Pour les colonnes filtrables, vérifier si elles sont dans visibleColumns
        const isVisible = visibleColumns.some((col) => col.id === column.id);

        return isVisible;
      }),
    [visibleColumns]
  );
  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilter(event.currentTarget);
  };
  const handleCloseFilterMenu = () => {
    setAnchorElFilter(null);
  };
  const handleApplyFilters = () => {
    setCustomFilter({
      column: filterColumn,
      operator: filterOperator,
      value: filterValue,
    });
    handleCloseFilterMenu();
  };
  const handleChangeFilterColumn = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newCol = event.target.value as string;
    setFilterColumn(newCol);
    if (newCol === 'actionType' || newCol === 'entityType') {
      setFilterOperator('is');
    } else if (newCol === 'timestamp') {
      setFilterOperator('avant');
    } else {
      setFilterOperator('contains');
    }
    setFilterValue('');
  };
  const handleChangeFilterOperator = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterOperator(event.target.value as string);
  };
  const handleExportCSV = () => {
    try {
      // Détermine les données à exporter: soit les lignes sélectionnées, soit toutes les données filtrées
      const dataToExport =
        table.selected.length > 0
          ? baseFilteredData.filter((row) => table.selected.includes(row.id))
          : baseFilteredData;

      // Définit les en-têtes en fonction des colonnes visibles
      const headers = visibleColumns
        .filter((col) => col.id !== '') // Exclure la colonne de checkbox
        .map((col) => col.label);

      // Prépare les données au format CSV
      const csvContent = [
        headers.join(','), // Ligne d'en-tête
        ...dataToExport.map((row) =>
          visibleColumns
            .filter((col) => col.id !== '') // Exclure la colonne de checkbox
            .map((col) => {
              const value = row[col.id as keyof AuditEvent];

              if (col.id === 'timestamp' && (typeof value === 'string' || value instanceof Date)) {
                return `"${dayjs(value).format('DD/MM/YYYY HH:mm:ss')}"`;
              }

              // Échapper les valeurs avec des virgules
              return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
            })
            .join(',')
        ),
      ].join('\n');

      // Crée un blob et un lien de téléchargement
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `audit-log-${dayjs().format('YYYY-MM-DD')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      // Ici, vous pourriez ajouter une notification d'erreur pour l'utilisateur
    }
  };

  const handleToggleColumn = (
    column:
      | { id: string; label: string; width: number; isFilterable: boolean; sx?: undefined }
      | {
          id: string;
          label: string;
          width: number;
          sx: { textAlign: string };
          isFilterable: boolean;
        }
  ) => {
    if (column.isFilterable === false) return;
    setVisibleColumns((prev) => {
      const columnExists = prev.some((col) => col.id === column.id);
      if (columnExists) {
        return prev.filter((col) => col.id !== column.id);
      }
      return [...prev, column];
    });
  };
  const toggleSelectAll = () => {
    const filterableColumns = TABLE_HEAD.filter(
      (col) => col.isFilterable !== false && col.id !== ''
    );

    const allFilterableVisible = filterableColumns.every((col) =>
      visibleColumns.some((visCol) => visCol.id === col.id)
    );

    if (allFilterableVisible) {
      setVisibleColumns(TABLE_HEAD.filter((col) => col.isFilterable === false));
    } else {
      setVisibleColumns(TABLE_HEAD);
    }
  };
  const handleReset = () => {
    setVisibleColumns(TABLE_HEAD);
    setSearch('');
  };
  const handleResetAll = () => {
    setFilterColumn('userName');
    setFilterOperator('contains');
    setFilterValue('');
    setCustomFilter({ column: 'userName', operator: 'contains', value: '' });

    filters.setState({
      userName: '',
      actionType: '',
      entityType: '',
      entityId: '',
      startDate: null,
      endDate: null,
    });

    // Réinitialisez également les filtres de colonnes et la recherche
    setColumnFilters({});
    setSearch('');
    // Réinitialisez la pagination
    table.onResetPage();
  };

  const canReset = useMemo(() => {
    // Vérifie si des filtres standards sont appliqués
    const hasStandardFilters =
      filters.state.userName !== '' ||
      filters.state.actionType !== '' ||
      (filters.state.startDate !== null && filters.state.startDate !== undefined) ||
      (filters.state.endDate !== null && filters.state.endDate !== undefined) ||
      filters.state.entityType !== '' ||
      filters.state.entityId !== '';

    // Vérifie si des filtres de colonnes sont appliqués
    const hasColumnFilters = Object.values(columnFilters).some((value) => value !== '');

    // Vérifie si un filtre personnalisé est appliqué
    const hasCustomFilter = customFilter.value !== '';

    // Vérifie si une recherche globale est appliquée
    const hasSearch = search !== '';

    return hasStandardFilters || hasColumnFilters || hasCustomFilter || hasSearch;
  }, [filters.state, columnFilters, customFilter, search]);

  const applyDateFilters = useCallback(
    (data: AuditEvent[]) => {
      if (!filters.state.startDate && !filters.state.endDate) {
        return data;
      }

      return data.filter((audit) => {
        const auditDate = dayjs(audit.timestamp);
        const isAfterStartDate =
          !filters.state.startDate ||
          auditDate.isAfter(filters.state.startDate, 'day') ||
          auditDate.isSame(filters.state.startDate, 'day');
        const isBeforeEndDate =
          !filters.state.endDate ||
          auditDate.isBefore(filters.state.endDate, 'day') ||
          auditDate.isSame(filters.state.endDate, 'day');

        return isAfterStartDate && isBeforeEndDate;
      });
    },
    [filters.state.startDate, filters.state.endDate]
  );

  useEffect(() => {
    let baseFiltered = applyFilter({
      inputData: mockAuditEvents,
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters.state },
      dateError,
    });
    if (customFilter.value) {
      baseFiltered = baseFiltered.filter((user) => {
        console.log(`1 hello ${customFilter?.value ?? ''}`);

        const userValue = (user as any)[customFilter.column];
        console.log(`hello ${userValue} and ${customFilter?.value ?? ''}`);

        if (userValue == null) return false;
        return compareValue(userValue, customFilter.value, customFilter.operator);
      });
    }

    setBaseFilteredData(baseFiltered);

    const finalFiltered = applyDateFilters(baseFiltered);

    setTotalRows(finalFiltered.length);
    const start = table.page * table.rowsPerPage;
    const end = start + table.rowsPerPage;
    setTableData(finalFiltered.slice(start, end));
  }, [
    filters.state,
    table.order,
    table.orderBy,
    dateError,
    table.page,
    table.rowsPerPage,
    applyDateFilters,
    customFilter,
  ]);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Journal d'audit"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Audits', href: paths.dashboard.audit },
          { name: "Journal d'audit" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Box maxWidth="xl">
        <Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              px: 2,
              py: 1.5,
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end" width="100%">
              <Button
                variant="outlined"
                color="primary"
                onClick={popover.onOpen}
                startIcon={<FontAwesomeIcon icon={faColumns} />}
                sx={{
                  minWidth: 100,
                  borderRadius: 1,
                  transition: theme.transitions.create(['background-color']),
                  ...(popover.open && {
                    bgcolor: 'primary.lighter',
                  }),
                }}
              >
                Colonnes
              </Button>
              <Tooltip
                title="Filtres"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      fontSize: 14,
                      borderRadius: 1,
                      boxShadow: 3,
                      padding: '6px 12px',
                    },
                  },
                  arrow: {
                    sx: {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  color="primary"
                  onClick={handleOpenFilterMenu}
                  aria-label="Filtres"
                  sx={{
                    width: 50,
                    height: 50,
                    minWidth: 0,
                    padding: 0,
                    borderRadius: '50%',
                  }}
                >
                  <FontAwesomeIcon icon={faFilter} />
                </IconButton>
              </Tooltip>
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
                      {(filterColumn === 'actionType' || filterColumn === 'entityType'
                        ? OPERATOR_OPTIONS_TYPE
                        : filterColumn === 'timestamp'
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
                    {filterColumn === 'entityType' ? (
                      <TextField
                        select
                        label="Valeur"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        SelectProps={{ native: false }}
                      >
                        <MenuItem value="">Tous</MenuItem>
                        {AUDIT_ENTITY_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : filterColumn === 'actionType' ? (
                      <TextField
                        select
                        label="Valeur"
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                        SelectProps={{ native: false }}
                      >
                        <MenuItem value="">Tous</MenuItem>
                        {AUDIT_ACTION_OPTIONS.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    ) : filterColumn === 'timestamp' ? (
                      <DatePicker
                        label="Valeur"
                        value={filterValue ? dayjs(filterValue, 'DD/MM/YYYY') : null}
                        onChange={(newValue) => {
                          if (newValue) {
                            const formattedDate = dayjs(newValue).format('DD/MM/YYYY');
                            setFilterValue(formattedDate);
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
                    ) : (
                      <TextField
                        fullWidth
                        label="Valeur"
                        size="small"
                        placeholder={filterColumn.includes('At') ? 'JJ/MM/AAAA' : ''}
                        value={filterValue}
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
              <CustomPopover
                open={popover.open}
                anchorEl={popover.anchorEl}
                onClose={popover.onClose}
                slotProps={{ arrow: { placement: 'right-top' } }}
              >
                <Box sx={{ p: 2, width: 250 }}>
                  {/* Barre de recherche */}
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Rechercher une colonne"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2 }}
                  />

                  {/* Liste des colonnes avec Checkboxes */}
                  <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {TABLE_HEAD.filter(
                      (column) =>
                        column.label.toLowerCase().includes(search.toLowerCase()) &&
                        column.id !== 'actions'
                    ).map(
                      (column) =>
                        column.id !== '' && (
                          <ListItem key={column.id} disablePadding>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={visibleColumns.some((col) => col.id === column.id)}
                                  onChange={() => handleToggleColumn(column)}
                                  disabled={column.isFilterable === false}
                                />
                              }
                              label={column.label || column.id}
                              sx={{ width: '100%' }}
                            />
                          </ListItem>
                        )
                    )}
                  </List>

                  <Divider sx={{ my: 1 }} />

                  {/* Sélectionner tout et Reset */}
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            visibleColumns.filter(
                              (col) => col.isFilterable !== false && col.id !== ''
                            ).length ===
                            TABLE_HEAD.filter((col) => col.isFilterable !== false && col.id !== '')
                              .length
                          }
                          onChange={toggleSelectAll}
                          indeterminate={
                            visibleColumns.filter(
                              (col) => col.isFilterable !== false && col.id !== ''
                            ).length > 0 &&
                            visibleColumns.filter(
                              (col) => col.isFilterable !== false && col.id !== ''
                            ).length <
                              TABLE_HEAD.filter(
                                (col) => col.isFilterable !== false && col.id !== ''
                              ).length
                          }
                        />
                      }
                      label="Tout"
                    />
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleReset}
                      sx={{ color: theme.vars.palette.primary.main }}
                    >
                      Réinitialiser
                    </Button>
                  </Box>
                </Box>
              </CustomPopover>

              <Tooltip title="Réinitialiser" arrow>
                <IconButton
                  color="primary"
                  onClick={handleResetAll}
                  sx={{
                    p: 1,
                    position: 'relative', // Add positioning for the indicator
                    transition: theme.transitions.create(['transform', 'box-shadow']),
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <FontAwesomeIcon icon={faSyncAlt} />
                  {canReset && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  table.selected.length
                    ? `Exporter (${table.selected.length}) sélectionné(s)`
                    : 'Exporter toutes les données'
                }
                arrow
              >
                <IconButton
                  color="primary"
                  sx={{
                    p: 1,
                    transition: theme.transitions.create(['transform', 'box-shadow']),
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                  onClick={handleExportCSV}
                >
                  <FontAwesomeIcon icon={faFileExport} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                width: '100%',
                overflowX: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box
                sx={{
                  width: 'fit-content',
                  minWidth: '100%',
                  position: 'relative',
                }}
              >
                <Table
                  size="medium"
                  sx={{
                    tableLayout: 'fixed',
                    margin: 0,
                    borderSpacing: 0,
                    borderBottom: 'none',
                  }}
                >
                  <colgroup>
                    {visibleTableHead.map((column, index) => (
                      <col
                        key={index}
                        style={{
                          width: index === 0 ? '50px' : column.width || 'auto',
                          minWidth: index === 0 ? '50px' : column.width || 'auto',
                          maxWidth: column.width || 'none',
                        }}
                      />
                    ))}
                  </colgroup>

                  <TableHeadWithFilters
                    columns={visibleTableHead}
                    filters={filters}
                    dateError={dateError}
                    order={table.order}
                    orderBy={table.orderBy}
                    onSort={table.onSort}
                    totalResults={totalRows}
                    onColumnFilter={handleColumnFilter}
                    columnFilters={columnFilters}
                    numSelected={table.selected.length}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        baseFilteredData.map((row) => row.id)
                      )
                    }
                  />
                </Table>

                <Box
                  sx={{
                    maxHeight: '350px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#c1c1c1',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#a8a8a8',
                    },
                    paddingRight: '0',
                    boxSizing: 'content-box',
                  }}
                >
                  <Table
                    size="medium"
                    sx={{
                      tableLayout: 'fixed',
                      margin: 0,
                      borderSpacing: 0,
                      borderTop: 'none',
                      width: 'calc(100% - 6px)',
                    }}
                  >
                    <colgroup>
                      {visibleTableHead.map((column, index) => (
                        <col
                          key={index}
                          style={{
                            width: column.width || 'auto',
                            minWidth: column.width || 'auto',
                            maxWidth: column.width || 'none',
                          }}
                        />
                      ))}
                    </colgroup>

                    <TableBody>
                      {tableData.map((row) => (
                        <AuditTableRow
                          key={row.id}
                          row={row}
                          selected={table.selected.includes(row.id)}
                          onSelectRow={() => table.onSelectRow(row.id)}
                          visibleColumns={visibleColumns}
                        />
                      ))}

                      {notFound && <TableNoData notFound />}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Box>
          {totalRows > 5 && (
            <TablePaginationCustom
              page={table.page}
              count={totalRows}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
            />
          )}
        </Card>
      </Box>
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
  dateError: boolean;
  inputData: AuditEvent[];
  filters: IAuditFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  const { userName, actionType, entityType, entityId, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (userName) {
    inputData = inputData.filter(
      (payment) => payment.userName.toLowerCase().indexOf(userName.toLowerCase()) !== -1
    );
  }
  if (actionType) {
    inputData = inputData.filter(
      (payment) => payment.actionType.toLowerCase().indexOf(actionType.toLowerCase()) !== -1
    );
  }

  if (entityType) {
    inputData = inputData.filter(
      (payment) => payment.entityType.toLowerCase().indexOf(entityType.toLowerCase()) !== -1
    );
  }

  if (entityId) {
    inputData = inputData.filter(
      (payment) =>
        typeof payment.entityId === 'string' &&
        payment.entityId.toLowerCase().indexOf(entityId.toLowerCase()) !== -1
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((payment) => fIsBetween(payment.timestamp, startDate, endDate));
    }
  }

  return inputData;
}
