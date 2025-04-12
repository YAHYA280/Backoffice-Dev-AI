'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faUser, faMobile, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
  ListItemSecondaryAction,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// Type pour la sévérité des alertes
type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

// Type pour les options de notification
interface NotificationOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

const ProfileNotifications = () => {
  // État pour les options de notification
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([
    {
      id: 'profile-changes',
      title: 'Modifications du profil',
      description: 'Recevoir une alerte lors de modifications de la photo, de l\'email ou du mot de passe de votre compte.',
      icon: <FontAwesomeIcon icon={faEdit} />,
      enabled: true
    },
    {
      id: 'new-device-login',
      title: 'Connexions depuis un nouvel appareil',
      description: 'Être informé lorsqu\'une connexion est détectée depuis un appareil non reconnu.',
      icon: <FontAwesomeIcon icon={faMobile} />,
      enabled: true
    }
  ]);

  // État pour le snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertSeverity>('success');

  // Copie de l'état initial pour pouvoir annuler les modifications
  const [initialOptions] = useState<NotificationOption[]>([...notificationOptions]);

  // Gestion du changement d'état pour une option
  const handleToggleOption = (id: string) => {
    setNotificationOptions(options =>
      options.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  // Sauvegarde des paramètres
  const handleSave = () => {
    // Ici, vous ajouteriez la logique pour sauvegarder les paramètres
    // vers votre backend ou votre état global

    setSnackbarMessage('Vos préférences de notifications ont été enregistrées avec succès');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  // Remise à l'état initial (annulation)
  const handleCancel = () => {
    // Réinitialiser à l'état précédent
    setNotificationOptions([...initialOptions]);

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
          startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
          sx={{ mb: 2 }}
        >
          Retour aux notifications
        </Button>

        <Box display="flex" alignItems="center" mb={1}>
          <FontAwesomeIcon icon={faUser} fontSize="large" color="primary"  />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Notifications liées au profil
          </Typography>
        </Box>

        <Typography variant="subtitle1" color="text.secondary">
          Configurez les notifications que vous souhaitez recevoir concernant les modifications de votre profil et les connexions à votre compte.
        </Typography>

        <Divider sx={{ my: 3 }} />
      </Box>

      {/* Section principale */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
            Gérer les notifications liées à votre profil
          </Typography>

          <Typography variant="body1" paragraph color="text.secondary">
            Configurez les notifications que vous souhaitez recevoir concernant les modifications de votre profil et les connexions à votre compte.
          </Typography>

          <List>
            {notificationOptions.map((option) => (
              <Paper
                key={option.id}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  border: t => `1px solid ${option.enabled ? t.palette.primary.main : t.palette.divider}`,
                  borderRadius: 1
                }}
              >
                <ListItem alignItems="flex-start" disableGutters>
                  <ListItemIcon sx={{ minWidth: 45 }}>
                    <Box sx={{
                    backgroundColor: theme => theme.palette.primary.main, // Fond toujours en couleur primaire
                    borderRadius: '50%',
                      width: 36,
                      height: 36,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white' // Icône toujours en blanc
                    }}>
                      {option.icon}
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
                      inputProps={{ 'aria-labelledby': `switch-${option.id}` }}
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
        <Button variant="outlined" onClick={handleCancel}>
          Annuler
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
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

export default ProfileNotifications;