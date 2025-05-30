import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faKey,
  faLock,
  faClock,
  faXmark,
  faCheck,
  faEyeSlash,
  faArrowLeft,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Step,
  Alert,
  Paper,
  Button,
  Stepper,
  StepLabel,
  TextField,
  Container,
  Typography,
  IconButton,
  InputAdornment,
  LinearProgress,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { paths } from '../../../../../../routes/paths';

export default function ResetPasswordPage() {
  const router = useRouter();

  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  // New state for password matching
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);

  // Timer state
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [timerExpired, setTimerExpired] = useState(false);

  // Steps for the password reset process
  const steps = ['Vérification', 'Nouveau mot de passe'];

  // Format time for display (MM:SS)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Create masked email (e.g., ****@gmail.com)
  const maskEmail = (emailAddress: string) => {
    if (!emailAddress) return '';
    const [username, domain] = emailAddress.split('@');
    if (!username || !domain) return '';

    // Keep first character and last 2 characters of username visible
    const visiblePrefix = username.charAt(0);
    const visibleSuffix = username.length > 3 ? username.slice(-2) : '';
    const maskedPart = '*'.repeat(Math.max(3, username.length - 3));

    return `${visiblePrefix}${maskedPart}${visibleSuffix}@${domain}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Check if there's a saved timer in sessionStorage
    const savedTimerEndTime = sessionStorage.getItem('resetPasswordTimerEnd');
    const savedTimerActive = sessionStorage.getItem('resetPasswordTimerActive') === 'true';

    if (savedTimerEndTime && savedTimerActive) {
      const endTime = parseInt(savedTimerEndTime, 10);
      const currentTime = Math.floor(Date.now() / 1000);
      const remainingTime = endTime - currentTime;

      if (remainingTime > 0) {
        setTimer(remainingTime);
        setTimerActive(true);
        setTimerExpired(false);
      } else {
        setTimer(0);
        setTimerActive(false);
        setTimerExpired(true);
      }
    }

    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          if (newTimer <= 0) {
            if (interval) clearInterval(interval);
            setTimerActive(false);
            setTimerExpired(true);
            sessionStorage.setItem('resetPasswordTimerActive', 'false');
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  // Initialization effect - fetch user email and set up state
  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userEmail = 'user122@gmail.com'; // Should be replaced with actual API call to get logged in user's email

        // Set the email and create masked version
        setEmail(userEmail);
        setMaskedEmail(maskEmail(userEmail));

        // Start the timer and send verification code
        startTimer();
      } catch (err) {
        setError('Erreur lors du chargement des informations utilisateur');
      }
    };

    fetchUserEmail();
  }, []);

  // Determine which step to show based on the current URL
  useEffect(() => {
    const { pathname } = window.location;

    if (pathname.includes('/reset-password/verification/new_pass')) {
      setActiveStep(1);
    } else {
      setActiveStep(0);
    }
  }, []);

  // Effect to check if passwords match in real-time
  useEffect(() => {
    // Only check if both password fields have content
    if (newPassword && confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else if (confirmPassword) {
      // If confirm password has content but new password is empty
      setPasswordsMatch(false);
    } else {
      // Reset when confirm password is empty
      setPasswordsMatch(null);
    }
  }, [newPassword, confirmPassword]);

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 20;
    return strength;
  };

  // Validate email format
  const validateEmail = (emailAddress: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(emailAddress);
  };

  // Validate verification code (must be 6 digits)
  const validateVerificationCode = (code: string) => /^\d{6}$/.test(code);

  // Validate password requirements
  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push('Minimum 8 caractères');
    if (!/[A-Z]/.test(password)) errors.push('Au moins une lettre majuscule');
    if (!/[a-z]/.test(password)) errors.push('Au moins une lettre minuscule');
    if (!/[0-9]/.test(password)) errors.push('Au moins un chiffre');
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password))
      errors.push('Au moins un caractère spécial');
    return errors;
  };

  // Start the timer and save it to sessionStorage
  const startTimer = () => {
    const endTime = Math.floor(Date.now() / 1000) + 300; // Current time + 5 minutes
    sessionStorage.setItem('resetPasswordTimerEnd', endTime.toString());
    sessionStorage.setItem('resetPasswordTimerActive', 'true');
    setTimer(300);
    setTimerActive(true);
    setTimerExpired(false);
  };

  // Handle verification code submission
  const handleVerificationSubmit = async () => {
    if (timerExpired) {
      setError('Le code de vérification a expiré. Veuillez demander un nouveau code.');
      return;
    }

    if (!validateVerificationCode(verificationCode)) {
      setError('Le code de vérification doit contenir 6 chiffres');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call to verify code
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitting(false);

      // Redirect to new password page
      router.push(`${paths.dashboard.profile.resetPassword}/verification/new_pass`);
    } catch (err) {
      setIsSubmitting(false);
      setError('Code de vérification incorrect. Veuillez réessayer.');
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call to resend verification code
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Restart the timer
      startTimer();

      setIsSubmitting(false);
      setTimerExpired(false);
    } catch (err) {
      setIsSubmitting(false);
      setError("Erreur lors de l'envoi du code de vérification. Veuillez réessayer.");
    }
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validate password requirements
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(', '));
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      // Simulate API call to reset password
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Clear timer and email from sessionStorage
      sessionStorage.removeItem('resetPasswordTimerEnd');
      sessionStorage.removeItem('resetPasswordTimerActive');

      setIsSubmitting(false);
      setSuccess(true);

      // Redirect to dashboard blank page after successful password reset
      setTimeout(() => {
        router.push(paths.dashboard.blank);
      }, 3000);
    } catch (err) {
      setIsSubmitting(false);
      setError('Erreur lors de la réinitialisation du mot de passe. Veuillez réessayer.');
    }
  };

  // Handle back button
  const handleBack = () => {
    if (activeStep === 0) {
      router.push(paths.dashboard.profile.security);
    } else if (activeStep === 1) {
      router.push(paths.dashboard.profile.resetPassword);
    }
  };

  // Update password strength when password changes
  React.useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }} aria-label="retour">
            <FontAwesomeIcon icon={faArrowLeft} />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            <FontAwesomeIcon icon={faLock} style={{ marginRight: '10px' }} />
            Réinitialisation du mot de passe
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Success message */}
        {success ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography
              variant="h5"
              color="success.main"
              sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '10px' }} />
              Mot de passe réinitialisé avec succès!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Vous allez être redirigé vers le tableau de bord dans quelques instants...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Error message if any */}
            <ConditionalComponent isValid={!!error}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </ConditionalComponent>

            {/* Loading indicator */}
            <ConditionalComponent isValid={isSubmitting}>
              <LinearProgress sx={{ mb: 3 }} />
            </ConditionalComponent>

            {/* Step 1: Verification Code */}
            <ConditionalComponent isValid={activeStep === 0}>
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Un code de vérification à six chiffres a été envoyé à
                  <Box component="span" sx={{ fontWeight: 'bold', ml: 1 }}>
                    {maskedEmail}
                  </Box>
                </Typography>

                {/* Timer display */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    color: timerExpired ? 'error.main' : 'info.main',
                  }}
                >
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {timerExpired
                      ? 'Le code a expiré. Veuillez demander un nouveau code.'
                      : `Code valide pendant: ${formatTime(timer)}`}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  required
                  label="Code de vérification"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) =>
                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  inputProps={{ maxLength: 6, inputMode: 'numeric' }}
                  sx={{ mb: 3 }}
                  disabled={timerExpired}
                  error={timerExpired}
                  helperText={timerExpired ? 'Le code a expiré' : ''}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleVerificationSubmit}
                  disabled={isSubmitting || timerExpired}
                  sx={{ py: 1.5 }}
                >
                  Vérifier
                </Button>
                <Button
                  variant="text"
                  color="primary"
                  fullWidth
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                  sx={{ mt: 1 }}
                >
                  Renvoyer le code
                </Button>
              </Box>
            </ConditionalComponent>

            {/* Step 2: New Password */}
            <ConditionalComponent isValid={activeStep === 1}>
              <Box>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Veuillez définir votre nouveau mot de passe.
                </Typography>
                <TextField
                  fullWidth
                  required
                  label="Nouveau mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  helperText="Minimum 8 caractères, avec majuscules, minuscules, chiffres et caractères spéciaux"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faKey} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Password strength indicator */}
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength}
                  color={
                    passwordStrength < 40 ? 'error' : passwordStrength < 60 ? 'warning' : 'success'
                  }
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  required
                  label="Confirmer le mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordsMatch === false}
                  helperText={
                    passwordsMatch === false ? 'Les mots de passe ne correspondent pas' : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FontAwesomeIcon icon={faKey} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {confirmPassword ?
                          (passwordsMatch ? (
                            <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />
                          ) : (
                            <FontAwesomeIcon icon={faXmark} style={{ color: 'red' }} />
                          )) : null}
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handlePasswordReset}
                  disabled={isSubmitting || passwordsMatch === false || !confirmPassword}
                  sx={{ py: 1.5 }}
                >
                  Réinitialiser le mot de passe
                </Button>
              </Box>
            </ConditionalComponent>
          </>
        )}
      </Paper>
    </Container>
  );
}
