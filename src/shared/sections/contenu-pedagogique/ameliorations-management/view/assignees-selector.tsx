import type { IUserContact } from 'src/contexts/types/user';

import React, { useState } from 'react';

import {
  Box,
  Menu,
  List,
  Avatar,
  Dialog,
  Button,
  Tooltip,
  MenuItem,
  ListItem,
  Checkbox,
  Typography,
  AvatarGroup,
  DialogTitle,
  ListItemText,
  DialogContent,
  DialogActions,
  ListItemAvatar,
} from '@mui/material';

import { _contacts } from 'src/shared/_mock';

type AssigneeSelectorProps = {
  filters: {
    state: { assignee: IUserContact[] };
    setState: (newFilters: any) => void;
  };
  ameliorations: any[];
  setFilteredAmeliorations: (filtered: any[]) => void;
  maxVisible?: number;
};

export function AssigneeSelector({
  filters,
  ameliorations,
  setFilteredAmeliorations,
  maxVisible = 5,
}: AssigneeSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);

  let assignedUsers: IUserContact[] = filters.state.assignee || [];
  if (assignedUsers.length === 0) {
    assignedUsers = _contacts.slice(0, maxVisible);
  }

  const visibleUsers = assignedUsers.slice(0, maxVisible);
  const extraUsers = assignedUsers.slice(maxVisible);

  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggleUser = (user: IUserContact) => {
    let newAssignees = [...assignedUsers];

    if (newAssignees.some((u) => u.id === user.id)) {
      newAssignees = newAssignees.filter((u) => u.id !== user.id);
    } else {
      newAssignees.push(user);
    }

    filters.setState({ ...filters.state, assignee: newAssignees });

    if (newAssignees.length === 0) {
      setFilteredAmeliorations(ameliorations);
    } else {
      setFilteredAmeliorations(
        ameliorations.filter((amelioration) =>
          amelioration.assignees.some((a: IUserContact) =>
            newAssignees.some((u) => u.id === a.id)
          )
        )
      );
    }
  };

  return (
    <Box display="flex" alignItems="center">
        <AvatarGroup>
          {visibleUsers.map((user) => (
            <Tooltip key={user.id} title={user.name || user.email}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  border: assignedUsers.some((u) => u.id === user.id)
                    ? '2px solid #1976d2'
                    : 'none',
                }}
                src={user.avatarUrl}
                onClick={() => handleToggleUser(user)}
              >
                {!user.avatarUrl ? user.name?.[0] || '?' : null}
              </Avatar>
            </Tooltip>
          ))}

          {extraUsers.length > 0 && (
            <Tooltip title={`+${extraUsers.length} more`}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  cursor: 'pointer',
                  bgcolor: 'grey.400',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px solid #1976d2',
                }}
                onClick={handleOpenMenu}
              >
                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                  +{extraUsers.length}
                </Typography>
              </Avatar>
            </Tooltip>
          )}
        </AvatarGroup>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {extraUsers.map((user) => (
            <MenuItem key={user.id} onClick={() => handleToggleUser(user)}>
              <Avatar sx={{ width: 24, height: 24, mr: 1 }} src={user.avatarUrl}>
                {!user.avatarUrl ? user.name?.[0] || '?' : null}
              </Avatar>
              <Typography variant="body2">{user.name}</Typography>
            </MenuItem>
          ))}
        </Menu>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Sélectionner des assignés</DialogTitle>
          <DialogContent>
            <List>
              {_contacts.map((user) => (
                <ListItem key={user.id} button onClick={() => handleToggleUser(user)}>
                  <ListItemAvatar>
                    <Avatar src={user.avatarUrl}>
                      {!user.avatarUrl ? user.name?.[0] || '?' : null}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.name} secondary={user.email} />
                  <Checkbox checked={assignedUsers.some((u) => u.id === user.id)} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Fermer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
}
