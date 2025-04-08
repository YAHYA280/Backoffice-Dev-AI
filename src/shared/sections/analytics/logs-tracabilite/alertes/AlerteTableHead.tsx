'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IAlerteTableFilters } from 'src/shared/_mock/_logs';

import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import TableSortLabel from '@mui/material/TableSortLabel';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Chip,
  Stack,
  Select,
  TableRow,
  MenuItem,
  Checkbox,
  TableHead,
  TableCell,
  TextField,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';

import { chipProps, FiltersBlock, FiltersResult } from 'src/shared/components/filters-result';

type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
};

type Props = {
  columns: Column[];
  filters: UseSetStateReturn<IAlerteTableFilters>;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function AlerteTableHead({
  columns,
  filters,
  order,
  orderBy,
  onSort,
  totalResults,
  numSelected = 0,
  rowCount = 0,
  onSelectAllRows,
}: Props) {
  const [showTitreInput, setShowTitreInput] = useState(false);
  const [showUserNameInput, setShowUserNameInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showDateAlerteInput, setShowDateAlerteInput] = useState(false);
  const [showCriticiteInput, setShowCriticiteInput] = useState(false);

  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];
    if (filters.state.titre) {
      chips.push(
        <Chip
          key="titre"
          {...chipProps}
          label={`Titre: ${filters.state.titre}`}
          onDelete={() => {
            filters.setState({ titre: '' });
            setShowTitreInput(false);
          }}
        />
      );
    }
    if (filters.state.userName) {
      chips.push(
        <Chip
          key="userName"
          {...chipProps}
          label={`Nom: ${filters.state.userName}`}
          onDelete={() => {
            filters.setState({ userName: '' });
            setShowUserNameInput(false);
          }}
        />
      );
    }
    if (filters.state.description) {
      chips.push(
        <Chip
          key="description"
          {...chipProps}
          label={`Description: ${filters.state.description}`}
          onDelete={() => {
            filters.setState({ description: '' });
            setShowDescriptionInput(false);
          }}
        />
      );
    }
    if (filters.state.dateAlerte) {
      const displayDate = dayjs(filters.state.dateAlerte, 'DD/MM/YYYY').isValid()
        ? dayjs(filters.state.dateAlerte, 'DD/MM/YYYY').format('DD/MM/YYYY')
        : 'Aucune date disponible';
      chips.push(
        <Chip
          key="dateAlerte"
          {...chipProps}
          label={`Date Alerte: ${displayDate}`}
          onDelete={() => {
            filters.setState({ dateAlerte: null });
            setShowDateAlerteInput(false);
          }}
        />
      );
    }
    if (filters.state.criticite && filters.state.criticite.length) {
      chips.push(
        <Chip
          key="criticite"
          {...chipProps}
          label={`Criticité: ${(filters.state.criticite as string[]).join(', ')}`}
          onDelete={() => {
            filters.setState({ criticite: [] });
            setShowCriticiteInput(false);
          }}
        />
      );
    }
    return chips;
  }, [filters]);

  return (
    <TableHead
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: '#fff',
        zIndex: 2,
      }}
    >
      <TableRow
        sx={{
          height: 50,
          '& .MuiTableCell-root': {
            padding: '5px 10px',
          },
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

          if (col.id === 'actions') {
                      return (
                        <TableCell
                          key={col.id}
                          width={col.width}
                          sx={{
                            ...col.sx,
                            textAlign: 'right',
                          }}
                          sortDirection={orderBy === col.id ? order : false}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                              gap: -0.3,
                            }}
                          >
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
            <TableCell
              key={col.id}
              width={col.width}
              sx={col.sx}
              sortDirection={orderBy === col.id ? order : false}
              align="left"
            >
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
                    case 'titre':
                      return showTitreInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.titre}
                          onChange={(e) =>
                            filters.setState({ titre: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.titre) setShowTitreInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: {
                              '& fieldset': { border: 'none' },
                              backgroundColor: 'background.neutral',
                              borderRadius: 1,
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowTitreInput(true)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'background.neutral',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'userName':
                      return showUserNameInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.userName}
                          onChange={(e) =>
                            filters.setState({ userName: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.userName)
                              setShowUserNameInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: {
                              '& fieldset': { border: 'none' },
                              backgroundColor: 'background.neutral',
                              borderRadius: 1,
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowUserNameInput(true)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'background.neutral',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'description':
                      return showDescriptionInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.description}
                          onChange={(e) =>
                            filters.setState({ description: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.description)
                              setShowDescriptionInput(false);
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <FontAwesomeIcon icon={faSearch} />
                              </InputAdornment>
                            ),
                            sx: {
                              '& fieldset': { border: 'none' },
                              backgroundColor: 'background.neutral',
                              borderRadius: 1,
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowDescriptionInput(true)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'background.neutral',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'dateAlerte':
                      return showDateAlerteInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            filters.state.dateAlerte
                              ? dayjs(filters.state.dateAlerte, 'DD/MM/YYYY')
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              filters.setState({
                                dateAlerte: newValue.format('DD/MM/YYYY'),
                              });
                            } else {
                              filters.setState({ dateAlerte: null });
                            }
                          }}
                          onClose={() => {
                            if (!filters.state.dateAlerte)
                              setShowDateAlerteInput(false);
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowDateAlerteInput(true)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'background.neutral',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <FontAwesomeIcon icon={faSearch} />
                        </Box>
                      );
                    case 'criticite':
                      return showCriticiteInput ? (
                        <FormControl fullWidth size="small">
                          <Select
                            autoFocus
                            value={filters.state.criticite[0] || ''}
                            onChange={(e) =>
                                filters.setState({
                                    criticite: e.target.value
                                  ? [e.target.value as string]
                                  : [],
                              })
                            }
                            onClose={() => {
                              if (!filters.state.criticite[0])
                                setShowCriticiteInput(false);
                            }}
                            input={<OutlinedInput label="Criticité" />}
                          >
                            <MenuItem value="">
                              <em>Tous</em>
                            </MenuItem>
                            <MenuItem value="Élevé">Élevé</MenuItem>
                            <MenuItem value="Modéré">Modéré</MenuItem>
                            <MenuItem value="Faible">Faible</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Box
                          onClick={() => setShowCriticiteInput(true)}
                          sx={{
                            cursor: 'pointer',
                            backgroundColor: 'background.neutral',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                          }}
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
            <FiltersResult totalResults={totalResults} onReset={() => {
              filters.onResetState();
              setShowCriticiteInput(false);
              setShowDescriptionInput(false);
              setShowUserNameInput(false);
              setShowDateAlerteInput(false);
              }}>
              <FiltersBlock label="" isShow>
                <Stack direction="row" spacing={1}>
                  {filterChips}
                </Stack>
              </FiltersBlock>
            </FiltersResult>
          </TableCell>
        </TableRow>
      ) : null}
    </TableHead>
  );
}