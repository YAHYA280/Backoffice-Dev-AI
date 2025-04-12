'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { INotificationFilters } from 'src/contexts/types/notification';

import React from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableSortLabel from '@mui/material/TableSortLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Button,
  Select,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TextField,
  IconButton,
  Typography,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { 
  NOTIFICATION_TYPE_OPTIONS, 
  NOTIFICATION_STATUS_OPTIONS, 
  NOTIFICATION_CHANNEL_OPTIONS 
} from 'src/shared/_mock/_notification';

import { usePopover, CustomPopover } from 'src/shared/components/custom-popover';

type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
  isFilterable?: boolean;
};

type Props = {
  columns: Column[];
  filters: UseSetStateReturn<INotificationFilters>;
  dateError: boolean;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  onColumnFilter?: (id: string, value: string) => void;
  columnFilters?: Record<string, string>;
  hideStatus?: boolean;
  numSelected?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function TableHeadWithFilters({
  columns,
  filters,
  dateError,
  order,
  orderBy,
  onSort,
  totalResults,
  onColumnFilter,
  columnFilters = {},
  hideStatus,
  numSelected,
  onSelectAllRows,
}: Props) {
  const datePopover = usePopover();

  // Fonction helper pour le rendu du filtre par colonne
  const renderColumnFilter = (column: Column) => {
    if (!column.isFilterable || !onColumnFilter) return null;
    if (column.id === 'status' && hideStatus) return null;
  
    // Render dropdowns for specific columns
    if (column.id === 'type' || column.id === 'channel' || column.id === 'status') {
      const options = column.id === 'type' 
        ? NOTIFICATION_TYPE_OPTIONS 
        : column.id === 'channel' 
          ? NOTIFICATION_CHANNEL_OPTIONS 
          : NOTIFICATION_STATUS_OPTIONS;
      
      return (
        <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
          <Select
            value={columnFilters[column.id] || ''}
            onChange={(e) => onColumnFilter(column.id, e.target.value)}
            displayEmpty
            startAdornment={
              <InputAdornment position="start">
                <Box
                  component={FontAwesomeIcon}
                  icon={faSearch}
                  sx={{
                    cursor: 'pointer',
                    color: 'text.disabled',
                    '&:hover': { color: 'primary.main' },
                  }}
                />
              </InputAdornment>
            }
            IconComponent={() => null} // This removes the dropdown arrow
            sx={{
              backgroundColor: 'background.neutral',
              borderRadius: 1,
              height: '32px',
              '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
              '& .MuiSelect-select': { 
                pl: 0.5, // Reduce padding after the icon
              },
              width: '120px',
            }}
          >
            <MenuItem value="">Tous</MenuItem>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
  
    // Default textfield for other columns
    return (
      <TextField
        size="small"
        value={columnFilters[column.id] || ''}
        onChange={(e) => onColumnFilter(column.id, e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box
                component={FontAwesomeIcon}
                icon={faSearch}
                sx={{
                  cursor: 'text',
                  '&:hover': { color: 'primary.main' },
                }}
                onClick={(e) => {
                  const inputElement = e.currentTarget
                    .closest('.MuiInputBase-root')
                    ?.querySelector('input');
                  if (inputElement) {
                    inputElement.focus();
                  }
                }}
              />
            </InputAdornment>
          ),
          sx: {
            '& fieldset': { border: 'none' },
            backgroundColor: 'background.neutral',
            borderRadius: 1,
            height: '32px',
            width: '120px',
          },
        }}
      />
    );
  };

  const renderHeaderCell = (col: Column) => {
    if (col.id === 'status' && hideStatus) {
      return null;
    }
    if (col.id === '') {
      return (
        <TableCell key={`header-${col.id}`} padding="checkbox" rowSpan={2}>
          <Checkbox
            indeterminate={!!numSelected && numSelected < totalResults}
            checked={!!totalResults && numSelected === totalResults}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onSelectAllRows && onSelectAllRows(event.target.checked)
            }
            inputProps={{
              name: 'select-all-rows',
              'aria-label': 'select all rows',
            }}
          />
        </TableCell>
      );
    }
    if (col.id === 'actions') {
      return (
        <TableCell
          key={`header-${col.id}`}
          width={col.width ?? 'auto'}
          sx={{ ...(col.sx ?? {}) }}
          rowSpan={2}
        >
          {col.label}
        </TableCell>
      );
    }

    return (
      <TableCell
        key={`header-${col.id}`}
        width={col.width ?? 'auto'}
        sx={{ ...(col.sx ?? {}), padding: '8px 16px', borderBottom: 'none', pb: 0 }}
      >
        <TableSortLabel
          active={orderBy === col.id}
          direction={orderBy === col.id ? order : 'asc'}
          onClick={() => onSort(col.id)}
        >
          {col.label}
        </TableSortLabel>

        {col.id === 'sentDate' && (filters.state.startDate || filters.state.endDate) && (
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'inline-block',
              ml: 1,
            }}
          />
        )}
      </TableCell>
    );
  };

  const renderSearchCell = (col: Column) => {
    if (col.id === 'status' && hideStatus) {
      return null;
    }
    if (col.id === '' || col.id === 'actions') {
      return null;
    }

    switch (col.id) {
      case 'title':
        return (
          <TableCell key={`search-${col.id}`} sx={{ padding: '0 16px 8px', borderTop: 'none' }}>
            <TextField
              size="small"
              value={filters.state.title}
              onChange={(e) => filters.setState({ title: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box
                      component={FontAwesomeIcon}
                      icon={faSearch}
                      sx={{
                        cursor: 'text',
                        '&:hover': { color: 'primary.main' },
                      }}
                    />
                  </InputAdornment>
                ),
                sx: {
                  '& fieldset': { border: 'none' },
                  backgroundColor: 'background.neutral',
                  borderRadius: 1,
                  height: '32px',
                  width: '120px',
                },
              }}
            />
          </TableCell>
        );
      case 'sentDate':
        return (
          <TableCell key={`search-${col.id}`} sx={{ padding: '0 16px 8px', borderTop: 'none' }}>
            <IconButton
              size="small"
              onClick={datePopover.onOpen}
              sx={{
                width: '20px',
                height: '20px',
                '& svg': {
                  fontSize: '1.03rem',
                },
              }}
            >
              <FontAwesomeIcon icon={faSearch} />
            </IconButton>

            <CustomPopover
              open={datePopover.open}
              anchorEl={datePopover.anchorEl}
              onClose={datePopover.onClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <Box sx={{ p: 2, minWidth: 300 }}>
                <Typography variant="subtitle2">Date de début</Typography>
                {dateError && (
                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    Date invalide
                  </Typography>
                )}

                <DatePicker
                  value={filters.state.startDate}
                  onChange={(newValue) => filters.setState({ startDate: newValue })}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      error: dateError,
                      placeholder: 'Date de début',
                      sx: { mt: 1, mb: 2 },
                    },
                  }}
                />

                <Typography variant="subtitle2">Date de fin</Typography>
                <DatePicker
                  value={filters.state.endDate}
                  onChange={(newValue) => filters.setState({ endDate: newValue })}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      error: dateError,
                      placeholder: 'Date de fin',
                      sx: { mt: 1, mb: 2 },
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      filters.setState({
                        startDate: null,
                        endDate: null,
                      });
                      datePopover.onClose();
                    }}
                  >
                    Réinitialiser
                  </Button>
                </Box>
              </Box>
            </CustomPopover>
          </TableCell>
        );
      default:
        return (
          <TableCell key={`search-${col.id}`} sx={{ padding: '0 16px 8px', borderTop: 'none' }}>
            {col.isFilterable && renderColumnFilter(col)}
          </TableCell>
        );
    }
  };

  return (
    <TableHead>
      <TableRow>{columns.map((col) => renderHeaderCell(col))}</TableRow>
      <TableRow>{columns.map((col) => renderSearchCell(col))}</TableRow>
    </TableHead>
  );
}