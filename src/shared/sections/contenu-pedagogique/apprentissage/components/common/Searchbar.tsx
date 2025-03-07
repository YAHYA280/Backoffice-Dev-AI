'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faSearch, faSliders } from '@fortawesome/free-solid-svg-icons';

import { Stack, alpha, styled, TextField, IconButton, InputAdornment } from '@mui/material';

const StyledRoot = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(2),
  paddingTop: theme.spacing(2),
}));

const StyledSearch = styled(TextField)(({ theme }) => ({
  width: 320,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 360,
    boxShadow: theme.customShadows?.z8,
  },
  '& fieldset': {
    borderWidth: '1px !important',
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

interface SearchBarProps {
  filterName: string;
  onFilterName: (value: string) => void;
  placeholder?: string;
  hasFilters?: boolean;
  onOpenFilter?: (event: React.MouseEvent<HTMLElement>) => void;
  sx?: SxProps<Theme>;
}

export const SearchBar = ({
  filterName,
  onFilterName,
  placeholder = 'Rechercher...',
  hasFilters = false,
  onOpenFilter,
  sx,
}: SearchBarProps) => (
  <StyledRoot sx={sx}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <StyledSearch
        value={filterName}
        onChange={(e) => onFilterName(e.target.value)}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <FontAwesomeIcon icon={faSearch} style={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
          endAdornment: filterName && (
            <InputAdornment position="end">
              <IconButton onClick={() => onFilterName('')}>
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {hasFilters && onOpenFilter && (
        <IconButton onClick={onOpenFilter}>
          <FontAwesomeIcon icon={faSliders} />
        </IconButton>
      )}
    </Stack>
  </StyledRoot>
);
