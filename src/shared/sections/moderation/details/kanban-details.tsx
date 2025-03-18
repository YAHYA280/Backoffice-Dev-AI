
import dayjs from 'dayjs';
import { useState, useCallback } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/shared/theme/styles';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { CustomTabs } from 'src/shared/components/custom-tabs';
import { useDateRangePicker, CustomDateRangePicker } from 'src/shared/components/custom-date-range-picker';

import { KanbanDetailsToolbar } from './kanban-details-toolbar';
import { KanbanInputName } from '../components/kanban-input-name';
import { KanbanDetailsPriority } from './kanban-details-priority';
import { KanbanDetailsAttachments } from './kanban-details-attachments';
import { KanbanDetailsCommentList } from './kanban-details-comment-list';
import { KanbanDetailsCommentInput } from './kanban-details-comment-input';
import { KanbanContactsDialog } from '../components/kanban-contacts-dialog';

import type { IKanbanTask } from '../types/kanban';

// ----------------------------------------------------------------------


const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.vars.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

type Props = {
  task: IKanbanTask;
  openDetails: boolean;
  onDeleteTask: () => void;
  onCloseDetails: () => void;
  onUpdateTask: (updateTask: IKanbanTask) => void;
};

export function KanbanDetails({
  task,
  openDetails,
  onUpdateTask,
  onDeleteTask,
  onCloseDetails,
}: Props) {
  const tabs = useTabs('overview');

  const [priority, setPriority] = useState(task.priority);

  const [taskName, setTaskName] = useState(task.name);

  // const [subtaskCompleted, setSubtaskCompleted] = useState(SUBTASKS.slice(0, 2));

  const like = useBoolean();

  const contacts = useBoolean();

  const [taskDescription, setTaskDescription] = useState(task.description);

  const rangePicker = useDateRangePicker(dayjs(task.due[0]), dayjs(task.due[1]));

  const handleChangeTaskName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  }, []);

  const handleUpdateTask = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {
          if (taskName) {
            onUpdateTask({ ...task, name: taskName });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateTask, task, taskName]
  );

  const handleChangeTaskDescription = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskDescription(event.target.value);
  }, []);

  const handleChangePriority = useCallback((newValue: string) => {
    setPriority(newValue);
  }, []);


  const renderToolbar = (
    <KanbanDetailsToolbar
      liked={like.value}
      taskName={task.name}
      onLike={like.onToggle}
      onDelete={onDeleteTask}
      taskStatus={task.status}
      onCloseDetails={onCloseDetails}
    />
  );

  const renderTabs = (
    <CustomTabs
      value={tabs.value}
      onChange={tabs.onChange}
      variant="fullWidth"
      slotProps={{ tab: { px: 0 } }}
    >
      {[
        { value: 'overview', label: 'Aperçu' },
        // { value: 'subTasks', label: 'Subtasks' },
        { value: 'comments', label: `Commentaires (${task.comments.length})` },
      ].map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  const renderTabOverview = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Task name */}
      <KanbanInputName
        placeholder="Nom de la tâche"
        value={taskName}
        onChange={handleChangeTaskName}
        onKeyUp={handleUpdateTask}
        inputProps={{ id: `input-task-${taskName}` }}
      />

      {/* Reporter */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Rapporteur</StyledLabel>
        <Avatar alt={task.reporter.name} src={task.reporter.avatarUrl} />
      </Box>

      {/* Assignee */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Assigné</StyledLabel>

        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
          {task.assignee.map((user) => (
            <Avatar key={user.id} alt={user.name} src={user.avatarUrl} />
          ))}

          <Tooltip title="Ajouter un assigné">
            <IconButton
              onClick={contacts.onTrue}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
          </Tooltip>

          <KanbanContactsDialog
            assignee={task.assignee}
            open={contacts.value}
            onClose={contacts.onFalse}
          />
        </Box>
      </Box>


      {/* Category - Modified for Moderation with Dropdown */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Catégorie</StyledLabel>
        <FormControl fullWidth size="small">
          <Select
            value={task.labels.length ? task.labels[0] : 'spam'}
            onChange={(e) => {
              onUpdateTask({ ...task, labels: [e.target.value] });
            }}
            displayEmpty
          >
            <MenuItem value="contenu inapproprié">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip size="small" label="Contenu inapproprié" color="error" variant="soft" />
              </Stack>
            </MenuItem>
            <MenuItem value="hors-sujet">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip size="small" label="Hors-sujet" color="warning" variant="soft" />
              </Stack>
            </MenuItem>
            <MenuItem value="spam">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip size="small" label="Spam" color="info" variant="soft" />
              </Stack>
            </MenuItem>
          </Select>
        </FormControl>
      </Box>





      {/* Due date */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel> Date déchéance </StyledLabel>

        {rangePicker.selected ? (
          <Button size="small" onClick={rangePicker.onOpen}>
            {rangePicker.shortLabel}
          </Button>
        ) : (
          <Tooltip title="Ajouter une date d'échéance">
            <IconButton
              onClick={rangePicker.onOpen}
              sx={{
                bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
          </Tooltip>
        )}

        <CustomDateRangePicker
          variant="calendar"
          title="Choisir une date d'échéance"
          startDate={rangePicker.startDate}
          endDate={rangePicker.endDate}
          onChangeStartDate={rangePicker.onChangeStartDate}
          onChangeEndDate={rangePicker.onChangeEndDate}
          open={rangePicker.open}
          onClose={rangePicker.onClose}
          selected={rangePicker.selected}
          error={rangePicker.error}
        />
      </Box>

      {/* Priority */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Priorité</StyledLabel>
        <KanbanDetailsPriority priority={priority} onChangePriority={handleChangePriority} />
      </Box>

      {/* Description */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel> Description </StyledLabel>
        <TextField
          fullWidth
          multiline
          size="small"
          minRows={4}
          value={taskDescription}
          onChange={handleChangeTaskDescription}
          InputProps={{ sx: { typography: 'body2' } }}
        />
      </Box>

      {/* Attachments */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel>Pièces jointes</StyledLabel>
        <KanbanDetailsAttachments attachments={task.attachments} />
      </Box>
    </Box>
  );



  const renderTabComments = (
    <>{!!task.comments.length && <KanbanDetailsCommentList comments={task.comments} />}</>
  );

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}
    >
      {renderToolbar}

      {renderTabs}

      <Scrollbar fillContent sx={{ py: 3, px: 2.5 }}>
        {tabs.value === 'overview' ? renderTabOverview : <></>}
        {tabs.value === 'comments' ? renderTabComments : <></>}
      </Scrollbar>

      {tabs.value === 'comments' ? <KanbanDetailsCommentInput /> : <></>}
    </Drawer>
  );
}
