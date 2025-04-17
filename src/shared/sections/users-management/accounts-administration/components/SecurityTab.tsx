import type { IUserItem } from 'src/contexts/types/user';

import React, { useState, useCallback } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import WarningIcon from '@mui/icons-material/Warning';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Card,
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  DialogContentText,
} from '@mui/material';

import { toast } from 'src/shared/components/snackbar';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface SecurityTabProps {
  currentUser?: IUserItem;
  handleResetPassword: (newPassword: string) => Promise<void>;
}

const SecurityTab: React.FC<SecurityTabProps> = ({ currentUser, handleResetPassword }) => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const generateSecurePassword = useCallback((): string => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()-_=+';

    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
    const passwordLength = 16;

    // Ensure at least one character from each character set
    let password = '';
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill the rest of the password with random characters
    for (let i = password.length; i < passwordLength; i += 1) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password to avoid predictable positions
    return password
      .split('')
      .sort(() => 0.5 - Math.random())
      .join('');
  }, []);

  const handleToggleResetMode = useCallback(() => {
    if (!isResetMode) {
      setGeneratedPassword(generateSecurePassword());
    }
    setIsResetMode((prev) => !prev);
  }, [isResetMode, generateSecurePassword]);

  const handleGenerateNewPassword = useCallback(() => {
    setGeneratedPassword(generateSecurePassword());
  }, [generateSecurePassword]);

  const openConfirmationDialog = useCallback(() => {
    setConfirmDialogOpen(true);
  }, []);

  const closeConfirmationDialog = useCallback(() => {
    setConfirmDialogOpen(false);
  }, []);

  const handleConfirmReset = useCallback(async () => {
    closeConfirmationDialog();

    try {
      // Passe le mot de passe généré à la fonction de réinitialisation
      await handleResetPassword(generatedPassword);
      setIsResetMode(false);
    } catch (error) {
      // Handle error if needed
      console.error('Error resetting password:', error);
      toast.error('Erreur lors de la réinitialisation du mot de passe');
    }
  }, [handleResetPassword, closeConfirmationDialog, generatedPassword]);

  const handleCopyPassword = useCallback(() => {
    navigator.clipboard.writeText(generatedPassword);
    toast.success('Mot de passe copié dans le presse-papiers');
  }, [generatedPassword]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <>
      <Card sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>
          Sécurité du compte
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleToggleResetMode}
            sx={{
              backgroundColor: '#1e293b',
              '&:hover': { backgroundColor: '#0f172a' },
              alignSelf: 'flex-start',
            }}
          >
            Réinitialiser le mot de passe
          </Button>

          <ConditionalComponent isValid={isResetMode}>
            <>
              <TextField
                type={showPassword ? 'text' : 'password'}
                value={generatedPassword}
                fullWidth
                label="Nouveau mot de passe"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-start">
                <Button
                  variant="contained"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyPassword}
                  sx={{ backgroundColor: '#1e293b', '&:hover': { backgroundColor: '#0f172a' } }}
                >
                  Copier
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleGenerateNewPassword}
                  sx={{ color: '#1e293b', borderColor: '#1e293b' }}
                >
                  Régénérer
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleToggleResetMode}
                  sx={{ color: '#1e293b', borderColor: '#1e293b' }}
                >
                  Annuler
                </Button>
              </Stack>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={openConfirmationDialog}
                  sx={{ backgroundColor: '#1e293b', '&:hover': { backgroundColor: '#0f172a' } }}
                >
                  Sauvegarder les modifications
                </Button>
              </Box>
            </>
          </ConditionalComponent>
        </Box>
      </Card>

      {/* Boîte de dialogue de confirmation */}
      <Dialog
        open={confirmDialogOpen}
        onClose={closeConfirmationDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="primary" />
          Confirmation de réinitialisation
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir réinitialiser{' '}
            {currentUser
              ? `le mot de passe de ${currentUser.firstName} ${currentUser.lastName}`
              : 'votre mot de passe'}{' '}
            ? Cette action ne peut pas être annulée.
            <Box component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
              Assurez-vous d&apos;avoir copié et enregistré le nouveau mot de passe dans un endroit
              sécurisé avant de confirmer.
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmationDialog} sx={{ color: '#1e293b' }}>
            Annuler
          </Button>
          <Button onClick={handleConfirmReset} variant="contained" color="primary" autoFocus>
            Confirmer la réinitialisation
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SecurityTab;
