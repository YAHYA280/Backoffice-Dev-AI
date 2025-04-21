import React from 'react';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Box,
  Chip,
  Stack,
  alpha,
  Select,
  Button,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { ModerationSearch } from './moderation-search';

// Constants for filter options
const MODERATION_LABELS_OPTIONS = ['contenu inapproprié', 'hors-sujet', 'spam'];
const MODERATION_PRIORITY_OPTIONS = ['faible', 'moyenne', 'haute'];
const MODERATION_COLUMN_OPTIONS = ['Nouveau', 'En cours', 'Resolu', 'Rejeter'];

type ModerationFiltersProps = {
  filters: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  searchLoading: boolean;
  setOpenModal?: (open: boolean) => void;
};

export function ModerationFilters({
  filters,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  setOpenModal,
}: ModerationFiltersProps) {
  const handleResetFilters = () => {
    filters.setState({
      columns: [],
      priority: '',
      category: '',
    });
    setSearchQuery('');
  };

  const handleColumnChange = (event: any) => {
    const { value } = event.target;
    filters.setState({
      ...filters.state,
      columns: typeof value === 'string' ? value.split(',') : value,
    });
  };

  return (
    <Stack direction="row" spacing={1} flexShrink={0}>
      <ModerationSearch
        query={searchQuery}
        results={searchResults}
        onSearch={setSearchQuery}
        loading={searchLoading}
      />

      <FormControl
        size="small"
        sx={{
          minWidth: 200,
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
          '& .MuiInputLabel-root': {
            '&.Mui-focused': {
              fontWeight: 600,
            },
          },
        }}
      >
        <InputLabel>Colonnes</InputLabel>
        <Select
          multiple
          value={filters.state.columns || []}
          input={<OutlinedInput label="Colonnes" sx={{ borderRadius: 1.5 }} />}
          onChange={handleColumnChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {selected.map((column: string) => (
                <Chip
                  key={column}
                  label={column}
                  size="small"
                  onDelete={() => {
                    const newColumns = filters.state.columns.filter((c: string) => c !== column);
                    handleColumnChange({ target: { value: newColumns } });
                  }}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 600,
                    borderRadius: 1,
                    height: '24px',
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                    },
                  }}
                />
              ))}
            </Box>
          )}
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
            PaperProps: {
              style: {
                maxHeight: 224,
                borderRadius: 8,
                boxShadow: '0 8px 16px 0 rgba(0,0,0,0.1)',
              },
            },
          }}
          sx={{
            minHeight: '42px',
            '& .MuiOutlinedInput-input': {
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              padding: '8px',
              height: 'auto',
            },
          }}
        >
          {MODERATION_COLUMN_OPTIONS.filter(Boolean).map((column) => (
            <MenuItem
              key={column}
              value={column}
              sx={{
                borderRadius: 1,
                mx: 0.5,
                my: 0.5,
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                },
                '&.Mui-selected': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                  },
                },
              }}
            >
              {column}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={filters.state.category || ''}
          input={<OutlinedInput label="Catégorie" />}
          onChange={(e) => filters.setState({ ...filters.state, category: e.target.value })}
        >
          {MODERATION_LABELS_OPTIONS.map((category) => (
            <MenuItem key={category} value={category}>
              {category || ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Priorité</InputLabel>
        <Select
          value={filters.state.priority || ''}
          input={<OutlinedInput label="Priorité" />}
          onChange={(e) => filters.setState({ ...filters.state, priority: e.target.value })}
        >
          {MODERATION_PRIORITY_OPTIONS.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {priority || ''}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={handleResetFilters}
          sx={{ height: '100%' }}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </FormControl>

      <ConditionalComponent isValid={!!setOpenModal}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ height: '100%', ml: 'auto' }}
            onClick={() => setOpenModal && setOpenModal(true)}
          >
            Ajouter
          </Button>
      </ConditionalComponent>
    </Stack>
  );
}
