'use client';

import type { SelectChangeEvent } from '@mui/material';

import { fr } from 'date-fns/locale';
import React, { useState } from 'react';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  Box,
  Card,
  Paper,
  Radio,
  Stack,
  Alert,
  Button,
  Select,
  Divider,
  MenuItem,
  Snackbar,
  Container,
  Typography,
  RadioGroup,
  FormControl,
  CardContent,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

// Types pour les options de fréquence
type FrequencyOption = 'realtime' | 'daily' | 'weekly';
type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

const FrequencyNotifications = () => {
  // État pour la sélection de fréquence et les paramètres
  const [frequency, setFrequency] = useState<FrequencyOption>('realtime');
  const [dailyTime, setDailyTime] = useState<Date | null>(new Date(new Date().setHours(9, 0, 0, 0)));
  const [weeklyDay, setWeeklyDay] = useState<number>(5); // Vendredi par défaut
  const [weeklyTime, setWeeklyTime] = useState<Date | null>(new Date(new Date().setHours(9, 0, 0, 0)));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertSeverity>('success');

  // Options pour les jours de la semaine
  const weekDays = [
    { value: 1, label: 'Lundi' },
    { value: 2, label: 'Mardi' },
    { value: 3, label: 'Mercredi' },
    { value: 4, label: 'Jeudi' },
    { value: 5, label: 'Vendredi' },
    { value: 6, label: 'Samedi' },
    { value: 0, label: 'Dimanche' }
  ];

  // Gestion du changement de fréquence
  const handleFrequencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFrequency(event.target.value as FrequencyOption);
  };

  // Gestion du changement de jour pour le résumé hebdomadaire
  const handleWeeklyDayChange = (event: SelectChangeEvent<number>) => {
    setWeeklyDay(Number(event.target.value));
  };

  // Sauvegarde des paramètres
  const handleSave = () => {
    // Ici, vous ajouteriez la logique pour sauvegarder les paramètres
    // vers votre backend ou votre état global
    
    setSnackbarMessage('Vos préférences de fréquence ont été enregistrées avec succès');
    setSnackbarSeverity('success');
    setOpenSnackbar(true);
  };

  // Remise à l'état initial (annulation)
  const handleCancel = () => {
    // Réinitialiser à l'état précédent
    setFrequency('realtime');
    setDailyTime(new Date(new Date().setHours(9, 0, 0, 0)));
    setWeeklyDay(5);
    setWeeklyTime(new Date(new Date().setHours(9, 0, 0, 0)));
    
    setSnackbarMessage('Modifications annulées');
    setSnackbarSeverity('info');
    setOpenSnackbar(true);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* En-tête de la page */}
        <Box mb={4}>
          <Button
            component={RouterLink}
            href={paths.dashboard.profile.notifications}
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Retour aux notifications
          </Button>
          
          <Box display="flex" alignItems="center" mb={1}>
            <AccessTimeIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Fréquence des notifications
            </Typography>
          </Box>
          
          <Typography variant="subtitle1" color="text.secondary">
            Définissez la fréquence à laquelle vous souhaitez recevoir vos notifications.
          </Typography>
          
          <Divider sx={{ my: 3 }} />
        </Box>

        {/* Section principale */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
              Définir la fréquence des notifications
            </Typography>
            
            <Typography variant="body1" paragraph color="text.secondary">
              Choisissez parmi les options suivantes pour déterminer la fréquence de réception de vos notifications.
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <RadioGroup
                aria-label="frequency"
                name="frequency-options"
                value={frequency}
                onChange={handleFrequencyChange}
              >
                {/* Option En Temps Réel */}
                <Paper
                  elevation={frequency === 'realtime' ? 3 : 1}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: t => `1px solid ${frequency === 'realtime' ? t.palette.primary.main : t.palette.divider}`,
                    borderRadius: 1
                  }}
                >
                  <FormControlLabel
                    value="realtime"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6" component="span">
                          En Temps Réel
                        </Typography>
                        <Typography variant="body2" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                          Recevez les notifications dès qu&apos;elles sont générées
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                          <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                          Idéal pour rester constamment informé des événements importants
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                </Paper>

                {/* Option Résumé Quotidien */}
                <Paper
                  elevation={frequency === 'daily' ? 3 : 1}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: t => `1px solid ${frequency === 'daily' ? t.palette.primary.main : t.palette.divider}`,
                    borderRadius: 1
                  }}
                >
                  <FormControlLabel
                    value="daily"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6" component="span">
                          Résumé Quotidien
                        </Typography>
                        <Typography variant="body2" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                          Recevez un résumé de toutes les notifications une fois par jour
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                  
                  {frequency === 'daily' && (
                    <Box sx={{ pl: 4, pt: 2 }}>
                      <Typography variant="body2" component="label" display="block" gutterBottom>
                        Heure d&apos;envoi:
                      </Typography>
                      <TimePicker
                        value={dailyTime}
                        onChange={(newValue) => setDailyTime(newValue)}
                        ampm={false}
                        sx={{ width: { xs: '100%', sm: '200px' } }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                        Idéal pour rester informé sans être dérangé trop souvent
                      </Typography>
                    </Box>
                  )}
                </Paper>

                {/* Option Résumé Hebdomadaire */}
                <Paper
                  elevation={frequency === 'weekly' ? 3 : 1}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: t => `1px solid ${frequency === 'weekly' ? t.palette.primary.main : t.palette.divider}`,
                    borderRadius: 1
                  }}
                >
                  <FormControlLabel
                    value="weekly"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="h6" component="span">
                          Résumé Hebdomadaire
                        </Typography>
                        <Typography variant="body2" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                          Recevez un résumé de toutes les notifications une fois par semaine
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', m: 0 }}
                  />
                  
                  {frequency === 'weekly' && (
                    <Box sx={{ pl: 4, pt: 2 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                        <Box>
                          <Typography variant="body2" component="label" display="block" gutterBottom>
                            Jour de la semaine:
                          </Typography>
                          <Select
                            value={weeklyDay}
                            onChange={handleWeeklyDayChange}
                            sx={{ width: { xs: '100%', sm: '200px' } }}
                          >
                            {weekDays.map((day) => (
                              <MenuItem key={day.value} value={day.value}>
                                {day.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                        
                        <Box>
                          <Typography variant="body2" component="label" display="block" gutterBottom>
                            Heure d&apos;envoi:
                          </Typography>
                          <TimePicker
                            value={weeklyTime}
                            onChange={(newValue) => setWeeklyTime(newValue)}
                            ampm={false}
                            sx={{ width: { xs: '100%', sm: '200px' } }}
                          />
                        </Box>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                        Parfait pour les informations non urgentes
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: 2,
            mt: 3,
            mb: 4 
          }}
        >
          <Button variant="outlined" onClick={handleCancel}>
            Annuler
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSave}
          >
            Enregistrer les modifications
          </Button>
        </Box>

        {/* Notification de réussite ou d'échec */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default FrequencyNotifications;