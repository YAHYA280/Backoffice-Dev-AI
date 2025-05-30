'use client';

import type { INotificationType } from 'src/contexts/types/notification';

import React from 'react';
import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  faLink,
  faBell,
  faInfoCircle,
  faCheckCircle,
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

import { useTheme } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import {
  Box,
  Menu,
  Stack,
  Tooltip,
  MenuItem,
  IconButton,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';

import { NOTIFICATION_TYPE_OPTIONS } from 'src/shared/_mock/_notification';

import { FontAwesome } from 'src/shared/components/fontawesome';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// ----------------------------------------------------------------------

type NotificationIconProps = {
  type: string;
  icon?: any;
};

export function NotificationIcon({ type, icon }: NotificationIconProps) {
  if (icon) {
    return <FontAwesome icon={icon} />;
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'information':
        return faInfoCircle;
      case 'promotional':
        return faBell;
      case 'reminder':
        return faCheckCircle;
      case 'alert':
        return faExclamationTriangle;
      default:
        return faBell;
    }
  };

  return <FontAwesome icon={getDefaultIcon()} />;
}

// ----------------------------------------------------------------------

export type NotificationPopupItemProps = {
  notification: INotificationType;
  onMarkAsRead?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export function NotificationPopupItem({
  notification,
  onMarkAsRead,
  onToggleFavorite,
  onArchive,
  onDelete,
}: NotificationPopupItemProps) {
  const router = useRouter();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { id, title, sentDate, type, content, viewed, link, icon, favorite, archived } = notification;
  const notificationLink = link || '/dashboard/profile/notifications/';

  const handleClick = () => {
    if (!viewed && onMarkAsRead) onMarkAsRead(id);
    if (link) router.push(notificationLink);
  };

  const getTypeLabel = (typeValue: string): string => {
    const typeOption = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === typeValue);
    return typeOption ? typeOption.label : typeValue;
  };

  const formattedDate = formatDistanceToNow(new Date(sentDate), {
    addSuffix: true,
    locale: fr,
  });

  return (
    <ListItemButton
      onClick={handleClick}
      sx={{
        py: 1.5,
        px: 2.5,
        height: 'auto',
        borderBottom: `1px dashed ${theme.palette.divider}`,
        transition: theme.transitions.create('background-color'),
        cursor: link ? 'pointer' : 'default',
        '&:hover': {
          backgroundColor: link ? theme.palette.action.hover : 'inherit',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ width: '100%' }}>
        {/* Left icon + indicator */}
        <Stack direction="row" alignItems="center" position="relative">
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: `${theme.palette.primary.lighter}`,
              color: `${theme.palette.primary.main}`,
              flexShrink: 0,
            }}
          >
            <NotificationIcon type={type} icon={icon} />
          </Stack>
          <ConditionalComponent isValid={!viewed}>
          <Box
              sx={{
                top: 0,
                right: 0,
                width: 8,
                height: 8,
                borderRadius: '50%',
                position: 'absolute',
                bgcolor: 'info.main',
              }}
            />
          </ConditionalComponent>
        </Stack>

        {/* Right content */}
        <Stack sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              variant="subtitle2"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 30px)',
              }}
            >
              {title}
            </Typography>
            <ConditionalComponent isValid={Boolean(link)}>
            <Tooltip title="Lien associé">
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ p: 0.5, flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!viewed && onMarkAsRead) onMarkAsRead(id);
                    router.push(notificationLink);
                  }}
                >
                  <FontAwesome icon={faLink} fontSize="small" />
                </IconButton>
              </Tooltip>
            </ConditionalComponent>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              textOverflow: 'ellipsis',
              wordBreak: 'break-word',
              lineHeight: '1.5em',
              maxHeight: '3em',
            }}
          >
            {content}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ mt: 1, typography: 'caption', color: 'text.disabled' }}
            divider={
              <Box
                sx={{
                  width: 2,
                  height: 2,
                  borderRadius: '50%',
                  bgcolor: 'currentColor',
                  mx: 0.5,
                }}
              />
            }
          >
            <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
              {formattedDate}
            </Typography>
            <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
              {getTypeLabel(type)}
            </Typography>
          </Stack>
        </Stack>

        {/* Action Menu */}
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(e.currentTarget);
          }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead?.(id);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              {viewed ? (
                <MarkEmailUnreadIcon fontSize="small" />
              ) : (
                <MarkEmailReadIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {viewed ? 'Marquer comme non lu' : 'Marquer comme lu'}
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite?.(id);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              {favorite ? (
                <StarIcon fontSize="small" color="warning" />
              ) : (
                <StarBorderIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>
              {favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            </ListItemText>
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onArchive?.(id);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              {archived ? (
                <UnarchiveIcon fontSize="small" />
              ) : (
                <ArchiveIcon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText>{archived ? 'Désarchiver' : 'Archiver'}</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(id);
              setAnchorEl(null);
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Supprimer</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </ListItemButton>
  );
}