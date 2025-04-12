import type { INotificationType } from 'src/contexts/types/notification';

import React from 'react';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faTimes,
  faUsers,
  faEnvelope,
  faMobileAlt,
  faPaperPlane,
  faInfoCircle,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { NOTIFICATION_TYPE_OPTIONS, NOTIFICATION_CHANNEL_OPTIONS } from 'src/shared/_mock/_notification';

import { varFade } from 'src/shared/components/animate/variants/fade';

// Status colors and labels
const STATUS_COLORS = {
  sent: { bgColor: '#28a745', color: '#FFFFFF', label: 'Envoyée' },
  pending: { bgColor: '#FFB300', color: '#FFFFFF', label: 'En attente' },
  failed: { bgColor: '#dc3545', color: '#FFFFFF', label: 'Échouée' },
};

// Type colors
const TYPE_COLORS = {
  information: { bgColor: '#0288d1', color: '#FFFFFF', icon: faInfoCircle },
  promotional: { bgColor: '#6f42c1', color: '#FFFFFF', icon: faBell },
  reminder: { bgColor: '#fd7e14', color: '#FFFFFF', icon: faCalendarAlt },
  alert: { bgColor: '#dc3545', color: '#FFFFFF', icon: faInfoCircle },
};

// Fonction pour obtenir le libellé du canal
const getChannelLabel = (value: string): string => {
  const channel = NOTIFICATION_CHANNEL_OPTIONS.find((option) => option.value === value);
  return channel ? channel.label : value;
};

// Fonction pour obtenir le libellé du type
const getTypeLabel = (value: string): string => {
  const type = NOTIFICATION_TYPE_OPTIONS.find((option) => option.value === value);
  return type ? type.label : value;
};

interface NotificationDetailsProps {
  open: boolean;
  onClose: () => void;
  notification: INotificationType;
}

export const NotificationDetails = ({ open, onClose, notification }: NotificationDetailsProps) => {
  const theme = useTheme();

  const statusOption = STATUS_COLORS[
    notification.status.toLowerCase() as keyof typeof STATUS_COLORS
  ] || { bgColor: 'rgba(50, 50, 50, 0.6)', color: '#FFFFFF', label: notification.status };

  const typeOption = TYPE_COLORS[
    notification.type.toLowerCase() as keyof typeof TYPE_COLORS
  ] || { bgColor: '#757575', color: '#FFFFFF', icon: faBell };

  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return fDate(new Date(dateString));
    } catch (error) {
      return 'Date invalide';
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return faEnvelope;
      case 'sms':
        return faMobileAlt;
      case 'push':
        return faBell;
      default:
        return faPaperPlane;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          p: 0,
          boxShadow: theme.customShadows?.z16,
          overflowY: 'auto',
        },
      }}
    >
      {/* Header with background and icon */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 5,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha(typeOption.bgColor, 0.9),
              color: typeOption.color,
              boxShadow: theme.customShadows?.z8,
            }}
          >
            <FontAwesomeIcon icon={typeOption.icon} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              Détails de la Notification
            </Typography>

            <Chip
              label={statusOption.label}
              size="small"
              sx={{
                bgcolor: alpha(statusOption.bgColor, 0.8),
                color: statusOption.color,
                fontWeight: 'fontWeightMedium',
                backdropFilter: 'blur(6px)',
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 3 }}>
        {/* Notification Title */}
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Titre
          </Typography>
          <Typography variant="h5" color="primary.main">
            {notification.title}
          </Typography>
        </Paper>

        {/* Notification Content */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Contenu
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Typography variant="body1">{notification.content}</Typography>
          </Paper>
        </Box>

        {/* Recipients Information */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Destinataires
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.customShadows?.z8,
              bgcolor: alpha(theme.palette.background.default, 0.5),
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  color: theme.palette.info.main,
                }}
              >
                <FontAwesomeIcon icon={faUsers} />
              </Avatar>
              <Stack>
                {Array.isArray(notification.recipients) ? (
                  <>
                    <Typography variant="subtitle1">
                      {notification.recipients.length} destinataire(s)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.recipients.map(r => r.name).join(', ')}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle1">{notification.recipients.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {notification.recipients.count} utilisateur(s)
                    </Typography>
                  </>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Box>

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Informations de la Notification
          </Typography>

          <List
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date d&apos;envoi
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(notification.sentDate)}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(typeOption.bgColor, 0.1),
                        color: typeOption.bgColor,
                      }}
                    >
                      <FontAwesomeIcon icon={typeOption.icon} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Type de notification
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {getTypeLabel(notification.type)}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faPaperPlane} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Canaux
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box sx={{ mt: 0.5, ml: 6 }}>
                    <Stack direction="row" spacing={1}>
                      {notification.channel.map((ch) => (
                        <Chip
                          key={ch}
                          icon={<FontAwesomeIcon icon={getChannelIcon(ch)} />}
                          label={getChannelLabel(ch)}
                          size="small"
                          color={
                            ch === 'email' ? 'primary' : 
                            ch === 'sms' ? 'secondary' : 
                            'default'
                          }
                          variant="outlined"
                          sx={{ minWidth: 80 }}
                        />
                      ))}
                    </Stack>
                  </Box>
                }
              />
            </ListItem>

            <ListItem sx={{ py: 1.5 }}>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(statusOption.bgColor, 0.1),
                        color: statusOption.bgColor,
                      }}
                    >
                      <FontAwesomeIcon icon={faBell} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Statut
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box
                    sx={{
                      mt: 0.5,
                      ml: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Chip
                      label={statusOption.label}
                      size="small"
                      sx={{
                        bgcolor: alpha(statusOption.bgColor, 0.1),
                        color: statusOption.bgColor,
                        fontWeight: 'medium',
                      }}
                    />
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default NotificationDetails;