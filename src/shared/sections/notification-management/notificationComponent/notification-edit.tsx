'use client';

import type { INotificationType } from 'src/contexts/types/notification';

import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faSave,
  faTimes,
  faInfoCircle,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  Box,
  Chip,
  Stack,
  alpha,
  Paper,
  Radio,
  Drawer,
  Avatar,
  Button,
  Select,
  Slider,
  useTheme,
  Checkbox,
  MenuItem,
  TextField,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import {
  NOTIFICATION_TYPE_OPTIONS,
  NOTIFICATION_CHANNEL_OPTIONS,
} from 'src/shared/_mock/_notification';

import { varFade } from 'src/shared/components/animate/variants/fade';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

// Define types for props
interface EditNotificationProps {
  open: boolean;
  onClose: () => void;
  notification: INotificationType | null;
  onUpdate: (updatedNotification: INotificationType) => void;
}

// Define form data type
interface FormDataType {
  title: string;
  type: string;
  content: string;
  recipients: string;
  channel: string[];
  status: string;
  sentDate: string | null;
  link?: string;
  scheduledDate: Date | null;
  scheduledTime: Date | null;
  frequency: string;
  retrySettings: {
    retryCount: number;
    alertRecipients: {
      administrators: boolean;
      supportTeam: boolean;
      affectedUser: boolean;
    };
  };
  attachments?: File[];
}

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

export const EditNotification = ({
  open,
  onClose,
  notification,
  onUpdate,
}: EditNotificationProps) => {
  const theme = useTheme();
  const router = useRouter();

  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState<FormDataType>({
    title: '',
    type: '',
    content: '',
    recipients: '',
    channel: [],
    status: '',
    sentDate: null,
    link: '',
    scheduledDate: null,
    scheduledTime: null,
    frequency: 'immediate',
    retrySettings: {
      retryCount: 3,
      alertRecipients: {
        administrators: true,
        supportTeam: false,
        affectedUser: false,
      },
    },
    attachments: [],
  });

  // Initialiser le formulaire avec les données de la notification
  useEffect(() => {
    if (notification) {
      const channels = Array.isArray(notification.channel) ? notification.channel : [];
      const recipientName =
        typeof notification.recipients === 'string'
          ? notification.recipients
          : Array.isArray(notification.recipients)
            ? 'multiple_recipients' // Si c'est un tableau
            : notification.recipients?.name || '';

      setFormData({
        title: notification.title || '',
        type: notification.type || '',
        content: notification.content || '',
        recipients: recipientName,
        channel: channels,
        status: notification.status || 'pending',
        sentDate: notification.sentDate || null,
        link: notification.link || '',
        scheduledDate: notification.scheduledDate || null,
        scheduledTime: notification.scheduledTime || null,
        frequency: notification.frequency || 'immediate',
        retrySettings: notification.retrySettings || {
          retryCount: 3,
          alertRecipients: {
            administrators: true,
            supportTeam: false,
            affectedUser: false,
          },
        },
        attachments: notification.attachments || [],
      });
    }
  }, [notification]);

  const handleChange = <K extends keyof FormDataType>(field: K, value: FormDataType[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRetrySettingsChange = (field: keyof FormDataType['retrySettings'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      retrySettings: {
        ...prev.retrySettings,
        [field]: value,
      },
    }));
  };

  const handleAlertRecipientsChange = (
    recipient: keyof FormDataType['retrySettings']['alertRecipients']
  ) => {
    setFormData((prev) => ({
      ...prev,
      retrySettings: {
        ...prev.retrySettings,
        alertRecipients: {
          ...prev.retrySettings.alertRecipients,
          [recipient]: !prev.retrySettings.alertRecipients[recipient],
        },
      },
    }));
  };

  const handleChannelToggle = (channel: string) => {
    setFormData((prev) => {
      const updatedChannels = prev.channel.includes(channel)
        ? prev.channel.filter((ch) => ch !== channel)
        : [...prev.channel, channel];

      return {
        ...prev,
        channel: updatedChannels,
      };
    });
  };

  const handleSubmit = () => {
    if (!notification) return;

    // Mise à jour de la notification en préservant la structure complète
    const updatedNotification: INotificationType = {
      ...notification,
      title: formData.title,
      type: formData.type,
      content: formData.content,
      // Preserve the original structure of recipients
      recipients: notification.recipients,
      channel: formData.channel,
      status: formData.status,
      sentDate: formData.sentDate || notification.sentDate,
      link: formData.link,
      scheduledDate: formData.scheduledDate,
      scheduledTime: formData.scheduledTime,
      frequency: formData.frequency,
      retrySettings: formData.retrySettings,
      attachments: formData.attachments,
      // These fields should not be modified by the form
      id: notification.id,
      createdAt: notification.createdAt,
      updatedAt: new Date().toISOString(), // Update the updatedAt timestamp
      viewed: notification.viewed,
      icon: notification.icon,
    };

    if (onUpdate) {
      onUpdate(updatedNotification);
    }

    onClose();
  };

  // Default to a fallback if type is not found
  const typeOption = TYPE_COLORS[formData.type.toLowerCase() as keyof typeof TYPE_COLORS] || {
    bgColor: '#757575',
    color: '#FFFFFF',
    icon: faBell,
  };

  // Default to a fallback if status is not found
  const statusOption = STATUS_COLORS[
    formData.status.toLowerCase() as keyof typeof STATUS_COLORS
  ] || { bgColor: 'rgba(50, 50, 50, 0.6)', color: '#FFFFFF', label: formData.status };

  // If no notification is provided, don't render
  if (!notification) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 580 },
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
              Modifier la Notification
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
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Titre
          </Typography>
          <TextField
            fullWidth
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            sx={{ mb: 3 }}
          />
        </Box>

        {/* Notification Type */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Type de notification
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select value={formData.type} onChange={(e) => handleChange('type', e.target.value)}>
              <MenuItem value="">Sélectionner un type</MenuItem>
              {NOTIFICATION_TYPE_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Notification Content */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Contenu
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={formData.content}
            onChange={(e) => handleChange('content', e.target.value)}
            sx={{ mb: 3 }}
          />
        </Box>

        {/* Link (Optional) */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Lien (Optionnel)
          </Typography>
          <TextField
            fullWidth
            value={formData.link || ''}
            onChange={(e) => handleChange('link', e.target.value)}
            placeholder="https://"
            sx={{ mb: 3 }}
          />
        </Box>

        {/* Recipients Information */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Destinataires
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Select
              value={formData.recipients}
              onChange={(e) => handleChange('recipients', e.target.value)}
            >
              <MenuItem value="">Sélectionner les destinataires</MenuItem>
              <MenuItem value="all_users">Tous les utilisateurs</MenuItem>
              <MenuItem value="premium_users">Utilisateurs Premium</MenuItem>
              <MenuItem value="newsletter">Abonnés Newsletter</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Delivery Channels */}
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.customShadows?.z8,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
          >
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                mr: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box component="span" sx={{ width: 20 }}>
                📢
              </Box>
            </Box>
            Canaux de notification
          </Typography>

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.channel.includes('email')}
                  onChange={() => handleChannelToggle('email')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>
                    ✉️
                  </Box>
                  Email
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.channel.includes('push')}
                  onChange={() => handleChannelToggle('push')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>
                    🔔
                  </Box>
                  Push notification
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.channel.includes('sms')}
                  onChange={() => handleChannelToggle('sms')}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>
                    📱
                  </Box>
                  SMS
                </Box>
              }
            />
          </FormGroup>
        </Paper>

        {/* Frequency */}
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.customShadows?.z8,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
          >
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                mr: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box component="span" sx={{ width: 20 }}>
                🕒
              </Box>
            </Box>
            Fréquence d&apos;envoi
          </Typography>

          <RadioGroup
            value={formData.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
          >
            <FormControlLabel value="immediate" control={<Radio />} label="Immédiat" />

            <FormControlLabel value="daily" control={<Radio />} label="Quotidien (résumé à 18h)" />

            <FormControlLabel
              value="weekly"
              control={<Radio />}
              label="Hebdomadaire (résumé le lundi)"
            />
          </RadioGroup>

          <ConditionalComponent isValid={formData.frequency !== 'immediate'}>
            <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
              <DatePicker
                label="Date"
                value={formData.scheduledDate}
                onChange={(newValue) => handleChange('scheduledDate', newValue)}
                format="DD/MM/YYYY"
              />
              <TimePicker
                label="Heure"
                value={formData.scheduledTime}
                onChange={(newValue) => handleChange('scheduledTime', newValue)}
              />
            </Box>
          </ConditionalComponent>
        </Paper>

        {/* Failure Alerts */}
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            boxShadow: theme.customShadows?.z8,
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
          >
            <Box
              component="span"
              sx={{
                color: 'error.main',
                mr: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box component="span" sx={{ width: 20 }}>
                ⚠️
              </Box>
            </Box>
            Alertes en cas d&apos;échec
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Nombre de tentatives de renvoi
            </Typography>
            <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
              <Slider
                value={formData.retrySettings.retryCount}
                onChange={(_, newValue) =>
                  handleRetrySettingsChange('retryCount', newValue as number)
                }
                step={1}
                marks
                min={0}
                max={5}
                valueLabelDisplay="auto"
                sx={{ mr: 2 }}
              />
              <Typography>{formData.retrySettings.retryCount}</Typography>
            </Box>
          </Box>

          <Typography variant="body2" gutterBottom>
            Destinataires des alertes d&apos;échec
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.retrySettings.alertRecipients.administrators}
                  onChange={() => handleAlertRecipientsChange('administrators')}
                />
              }
              label="Administrateurs"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.retrySettings.alertRecipients.supportTeam}
                  onChange={() => handleAlertRecipientsChange('supportTeam')}
                />
              }
              label="Équipe support"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.retrySettings.alertRecipients.affectedUser}
                  onChange={() => handleAlertRecipientsChange('affectedUser')}
                />
              }
              label="Utilisateur concerné"
            />
          </FormGroup>
        </Paper>

        {/* Action Buttons */}
        <Box
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
          }}
        >
          <Button variant="outlined" onClick={onClose} color="inherit" sx={{ minWidth: 120 }}>
            Annuler
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<FontAwesomeIcon icon={faSave} />}
            sx={{ minWidth: 120 }}
            disabled={
              !formData.title ||
              !formData.type ||
              !formData.content ||
              formData.channel.length === 0
            }
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditNotification;
