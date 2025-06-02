// Path: src/shared/sections/paiements/payment-configuration/components/stripe/StripeCreditCardConfig.tsx

'use client';

import { z } from 'zod';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Save as SaveIcon,
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
  Container,
  Typography,
  FormControl,
  CardContent,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { toast } from 'src/shared/components/snackbar';
import { RHFTextField } from 'src/shared/components/hook-form';
import { RHFAutocomplete } from 'src/shared/components/hook-form/rhf-autocomplete';

import { PaymentStatusCard } from '../shared/PaymentStatusCard';
import { PaymentPreviewCard } from '../shared/PaymentPreviewCard';

import type { CreditCardConfig } from '../../types/payment.types';

// Card options
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

// Validation schema
const creditCardConfigSchema = z.object({
  active: z.boolean(),
  title: z.string().min(1, 'Titre est requis'),
  logos: z.array(z.string()),
  disabledCreditCards: z.array(z.string()),
  vaulting: z.boolean(),
  contingencyFor3DSecure: z.enum(['REQUIRED', 'ALWAYS']),
});

type CreditCardConfigFormData = z.infer<typeof creditCardConfigSchema>;

interface StripeCreditCardConfigProps {
  creditCardConfig?: CreditCardConfig;
  loading?: boolean;
  error?: string | null;
  onSave: (config: CreditCardConfig) => Promise<void>;
  onReset?: () => void;
}

export const StripeCreditCardConfig: React.FC<StripeCreditCardConfigProps> = ({
  creditCardConfig,
  loading = false,
  error = null,
  onSave,
  onReset,
}) => {
  const theme = useTheme();

  const methods = useForm<CreditCardConfigFormData>({
    resolver: zodResolver(creditCardConfigSchema),
    defaultValues: {
      active: false,
      title: 'Carte bancaire',
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

  const watchedValues = watch();

  // Set form values when data is fetched
  useEffect(() => {
    if (creditCardConfig) {
      setValue('active', creditCardConfig.active || false);
      setValue('title', creditCardConfig.title || 'Carte bancaire');
      setValue('logos', creditCardConfig.logos || []);
      setValue('disabledCreditCards', creditCardConfig.disabledCreditCards || []);
      setValue('vaulting', creditCardConfig.vaulting || false);
      setValue('contingencyFor3DSecure', creditCardConfig.contingencyFor3DSecure || 'REQUIRED');
    }
  }, [creditCardConfig, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const configToSave: CreditCardConfig = {
        ...creditCardConfig,
        ...data,
      };

      await onSave(configToSave);
      toast.success('Configuration carte bancaire mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration carte bancaire');
    }
  });

  const handleReset = () => {
    if (creditCardConfig) {
      reset({
        active: creditCardConfig.active || false,
        title: creditCardConfig.title || 'Carte bancaire',
        logos: creditCardConfig.logos || [],
        disabledCreditCards: creditCardConfig.disabledCreditCards || [],
        vaulting: creditCardConfig.vaulting || false,
        contingencyFor3DSecure: creditCardConfig.contingencyFor3DSecure || 'REQUIRED',
      });
    }
    onReset?.();
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
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
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg">
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
          <Typography variant="body2">{error}</Typography>
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
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} noValidate autoComplete="off">
          <Grid container spacing={3}>
            {/* Header */}
            <Grid item xs={12}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                  Configuration Carte Bancaire
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Configurez les options de paiement par carte bancaire via Stripe
                </Typography>
              </Box>
            </Grid>

            {/* General Configuration */}
            <Grid item xs={12} md={6}>
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

            {/* Status & Preview */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3} sx={{ height: '100%' }}>
                <Grid item xs={12}>
                  <PaymentStatusCard
                    title="Paiement par carte"
                    description={
                      watchedValues.active
                        ? 'Le paiement par carte bancaire est actuellement proposé à vos clients'
                        : "Ce mode de paiement n'est pas visible pour vos clients actuellement"
                    }
                    isActive={watchedValues.active}
                    onToggle={(active) => setValue('active', active)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <PaymentPreviewCard
                    title={watchedValues.title}
                    description="Paiement sécurisé par carte bancaire"
                    type="credit_card"
                    logos={watchedValues.logos}
                    isActive={watchedValues.active}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Card Restrictions */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
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

            {/* Security Options */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
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
                              checked={watchedValues.vaulting}
                              onChange={(e) => setValue('vaulting', e.target.checked)}
                            />
                          }
                          label={watchedValues.vaulting ? 'Activé' : 'Désactivé'}
                        />
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" fontWeight={500} gutterBottom>
                        3D Secure
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Le 3D Secure est géré automatiquement par les banques pour plus de sécurité
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
                              <MenuItem value="REQUIRED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SecurityIcon fontSize="small" color="primary" />
                                  <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      3D Secure requis
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Appliqué selon les règles de la banque
                                    </Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                              <MenuItem value="ALWAYS">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <SecurityIcon fontSize="small" color="warning" />
                                  <Box>
                                    <Typography variant="body2" fontWeight={500}>
                                      Toujours utiliser 3D Secure
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      Force l&apos;authentification sur tous les paiements
                                    </Typography>
                                  </Box>
                                </Box>
                              </MenuItem>
                            </Select>
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Information */}
            <Grid item xs={12}>
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' },
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  À propos du 3D Secure
                </Typography>
                <Typography variant="body2">
                  Le 3D Secure est un protocole de sécurité géré directement par les banques
                  émettrices des cartes. Stripe applique automatiquement les règles de sécurité
                  appropriées selon la réglementation en vigueur et les exigences de votre secteur
                  d&apos;activité.
                </Typography>
              </Alert>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleReset}
              startIcon={<RefreshIcon />}
              disabled={!isDirty || isSubmitting}
            >
              Réinitialiser
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              startIcon={<SaveIcon />}
              disabled={!isDirty}
            >
              Enregistrer la configuration
            </LoadingButton>
          </Box>
        </form>
      </FormProvider>
    </Container>
  );
};
