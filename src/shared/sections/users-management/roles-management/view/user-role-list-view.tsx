'use client';

import type { IRoleItem } from 'src/contexts/types/role';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Box, Tooltip, IconButton } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { endpoints } from 'src/utils/axios';

import { GATEWAY_API_URL } from 'src/config-global';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { toast } from 'src/shared/components/snackbar';
import { EmptyContent } from 'src/shared/components/empty-content';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import CustomToolbar from '../components/CustomToolbar';
import CustomColumnHeader from '../components/CustomColumnHeader';
import { UserRoleDetailsDrawer } from '../user-role-details-view';
import {
  RenderCellName,
  RenderCellCreatedAt,
  RenderCellDescription,
} from '../components/RenderCells';

// ----------------------------------------------------------------------

// Define TABLE_HEAD
const TABLE_HEAD = [
  { id: 'name', label: 'Nom du rôle', width: 180 },
  { id: 'description', label: 'Description', width: 500 },
  { id: 'createdAt', label: 'Date de création', width: 250 },
  { id: 'actions', label: 'Actions', width: 100 },
];

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export function UserRoleListView() {
  const confirmRows = useBoolean();

  const [tableData, setTableData] = useState<IRoleItem[]>([]);

  const [filteredData, setFilteredData] = useState<IRoleItem[]>([]);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [selectedRoleDetails, setSelectedRoleDetails] = useState<IRoleItem | null>(null);

  const confirmDelete = useBoolean();
  const roleAssignedWarning = useBoolean();

  const [roleToDelete, setRoleToDelete] = useState<IRoleItem | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: 'get',
        url: `${GATEWAY_API_URL}${endpoints.role.list}`,
        headers: { 'Content-Type': 'application/json' },
      });

      const transformedData = response.data.content.map((roleItem: any): IRoleItem => {
        const createdAtDate = new Date(
          roleItem.createdAt[0],
          roleItem.createdAt[1] - 1,
          roleItem.createdAt[2],
          roleItem.createdAt[3],
          roleItem.createdAt[4],
          roleItem.createdAt[5]
        );

        return {
          id: roleItem.id,
          name: roleItem.name,
          description: roleItem.description,
          permissions: roleItem.permissions,
          createdAt: createdAtDate,
        };
      });

      setTableData(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleColumnSearch = useCallback(
    (field: keyof IRoleItem, value: string | Date | null) => {
      if (!value) {
        setFilteredData(tableData);
        return;
      }

      const filtered = tableData.filter((row) => {
        if (field === 'createdAt' && value instanceof Date) {
          const rowDate = new Date(row[field]);
          return (
            rowDate.getDate() === value.getDate() &&
            rowDate.getMonth() === value.getMonth() &&
            rowDate.getFullYear() === value.getFullYear()
          );
        }

        const cellValue = row[field];

        if (typeof cellValue === 'string' && typeof value === 'string') {
          return cellValue.toLowerCase().includes(value.toLowerCase());
        }

        return false;
      });

      setFilteredData(filtered);
    },
    [tableData]
  );

  const checkRoleIsAssigned = useCallback(async (id: string) => {
    try {
      const response = await axios({
        method: 'get',
        url: `${GATEWAY_API_URL}${endpoints.role.isAssigned.replace('id', id)}`,
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking if role is assigned:', error);
      toast.error('Erreur lors de la vérification du rôle');
      return true;
    }
  }, []);

  const handleDeleteRow = useCallback(
    async (id: string) => {
      const role = tableData.find((row) => row.id === id);
      if (role) {
        setRoleToDelete(role);

        try {
          setLoading(true);
          const isAssigned = await checkRoleIsAssigned(id);

          if (isAssigned) {
            roleAssignedWarning.onTrue();
          } else {
            confirmDelete.onTrue();
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [tableData, confirmDelete, roleAssignedWarning, checkRoleIsAssigned]
  );

  const deleteRow = useCallback(async () => {
    if (roleToDelete) {
      try {
        setLoading(true);
        await axios({
          method: 'delete',
          url: `${GATEWAY_API_URL}${endpoints.role.edit.replace('id', roleToDelete.id)}`,
          headers: { 'Content-Type': 'application/json' },
        });

        setTableData((prev) => prev.filter((row) => row.id !== roleToDelete.id));
        setFilteredData((prev) => prev.filter((row) => row.id !== roleToDelete.id));
        toast.success('Rôle supprimé avec succès!');
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error('Erreur lors de la suppression du rôle');
      } finally {
        setLoading(false);
        confirmDelete.onFalse();
      }
    }
  }, [roleToDelete, confirmDelete]);

  const handleDeleteRows = useCallback(async () => {
    const deletePromises = selectedRowIds.map(async (id) => {
      if (typeof id === 'string') {
        const isAssigned = await checkRoleIsAssigned(id);
        if (!isAssigned) {
          try {
            await axios({
              method: 'delete',
              url: `${GATEWAY_API_URL}${endpoints.role.edit.replace('id', id)}`,
              headers: { 'Content-Type': 'application/json' },
            });
            return id;
          } catch (error) {
            console.error(`Error deleting role ${id}:`, error);
            return null;
          }
        }
        return null;
      }
      return null;
    });

    try {
      setLoading(true);
      const deletedIds = await Promise.all(deletePromises);
      const successfullyDeletedIds = deletedIds.filter((id) => id !== null);

      if (successfullyDeletedIds.length > 0) {
        setTableData((prev) => prev.filter((row) => !successfullyDeletedIds.includes(row.id)));
        setFilteredData((prev) => prev.filter((row) => !successfullyDeletedIds.includes(row.id)));
        toast.success(`${successfullyDeletedIds.length} rôle(s) supprimé(s) avec succès!`);
      }

      if (successfullyDeletedIds.length < selectedRowIds.length) {
        toast.warning(
          "Certains rôles n'ont pas pu être supprimés car ils sont assignés à des utilisateurs"
        );
      }
    } catch (error) {
      console.error('Error during batch delete:', error);
      toast.error('Erreur lors de la suppression des rôles');
    } finally {
      setLoading(false);
      confirmRows.onFalse();
    }
  }, [selectedRowIds, checkRoleIsAssigned, confirmRows]);

  const handleViewRow = useCallback(
    (id: string) => {
      const selectedRole = tableData.find((row) => row.id === id);
      if (selectedRole) {
        setSelectedRoleDetails(selectedRole);
        setOpenDetailsDialog(true);
      }
    },
    [tableData]
  );

  const handleExportSelectedRows = useCallback(() => {
    const selectedRows = tableData.filter((row) => selectedRowIds.includes(row.id));

    // Convert data to CSV format
    const csvContent = `data:text/csv;charset=utf-8,${selectedRows
      .map((row) => Object.values(row).join(','))
      .join('\n')}`;

    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'rôles_sélectionnées.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Les lignes sélectionnées ont été exportées avec succès!');
  }, [selectedRowIds, tableData]);

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
        onExportSelectedRows={handleExportSelectedRows}
      />
    ),
    [selectedRowIds, confirmRows, handleExportSelectedRows]
  );

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: TABLE_HEAD[0].label,
      width: TABLE_HEAD[0].width,
      hideable: false,
      sortable: false,
      renderHeader: (params) => (
        <CustomColumnHeader
          field="name"
          headerName={TABLE_HEAD[0].label}
          onSearch={handleColumnSearch}
        />
      ),
      renderCell: (params) => (
        <RenderCellName params={params} onViewRow={() => handleViewRow(params.row.id)} />
      ),
    },
    {
      field: 'description',
      headerName: TABLE_HEAD[1].label,
      width: TABLE_HEAD[1].width,
      sortable: false,
      renderHeader: (params) => (
        <CustomColumnHeader
          field="description"
          headerName={TABLE_HEAD[1].label}
          onSearch={handleColumnSearch}
        />
      ),
      renderCell: (params) => <RenderCellDescription params={params} />,
    },
    {
      field: 'createdAt',
      headerName: TABLE_HEAD[2].label,
      width: TABLE_HEAD[2].width,
      sortable: false,
      renderHeader: (params) => (
        <CustomColumnHeader
          field="createdAt"
          headerName={TABLE_HEAD[2].label}
          onSearch={handleColumnSearch}
          isDatePicker
        />
      ),
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'actions',
      headerName: TABLE_HEAD[3].label,
      width: TABLE_HEAD[3].width,
      align: 'center',
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, zIndex: 1, position: 'sticky' }}>
          <Tooltip title="Voir détails">
            <IconButton size="small" onClick={() => handleViewRow(params.row.id)} color="info">
              <FontAwesomeIcon icon={faEye} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Modifier">
            <Link href={paths.dashboard.users.edit(params.row.id)}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                color="primary"
              >
                <FontAwesomeIcon icon={faPen} />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={() => handleDeleteRow(params.row.id)}
              color="error"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="Liste des rôles"
          links={[
            { name: 'Tableau de bord', href: paths.dashboard.root },
            { name: 'Utilisateurs', href: paths.dashboard.root },
            { name: 'Gestion des rôles' },
          ]}
          action={
            <Link href={paths.dashboard.users.add}>
              <Button
                variant="contained"
                startIcon={<FontAwesomeIcon icon={faPlus} />}
                sx={{
                  color: 'primary.contrastText',
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Ajouter un rôle
              </Button>
            </Link>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 2 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            localeText={{
              toolbarColumns: 'Colonnes',
              toolbarColumnsLabel: 'Sélectionner les colonnes',
              toolbarFilters: '',
              toolbarFiltersLabel: 'Afficher les filtres',
              toolbarFiltersTooltipHide: 'Masquer les filtres',
              toolbarFiltersTooltipShow: 'Afficher les filtres',
              toolbarExport: '',
              toolbarDensity: 'Densité',
              filterPanelOperator: 'Opérateur',
              filterPanelInputLabel: 'Valeur',
              filterOperatorContains: 'Contient',
              filterOperatorEquals: 'Égal à',
              filterOperatorStartsWith: 'Commence par',
              filterOperatorEndsWith: 'Se termine par',
              filterOperatorIsEmpty: 'Est vide',
              filterOperatorIsNotEmpty: "N'est pas vide",
              filterOperatorIsAnyOf: "Est l'un des",
              filterOperatorAfter: 'Après',
              filterOperatorBefore: 'Avant',
              filterOperatorOnOrAfter: 'Le ou après',
              filterOperatorOnOrBefore: 'Le ou avant',
              filterPanelInputPlaceholder: 'Valeur du filtre',
              columnMenuShowColumns: 'Afficher les colonnes',
              columnMenuUnsort: 'Annuler le tri',
              columnMenuSortAsc: 'Trier par ordre croissant',
              columnMenuSortDesc: 'Trier par ordre décroissant',
              filterPanelAddFilter: 'Ajouter un filtre',
              columnMenuFilter: 'Filtrer',
              footerRowSelected: (count) => `${count} ligne(s) sélectionnée(s)`,
              footerTotalRows: 'Total des lignes',
              footerTotalVisibleRows: (visibleCount, totalCount) =>
                `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,
              noRowsLabel: 'Aucune ligne',
              noResultsOverlayLabel: 'Aucun résultat trouvé',
              toolbarQuickFilterPlaceholder: 'Recherche...',
              toolbarQuickFilterLabel: 'Recherche',
              toolbarQuickFilterDeleteIconLabel: 'Effacer',
              toolbarExportLabel: 'Exporter',
              toolbarExportCSV: 'Télécharger au format CSV',
              toolbarExportExcel: 'Télécharger au format Excel',
              // Columns management text
              columnsManagementSearchTitle: 'Recherche',
              columnsManagementNoColumns: 'Aucune colonne',
              columnsManagementShowHideAllText: 'Afficher/Masquer tout',
              columnsManagementReset: 'Réinitialiser',
              MuiTablePagination: {
                labelRowsPerPage: 'Lignes par page :',
                labelDisplayedRows: ({ from, to, count }) => `${from}–${to} sur ${count}`,
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            rows={filteredData.length > 0 ? filteredData : tableData}
            columns={columns}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback as GridSlots['toolbar'],
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="Aucun résultat trouvé" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            loading={loading}
            sx={{
              [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
              '& .MuiDataGrid-row': {
                paddingBottom: '12px',
              },
            }}
          />
        </Card>
      </DashboardContent>

      <UserRoleDetailsDrawer
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        role={selectedRoleDetails}
      />

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="Supprimer"
        content={
          <>
            Êtes-vous sûr de vouloir supprimer <strong> {selectedRowIds.length} </strong> rôle(s) ?
            <br />
            Note: Les rôles assignés à des utilisateurs ne seront pas supprimés.
          </>
        }
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRows} disabled={loading}>
            Supprimer
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={confirmDelete.onFalse}
        title={`Supprimer le rôle : ${roleToDelete?.name || ''}`}
        content="Êtes-vous sûr de vouloir supprimer ce rôle ?"
        action={
          <Button variant="contained" color="error" onClick={deleteRow} disabled={loading}>
            Supprimer
          </Button>
        }
      />

      <ConfirmDialog
        open={roleAssignedWarning.value}
        onClose={roleAssignedWarning.onFalse}
        title="Impossible de supprimer"
        content={
          <>
            Le rôle <strong>{roleToDelete?.name}</strong> est assigné à un ou plusieurs
            utilisateurs.
            <br />
            Veuillez retirer ce rôle des utilisateurs avant de le supprimer.
          </>
        }
        action={
          <Button variant="contained" onClick={roleAssignedWarning.onFalse}>
            Compris
          </Button>
        }
      />
    </>
  );
}
