'use client';

import React, { useState } from 'react';

import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Grid,Paper, Switch, Button ,Divider,Typography  } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// Style pour le texte d'état
const StatusText = styled(Typography)<{ active?: boolean }>(({ theme, active }) => ({
  color: active ? theme.palette.success.main : theme.palette.text.secondary,
  fontWeight: 'bold',
}));

// Composant pour une option de notification
interface NotificationOptionProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NotificationOption: React.FC<NotificationOptionProps> = ({
  title,
  description,
  checked,
  onChange,
}) => (
  <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Grid>
      <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, alignItems: 'center' }}>
        <StatusText active={checked} sx={{ mr: 2 }}>
          {checked ? 'Activé' : 'Désactivé'}
        </StatusText>
        <Switch
          checked={checked}
          onChange={onChange}
          inputProps={{ 'aria-label': 'toggle notification' }}
          color="primary"
        />
      </Grid>
    </Grid>
  </Paper>
);

const SystemNotificationsPage: React.FC = () => {
  // États pour chaque option de notification
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [roleChanges, setRoleChanges] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Fonction pour gérer l'annulation
  const handleCancel = () => {
    // Réinitialiser les états ou naviguer en arrière
    setSystemUpdates(true);
    setRoleChanges(true);
    setSecurityAlerts(true);
  };

  // Fonction pour sauvegarder les modifications
  const handleSave = () => {
    // Logique pour sauvegarder les changements
    console.log({
      systemUpdates,
      roleChanges,
      securityAlerts,
    });
    // Ici, vous pourriez appeler une API pour persister les modifications
  };

  return (
    <Box sx={{ py: 3, px: { xs: 2, md: 3 } }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Notifications système
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.profile.notifications}
          startIcon={<ArrowBackIcon />}
          sx={{ textTransform: 'none' }}
        >
          Retour à la gestion des notifications
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Section principale */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Activer/Désactiver les notifications système
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Configurez vos préférences pour les notifications liées au système, à la sécurité et aux mises à jour importantes. 
          Ces notifications vous aideront à rester informé des changements critiques.
        </Typography>
      </Box>

      {/* Options de notification */}
      <Box sx={{ mb: 4 }}>
        <NotificationOption
          title="Gérer les alertes sur les mises à jour du système"
          description="Recevez des notifications lorsque des mises à jour importantes du système sont disponibles ou installées automatiquement."
          checked={systemUpdates}
          onChange={(e) => setSystemUpdates(e.target.checked)}
        />

        <NotificationOption
          title="Recevoir des notifications sur les changements de rôles et permissions"
          description="Soyez informé lorsque vos rôles, permissions ou accès sont modifiés dans le système."
          checked={roleChanges}
          onChange={(e) => setRoleChanges(e.target.checked)}
        />

        <NotificationOption
          title="Activer ou désactiver les notifications de sécurité"
          description="Recevez des alertes en cas de problèmes de sécurité, de tentatives de connexion suspectes ou de modifications importantes liées à la sécurité."
          checked={securityAlerts}
          onChange={(e) => setSecurityAlerts(e.target.checked)}
        />
      </Box>

      {/* Pied de page avec boutons d'action */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleCancel}
          sx={{ px: 3 }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ px: 3 }}
        >
          Enregistrer les modifications
        </Button>
      </Box>
    </Box>
  );
};

export default SystemNotificationsPage;