'use client';

import type { INotificationType } from 'src/contexts/types/notification';

import { fr } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { 
  faLink, 
  faBell,
  faInfoCircle, 
  faCheckCircle,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';

import { NOTIFICATION_TYPE_OPTIONS } from 'src/shared/_mock/_notification';

import { FontAwesome } from 'src/shared/components/fontawesome';

// ----------------------------------------------------------------------

type NotificationIconProps = {
  type: string;
  icon?: any;
};

export function NotificationIcon({ type, icon }: NotificationIconProps) {
  if (icon) {
    return <FontAwesome icon={icon} />;
  }
  // Default icon si aucune icone n'est specifier dans le data
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
};

export function NotificationPopupItem({ notification, onMarkAsRead }: NotificationPopupItemProps) {
  const router = useRouter();
  const theme = useTheme();

  const { id, title, sentDate, type, content, viewed, link, icon } = notification;

  // Lien Par Default pour le bouton parametres
  const notificationLink = link || '/dashboard/profile/notifications/';

  const handleClick = () => {
    if (!viewed && onMarkAsRead) {
      onMarkAsRead(id);
    }
    
    if (link) {
      router.push(notificationLink);
    }
  };

  const getTypeLabel = (typeValue: string): string => {
    const typeOption = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === typeValue);
    return typeOption ? typeOption.label : typeValue;
  };
  
  // Format date in French
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
        {/* Left: Icon + Unread indicator */}
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
              flexShrink: 0
            }}
          >
            <NotificationIcon type={type} icon={icon} />
          </Stack>
          
          {!viewed && (
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
          )}
        </Stack>

        {/* Right: Content */}
        <Stack sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography 
              variant="subtitle2" 
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 'calc(100% - 30px)'
              }}
            >
              {title}
            </Typography>
            {link && (
              <Tooltip title="Lien associé">
                <IconButton 
                  size="small" 
                  color="primary" 
                  sx={{ p: 0.5, flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!viewed && onMarkAsRead) {
                      onMarkAsRead(id);
                    }
                    router.push(notificationLink);
                  }}
                >
                  <FontAwesome icon={faLink} fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 0.5,
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2, // choisir nombre de lignes a afficher
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
      </Stack>
    </ListItemButton>
  );
}