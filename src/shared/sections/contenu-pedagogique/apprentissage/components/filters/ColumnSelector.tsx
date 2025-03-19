import React, { useState, useEffect } from 'react';
import { faColumns } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Box,
  List,
  Button,
  Popover,
  Divider,
  Checkbox,
  ListItem,
  useTheme,
  Typography,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';

export interface ColumnOption {
  id: string;
  label: string;
  required?: boolean;
}

interface ColumnSelectorProps {
  columns: ColumnOption[];
  visibleColumns: string[];
  onColumnChange: (columns: string[]) => void;
  buttonText?: string;
}

export const ColumnSelector: React.FC<ColumnSelectorProps> = ({
  columns,
  visibleColumns,
  onColumnChange,
  buttonText = 'Columns',
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(visibleColumns);

  useEffect(() => {
    setSelectedColumns(visibleColumns);
  }, [visibleColumns]);

  const handleOpenColumns = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseColumns = () => {
    setAnchorEl(null);
  };

  const handleToggleColumn = (columnId: string) => {
    setSelectedColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      }
      return [...prev, columnId];
    });
  };

  const handleSelectAll = () => {
    setSelectedColumns(columns.map((column) => column.id));
  };

  const handleUnselectAll = () => {
    // Keep only required columns
    setSelectedColumns(columns.filter((column) => column.required).map((column) => column.id));
  };

  const handleApplyColumns = () => {
    onColumnChange(selectedColumns);
    handleCloseColumns();
  };

  const open = Boolean(anchorEl);

  const allSelected = columns.length === selectedColumns.length;
  const someSelected = selectedColumns.length > 0 && !allSelected;

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleOpenColumns}
        startIcon={<FontAwesomeIcon icon={faColumns} />}
        sx={{
          minWidth: 100,
          borderRadius: 1,
          transition: theme.transitions.create(['background-color']),
          ...(open && {
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {buttonText}
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseColumns}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 300,
            p: 2,
            boxShadow: theme.customShadows?.z20,
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Afficher les colonnes
        </Typography>

        <Divider sx={{ my: 1.5 }} />

        <List disablePadding sx={{ mb: 1.5 }}>
          <ListItem disablePadding>
            <ListItemButton dense onClick={allSelected ? handleUnselectAll : handleSelectAll}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={allSelected}
                  indeterminate={someSelected}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary="Tout sélectionner" />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider sx={{ mb: 1.5 }} />

        <List disablePadding sx={{ maxHeight: 300, overflow: 'auto' }}>
          {columns.map((column) => (
            <ListItem key={column.id} disablePadding>
              <ListItemButton
                dense
                onClick={() => handleToggleColumn(column.id)}
                disabled={column.required}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedColumns.includes(column.id)}
                    disableRipple
                    disabled={column.required}
                  />
                </ListItemIcon>
                <ListItemText primary={column.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" size="small" onClick={handleApplyColumns}>
            Appliquer
          </Button>
        </Box>
      </Popover>
    </>
  );
};
