// components/KanbanBoard/KanbanBoardHeader.tsx
import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Stack, Button } from '@mui/material';

import { paths } from 'src/routes/paths';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { KanbanFilters } from './kanban-filters';
import { FiltersStatusBar } from './kanban-filters-status-bar';

import type { IKanbanAssignee } from '../types/kanban';

interface KanbanBoardHeaderProps {
  onOpenDeletedTickets: () => void;
  showFilters: boolean;
  toggleFilters: () => void;
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
  filteredTaskCount: number;
  totalTaskCount: number;
}

export function KanbanBoardHeader({
  onOpenDeletedTickets,
  showFilters,
  toggleFilters,
  filters,
  onFilterChange,
  onClearFilters,
  assignees,
  priorities,
  statuses,
  reporters,
  filteredTaskCount,
  totalTaskCount,
}: KanbanBoardHeaderProps) {
  return (
    <>
      <CustomBreadcrumbs
        heading="Gestion des tickets"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Support', href: paths.dashboard.root },
          { name: 'Gestion des tickets' },
        ]}
        action={
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="error"
              startIcon={<FontAwesomeIcon icon={faTrash} style={{ fontSize: '14px' }} />}
              onClick={onOpenDeletedTickets}
              sx={{
                borderWidth: 1.5,
                color: 'primary.contrastText',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
                px: 2.5,
                py: 0.75,
              }}
            >
              Tickets supprimés
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <KanbanFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        assignees={assignees}
        priorities={priorities}
        statuses={statuses}
        reporters={reporters}
      />

      <FiltersStatusBar
        filters={filters}
        assignees={assignees}
        reporters={reporters}
        taskCount={filteredTaskCount}
        totalTaskCount={totalTaskCount}
      />
    </>
  );
}
