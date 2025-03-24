'use client';

import type { IRoleItem } from 'src/contexts/types/role';
import type {
  GridSlots,
  GridColDef,
  GridRowSelectionModel,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid';

import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import { Box, Tooltip, IconButton } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import roleData from 'src/shared/_mock/_role';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { toast } from 'src/shared/components/snackbar';
import { EmptyContent } from 'src/shared/components/empty-content';
import { ConfirmDialog } from 'src/shared/components/custom-dialog';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import CustomToolbar from '../components/CustomToolbar';
import { AddRoleFormDialog } from '../user-role-add-form';
import { UserRoleEditDrawer } from '../user-role-edit-form';
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

  const [tableData, setTableData] = useState<IRoleItem[]>(roleData);

  const [filteredData, setFilteredData] = useState<IRoleItem[]>(roleData);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [filterButtonEl, setFilterButtonEl] = useState<HTMLButtonElement | null>(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({});

  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const [selectedRoleDetails, setSelectedRoleDetails] = useState<IRoleItem | null>(null);

  const [selectedEditRole, setSelectedEditRole] = useState<IRoleItem | null>(null);

  const addRoleDialog = useBoolean();

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

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);

      toast.success('Supprimer avec succès!');

      setTableData(deleteRow);
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row.id));

    toast.success('Supprimer avec succès!');

    setTableData(deleteRows);
  }, [selectedRowIds, tableData]);

  const handleEditRow = (role: IRoleItem) => {
    setSelectedEditRole(role);
    setOpenEditDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenEditDialog(false);
  };

  const handleSaveEdit = (updatedRole: IRoleItem) => {
    setOpenEditDialog(false);
  };

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
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleEditRow(params.row);
              }}
              color="primary"
            >
              <FontAwesomeIcon icon={faPen} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton size="small" onClick={() => handleDeleteRow(params.row.id)} color="error">
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
            <Button
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              onClick={addRoleDialog.onTrue}
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
                labelDisplayedRows: ({ from, to, count }) => 
                  `${from}–${to} sur ${count}`
              }
            }}
            checkboxSelection
            disableRowSelectionOnClick
            rows={filteredData}
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
            sx={{
              [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' },
              '& .MuiDataGrid-row': {
                paddingBottom: '12px',
              },
            }}
          />
        </Card>
      </DashboardContent>

      <AddRoleFormDialog
        open={addRoleDialog.value}
        onClose={addRoleDialog.onFalse}
        addRole={(newRole) => {
          setTableData((prev) => [...prev, newRole]);
          toast.success('Nouveau rôle ajouté avec succès!');
        }}
      />

      <UserRoleEditDrawer
        open={openEditDialog}
        onClose={handleCloseDialog}
        currentRole={selectedEditRole}
        onUpdateRole={handleSaveEdit}
      />

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
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            Supprimer
          </Button>
        }
      />
    </>
  );
}
