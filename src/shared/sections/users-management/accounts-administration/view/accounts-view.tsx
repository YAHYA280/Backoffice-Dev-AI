'use client';

import type { IUserItem, IUserTableFilters } from 'src/contexts/types/user';

import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo, useState, useEffect, useCallback } from 'react';

import { Box, Tab, Card, Tabs, Table, Button, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { fIsAfter } from 'src/utils/format-time';

import { _STATUS_OPTIONS } from 'src/shared/_mock';
import { varAlpha } from 'src/shared/theme/styles';
import { _listUsers } from 'src/shared/_mock/_user';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { Label } from 'src/shared/components/label';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';
import { useTable, TableNoData, getComparator, TablePaginationCustom } from 'src/shared/components/table';

import { UserNewForm } from '../user-new-form';
import { UserTableRow } from '../user-table-row';
import { TableHeadWithFilters } from '../table-head-with-filters';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

const listUsers = _listUsers;
const STATUS = [{ value: 'Tous', label: 'Tous' }, ..._STATUS_OPTIONS];
const TABLE_HEAD = [
  { id: 'name', label: 'Nom', width: 150 },
  { id: 'email', label: 'Email', width: 150 },
  { id: 'role', label: 'Rôle', width: 130 },
  { id: 'statut', label: 'Statut', width: 130 },
  { id: 'createdAt', label: 'Date de création', width: 160 },
  { id: 'lastLogin', label: 'Dernière connexion', width: 190 },
  { id: 'actions', label: '', width: 60, sx: { textAlign: 'center' } },
];

type Props = { title?: string };

export function AccountsView({ title = 'Liste des utilisateurs' }: Props) {
  const table = useTable();
  const newForm = useBoolean();
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

  useEffect(() => {
    const baseFiltered = applyFilter({
      inputData: listUsers,
      comparator: getComparator(table.order, table.orderBy),
      filters: { ...filters.state, statut: [] },
      dateError,
    });
    setBaseFilteredData(baseFiltered);
    const finalFiltered =
      !filters.state.statut.length || filters.state.statut.includes('Tous')
        ? baseFiltered
        : baseFiltered.filter((user) => filters.state.statut.includes(user.status));
    setTotalRows(finalFiltered.length);
    const start = table.page * table.rowsPerPage;
    const end = start + table.rowsPerPage;
    setTableData(finalFiltered.slice(start, end));
  }, [filters.state, table.order, table.orderBy, dateError, table.page, table.rowsPerPage]);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      table.onResetPage();
      filters.setState({ statut: newValue === 'Tous' ? [] : [newValue] });
    },
    [filters, table]
  );

  const computedTableHead = useMemo(() => {
    if (filters.state.statut.length > 0 && filters.state.statut.includes('Suspendu')) {
      const filteredHead = TABLE_HEAD.filter((col) => col.id !== 'statut');
      const lastLoginIndex = filteredHead.findIndex((col) => col.id === 'lastLogin');
      const dureRestanteColumn = { id: 'dureRestante', label: 'Durée Restante', width: 160 };
      return [
        ...filteredHead.slice(0, lastLoginIndex + 1),
        dureRestanteColumn,
        ...filteredHead.slice(lastLoginIndex + 1),
      ];
    }
    return TABLE_HEAD;
  }, [filters.state.statut]);

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
  {/* Desktop View */}
  <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <CustomBreadcrumbs
      heading="Comptes utilisateurs"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Utilisateurs', href: paths.dashboard.users.accounts },
        { name: 'Comptes' },
      ]}
      sx={{ flex: 1 }}
    />
    
    <Button
  onClick={newForm.onTrue}
  variant="contained"
  startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
  sx={{ ml: 2, mt: 2 }}
>
  Ajouter
</Button>
  </Box>
  
  {/* Mobile View */}
  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
    <CustomBreadcrumbs
      heading="Comptes utilisateurs"
      links={[
        { name: 'Dashboard', href: paths.dashboard.root },
        { name: 'Utilisateurs', href: paths.dashboard.user.root },
        { name: 'Comptes' },
      ]}
      sx={{ mb: 2 }}
    />
    
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <Button
        onClick={newForm.onTrue}
        variant="contained"
        startIcon={<FontAwesomeIcon icon={faPlus} style={{ width: 20 }} />}
      >
        Ajouter
      </Button>
      </Box>
    </Box>
  </Box>
      <UserNewForm open={newForm.value} onClose={newForm.onFalse} />
      <Card>
        <Tabs
          value={filters.state.statut[0] || 'Tous'}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
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
                    ((tab.value === 'Tous' || filters.state.statut.includes(tab.value)) && 'filled') ||
                    'soft'
                  }
                  sx={{
                    ...(tab.value === 'Tous' && {
                      color: '#FFFFFF',
                      backgroundColor: 'rgba(33, 33, 33, 0.5)',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'Actif' && {
                      color: '#FFFFFF',
                      backgroundColor: '#22bb33',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'Bloqué' && {
                      color: '#FFFFFF',
                      backgroundColor: '#212121',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'Supprimé' && {
                      color: '#FFFFFF',
                      backgroundColor: '#F44336',
                      fontWeight: 'bold',
                    }),
                    ...(tab.value === 'Suspendu' && {
                      color: '#FFFFFF',
                      backgroundColor: '#FF9800',
                      fontWeight: 'bold',
                    }),
                  }}
                >
                  {tab.value === 'Tous'
                    ? baseFilteredData.length
                    : baseFilteredData.filter((user) => user.status === tab.value).length}
                </Label>
              }
            />
          ))}
          <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              width: '100%' 
            }}>
              <Button
                sx={{
                  height: 36,
                  width: 85,
                  m: 1
                }}
                variant="contained"
                onClick={() => console.log('Export vers Excel déclenché')}
              >
                Exporter
              </Button>
            </Box>
        </Tabs>
        <Box sx={{ overflowX: 'auto' }}>
          <Scrollbar>
            <Table size="medium" sx={{ width: '100%', minWidth: { xs: 'auto', sm: 720 } }}>
              <TableHeadWithFilters
                columns={computedTableHead}
                filters={filters}
                dateError={dateError}
                order={table.order}
                orderBy={table.orderBy}
                onSort={table.onSort}
                totalResults={totalRows}
              />
              <TableBody>
                {tableData.map((row) => (
                  <UserTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    statusFilter={filters.state.statut.length ? filters.state.statut[0] : 'Tous'}
                  />
                ))}
                {notFound && <TableNoData notFound />}
              </TableBody>
            </Table>
          </Scrollbar>
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
    </DashboardContent>
  );
}

type ApplyFilterProps = {
  dateError: boolean;
  inputData: IUserItem[];
  filters: IUserTableFilters;
  comparator: (a: any, b: any) => number;
};

function applyFilter({ inputData, comparator, filters, dateError }: ApplyFilterProps) {
  let data = [...inputData];
  data.sort(comparator);
  if (filters.name) {
    data = data.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
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
    const userCreated = dayjs(user.createdAt, 'DD/MM/YYYY', true);
    const userLogged = dayjs(user.lastLogin, 'DD/MM/YYYY', true);
    if (filters.createdAt && !filters.lastLogin) {
      if (!userCreated.isValid() || !dayjs(filters.createdAt).isValid()) return false;
      return userCreated.isSameOrAfter(filters.createdAt);
    }
    if (!filters.createdAt && filters.lastLogin) {
      if (!userLogged.isValid() || !dayjs(filters.lastLogin).isValid()) return false;
      return userLogged.isSameOrAfter(filters.lastLogin);
    }
    if (filters.createdAt && filters.lastLogin) {
      if (
        !userCreated.isValid() ||
        !userLogged.isValid() ||
        !dayjs(filters.createdAt).isValid() ||
        !dayjs(filters.lastLogin).isValid()
      )
        return false;
      return userCreated.isSameOrAfter(filters.createdAt) && userLogged.isSameOrBefore(filters.lastLogin);
    }
    return true;
  });
  return data;
}