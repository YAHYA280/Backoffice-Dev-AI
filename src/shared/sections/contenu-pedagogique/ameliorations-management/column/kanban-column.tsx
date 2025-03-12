import type { Theme, SxProps } from '@mui/material/styles';
import type { AnimateLayoutChanges } from '@dnd-kit/sortable';
import type { IKanbanTask, IKanbanColumn } from 'src/contexts/types/kanban';

import { useCallback } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';

import { useBoolean } from 'src/hooks/use-boolean';

import { createTask } from 'src/shared/actions/kanban';

import ColumnBase from './column-base';
import { KanbanTaskAdd } from '../components/kanban-task-add';

// ----------------------------------------------------------------------

type ColumnProps = {
  disabled?: boolean;
  sx?: SxProps<Theme>;
  tasks: IKanbanTask[];
  column: IKanbanColumn;
  children: React.ReactNode;
};

export function KanbanColumn({ children, column, tasks, disabled, sx }: ColumnProps) {
  const openAddTask = useBoolean();

  const { attributes, isDragging, listeners, setNodeRef, transition, active, over, transform } =
    useSortable({
      id: column.id,
      data: { type: 'container', children: tasks },
      animateLayoutChanges,
    });

  const tasksIds = tasks.map((task) => task.id);

  const isOverContainer = over
    ? (column.id === over.id && active?.data.current?.type !== 'container') ||
      tasksIds.includes(over.id)
    : false;

  const handleAddTask = useCallback(
    async (taskData: IKanbanTask) => {
      try {
        createTask(column.id, taskData);

        openAddTask.onFalse();
      } catch (error) {
        console.error(error);
      }
    },
    [column.id, openAddTask]
  );

  return (
    <ColumnBase
      ref={disabled ? undefined : setNodeRef}
      sx={{ transition, transform: CSS.Translate.toString(transform), ...sx }}
      stateProps={{
        dragging: isDragging,
        hover: isOverContainer,
        handleProps: { ...attributes, ...listeners },
      }}
      slots={{
        main: <>{children}</>,
        action: (
          <KanbanTaskAdd
            status={column.name}
            openAddTask={openAddTask.value}
            onAddTask={handleAddTask}
            onCloseAddTask={openAddTask.onFalse}
          />
        ),
      }}
    />
  );
}

// ----------------------------------------------------------------------

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });
