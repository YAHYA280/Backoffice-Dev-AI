'use client';

import type { IPaymentItem, IPaymentFilters } from 'src/contexts/types/payment';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  faTimes,
  faFilter,
  faColumns,
  faSyncAlt,
  faTrashAlt,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Tab,
  Card,
  Tabs,
  List,
  Menu,
  Table,
  Stack,
  Button,
  Divider,
  Tooltip,
  ListItem,
  Checkbox,
  MenuItem,
  TableBody,
  TextField,
  IconButton,
  FormControl,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { sumBy } from 'src/utils/helper';
import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/shared/theme/styles';
import { abonnementItems } from 'src/shared/_mock/';
import { updatePaymentsWithInvoices } from 'src/shared/_mock/_invoice';
import {
  _payments,
  PAYMENT_METHOD_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from 'src/shared/_mock/_payment';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import {
  useTable,
  TableNoData,
  getComparator,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { PaymentTableRow } from './payment-table-row';
import { PaymentTableToolbar } from './payment-table-toolbar';
import { TableHeadWithFilters } from './table-head-with-filters';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const TABLE_HEAD = [
  { id: '', label: '', width: 50, isFilterable: false },
  { id: 'transactionId', label: 'Client', width: 150, isFilterable: false },
  {
    id: 'paymentDate',
    label: 'Date de paiement',
    width: 160,
    isFilterable: true,
  },
  { id: 'amount', label: 'Montant', width: 130, isFilterable: true },
  { id: 'paymentMethod', label: 'Méthode de paiement', width: 130, isFilterable: true },
  { id: 'status', label: 'Statut', width: 130, isFilterable: true },
];

const FILTER_COLUMN_OPTIONS = [
  { value: 'name', label: 'Client' },
  { value: 'paymentDate', label: 'Date de paiement' },
  { value: 'amount', label: 'Montant' },
  { value: 'paymentMethod', label: 'Méthode de paiment' },
  { value: 'status', label: 'Statut' },
];

const OPERATOR_OPTIONS_COMMON = [
  { value: 'contains', label: 'contient' },
  { value: 'equals', label: 'égal à' },
  { value: 'starts-with', label: 'commence par' },
  { value: 'ends-with', label: 'se termine par' },
  { value: 'is-empty', label: 'est vide' },
  { value: 'is-not-empty', label: "n'est pas vide" },
];

const OPERATOR_OPTIONS_AMOUNT = [
  { value: 'equals', label: 'égal à' },
  { value: 'greater-than', label: 'supérieur à' },
  { value: 'less-than', label: 'inférieur à' },
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

const STATUS = [{ value: 'all', label: 'Tous' }, ...PAYMENT_STATUS_OPTIONS];

export function PaymentsHistoryContent() {
  const popover = usePopover();

  const confirm = useBoolean();

  const theme = useTheme();
  const table = useTable();
  const [tableData, setTableData] = useState<IPaymentItem[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<IPaymentItem[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(TABLE_HEAD);
  const [filterColumn, setFilterColumn] = useState('name');
  const [filterOperator, setFilterOperator] = useState('contains');
  const [filterValue, setFilterValue] = useState('');
  const [customFilter, setCustomFilter] = useState({
    column: 'name',
    operator: 'contains',
    value: '',
  });
  const [anchorElFilter, setAnchorElFilter] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState('');
  const filters = useSetState<IPaymentFilters>({
    name: '',
    subscriptions: [],
    status: '',
    paymentMethod: '',
    startDate: null,
    endDate: null,
    minAmount: undefined,
    maxAmount: undefined,
    hasInvoice: undefined,
  });
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
  const amountError = (filters.state.minAmount ?? 0) > (filters.state.maxAmount ?? Infinity);
  const notFound = tableData.length === 0;
  // exportation des données
  const handleExportCSV = () => {
    const dataToExport =
      table.selected.length > 0
        ? baseFilteredData.filter((row) => table.selected.includes(row.id))
        : baseFilteredData;

    if (dataToExport.length === 0) {
      toast.error('Aucune donnée à exporter');
      return;
    }

    const exportFields = [
      'transactionId',
      'paymentDate',
      'paymentMethod',
      'amount',
      'status',
    ] as const;

    const headerMapping: Record<string, string> = {
      transactionId: 'Numéro de transaction',
      paymentDate: 'Date de paiement',
      paymentMethod: 'Méthode de paiement',
      amount: 'Montant',
      status: 'Statut',
    };

    const headers = exportFields.map((field) => headerMapping[field] || field).join(',');

    const csvData = dataToExport
      .map((row) =>
        exportFields
          .map((field) => {
            const value = row[field as keyof typeof row];
            if (field === 'paymentDate') {
              return dayjs(value as string).format('DD/MM/YYYY');
            }
            if (field === 'amount') {
              return `${(value as number).toFixed(2)}`;
            }
            if (field === 'status') {
              const getStatusLabel = (a: string): string => {
                const status = PAYMENT_STATUS_OPTIONS.find((option) => option.value === a);
                return status ? status.label : a;
              };
              return getStatusLabel(value as string);
            }
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          })
          .join(',')
      )
      .join('\n');

    const csv = `${headers}\n${csvData}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);

    const fileName = `factures_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Export de ${dataToExport.length} facture(s) réussi`);
  };
  // Gestion des filtres par colonne
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

        // Cas spécial pour la colonne status
        if (column.id === 'status') {
          return isVisible && !(filters.state.status && filters.state.status !== 'all');
        }
        if (column.id === 'actions') {
          return !isVisible;
        }

        return isVisible;
      }),
    [filters.state.status, visibleColumns]
  );

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
    filters.setState({
      name: '',
      subscriptions: [],
      status: '',
      paymentMethod: '',
      startDate: null,
      endDate: null,
      minAmount: undefined,
      maxAmount: undefined,
      hasInvoice: undefined,
    });
    setVisibleColumns(TABLE_HEAD);

    // Réinitialisez également les filtres de colonnes et la recherche
    setColumnFilters({});
    setSearch('');

    // Réinitialisez la pagination
    table.onResetPage();
  };

  const handleCloseFilterMenu = () => {
      setAnchorElFilter(null);
    };
    const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElFilter(event.currentTarget);
    };

    const handleChangeFilterColumn = (event: React.ChangeEvent<{ value: unknown }>) => {
      const newCol = event.target.value as string;
      setFilterColumn(newCol);
      if (newCol === 'paymentMethod' || newCol === 'status') {
        setFilterOperator('is');
      } else if (newCol === 'paymentDate') {
        setFilterOperator('avant');
      } else if (newCol === 'amount') {
        setFilterOperator('equals');
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

  const canReset =
    filters.state.name !== '' ||
    filters.state.paymentMethod !== '' ||
    (filters.state.startDate !== null && filters.state.startDate !== undefined) ||
    (filters.state.endDate !== null && filters.state.endDate !== undefined) ||
    filters.state.status !== '' ||
    (filters.state.minAmount !== null && filters.state.minAmount !== undefined) ||
    (filters.state.maxAmount !== null && filters.state.maxAmount !== undefined) ||
    filters.state.hasInvoice !== undefined ||
    filters.state.subscriptions.length > 0 ||
    Object.keys(columnFilters).length > 0 ||
    search !== '';
  const applyColumnFilters = useCallback(
    (data: IPaymentItem[]) =>
      data.filter((payment) =>
        Object.entries(columnFilters).every(([key, value]) => {
          if (!value) return true;

          const methodOption = PAYMENT_METHOD_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
          const statusOption = PAYMENT_STATUS_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
          switch (key) {
            case 'name':
              return payment.subscriber?.name.toLowerCase().includes(value.toLowerCase());

            case 'paymentDate':
              return true;

            case 'paymentMethod':
              if (methodOption) {
                return payment.paymentMethod === methodOption.value;
              }
              return payment.paymentMethod.toLowerCase().includes(value.toLowerCase());

            case 'invoiceGenerated':
              if (value.toLowerCase() === 'oui') {
                return payment.invoiceGenerated === true;
              }
              if (value.toLowerCase() === 'non') {
                return payment.invoiceGenerated === false;
              }
              return true;

            case 'amount':
              return payment.amount.toString().includes(value);

            case 'status':
              if (statusOption) {
                return payment.status === statusOption.value;
              }
              return payment.status.toLowerCase().includes(value.toLowerCase());

            default:
              return true;
          }
        })
      ),
    [columnFilters]
  );

  const applyDateFilters = useCallback(
    (data: IPaymentItem[]) => {
      if (!filters.state.startDate && !filters.state.endDate) {
        return data;
      }

      return data.filter((payment) => {
        const paymentDate = dayjs(payment.paymentDate);
        const isAfterStartDate =
          !filters.state.startDate ||
          paymentDate.isAfter(filters.state.startDate, 'day') ||
          paymentDate.isSame(filters.state.startDate, 'day');
        const isBeforeEndDate =
          !filters.state.endDate ||
          paymentDate.isBefore(filters.state.endDate, 'day') ||
          paymentDate.isSame(filters.state.endDate, 'day');

        return isAfterStartDate && isBeforeEndDate;
      });
    },
    [filters.state.startDate, filters.state.endDate]
  );
  useEffect(() => {
    updatePaymentsWithInvoices();

    let baseFiltered = applyFilter({
      inputData: _payments,
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters.state, status: 'all' },
      dateError,
      amountError,
    });

    if (customFilter.value) {
      baseFiltered = baseFiltered.filter((payment) => {
        let paymentValue;
        if (customFilter.column === 'name') {
          paymentValue = payment.subscriber?.name || '';
        } else {
          paymentValue = (payment as any)[customFilter.column];
        }
        if (paymentValue == null) return false;
        return compareValue(paymentValue, customFilter.value, customFilter.operator);
      });
    }

    setBaseFilteredData(baseFiltered);
    const statusFiltered =
      !filters.state.status || filters.state.status === 'all'
        ? baseFiltered
        : baseFiltered.filter((payment) => filters.state.status === payment.status);
    const dataWithColumnFilters = applyColumnFilters(statusFiltered);
    const finalFiltered = applyDateFilters(dataWithColumnFilters);

    setTotalRows(finalFiltered.length);
    const start = table.page * table.rowsPerPage;
    const end = start + table.rowsPerPage;
    setTableData(finalFiltered.slice(start, end));
  }, [
    filters.state,
    table.order,
    table.orderBy,
    dateError,
    amountError,
    table.page,
    table.rowsPerPage,
    columnFilters,
    customFilter,
    applyColumnFilters,
    applyDateFilters,
  ]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ status: newValue });
      setColumnFilters((prev) => ({
        ...prev,
        status: '',
      }));
    },
    [filters, table]
  );

  const getInvoiceLength = (status: string) =>
    baseFilteredData.filter((item) => item.status === status).length;

  const getTotalAmount = (status: string) =>
    sumBy(
      baseFilteredData.filter((item) => item.status === status),
      (invoice) => invoice.amount
    );

  const getPercentByStatus = (status: string) =>
    (getInvoiceLength(status) / baseFilteredData.length) * 100;
  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = baseFilteredData.filter((row) => row.id !== id);

      toast.success('Suppression réussie !');

      setTableData(deleteRow);
    },
    [baseFilteredData]
  );
  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));

    toast.success('Suppression réussie !');

    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRowsInPage: tableData.length,
      totalRowsFiltered: totalRows,
    });
  }, [totalRows, tableData, table]);

  return (
    <Box maxWidth="xl">
      <Card>
        <Tabs
          value={filters.state.status || 'all'}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (themes) =>
              `inset 0 -2px 0 0 ${varAlpha(themes.vars.palette.grey['500Channel'], 0.08)}`,
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
                    ((tab.value === 'all' || filters.state.status === tab.value) && 'filled') ||
                    'soft'
                  }
                  sx={{
                    ...(tab.value === 'all' && {
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(50, 50, 50, 0.6)',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'success' && {
                      color: '#FFFFFF',
                      backgroundColor: '#28a745',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'failed' && {
                      color: '#FFFFFF',
                      backgroundColor: '#424242',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'cancelled' && {
                      color: '#FFFFFF',
                      backgroundColor: '#C62828',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'pending' && {
                      color: '#FFFFFF',
                      backgroundColor: '#FFB300',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'overdue' && {
                      color: '#FFFFFF',
                      backgroundColor: '#E53935',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'partial' && {
                      color: '#FFFFFF',
                      backgroundColor: '#039BE5',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'refunded' && {
                      color: '#FFFFFF',
                      backgroundColor: '#388E3C',
                      fontWeight: 'bold',
                    }),
                  }}
                >
                  {tab.value === 'all'
                    ? baseFilteredData.length
                    : baseFilteredData.filter((invoice) => invoice.status === tab.value).length}
                </Label>
              }
            />
          ))}
        </Tabs>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <PaymentTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              subscriptions: abonnementItems.map((option) => option.title),
            }}
          />

          <Stack direction="row" alignContent="end" spacing={2}>
            {!!table.selected.length && (
              <Tooltip title="Supprimer" arrow>
                <Button
                  size="small"
                  color="error"
                  startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
                  onClick={confirm.onTrue}
                >
                  ({table.selected.length})
                </Button>
              </Tooltip>
            )}
            {!!table.selected.length && (
              <Tooltip title="Exporter" arrow>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<FontAwesomeIcon icon={faFileExport} />}
                  onClick={handleExportCSV}
                >
                  ({table.selected.length})
                </Button>
              </Tooltip>
            )}

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
                            TABLE_HEAD.filter((col) => col.isFilterable !== false && col.id !== '')
                              .length
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

            <Tooltip
              title="Filtres"
              arrow
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: 14,
                    borderRadius: 1,
                    boxShadow: 3,
                    padding: '6px 12px',
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
                    {(filterColumn === 'status' || filterColumn === 'paymentMethod'
                      ? OPERATOR_OPTIONS_TYPE
                      : filterColumn === 'paymentDate'
                        ? OPERATOR_OPTIONS_DATE
                        : filterColumn === 'amount'
                          ? OPERATOR_OPTIONS_AMOUNT
                          : OPERATOR_OPTIONS_COMMON
                    ).map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </FormControl>
                <FormControl fullWidth size="small">
                  {filterColumn === 'paymentMethod' ? (
                    <TextField
                      select
                      label="Valeur"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      SelectProps={{ native: false }}
                    >
                      <MenuItem value="">Tous</MenuItem>
                      {PAYMENT_METHOD_OPTIONS.map((option) => (
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
                      {PAYMENT_STATUS_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : filterColumn === 'paymentDate' ? (
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
            <Tooltip title="Exporter toutes les données" arrow>
              <IconButton
                color="primary"
                sx={{
                  p: 1,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                onClick={() => {
                  const exportAllData = () => {
                    // Utiliser baseFilteredData pour exporter toutes les données filtrées
                    const dataToExport = baseFilteredData;

                    if (dataToExport.length === 0) {
                      toast.error('Aucune donnée à exporter');
                      return;
                    }

                    const exportFields = [
                      'invoiceNumber',
                      'createDate',
                      'dueDate',
                      'amount',
                      'status',
                    ] as const;

                    const headerMapping: Record<string, string> = {
                      invoiceNumber: 'Numéro de facture',
                      createDate: 'Date de création',
                      dueDate: "Date d'échéance",
                      amount: 'Montant',
                      status: 'Statut',
                    };

                    const headers = exportFields
                      .map((field) => headerMapping[field] || field)
                      .join(',');

                    const csvData = dataToExport
                      .map((row) =>
                        exportFields
                          .map((field) => {
                            const value = row[field as keyof typeof row];

                            if (field === 'createDate') {
                              return dayjs(value as string).format('DD/MM/YYYY');
                            }
                            if (field === 'amount') {
                              return `${(value as number).toFixed(2)}`;
                            }
                            if (field === 'status') {
                              const statusMapping: Record<string, string> = {
                                paid: 'Payée',
                                pending: 'En attente',
                                refunded: 'Remboursée',
                                failed: 'Échoué',
                              };
                              return statusMapping[value as string] || value;
                            }
                            return typeof value === 'string' && value.includes(',')
                              ? `"${value}"`
                              : value;
                          })
                          .join(',')
                      )
                      .join('\n');

                    const csv = `${headers}\n${csvData}`;

                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);

                    const fileName = `toutes_factures_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
                    link.setAttribute('download', fileName);

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success(`Export de ${dataToExport.length} facture(s) réussi`);
                  };

                  exportAllData();
                }}
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
                  amountError={amountError}
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
                      <PaymentTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        hideStatus={!!filters.state.status && filters.state.status !== 'all'}
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

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer <strong> {table.selected.length} </strong> factures?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </Box>
  );
}

type ApplyFilterProps = {
  dateError: boolean;
  amountError: boolean;
  inputData: IPaymentItem[];
  filters: IPaymentFilters;
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

  if (operator === 'equals' || operator === 'less-than' || operator === 'greater-than') {
    const numValue = parseFloat(value);
    const numFilter = parseFloat(filterValue);
    if (Number.isNaN(numValue) || Number.isNaN(numFilter)) return false;

    if (operator === 'equals') {
      return numValue === numFilter;
    }
    if (operator === 'less-than') {
      return numValue < numFilter;
    }
    if (operator === 'greater-than') {
      return numValue > numFilter;
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

function applyFilter({ inputData, comparator, filters, dateError, amountError }: ApplyFilterProps) {
  const {
    name,
    status,
    subscriptions,
    startDate,
    endDate,
    paymentMethod,
    hasInvoice,
    minAmount,
    maxAmount,
  } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (payment) =>
        payment.transactionId.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        payment.subscriber?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (paymentMethod) {
    inputData = inputData.filter(
      (payment) => payment.paymentMethod.toLowerCase().indexOf(paymentMethod.toLowerCase()) !== -1
    );
  }
  if (hasInvoice) {
    inputData = inputData.filter((payment) => payment.invoiceGenerated === hasInvoice);
  }
  if (status && status !== 'all') {
    inputData = inputData.filter((payment) => payment.status === status);
  }
  if (subscriptions.length) {
    inputData = inputData.filter((payment) =>
      payment.subscriptions.some((subscription) =>
        subscriptions.some((filterItem) => filterItem === subscription.title)
      )
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((payment) =>
        fIsBetween(payment.paymentDate, startDate, endDate)
      );
    }
  }
  if (!amountError) {
    if (minAmount !== undefined && maxAmount !== undefined) {
      inputData = inputData.filter(
        (payment) => payment.amount >= minAmount && payment.amount <= maxAmount
      );
    } else if (minAmount !== undefined) {
      inputData = inputData.filter((payment) => payment.amount >= minAmount);
    } else if (maxAmount !== undefined) {
      inputData = inputData.filter((payment) => payment.amount <= maxAmount);
    }
  }

  return inputData;
}
