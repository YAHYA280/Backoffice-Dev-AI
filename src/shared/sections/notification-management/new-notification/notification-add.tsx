'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
  Box,
  Card,
  Grid,
  Stack,
  Radio,
  Paper,
  Select,
  Button,
  Slider,
  MenuItem,
  Checkbox,
  TextField,
  FormGroup,
  Typography,
  InputLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { NOTIFICATION_TYPE_OPTIONS } from 'src/shared/_mock/_notification';

export function CreateNotificationPage() {
  const router = useRouter();
  
  // Base notification info
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [recipients, setRecipients] = useState('');
  const [content, setContent] = useState('');
  
  // Delivery settings
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);
  const [frequency, setFrequency] = useState('immediate');
  
  // Channels
  const [channels, setChannels] = useState({
    push: false,
    email: true,
    sms: false,
  });
  
  // Failure alerts
  const [retryCount, setRetryCount] = useState(3);
  const [alertRecipients, setAlertRecipients] = useState({
    administrators: true,
    supportTeam: false,
    affectedUser: false,
  });
  
  const handleChannelChange = (channel: 'push' | 'email' | 'sms') => {
    setChannels({
      ...channels,
      [channel]: !channels[channel],
    });
  };
  
  const handleAlertRecipientsChange = (recipient: string) => {
    setAlertRecipients({
      ...alertRecipients,
      [recipient]: !alertRecipients[recipient as keyof typeof alertRecipients],
    });
  };
  
  const handleSubmit = () => {
    const selectedChannels = Object.entries(channels)
      .filter(([_, isSelected]) => isSelected)
      .map(([channel]) => channel);
      
    const notificationData = {
      title,
      type,
      recipients,
      content,
      scheduledDate: frequency === 'immediate' ? null : scheduledDate,
      scheduledTime: frequency === 'immediate' ? null : scheduledTime,
      frequency,
      channels: selectedChannels,
      retrySettings: {
        retryCount,
        alertRecipients,
      },
    };
    
    console.log('Notification data:', notificationData);
    router.push('/dashboard/notifications/');
  };
  
  const handleCancel = () => {
    router.push('/dashboard/notifications/');
  };
  
  return (
    <DashboardContent maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Nouvelle Notification</Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormControl fullWidth>
                <InputLabel>Type de notification</InputLabel>
                <Select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type de notification"
                >
                  <MenuItem value="">Sélectionner un type</MenuItem>
                  {NOTIFICATION_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Titre"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              
              <FormControl fullWidth>
                <InputLabel>Destinataires</InputLabel>
                <Select
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  label="Destinataires"
                >
                  <MenuItem value="">Sélectionner les destinataires</MenuItem>
                  <MenuItem value="all_users">Tous les utilisateurs</MenuItem>
                  <MenuItem value="premium_users">Utilisateurs Premium</MenuItem>
                  <MenuItem value="newsletter">Abonnés Newsletter</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Message"
                multiline
                rows={4}
                fullWidth
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Stack>
          </Card>
        </Grid>
        
        {/* Advanced Settings */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Paramètres avancés des notifications</Typography>
              
              {/* Delivery Channels */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      color: 'primary.main', 
                      mr: 1, 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box component="span" sx={{ width: 20 }}>📢</Box>
                  </Box>
                  Canaux de notification
                </Typography>
                
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={channels.email} 
                        onChange={() => handleChannelChange('email')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>✉️</Box>
                        Email
                      </Box>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={channels.push} 
                        onChange={() => handleChannelChange('push')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>🔔</Box>
                        Push notification
                      </Box>
                    }
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={channels.sms} 
                        onChange={() => handleChannelChange('sms')}
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>📱</Box>
                        SMS
                      </Box>
                    }
                  />
                </FormGroup>
              </Paper>
              
              {/* Frequency */}
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      color: 'primary.main', 
                      mr: 1, 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box component="span" sx={{ width: 20 }}>🕒</Box>
                  </Box>
                  Fréquence d&apos;envoi
                </Typography>
                
                <RadioGroup
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                >
                  <FormControlLabel 
                    value="immediate" 
                    control={<Radio />} 
                    label="Immédiat"
                  />
                  
                  <FormControlLabel 
                    value="daily" 
                    control={<Radio />} 
                    label="Quotidien (résumé à 18h)"
                  />
                  
                  <FormControlLabel 
                    value="weekly" 
                    control={<Radio />} 
                    label="Hebdomadaire (résumé le lundi)"
                  />
                </RadioGroup>
                
                {frequency !== 'immediate' && (
                  <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
                    <DatePicker
                      label="Date"
                      value={scheduledDate}
                      onChange={(newValue) => setScheduledDate(newValue)}
                      format="DD/MM/YYYY"
                    />
                    <TimePicker
                      label="Heure"
                      value={scheduledTime}
                      onChange={(newValue) => setScheduledTime(newValue)}
                    />
                  </Box>
                )}
              </Paper>
              
              {/* Failure Alerts */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Box 
                    component="span" 
                    sx={{ 
                      color: 'error.main', 
                      mr: 1, 
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box component="span" sx={{ width: 20 }}>⚠️</Box>
                  </Box>
                  Alertes en cas d&apos;échec
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>
                    Nombre de tentatives de renvoi
                  </Typography>
                  <Box sx={{ px: 2, display: 'flex', alignItems: 'center' }}>
                    <Slider
                      value={retryCount}
                      onChange={(_, newValue) => setRetryCount(newValue as number)}
                      step={1}
                      marks
                      min={0}
                      max={5}
                      valueLabelDisplay="auto"
                      sx={{ mr: 2 }}
                    />
                    <Typography>{retryCount}</Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  Destinataires des alertes d&apos;échec
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={alertRecipients.administrators} 
                        onChange={() => handleAlertRecipientsChange('administrators')}
                      />
                    }
                    label="Administrateurs"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={alertRecipients.supportTeam} 
                        onChange={() => handleAlertRecipientsChange('supportTeam')}
                      />
                    }
                    label="Équipe support"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={alertRecipients.affectedUser} 
                        onChange={() => handleAlertRecipientsChange('affectedUser')}
                      />
                    }
                    label="Utilisateur concerné"
                  />
                </FormGroup>
              </Paper>
            </Box>
          </Card>
        </Grid>
        
        {/* File Attachments */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
              Pièces jointes (optionnel)
            </Typography>
            <Button component="label" variant="outlined" sx={{ width: 'fit-content' }}>
              Choisir un fichier
              <input type="file" hidden />
            </Button>
          </Card>
        </Grid>
        
        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={handleCancel}>
              Annuler
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={!title || !type || !recipients || !content || (!channels.push && !channels.email && !channels.sms)}
            >
              Créer
            </Button>
          </Box>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

export default CreateNotificationPage;