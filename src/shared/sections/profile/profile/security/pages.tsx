'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faKey,
  faLock,
  faUser,
  faHome,
  faCamera,
  faHistory,
  faEyeSlash,
  faEnvelope,
  faLanguage,
  faMobileAlt,
  faShieldAlt,
  faFingerprint
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Link,
  List,
  Grid,
  Card,
  Radio,
  Paper,
  Button,
  Switch,
  Divider,
  ListItem,
  Container,
  TextField,
  RadioGroup,
  Typography,
  FormControl,
  CardContent,
  ListItemText,
  ListItemIcon,
  FormHelperText,
  LinearProgress,
  FormControlLabel
} from '@mui/material';

import { paths } from '../../../../../routes/paths';


export default function SecurityView() {
  const router = useRouter();
  const DASHBOARD_ROOT = '/dashboard';
  const PROFILE_ROOT = '/dashboard/profile/profile';

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState('');

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('sms');

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
      active: true 
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

  // Navigation handler
  const handleNavigation = (path: string) => {
    if (path) {
      router.push(path);
    }
  };

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*()_+={};':",.<>/?]/.test(password)) strength += 20;
      return strength;
  };

  // Validate password requirements
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('Minimum 8 caractères');
    if (!/[A-Z]/.test(password)) errors.push('Au moins une lettre majuscule');
    if (!/[a-z]/.test(password)) errors.push('Au moins une lettre minuscule');
    if (!/[0-9]/.test(password)) errors.push('Au moins un chiffre');
    if (!/[!@#$%^&*()_+={};':"|,.<>/?]/.test(password)) errors.push('Au moins un caractère spécial');
      return errors;
  };
  // Ajoutez ces états
  const [maskedEmail, setMaskedEmail] = useState('');
  const [maskedPhone, setMaskedPhone] = useState('');
  // Handle password changes
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password match
    if (newPassword !== confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    // Validate password requirements
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setPasswordError(passwordErrors.join(', '));
      return;
    }

    // Reset errors
    setPasswordError('');

    // Simulate password update (replace with actual API call)
    alert('Mot de passe mis à jour avec succès!');
    
    // Reset form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle forgotten password
  const handleForgotPassword = () => {
    // Replace with actual implementation
    router.push(paths.dashboard.profile.resetPassword);
  };

  // Handle 2FA toggle
  const handleTwoFactorToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTwoFactorEnabled(event.target.checked);
  };

  // Handle verification method change
  const handleVerificationMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationMethod(event.target.value);
  };

  // Handle save 2FA preferences
  const handleSaveTwoFactorPreferences = () => {
    // Replace with actual API call
    alert(`Préférences de vérification en deux étapes mises à jour. Méthode: ${verificationMethod}`);
  };

  // Update password strength on new password change
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);
  // Récupérer les données du localStorage au chargement
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || 'thomas.dubois@example.com';
    const storedPhone = localStorage.getItem('userPhone') || '+33 6 12 34 56 78';
    
    // au lieu de redéclarer des variables locales avec le même nom
    setMaskedEmail(maskEmail(storedEmail));
    setMaskedPhone(maskPhone(storedPhone));
  }, []);

  // Fonctions pour masquer partiellement les informations
  const maskEmail = (email: string): string => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    
    // Masquer une partie du nom d'utilisateur
    const maskedUsername = username.substring(0, Math.min(username.length, 4)) + '*'.repeat(Math.max(username.length - 4, 0));
    return `${maskedUsername}@${domain}`;
  };

  const maskPhone = (phone: string): string => {
    if (!phone) return '';
    // Garder visible uniquement les 2 derniers chiffres
    return phone.replace(/(\+\d{2}\s\d\s)(\d{2}\s\d{2}\s\d{2})(\s\d{2})/, '$1** ** **$3');
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
              <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: '10px' }} />
              Mot de passe et sécurité
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Gérez votre mot de passe et les paramètres de sécurité de votre compte.
            </Typography>
            <Typography variant="body2" color="warning.main" sx={{ mb: 4 }}>
              Note : Une notification par email vous sera envoyée après chaque modification de mot de passe ou paramètre de sécurité.
            </Typography>

            {/* Password Change Form */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                  <FontAwesomeIcon icon={faKey} style={{ marginRight: '10px' }} />
                  Modifier le mot de passe
                </Typography>

                <Box component="form" onSubmit={handlePasswordChange} sx={{ mt: 3 }}>
                  <Grid container spacing={3}>
                    {/* Current Password */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="currentPassword"
                        label="Mot de passe actuel"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <Button 
                              onClick={() => setShowPassword(!showPassword)}
                              sx={{ minWidth: 'auto' }}
                            >
                              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </Button>
                          ),
                        }}
                      />
                      <Box sx={{ mt: 1, textAlign: 'left' }}>
                        <Link
                          component="button"
                          variant="body2"
                          onClick={handleForgotPassword}
                          sx={{ color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                          Mot de passe actuelle oublié
                        </Link>
                      </Box>
                    </Grid>

                    {/* New Password */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="newPassword"
                        label="Nouveau mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        helperText="Minimum 8 caractères, avec majuscules, minuscules, chiffres et caractères spéciaux"
                      />
                      {/* Password Strength Indicator */}
                      <LinearProgress 
                        variant="determinate" 
                        value={passwordStrength} 
                        color={
                          passwordStrength < 40 ? 'error' : 
                          passwordStrength < 60 ? 'warning' : 
                          'success'
                        }
                        sx={{ mt: 1 }}
                      />
                    </Grid>

                    {/* Confirm New Password */}
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmer le nouveau mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Grid>

                    {/* Error Message */}
                    {passwordError && (
                      <Grid item xs={12}>
                        <Typography color="error" variant="body2">
                          {passwordError}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                  
                  {/* Submit Button */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{ 
                        px: 4, 
                        py: 1.5, 
                        backgroundColor: 'primary.main',
                        '&:hover': { backgroundColor: 'primary.dark' }
                      }}
                    >
                      Mettre à jour le mot de passe
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Two-Factor Authentication */}
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 3 }}>
                  <FontAwesomeIcon icon={faFingerprint} style={{ marginRight: '10px' }} />
                  Vérification en deux étapes (2FA)
                </Typography>
                <Typography variant="body1" paragraph>
                  Renforcez la sécurité de votre compte en activant la vérification en deux étapes.
                </Typography>

                {/* 2FA Toggle Switch */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={twoFactorEnabled}
                        onChange={handleTwoFactorToggle}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {twoFactorEnabled ? "Activé" : "Désactivé"}
                      </Typography>
                    }
                  />
                </Box>

                {/* 2FA Options - Only shown when 2FA is enabled */}
                {twoFactorEnabled && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Options:
                    </Typography>
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                      <RadioGroup
                        name="verificationMethod"
                        value={verificationMethod}
                        onChange={handleVerificationMethodChange}
                      >
                        <FormControlLabel
                          value="sms"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FontAwesomeIcon icon={faMobileAlt} style={{ marginRight: '10px' }} />
                              <Box>
                                <Typography variant="body1">Vérification par SMS</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Le code sera envoyé au {maskedPhone}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                        <FormControlLabel
                          value="email"
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} />
                              <Box>
                                <Typography variant="body1">Vérification par email</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Le code sera envoyé à {maskedEmail}
                                </Typography>
                              </Box>
                            </Box>
                          }
                        />
                      </RadioGroup>
                      <FormHelperText>
                        Choisissez comment vous souhaitez recevoir les codes de vérification
                      </FormHelperText>
                    </FormControl>

                    {/* Save 2FA Preferences Button */}
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSaveTwoFactorPreferences}
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
                  </Box>
                )}
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}