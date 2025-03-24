'use client';

import type { IUserTableFilters } from 'src/contexts/types/user';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Chip,
  Stack,
  Select,
  TableRow,
  Checkbox,
  MenuItem,
  TableHead,
  TableCell,
  TextField,
  FormControl,
  OutlinedInput,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';

import { chipProps, FiltersBlock, FiltersResult } from 'src/shared/components/filters-result';

const FILTER_ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Enfant', label: 'Enfant' },
];

type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
};

type Props = {
  columns: Column[];
  filters: UseSetStateReturn<IUserTableFilters>;
  dateError: boolean;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
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
  numSelected = 0,
  rowCount = 0,
  onSelectAllRows,
}: Props) {
  const [showNameInput, setShowNameInput] = useState(false);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showRoleInput, setShowRoleInput] = useState(false);
  const [showCreatedAtInput, setShowCreatedAtInput] = useState(false);
  const [showLastLoginInput, setShowLastLoginInput] = useState(false);

  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];

    if (filters.state.name) {
      chips.push(
        <Chip
          key="name"
          {...chipProps}
          label={`Nom: ${filters.state.name}`}
          onDelete={() => {
            filters.setState({ name: '' });
            setShowNameInput(false);
          }}
        />
      );
    }
    if (filters.state.email) {
      chips.push(
        <Chip
          key="email"
          {...chipProps}
          label={`Email: ${filters.state.email}`}
          onDelete={() => {
            filters.setState({ email: '' });
            setShowEmailInput(false);
          }}
        />
      );
    }
    if (filters.state.role && filters.state.role[0]) {
      chips.push(
        <Chip
          key="role"
          {...chipProps}
          label={`Rôle: ${filters.state.role[0]}`}
          onDelete={() => {
            filters.setState({ role: [] });
            setShowRoleInput(false);
          }}
        />
      );
    }
    if (filters.state.statut && filters.state.statut.length) {
      chips.push(
        <Chip
          key="statut"
          {...chipProps}
          label={`Statut: ${(filters.state.statut as string[]).join(', ')}`}
          onDelete={() => filters.setState({ statut: [] })}
        />
      );
    }
    if (filters.state.createdAt) {
      const parsedDate = dayjs(filters.state.createdAt, 'DD/MM/YYYY', true);
      const displayDate = parsedDate.isValid()
        ? parsedDate.format('DD/MM/YYYY')
        : dayjs(filters.state.createdAt).format('DD/MM/YYYY');
      chips.push(
        <Chip
          key="createdAt"
          {...chipProps}
          label={`Date de création: ${displayDate}`}
          onDelete={() => {
            filters.setState({ createdAt: null });
            setShowCreatedAtInput(false);
          }}
        />
      );
    }
    if (filters.state.lastLogin) {
      const parsedLastLogin = dayjs(filters.state.lastLogin, 'DD/MM/YYYY', true);
      const displayDate = parsedLastLogin.isValid()
        ? parsedLastLogin.format('DD/MM/YYYY')
        : dayjs(filters.state.lastLogin).format('DD/MM/YYYY');
      chips.push(
        <Chip
          key="lastLogin"
          {...chipProps}
          label={`Date de dernière connexion: ${displayDate}`}
          onDelete={() => {
            filters.setState({ lastLogin: null });
            setShowLastLoginInput(false);
          }}
        />
      );
    }
    return chips;
  }, [filters]);

  return (
    <TableHead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
      <TableRow
        sx={{
          height: 50,
          '& .MuiTableCell-root': { padding: '5px 10px' },
        }}
      >
        {columns.map((col) => {
          if (col.id === 'select') {
            return (
              <TableCell key="select" width={col.width} padding="checkbox">
                <Checkbox
                  indeterminate={numSelected > 0 && numSelected < rowCount}
                  checked={rowCount > 0 && numSelected === rowCount}
                  onChange={(event) =>
                    onSelectAllRows && onSelectAllRows(event.target.checked)
                  }
                />
              </TableCell>
            );
          }
          if (col.id === 'statut' || col.id === 'actions') {
            return (
              <TableCell key={col.id} width={col.width} sx={col.sx} sortDirection={orderBy === col.id ? order : false}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: -0.3 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', p: 0 }}>
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={() => onSort(col.id)}
                      sx={{ lineHeight: 1, p: 0 }}
                    >
                      {col.label}
                    </TableSortLabel>
                  </Box>
                  <Box sx={{ height: '36px' }} />
                </Box>
              </TableCell>
            );
          }
          return (
            <TableCell key={col.id} width={col.width} sx={col.sx} sortDirection={orderBy === col.id ? order : false} align="left">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: -0.3 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', p: 0 }}>
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => onSort(col.id)}
                    sx={{ lineHeight: 1, p: 0 }}
                  >
                    {col.label}
                  </TableSortLabel>
                </Box>
                {(() => {
                  switch (col.id) {
                    case 'name':
                      return showNameInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.name}
                          onChange={(e) => filters.setState({ name: e.target.value })}
                          onBlur={() => {
                            if (!filters.state.name) setShowNameInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: { '& fieldset': { border: 'none' }, backgroundColor: 'background.neutral', borderRadius: 1 },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowNameInput(true)}
                          sx={{ cursor: 'pointer', backgroundColor: 'background.neutral', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'email':
                      return showEmailInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.email}
                          onChange={(e) => filters.setState({ email: e.target.value })}
                          onBlur={() => {
                            if (!filters.state.email) setShowEmailInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: { '& fieldset': { border: 'none' }, backgroundColor: 'background.neutral', borderRadius: 1 },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowEmailInput(true)}
                          sx={{ cursor: 'pointer', backgroundColor: 'background.neutral', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'role':
                      return showRoleInput ? (
                        <FormControl fullWidth size="small">
                          <Select
                            autoFocus
                            value={filters.state.role[0] || ''}
                            onChange={(e) => {
                              filters.setState({ role: e.target.value ? [e.target.value] : [] });
                            }}
                            onClose={() => {
                              if (!filters.state.role[0]) setShowRoleInput(false);
                            }}
                            input={<OutlinedInput label="Rôle" />}
                          >
                            <MenuItem value="">
                              <em>Tous</em>
                            </MenuItem>
                            {FILTER_ROLE_OPTIONS.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <Box
                          onClick={() => setShowRoleInput(true)}
                          sx={{ cursor: 'pointer', backgroundColor: 'background.neutral', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'createdAt':
                      return showCreatedAtInput ? (
                        <DatePicker
                          autoFocus
                          value={filters.state.createdAt ? dayjs(filters.state.createdAt, 'DD/MM/YYYY') : null}
                          onChange={(newValue) => {
                            if (newValue) {
                              filters.setState({ createdAt: newValue.format('DD/MM/YYYY') });
                            } else {
                              filters.setState({ createdAt: '' });
                            }
                          }}
                          onClose={() => {
                            if (!filters.state.createdAt) setShowCreatedAtInput(false);
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{ textField: { fullWidth: true, size: 'small', error: dateError } }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowCreatedAtInput(true)}
                          sx={{ cursor: 'pointer', backgroundColor: 'background.neutral', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'lastLogin':
                      return showLastLoginInput ? (
                        <DatePicker
                          autoFocus
                          value={filters.state.lastLogin ? dayjs(filters.state.lastLogin, 'DD/MM/YYYY') : null}
                          onChange={(newValue) => {
                            if (newValue) {
                              filters.setState({ lastLogin: newValue.format('DD/MM/YYYY') });
                            } else {
                              filters.setState({ lastLogin: '' });
                            }
                          }}
                          onClose={() => {
                            if (!filters.state.lastLogin) setShowLastLoginInput(false);
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{ textField: { fullWidth: true, size: 'small', error: dateError } }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowLastLoginInput(true)}
                          sx={{ cursor: 'pointer', backgroundColor: 'background.neutral', borderRadius: 1, p: 1, display: 'flex', alignItems: 'center' }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    default:
                      return null;
                  }
                })()}
              </Box>
            </TableCell>
          );
        })}
      </TableRow>
      {filterChips.length > 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length}>
            <FiltersResult totalResults={totalResults} onReset={() => filters.onResetState()}>
              <FiltersBlock label="" isShow>
                <Stack direction="row" spacing={1}>
                  {filterChips}
                </Stack>
              </FiltersBlock>
            </FiltersResult>
          </TableCell>
        </TableRow>
      ):(
        <>
        </>
      )}
    </TableHead>
  );
}