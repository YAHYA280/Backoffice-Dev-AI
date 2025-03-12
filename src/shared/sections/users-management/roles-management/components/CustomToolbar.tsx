import type { GridRowSelectionModel } from '@mui/x-data-grid';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faFileExport } from '@fortawesome/free-solid-svg-icons';

import { Stack, Button } from '@mui/material';
import {
  GridToolbarExport,
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
}: CustomToolbarProps) => (
  <GridToolbarContainer>
    <Stack spacing={1} flexGrow={1} direction="row" alignItems="center" justifyContent="flex-end">
      {(selectedRowIds.length > 0) ? (
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
      {(selectedRowIds.length > 0) ? (
        <Button
          size="small"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faFileExport} />}
          onClick={onExportSelectedRows}
        >
          Exporter ({selectedRowIds.length})
        </Button>
      ): (
        <></>
      )}
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarExport />
    </Stack>
  </GridToolbarContainer>
);

export default CustomToolbar;
