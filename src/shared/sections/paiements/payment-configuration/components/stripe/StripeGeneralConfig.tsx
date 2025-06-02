// Path: src/shared/sections/paiements/payment-configuration/components/stripe/StripeGeneralConfig.tsx

'use client';

import { z } from 'zod';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import { Save as SaveIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Box,
  Grid,
  Alert,
  Button,
  useTheme,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';

import { toast } from 'src/shared/components/snackbar';

import { SecretKeyInput } from '../shared/SecretKeyInput';
import { PaymentStatusCard } from '../shared/PaymentStatusCard';
import { PaymentModeSelector } from '../shared/PaymentModeSelector';

import type { StripeConfig } from '../../types/payment.types';

// Form validation schema
const stripeConfigSchema = z.object({
  active: z.boolean(),
  mode: z.enum(['live', 'sandbox']),
  liveSecretKey: z
    .string()
    .refine((val) => !val || val.startsWith('sk_live_'), 'La clé live doit commencer par sk_live_'),
  sandboxSecretKey: z
    .string()
    .refine(
      (val) => !val || val.startsWith('sk_test_'),
      'La clé sandbox doit commencer par sk_test_'
    ),
});

type StripeConfigFormData = z.infer<typeof stripeConfigSchema>;

interface StripeGeneralConfigProps {
  stripeConfig?: StripeConfig;
  loading?: boolean;
  error?: string | null;
  onSave: (config: StripeConfig) => Promise<void>;
  onReset?: () => void;
}

export const StripeGeneralConfig: React.FC<StripeGeneralConfigProps> = ({
  stripeConfig,
  loading = false,
  error = null,
  onSave,
  onReset,
}) => {
  const theme = useTheme();

  const methods = useForm<StripeConfigFormData>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: {
      active: false,
      mode: 'sandbox',
      liveSecretKey: '',
      sandboxSecretKey: '',
    },
  });

  const {
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = methods;

  const watchedValues = watch();

  // Load data when available
  useEffect(() => {
    if (stripeConfig) {
      setValue('active', stripeConfig.active);
      setValue('mode', stripeConfig.mode);
      setValue('liveSecretKey', stripeConfig.liveSecretKey || '');
      setValue('sandboxSecretKey', stripeConfig.sandboxSecretKey || '');
    }
  }, [stripeConfig, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const configToSave: StripeConfig = {
        ...stripeConfig,
        active: data.active,
        mode: data.mode,
        liveSecretKey: data.liveSecretKey,
        sandboxSecretKey: data.sandboxSecretKey,
      };

      await onSave(configToSave);
      toast.success('Configuration Stripe mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration Stripe');
    }
  });

  const handleReset = () => {
    if (stripeConfig) {
      reset({
        active: stripeConfig.active,
        mode: stripeConfig.mode,
        liveSecretKey: stripeConfig.liveSecretKey || '',
        sandboxSecretKey: stripeConfig.sandboxSecretKey || '',
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
            Chargement de la configuration Stripe...
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
                  Configuration de paiement Stripe
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Configurez votre intégration Stripe pour accepter les paiements en ligne
                </Typography>
              </Box>
            </Grid>

            {/* Status Card */}
            <Grid item xs={12} md={6}>
              <PaymentStatusCard
                title="État du module Stripe"
                description={
                  watchedValues.active
                    ? 'Stripe est actuellement activé pour traiter les paiements'
                    : 'Stripe est désactivé - aucun paiement ne sera traité'
                }
                isActive={watchedValues.active}
                onToggle={(active) => setValue('active', active)}
                showModeChip
                mode={watchedValues.mode}
              />
            </Grid>

            {/* Payment Mode Selector */}
            <Grid item xs={12} md={6}>
              <PaymentModeSelector
                value={watchedValues.mode}
                onChange={(mode) => setValue('mode', mode)}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Secret Keys Configuration */}
            <Grid item xs={12}>
              <SecretKeyInput
                liveSecretKey={watchedValues.liveSecretKey}
                sandboxSecretKey={watchedValues.sandboxSecretKey}
                currentMode={watchedValues.mode}
                onLiveKeyChange={(key) => setValue('liveSecretKey', key)}
                onSandboxKeyChange={(key) => setValue('sandboxSecretKey', key)}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Information Card */}
            <Grid item xs={12}>
              <Alert
                severity="info"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' },
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Informations importantes sur Stripe
                </Typography>
                <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                  <li>
                    <Typography variant="body2">
                      Utilisez le mode <strong>Sandbox</strong> pour les tests de développement
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Le mode <strong>Live</strong> traite les vrais paiements avec votre clé de
                      production
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Vos clés secrètes sont stockées de manière sécurisée et chiffrée
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Retrouvez vos clés dans votre tableau de bord Stripe
                    </Typography>
                  </li>
                </Box>
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
