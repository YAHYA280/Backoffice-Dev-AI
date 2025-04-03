'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faLock,
  faCamera,
  faHistory,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Card,
  List,
  Paper,
  Avatar,
  Button,
  Divider,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemIcon,
  ListItemText
} from '@mui/material';

export default function ProfileView() {
  const router = useRouter();
  const DASHBOARD_ROOT = '/dashboard';
  const PROFILE_ROOT = '/dashboard/profile/profile';
  
  // State to store user information
  const [userProfile, setUserProfile] = useState({
    firstName: 'Thomas',
    lastName: 'Dubois',
    email: 'thomas.dubois@example.com',
    secondaryEmail: '',
    phone: '+33 6 12 34 56 78'
  });

  // Fonction pour naviguer vers une page
  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  // Items du menu de navigation (avec des libellés plus descriptifs)
  const menuItems = [
    { 
      id: 1, 
      label: 'Informations personnelles', 
      description: 'Gérez vos données personnelles',
      icon: faUser,
      path: PROFILE_ROOT,
      active: true 
    },
    { 
      id: 2, 
      label: 'Photo de profil', 
      description: 'Personnalisez votre avatar',
      icon: faCamera,
      path: `${PROFILE_ROOT}/photo`,
      active: false 
    },
    { 
      id: 3, 
      label: 'Sécurité', 
      description: 'Protégez votre compte',
      icon: faLock,
        path: `${PROFILE_ROOT}/security`,
      active: false 
    },
    { 
      id: 4, 
      label: 'Langues', 
      description: 'Configurez vos préférences',
      icon: faLanguage,
      path: `${PROFILE_ROOT}/languages`,
      active: false 
    },
    { 
      id: 5, 
      label: 'Historique', 
      description: 'Suivez vos activités',
      icon: faHistory,
      path: `${PROFILE_ROOT}/history`,
      active: false 
    },
  ];

  // Effect to load user profile from localStorage
  useEffect(() => {
    // Retrieve user information from localStorage
    const storedFirstName = localStorage.getItem('userFirstName');
    const storedLastName = localStorage.getItem('userLastName');
    const storedEmail = localStorage.getItem('userEmail');
    const storedSecondaryEmail = localStorage.getItem('userSecondaryEmail');
    const storedPhone = localStorage.getItem('userPhone');
    
    // Update state if localStorage has values
    if (storedFirstName || storedLastName || storedEmail) {
      setUserProfile({
        firstName: storedFirstName || userProfile.firstName,
        lastName: storedLastName || userProfile.lastName,
        email: storedEmail || userProfile.email,
        secondaryEmail: storedSecondaryEmail || userProfile.secondaryEmail,
        phone: storedPhone || userProfile.phone
      });
    }
  }, [userProfile.firstName, userProfile.lastName, userProfile.email, userProfile.secondaryEmail, userProfile.phone]);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Conteneur flex pour aligner le bouton et le titre */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Button
          onClick={() => router.push(DASHBOARD_ROOT)}
          startIcon={<FontAwesomeIcon icon={faHome} />}
          sx={{
            fontSize: '1.2rem',
            padding: '10px 20px',
            fontWeight: 'bold',
          }}
          color="primary"
          variant="contained"
        >
          Retour au tableau de bord
        </Button>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', ml: 2 }}>
          Gestion de Profil
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Menu de navigation (Sidebar) - Plus haut */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              height: '100%',
              minHeight: '600px',
              boxShadow: 3,
              position: 'sticky',
              top: '70px',
            }}
          >
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
              Paramètres du Profil
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <List component="nav" disablePadding>
              {menuItems.map(item => (
                <ListItem
                  key={item.id}
                  button
                  selected={item.active}
                  onClick={() => item.path && handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 2,
                    p: 2,
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 50, mr: 2 }}>
                      <FontAwesomeIcon icon={item.icon} style={{ fontSize: '1.5rem' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {item.label}
                        </Typography>
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Section principale */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 4,
              height: '100%',
              minHeight: '600px',
              boxShadow: 3
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Informations personnelles
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Modifiez vos informations personnelles et vos coordonnées pour garder votre profil à jour.
              Assurez-vous que vos informations sont précises et complètes.
            </Typography>

            {/* Carte de Profil */}
            <Card sx={{ boxShadow: 2 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' }, gap: 4 }}>
                  {/* Photo de profil plus grande avec possibilité de la modifier */}
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={localStorage.getItem('userPhotoUrl') || ''}
                      sx={{
                        width: 150,
                        height: 150,
                        bgcolor: 'primary.light',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        boxShadow: 2
                      }}
                    >
                      {!localStorage.getItem('userPhotoUrl') && (userProfile.firstName[0] + userProfile.lastName[0])}
                    </Avatar>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        minWidth: '36px',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        p: 0
                      }}
                      onClick={() => router.push(`${PROFILE_ROOT}/photo`)}
                    >
                      <FontAwesomeIcon icon={faCamera} />
                    </Button>
                  </Box>

                  {/* Informations du profil */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {userProfile.firstName} {userProfile.lastName}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Rôle: Super Administrateur
                    </Typography>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {userProfile.email}
                    </Typography>
                    {userProfile.secondaryEmail && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email secondaire: {userProfile.secondaryEmail}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Téléphone: {userProfile.phone}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ mt: 2 }}
                      onClick={() => router.push('/dashboard/profile/profile/edit/')}
                    >
                      Modifier les informations
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}