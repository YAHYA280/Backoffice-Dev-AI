'use client';

import type { UseSetStateReturn } from 'src/hooks/use-set-state';
import type { IActionsCritiqueTableFilters } from 'src/shared/_mock/_logs';

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
  Checkbox,
  TableRow,
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

type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
};

type Props = {
  columns: Column[];
  actionFilters: UseSetStateReturn<IActionsCritiqueTableFilters>;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function ActionsTableHead({
  columns,
  actionFilters,
  order,
  orderBy,
  onSort,
  totalResults,
  numSelected = 0,
  rowCount = 0,
  onSelectAllRows,
}: Props) {
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [showNumberFaqInput, setShowNumberFaqInput] = useState(false);
  const [showDatePublicationInput, setShowDatePublicationInput] = useState(false);
  const [showStatutInput, setShowStatutInput] = useState(false);
  

  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];
    if (actionFilters.state.userName) {
      chips.push(
        <Chip
          key="userName"
          {...chipProps}
          label={`Nom: ${actionFilters.state.userName}`}
          onDelete={() => {
            actionFilters.setState({ userName: '' });
            setShowTitleInput(false);
          }}
        />
      );
    }
    if (actionFilters.state.details) {
      chips.push(
        <Chip
          key="details"
          {...chipProps}
          label={`Détails: ${actionFilters.state.details}`}
          onDelete={() => {
            actionFilters.setState({ details: '' });
            setShowDescriptionInput(false);
          }}
        />
      );
    }
    if (actionFilters.state.typeAction) {
      chips.push(
        <Chip
          key="typeAction"
          {...chipProps}
          label={`Type d'action: ${actionFilters.state.typeAction}`}
          onDelete={() => {
            actionFilters.setState({ typeAction: '' });
            setShowNumberFaqInput(false);
          }}
        />
      );
    }
    if (actionFilters.state.dateAction) {
      const displayDate = dayjs(actionFilters.state.dateAction, 'DD/MM/YYYY').isValid() ? dayjs(actionFilters.state.dateAction, 'DD/MM/YYYY').format('DD/MM/YYYY') : 'Aucune date disponible';
      chips.push(
        <Chip
          key="dateAction"
          {...chipProps}
          label={`Date d'action: ${displayDate}`}
          onDelete={() => {
            actionFilters.setState({ dateAction: null });
            setShowDatePublicationInput(false);
          }}
        />
      );
    }

    if (actionFilters.state.statut && actionFilters.state.statut.length) {
    chips.push(
        <Chip
        key="statut"
        {...chipProps}
        label={`Statut: ${(actionFilters.state.statut as string[]).join(', ')}`}
        onDelete={() => {
            actionFilters.setState({ statut: [] });
            setShowStatutInput(false);
        }}
        />
    );
    }

    return chips;
  }, [actionFilters]);

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
                  onChange={(event) => onSelectAllRows?.(event.target.checked)}
                />
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
                    case 'userName':
                      return showTitleInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={actionFilters.state.userName}
                          onChange={(e) => actionFilters.setState({ userName: e.target.value })}
                          onBlur={() => {
                            if (!actionFilters.state.userName) setShowTitleInput(false);
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
                          onClick={() => setShowTitleInput(true)}
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
                    case 'typeAction':
                      return showDescriptionInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={actionFilters.state.typeAction}
                          onChange={(e) => actionFilters.setState({ typeAction: e.target.value })}
                          onBlur={() => {
                            if (!actionFilters.state.typeAction) {
                              setShowDescriptionInput(false);
                            }
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
                    case 'details':
                      return showNumberFaqInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={actionFilters.state.details}
                          onChange={(e) => actionFilters.setState({ details: e.target.value })}
                          onBlur={() => {
                            if (!actionFilters.state.details) setShowNumberFaqInput(false);
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
                          onClick={() => setShowNumberFaqInput(true)}
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

                    case 'statut':
                      return showStatutInput ? (
                        <FormControl fullWidth size="small">
                          <Select
                            autoFocus
                            value={actionFilters.state.statut[0] || ''}
                            onChange={(e) =>
                                actionFilters.setState({
                                statut: e.target.value
                                  ? [e.target.value as string]
                                  : [],
                              })
                            }
                            onClose={() => {
                              if (!actionFilters.state.statut[0])
                                setShowStatutInput(false);
                            }}
                            input={<OutlinedInput label="Statut" />}
                          >
                            <MenuItem value="">
                              <em>Tous</em>
                            </MenuItem>
                            <MenuItem value="Succès">Succès</MenuItem>
                            <MenuItem value="Échec">Échec</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Box
                          onClick={() => setShowStatutInput(true)}
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

                    case 'dateAction':
                      return showDatePublicationInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            actionFilters.state.dateAction
                              ? dayjs(actionFilters.state.dateAction, 'DD/MM/YYYY')
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              actionFilters.setState({ dateAction: newValue.format('DD/MM/YYYY') });
                            } else {
                              actionFilters.setState({ dateAction: '' });
                            }
                          }}
                          onClose={() => {
                            if (!actionFilters.state.dateAction) setShowDatePublicationInput(false);
                          }}
                          format="DD/MM/YYYY"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                              sx: {
                                '& fieldset': { border: 'none' },
                                backgroundColor: 'background.neutral',
                                borderRadius: 1,
                              },
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FontAwesomeIcon icon={faSearch} />
                                  </InputAdornment>
                                ),
                              },
                            },
                          }}
                        />
                      ) : (
                        <Box
                          onClick={() => setShowDatePublicationInput(true)}
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
              actionFilters.onResetState();
              setShowTitleInput(false);
              setShowDescriptionInput(false);
              setShowNumberFaqInput(false);
              setShowDatePublicationInput(false);
            }}>
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