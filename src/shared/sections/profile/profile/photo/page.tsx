'use client';

import type { SyntheticEvent } from 'react';
import type { AlertColor } from '@mui/material';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faUser,
  faLock,
  faHome,
  faTrash,
  faCamera,
  faUpload,
  faHistory,
  faLanguage
}from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Grid,
  List,
  Alert,
  Paper,
  Radio,
  Stack,
  Avatar,
  Button,
  Divider,
  ListItem,
  Snackbar,
  Container,
  RadioGroup,
  Typography,
  CardContent,
  FormControl,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
} from "@mui/material";

export default function ProfilePhotoView() {
  const router = useRouter();
  const DASHBOARD_ROOT = '/dashboard';
  const PROFILE_ROOT = '/dashboard/profile/profile';

  // State pour gérer la visibilité de la photo
  const [photoVisibility, setPhotoVisibility] = useState<string>('all');
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [severity, setSeverity] = useState<AlertColor>('success');
  
  // State pour gérer l'upload de photo
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [hasDefaultPhoto, setHasDefaultPhoto] = useState<boolean>(true);

  // Effet pour charger les préférences utilisateur depuis localStorage
  useEffect(() => {
    const storedVisibility = localStorage.getItem('photoVisibility');
    if (storedVisibility) {
      setPhotoVisibility(storedVisibility);
    }
    
    const storedPhotoUrl = localStorage.getItem('userPhotoUrl');
    if (storedPhotoUrl) {
      setPreviewUrl(storedPhotoUrl);
      setHasDefaultPhoto(false);
    }
  }, []);

  // Items du menu de navigation
  const menuItems = [
    { 
      id: 1, 
      label: 'Informations personnelles', 
      description: 'Gérez vos données personnelles',
      icon: faUser,
      path: PROFILE_ROOT,
      active: false 
    },
    { 
      id: 2, 
      label: 'Photo de profil', 
      description: 'Personnalisez votre avatar',
      icon: faCamera,
      path: `${PROFILE_ROOT}/photo`,
      active: true 
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

  // Fonction pour gérer le changement de visibilité
  const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoVisibility(event.target.value);
  };

  // Fonction pour gérer l'upload de photo
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (files && files[0]) {
      const selectedFile = files[0];
      
      // Créer une URL pour prévisualiser l'image
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setHasDefaultPhoto(false);
      
      // Afficher une alerte de succès
      setAlertMessage('Photo téléchargée avec succès!');
      setSeverity('success');
      setShowAlert(true);
    }
  };

  // Fonction pour supprimer la photo
  const handleDeletePhoto = () => {
    setPreviewUrl('');
    setHasDefaultPhoto(true);
    
    // Afficher une alerte de succès
    setAlertMessage('Photo supprimée avec succès!');
    setSeverity('info');
    setShowAlert(true);
  };

  // Fonction pour enregistrer les modifications
  const handleSaveChanges = () => {
    // Enregistrer les préférences dans localStorage
    localStorage.setItem('photoVisibility', photoVisibility);
    
    if (previewUrl) {
      localStorage.setItem('userPhotoUrl', previewUrl);
    } else {
      localStorage.removeItem('userPhotoUrl');
    }
    
    // Afficher une alerte de succès
    setAlertMessage('Modifications enregistrées avec succès!');
    setSeverity('success');
    setShowAlert(true);
    
    // Rediriger vers la page principale du profil après un court délai
    setTimeout(() => {
      router.push(PROFILE_ROOT);
    }, 1500);
  };

  // Fonction pour fermer l'alerte
  const handleCloseAlert = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowAlert(false);
  };

  // Fonction pour naviguer vers une page
  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

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
        {/* Menu de navigation (Sidebar) */}
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
              Photo de profil et visibilité
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Personnalisez votre photo de profil et contrôlez qui peut la voir.
            </Typography>

            {/* Section de la photo de profil */}
            <Card sx={{ mb: 4, p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                  Votre photo de profil
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4, mb: 3 }}>
                  {/* Photo de profil */}
                  <Avatar
                    src={previewUrl}
                    sx={{
                      width: 150,
                      height: 150,
                      bgcolor: 'primary.light',
                      fontSize: '3rem',
                      fontWeight: 'bold',
                      boxShadow: 2
                    }}
                  >
                    {hasDefaultPhoto ? 'TD' : null}
                  </Avatar>

                  {/* Boutons d'action */}
                  <Stack direction="column" spacing={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<FontAwesomeIcon icon={faUpload} />}
                      component="label"
                    >
                      Changer la photo
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<FontAwesomeIcon icon={faTrash} />}
                      onClick={handleDeletePhoto}
                      disabled={hasDefaultPhoto}
                    >
                      Supprimer la photo
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            {/* Section de visibilité */}
            <Card sx={{ mb: 4, p: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 2 }}>
                  <FontAwesomeIcon icon={faEye} style={{ marginRight: '10px' }} />
                  Visibilité de la photo de profil
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
                  Choisissez qui peut voir votre photo de profil.
                </Typography>

                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="visibility"
                    name="visibility"
                    value={photoVisibility}
                    onChange={handleVisibilityChange}
                  >
                    <FormControlLabel 
                      value="all" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">Tous les utilisateurs (Admin, Super Admin)</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Votre photo de profil sera visible par tous les administrateurs et super administrateurs du système.
                          </Typography>
                        </Box>
                      } 
                      sx={{ mb: 2 }}
                    />
                    <FormControlLabel 
                      value="private" 
                      control={<Radio />} 
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="medium">Privé</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Votre photo ne sera visible que par vous-même. Une image par défaut sera utilisée dans les interfaces visibles par les autres.
                          </Typography>
                        </Box>
                      } 
                    />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Bouton d'action */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSaveChanges}
              >
                Enregistrer les modifications
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar pour les alertes */}
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}