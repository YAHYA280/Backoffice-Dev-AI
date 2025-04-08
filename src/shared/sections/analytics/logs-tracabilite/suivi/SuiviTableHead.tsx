'use client';

import type { ILogTableFilters } from 'src/shared/_mock/_logs';
import type { UseSetStateReturn } from 'src/hooks/use-set-state';

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
  filters: UseSetStateReturn<ILogTableFilters>;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function SuiviTableHead({
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
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [showStatutInput, setShowStatutInput] = useState(false);
  const [showIpaddressInput, setShowIpaddressInput] = useState(false);
  const [showDatePublicationInput, setShowDatePublicationInput] = useState(false);

  const [showNavigateurInput, setShowNavigateurInput] = useState(false);
  const [showAppareilInput, setShowAppareilInput] = useState(false);

  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];
    if (filters.state.userName) {
      chips.push(
        <Chip
          key="userName"
          {...chipProps}
          label={`Nom: ${filters.state.userName}`}
          onDelete={() => {
            filters.setState({ userName: '' });
            setShowTitleInput(false);
          }}
        />
      );
    }

    if (filters.state.device) {
      chips.push(
        <Chip
          key="device"
          {...chipProps}
          label={`Appareil: ${filters.state.device}`}
          onDelete={() => {
            filters.setState({ device: '' });
            setShowTitleInput(false);
          }}
        />
      );
    }


    if (filters.state.browser) {
      chips.push(
        <Chip
          key="browser"
          {...chipProps}
          label={`Navigateur: ${filters.state.browser}`}
          onDelete={() => {
            filters.setState({ browser: '' });
            setShowTitleInput(false);
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
          onDelete={() => {
            filters.setState({ statut: [] });
            setShowStatutInput(false);
          }}
        />
      );
    }
    if (filters.state.logintime) {
      const displayDate = dayjs(filters.state.logintime, 'DD/MM/YYYY').isValid() ? dayjs(filters.state.logintime, 'DD/MM/YYYY').format('DD/MM/YYYY') : 'Aucune date disponible';
      chips.push(
        <Chip
          key="logintime"
          {...chipProps}
          label={`Date de login: ${displayDate}`}
          onDelete={() => {
            filters.setState({ logintime: null });
            setShowDatePublicationInput(false);
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
                          value={filters.state.userName}
                          onChange={(e) =>
                            filters.setState({ userName: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.userName) setShowTitleInput(false);
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



                      case 'browser':
                      return showNavigateurInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.browser}
                          onChange={(e) =>
                            filters.setState({ browser: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.browser) setShowNavigateurInput(false);
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
                          onClick={() => setShowNavigateurInput(true)}
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


                      case 'device':
                      return showAppareilInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.device}
                          onChange={(e) =>
                            filters.setState({ device: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.device) setShowAppareilInput(false);
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
                          onClick={() => setShowAppareilInput(true)}
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

                      case 'ipaddress':
                        return showIpaddressInput ? (
                          <TextField
                            fullWidth
                            size="small"
                            autoFocus
                            value={filters.state.ipaddress}
                            onChange={(e) =>
                              filters.setState({ ipaddress: e.target.value })
                            }
                            onBlur={() => {
                              if (!filters.state.ipaddress) setShowIpaddressInput(false);
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
                            onClick={() => setShowIpaddressInput(true)}
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
                            value={filters.state.statut[0] || ''}
                            onChange={(e) =>
                              filters.setState({
                                statut: e.target.value
                                  ? [e.target.value as string]
                                  : [],
                              })
                            }
                            onClose={() => {
                              if (!filters.state.statut[0])
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
                    case 'logintime':
                      return showDatePublicationInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            filters.state.logintime
                              ? dayjs(filters.state.logintime, 'DD/MM/YYYY')
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              filters.setState({
                                logintime: newValue.format('DD/MM/YYYY'),
                              });
                            } else {
                              filters.setState({ logintime: null });
                            }
                          }}
                          onClose={() => {
                            if (!filters.state.logintime)
                              setShowDatePublicationInput(false);
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