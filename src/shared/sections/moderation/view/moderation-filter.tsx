import React from 'react';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Chip, Stack, Select, Button, MenuItem, InputLabel, FormControl } from '@mui/material';

import { ModerationSearch } from './moderation-search';

// Constants for filter options
const MODERATION_LABELS_OPTIONS = ['contenu inapproprié', 'hors-sujet', 'spam', ''];
const MODERATION_PRIORITY_OPTIONS = ['low', 'medium', 'hight', ''];
const MODERATION_COLUMN_OPTIONS = ['Nouveau', 'En cours', 'Resolu', 'Rejeter', ''];

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

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Colonnes</InputLabel>
        <Select
          multiple
          value={filters.state.columns || []}
          onChange={handleColumnChange}
          renderValue={(selected) => (
            <Stack direction="row" spacing={1}>
              {selected.map((column: string) => (
                <Chip key={column} label={column} />
              ))}
            </Stack>
          )}
        >
          {MODERATION_COLUMN_OPTIONS.filter(Boolean).map((column) => (
            <MenuItem key={column} value={column}>
              {column}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Catégorie</InputLabel>
        <Select
          value={filters.state.category || ''}
          onChange={(e) => filters.setState({ ...filters.state, category: e.target.value })}
          displayEmpty
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
          onChange={(e) => filters.setState({ ...filters.state, priority: e.target.value })}
          displayEmpty
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
          size="small"
          onClick={handleResetFilters}
          sx={{ height: '100%' }}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </FormControl>

      {setOpenModal && (
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ height: '100%', ml: 'auto' }}
          onClick={() => setOpenModal(true)}
        >
          Ajouter
        </Button>
      )}
    </Stack>
  );
}