'use client';

import type { Dayjs } from 'dayjs';
import type {
  Alerte,
  LogEntry,
  ActionsCritique,
  ILogTableFilters,
  IAlerteTableFilters,
  IActionsCritiqueTableFilters,
} from 'src/shared/_mock/_logs';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import React, { useMemo, useState, useEffect } from 'react';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faX,
  faUser,
  faTable,
  faTimes,
  faCheck,
  faFilter,
  faShield,
  faFileExport,
  faArrowsRotate,
  faCalendarDays,
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

import { useSetState } from 'src/hooks/use-set-state';

import { varAlpha } from 'src/shared/theme/styles';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { _logs, _alertes, _activeSessions, _actionsCritiques } from 'src/shared/_mock/_logs';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  getComparator,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { SuiviTableRow } from './suivi/SuiviTableRow';
import { SuiviTableHead } from './suivi/SuiviTableHead';
import { LogsOverview } from './componenets/logsOverview';
import { AlerteTableRow } from './alertes/AlertesTableRow';
import { ActionsTableRow } from './actions/ActionsTableRow';
import { AlerteTableHead } from './alertes/AlerteTableHead';
import { ActionsTableHead } from './actions/ActionsTableHead';
import {
  applyFilter,
  compareValue,
  applyActionFilter,
  applyAlerteFilter,
} from './utils/filterUtils';
import {
  FILTER_LOGS_OPTIONS,
  DEFAULT_LOGS_COLUMNS,
  FILTER_ACTION_OPTIONS,
  OPERATOR_DATE_OPTIONS,
  OPERATOR_TEXT_OPTIONS,
  OPERATOR_TYPE_OPTIONS,
  DEFAULT_ACTION_COLUMNS,
  DEFAULT_ALERTES_COLUMNS,
} from './utils/logsConstants';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

type Props = { title?: string };

export function LogsView({ title = 'Logs et Traçabilité' }: Props) {
  const [currentTab, setCurrentTab] = useState<'suivi' | 'actionsCritique' | 'alertes'>('suivi');
  const logTable = useTable();
  const [tableLogData, setTableLogData] = useState<LogEntry[]>([]);
  const [baseFilteredLogData, setBaseFilteredLogData] = useState<LogEntry[]>([]);
  const [totalLogRows, setTotalLogRows] = useState<number>(0);
  const actionTable = useTable();
  const [actionsSelected, setactionsSelected] = useState<string[]>([]);
  const [actionTableData, setActionTableData] = useState<ActionsCritique[]>([]);
  const [baseFilteredActionData, setBaseFilteredActionData] = useState<ActionsCritique[]>([]);
  const [actionTotalRows, setActionTotalRows] = useState<number>(0);
  const filtersLogs = useSetState<ILogTableFilters>({
    userName: '',
    ipaddress: '',
    statut: [],
    logintime: null,
    device: '',
    browser: '',
  });

  const filtersAlertes = useSetState<IAlerteTableFilters>({
    titre: '',
    userName: '',
    criticite: [],
    dateAlerte: null,
    description: '',
  });

  const [customFilter, setCustomFilter] = useState({
    column: 'userName',
    operator: 'contains',
    value: '',
  });
  const [filterColumn, setFilterColumn] = useState('userName');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const actionFilters = useSetState<IActionsCritiqueTableFilters>({
    userName: '',
    typeAction: '',
    dateAction: null,
    statut: [],
    details: '',
  });
  const [customactionFilter, setCustomactionFilter] = useState({
    column: 'userName',
    operator: 'contains',
    value: '',
  });
  const [actionFilterColumn, setactionFilterColumn] = useState('userName');
  const [actionFilterOperator, setactionFilterOperator] = useState('contains');
  const [actionFilterValue, setactionFilterValue] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_LOGS_COLUMNS.map((col) => col.id)
  );
  const [visibleActionColumns, setVisibleactionColumns] = useState<string[]>(
    DEFAULT_ACTION_COLUMNS.map((col) => col.id)
  );
  const [anchorElColumns, setAnchorElColumns] = useState<null | HTMLElement>(null);
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [anchorElColumnsaction, setAnchorElColumnsaction] = useState<null | HTMLElement>(null);
  const [anchorElFilteraction, setAnchorElFilteraction] = useState<null | HTMLElement>(null);
  const notFound = tableLogData.length === 0;

  const handleChangeTab = (
    event: React.SyntheticEvent,
    newValue: 'suivi' | 'actionsCritique' | 'alertes'
  ) => {
    setCurrentTab(newValue);
  };

  const alerteTable = useTable();
  const [alertesData, setAlertesData] = useState<Alerte[]>([]);
  const [alertesTotalRows, setAlertesTotalRows] = useState<number>(0);

  const [visibleAlertesColumns, setVisibleAlertesColumns] = useState<string[]>(
    DEFAULT_ALERTES_COLUMNS.map((col) => col.id)
  );

  const [anchorElColumnsAlertes, setAnchorElColumnsAlertes] = useState<null | HTMLElement>(null);

  // For alertes filtering:
  const [alerteFilter, setAlerteFilter] = useState({
    column: 'titre',
    operator: 'contains',
    value: '',
  });
  const [alerteFilterColumn, setAlerteFilterColumn] = useState('titre');
  const [alerteFilterOperator, setAlerteFilterOperator] = useState('contains');
  const [alerteFilterValue, setAlerteFilterValue] = useState('');
  const [anchorElFilterAlertes, setAnchorElFilterAlertes] = useState<null | HTMLElement>(null);
  const [baseFilteredAlerteData, setBaseFilteredAlerteData] = useState<Alerte[]>([]);

  const [alertessSelected, setAlertesSelected] = useState<string[]>([]);

  const [overviewStartDate, setOverviewStartDate] = useState<Dayjs | null>(dayjs());
  const [overviewEndDate, setOverviewEndDate] = useState<Dayjs | null>(dayjs());
  const [anchorElOverviewFilter, setAnchorElOverviewFilter] = useState<null | HTMLElement>(null);

  const handleOpenOverviewFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElOverviewFilter(event.currentTarget);
  };
  const handleCloseOverviewFilterMenu = () => {
    setAnchorElOverviewFilter(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const FIXED_COLUMNS = [{ id: 'select', label: '', width: 50 }];

  const filteredLogsOverview = useMemo(
    () =>
      _logs.filter((log) => {
        const logDate = dayjs(log.logintime);
        if (overviewStartDate && logDate.isBefore(overviewStartDate, 'day')) return false;
        if (overviewEndDate && logDate.isAfter(overviewEndDate, 'day')) return false;
        return true;
      }),
    [overviewStartDate, overviewEndDate]
  );

  const filteredActionsOverview = useMemo(
    () =>
      _actionsCritiques.filter((action) => {
        const actionDate = dayjs(action.dateAction);
        if (overviewStartDate && actionDate.isBefore(overviewStartDate, 'day')) return false;
        if (overviewEndDate && actionDate.isAfter(overviewEndDate, 'day')) return false;
        return true;
      }),
    [overviewStartDate, overviewEndDate]
  );

  const totalConnections = useMemo(
    () => filteredLogsOverview.filter((log) => log.statut === 'Succès').length,
    [filteredLogsOverview]
  );
  const failedConnections = filteredLogsOverview.filter((log) => log.statut === 'Échec').length;
  const criticalActions = filteredActionsOverview.length;

  const filteredActiveSessions = useMemo(
    () =>
      _activeSessions.filter((session) => {
        const lastActivity = dayjs(session.lastActivity);
        if (overviewStartDate && lastActivity.isBefore(overviewStartDate, 'day')) return false;
        if (overviewEndDate && lastActivity.isAfter(overviewEndDate, 'day')) return false;
        return true;
      }),
    [overviewStartDate, overviewEndDate]
  );

  const activeUsersCount = new Set(filteredActiveSessions.map((session) => session.userName)).size;

  useEffect(() => {
    let baseFiltered = applyFilter({
      inputData: _logs,
      comparator: getComparator(logTable.order, logTable.orderBy),
      filters: filtersLogs.state,
    });
    if (customFilter.value) {
      baseFiltered = baseFiltered.filter((log) => {
        const logValue = (log as any)[customFilter.column];
        if (logValue == null) return false;
        return compareValue(logValue, customFilter.value, customFilter.operator);
      });
    }
    setBaseFilteredLogData(baseFiltered);
    setTotalLogRows(baseFiltered.length);
    const start = logTable.page * logTable.rowsPerPage;
    const end = start + logTable.rowsPerPage;
    setTableLogData(baseFiltered.slice(start, end));
  }, [
    filtersLogs.state,
    logTable.order,
    logTable.orderBy,
    logTable.page,
    logTable.rowsPerPage,
    customFilter,
  ]);

  const handleSelectAllClick = (checked: boolean) => {
    logTable.onSelectAllRows(
      checked,
      baseFilteredLogData.map((row) => row.id)
    );
  };

  const computedTableLogHead = useMemo(() => {
    const toggable = DEFAULT_LOGS_COLUMNS.filter((col) => visibleColumns.includes(col.id));
    return [...FIXED_COLUMNS.slice(0, 1), ...toggable, ...FIXED_COLUMNS.slice(1)];
  }, [FIXED_COLUMNS, visibleColumns]);

  const computedTableActionHead = useMemo(() => {
    const toggable = DEFAULT_ACTION_COLUMNS.filter((col) => visibleActionColumns.includes(col.id));
    return [...FIXED_COLUMNS.slice(0, 1), ...toggable, ...FIXED_COLUMNS.slice(1)];
  }, [FIXED_COLUMNS, visibleActionColumns]);

  const computedTableAlerteHead = useMemo(() => {
    const toggable = DEFAULT_ALERTES_COLUMNS.filter((col) =>
      visibleAlertesColumns.includes(col.id)
    );
    return [...FIXED_COLUMNS.slice(0, 1), ...toggable, ...FIXED_COLUMNS.slice(1)];
  }, [FIXED_COLUMNS, visibleAlertesColumns]);

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
    if (newCol === 'statut') {
      setFilterOperator('is');
    } else if (newCol === 'logintime') {
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

  useEffect(() => {
    let baseFiltered = applyActionFilter({
      inputData: _actionsCritiques,
      comparator: getComparator(actionTable.order, actionTable.orderBy),
      actionFilters: actionFilters.state,
    });
    if (customactionFilter.value) {
      baseFiltered = baseFiltered.filter((action) => {
        const actionValue = (action as any)[customactionFilter.column];
        if (actionValue == null) return false;
        return compareValue(actionValue, customactionFilter.value, customactionFilter.operator);
      });
    }
    setBaseFilteredActionData(baseFiltered);
    setActionTotalRows(baseFiltered.length);
    const start = actionTable.page * actionTable.rowsPerPage;
    const end = start + actionTable.rowsPerPage;
    setActionTableData(baseFiltered.slice(start, end));
  }, [
    actionFilters.state,
    actionTable.order,
    actionTable.orderBy,
    actionTable.page,
    actionTable.rowsPerPage,
    customactionFilter,
  ]);

  useEffect(() => {
    let baseFiltered = applyAlerteFilter({
      inputData: _alertes,
      comparator: getComparator(alerteTable.order, alerteTable.orderBy),
      filtersAlertes: filtersAlertes.state,
    });
    if (alerteFilter.value) {
      baseFiltered = baseFiltered.filter((action) => {
        const alerteValue = (action as any)[alerteFilter.column];
        if (alerteValue == null) return false;
        return compareValue(alerteValue, alerteFilter.value, alerteFilter.operator);
      });
    }
    setBaseFilteredAlerteData(baseFiltered);
    setAlertesTotalRows(baseFiltered.length);
    const start = alerteTable.page * alerteTable.rowsPerPage;
    const end = start + alerteTable.rowsPerPage;
    setAlertesData(baseFiltered.slice(start, end));
  }, [
    alerteFilter, // dependency for custom alert filter
    alerteTable.order,
    alerteTable.orderBy,
    alerteTable.page,
    alerteTable.rowsPerPage,
    filtersAlertes.state,
  ]);

  const handleOpenColumnsMenuaction = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElColumnsaction(event.currentTarget);
  };
  const handleCloseColumnsMenuaction = () => {
    setAnchorElColumnsaction(null);
  };
  const handleToggleactionColumn = (columnId: string) => {
    setVisibleactionColumns((prev) =>
      prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]
    );
  };

  const handleOpenFilterMenuaction = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilteraction(event.currentTarget);
  };
  const handleCloseFilterMenuaction = () => {
    setAnchorElFilteraction(null);
  };
  const handleApplyactionFilters = () => {
    actionFilters.setState({
      userName: '',
      typeAction: '',
      dateAction: null,
      statut: [],
      details: '',
    });
    setCustomactionFilter({
      column: actionFilterColumn,
      operator: actionFilterOperator,
      value: actionFilterValue,
    });
    handleCloseFilterMenuaction();
  };

  const handleRefresh = () => {
    if (currentTab === 'suivi') {
      setFilterColumn('title');
      setFilterOperator('contains');
      setFilterValue('');
      setCustomFilter({ column: 'title', operator: 'contains', value: '' });
      filtersLogs.setState({
        userName: '',
        ipaddress: '',
        statut: [],
        logintime: null,
        browser: '',
        device: '',
      });
      setVisibleColumns(DEFAULT_LOGS_COLUMNS.map((col) => col.id));
    } else if (currentTab === 'actionsCritique') {
      setactionFilterColumn('title');
      setactionFilterOperator('contains');
      setactionFilterValue('');
      setCustomactionFilter({ column: 'title', operator: 'contains', value: '' });
      actionFilters.setState({
        userName: '',
        typeAction: '',
        dateAction: null,
        statut: [],
        details: '',
      });
      setVisibleactionColumns(DEFAULT_ACTION_COLUMNS.map((col) => col.id));
    } else if (currentTab === 'alertes') {
      setAlerteFilterColumn('titre');
      setAlerteFilterOperator('contains');
      setAlerteFilterValue('');
      setAlerteFilter({ column: 'titre', operator: 'contains', value: '' });
      setVisibleAlertesColumns(DEFAULT_ALERTES_COLUMNS.map((col) => col.id));
    }
  };

  const handleSelectAllAlertes = (checked: boolean) => {
    if (checked) {
      setAlertesSelected(baseFilteredAlerteData.map((alerte) => alerte.id));
    } else {
      setAlertesSelected([]);
    }
  };

  const handleSelectAlerteRow = (id: string) => {
    setAlertesSelected((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAllactions = (checked: boolean) => {
    if (checked) {
      setactionsSelected(baseFilteredActionData.map((action) => action.id));
    } else {
      setactionsSelected([]);
    }
  };

  const handleSelectactionRow = (id: string) => {
    setactionsSelected((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };
  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <CustomBreadcrumbs
            heading="Logs et Traçabilité"
            links={[
              { name: 'Tableau de bord', href: paths.dashboard.root },
              { name: 'Analytiques', href: paths.dashboard.analytics.logs },
              { name: 'Logs et Traçabilité' },
            ]}
            sx={{ flex: 1 }}
          />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorElOverviewFilter}
        open={Boolean(anchorElOverviewFilter)}
        onClose={handleCloseOverviewFilterMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 2, width: 450, borderRadius: 2 } } }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
            <FormControl size="small">
              <DatePicker
                label="Date début"
                value={overviewStartDate}
                onChange={(newValue) => setOverviewStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: false,
                    size: 'small',
                    placeholder: 'JJ/MM/AAAA',
                    sx: {
                      width: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                    },
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
            </FormControl>

            <FormControl size="small">
              <DatePicker
                label="Date fin"
                value={overviewEndDate}
                onChange={(newValue) => setOverviewEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    fullWidth: false,
                    size: 'small',
                    placeholder: 'JJ/MM/AAAA',
                    sx: {
                      width: 200,
                      '& .MuiOutlinedInput-root': { borderRadius: 1 },
                    },
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
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              onClick={handleApplyFilters}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
              }}
            >
              Appliquer
            </Button>
          </Box>
        </Box>
      </Menu>

      <Box sx={{ mb: 5 }}>
        <LogsOverview
          title="Vue d'ensemble"
          filterIcon={
            <Tooltip title="Filtres" arrow>
              <IconButton
                onClick={handleOpenOverviewFilterMenu}
                color="primary"
                size="small"
                sx={{ width: 50, height: 50, minWidth: 0, p: 0, borderRadius: '50%' }}
              >
                <FontAwesomeIcon icon={faCalendarDays} />
              </IconButton>
            </Tooltip>
          }
          data={[
            {
              label: 'Utilisateurs actifs',
              totalValue: activeUsersCount.toString(),
              icon: <FontAwesomeIcon icon={faUser} fontSize={24} />,
            },
            {
              label: 'Connexions réussies',
              totalValue: totalConnections.toString(),
              icon: <FontAwesomeIcon icon={faCheck} fontSize={24} />,
            },
            {
              label: 'Échecs de connexion',
              totalValue: failedConnections.toString(),
              icon: <FontAwesomeIcon icon={faX} fontSize={24} />,
            },
            {
              label: 'Actions critiques',
              totalValue: criticalActions.toString(),
              icon: <FontAwesomeIcon icon={faShield} fontSize={24} />,
            },
          ]}
        />
      </Box>

      <Menu
        anchorEl={anchorElColumns}
        open={Boolean(anchorElColumns)}
        onClose={handleCloseColumnsMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 1.5, width: 300 } } }}
      >
        {DEFAULT_LOGS_COLUMNS.map((col, index) => {
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
              visibleColumns.filter((id) => id !== DEFAULT_LOGS_COLUMNS[0].id).length ===
              DEFAULT_LOGS_COLUMNS.slice(1).length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setVisibleColumns(DEFAULT_LOGS_COLUMNS.map((col) => col.id));
              } else {
                setVisibleColumns([DEFAULT_LOGS_COLUMNS[0].id]);
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
              {FILTER_LOGS_OPTIONS.map((option) => (
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
              {(filterColumn === 'statut'
                ? OPERATOR_TYPE_OPTIONS
                : filterColumn === 'logintime'
                  ? OPERATOR_DATE_OPTIONS
                  : OPERATOR_TEXT_OPTIONS
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            {filterColumn === 'logintime' ? (
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
            ) : filterColumn === 'statut' ? (
              <TextField
                select
                label="Valeur"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="Succès">Succès</MenuItem>
                <MenuItem value="Échec">Échec</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Valeur"
                size="small"
                placeholder={filterColumn === 'datePubliactionion' ? 'JJ/MM/AAAA' : ''}
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
        anchorEl={anchorElColumnsaction}
        open={Boolean(anchorElColumnsaction)}
        onClose={handleCloseColumnsMenuaction}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { p: 1.5, width: 300 } } }}
      >
        {DEFAULT_ACTION_COLUMNS.map((col, index) => {
          const isFirst = index === 0;
          const isChecked = isFirst || visibleActionColumns.includes(col.id);
          return (
            <MenuItem
              key={col.id}
              onClick={isFirst ? undefined : () => handleToggleactionColumn(col.id)}
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
              visibleActionColumns.filter((id) => id !== DEFAULT_ACTION_COLUMNS[0].id).length ===
              DEFAULT_ACTION_COLUMNS.slice(1).length
            }
            onChange={(e) => {
              if (e.target.checked) {
                setVisibleactionColumns(DEFAULT_ACTION_COLUMNS.map((col) => col.id));
              } else {
                setVisibleactionColumns([DEFAULT_ACTION_COLUMNS[0].id]);
              }
            }}
            sx={{ mr: 1 }}
          />
          <ListItemText primary="Afficher/Masquer tout" />
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={anchorElFilteraction}
        open={Boolean(anchorElFilteraction)}
        onClose={handleCloseFilterMenuaction}
        slotProps={{ paper: { sx: { p: 2, width: 600, borderRadius: 2 } } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
          <Box component="span" sx={{ fontWeight: 600 }}>
            Filtres
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton onClick={handleCloseFilterMenuaction} size="small" sx={{ ml: 'auto' }}>
              <FontAwesomeIcon icon={faTimes} style={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 2 }}>
          <FormControl fullWidth size="small">
            <TextField
              select
              label="Colonne"
              value={actionFilterColumn}
              onChange={(e) => {
                const newVal = e.target.value as string;
                setactionFilterColumn(newVal);
                if (newVal === 'logintime' || newVal === 'dateAction') {
                  setactionFilterOperator('avant');
                } else {
                  setactionFilterOperator('contains');
                }
                setactionFilterValue('');
              }}
              SelectProps={{ native: false }}
            >
              {FILTER_ACTION_OPTIONS.map((option) => (
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
              value={actionFilterOperator}
              onChange={(e) => setactionFilterOperator(e.target.value as string)}
              SelectProps={{ native: false }}
            >
              {(actionFilterColumn === 'statut'
                ? OPERATOR_TYPE_OPTIONS
                : actionFilterColumn === 'logintime' || actionFilterColumn === 'dateAction'
                  ? OPERATOR_DATE_OPTIONS
                  : OPERATOR_TEXT_OPTIONS
              ).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth size="small">
            {actionFilterColumn === 'dateAction' ? (
              <DatePicker
                label="Valeur"
                value={actionFilterValue ? dayjs(actionFilterValue, 'DD/MM/YYYY') : null}
                onChange={(newValue) => {
                  if (newValue) {
                    setactionFilterValue(newValue.format('DD/MM/YYYY'));
                  } else {
                    setactionFilterValue('');
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
            ) : actionFilterColumn === 'statut' ? (
              <TextField
                select
                label="Valeur"
                value={actionFilterValue}
                onChange={(e) => setactionFilterValue(e.target.value)}
                SelectProps={{ native: false }}
              >
                <MenuItem value="Succès">Succès</MenuItem>
                <MenuItem value="Échec">Échec</MenuItem>
              </TextField>
            ) : (
              <TextField
                fullWidth
                label="Valeur"
                size="small"
                value={actionFilterValue}
                onChange={(e) => setactionFilterValue(e.target.value)}
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
          <Button variant="contained" size="small" onClick={handleApplyactionFilters}>
            Appliquer
          </Button>
        </Box>
      </Menu>
      {currentTab === 'suivi' ? (
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
              <Tab label="Suivi des connexions" value="suivi" />
              <Tab label="Actions critiques" value="actionsCritique" />
              <Tab label="Alertes" value="alertes" />
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
              <SuiviTableHead
                columns={computedTableLogHead}
                filters={filtersLogs}
                order={logTable.order}
                orderBy={logTable.orderBy}
                onSort={logTable.onSort}
                totalResults={totalLogRows}
                numSelected={logTable.selected.length}
                rowCount={totalLogRows}
                onSelectAllRows={handleSelectAllClick}
              />
              {logTable.selected.length > 0 ? (
                <TableSelectedAction
                  numSelected={logTable.selected.length}
                  rowCount={totalLogRows}
                  onSelectAllRows={handleSelectAllClick}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                />
              ) : (
                <>
                </>
              )}
              <TableBody>
                {tableLogData.map((row) => (
                  <SuiviTableRow
                    key={row.id}
                    row={row}
                    selected={logTable.selected.includes(row.id)}
                    columns={computedTableLogHead}
                    onSelectRow={() => logTable.onSelectRow(row.id)}
                  />
                ))}
                {notFound && <TableNoData notFound />}
              </TableBody>
            </Table>
          </TableContainer>
          {totalLogRows > 5 ? (
            <TablePaginationCustom
              page={logTable.page}
              count={totalLogRows}
              rowsPerPage={logTable.rowsPerPage}
              onPageChange={logTable.onChangePage}
              onRowsPerPageChange={logTable.onChangeRowsPerPage}
            />
          ) : (
            <>
            </>
          )}
        </Card>
      ) : (
        <>
        </>
      )}
      {currentTab === 'actionsCritique' ? (
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
              <Tab label="Suivi des connexions" value="suivi" />
              <Tab label="Actions critiques" value="actionsCritique" />
              <Tab label="Alertes" value="alertes" />
            </Tabs>
            <Box sx={{ gap: 2, flexShrink: 0 }}>
              <Button
                size="small"
                variant="outlined"
                endIcon={<FontAwesomeIcon icon={faTable} />}
                onClick={handleOpenColumnsMenuaction}
                color="primary"
              >
                Colonnes
              </Button>
              <Tooltip title="Filtres" arrow>
                <IconButton
                  size="small"
                  onClick={handleOpenFilterMenuaction}
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
              <ActionsTableHead
                columns={computedTableActionHead}
                actionFilters={actionFilters}
                order={actionTable.order}
                orderBy={actionTable.orderBy}
                onSort={actionTable.onSort}
                totalResults={actionTotalRows}
                numSelected={actionsSelected.length}
                rowCount={actionTotalRows}
                onSelectAllRows={(checked) => handleSelectAllactions(checked)}
              />
              {actionsSelected.length > 0 ? (
                <TableSelectedAction
                  numSelected={actionsSelected.length}
                  rowCount={actionTotalRows}
                  onSelectAllRows={(checked) => handleSelectAllactions(checked)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                />
              ) : (
                <>
                </>
              )}
              <TableBody>
                {actionTableData.map((action) => (
                  <ActionsTableRow
                    key={action.id}
                    row={action}
                    selected={actionsSelected.includes(action.id)}
                    columns={computedTableActionHead}
                    onSelectRow={() => handleSelectactionRow(action.id)}
                  />
                ))}
                {actionTableData.length === 0 && <TableNoData notFound />}
              </TableBody>
            </Table>
          </TableContainer>
          {actionTotalRows > 5 ? (
            <TablePaginationCustom
              page={actionTable.page}
              count={actionTotalRows}
              rowsPerPage={actionTable.rowsPerPage}
              onPageChange={actionTable.onChangePage}
              onRowsPerPageChange={actionTable.onChangeRowsPerPage}
            />
          ) : (
            <>
            </>
          )}
        </Card>
      ) : (
        <>
        </>
      )}

      {currentTab === 'alertes' ? (
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
              <Tab label="Suivi des connexions" value="suivi" />
              <Tab label="Actions critiques" value="actionsCritique" />
              <Tab label="Alertes" value="alertes" />
            </Tabs>
            <Box sx={{ gap: 2, flexShrink: 0 }}>
              <Button
                size="small"
                variant="outlined"
                endIcon={<FontAwesomeIcon icon={faTable} />}
                onClick={(e) => setAnchorElColumnsAlertes(e.currentTarget)}
                color="primary"
              >
                Colonnes
              </Button>
              <Tooltip title="Filtres" arrow>
                <IconButton
                  size="small"
                  onClick={(e) => setAnchorElFilterAlertes(e.currentTarget)}
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

          {/* Alertes Columns Toggle Menu */}
          <Menu
            anchorEl={anchorElColumnsAlertes}
            open={Boolean(anchorElColumnsAlertes)}
            onClose={() => setAnchorElColumnsAlertes(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{ paper: { sx: { p: 1.5, width: 300 } } }}
          >
            {DEFAULT_ALERTES_COLUMNS.map((col, index) => {
              const isFirst = index === 0;
              const isChecked = isFirst || visibleAlertesColumns.includes(col.id);
              return (
                <MenuItem
                  key={col.id}
                  onClick={
                    isFirst
                      ? undefined
                      : () => {
                          setVisibleAlertesColumns((prev) =>
                            prev.includes(col.id)
                              ? prev.filter((id) => id !== col.id)
                              : [...prev, col.id]
                          );
                        }
                  }
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
                  visibleAlertesColumns.filter((id) => id !== DEFAULT_ALERTES_COLUMNS[0].id)
                    .length === DEFAULT_ALERTES_COLUMNS.slice(1).length
                }
                onChange={(e) => {
                  if (e.target.checked) {
                    setVisibleAlertesColumns(DEFAULT_ALERTES_COLUMNS.map((col) => col.id));
                  } else {
                    setVisibleAlertesColumns([DEFAULT_ALERTES_COLUMNS[0].id]);
                  }
                }}
                sx={{ mr: 1 }}
              />
              <ListItemText primary="Afficher/Masquer tout" />
            </MenuItem>
          </Menu>

          {/* Alertes Filter Menu */}
          <Menu
            anchorEl={anchorElFilterAlertes}
            open={Boolean(anchorElFilterAlertes)}
            onClose={() => setAnchorElFilterAlertes(null)}
            slotProps={{ paper: { sx: { p: 2, width: 600, borderRadius: 2 } } }}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                Filtres
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconButton
                  onClick={() => setAnchorElFilterAlertes(null)}
                  size="small"
                  sx={{ ml: 'auto' }}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <TextField
                  select
                  label="Colonne"
                  value={alerteFilterColumn}
                  onChange={(e) => {
                    const newCol = e.target.value as string;
                    setAlerteFilterColumn(newCol);
                    if (newCol === 'criticite' || newCol === 'userName') {
                      setAlerteFilterOperator('contains');
                    } else if (newCol === 'dateAlerte') {
                      setAlerteFilterOperator('avant');
                    } else {
                      setAlerteFilterOperator('contains');
                    }
                    setAlerteFilterValue('');
                  }}
                  SelectProps={{ native: false }}
                >
                  {[
                    { value: 'titre', label: 'Titre' },
                    { value: 'userName', label: 'Nom' },
                    { value: 'description', label: 'Description' },
                    { value: 'dateAlerte', label: 'Date Alerte' },
                    { value: 'criticite', label: 'Criticité' },
                  ].map((option) => (
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
                  value={alerteFilterOperator}
                  onChange={(e) => setAlerteFilterOperator(e.target.value as string)}
                  SelectProps={{ native: false }}
                >
                  {(alerteFilterColumn === 'dateAlerte'
                    ? OPERATOR_DATE_OPTIONS
                    : OPERATOR_TEXT_OPTIONS
                  ).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </FormControl>
              <FormControl fullWidth size="small">
                {alerteFilterColumn === 'dateAlerte' ? (
                  <DatePicker
                    label="Valeur"
                    value={alerteFilterValue ? dayjs(alerteFilterValue, 'DD/MM/YYYY') : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        setAlerteFilterValue(newValue.format('DD/MM/YYYY'));
                      } else {
                        setAlerteFilterValue('');
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
                    value={alerteFilterValue}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
                    onChange={(e) => setAlerteFilterValue(e.target.value)}
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
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setAlerteFilter({
                    column: alerteFilterColumn,
                    operator: alerteFilterOperator,
                    value: alerteFilterValue,
                  });
                  setAnchorElFilterAlertes(null);
                }}
              >
                Appliquer
              </Button>
            </Box>
          </Menu>

          {/* Alertes Table */}
          <TableContainer sx={{ maxHeight: 450, overflow: 'auto', position: 'relative' }}>
            <Table stickyHeader>
              <AlerteTableHead
                columns={computedTableAlerteHead}
                filters={filtersAlertes}
                order={alerteTable.order}
                orderBy={alerteTable.orderBy}
                onSort={alerteTable.onSort}
                totalResults={alertesTotalRows}
                numSelected={alerteTable.selected.length}
                rowCount={alertesTotalRows}
                onSelectAllRows={(checked) => handleSelectAllAlertes(checked)}
              />
              {alertessSelected.length > 0 ? (
                <TableSelectedAction
                  numSelected={alertessSelected.length}
                  rowCount={alertesTotalRows}
                  onSelectAllRows={(checked) => handleSelectAllAlertes(checked)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                  }}
                />
              ) : (
                <>
                </>
              )}
              <TableBody>
                {alertesData.map((alerte) => (
                  <AlerteTableRow
                    key={alerte.id}
                    row={alerte}
                    selected={alertessSelected.includes(alerte.id)}
                    columns={computedTableAlerteHead}
                    handleSelectAlerteRow={() => handleSelectAlerteRow(alerte.id)}
                  />
                ))}
                {alertesData.length === 0 && <TableNoData notFound />}
              </TableBody>
            </Table>
          </TableContainer>
          {alertesTotalRows > 5 ? (
            <TablePaginationCustom
              page={alerteTable.page}
              count={alertesTotalRows}
              rowsPerPage={alerteTable.rowsPerPage}
              onPageChange={alerteTable.onChangePage}
              onRowsPerPageChange={alerteTable.onChangeRowsPerPage}
            />
          ) : (
            <>
            </>
          )}
        </Card>
      ) : (
        <>
        </>
      )}
    </DashboardContent>
  );
}
