'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKey,
  faHome,
  faLock,
  faUser,
  faCheck,
  faImage,
  faTimes,
  faCamera,
  faMobile,
  faDesktop,
  faHistory,
  faEnvelope,
  faLanguage,
  faSignOutAlt,
  faFingerprint,
  faMapMarkerAlt,
  faClockRotateLeft,
  faExclamationTriangle
}from '@fortawesome/free-solid-svg-icons';

import {
    Box,
    Card,
    Chip,
    Grid,
    List,
    Paper,
    Avatar,
    Button,
    Divider,
    Tooltip,
    ListItem,
    Container,
    IconButton,
    Typography,
    CardContent,
    ListItemIcon,
    ListItemText,
  } from "@mui/material";

import { paths } from '../../../../../routes/paths';


export default function HistoryView() {
  const router = useRouter();
  const DASHBOARD_ROOT = paths.dashboard.root;
  const PROFILE_ROOT = paths.dashboard.profile.profile;

  // Sample history data - this would come from API
  const [activityHistory] = useState([
    {
      id: 1,
      type: 'password_change',
      title: 'Changement de mot de passe',
      details: 'Mot de passe modifié avec succès.',
      date: '24 février 2025, 10:15',
      device: 'Chrome / Windows',
      icon: faKey
    },
    {
      id: 2,
      type: '2fa_activation',
      title: 'Activation 2FA',
      details: 'Vérification en deux étapes activée.',
      date: '22 février 2025, 14:30',
      device: 'Chrome / Windows',
      icon: faFingerprint
    },
    {
      id: 3,
      type: 'photo_change',
      title: 'Changement de photo',
      details: 'Photo de profil mise à jour.',
      date: '20 février 2025, 09:45',
      device: 'Safari / iOS',
      icon: faImage
    },
    {
      id: 4,
      type: 'email_change',
      title: 'Modification d\'email',
      details: 'Changement d\'email de t.dubois@mail.com à thomas.dubois@example.com.',
      date: '15 février 2025, 16:20',
      device: 'Firefox / macOS',
      icon: faEnvelope
    },
    {
      id: 5,
      type: 'remote_logout',
      title: 'Déconnexion à distance',
      details: 'Session déconnectée (iPhone / Paris).',
      date: '10 février 2025, 11:05',
      device: 'Chrome / Windows',
      icon: faSignOutAlt
    }
  ]);

  // Sample active sessions data - this would come from API
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 1,
      device: 'Chrome sur Windows 11',
      location: 'Paris, France',
      lastLogin: 'Aujourd\'hui à 09:30',
      status: 'Actif',
      current: true,
      icon: faDesktop
    },
    {
      id: 2,
      device: 'Application Mobile (iPhone 15)',
      location: 'Paris, France',
      lastLogin: 'Hier à 18:45',
      status: 'Actif',
      current: false,
      icon: faMobile
    },
    {
      id: 3,
      device: 'Firefox sur macOS',
      location: 'Lyon, France',
      lastLogin: '22 février 2025 à 14:20',
      status: 'Actif',
      current: false,
      icon: faDesktop
    }
  ]);

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
      path: `${PROFILE_ROOT}/languages`,
      active: false 
    },
    { 
      id: 5, 
      label: 'Historique', 
      description: 'Suivez vos activités',
      icon: faHistory,
      path: `${PROFILE_ROOT}/history`,
      active: true 
    },
  ];

  // Navigation handler
  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  // Handle session logout
  const handleSessionLogout = (sessionId: number) => {
    // Call API to logout session
    // For now, just remove from state
    setActiveSessions(activeSessions.filter(session => session.id !== sessionId));
  };

  // Handle logout all sessions
  const handleLogoutAll = () => {
    // Call API to logout all sessions except current
    // For now, just keep the current session
    setActiveSessions(activeSessions.filter(session => session.current));
  };

  // Get icon color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'password_change':
      case '2fa_activation':
        return 'success.main';
      case 'email_change':
        return 'info.main';
      case 'remote_logout':
        return 'warning.main';
      default:
        return 'primary.main';
    }
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
              <FontAwesomeIcon icon={faHistory} style={{ marginRight: '10px' }} />
              Historique et Activité
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
            Consultez l&apos;historique de votre compte et gérez vos sessions actives.
            </Typography>

            {/* Activity History */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                  <FontAwesomeIcon icon={faClockRotateLeft} style={{ marginRight: '10px' }} />
                  Historique des modifications
                </Typography>
                <Typography variant="body2" paragraph>
                  Liste des changements récents apportés à votre profil.
                </Typography>

                <List>
                  {activityHistory.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <ListItem
                        sx={{
                          p: 2,
                          mb: 2,
                          bgcolor: 'background.default',
                          borderRadius: 2,
                          boxShadow: 1
                        }}
                      >
                        <ListItemIcon>
                          <Avatar
                            sx={{
                              bgcolor: getActivityColor(activity.type),
                              width: 40,
                              height: 40
                            }}
                          >
                            <FontAwesomeIcon icon={activity.icon} />
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              {activity.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                                {activity.details}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" color="text.secondary">
                                  <b>Date et heure:</b> {activity.date}
                                </Typography>
                                <Chip
                                  size="small"
                                  icon={<FontAwesomeIcon icon={faDesktop} style={{ fontSize: '0.75rem' }} />}
                                  label={activity.device}
                                  variant="outlined"
                                />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Active Sessions */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                    <FontAwesomeIcon icon={faDesktop} style={{ marginRight: '10px' }} />
                    Sessions actives
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<FontAwesomeIcon icon={faSignOutAlt} />}
                    onClick={handleLogoutAll}
                    disabled={activeSessions.filter(session => !session.current).length === 0}
                  >
                    Déconnecter toutes les autres sessions
                  </Button>
                </Box>
                <Typography variant="body2" paragraph>
                  Appareils actuellement connectés à votre compte.
                </Typography>

                <List>
                  {activeSessions.map((session) => (
                    <ListItem
                      key={session.id}
                      sx={{
                        p: 2,
                        mb: 2,
                        bgcolor: session.current ? 'primary.lighter' : 'background.default',
                        borderRadius: 2,
                        boxShadow: 1
                      }}
                    >
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            bgcolor: session.current ? 'primary.main' : 'grey.500',
                            width: 40,
                            height: 40
                          }}
                        >
                          <FontAwesomeIcon icon={session.icon} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium', flexGrow: 1 }}>
                              {session.device}
                            </Typography>
                            {session.current && (
                              <Chip
                                size="small"
                                color="primary"
                                label="Session actuelle"
                                sx={{ ml: 2 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '8px', fontSize: '0.875rem' }} />
                              <Typography variant="body2">
                                {session.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="caption" color="text.secondary">
                                <b>Dernière connexion:</b> {session.lastLogin}
                              </Typography>
                              <Box>
                                <Chip
                                  size="small"
                                  icon={<FontAwesomeIcon icon={faCheck} style={{ fontSize: '0.75rem' }} />}
                                  label={session.status}
                                  color="success"
                                  variant="outlined"
                                  sx={{ mr: 1 }}
                                />
                                {!session.current && (
                                  <Tooltip title="Déconnecter cette session">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleSessionLogout(session.id)}
                                    >
                                      <FontAwesomeIcon icon={faTimes} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ marginRight: '8px' }} />
                    Si vous remarquez une activité suspecte, déconnectez la session et changez immédiatement votre mot de passe.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}