import React from 'react';

import { Box, Chip, Typography } from '@mui/material';

import type { IKanbanAssignee } from '../types/kanban';

interface FiltersStatusBarProps {
  filters: {
    taskName: string;
    assignee: string[];
    status: string[];
    priority: string[];
    reporter: string[];
  };
  assignees: IKanbanAssignee[];
  reporters: { id: string; name: string }[];
  taskCount: number;
  totalTaskCount: number;
}

export function FiltersStatusBar({ 
  filters, 
  assignees, 
  reporters,
  taskCount,
  totalTaskCount
}: FiltersStatusBarProps) {
  const hasActiveFilters = 
    filters.taskName || 
    filters.assignee.length > 0 || 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.reporter.length > 0;

  if (!hasActiveFilters) return null;

  return (
    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        Affichage {taskCount} de {totalTaskCount} tickets
      </Typography>
      
      <Box sx={{ flex: '1 1 auto' }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {filters.taskName ? (
          <Chip 
            label={`Name: ${filters.taskName}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ) : (
          <></>
        )}
        
        {filters.assignee.length > 0 ? (
          <Chip 
            label={`Assignees: ${filters.assignee.length}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ) : (
          <></>
        )}
        
        {filters.status.length > 0 ? (
          <Chip 
            label={`Status: ${filters.status.length}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ) : (
          <></>
        )}
        
        {filters.priority.length > 0 ? (
          <Chip 
            label={`Priority: ${filters.priority.length}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ) : (
          <></>
        )}
        
        {filters.reporter.length > 0 ? (
          <Chip 
            label={`Reporters: ${filters.reporter.length}`} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
}