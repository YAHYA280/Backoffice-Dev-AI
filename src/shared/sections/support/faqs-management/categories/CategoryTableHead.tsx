'use client';

import type { IDateValue } from 'src/contexts/types/common';
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
  Checkbox,
  TableRow,
  TableHead,
  TableCell,
  TextField,
  TableSortLabel,
  InputAdornment,
} from '@mui/material';

import { chipProps, FiltersBlock, FiltersResult } from 'src/shared/components/filters-result';

export type ICategoryFilters = {
  title: string;
  description: string;
  numberFaq: string;
  datePublication: IDateValue;
};

type Column = {
  id: string;
  label: string;
  width?: number;
  sx?: any;
};

type Props = {
  columns: Column[];
  categoryFilters: UseSetStateReturn<ICategoryFilters>;
  order: 'asc' | 'desc';
  orderBy: string;
  onSort: (columnId: string) => void;
  totalResults: number;
  numSelected?: number;
  rowCount?: number;
  onSelectAllRows?: (checked: boolean) => void;
};

export function CategoryTableHead({
  columns,
  categoryFilters,
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

  const filterChips = useMemo(() => {
    const chips: JSX.Element[] = [];
    if (categoryFilters.state.title) {
      chips.push(
        <Chip
          key="title"
          {...chipProps}
          label={`Titre: ${categoryFilters.state.title}`}
          onDelete={() => {
            categoryFilters.setState({ title: '' });
            setShowTitleInput(false);
          }}
        />
      );
    }
    if (categoryFilters.state.description) {
      chips.push(
        <Chip
          key="description"
          {...chipProps}
          label={`Description: ${categoryFilters.state.description}`}
          onDelete={() => {
            categoryFilters.setState({ description: '' });
            setShowDescriptionInput(false);
          }}
        />
      );
    }
    if (categoryFilters.state.numberFaq) {
      chips.push(
        <Chip
          key="numberFaq"
          {...chipProps}
          label={`Nombre FAQ: ${categoryFilters.state.numberFaq}`}
          onDelete={() => {
            categoryFilters.setState({ numberFaq: '' });
            setShowNumberFaqInput(false);
          }}
        />
      );
    }
    if (categoryFilters.state.datePublication) {
      const displayDate = dayjs(categoryFilters.state.datePublication).format('DD/MM/YYYY');
      chips.push(
        <Chip
          key="datePublication"
          {...chipProps}
          label={`Date de création: ${displayDate}`}
          onDelete={() => {
            categoryFilters.setState({ datePublication: null });
            setShowDatePublicationInput(false);
          }}
        />
      );
    }
    return chips;
  }, [categoryFilters]);

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
          if (col.id === 'actions') {
            return (
              <TableCell
                key={col.id}
                width={col.width}
                sx={{ ...col.sx, textAlign: 'right' }}
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
                          value={categoryFilters.state.title}
                          onChange={(e) => categoryFilters.setState({ title: e.target.value })}
                          onBlur={() => {
                            if (!categoryFilters.state.title) setShowTitleInput(false);
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
                    case 'description':
                      return showDescriptionInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={categoryFilters.state.description}
                          onChange={(e) => categoryFilters.setState({ description: e.target.value })}
                          onBlur={() => {
                            if (!categoryFilters.state.description) {
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
                    case 'numberFaq':
                      return showNumberFaqInput ? (
                        <TextField
                          fullWidth
                          size="small"
                          autoFocus
                          value={categoryFilters.state.numberFaq}
                          onChange={(e) => categoryFilters.setState({ numberFaq: e.target.value })}
                          onBlur={() => {
                            if (!categoryFilters.state.numberFaq) setShowNumberFaqInput(false);
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
                    case 'datePublication':
                      return showDatePublicationInput ? (
                        <DatePicker
                          autoFocus
                          value={
                            categoryFilters.state.datePublication
                              ? dayjs(categoryFilters.state.datePublication, 'DD/MM/YYYY')
                              : null
                          }
                          onChange={(newValue) => {
                            if (newValue) {
                              categoryFilters.setState({ datePublication: newValue.format('DD/MM/YYYY') });
                            } else {
                              categoryFilters.setState({ datePublication: '' });
                            }
                          }}
                          onClose={() => {
                            if (!categoryFilters.state.datePublication) setShowDatePublicationInput(false);
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
              categoryFilters.onResetState();
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