import type { Transform } from '@dnd-kit/utilities';
import type { StackProps } from '@mui/material/Stack';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';

import { memo, useEffect, forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faPaperclip,
  faArrowRight,
  faCommentDots,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ListItem from '@mui/material/ListItem';
import { Chip, Tooltip } from '@mui/material';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';

import { varAlpha, stylesMode } from 'src/shared/theme/styles';

import { imageClasses } from 'src/shared/components/image';

import { kanbanClasses } from '../classes';

import type { IKanbanTask } from '../types/kanban';

// ----------------------------------------------------------------------

export const StyledItemWrap = styled(ListItem)(() => ({
  '@keyframes fadeIn': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
  transform:
    'translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))',
  transformOrigin: '0 0',
  touchAction: 'manipulation',
  [`&.${kanbanClasses.state.fadeIn}`]: { animation: 'fadeIn 500ms ease' },
  [`&.${kanbanClasses.state.dragOverlay}`]: { zIndex: 999 },
}));

export const StyledItem = styled(Stack)(({ theme }) => ({
  width: '100%',
  cursor: 'grab',
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  transformOrigin: '50% 50%',
  touchAction: 'manipulation',
  boxShadow: theme.customShadows.z1,
  borderRadius: 'var(--item-radius)',
  WebkitTapHighlightColor: 'transparent',
  backgroundColor: theme.vars.palette.common.white,
  transition: theme.transitions.create(['box-shadow']),
  [stylesMode.dark]: { backgroundColor: theme.vars.palette.grey[900] },
  [`&.${kanbanClasses.state.disabled}`]: {},
  [`&.${kanbanClasses.state.sorting}`]: {},
  [`&.${kanbanClasses.state.dragOverlay}`]: {
    backdropFilter: `blur(6px)`,
    boxShadow: theme.customShadows.z20,
    backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.48),
    [stylesMode.dark]: { backgroundColor: varAlpha(theme.vars.palette.grey['900Channel'], 0.48) },
  },
  [`&.${kanbanClasses.state.dragging}`]: { opacity: 0.2, filter: 'grayscale(1)' },
}));

// ----------------------------------------------------------------------

type ItemBaseProps = StackProps & {
  task: IKanbanTask;
  onUpdateTask: (updatedTask: IKanbanTask) => void;
  stateProps?: {
    fadeIn?: boolean;
    sorting?: boolean;
    disabled?: boolean;
    dragging?: boolean;
    dragOverlay?: boolean;
    transition?: string | null;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
  };
};

const ItemBase = forwardRef<HTMLLIElement, ItemBaseProps>(
  ({ task, onUpdateTask, stateProps, sx, ...other }, ref) => {
    const theme = useTheme();

    useEffect(() => {
      if (!stateProps?.dragOverlay) {
        return;
      }

      document.body.style.cursor = 'grabbing';

      // eslint-disable-next-line consistent-return
      return () => {
        document.body.style.cursor = '';
      };
    }, [stateProps?.dragOverlay]);

    const itemWrapClassName = kanbanClasses.itemWrap.concat(
      (stateProps?.fadeIn && ` ${kanbanClasses.state.fadeIn}`) ||
        (stateProps?.dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
        ''
    );

    const itemClassName = kanbanClasses.item.concat(
      (stateProps?.dragging && ` ${kanbanClasses.state.dragging}`) ||
        (stateProps?.disabled && ` ${kanbanClasses.state.disabled}`) ||
        (stateProps?.sorting && ` ${kanbanClasses.state.sorting}`) ||
        (stateProps?.dragOverlay && ` ${kanbanClasses.state.dragOverlay}`) ||
        ''
    );

    const renderPriority = (
      <FontAwesomeIcon
        icon={
          task.priority === 'low'
            ? faArrowDown
            : task.priority === 'medium'
              ? faArrowRight
              : faArrowUp
        }
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: task.priority === 'low' ? 'blue' : task.priority === 'medium' ? 'orange' : 'red',
        }}
      />
    );

    const renderImg = task?.attachments?.length ? (
      <Box sx={{ p: theme.spacing(1, 1, 0, 1) }}>
        <Box
          component="img"
          className={imageClasses.root}
          alt={task?.attachments?.[0]}
          src={task?.attachments?.[0]}
          sx={{
            width: 320,
            height: 'auto',
            borderRadius: 1.5,
            aspectRatio: '4/3',
            objectFit: 'cover',
          }}
        />
      </Box>
    ) : (
      <></>
    );

    const renderInfo = (
      <Stack direction="row" alignItems="center">
        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          sx={{
            typography: 'caption',
            color: 'text.disabled',
          }}
        >
          <FontAwesomeIcon icon={faCommentDots} style={{ marginRight: 4 }} />

          <Box component="span" sx={{ mr: 1, fontWeight: 500 }}>
            {task?.comments?.length}
          </Box>

          <FontAwesomeIcon icon={faPaperclip} style={{ marginLeft: 8, marginRight: 4 }} />
          <Box component="span" sx={{ fontWeight: 500 }}>
            {task?.attachments?.length}
          </Box>
        </Stack>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          {task.assignee && task.assignee.id ? (
            <Tooltip key={task.assignee.id} title={task.assignee.name} arrow>
              <Chip
                label={task.assignee.name}
                variant="outlined"
                size="small"
                sx={{
                  px: '0.5em',
                  py: '0.25em',
                  borderRadius: 1.5,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.05)',
                  },
                }}
              />
            </Tooltip>
          ) : (
            <Chip
              label="Aucun cessionnaire"
              variant="outlined"
              size="small"
              color="error"
              sx={{
                px: '0.5em',
                py: '0.25em',
                borderRadius: 1.5,
                fontSize: '0.75rem',
                fontWeight: 500,
                transition: 'background-color 0.3s ease, transform 0.3s ease',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'scale(1.05)',
                },
              }}
            />
          )}
        </Box>
      </Stack>
    );

    return (
      <StyledItemWrap
        ref={ref}
        disablePadding
        className={itemWrapClassName}
        sx={{
          ...(!!stateProps?.transition && { transition: stateProps.transition }),
          ...(!!stateProps?.transform && {
            '--translate-x': `${Math.round(stateProps.transform.x)}px`,
            '--translate-y': `${Math.round(stateProps.transform.y)}px`,
            '--scale-x': `${stateProps.transform.scaleX}`,
            '--scale-y': `${stateProps.transform.scaleY}`,
          }),
        }}
      >
        <StyledItem
          className={itemClassName}
          data-cypress="draggable-item"
          sx={sx}
          tabIndex={0}
          {...stateProps?.listeners}
          {...other}
        >
          {renderImg}

          <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
            {renderPriority}

            <Typography variant="subtitle2">{task.name}</Typography>

            {renderInfo}
          </Stack>
        </StyledItem>
      </StyledItemWrap>
    );
  }
);

export default memo(ItemBase);
