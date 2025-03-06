'use client';

import React from 'react';
import {
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  styled,
  alpha, // Import alpha function from MUI
} from '@mui/material';
import type { Theme, SxProps } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes, faSliders } from '@fortawesome/free-solid-svg-icons';

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
  onOpenFilter?: () => void;
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
