'use client';

import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
  CollisionDetection,
} from '@dnd-kit/core';

import { useRef, useState, useEffect, useCallback } from 'react';
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
import Typography from '@mui/material/Typography';

import { useDebounce } from 'src/hooks/use-debounce';

import { useSetState } from 'src/hooks';
import { hideScrollY } from 'src/shared/theme/styles';
import { DashboardContent } from 'src/shared/layouts/dashboard';

import { EmptyContent } from 'src/shared/components/empty-content';

import { moveTask, moveColumn, useGetBoard } from 'src/shared/sections/moderation/actions/kanban';

import { kanbanClasses } from '../classes';
import { coordinateGetter } from '../utils';
import { KanbanColumn } from '../column/kanban-column';
import { ModerationFilters } from './moderation-filter';
import { KanbanTaskItem } from '../item/kanban-task-item';
import { KanbanColumnSkeleton } from '../components/kanban-skeleton';
import { KanbanDragOverlay } from '../components/kanban-drag-overlay';

import type { IKanbanTask } from '../types/kanban';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder';

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '18px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

export function KanbanView() {
  const { board, boardLoading, boardEmpty } = useGetBoard();

  const [columnFixed] = useState(true);

  const recentlyMovedToNewContainer = useRef(false);

  const lastOverId = useRef<UniqueIdentifier | null>(null);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const columnIds = board.columns.map((column) => column.id);

  const isSortingContainer = activeId ? columnIds.includes(activeId) : false;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);
  const filters = useSetState<{
    columns: string[];
    priority: string;
    category: string;
  }>({
    columns: [],
    priority: '',
    category: '',
  });

  // Search function implementation
  const searchModerationTasks = useCallback(() => {
    if (!debouncedQuery) return [];

    const queryLower = debouncedQuery.toLowerCase();

    // Use flatMap to get all tasks from all columns
    return board.columns
      .flatMap(column => board.tasks[column.id] || [])
      .filter(task => {
        const matchName = task.name.toLowerCase().includes(queryLower);
        const matchDescription = task.description &&
          task.description.toLowerCase().includes(queryLower);
        return matchName || matchDescription;
      });
  }, [board.columns, board.tasks, debouncedQuery]);

  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<IKanbanTask[]>([]);

  // Effect to update search results when query changes
  useEffect(() => {
    const performSearch = async () => {
      setSearchLoading(true);
      try {
        // Simulate a slight delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 300));
        const results = searchModerationTasks();
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    };

    if (debouncedQuery) {
      performSearch();
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery, searchModerationTasks]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

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

  // Render filters
  const renderFilters = (
    <ModerationFilters
      filters={filters}
      searchQuery={debouncedQuery}
      setSearchQuery={setSearchQuery}
      searchResults={searchResults}
      searchLoading={searchLoading}
    />
  );

  const modifiedColumns = board.columns.map((column) => {
    let modifiedName = column.name;
    if (modifiedName === 'To do') modifiedName = 'Nouveau';
    if (modifiedName === 'In progress') modifiedName = 'En cours';
    if (modifiedName === 'Ready to test') modifiedName = 'Resolu';
    if (modifiedName === 'Done') modifiedName = 'Rejeter';
    return { ...column, name: modifiedName };
  });

  // Apply column filter
  const filteredColumns = filters.state.columns?.length
    ? modifiedColumns.filter(column => filters.state.columns.includes(column.name))
    : modifiedColumns;

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
              {filteredColumns.map((column) => {
                // Apply task filters and search
                const filteredTasks = board.tasks[column.id].filter(task => {
                  const priorityMatch = !filters.state.priority || task.priority === filters.state.priority;
                  const categoryMatch = !filters.state.category ||
                    (task.labels && task.labels.includes(filters.state.category));

                  // Apply search filter if there's a search query
                  const searchMatch = !debouncedQuery ||
                    task.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(debouncedQuery.toLowerCase()));

                  return priorityMatch && categoryMatch && searchMatch;
                });

                return (
                  <KanbanColumn key={column.id} column={column} tasks={filteredTasks}>
                    <SortableContext
                      items={filteredTasks.map((task) => task.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {filteredTasks.map((task) => (
                        <KanbanTaskItem
                          task={task}
                          key={task.id}
                          columnId={column.id}
                          disabled={isSortingContainer}
                        />
                      ))}
                    </SortableContext>
                  </KanbanColumn>
                );
              })}
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>

      <KanbanDragOverlay
        columns={modifiedColumns}
        tasks={board?.tasks}
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
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pr: { sm: 3 }, mb: { xs: 3, md: 5 } }}
      >
        <Typography variant="h4">Moderation et Signalement</Typography>


      </Stack>

      {/* Added filters */}
      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}
      </Stack>

      {boardLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}
    </DashboardContent>
  );
}