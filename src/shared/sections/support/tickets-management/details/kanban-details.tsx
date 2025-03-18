import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faUserPlus, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Dialog,
  Popper,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useTabs } from 'src/hooks/use-tabs';
import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/shared/theme/styles';
import { LocalizationProvider } from 'src/shared/locales';

import { Field } from 'src/shared/components/hook-form';
import { Scrollbar } from 'src/shared/components/scrollbar';
import { CustomTabs } from 'src/shared/components/custom-tabs';

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
  const tabs = useTabs('aperçu');

  const [priority, setPriority] = useState(task.priority);

  const [taskName, setTaskName] = useState(task.name);

  const [open, setOpen] = useState(false);

  const [newLabel, setNewLabel] = useState('');

  const initialDate =
    task.due && Array.isArray(task.due) ? dayjs(task.due[0]) : task.due ? dayjs(task.due) : null;

  const [date, setDate] = useState<Dayjs | null>(initialDate);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const like = useBoolean();

  const contacts = useBoolean();

  const [taskDescription, setTaskDescription] = useState(task.description);

  console.log(task.due);

  const handleChangeTaskName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(event.target.value);
  }, []);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewLabel('');
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      onUpdateTask({ ...task, labels: [...task.labels, newLabel.trim()] });
      handleCloseDialog();
    }
  };

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

  // Open the DatePicker
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  // Handle date selection
  const handleDateChange = (newDate: Dayjs | null) => {
    setDate(newDate);

    // Only update the task when the date is complete and valid
    // or explicitly cleared (null)
    if (
      newDate === null ||
      (newDate && newDate.isValid() && newDate.format('DD/MM/YYYY').length === 10)
    ) {
      onUpdateTask({ ...task, due: newDate ? newDate.toDate().toISOString() : null });
    }

    setAnchorEl(null);
  };

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
        { value: 'aperçu', label: 'Aperçu' },
        { value: 'commentaires', label: `Commentaires (${task.comments.length})` },
      ].map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </CustomTabs>
  );

  const renderTabOverview = (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {/* Nom de la tâche */}
      <KanbanInputName
        placeholder="Nom de la tâche"
        value={taskName}
        onChange={handleChangeTaskName}
        onKeyUp={handleUpdateTask}
        inputProps={{ id: `input-task-${taskName}` }}
      />

      {/* Rapporteur */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Rapporteur</StyledLabel>
        <Chip
          label={task.reporter.name}
          variant="outlined"
          size="small"
          sx={{
            px: '0.5em',
            py: '0.25em',
            borderRadius: 1.5,
            borderColor: 'primary.dark',
            color: 'primary.dark',
            fontSize: '0.8rem',
            fontWeight: 500,
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'scale(1.05)',
            },
          }}
        />
      </Box>

      {/* Personne assignée */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel>Personne assignée</StyledLabel>

        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {task.assignee && task.assignee.name ? (
            <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
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
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    transform: 'scale(1.05)',
                  },
                }}
              />
              <Tooltip title="Supprimer le cessionnaire">
                <IconButton
                  onClick={() => onUpdateTask({ ...task, assignee: null })}
                  size="small"
                  sx={{
                    ml: '1px',
                    mb: '10px',
                    px: '4px',
                    py: '3px',
                    borderRadius: '50%',
                    bgcolor: (theme) => theme.palette.grey[200],
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.primary.main,
                      color: 'white',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} style={{ fontSize: '10px' }} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : (
            <Tooltip title="Ajouter le cessionnaire">
              <IconButton
                onClick={contacts.onTrue}
                sx={{
                  bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                  border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  padding: '4px',
                  fontSize: '18px',
                }}
              >
                <FontAwesomeIcon icon={faUserPlus} />
              </IconButton>
            </Tooltip>
          )}

          <KanbanContactsDialog
            assignee={task.assignee}
            open={contacts.value}
            onClose={contacts.onFalse}
            onSelectAssignee={(user) => {
              onUpdateTask({ ...task, assignee: user });
              contacts.onFalse();
            }}
          />
        </Box>
      </Box>

      {/* Catégorie */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel sx={{ height: 24, lineHeight: '24px' }}>Catégorie</StyledLabel>

        <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {task.labels.length > 0 ? (
            task.labels.map((label) => (
              <Chip key={label} color="info" label={label} size="small" variant="soft" />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Aucune catégorie
            </Typography>
          )}
          <Tooltip title="Ajouter une catégorie">
            <IconButton
              size="small"
              onClick={handleOpenDialog}
              sx={{
                ml: '-2px',
                px: '3px',
                py: '2px',
                borderRadius: '50%',
                bgcolor: (theme) => theme.palette.grey[200],
                '&:hover': {
                  bgcolor: (theme) => theme.palette.primary.main,
                  color: 'white',
                },
                transition: 'all 0.3s ease',
              }}
            >
              <FontAwesomeIcon icon={faPlus} style={{ fontSize: '14px' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la catégorie"
            type="text"
            fullWidth
            variant="outlined"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="error">
            Annuler
          </Button>
          <Button onClick={handleAddLabel} color="primary" variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Date de création */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <StyledLabel>Date de création</StyledLabel>

        {date ? (
          <Chip
            label={date.format('DD/MM/YYYY')}
            variant="outlined"
            size="small"
            sx={{
              ml: '2px',
              borderRadius: 1.5,
              borderColor: 'primary.main',
              color: 'primary.main',
              fontSize: '0.8rem',
              fontWeight: 300,
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': {
                backgroundColor: 'action.hover',
                transform: 'scale(1.05)',
              },
            }}
          />
        ) : (
          <LocalizationProvider>
            <DatePicker
              value={date}
              onChange={handleDateChange}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'small',
                  fullWidth: false,
                  placeholder: 'Date de création',
                  variant: 'outlined',
                  inputProps: {
                    readOnly: true,
                    style: {
                      fontSize: '0.75rem',
                      padding: '6px 8px',
                    },
                  },
                  sx: {
                    width: 140,
                    '& .MuiOutlinedInput-root': {
                      height: 32,
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.75rem',
                      transform: 'translate(14px, 8px) scale(1)',
                    },
                    '& .MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)',
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>
        )}
      </Box>

      {/* Priorité */}
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

      {/* Pièces jointes */}
      <Box sx={{ display: 'flex' }}>
        <StyledLabel>Pièces jointes</StyledLabel>
        <KanbanDetailsAttachments attachments={task.attachments ?? []} />
      </Box>
    </Box>
  );

  const renderTabComments = (
    <>{task.comments.length ? <KanbanDetailsCommentList comments={task.comments} /> : <></>}</>
  );

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: { xs: 1, sm: 380 } } }}
    >
      {renderToolbar}

      {renderTabs}

      <Scrollbar fillContent sx={{ py: 3, px: 2.5 }}>
        {tabs.value === 'aperçu' ? renderTabOverview : <></>}
        {tabs.value === 'commentaires' ? renderTabComments : <></>}
      </Scrollbar>

      {tabs.value === 'commentaires' ? <KanbanDetailsCommentInput /> : <></>}
    </Drawer>
  );
}
