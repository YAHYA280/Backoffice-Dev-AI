'use client';

import dayjs from 'dayjs';
import { toast } from 'sonner';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  faPlus,
  faTable,
  faTrash,
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
  TableRow,
  TableBody,
  TextField,
  TableCell,
  IconButton,
  FormControl,
  ListItemText,
  InputAdornment,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { varAlpha } from 'src/shared/theme/styles';
import { _STATUS_OPTIONS } from 'src/shared/_mock';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { mapRoleToUserType, type IUserTableFilters } from 'src/contexts/types/user';

import { Label } from 'src/shared/components/label';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';
import {
  useTable,
  TableNoData,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { UserTableRow } from '../user-table-row';
import { apiService, type IUserItem } from '../../api.service';
import { TableHeadWithFilters } from '../table-head-with-filters';

const STATUS = [{ value: 'Tous', label: 'Tous' }, ..._STATUS_OPTIONS];

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const TABLE_HEAD = [
  { id: 'select', label: '', width: '5%' },
  { id: 'name', label: 'Nom', width: '15%' },
  { id: 'email', label: 'Email', width: '20%' },
  { id: 'role', label: 'Rôle', width: '10%' },
  { id: 'statut', label: 'Statut', width: '10%' },
  { id: 'createdAt', label: 'Date de création', width: '15%' },
  { id: 'lastLogin', label: 'Dernière connexion', width: '20%' },
  { id: 'actions', label: 'Actions', width: '5%', sx: { textAlign: 'left' } },
];

const FIXED_COLUMNS = TABLE_HEAD.filter((col) => col.id === 'select' || col.id === 'actions');
const DEFAULT_COLUMNS = TABLE_HEAD.filter((col) => col.id !== 'select' && col.id !== 'actions');

const FILTER_COLUMN_OPTIONS = [
  { value: 'name', label: 'Nom' },
  { value: 'email', label: 'Email' },
  { value: 'role', label: 'Rôle' },
  { value: 'status', label: 'Statut' },
  { value: 'createdAt', label: 'Date de création' },
  { value: 'lastLogin', label: 'Dernière connexion' },
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

const FILTER_ROLE_OPTIONS = [
  { value: 'Parent', label: 'Parent' },
  { value: 'Enfant', label: 'Enfant' },
  { value: 'Admin', label: 'Admin' },
];

const FILTER_STATUT_OPTIONS = [
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'BLOCKED', label: 'Bloqué' },
  { value: 'SUSPENDED', label: 'Suspendu' },
  { value: 'DELETED', label: 'Supprimé' },
];

type Props = { title?: string };

export function AccountsView({ title = 'Liste des utilisateurs' }: Props) {
  const table = useTable({ defaultRowsPerPage: 10 });
  const router = useRouter();
  const [tableData, setTableData] = useState<IUserItem[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<IUserItem[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const filters = useSetState<IUserTableFilters>({
    name: '',
    email: '',
    role: [],
    statut: [],
    createdAt: null,
    lastLogin: null,
  });
  const dateError = fIsAfter(filters.state.createdAt, filters.state.lastLogin);
  const notFound = tableData.length === 0;
  const [filterColumn, setFilterColumn] = useState('name');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const [customFilter, setCustomFilter] = useState({
    column: 'name',
    operator: 'contains',
    value: '',
  });
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_COLUMNS.map((col) => col.id)
  );
  const [anchorElColumns, setAnchorElColumns] = useState<null | HTMLElement>(null);
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [statusCounts, setStatusCounts] = useState({
    Tous: 0,
    ACTIVE: 0,
    BLOCKED: 0,
    SUSPENDED: 0,
    DELETED: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

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
    if (newCol === 'role' || newCol === 'status') {
      setFilterOperator('is');
    } else if (newCol === 'createdAt' || newCol === 'lastLogin') {
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
    setCustomFilter({
      column: filterColumn,
      operator: filterOperator,
      value: filterValue,
    });
    handleCloseFilterMenu();
  };

  const handleRefresh = () => {
    setFilterColumn('name');
    setFilterOperator('contains');
    setFilterValue('');
    setCustomFilter({ column: 'name', operator: 'contains', value: '' });
    filters.setState({
      name: '',
      email: '',
      role: [],
      statut: [],
      createdAt: null,
      lastLogin: null,
    });
    setVisibleColumns(DEFAULT_COLUMNS.map((col) => col.id));
  };

  const handleSelectAllClick = (checked: boolean) => {
    table.onSelectAllRows(
      checked,
      baseFilteredData.map((row) => row.id)
    );
  };

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: table.page,
        size: table.rowsPerPage,
        sortBy: table.orderBy || 'createdAt',
        sortDirection: table.order,
        nameSearch: filters.state.name || '',
        emailSearch: filters.state.email || '',
        statusSearch:
          filters.state.statut.length === 0 || filters.state.statut[0] === 'Tous'
            ? ''
            : filters.state.statut[0],

        roleSearch:
          Array.isArray(filters.state.role) && filters.state.role.length > 0
            ? mapRoleToUserType(filters.state.role[0])
            : '',
        dateSearch: filters.state.createdAt?.toString() || '',
        lastLoginSearch: filters.state.lastLogin?.toString() || '',
      };

      const response = await apiService.user.getAllUsers(params);
      setBaseFilteredData(response.users);
      setTableData(response.users);
      setTotalRows(response.total);
      setStatusCounts({
        Tous: response.statusCounts.Tous || response.total,
        ACTIVE: response.statusCounts.ACTIVE || 0,
        BLOCKED: response.statusCounts.BLOCKED || 0,
        SUSPENDED: response.statusCounts.SUSPENDED || 0,
        DELETED: response.statusCounts.DELETED || 0,
      });
      console.log(params);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.state.createdAt,
    filters.state.email,
    filters.state.lastLogin,
    filters.state.name,
    filters.state.role,
    filters.state.statut,
    table.order,
    table.orderBy,
    table.page,
    table.rowsPerPage,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ statut: newValue === 'Tous' ? [] : [newValue] });
    },
    [filters, table]
  );

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleDeleteSelected = () => {
    toast.success(`Suppression réussie de ${table.selected.length} compte sélectionnées.`);
  };

  const computedTableHead = useMemo(() => {
    const toggable = DEFAULT_COLUMNS.filter((col) => visibleColumns.includes(col.id));
    return [FIXED_COLUMNS[0], ...toggable, FIXED_COLUMNS[1]];
  }, [visibleColumns]);

  const finalTableHead = useMemo(() => {
    if (filters.state.statut.length > 0 && filters.state.statut.includes('Suspendu')) {
      const filteredHead = computedTableHead.filter((col) => col.id !== 'statut');
      const lastLoginIndex = filteredHead.findIndex((col) => col.id === 'lastLogin');
      const dureRestanteColumn = {
        id: 'dureRestante',
        label: 'Durée Restante',
        width: '15%',
      };
      return [
        ...filteredHead.slice(0, lastLoginIndex + 1),
        dureRestanteColumn,
        ...filteredHead.slice(lastLoginIndex + 1),
      ];
    }
    return computedTableHead;
  }, [filters.state.statut, computedTableHead]);

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomBreadcrumbs
            heading="Comptes utilisateurs"
            links={[
              { name: 'Tableau de bord', href: paths.dashboard.root },
              { name: 'Utilisateurs', href: paths.dashboard.users.accounts },
              { name: 'Comptes' },
            ]}
            sx={{ flex: 1 }}
          />
          <Button
            onClick={() => router.push(paths.dashboard.user.new)}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
          >
            Ajouter un compte
          </Button>
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
              {(filterColumn === 'status' || filterColumn === 'role'
                ? OPERATOR_OPTIONS_TYPE
                : filterColumn === 'createdAt' || filterColumn === 'lastLogin'
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
            {filterColumn === 'role' ? (
              <TextField
                select
                label="Valeur"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="">Tous</MenuItem>
                {FILTER_ROLE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : filterColumn === 'status' ? (
              <TextField
                select
                label="Valeur"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="">Tous</MenuItem>
                {FILTER_STATUT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : filterColumn === 'createdAt' ? (
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
            ) : filterColumn === 'lastLogin' ? (
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
            value={filters.state.statut[0] || 'Tous'}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              maxWidth: '65%',
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
          >
            {STATUS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      tab.value === 'Tous' || filters.state.statut.includes(tab.value)
                        ? 'filled'
                        : 'soft'
                    }
                    sx={{
                      ...(tab.value === 'Tous' && {
                        color: '#FFFFFF',
                        backgroundColor: 'rgba(33, 33, 33, 0.5)',
                        fontWeight: 'bold',
                      }),
                      ...(tab.value === 'ACTIVE' && {
                        color: '#FFFFFF',
                        backgroundColor: '#22bb33',
                        fontWeight: 'bold',
                      }),
                      ...(tab.value === 'BLOCKED' && {
                        color: '#FFFFFF',
                        backgroundColor: '#212121',
                        fontWeight: 'bold',
                      }),
                      ...(tab.value === 'DELETED' && {
                        color: '#FFFFFF',
                        backgroundColor: '#F44336',
                        fontWeight: 'bold',
                      }),
                      ...(tab.value === 'SUSPENDED' && {
                        color: '#FFFFFF',
                        backgroundColor: '#FF9800',
                        fontWeight: 'bold',
                      }),
                    }}
                  >
                    {statusCounts[tab.value as keyof typeof statusCounts] || 0}
                  </Label>
                }
              />
            ))}
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
            <Tooltip
              title="Rafraichir"
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
                onClick={handleRefresh}
                color="primary"
                sx={{
                  width: 50,
                  height: 50,
                  padding: 0,
                  borderRadius: '50%',
                }}
              >
                <FontAwesomeIcon icon={faArrowsRotate} />
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Exporter"
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
                onClick={() => console.log('Export accounts vers Excel déclenché')}
                sx={{
                  width: 50,
                  height: 50,
                  minWidth: 0,
                  padding: 0,
                  borderRadius: '50%',
                }}
              >
                <FontAwesomeIcon icon={faFileExport} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <TableContainer
          sx={{
            maxHeight: 450,
            position: 'relative',
            mx: '10%',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Table
            size="medium"
            sx={{ width: '100%', minWidth: { xs: 'auto', sm: 720 }, tableLayout: 'fixed' }}
          >
            <TableHeadWithFilters
              columns={finalTableHead}
              filters={filters}
              dateError={dateError}
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
            ) : (
              <></>
            )}
            <TableBody sx={{ width: '100%' }}>
              <ConditionalComponent
                isValid={isLoading}
                defaultComponent={
                  <>
                    {tableData.map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        statusFilter={
                          filters.state.statut.length ? filters.state.statut[0] : 'Tous'
                        }
                        onEditRow={() => handleEditRow(row.id)}
                        onRefresh={refresh}
                        columns={finalTableHead}
                      />
                    ))}
                    {notFound && <TableNoData notFound />}
                  </>
                }
              >
                <TableRow>
                  <TableCell colSpan={finalTableHead.length} align="center">
                    <CircularProgress sx={{ mb: 2 }} />
                  </TableCell>
                </TableRow>
              </ConditionalComponent>
            </TableBody>
          </Table>
        </TableContainer>
        {totalRows > table.rowsPerPage ? (
          <TablePaginationCustom
            page={table.page}
            count={totalRows}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        ) : (
          <></>
        )}
      </Card>
    </DashboardContent>
  );
}

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IUserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

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

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (filters.name) {
    data = data.filter((user) => {
      const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;
      return fullName.includes(filters.name.toLowerCase());
    });
  }
  if (filters.email) {
    data = data.filter((user) => user.email.toLowerCase().includes(filters.email.toLowerCase()));
  }
  if (filters.role.length) {
    data = data.filter((user) => filters.role.includes(user.role));
  }
  if (filters.statut.length) {
    data = data.filter((user) => filters.statut.includes(user.status));
  }
  if (dateError) return [];
  data = data.filter((user) => {
    const userCreated = dayjs(user.createdAt);
    const userLogged = dayjs(user.lastLogin);
    const filterCreated = filters.createdAt ? dayjs(filters.createdAt, 'DD/MM/YYYY', true) : null;
    const filterLastLogin = filters.lastLogin ? dayjs(filters.lastLogin, 'DD/MM/YYYY', true) : null;
    if (filterCreated && !filterLastLogin) {
      if (!userCreated.isValid() || !filterCreated.isValid()) return false;
      return userCreated.isSameOrAfter(filterCreated, 'day');
    }
    if (!filterCreated && filterLastLogin) {
      if (!userLogged.isValid() || !filterLastLogin.isValid()) return false;
      return userLogged.isSameOrBefore(filterLastLogin, 'day');
    }
    if (filterCreated && filterLastLogin) {
      if (
        !userCreated.isValid() ||
        !userLogged.isValid() ||
        !filterCreated.isValid() ||
        !filterLastLogin.isValid()
      )
        return false;
      return (
        userCreated.isSameOrAfter(filterCreated, 'day') &&
        userLogged.isSameOrBefore(filterLastLogin, 'day')
      );
    }
    return true;
  });
  return data;
}
