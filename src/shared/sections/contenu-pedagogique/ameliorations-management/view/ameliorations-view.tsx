'use client';

import type { IAmeliorationFilters } from 'src/contexts/types/kanban';
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

import {  useSetState } from 'src/hooks';
import { hideScrollY } from 'src/shared/theme/styles';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { moveTask, useGetBoard } from 'src/shared/actions/kanban';
import { MOCK_AMELIORATIONS } from 'src/shared/_mock/_ameliorations';
import { useSearchAmeliorations } from 'src/shared/actions/amelioration';

import { EmptyContent } from 'src/shared/components/empty-content';

import { kanbanClasses } from '../classes';
import { coordinateGetter } from '../utils';
import { KanbanColumn } from '../column/kanban-column';
import { KanbanTaskItem } from '../item/kanban-task-item';
import { AmeliorationFilters } from './ameliorations-filter';
import { KanbanColumnAdd } from '../column/kanban-column-add';
import { AddAmeliorationModal } from './ameliorations-add-view';
import { KanbanColumnSkeleton } from '../components/kanban-skeleton';

// ----------------------------------------------------------------------

const PLACEHOLDER_ID = 'placeholder';

const cssVars = {
  '--item-gap': '16px',
  '--item-radius': '12px',
  '--column-gap': '18px',
  '--column-radius': '16px',
  '--column-padding': '20px 16px 16px 16px',
};

export function AmeliorationsView() {
  const { board, boardLoading, boardEmpty } = useGetBoard();
  const [columnFixed] = useState(true);
  const recentlyMovedToNewContainer = useRef(false);
  const lastOverId = useRef<UniqueIdentifier | null>(null);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const columnIds = board.columns.map((column) => column.id);
  const handleCloseModal = () => setOpenModal(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery);
  const [openModal, setOpenModal] = useState(false);
  const filters = useSetState<IAmeliorationFilters>({
    assignee: [],
    type: '',
    exercice: '',
    niveau: '',
    matiere: '',
    source: '',
    aiAssistant: ''
  });
  const { searchResults, searchLoading } = useSearchAmeliorations(debouncedQuery);
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
      const pointerIntersections = pointerWithin(args);

      const intersections =
        pointerIntersections.length > 0
          ?
          pointerIntersections
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId != null) {
        if (overId in board.tasks) {
          const columnItems = board.tasks[overId].map((task) => task.id);

          if (columnItems.length > 0) {
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

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = activeId;
      }

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

  const niveaux = ['CP', 'CM1', 'CM2', 'CE1', 'CE2'] as const;
  type NiveauType = (typeof niveaux)[number];

  const handleAddAmelioration = (data: {
    titre: string;
    description: string;
    niveau: NiveauType;
    matiere: string;
    exercice: string[];
    attachments: FileList | [];
    assignee: string[];
  }) => {
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false;
    });
  }, []);

  const onDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id);
  };

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

  const onDragEnd = ({ active, over }: DragEndEvent) => {
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

  const renderFilters = (
    <AmeliorationFilters
      filters={filters}
      searchQuery={debouncedQuery}
      setSearchQuery={setSearchQuery}
      searchResults={searchResults}
      searchLoading={searchLoading}
      setOpenModal={setOpenModal}/>
  );

  const modifiedColumns = board.columns.map((column) => {
    let modifiedName = column.name;
    if (modifiedName === 'To do') modifiedName = 'Nouveau';
    if (modifiedName === 'In progress') modifiedName = 'En cours';
    if (modifiedName === 'Ready to test') modifiedName = 'Résolue';
    if (modifiedName === 'Done') modifiedName = 'Rejetée';

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
              {modifiedColumns.map((column) => {
                const tasksInColumn = MOCK_AMELIORATIONS.filter(
                  (task) => task.status === column.name
                );

                return (
                  <KanbanColumn key={column.id} column={column} tasks={tasksInColumn}>
                    <SortableContext items={tasksInColumn.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                      {tasksInColumn.map((task) => (
                        <KanbanTaskItem key={task.id} task={task} columnId={column.id} />
                      ))}
                    </SortableContext>

                  </KanbanColumn>
                );
              })}
              <KanbanColumnAdd id={PLACEHOLDER_ID} />
            </SortableContext>
          </Stack>
        </Stack>
      </Stack>
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
        <Typography variant="h4">Améliorations</Typography>
      </Stack>

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}
      </Stack>

      {boardLoading ? renderLoading : <>{boardEmpty ? renderEmpty : renderList}</>}
      <AddAmeliorationModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleAddAmelioration}
      />    </DashboardContent>
  );

}



