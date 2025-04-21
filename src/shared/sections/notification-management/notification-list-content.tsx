'use client';

import type { INotificationType, INotificationFilters } from 'src/contexts/types/notification';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  faPlus,
  faColumns,
  faSyncAlt,
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
  Stack,
  Button,
  Divider,
  Tooltip,
  ListItem,
  Checkbox,
  TableBody,
  TextField,
  IconButton,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter, fIsBetween } from 'src/utils/format-time';

import { varAlpha } from 'src/shared/theme/styles';
import { _notifications, NOTIFICATION_TYPE_OPTIONS, NOTIFICATION_STATUS_OPTIONS, NOTIFICATION_CHANNEL_OPTIONS } from 'src/shared/_mock/_notification';

import { Label } from 'src/shared/components/label';
import { toast } from 'src/shared/components/snackbar';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';
import {
  useTable,
  TableNoData,
  getComparator,
  TablePaginationCustom,
} from 'src/shared/components/table';

import { NotificationTableRow } from './notificationComponent/notification-table-row';
import { TableHeadWithFilters } from './notificationComponent/table-head-with-filters';
import { NotificationTableToolbar } from './notificationComponent/notification-table-toolbar';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const TABLE_HEAD = [
  { id: '', label: '', width: 50, isFilterable: false },
  { id: 'title', label: 'Titre', width: 150, isFilterable: true },
  {
    id: 'sentDate',
    label: 'Date d\'envoi',
    width: 160,
    isFilterable: true,
  },
  { id: 'type', label: 'Type', width: 130, isFilterable: true },
  { id: 'channel', label: 'Canal', width: 130, isFilterable: true },
  { id: 'status', label: 'Statut', width: 130, isFilterable: true },
  { id: 'recipients', label: 'Destinataires', width: 150, isFilterable: true },
  {
    id: 'actions',
    label: 'Actions',
    width: 100,
    sx: { textAlign: 'center' },
    isFilterable: false,
  },
];

export function NotificationContent() {
  const router = useRouter();
  const popover = usePopover();

  const confirm = useBoolean();

  const theme = useTheme();
  const table = useTable();
  const [tableData, setTableData] = useState<INotificationType[]>([]);
  const [baseFilteredData, setBaseFilteredData] = useState<INotificationType[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [visibleColumns, setVisibleColumns] = useState(TABLE_HEAD);
  const [search, setSearch] = useState('');
  const filters = useSetState<INotificationFilters>({
    title: '',
    type: '',
    status: '',
    channel: '',
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

    const exportFields = [
      'title',
      'sentDate',
      'type',
      'channel',
      'status',
      'recipients',
      'content',
    ] as const;

    const headerMapping: Record<string, string> = {
      title: 'Titre',
      sentDate: 'Date d\'envoi',
      type: 'Type',
      channel: 'Canal',
      status: 'Statut',
      recipients: 'Destinataires',
      content: 'Message',
    };

    const headers = exportFields.map((field) => headerMapping[field] || field).join(',');

    const csvData = dataToExport
      .map((row) =>
        exportFields
          .map((field) => {
            const value = row[field as keyof typeof row];
            if (field === 'sentDate') {
              return dayjs(value as string).format('DD/MM/YYYY');
            }
            if (field === 'channel') {
              // Handle array of channels
              return `"${Array.isArray(value) ? value.join(', ') : value}"`;
            }
            if (field === 'status') {
              const getStatusLabel = (a: string): string => {
                const status = NOTIFICATION_STATUS_OPTIONS.find((option) => option.value === a);
                return status ? status.label : a;
              };
              return getStatusLabel(value as string);
            }
            if (field === 'type') {
              const getTypeLabel = (a: string): string => {
                const type = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === a);
                return type ? type.label : a;
              };
              return getTypeLabel(value as string);
            }
            if (field === 'recipients') {
              // Handle recipients object
              const recipients = value as { name: string; count: number };
              return `"${recipients.name} (${recipients.count})"`;
            }
            if (field === 'content') {
              // Escape any commas or quotes in the content
              return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                ? `"${value.replace(/"/g, '""')}"` 
                : value;
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

    const fileName = `notifications_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
    link.setAttribute('download', fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Export de ${dataToExport.length} notification(s) réussi`);
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

  const handleUpdateNotification = useCallback(
    (updatedNotification: INotificationType) => {
      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === updatedNotification.id ? updatedNotification : item
        )
      );
      
      setBaseFilteredData((prevData) =>
        prevData.map((item) =>
          item.id === updatedNotification.id ? updatedNotification : item
        )
      );
      
      toast.success('Notification mise à jour avec succès!');
    },
    []
  );

  const handleReset = () => {
    setVisibleColumns(TABLE_HEAD);
    setSearch('');
  };
  const handleResetAll = () => {
    filters.setState({
      title: '',
      type: '',
      status: '',
      channel: '',
      startDate: null,
      endDate: null,
    });

    // Réinitialisez également les filtres de colonnes et la recherche
    setColumnFilters({});
    setSearch('');

    // Réinitialisez la pagination
    table.onResetPage();
  };

  const canReset =
    filters.state.title !== '' ||
    filters.state.type !== '' ||
    filters.state.channel !== '' ||
    (filters.state.startDate !== null && filters.state.startDate !== undefined) ||
    (filters.state.endDate !== null && filters.state.endDate !== undefined) ||
    filters.state.status !== '' ||
    Object.keys(columnFilters).length > 0 ||
    search !== '';

  const applyColumnFilters = useCallback(
    (data: INotificationType[]) =>
      data.filter((notification) =>
        Object.entries(columnFilters).every(([key, value]) => {
          if (!value) return true;

          const typeOption = NOTIFICATION_TYPE_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
          const channelOption = NOTIFICATION_CHANNEL_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );
          const statusOption = NOTIFICATION_STATUS_OPTIONS.find((option) =>
            option.label.toLowerCase().includes(value.toLowerCase())
          );

          switch (key) {
            case 'title':
              return notification.title.toLowerCase().includes(value.toLowerCase());

            case 'sentDate':
              return true;

            case 'type':
              if (typeOption) {
                return notification.type === typeOption.value;
              }
              return notification.type.toLowerCase().includes(value.toLowerCase());

            case 'channel':
              if (channelOption) {
                return notification.channel.includes(channelOption.value);
              }
              return notification.channel.some(ch =>
                ch.toLowerCase().includes(value.toLowerCase())
              );

            case 'recipients':
              if (Array.isArray(notification.recipients)) {
                // If it's an array of subscribers, check if any subscriber name matches
                return notification.recipients.some(subscriber =>
                  subscriber.name.toLowerCase().includes(value.toLowerCase())
                );
              }
              // If it's a group object with name and count
              return notification.recipients.name.toLowerCase().includes(value.toLowerCase());

            case 'status':
              if (statusOption) {
                return notification.status === statusOption.value;
              }
              return notification.status.toLowerCase().includes(value.toLowerCase());

            default:
              return true;
          }
        })
      ),
    [columnFilters]
  );

  const applyDateFilters = useCallback(
    (data: INotificationType[]) => {
      if (!filters.state.startDate && !filters.state.endDate) {
        return data;
      }

      return data.filter((notification) => {
        const sentDate = dayjs(notification.sentDate);
        const isAfterStartDate =
          !filters.state.startDate ||
          sentDate.isAfter(filters.state.startDate, 'day') ||
          sentDate.isSame(filters.state.startDate, 'day');
        const isBeforeEndDate =
          !filters.state.endDate ||
          sentDate.isBefore(filters.state.endDate, 'day') ||
          sentDate.isSame(filters.state.endDate, 'day');

        return isAfterStartDate && isBeforeEndDate;
      });
    },
    [filters.state.startDate, filters.state.endDate]
  );
  useEffect(() => {
    const baseFiltered = applyNotificationFilter({
      inputData: _notifications,
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters.state, status: 'all' },
      dateError,
    });

    setBaseFilteredData(baseFiltered);
    const statusFiltered =
      !filters.state.status || filters.state.status === 'all'
        ? baseFiltered
        : baseFiltered.filter((notification) => filters.state.status === notification.status);
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
      <CustomBreadcrumbs
        heading="Gestion des notifications"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Gestion des notifications' },
        ]}
        action={
          <Button
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={() => router.push('/dashboard/notifications/new/')}
            sx={{
              color: 'primary.contrastText',
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Ajouter une notification
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <Tabs
          value={filters.state.status || 'all'}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            mb: 2,
            boxShadow: (themes) =>
              `inset 0 -2px 0 0 ${varAlpha(themes.vars.palette.grey['500Channel'], 0.08)}`,
          }}
        >

          {[{ value: 'all', label: 'Tous' }, ...NOTIFICATION_STATUS_OPTIONS].map((tab) => (
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
                    ...(tab.value === 'sent' && {
                      color: '#FFFFFF',
                      backgroundColor: '#28a745',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'failed' && {
                      color: '#FFFFFF',
                      backgroundColor: '#424242',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'pending' && {
                      color: '#FFFFFF',
                      backgroundColor: '#FFB300',
                      fontWeight: 'bold',
                    }),
                  }}
                >
                  {tab.value === 'all'
                    ? baseFilteredData.length
                    : baseFilteredData.filter((notification) => notification.status === tab.value).length}
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
          <NotificationTableToolbar
            filters={filters}
            onResetPage={table.onResetPage}
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
            <Tooltip title="Sélectionner colonnes" arrow>
              <Button
                variant="outlined"
                color="primary"
                onClick={popover.onOpen}
                startIcon={<FontAwesomeIcon icon={faColumns} size='sm'/>}
                sx={{
                  minWidth: 100,
                  borderRadius: 1,
                  transition: theme.transitions.create(['background-color']),
                  ...(popover.open && {
                    bgcolor: 'primary.lighter',
                  }),
                }}
                size='medium'
              >
                Colonnes
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
            <Tooltip title="Réinitialiser" arrow>
              <IconButton
                color="primary"
                onClick={handleResetAll}
                sx={{
                  p: 1,
                  position: 'relative',
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <FontAwesomeIcon icon={faSyncAlt} size='sm'/>
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
            <Tooltip title="Exporter" arrow>
              <IconButton
                color="primary"
                sx={{
                  p: 1,
                  transition: theme.transitions.create(['transform', 'box-shadow']),
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
                onClick={() => {
                  const exportAllData = () => {
                    const dataToExport = baseFilteredData;

                    if (dataToExport.length === 0) {
                      toast.error('Aucune donnée à exporter');
                      return;
                    }

                    const exportFields = [
                      'title',
                      'sentDate',
                      'type',
                      'channel',
                      'status',
                      'content',
                    ] as const;

                    const headerMapping: Record<string, string> = {
                      title: 'Titre',
                      sentDate: 'Date d\'envoi',
                      type: 'Type',
                      channel: 'Canal',
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

                            if (field === 'sentDate') {
                              return dayjs(value as string).format('DD/MM/YYYY');
                            }
                            if (field === 'channel') {
                              return `"${Array.isArray(value) ? value.join(', ') : value}"`;
                            }
                            if (field === 'status') {
                              const getStatusLabel = (a: string): string => {
                                const status = NOTIFICATION_STATUS_OPTIONS.find((option) => option.value === a);
                                return status ? status.label : a;
                              };
                              return getStatusLabel(value as string);
                            }
                            if (field === 'type') {
                              const getTypeLabel = (a: string): string => {
                                const type = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === a);
                                return type ? type.label : a;
                              };
                              return getTypeLabel(value as string);
                            }
                            if (field === 'content') {                
                              return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                                ? `"${value.replace(/"/g, '""')}"` 
                                : value;
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

                    const fileName = `notifications_export_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
                    link.setAttribute('download', fileName);

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    toast.success(`Export de ${dataToExport.length} notification(s) réussi`);
                  };

                  exportAllData();
                }}
              >
                <FontAwesomeIcon icon={faFileExport} size='sm'/>
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
                  minWidth: '1300px',
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
                    minWidth: '1200px',
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
                      <NotificationTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        hideStatus={!!filters.state.status && filters.state.status !== 'all'}
                        visibleColumns={visibleColumns}
                        onUpdateNotification={handleUpdateNotification}
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
            Êtes-vous sûr de vouloir supprimer <strong> {table.selected.length} </strong> notification(s)?
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

type ApplyNotificationFilterProps = {
  dateError: boolean;
  inputData: INotificationType[];
  filters: INotificationFilters;
  comparator: (a: any, b: any) => number;
};

function applyNotificationFilter({ inputData, comparator, filters, dateError }: ApplyNotificationFilterProps) {
  const {
    title,
    type,
    status,
    channel,
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

  if (title) {
    inputData = inputData.filter(
      (notification) => notification.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    );
  }

  if (type) {
    inputData = inputData.filter(
      (notification) => notification.type.toLowerCase().indexOf(type.toLowerCase()) !== -1
    );
  }

  if (channel) {
    inputData = inputData.filter(
      (notification) => notification.channel.some(ch =>
        ch.toLowerCase().indexOf(channel.toLowerCase()) !== -1
      )
    );
  }

  if (status && status !== 'all') {
    inputData = inputData.filter((notification) => notification.status === status);
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((notification) =>
        fIsBetween(notification.sentDate, startDate, endDate)
      );
    }
  }

  return inputData;
}