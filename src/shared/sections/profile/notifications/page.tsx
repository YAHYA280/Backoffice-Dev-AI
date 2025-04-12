'use client';

import React from 'react';

import SendIcon from '@mui/icons-material/Send';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { 
  Box,
  Grid,
  Chip,
  Link,
  Paper,
  Button,
  Divider,
  useTheme,
  Container,
  Typography
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// Type pour les cartes de notifications
interface NotificationCardProps {
  title: string;
  description: string;
  indicator: string;
  icon: React.ReactNode;
  detailsLink?: string;
}

// Composant pour chaque carte de notification
const NotificationCard: React.FC<NotificationCardProps> = ({ title, description, indicator, icon, detailsLink }) => {
  const theme = useTheme();
  
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 2, 
        borderRadius: '8px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Box sx={{ 
            backgroundColor: theme.palette.primary.light, 
            borderRadius: '50%', 
            width: 48, 
            height: 48, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            color: theme.palette.primary.main
          }}>
            {icon}
          </Box>
        </Grid>
        <Grid item xs>
          <Typography variant="h6" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip 
              label={indicator} 
              size="small" 
              color="success"
              sx={{ fontWeight: 500 }}
            />
            {detailsLink && (
              <Link 
                component={RouterLink}
                href={detailsLink}
                color="primary" 
                underline="hover"
                sx={{ 
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                Voir les détails
              </Link>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const Notifications = () => {
  const notificationSections = [
    {
      title: "Notifications système",
      description: "Configuration des alertes importantes liées au système, à la sécurité et aux mises à jour.",
      indicator: "3 activées",
      icon: <SecurityIcon fontSize="medium"  sx={{ color: 'white' }} />,
      detailsLink: paths.dashboard.profile.notificationSystem
    },
    {
      title: "Fréquence des notifications",
      description: "Définissez la fréquence à laquelle vous souhaitez recevoir vos notifications.",
      indicator: "Temps réel",
      icon: <AccessTimeIcon fontSize="medium"  sx={{ color: 'white' }} />,
      detailsLink: paths.dashboard.profile.notificationFrequency
    },
    {
      title: "Notifications liées au profil",
      description: "Alertes concernant les modifications de profil et les connexions de nouveaux appareils.",
      indicator: "2 activées",
      icon: <PersonIcon fontSize="medium"  sx={{ color: 'white' }} />,
      detailsLink: paths.dashboard.profile.notificationProfile
    },
    {
      title: "Notifications de suivi d'activité",
      description: "Suivi des actions en attente d'approbation et des demandes administratives.",
      indicator: "1 activée",
      icon: <AssignmentIcon fontSize="medium"  sx={{ color: 'white' }} />,
      detailsLink: paths.dashboard.profile.notificationActivity
    },
    {
      title: "Canaux de réception",
      description: "Choisissez où et comment vous souhaitez recevoir vos notifications.",
      indicator: "2 activés",
      icon: <SendIcon fontSize="medium"  sx={{ color: 'white' }}/>,
      detailsLink: paths.dashboard.profile.notificationChannels
    },
    {
      title: "Liste des notifications",
      description: "Consultez l'historique complet de vos notifications reçues.",
      indicator: "3 non lues",
      icon: <HistoryIcon fontSize="medium"   sx={{ color: 'white' }} />,
      detailsLink: paths.dashboard.profile.notificationHistory
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={1}>
          <NotificationsIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestion des Notifications
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Personnalisez vos préférences de notifications pour rester informé de manière optimale.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<HomeIcon />} 
          component={RouterLink} 
          href="http://localhost:3000/dashboard"
          sx={{ mt: 2 }}
        >
          Retour à l&apos;accueil
        </Button>
        <Divider sx={{ my: 3 }} />
      </Box>

      <Grid container spacing={3}>
        {notificationSections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <NotificationCard
              title={section.title}
              description={section.description}
              indicator={section.indicator}
              icon={section.icon}
              detailsLink={section.detailsLink}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Notifications;