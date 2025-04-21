'use client';

import type { FormEvent } from 'react';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPhone,
  faIdBadge,
  faEnvelope,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Alert,
  Paper,
  Button,
  Divider,
  Snackbar,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

export default function EditProfileView() {
  const router = useRouter();
  const PROFILE_PAGE = '/dashboard/profile/profile';

  // State for form fields
  const [firstName, setFirstName] = useState(localStorage.getItem('userFirstName') || 'Thomas');
  const [lastName, setLastName] = useState(localStorage.getItem('userLastName') || 'Dubois');
  const [email, setEmail] = useState(
    localStorage.getItem('userEmail') || 'thomas.dubois@example.com'
  );
  const [secondaryEmail, setSecondaryEmail] = useState(
    localStorage.getItem('userSecondaryEmail') || ''
  );
  const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '+33 6 12 34 56 78');

  // State for success message
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Save to local storage
    localStorage.setItem('userFirstName', firstName);
    localStorage.setItem('userLastName', lastName);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userSecondaryEmail', secondaryEmail);
    localStorage.setItem('userPhone', phone);

    // Show success message
    setOpenSnackbar(true);

    // Optional: Redirect after a short delay
    // setTimeout(() => router.push(PROFILE_PAGE), 2000);
  };

  // Handle closing snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Page Title */}
      <Typography variant="h3" component="h1" align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
        Modifier les informations personnelles
      </Typography>

      <Grid container spacing={4}>
        {/* Navigation Menu (Sidebar) */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, height: '100%', boxShadow: 3 }}>
            <Button
              onClick={() => router.push(PROFILE_PAGE)}
              startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
              fullWidth
              size="large"
              sx={{ mb: 2, textAlign: 'left', justifyContent: 'flex-start' }}
              color="primary"
              variant="text"
            >
              Retour à la gestion de profil
            </Button>
            <Divider sx={{ my: 2 }} />
          </Paper>
        </Grid>

        {/* Main Section */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 4, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              Modifier vos informations personnelles
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
              Mettez à jour vos coordonnées et informations personnelles.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              La modification de votre adresse e-mail nécessitera une vérification par email pour
              être validée.
            </Alert>

            {/* Form */}
            <Box component="form" noValidate sx={{ mt: 2 }} onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faUser} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nom"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faUser} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Job Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nom de poste"
                    defaultValue="Super Administrateur"
                    disabled
                    helperText="Ce champ est défini par le Super Administrateur et ne peut pas être modifié."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faIdBadge} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Primary Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Adresse email principale"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Secondary Email */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email secondaire (optionnel)"
                    placeholder="Entrez une adresse email secondaire"
                    value={secondaryEmail}
                    onChange={(e) => setSecondaryEmail(e.target.value)}
                    type="email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faEnvelope} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro de téléphone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FontAwesomeIcon icon={faPhone} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  size="large"
                  color="primary"
                  onClick={() => router.push(PROFILE_PAGE)}
                >
                  Annuler
                </Button>
                <Button variant="contained" color="primary" size="large" type="submit">
                  Enregistrer les modifications
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for Confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Modifications enregistrées avec succès"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
    </Container>
  );
}
