import React from 'react';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { 
  Box, 
  Chip, 
  Stack, 
  Select,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment
} from '@mui/material';

import type { IKanbanAssignee} from '../types/kanban';

// Define the props interface
interface KanbanFiltersProps {
  filters: {
    taskName: string;
    assignee: string[];
    status: string[];
    priority: string[];
    reporter: string[];
  };
  onFilterChange: (name: string, value: any) => void;
  onClearFilters: () => void;
  assignees: IKanbanAssignee[];
  priorities: string[];
  statuses: string[];
  reporters: { id: string; name: string }[];
}

export function KanbanFilters({
  filters,
  onFilterChange,
  onClearFilters,
  assignees,
  priorities,
  statuses,
  reporters
}: KanbanFiltersProps) {
  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={2} 
      sx={{ mb: 3, width: '100%' }}
    >
      {/* Task Name Filter */}
      <TextField
        size="small"
        label="Recherche tâche"
        value={filters.taskName}
        onChange={(e) => onFilterChange('taskName', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: filters.taskName ? (
            <InputAdornment position="end">
              <ClearIcon 
                fontSize="small" 
                sx={{ cursor: 'pointer' }}
                onClick={() => onFilterChange('taskName', '')}
              />
            </InputAdornment>
          ) : (
            <></>
          ),
        }}
      />

      {/* Assignee Filter */}
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="assignee-filter-label">Cessionnaire</InputLabel>
        <Select
          labelId="Cessionnaire-filter-label"
          multiple
          value={filters.assignee}
          onChange={(e) => onFilterChange('assignee', e.target.value)}
          input={<OutlinedInput label="Cessionnaire" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip 
                  key={value} 
                  label={assignees.find(a => a.id === value)?.name || value} 
                  size="small" 
                />
              ))}
            </Box>
          )}
        >
          {assignees.map((assignee) => (
            <MenuItem key={assignee.id} value={assignee.id}>
              {assignee.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="status-filter-label">Statut</InputLabel>
        <Select
          labelId="status-filter-label"
          multiple
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          input={<OutlinedInput label="Statut" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Priority Filter */}
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="priority-filter-label">Priorité</InputLabel>
        <Select
          labelId="priority-filter-label"
          multiple
          value={filters.priority}
          onChange={(e) => onFilterChange('priority', e.target.value)}
          input={<OutlinedInput label="Priorité" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} size="small" />
              ))}
            </Box>
          )}
        >
          {priorities.map((priority) => (
            <MenuItem key={priority} value={priority}>
              {priority}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Reporter Filter */}
      <FormControl size="small" sx={{ minWidth: 180 }}>
        <InputLabel id="reporter-filter-label">Rapporteur</InputLabel>
        <Select
          labelId="reporter-filter-label"
          multiple
          value={filters.reporter}
          onChange={(e) => onFilterChange('reporter', e.target.value)}
          input={<OutlinedInput label="Rapporteur" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip 
                  key={value} 
                  label={reporters.find(r => r.id === value)?.name || value} 
                  size="small" 
                />
              ))}
            </Box>
          )}
        >
          {reporters.map((reporter) => (
            <MenuItem key={reporter.id} value={reporter.id}>
              {reporter.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Clear Filters Button */}
      <Tooltip title = 'Réinitialiser'>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip 
          icon={<FontAwesomeIcon icon={faRedoAlt} />}
          onClick={onClearFilters} 
          color="primary" 
          variant="outlined"
          sx={{ cursor: 'pointer', pl:'8px' }}
        />
      </Box>
      </Tooltip>
    </Stack>
  );
}