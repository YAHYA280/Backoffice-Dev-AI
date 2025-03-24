'use client';

import type { IFAQTableFilters } from 'src/contexts/types/faq';
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
  filters: UseSetStateReturn<IFAQTableFilters>;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function FaqTableHead({
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
  const [showCategorieInput, setShowCategorieInput] = useState(false);
  const [showStatutInput, setShowStatutInput] = useState(false);
  const [showDatePublicationInput, setShowDatePublicationInput] = useState(false);

  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];
    if (filters.state.title) {
      chips.push(
        <Chip
          key="title"
          {...chipProps}
          label={`Title: ${filters.state.title}`}
          onDelete={() => {
            filters.setState({ title: '' });
            setShowTitleInput(false);
          }}
        />
      );
    }
    if (filters.state.categorie && filters.state.categorie[0]) {
      chips.push(
        <Chip
          key="categorie"
          {...chipProps}
          label={`Catégorie: ${filters.state.categorie[0]}`}
          onDelete={() => {
            filters.setState({ categorie: [] });
            setShowCategorieInput(false);
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
    if (filters.state.datePublication) {
      const displayDate = dayjs(filters.state.datePublication).format('DD/MM/YYYY');
      chips.push(
        <Chip
          key="datePublication"
          {...chipProps}
          label={`Date de création: ${displayDate}`}
          onDelete={() => {
            filters.setState({ datePublication: null });
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
                    case 'title':
                      return showTitleInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={filters.state.title}
                          onChange={(e) =>
                            filters.setState({ title: e.target.value })
                          }
                          onBlur={() => {
                            if (!filters.state.title) setShowTitleInput(false);
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
                    case 'categorie':
                      return showCategorieInput ? (
                        <FormControl fullWidth size="small">
                          <Select
                            autoFocus
                            value={filters.state.categorie[0] || ''}
                            onChange={(e) => {
                              filters.setState({
                                categorie: e.target.value ? [e.target.value] : [],
                              });
                            }}
                            onClose={() => {
                              if (!filters.state.categorie[0])
                                setShowCategorieInput(false);
                            }}
                            input={<OutlinedInput label="Catégorie" />}
                          >
                            <MenuItem value="">
                              <em>Tous</em>
                            </MenuItem>
                            <MenuItem value="Compte">Compte</MenuItem>
                            <MenuItem value="Facturation">Facturation</MenuItem>
                            <MenuItem value="Sécurité">Sécurité</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        <Box
                          onClick={() => setShowCategorieInput(true)}
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
                            <MenuItem value="Publié">Publié</MenuItem>
                            <MenuItem value="Brouillion">Brouillion</MenuItem>
                            <MenuItem value="Archivé">Archivé</MenuItem>
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
                    case 'datePublication':
                      return showDatePublicationInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            filters.state.datePublication
                              ? dayjs(filters.state.datePublication, 'DD/MM/YYYY')
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              filters.setState({
                                datePublication: newValue.format('DD/MM/YYYY'),
                              });
                            } else {
                              filters.setState({ datePublication: '' });
                            }
                          }}
                          onClose={() => {
                            if (!filters.state.datePublication)
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