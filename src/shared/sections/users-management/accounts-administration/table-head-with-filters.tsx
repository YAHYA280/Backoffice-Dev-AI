'use client';

import type { IUserTableFilters } from 'src/contexts/types/user';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableSortLabel from '@mui/material/TableSortLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { formHelperTextClasses } from '@mui/material/FormHelperText';
import {Box,Chip,Stack,Select,TableRow,MenuItem,Checkbox,TableHead,TableCell,TextField,FormControl,OutlinedInput,InputAdornment} from '@mui/material';

import { chipProps, FiltersBlock,FiltersResult } from 'src/shared/components/filters-result';

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
};

export function TableHeadWithFilters({
  columns,
  filters,
  dateError,
  order,
  orderBy,
  onSort,
  totalResults,
}: Props) {
  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];
    if (filters.state.name) {
      chips.push(
        <Chip
          key="name"
          {...chipProps}
          label={`Nom: ${filters.state.name}`}
          onDelete={() => filters.setState({ name: '' })}
        />
      );
    }
    if (filters.state.email) {
      chips.push(
        <Chip
          key="email"
          {...chipProps}
          label={`Email: ${filters.state.email}`}
          onDelete={() => filters.setState({ email: '' })}
        />
      );
    }
    if (filters.state.role && filters.state.role[0]) {
      chips.push(
        <Chip
          key="role"
          {...chipProps}
          label={`Rôle: ${filters.state.role[0]}`}
          onDelete={() => filters.setState({ role: [] })}
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
      chips.push(
        <Chip
          key="createdAt"
          {...chipProps}
          label={`Création: ${dayjs(filters.state.createdAt).format('DD/MM/YYYY')}`}
          onDelete={() => filters.setState({ createdAt: null })}
        />
      );
    }
    if (filters.state.lastLogin) {
      chips.push(
        <Chip
          key="lastLogin"
          {...chipProps}
          label={`Dernière: ${dayjs(filters.state.lastLogin).format('DD/MM/YYYY')}`}
          onDelete={() => filters.setState({ lastLogin: null })}
        />
      );
    }
    return chips;
  }, [filters]);

  return (
    <TableHead>
      <TableRow>
        {columns.map((col) => {
          if (col.id === 'statut' && filters.state.statut.length > 0) {
            return null;
          }
          if (col.id === 'actions') {
            return (
              <TableCell key={col.id} width={col.width} sx={col.sx}>
                {col.label}
              </TableCell>
            );
          }
          return (
            <TableCell
              key={col.id}
              width={col.width}
              sx={col.sx}
              sortDirection={orderBy === col.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === col.id}
                direction={orderBy === col.id ? order : 'asc'}
                onClick={() => onSort(col.id)}
              >
                {col.label}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        {columns.map((col) => {
          if (col.id === 'statut' && filters.state.statut.length > 0) {
            return null;
          }
          switch (col.id) {
            case 'name':
              return (
                <TableCell key={col.id}>
                  <TextField
                    fullWidth
                    size="small"
                    value={filters.state.name}
                    onChange={(e) => filters.setState({ name: e.target.value })}
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
                      },
                    }}
                  />
                </TableCell>
              );
            case 'email':
              return (
                <TableCell key={col.id}>
                  <TextField
                    fullWidth
                    size="small"
                    value={filters.state.email}
                    onChange={(e) => filters.setState({ email: e.target.value })}
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
                      },
                    }}
                  />
                </TableCell>
              );
            case 'role':
              return (
                <TableCell key={col.id}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={filters.state.role[0] || ''}
                      onChange={(e) =>
                        filters.setState({ role: e.target.value ? [e.target.value] : [] })
                      }
                      input={<OutlinedInput label="Rôle" />}
                    >
                      <MenuItem value="">
                        <em>Tous</em>
                      </MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Parent">Parent</MenuItem>
                      <MenuItem value="Enfant">Enfant</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              );
            case 'statut':
              return (
                <TableCell key={col.id}>
                  <FormControl fullWidth size="small" sx={{ display: 'none' }}>
                    <Select
                      multiple
                      value={filters.state.statut}
                      onChange={(e) => {
                        const value =
                          typeof e.target.value === 'string'
                            ? e.target.value.split(',')
                            : e.target.value;
                        filters.setState({ statut: value });
                      }}
                      input={<OutlinedInput label="Statut" />}
                      renderValue={(selected) =>
                        (selected as string[]).length
                          ? (selected as string[]).join(', ')
                          : 'Aucun'
                      }
                    >
                      <MenuItem value="Actif">
                        <Checkbox size="small" checked={filters.state.statut.includes('Actif')} />
                        Actif
                      </MenuItem>
                      <MenuItem value="Bloqué">
                        <Checkbox size="small" checked={filters.state.statut.includes('Bloqué')} />
                        Bloqué
                      </MenuItem>
                      <MenuItem value="Suspendu">
                        <Checkbox size="small" checked={filters.state.statut.includes('Suspendu')} />
                        Suspendu
                      </MenuItem>
                      <MenuItem value="Supprimé">
                        <Checkbox size="small" checked={filters.state.statut.includes('Supprimé')} />
                        Supprimé
                      </MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              );
            case 'createdAt':
              return (
                <TableCell key={col.id}>
                  <DatePicker
                    value={filters.state.createdAt}
                    onChange={(newValue) => filters.setState({ createdAt: newValue })}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: dateError,
                      },
                    }}
                  />
                </TableCell>
              );
            case 'lastLogin':
              return (
                <TableCell key={col.id}>
                  <DatePicker
                    value={filters.state.lastLogin}
                    onChange={(newValue) => filters.setState({ lastLogin: newValue })}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                        error: dateError,
                        helperText: dateError
                          ? 'La date de fin doit être postérieure à la date de début'
                          : null,
                        sx: {
                          [`& .${formHelperTextClasses.root}`]: {
                            position: 'absolute',
                            bottom: -24,
                          },
                        },
                      },
                    }}
                  />
                </TableCell>
              );
            case 'actions':
              return <TableCell key={col.id} />;
            default:
              return <TableCell key={col.id} />;
          }
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
      ) : (
        <>
        </>
      )}
    </TableHead>
  );
}
