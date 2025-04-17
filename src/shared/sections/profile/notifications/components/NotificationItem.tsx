import React, { useState } from 'react';
import {
  Box,
  Menu,
  alpha,
  MenuItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsIcon from '@mui/icons-material/Notifications';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

import { Notification } from '../type';
import { fToNow } from '../data';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onToggleFavorite,
  onArchive,
  onDelete,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getNotificationIcon = () => {
    const iconStyles = {
      fontSize: 20,
      color: 'white',
    };

    const iconBgColor = (): string => {
      switch (notification.type) {
        case 'alert':
          return 'error.main';
        case 'warning':
          return 'warning.main';
        case 'success':
          return 'success.main';
        case 'info':
        default:
          return 'info.main';
      }
    };

    const Icon = (() => {
      switch (notification.type) {
        case 'alert':
          return <ErrorIcon sx={iconStyles} />;
        case 'warning':
          return <WarningIcon sx={iconStyles} />;
        case 'success':
          return <NotificationsIcon sx={iconStyles} />;
        case 'info':
        default:
          return <InfoIcon sx={iconStyles} />;
      }
    })();

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          bgcolor: iconBgColor(),
          width: 36,
          height: 36,
          mr: 2,
          flexShrink: 0,
        }}
      >
        {Icon}
      </Box>
    );
  };

  return (
    <ListItem
      alignItems="flex-start"
      sx={{
        py: 1.5,
        px: 2,
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        ...(notification.isRead ? {} : { bgcolor: alpha('#e3f2fd', 0.5) }),
      }}
    >
      {/* Notification Icon */}
      {getNotificationIcon()}

      {/* Notification Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{
              flex: 1,
              fontWeight: !notification.isRead ? 700 : 500,
            }}
          >
            {notification.title}
          </Typography>

          {notification.isFavorite && (
            <StarIcon fontSize="small" color="warning" sx={{ ml: 1, fontSize: 18 }} />
          )}
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 0.5,
            lineHeight: 1.3,
          }}
        >
          {notification.description}
        </Typography>

        <Typography variant="caption" color="text.disabled">
          {fToNow(notification.createdAt)}
        </Typography>
      </Box>

      {/* Menu Button */}
      <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1, mt: -0.5 }}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem
          onClick={() => {
            onMarkAsRead(notification.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {notification.isRead ? (
              <MarkEmailUnreadIcon fontSize="small" />
            ) : (
              <MarkEmailReadIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {notification.isRead ? 'Marquer comme non lu' : 'Marquer comme lu'}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onToggleFavorite(notification.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {notification.isFavorite ? (
              <StarIcon fontSize="small" color="warning" />
            ) : (
              <StarBorderIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {notification.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          </ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onArchive(notification.id);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {notification.isArchived ? (
              <UnarchiveIcon fontSize="small" />
            ) : (
              <ArchiveIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>{notification.isArchived ? 'Désarchiver' : 'Archiver'}</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            onDelete(notification.id);
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  );
};
