'use client';

import type { Dayjs } from 'dayjs';
import type { Theme, SxProps } from '@mui/material/styles';

import dayjs from 'dayjs';
import { useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  TableRow,
  Checkbox,
  TableHead,
  TableCell,
  TextField,
  IconButton,
  TableSortLabel,
} from '@mui/material';

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: 1,
  height: 1,
  overflow: 'hidden',
  position: 'absolute' as const,
  whiteSpace: 'nowrap' as const,
  clip: 'rect(0 0 0 0)',
};

export type TableFileHeadCustomProps = {
  orderBy?: string;
  rowCount?: number;
  sx?: SxProps<Theme>;
  numSelected?: number;
  order?: 'asc' | 'desc';
  onSort?: (id: string) => void;
  headLabel: Array<{ id: string; label: string; width?: number }>;
  onSelectAllRows?: (checked: boolean) => void;
  onSearchColumnChange?: (columnId: string, value: string | Date | null) => void;
  searchValues?: {
    name?: string;
    size?: string;
    type?: string;
    createdAt?: Date | null;
    modifiedAt?: Date | null;
  };
};

export function TableFileHeadCustom({
  sx,
  order,
  onSort,
  orderBy,
  headLabel,
  rowCount = 0,
  numSelected = 0,
  onSelectAllRows,
  onSearchColumnChange,
  searchValues: externalSearchValues,
}: TableFileHeadCustomProps) {
  const [expandedSearchFields, setExpandedSearchFields] = useState<{
    name: boolean;
    size: boolean;
    type: boolean;
    createdAt: boolean;
    modifiedAt: boolean;
  }>({
    name: false,
    size: false,
    type: false,
    createdAt: false,
    modifiedAt: false,
  });

  const [localSearchValues, setLocalSearchValues] = useState<{
    name: string;
    size: string;
    type: string;
    createdAt: Date | null;
    modifiedAt: Date | null;
  }>({
    name: externalSearchValues?.name || '',
    size: externalSearchValues?.size || '',
    type: externalSearchValues?.type || '',
    createdAt: externalSearchValues?.createdAt || null,
    modifiedAt: externalSearchValues?.modifiedAt || null,
  });

  type FieldKey = 'name' | 'size' | 'type' | 'createdAt' | 'modifiedAt';

  const handleToggleSearchField = (field: FieldKey) => {
    setExpandedSearchFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSelectAllRows = (checked: boolean) => {
    setLocalSearchValues({
      name: '',
      size: '',
      type: '',
      createdAt: null,
      modifiedAt: null,
    });
    setExpandedSearchFields({
      name: false,
      size: false,
      type: false,
      createdAt: false,
      modifiedAt: false,
    });
    onSearchColumnChange?.('name', '');
    onSearchColumnChange?.('size', '');
    onSearchColumnChange?.('type', '');
    onSearchColumnChange?.('createdAt', null);
    onSearchColumnChange?.('modifiedAt', null);
    onSelectAllRows?.(checked);
  };

  const handleTextChange = (columnId: 'name' | 'size' | 'type', value: string) => {
    setLocalSearchValues((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    onSearchColumnChange?.(columnId, value);
  };

  const handleDateChange = (columnId: 'createdAt' | 'modifiedAt', dateValue: Date | null) => {
    setLocalSearchValues((prev) => ({
      ...prev,
      [columnId]: dateValue,
    }));
    onSearchColumnChange?.(columnId, dateValue);
  };

  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows ? (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={!!numSelected && numSelected < rowCount}
              checked={!!rowCount && numSelected === rowCount}
              onChange={(event) => handleSelectAllRows(event.target.checked)}
              inputProps={{
                name: 'select-all-rows',
                'aria-label': 'select all rows',
              }}
            />
          </TableCell>
        ):(
          <>
          </>
        )}
        {headLabel.map((headCell) => {
          const isActiveSort = orderBy === headCell.id;
          const sortDirection = isActiveSort ? order : false;
          return (
            <TableCell key={headCell.id} align="left" sortDirection={sortDirection} sx={{ width: headCell.width }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  {onSort ? (
                    <TableSortLabel
                      hideSortIcon
                      active={isActiveSort}
                      direction={isActiveSort ? order : 'asc'}
                      onClick={() => onSort(headCell.id)}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      {headCell.label}
                      {isActiveSort ? (
                        <Box sx={{ ...visuallyHidden }}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ):(
                        <>
                        </>
                      )}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </Box>
                {numSelected === 0 ?
                  (['name', 'size', 'type', 'createdAt', 'modifiedAt'] as FieldKey[]).includes(headCell.id as FieldKey) ? (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleToggleSearchField(headCell.id as FieldKey)}
                        color={expandedSearchFields[headCell.id as FieldKey] ? 'primary' : 'default'}
                      >
                        <FontAwesomeIcon icon={faSearch} size="xs" />
                      </IconButton>
                      {expandedSearchFields[headCell.id as FieldKey] &&
                        (['name', 'size', 'type'] as FieldKey[]).includes(headCell.id as FieldKey) ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={localSearchValues[headCell.id as 'name' | 'size' | 'type']}
                            onChange={(e) => handleTextChange(headCell.id as 'name' | 'size' | 'type', e.target.value)}
                            placeholder={`Rechercher par ${headCell.label.toLowerCase()}...`}
                            sx={{
                              ml: 1,
                              '& .MuiOutlinedInput-root': {
                                padding: '2px 8px',
                                height: '28px',
                              },
                              width: '100%',
                            }}
                            autoFocus
                          />
                        ) : (
                          <>
                          </>
                        )}
                      {expandedSearchFields[headCell.id as FieldKey] &&
                        (['createdAt', 'modifiedAt'] as FieldKey[]).includes(headCell.id as FieldKey) ? (
                          <Box sx={{ ml: 1 }}>
                            <DatePicker
                              label=""
                              format="dd/MM/yyyy"
                              value={
                                headCell.id === 'createdAt'
                                  ? localSearchValues.createdAt
                                    ? dayjs(localSearchValues.createdAt)
                                    : null
                                  : localSearchValues.modifiedAt
                                  ? dayjs(localSearchValues.modifiedAt)
                                  : null
                              }
                              onChange={(newValue: Dayjs | null) =>
                                handleDateChange(headCell.id as 'createdAt' | 'modifiedAt', newValue ? newValue.toDate() : null)
                              }
                              slotProps={{
                                textField: {
                                  size: 'small',
                                  sx: {
                                    '& .MuiOutlinedInput-root': {
                                      padding: '2px 8px',
                                      height: '28px',
                                    },
                                  },
                                },
                              }}
                            />
                          </Box>
                        ) : (
                          <>
                          </>
                        )}
                    </Box>
                  ) : (
                    <>
                    </>
                  ) : (
                    <>
                    </>
                  )}
              </Box>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}