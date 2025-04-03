'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faSync,
  faLock,
  faHome,
  faCamera,
  faHistory,
  faLanguage,
  faGlobeEurope
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Grid,
  List,
  Paper,
  Radio,
  Button,
  Switch,
  Divider,
  ListItem,
  Container,
  TextField,
  RadioGroup,
  Typography,
  CardContent,
  FormControl,
  Autocomplete,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
} from "@mui/material";

import { paths } from '../../../../../routes/paths';


export default function LanguageView() {
  const router = useRouter();
  const DASHBOARD_ROOT = paths.dashboard.root;
  const PROFILE_ROOT = paths.dashboard.profile.profile;

  // Language state
  const [language, setLanguage] = useState<string>('fr');
  
  // Timezone states
  const [autoDetectTimezone, setAutoDetectTimezone] = useState<boolean>(true);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>('Europe/Paris');
  const [detectedTimezone, setDetectedTimezone] = useState<string>('');

  // Menu items
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
      path: `${PROFILE_ROOT}/languages`,  // Assurez-vous que cela correspond à paths.ts
      active: true 
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

  // Available languages
  const languages = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'de', label: 'Deutsch' }
  ];

  // Available timezones (simplified list)
  const timezones = [
    '(GMT+01:00) Paris - Heure d\'Europe centrale',
    '(GMT+00:00) Londres - Heure de Greenwich',
    '(GMT-05:00) New York - Heure de l\'Est',
    '(GMT-08:00) Los Angeles - Heure du Pacifique',
    '(GMT+02:00) Helsinki - Heure d\'Europe de l\'Est',
    '(GMT+08:00) Beijing - Heure de Chine',
    '(GMT+09:00) Tokyo - Heure du Japon',
    '(GMT+10:00) Sydney - Heure d\'Australie de l\'Est'
  ];

  // Navigation handler
  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  // Detect user's timezone
  useEffect(() => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setDetectedTimezone(timezone);
      
      // If auto-detect is on, set the selected timezone to the detected one
      if (autoDetectTimezone) {
        setSelectedTimezone(timezone);
      }
    } catch (error) {
      console.error('Failed to detect timezone:', error);
      setDetectedTimezone('Europe/Paris');
    }
  }, [autoDetectTimezone]);

  // Handle language change
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
  };

  // Handle auto-detect timezone toggle
  const handleAutoDetectToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoDetectTimezone(event.target.checked);
  };

  // Handle save preferences
  const handleSavePreferences = () => {
    // Save to localStorage (replace with actual API call in production)
    localStorage.setItem('userLanguage', language);
    localStorage.setItem('userAutoDetectTimezone', String(autoDetectTimezone));
    
    if (!autoDetectTimezone && selectedTimezone) {
      localStorage.setItem('userTimezone', selectedTimezone);
    }
    
    // Show confirmation (replace with proper notification system)
    alert('Préférences linguistiques et horaires enregistrées avec succès !');
  };

  // Handle cancel
  const handleCancel = () => {
    // Reset to saved values or navigate back
    router.push(PROFILE_ROOT);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header with back button and title */}
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

        {/* Main Content Section */}
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
              <FontAwesomeIcon icon={faLanguage} style={{ marginRight: '10px' }} />
              Préférences linguistiques et horaires
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Personnalisez la langue de l&apos;interface et les paramètres de fuseau horaire.
            </Typography>

            {/* Language Settings */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                  <FontAwesomeIcon icon={faLanguage} style={{ marginRight: '10px' }} />
                  Langue de l&apos;interface
                </Typography>
                <Typography variant="body2" paragraph>
                  Choisissez la langue dans laquelle vous souhaitez utiliser l&apos;application.
                </Typography>

                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <RadioGroup
                    name="language"
                    value={language}
                    onChange={handleLanguageChange}
                  >
                    {languages.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Timezone Settings */}
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                  <FontAwesomeIcon icon={faGlobeEurope} style={{ marginRight: '10px' }} />
                  Fuseau horaire
                </Typography>
                <Typography variant="body2" paragraph>
                  Définissez votre fuseau horaire pour assurer la cohérence des dates et heures dans l&apos;application.
                </Typography>

                {/* Auto-detect Timezone */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Détection automatique
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Synchroniser automatiquement avec l&apos;heure locale de votre appareil.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoDetectTimezone}
                        onChange={handleAutoDetectToggle}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {autoDetectTimezone ? "Activé" : "Désactivé"}
                      </Typography>
                    }
                  />
                </Box>

                {/* Manual Timezone Selection */}
                <Box sx={{ mb: 4, opacity: autoDetectTimezone ? 0.5 : 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Sélectionner manuellement le fuseau horaire
                  </Typography>
                  
                  <Autocomplete
                    disabled={autoDetectTimezone}
                    id="timezone-select"
                    options={timezones}
                    value={selectedTimezone}
                    onChange={(_, newValue) => {
                      setSelectedTimezone(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Rechercher un fuseau horaire..."
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    sx={{ mt: 2 }}
                  />
                </Box>

                {/* Current Timezone Info */}
                {detectedTimezone && (
                  <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faSync} style={{ marginRight: '10px' }} />
                    <Typography variant="body2" color="text.secondary">
                      Actuellement synchronisé avec l&apos;heure locale de votre appareil ({detectedTimezone}).
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleCancel}
                sx={{ px: 4, py: 1.5 }}
              >
                Annuler
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSavePreferences}
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  backgroundColor: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                Enregistrer les préférences
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}