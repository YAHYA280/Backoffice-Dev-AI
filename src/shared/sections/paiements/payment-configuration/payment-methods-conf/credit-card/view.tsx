'use client';

import type { ICreditCardConfig } from 'src/contexts/types/payment';

import { z } from 'zod';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
// Icons
import {
  Check as CheckIcon,
  Refresh as RefreshIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  Grid,
  Alert,
  Select,
  Button,
  Switch,
  MenuItem,
  useTheme,
  Typography,
  FormControl,
  CardContent,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { updateCreditCardConfig, useGetCreditCardConfig } from 'src/utils/payment';

import { toast } from 'src/shared/components/snackbar';
import { RHFTextField } from 'src/shared/components/hook-form';
import { RHFAutocomplete } from 'src/shared/components/hook-form/rhf-autocomplete';

// Options constantes
const CARD_OPTIONS = [
  'Visa',
  'Mastercard',
  'American Express',
  'Discover',
  'JCB',
  'Diners Club',
  'UnionPay',
  'Maestro',
];

// Schéma de validation
const creditCardConfSchema = z.object({
  active: z.boolean(),
  title: z.string().min(1, 'Titre est requis'),
  logos: z.array(z.string()),
  disabledCreditCards: z.array(z.string()),
  vaulting: z.boolean(),
  contingencyFor3DSecure: z.string(),
});

type CreditCardConfigSchema = z.infer<typeof creditCardConfSchema>;

export default function AdvancedCardProcessingForm() {
  const theme = useTheme();
  const mdUp = useResponsive('up', 'md');

  // Fetch configuration data
  const { creditCardConfigData, creditCardConfigError, creditCardConfigLoading } =
    useGetCreditCardConfig();

  const methods = useForm<CreditCardConfigSchema>({
    resolver: zodResolver(creditCardConfSchema),
    defaultValues: {
      active: false,
      title: '',
      logos: [],
      disabledCreditCards: [],
      vaulting: false,
      contingencyFor3DSecure: 'REQUIRED',
    },
  });

  const {
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, isDirty },
  } = methods;

  const isActive = watch('active');

  // Set form values when data is fetched
  useEffect(() => {
    if (creditCardConfigData) {
      setValue('active', creditCardConfigData.active || false);
      setValue('title', creditCardConfigData.title || '');
      setValue('logos', creditCardConfigData.logos || []);
      setValue('disabledCreditCards', creditCardConfigData.disabledCreditCards || []);
      setValue('vaulting', creditCardConfigData.vaulting || false);
      setValue('contingencyFor3DSecure', creditCardConfigData.contingencyFor3DSecure || 'REQUIRED');
    }
  }, [creditCardConfigData, setValue]);

  const onSubmit = async (data: CreditCardConfigSchema) => {
    try {
      await updateCreditCardConfig({
        ...creditCardConfigData,
        ...data,
      } as ICreditCardConfig);
      toast.success('La configuration du mode carte bancaire a été mise à jour avec succès');
    } catch (error) {
      toast.error('Échec de la mise à jour de la configuration. Veuillez réessayer plus tard.');
    }
  };

  const handleReset = () => {
    if (creditCardConfigData) {
      reset({
        active: creditCardConfigData.active || false,
        title: creditCardConfigData.title || '',
        logos: creditCardConfigData.logos || [],
        disabledCreditCards: creditCardConfigData.disabledCreditCards || [],
        vaulting: creditCardConfigData.vaulting || false,
        contingencyFor3DSecure: creditCardConfigData.contingencyFor3DSecure || 'REQUIRED',
      });
    }
  };

  // Loading state
  if (creditCardConfigLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
        }}
      >
        <CircularProgress color="primary" size={56} />
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
          Chargement de la configuration...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (creditCardConfigError) {
    return (
      <Alert
        severity="error"
        variant="filled"
        sx={{
          mt: 2,
          borderRadius: 1.5,
          boxShadow: theme.shadows[3],
        }}
      >
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Erreur de chargement
        </Typography>
        <Typography variant="body2">
          Impossible de charger la configuration du mode carte bancaire. Veuillez réessayer plus
          tard.
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          sx={{ mt: 2 }}
          variant="contained"
          color="error"
          onClick={() => window.location.reload()}
        >
          Actualiser la page
        </Button>
      </Alert>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {/* General Configuration */}
            <Grid>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AssignmentIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Paramètres généraux
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                        Titre affiché au client
                      </Typography>
                      <RHFTextField
                        name="title"
                        placeholder="ex: Carte bancaire"
                        fullWidth
                        variant="outlined"
                        size="medium"
                        InputProps={{
                          sx: {
                            borderRadius: 1,
                            backgroundColor: theme.palette.background.paper,
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                        Afficher le logo des cartes de crédit suivantes
                      </Typography>
                      <RHFAutocomplete
                        name="logos"
                        placeholder="+ Logo"
                        multiple
                        freeSolo
                        disableCloseOnSelect
                        options={CARD_OPTIONS}
                        renderTags={(selected, getTagProps) =>
                          selected.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              label={option}
                              size="small"
                              color="info"
                              variant="soft"
                            />
                          ))
                        }
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            {/* Card Options */}
            <Grid>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
                  mt: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SettingsIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Restrictions de cartes
                    </Typography>
                  </Box>

                  <Typography variant="subtitle2" gutterBottom fontWeight={500}>
                    Désactiver des cartes de crédit spécifiques
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Sélectionnez les types de cartes que vous ne souhaitez pas accepter
                  </Typography>

                  <RHFAutocomplete
                    name="disabledCreditCards"
                    placeholder="+ Carte de Crédit"
                    multiple
                    freeSolo
                    disableCloseOnSelect
                    options={CARD_OPTIONS}
                    renderTags={(selected, getTagProps) =>
                      selected.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                          size="small"
                          color="error"
                          variant="soft"
                        />
                      ))
                    }
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Status Card */}
            <Grid>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isActive ? 'success.lighter' : 'warning.lighter',
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={isActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                        color={isActive ? 'success' : 'warning'}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          mr: 1.5,
                          borderRadius: 1,
                        }}
                      />
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        color={isActive ? 'success.dark' : 'warning.dark'}
                      >
                        État du module de paiement
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isActive}
                          onChange={(e) => setValue('active', e.target.checked)}
                          color="default"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#fff',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: 'rgba(255, 255, 255, 0.5)',
                            },
                          }}
                        />
                      }
                      label=""
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color={isActive ? 'success.dark' : 'warning.dark'}
                    sx={{ opacity: 0.8 }}
                  >
                    {isActive
                      ? 'Le paiement par carte bancaire est actuellement proposé à vos clients.'
                      : "Ce mode de paiement n'est pas visible pour vos clients actuellement."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {/* Security Options */}
            <Grid>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
                  mt: 3,
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SecurityIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Options de sécurité
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                          Vaulting
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Stocker en toute sécurité les cartes de crédit de vos clients pour une
                          expérience fluide
                        </Typography>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={watch('vaulting')}
                              onChange={(e) => setValue('vaulting', e.target.checked)}
                            />
                          }
                          label={watch('vaulting') ? 'Activé' : 'Désactivé'}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                        3D Secure
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Le 3D Secure offre une vérification renforcée pour plus de sécurité
                      </Typography>
                      <FormControl fullWidth variant="outlined" size="medium" sx={{ mt: 1 }}>
                        <Controller
                          name="contingencyFor3DSecure"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              fullWidth
                              sx={{
                                borderRadius: 1,
                                backgroundColor: theme.palette.background.paper,
                              }}
                            >
                              <MenuItem value="REQUIRED">3D Secure requis</MenuItem>
                              <MenuItem value="ALWAYS">Toujours utiliser 3D Secure</MenuItem>
                              <MenuItem value="NEVER">Ne jamais utiliser 3D Secure</MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleReset}
            startIcon={<RefreshIcon />}
            disabled={!isDirty}
          >
            Réinitialiser
          </Button>

          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            startIcon={<CheckIcon />}
          >
            Enregistrer
          </LoadingButton>
        </Box>
      </form>
    </FormProvider>
  );
}
