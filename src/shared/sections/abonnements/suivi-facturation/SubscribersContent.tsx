'use client';

import type { ISubscriberItem, ISubscriberFilters } from 'src/contexts/types/subscriber';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  faFilter,
  faTrashAlt,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Card,
  Tabs,
  List,
  Table,
  Button,
  Divider,
  Tooltip,
  ListItem,
  Checkbox,
  TableBody,
  TextField,
  FormControlLabel,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/shared/theme/styles';
import { abonnementItems, PAYMENT_METHOD_OPTIONS } from 'src/shared/_mock/';
import {
  _subscribers,
  BILLING_CYCLE_OPTIONS,
  SUBSCRIBER_STATUS_OPTIONS,
} from 'src/shared/_mock/_subscriber';

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

import { SubscriberTableRow } from './subscriberComponent/subscriber-table-row';
import { TableHeadWithFilters } from './subscriberComponent/table-head-with-filters';
import { SubscriberTableToolbar } from './subscriberComponent/subscriber-table-toolbar';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const TABLE_HEAD = [
  { id: '', label: '', width: 50, isFilterable: false },
  { id: 'name', label: 'Client', width: 150, isFilterable: false },
  { id: 'email', label: 'Email', width: 160, isFilterable: true },
  { id: 'phone', label: 'Téléphone', width: 130, isFilterable: true },
  { id: 'subscriptionStartDate', label: 'Date de début', width: 130, isFilterable: true },
  { id: 'subscriptionEndDate', label: 'Date de fin', width: 130, isFilterable: true },
  { id: 'status', label: 'Statut', width: 100, isFilterable: true },
  {
    id: 'actions',
    label: 'Actions',
    width: 100,
    sx: { textAlign: 'center' },
    isFilterable: false,
  },
];
const STATUS = [{ value: 'all', label: 'Tous' }, ...SUBSCRIBER_STATUS_OPTIONS];

export function SubscribersContent() {
  const popover = usePopover();

  const confirm = useBoolean();

  const theme = useTheme();
  const table = useTable();
  const [tableData, setTableData] = useState<ISubscriberItem[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<ISubscriberItem[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(TABLE_HEAD);
  const [search, setSearch] = useState('');
  const filters = useSetState<ISubscriberFilters>({
    name: '',
    email: '',
    status: '',
    subscriptions: [],
    startDate: null,
    endDate: null,
  });
  const dateError = fIsAfter(filters.state.startDate, filters.state.endDate);
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
  
    // Include all relevant subscriber fields
    const exportFields = [
      'name',
      'email',
      'phone',
      'address',
      'subscriptionStartDate',
      'subscriptionEndDate',
      'status',
      'paymentMethod',
      'billingCycle',
      'lastPaymentDate',
    ] as const;
  
    const headerMapping: Record<string, string> = {
      name: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      subscriptionStartDate: 'Date de début d\'abonnement',
      subscriptionEndDate: 'Date de fin d\'abonnement',
      status: 'Statut',
      paymentMethod: 'Méthode de paiement',
      billingCycle: 'Cycle de facturation',
      lastPaymentDate: 'Date du dernier paiement',
    };
  
    const headers = exportFields.map((field) => headerMapping[field] || field).join(',');
  
    const escapeCsvValue = (value: any): string => {
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      // Escape any value that contains quotes, commas, or newlines
      if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };
  
    const csvData = dataToExport
      .map((row) =>
        exportFields
          .map((field) => {
            const value = row[field as keyof typeof row];
            
            // Format dates
            if (field === 'subscriptionStartDate' || field === 'subscriptionEndDate' || field === 'lastPaymentDate') {
              return value ? escapeCsvValue(dayjs(value as string).format('DD/MM/YYYY')) : '';
            }
            
            // Format status
            if (field === 'status') {
              const getStatusLabel = (a: string | undefined): string => {
                if (!a) return '';
                const status = SUBSCRIBER_STATUS_OPTIONS.find((option) => option.value === a);
                return status ? status.label : a;
              };
              return escapeCsvValue(getStatusLabel(value as string | undefined));
            }
            
            // Format payment method
            if (field === 'paymentMethod') {
              const getMethodLabel = (a: string | undefined): string => {
                if (!a) return '';
                const method = PAYMENT_METHOD_OPTIONS.find((option) => option.value === a);
                return method ? method.label : a;
              };
              return escapeCsvValue(getMethodLabel(value as string | undefined));
            }
            
            // Format billing cycle
            if (field === 'billingCycle') {
              const getCycleLabel = (a: string | undefined): string => {
                if (!a) return '';
                const cycle = BILLING_CYCLE_OPTIONS.find((option) => option.value === a);
                return cycle ? cycle.label : a;
              };
              return escapeCsvValue(getCycleLabel(value as string | undefined));
            }
            
            return escapeCsvValue(value);
          })
          .join(',')
      )
      .join('\n');
  
    const csv = `${headers}\n${csvData}`;
  
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
  
      const fileName = `abonnes_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
      link.setAttribute('download', fileName);
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
  
      toast.success(`Export de ${dataToExport.length} abonné(s) réussi`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Erreur lors de l\'export CSV');
    }
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

  const applyColumnFilters = useCallback(
    (data: ISubscriberItem[]) =>
      data.filter((subscriber) =>
        Object.entries(columnFilters).every(([key, value]) => {
          if (!value) return true;
  
          const statusOption = SUBSCRIBER_STATUS_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
          const billingCycleOption = BILLING_CYCLE_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
          const paymentMethodOption = PAYMENT_METHOD_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
  
          switch (key) {
            case 'name':
              return subscriber.name.toLowerCase().includes(value.toLowerCase());
  
            case 'email':
              return subscriber.email.toLowerCase().includes(value.toLowerCase());
  
            case 'phone':
              return subscriber.phone.toLowerCase().includes(value.toLowerCase());
              
            case 'subscriptionStartDate':
              return true;
              
            case 'subscriptionEndDate':
              return true;
  
            case 'status':
              if (statusOption) {
                return subscriber.status === statusOption.value;
              }
              return subscriber.status.toLowerCase().includes(value.toLowerCase());
              
            case 'billingCycle':
              if (billingCycleOption) {
                return subscriber.billingCycle === billingCycleOption.value;
              }
              return subscriber.billingCycle.toLowerCase().includes(value.toLowerCase());
              
            case 'paymentMethod':
              if (paymentMethodOption) {
                return subscriber.paymentMethod === paymentMethodOption.value;
              }
              return subscriber.paymentMethod.toLowerCase().includes(value.toLowerCase());
  
            default:
              return true;
          }
        })
      ),
    [columnFilters]
  );

  const applyDateFilters = useCallback(
    (data: ISubscriberItem[]) => {
      if (!filters.state.startDate && !filters.state.endDate) {
        return data;
      }
  
      return data.filter((subscriber) => {
        const subscriptionStartDate = dayjs(subscriber.subscriptionStartDate);
        const isAfterStartDate =
          !filters.state.startDate ||
          subscriptionStartDate.isAfter(filters.state.startDate, 'day') ||
          subscriptionStartDate.isSame(filters.state.startDate, 'day');
        const isBeforeEndDate =
          !filters.state.endDate ||
          subscriptionStartDate.isBefore(filters.state.endDate, 'day') ||
          subscriptionStartDate.isSame(filters.state.endDate, 'day');
  
        return isAfterStartDate && isBeforeEndDate;
      });
    },
    [filters.state.startDate, filters.state.endDate]
  );
  useEffect(() => {
    // Remove the updatePaymentsWithInvoices call as it's not relevant for subscribers
    
    const baseFiltered = applyFilter({
      inputData: _subscribers, 
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters.state, status: 'all' },
      dateError,
      amountError: false,
    });
  
    setBaseFilteredData(baseFiltered);
    
    const statusFiltered =
      !filters.state.status || filters.state.status === 'all'
        ? baseFiltered
        : baseFiltered.filter((subscriber) => filters.state.status === subscriber.status);
    
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
    table.page,
    table.rowsPerPage,
    columnFilters,
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
                    ...(tab.value === 'active' && {
                      color: '#FFFFFF',
                      backgroundColor: '#28a745',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'failed' && {
                      color: '#FFFFFF',
                      backgroundColor: '#424242',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'inactive' && {
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
          <SubscriberTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
            options={{
              subscriptions: abonnementItems.map((option) => option.title),
            }}
          />

          <Box>
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
            <Tooltip title="Filtrer par colonne" arrow>
              <Button
                sx={{
                  height: 36,
                  width: 36,
                  m: 0,
                  padding: 0,
                }}
                onClick={popover.onOpen}
              >
                <FontAwesomeIcon icon={faFilter} />
              </Button>
            </Tooltip>
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

            <Tooltip title="Exporter toutes les données" arrow>
              <Button
                sx={{
                  height: 36,
                  width: 36,
                  m: 0,
                  padding: 0,
                }}
                onClick={() => {
                  const exportAllData = () => {
                    // Utiliser baseFilteredData pour exporter toutes les données filtrées
                    const dataToExport = baseFilteredData;
                  
                    if (dataToExport.length === 0) {
                      toast.error('Aucune donnée à exporter');
                      return;
                    }
                  
                    // Same fields as the main export function
                    const exportFields = [
                      'name',
                      'email',
                      'phone',
                      'address',
                      'subscriptionStartDate',
                      'subscriptionEndDate',
                      'status',
                      'paymentMethod',
                      'billingCycle',
                      'lastPaymentDate',
                    ] as const;
                  
                    const headerMapping: Record<string, string> = {
                      name: 'Nom',
                      email: 'E-mail',
                      phone: 'Téléphone',
                      address: 'Adresse',
                      subscriptionStartDate: 'Date de début d\'abonnement',
                      subscriptionEndDate: 'Date de fin d\'abonnement',
                      status: 'Statut',
                      paymentMethod: 'Méthode de paiement',
                      billingCycle: 'Cycle de facturation',
                      lastPaymentDate: 'Date du dernier paiement',
                    };
                  
                    const headers = exportFields
                      .map((field) => headerMapping[field] || field)
                      .join(',');
                  
                    const escapeCsvValue = (value: any): string => {
                      if (value === null || value === undefined) return '';
                      const stringValue = String(value);
                      if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
                        return `"${stringValue.replace(/"/g, '""')}"`;
                      }
                      return stringValue;
                    };
                  
                    const csvData = dataToExport
                      .map((row) =>
                        exportFields
                          .map((field) => {
                            const value = row[field as keyof typeof row];
                            
                            // Format dates
                            if (field === 'subscriptionStartDate' || field === 'subscriptionEndDate' || field === 'lastPaymentDate') {
                              return value ? escapeCsvValue(dayjs(value as string).format('DD/MM/YYYY')) : '';
                            }
                            
                            // Format status
                            if (field === 'status') {
                              const getStatusLabel = (a: string | undefined): string => {
                                if (!a) return '';
                                const status = SUBSCRIBER_STATUS_OPTIONS.find((option) => option.value === a);
                                return status ? status.label : a;
                              };
                              return escapeCsvValue(getStatusLabel(value as string | undefined));
                            }
                            
                            // Format payment method
                            if (field === 'paymentMethod') {
                              const getMethodLabel = (a: string | undefined): string => {
                                if (!a) return '';
                                const method = PAYMENT_METHOD_OPTIONS.find((option) => option.value === a);
                                return method ? method.label : a;
                              };
                              return escapeCsvValue(getMethodLabel(value as string | undefined));
                            }
                            
                            // Format billing cycle
                            if (field === 'billingCycle') {
                              const getCycleLabel = (a: string | undefined): string => {
                                if (!a) return '';
                                const cycle = BILLING_CYCLE_OPTIONS.find((option) => option.value === a);
                                return cycle ? cycle.label : a;
                              };
                              return escapeCsvValue(getCycleLabel(value as string | undefined));
                            }
                            
                            return escapeCsvValue(value);
                          })
                          .join(',')
                      )
                      .join('\n');
                  
                    const csv = `${headers}\n${csvData}`;
                  
                    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                  
                    const fileName = `tous_abonnes_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
                    link.setAttribute('download', fileName);
                  
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // Clean up
                    setTimeout(() => {
                      URL.revokeObjectURL(url);
                    }, 100);
                  
                    toast.success(`Export de ${dataToExport.length} abonné(s) réussi`);
                  };

                  exportAllData();
                }}
              >
                <FontAwesomeIcon icon={faFileExport} />
              </Button>
            </Tooltip>
          </Box>
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
                  onSelectAllRows={(checked: boolean) =>
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
                      <SubscriberTableRow
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
  inputData: ISubscriberItem[];
  filters: ISubscriberFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ 
  inputData, 
  comparator, 
  filters, 
  dateError 
}: ApplyFilterProps) {
  const {
    name,
    email,
    status,
    subscriptions,
    startDate,
    endDate,
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
    (subscriber) => subscriber.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
  );
}

if (email) {
  inputData = inputData.filter(
    (subscriber) => subscriber.email.toLowerCase().indexOf(email.toLowerCase()) !== -1
  );
}

if (status && status !== 'all') {
  inputData = inputData.filter((subscriber) => subscriber.status === status);
}

if (subscriptions.length) {
  inputData = inputData.filter((subscriber) =>
    subscriber.subscriptions.some((subscription) =>
      subscriptions.some((filterItem) => filterItem === subscription.title)
    )
  );
}

if (!dateError) {
  if (startDate && endDate) {
    inputData = inputData.filter((subscriber) =>
      fIsBetween(subscriber.subscriptionStartDate, startDate, endDate)
    );
  }
}

  return inputData;
}
