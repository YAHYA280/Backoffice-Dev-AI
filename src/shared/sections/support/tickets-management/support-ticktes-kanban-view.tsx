'use client';

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  CollisionDetection,
} from '@dnd-kit/core';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  pointerWithin,
  KeyboardSensor,
  rectIntersection,
  getFirstCollision,
  MeasuringStrategy,
} from '@dnd-kit/core';

import Stack from '@mui/material/Stack';

import { hideScrollY } from 'src/shared/theme/styles';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { EmptyContent } from 'src/shared/components/empty-content';

import { kanbanClasses } from './classes';
import { coordinateGetter } from './utils/utils';
import { KanbanColumn } from './column/kanban-column';
import { KanbanTaskItem } from './item/kanban-task-item';
import { KanbanColumnAdd } from './column/kanban-column-add';
import { KanbanColumnSkeleton } from './components/kanban-skeleton';
import { KanbanDragOverlay } from './components/kanban-drag-overlay';
import { moveTask, moveColumn, useGetBoard } from './actions/kanban';
import { KanbanBoardHeader } from './components/kanban-board-header';
import { DeletedTicketsDialog } from './components/DeletedTicketsDialog';

import type { IKanbanTask, IKanbanAssignee } from './types/kanban';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder';

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '24px',
  '--column-width': '336px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

interface IKanbanFilters {
  taskName: string;
  assignee: string[];
  status: string[];
  priority: string[];
  reporter: string[];
}

export function SupportTicketsKanbanView() {
  const { board, boardLoading, boardEmpty } = useGetBoard();

  const [columnFixed, setColumnFixed] = useState(true);

  const [deletedTicketsDialogOpen, setDeletedTicketsDialogOpen] = useState(false);

  const recentlyMovedToNewContainer = useRef(false);

  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const columnIds = board.columns.map((column) => column.id);

  const isSortingContainer = activeId ? columnIds.includes(activeId) : false;

  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<IKanbanFilters>({
    taskName: '',
    assignee: [],
    status: [],
    priority: [],
    reporter: [],
  });

  // Extract unique values for filter dropdowns
  const getAllAssignees = (): IKanbanAssignee[] => {
    const assignees: IKanbanAssignee[] = [];
    const assigneeIds = new Set();

    if (board && board.tasks) {
      Object.values(board.tasks).forEach((tasks) => {
        tasks.forEach((task) => {
          if (task.assignee && !assigneeIds.has(task.assignee.id)) {
            assigneeIds.add(task.assignee.id);
            assignees.push(task.assignee);
          }
        });
      });
    }

    return assignees;
  };

  const getAllPriorities = (): string[] => {
    const priorities = new Set<string>();

    if (board && board.tasks) {
      Object.values(board.tasks).forEach((tasks) => {
        tasks.forEach((task) => {
          priorities.add(task.priority);
        });
      });
    }

    return Array.from(priorities);
  };

  const getAllStatuses = (): string[] => {
    const statuses = new Set<string>();

    if (board && board.tasks) {
      Object.values(board.tasks).forEach((tasks) => {
        tasks.forEach((task) => {
          statuses.add(task.status);
        });
      });
    }

    return Array.from(statuses);
  };

  const getAllReporters = (): { id: string; name: string }[] => {
    const reporters: { id: string; name: string }[] = [];
    const reporterIds = new Set();

    if (board && board.tasks) {
      Object.values(board.tasks).forEach((tasks) => {
        tasks.forEach((task) => {
          if (task.reporter && !reporterIds.has(task.reporter.id)) {
            reporterIds.add(task.reporter.id);
            reporters.push({
              id: task.reporter.id,
              name: task.reporter.name,
            });
          }
        });
      });
    }

    return reporters;
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      taskName: '',
      assignee: [],
      status: [],
      priority: [],
      reporter: [],
    });
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  // Calculate the total number of tasks
  const getTotalTaskCount = (): number => {
    let count = 0;
    if (board && board.tasks) {
      Object.values(board.tasks).forEach((tasks) => {
        count += tasks.length;
      });
    }
    return count;
  };

  // Calculate the number of tasks after filtering
  const getFilteredTaskCount = (): number => {
    let count = 0;
    if (filteredBoard && filteredBoard.tasks) {
      Object.values(filteredBoard.tasks).forEach((tasks) => {
        count += tasks.length;
      });
    }
    return count;
  };

  // Apply filters to the board data
  const getFilteredBoard = () => {
    if (!board) return { columns: [], tasks: {} };

    // Create a deep copy of the board
    const filteredBoard = {
      columns: [...board.columns],
      tasks: {} as Record<UniqueIdentifier, IKanbanTask[]>,
    };

    // Apply filters to each column's tasks
    Object.keys(board.tasks).forEach((columnId) => {
      filteredBoard.tasks[columnId] = board.tasks[columnId].filter((task) => {
        // Task name filter
        if (
          filters.taskName &&
          task.name &&
          !task.name.toLowerCase().includes(filters.taskName.toLowerCase())
        ) {
          return false;
        }

        // Assignee filter
        if (
          filters.assignee.length > 0 &&
          (!task.assignee || !filters.assignee.includes(task.assignee.id as string))
        ) {
          return false;
        }

        // Status filter
        if (
          filters.status.length > 0 &&
          task.status &&
          !filters.status.includes(task.status as string)
        ) {
          return false;
        }

        // Priority filter
        if (
          filters.priority.length > 0 &&
          task.priority &&
          !filters.priority.includes(task.priority as string)
        ) {
          return false;
        }

        // Reporter filter
        if (
          filters.reporter.length > 0 &&
          task.reporter &&
          !filters.reporter.includes(task.reporter.id as string)
        ) {
          return false;
        }

        return true;
      });
    });

    return filteredBoard;
  };

  const filteredBoard = getFilteredBoard();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const handleOpenDeletedTicketsDialog = () => {
    setDeletedTicketsDialogOpen(true);
  };

  const handleCloseDeletedTicketsDialog = () => {
    setDeletedTicketsDialogOpen(false);
  };

  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      if (activeId && activeId in board.tasks) {
        return closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(
            (column) => column.id in board.tasks
          ),
        });
      }

      // Start by finding any intersecting droppable
      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0
          ? // If there are droppables intersecting with the pointer, return those
            pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in board.tasks) {
          const columnItems = board.tasks[overId].map((task) => task.id);

          // If a column is matched and it contains items (columns 'A', 'B', 'C')
          if (columnItems.length > 0) {
            // Return the closest droppable within that column
            overId = closestCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (column) => column.id !== overId && columnItems.includes(column.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new column, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new column, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeId, board?.tasks]
  );

  const findColumn = (id: UniqueIdentifier) => {
    if (id in board.tasks) {
      return id;
    }

    return Object.keys(board.tasks).find((key) =>
      board.tasks[key].map((task) => task.id).includes(id)
    );
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, []);

  /**
   * onDragStart
   */
  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

  /**
   * onDragOver
   */
  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!board) {
      console.error('Board is not available when dragging over');
      return;
    }

    const overId = over?.id;

    if (overId == null || active.id in board.tasks) {
      return;
    }

    const overColumn = findColumn(overId);

    const activeColumn = findColumn(active.id);

    if (!overColumn || !activeColumn) {
      return;
    }

    if (activeColumn !== overColumn) {
      const activeItems = board.tasks[activeColumn].map((task) => task.id);
      const overItems = board.tasks[overColumn].map((task) => task.id);
      const overIndex = overItems.indexOf(overId);
      const activeIndex = activeItems.indexOf(active.id);

      let newIndex: number;

      if (overId in board.tasks) {
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      recentlyMovedToNewContainer.current = true;

      const updateTasks = {
        ...board.tasks,
        [activeColumn]: board.tasks[activeColumn].filter((task) => task.id !== active.id),
        [overColumn]: [
          ...board.tasks[overColumn].slice(0, newIndex),
          board.tasks[activeColumn][activeIndex],
          ...board.tasks[overColumn].slice(newIndex, board.tasks[overColumn].length),
        ],
      };

      moveTask(updateTasks);
    }
  };

  /**
   * onDragEnd
   */
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id in board.tasks && over?.id) {
      const activeIndex = columnIds.indexOf(active.id);
      const overIndex = columnIds.indexOf(over.id);

      const updateColumns = arrayMove(board.columns, activeIndex, overIndex);

      moveColumn(updateColumns);
    }

    const activeColumn = findColumn(active.id);

    if (!activeColumn) {
      setActiveId(null);
      return;
    }

    const overId = over?.id;

    if (overId == null) {
      setActiveId(null);
      return;
    }

    const overColumn = findColumn(overId);

    if (overColumn) {
      const activeContainerTaskIds = board.tasks[activeColumn].map((task) => task.id);
      const overContainerTaskIds = board.tasks[overColumn].map((task) => task.id);

      const activeIndex = activeContainerTaskIds.indexOf(active.id);
      const overIndex = overContainerTaskIds.indexOf(overId);

      if (activeIndex !== overIndex) {
        const updateTasks = {
          ...board.tasks,
          [overColumn]: arrayMove(board.tasks[overColumn], activeIndex, overIndex),
        };

        moveTask(updateTasks);
      }
    }

    setActiveId(null);
  };

  const renderLoading = (
    <Stack direction="row" alignItems="flex-start" sx={{ gap: 'var(--column-gap)' }}>
      <KanbanColumnSkeleton />
    </Stack>
  );

  const renderEmpty = <EmptyContent filled sx={{ py: 10, maxHeight: { md: 480 } }} />;

  const modifiedColumns = board.columns.map((column) => {
    let modifiedName = column.name;
    if (modifiedName === 'To do') modifiedName = 'À faire';
    if (modifiedName === 'In progress') modifiedName = 'En cours';
    if (modifiedName === 'Ready to test') modifiedName = 'Résolue';
    if (modifiedName === 'Done') modifiedName = 'Fermé';

    return { ...column, name: modifiedName };
  });

  const renderList = (
    <DndContext
      id="dnd-kanban"
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Stack sx={{ flex: '1 1 auto', overflowX: 'auto' }}>
        <Stack
          sx={{
            pb: 3,
            display: 'unset',
            ...(columnFixed && { minHeight: 0, display: 'flex', flex: '1 1 auto' }),
          }}
        >
          <Stack
            direction="row"
            sx={{
              gap: 'var(--column-gap)',
              ...(columnFixed && {
                minHeight: 0,
                flex: '1 1 auto',
                [`& .${kanbanClasses.columnList}`]: { ...hideScrollY, flex: '1 1 auto' },
              }),
            }}
          >
            <SortableContext
              items={[...columnIds, PLACEHOLDER_ID]}
              strategy={horizontalListSortingStrategy}
            >
              {modifiedColumns.map((column) => (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={filteredBoard.tasks[column.id]}
                >
                  <SortableContext
                    items={filteredBoard.tasks[column.id]}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredBoard.tasks[column.id].map((task) => (
                      <KanbanTaskItem
                        task={task}
                        key={task.id}
                        columnId={column.id}
                        disabled={isSortingContainer}
                      />
                    ))}
                  </SortableContext>
                </KanbanColumn>
              ))}

              <KanbanColumnAdd id={PLACEHOLDER_ID} />
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>

      <KanbanDragOverlay
        columns={filteredBoard?.columns}
        tasks={filteredBoard?.tasks}
        activeId={activeId}
        sx={cssVars}
      />
    </DndContext>
  );

  return (
    <DashboardContent
      maxWidth={false}
      sx={{
        ...cssVars,
        pb: 0,
        pl: { sm: 3 },
        pr: { sm: 0 },
        flex: '1 1 0',
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
      }}
    >
      <KanbanBoardHeader
        onOpenDeletedTickets={handleOpenDeletedTicketsDialog}
        showFilters={showFilters}
        toggleFilters={toggleFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        assignees={getAllAssignees()}
        priorities={getAllPriorities()}
        statuses={getAllStatuses()}
        reporters={getAllReporters()}
        filteredTaskCount={getFilteredTaskCount()}
        totalTaskCount={getTotalTaskCount()}
      />

      {boardLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}

      <DeletedTicketsDialog
        open={deletedTicketsDialogOpen}
        onClose={handleCloseDeletedTicketsDialog}
      />
    </DashboardContent>
  );
}
