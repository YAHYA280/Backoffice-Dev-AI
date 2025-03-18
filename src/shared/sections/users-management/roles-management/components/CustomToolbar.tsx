import type { GridRowSelectionModel } from '@mui/x-data-grid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt, faColumns, faTrashAlt, faFileExport } from '@fortawesome/free-solid-svg-icons';

import { Stack, Button, Tooltip } from '@mui/material';
import {
  GridToolbarExport,
  useGridApiContext,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
} from '@mui/x-data-grid';

interface CustomToolbarProps {
  selectedRowIds: GridRowSelectionModel;
  onOpenConfirmDeleteRows: () => void;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  onExportSelectedRows: () => void;
}

const CustomToolbar = ({
  selectedRowIds,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
  onExportSelectedRows,
}: CustomToolbarProps) => {
  const apiRef = useGridApiContext();

  // Function to reset filters and column visibility
  const handleReset = () => {
    if (apiRef.current) {
      // Reset filters
      apiRef.current.setFilterModel({ items: [] });

      // Reset column visibility
      const allColumns = apiRef.current.getAllColumns();
      const columnVisibilityModel = allColumns.reduce(
        (acc, column) => {
          acc[column.field] = true;
          return acc;
        },
        {} as Record<string, boolean>
      );
      apiRef.current.setColumnVisibilityModel(columnVisibilityModel);
    }
  };
  return (
    <GridToolbarContainer>
      <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
        {selectedRowIds.length > 0 ? (
          <Button
            size="small"
            color="error"
            startIcon={<FontAwesomeIcon icon={faTrashAlt} />}
            onClick={onOpenConfirmDeleteRows}
          >
            Supprimer ({selectedRowIds.length})
          </Button>
        ) : (
          <></>
        )}
        {/* Export Selected Button */}
        {selectedRowIds.length > 0 ? (
          <Button
            size="small"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faFileExport} />}
            onClick={onExportSelectedRows}
          >
            Exporter ({selectedRowIds.length})
          </Button>
        ) : (
          <></>
        )}
        <GridToolbarColumnsButton
          slotProps={{
            tooltip: { title: 'Sélectionner colonnes' },
            button: { variant: 'outlined', startIcon: <FontAwesomeIcon icon={faColumns} /> },
          }}
        />

        <GridToolbarFilterButton
          ref={setFilterButtonEl}
          slotProps={{
            button: {
              sx: {
                padding: '4px',
                minWidth: 'auto',
                '& .MuiButton-startIcon': { mr: 0 },
                '& .MuiButton-endIcon': { ml: 0 },
                '& .MuiButton-text': { ml: 0 },
              },
            },
          }}
        />

        {/* Reset Button */}
        <Tooltip title="Réinitialiser" arrow>
          <Button
            size="small"
            color="secondary"
            startIcon={<FontAwesomeIcon icon={faSyncAlt} />}
            onClick={handleReset}
            sx={{
              padding: '4px',
              minWidth: 'auto',
              '& .MuiButton-startIcon': { mr: 0 },
              '& .MuiButton-endIcon': { ml: 0 },
              '& .MuiButton-text': { ml: 0 },
              color: 'black',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          />
        </Tooltip>

        <GridToolbarExport
          printOptions={{ disableToolbarButton: true }}
          slotProps={{
            button: {
              sx: {
                padding: '4px',
                minWidth: 'auto',
                '& .MuiButton-startIcon': { mr: 0 },
                '& .MuiButton-endIcon': { ml: 0 },
                '& .MuiButton-text': { ml: 0 },
              },
              startIcon: <FontAwesomeIcon icon={faFileExport} />,
            },
          }}
        />
      </Stack>
    </GridToolbarContainer>
  );
};

export default CustomToolbar;
