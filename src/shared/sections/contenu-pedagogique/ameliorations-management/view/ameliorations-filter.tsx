import React from 'react';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Chip, Stack, Select, Button, MenuItem, InputLabel, FormControl } from '@mui/material';

import { _emails } from 'src/shared/_mock';
import {
  AMELIORATION_TYPES_OPTIONS,
  AMELIORATION_NIVEAUX_OPTIONS,
  AMELIORATION_SOURCES_OPTIONS
} from 'src/shared/_mock/_ameliorations';

import { AmeliorationSearch } from './amelioration-search';

type AmeliorationFiltersProps = {
  filters: any;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  searchLoading: boolean;
  setOpenModal: (open: boolean) => void;
};

export function AmeliorationFilters({
  filters,
  searchQuery,
  setSearchQuery,
  searchResults,
  searchLoading,
  setOpenModal,
}: AmeliorationFiltersProps) {

  const handleResetFilters = () => {
    filters.setState({
      assignee: [],
      type: '',
      niveau: '',
      source: '',
      matiere: '',
      exercice: [],
    });
    setSearchQuery('');
  };

  const handleEmailChange = (event: any) => {
    const { value } = event.target;
    filters.setState({
      ...filters.state,
      assignee: typeof value === 'string' ? value.split(',') : value,
    });
  };

  return (
    <Stack direction="row" spacing={1} flexShrink={0}>
      <AmeliorationSearch
        query={searchQuery}
        results={searchResults}
        onSearch={setSearchQuery}
        loading={searchLoading}
      />

      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel>Assignée à</InputLabel>
        <Select
          multiple
          value={filters.state.assignee}
          onChange={handleEmailChange}
          renderValue={(selected) => (
            <Stack direction="row" spacing={1}>
              {selected.map((email: string) => (
                <Chip key={email} label={email} />
              ))}
            </Stack>
          )}
        >
          {_emails.map((email) => (
            <MenuItem key={email} value={email}>
              {email}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={filters.state.type}
          onChange={(e) => filters.setState({ ...filters.state, type: e.target.value })}
          displayEmpty
        >
          {AMELIORATION_TYPES_OPTIONS.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Niveau</InputLabel>
        <Select
          value={filters.state.niveau}
          onChange={(e) => filters.setState({ ...filters.state, niveau: e.target.value })}
          displayEmpty
        >
          {AMELIORATION_NIVEAUX_OPTIONS.map((niveau) => (
            <MenuItem key={niveau} value={niveau}>
              {niveau}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Matière</InputLabel>
        <Select
          value={filters.state.matiere}
          onChange={(e) => filters.setState({ ...filters.state, matiere: e.target.value })}
          displayEmpty
        />
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Exercice</InputLabel>
        <Select
          value={filters.state.exercice}
          onChange={(e) => filters.setState({ ...filters.state, exercice: e.target.value })}
          multiple
          renderValue={(selected) => (
            <Stack direction="row" spacing={1}>
              {selected.map((value: string) => (
                <Chip key={value} label={value} />
              ))}
            </Stack>
          )}
        />
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>Source</InputLabel>
        <Select
          value={filters.state.source}
          onChange={(e) => filters.setState({ ...filters.state, source: e.target.value })}
          displayEmpty
        >
          {AMELIORATION_SOURCES_OPTIONS.map((source) => (
            <MenuItem key={source} value={source}>
              {source}
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

      <Button
        variant="contained"
        color="primary"
        size="small"
        sx={{ height: '100%', ml: 'auto' }}
        onClick={() => setOpenModal(true)}
      >
        Ajouter
      </Button>

    </Stack>
  );
}
