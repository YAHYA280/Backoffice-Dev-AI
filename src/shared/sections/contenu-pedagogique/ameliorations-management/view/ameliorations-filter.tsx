import React from 'react';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Box, Chip, Stack, Select, Button, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';

import { _emails } from 'src/shared/_mock';
import {
  AMELIORATION_TYPES_OPTIONS,
  AMELIORATION_NIVEAUX_OPTIONS,
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
    <Box sx={{ 
      display: 'flex', 
      width: '100%',
      alignItems: 'center',
      flexWrap: {xs: 'wrap', md: 'nowrap'},
      gap: 1
    }}>
      <Box sx={{ 
        flexBasis: {xs: '100%', sm: '220px', md: '160px'},
        flexShrink: 0,
        maxWidth: {xs: '100%', sm: '220px', md: '160px'}
      }}>
        <AmeliorationSearch
          query={searchQuery}
          results={searchResults}
          onSearch={setSearchQuery}
          loading={searchLoading}
        />
      </Box>

      {/* Form controls wrapper with margin-left */}
      <Box sx={{ 
        display: 'flex',
        flexWrap: {xs: 'wrap', md: 'nowrap'},
        gap: 1,
        ml: {xs: 0, sm: 3, md: 13},
        mt: {xs: 1, sm: 0},
        width: {xs: '100%', sm: 'auto'}
      }}>
        <FormControl 
          size="small" 
          sx={{ 
            flexBasis: {xs: '48%', sm: '140px', md: '120px'},
            flexShrink: 0
          }}
        >
          <InputLabel>Assignée à</InputLabel>
          <Select
            multiple
            value={filters.state.assignee}
            onChange={handleEmailChange}
            input={<OutlinedInput label="Assignée à" />}
            renderValue={(selected) => (
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {selected.map((email: string) => (
                  <Chip key={email} label={email} size="small" sx={{ height: '20px', fontSize: '0.7rem' }} />
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

        <FormControl 
          size="small" 
          sx={{ 
            flexBasis: {xs: '48%', sm: '100px', md: '100px'},
            flexShrink: 0
          }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            value={filters.state.type}
            input={<OutlinedInput label="Type" />}
            onChange={(e) => filters.setState({ ...filters.state, type: e.target.value })}
          >
            {AMELIORATION_TYPES_OPTIONS.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          size="small" 
          sx={{ 
            flexBasis: {xs: '48%', sm: '100px', md: '100px'},
            flexShrink: 0
          }}
        >
          <InputLabel>Niveau</InputLabel>
          <Select
            value={filters.state.niveau}
            input={<OutlinedInput label="Niveau" />}
            onChange={(e) => filters.setState({ ...filters.state, niveau: e.target.value })}
          >
            {AMELIORATION_NIVEAUX_OPTIONS.map((niveau) => (
              <MenuItem key={niveau} value={niveau}>
                {niveau}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl 
          size="small" 
          sx={{ 
            flexBasis: {xs: '48%', sm: '100px', md: '100px'},
            flexShrink: 0
          }}
        >
          <InputLabel>Matière</InputLabel>
          <Select
            value={filters.state.matiere}
            input={<OutlinedInput label="Matière" />}
            onChange={(e) => filters.setState({ ...filters.state, matiere: e.target.value })}
          />
        </FormControl>

        <FormControl 
          size="small" 
          sx={{ 
            flexBasis: {xs: '75%', sm: '120px', md: '110px'},
            flexShrink: 0
          }}
        >
          <InputLabel>Exercice</InputLabel>
          <Select
            value={filters.state.exercice}
            input={<OutlinedInput label="Exercice" />}
            onChange={(e) => filters.setState({ ...filters.state, exercice: e.target.value })}
            multiple
            renderValue={(selected) => (
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {selected.map((value: string) => (
                  <Chip key={value} label={value} size="small" sx={{ height: '20px', fontSize: '0.7rem' }} />
                ))}
              </Stack>
            )}
          />
        </FormControl>
        
        <Button
          variant="outlined"
          size="small"
          onClick={handleResetFilters}
          color="primary"
          sx={{ 
            height: '40px', 
            width: '40px',
            minWidth: '40px',
            flexShrink: 0,
            ml: {xs: 'auto', sm: 0}
          }}
        >
          <FontAwesomeIcon icon={faRedo} />
        </Button>
      </Box>
    </Box>
  );
}