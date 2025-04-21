import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCsv,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Button,
  Popover,
  Divider,
  Tooltip,
  ListItem,
  useTheme,
  Checkbox,
  Typography,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  ListItemButton,
  LinearProgress,
  FormControlLabel,
} from '@mui/material';

export interface ExportOption {
  id: string;
  label: string;
  icon: typeof faFileCsv;
  disabled?: boolean;
}

export interface ExportOptionGroup {
  title: string;
  options: ExportOption[];
}

interface AdvancedExportDropdownProps {
  onExport: (format: string, options?: any) => void;
  exportGroups?: ExportOptionGroup[];
  exportOptions?: ExportOption[];
  title?: string;
  isExporting?: boolean;
  exportProgress?: number;
  withExportOptions?: boolean;
}

export const AdvancedExportDropdown: React.FC<AdvancedExportDropdownProps> = ({
  onExport,
  exportGroups = defaultExportGroups,
  exportOptions,
  title = 'Export Data',
  isExporting = false,
  exportProgress = 0,
  withExportOptions = false,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({
    includeHeaders: true,
    includeFilters: true,
    includeHiddenColumns: false,
  });

  const handleOpenExport = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseExport = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: string) => {
    onExport(format, selectedOptions);
    if (!isExporting) {
      handleCloseExport();
    }
  };

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions({
      ...selectedOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const open = Boolean(anchorEl);

  // Determine whether to use grouped options or flat list
  const useGroups = exportGroups && exportGroups.length > 0;
  const flatOptions = exportOptions || (useGroups ? [] : defaultExportOptions);

  return (
    <>
    <Tooltip title='Exporter' arrow>
      <Button
        color="primary"
        onClick={handleOpenExport}
        disabled={isExporting}
        startIcon={<FontAwesomeIcon icon={faFileExport} size='sm'/>}
        sx={{
          minWidth: 10,
          borderRadius: 1,
          justifyContent: 'center',
          '.MuiButton-startIcon': {
            marginLeft: 0,
            marginRight: 0,
          },
          transition: (t) => t.transitions.create(['background-color']),
          ...(open && {
            bgcolor: 'primary.lighter',
          }),
        }}
      >
        {}
      </Button>
    </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseExport}
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
          {title}
        </Typography>

        {isExporting ? (
          <Box sx={{ width: '100%', mt: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Exporting data...
            </Typography>
            <LinearProgress
              variant={exportProgress > 0 ? 'determinate' : 'indeterminate'}
              value={exportProgress}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {exportProgress > 0
                ? `${Math.round(exportProgress)}% complete`
                : 'Preparing export...'}
            </Typography>
          </Box>
        ) : (
          <></>
        )}

        {withExportOptions && !isExporting ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Options d&apos;exportation
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOptions.includeHeaders}
                  onChange={handleOptionChange}
                  name="includeHeaders"
                  size="small"
                />
              }
              label={<Typography variant="body2">Inclure les en-têtes</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOptions.includeFilters}
                  onChange={handleOptionChange}
                  name="includeFilters"
                  size="small"
                />
              }
              label={<Typography variant="body2">Inclure les filtres appliqués</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOptions.includeHiddenColumns}
                  onChange={handleOptionChange}
                  name="includeHiddenColumns"
                  size="small"
                />
              }
              label={<Typography variant="body2">Inclure les colonnes masquées</Typography>}
            />
          </Box>
        ) : (
          <></>
        )}

        <Divider sx={{ my: 1.5 }} />

        {!isExporting ? (
          useGroups ? (
            // Render grouped options
            <List sx={{ width: '100%', bgcolor: 'background.paper', pt: 0 }} subheader={<li />}>
              {exportGroups.map((group) => (
                <li key={group.title}>
                  <ul style={{ padding: 0 }}>
                    <ListSubheader sx={{ lineHeight: '36px', bgcolor: 'background.paper' }}>
                      {group.title}
                    </ListSubheader>
                    {group.options.map((option) => (
                      <ListItem key={option.id} disablePadding>
                        <ListItemButton
                          dense
                          onClick={() => handleExport(option.id)}
                          disabled={option.disabled}
                          sx={{
                            borderRadius: 1,
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <FontAwesomeIcon
                              icon={option.icon}
                              color={
                                option.disabled
                                  ? theme.palette.text.disabled
                                  : theme.palette.text.primary
                              }
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={option.label}
                            primaryTypographyProps={{
                              variant: 'body2',
                              color: option.disabled ? 'text.disabled' : 'text.primary',
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </ul>
                </li>
              ))}
            </List>
          ) : (
            // Render flat list of options
            <List disablePadding>
              {flatOptions.map((option) => (
                <ListItem key={option.id} disablePadding>
                  <ListItemButton
                    dense
                    onClick={() => handleExport(option.id)}
                    disabled={option.disabled}
                    sx={{
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <FontAwesomeIcon
                        icon={option.icon}
                        color={
                          option.disabled ? theme.palette.text.disabled : theme.palette.text.primary
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={option.label}
                      primaryTypographyProps={{
                        variant: 'body2',
                        color: option.disabled ? 'text.disabled' : 'text.primary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )
        ) : (
          <></>
        )}

        {isExporting ? (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleCloseExport}
            sx={{ mt: 1 }}
          >
            Hide
          </Button>
        ) : (
          <></>
        )}
      </Popover>
    </>
  );
};

// Default export options
const defaultExportOptions: ExportOption[] = [
  {
    id: 'csv',
    label: 'Export as CSV',
    icon: faFileCsv,
  },
  {
    id: 'excel',
    label: 'Export as Excel',
    icon: faFileExcel,
  },
  {
    id: 'pdf',
    label: 'Export as PDF',
    icon: faFilePdf,
  },
  {
    id: 'word',
    label: 'Export as Word',
    icon: faFileWord,
    disabled: true,
  },
];

// Default export groups
const defaultExportGroups: ExportOptionGroup[] = [
  {
    title: 'Spreadsheet',
    options: [
      {
        id: 'csv',
        label: 'CSV (.csv)',
        icon: faFileCsv,
      },
      {
        id: 'excel',
        label: 'Excel (.xlsx)',
        icon: faFileExcel,
      },
    ],
  },
];
