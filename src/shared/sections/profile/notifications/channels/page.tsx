'use client';

import React, { useState } from 'react';

import SmsIcon from '@mui/icons-material/Sms';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { 
    Box,
    Card,
    List,
    Chip,
    Paper,
    Alert,
    Button,
    Switch,
    Divider,
    Snackbar,
    ListItem,
    Container,
    Typography,
    CardContent,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction
  } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// Type pour la sévérité des alertes
type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

// Type pour les options de notification
interface ChannelOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const NotificationChannels = () => {
  // État pour les options de canaux
  const [channelOptions, setChannelOptions] = useState<ChannelOption[]>([
    {
      id: 'email',
      title: 'Email',
      description: 'Permet de recevoir les notifications à l\'adresse email de l\'utilisateur.',
      icon: <EmailIcon sx={{ color: 'white' }}/>,
      enabled: true
    },
    {
      id: 'sms',
      title: 'SMS',
      description: 'Permet de recevoir les notifications par SMS sur le téléphone de l\'utilisateur.',
      icon: <SmsIcon sx={{ color: 'white' }} />,
      enabled: false
    },
    {
      id: 'internal',
      title: 'Notifications internes',
      description: 'Permet de recevoir les notifications directement dans l\'application.',
      icon: <NotificationsIcon sx={{ color: 'white' }} />,
      enabled: true
    }
  ]);

  // État pour le snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertSeverity>('success');

  // Copie de l'état initial pour pouvoir annuler les modifications
  const [initialOptions] = useState<ChannelOption[]>([...channelOptions]);

  // Gestion du changement d'état pour une option
  const handleToggleOption = (id: string) => {
    setChannelOptions(options =>
      options.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  // Sauvegarde des paramètres
  const handleSave = () => {
    // Ici, vous ajouteriez la logique pour sauvegarder les paramètres
    // vers votre backend ou votre état global
    
    setSnackbarMessage('Vos préférences de canaux ont été enregistrées avec succès');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  // Remise à l'état initial (annulation)
  const handleCancel = () => {
    // Réinitialiser à l'état précédent
    setChannelOptions([...initialOptions]);
    
    setSnackbarMessage('Modifications annulées');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête de la page */}
      <Box mb={4}>
        <Button
          component={RouterLink}
          href={paths.dashboard.profile.notifications}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Retour à la gestion des notifications
        </Button>
        
        <Box display="flex" alignItems="center" mb={1}>
          <SendIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Canaux de réception des notifications
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" color="text.secondary">
          Choisissez les canaux par lesquels vous souhaitez recevoir vos notifications. Vous pouvez activer plusieurs canaux simultanément.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
      </Box>

      {/* Section principale */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
            Choisir les canaux de réception
          </Typography>
          
          <Typography variant="body1" paragraph color="text.secondary">
            Sélectionnez les moyens par lesquels vous souhaitez recevoir vos notifications.
          </Typography>
          
          <List>
            {channelOptions.map((option) => (
              <Paper
                key={option.id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: t => `1px solid ${option.enabled ? t.palette.primary.main : t.palette.divider}`,
                  borderRadius: 1,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }
                }}
              >
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon sx={{ minWidth: 45 }}>
                    <Box sx={{ 
                      backgroundColor: theme => option.enabled ? theme.palette.primary.light : theme.palette.grey[200], 
                      borderRadius: '50%', 
                      width: 36, 
                      height: 36, 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      color: theme => option.enabled ? theme.palette.primary.main : theme.palette.grey[500],
                      transition: 'all 0.2s ease-in-out'
                    }}>
                      {React.cloneElement(option.icon as React.ReactElement, { 
                        sx: { color: option.enabled ? 'white' : 'inherit' } 
                      })}
                    </Box>
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="div">
                        {option.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {option.description}
                        </Typography>
                        <Box mt={1}>
                          <Chip 
                            label={option.enabled ? "Activé" : "Désactivé"} 
                            size="small" 
                            color={option.enabled ? "success" : "default"}
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={option.enabled}
                      onChange={() => handleToggleOption(option.id)}
                      inputProps={{ 
                        'aria-labelledby': `switch-${option.id}`,
                        'aria-label': `Activer ou désactiver les notifications par ${option.title}`
                      }}
                      color="primary"
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 2,
          mt: 3,
          mb: 4 
        }}
      >
        <Button 
          variant="outlined" 
          onClick={handleCancel}
          aria-label="Annuler les modifications"
        >
          Annuler
        </Button>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          aria-label="Enregistrer les modifications"
        >
          Enregistrer les modifications
        </Button>
      </Box>

      {/* Notification de réussite ou d'échec */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NotificationChannels;