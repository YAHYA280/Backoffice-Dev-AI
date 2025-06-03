// Path: src/shared/sections/paiements/payment-configuration/views/StripeConfigurationView.tsx

'use client';

import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Grid,
  Stack,
  Button,
  Switch,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  Skeleton,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { FontAwesome } from 'src/shared/components/fontawesome';
import { toast } from 'src/shared/components/snackbar';

import { PaymentConfigLayout } from '../components/common/PaymentConfigLayout';
import { PaymentConfigHeader } from '../components/common/PaymentConfigHeader';
import { ConfigurationCard } from '../components/common/ConfigurationCard';

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

export default function StripeConfigurationView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showSandboxKey, setShowSandboxKey] = useState(false);

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
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty },
  } = methods;

  const watchedValues = watch();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // API call would go here
      console.log('Saving Stripe config:', data);
      toast.success('Configuration Stripe mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration Stripe');
    }
  });

  const handleReturn = () => {
    router.push(paths.dashboard.paiements.payment_configuration);
  };

  const isLiveKeyValid =
    watchedValues.liveSecretKey.startsWith('sk_live_') && watchedValues.liveSecretKey.length > 20;
  const isSandboxKeyValid =
    watchedValues.sandboxSecretKey.startsWith('sk_test_') &&
    watchedValues.sandboxSecretKey.length > 20;

  if (loading) {
    return (
      <PaymentConfigLayout>
        <Box sx={{ p: 4 }}>
          {/* Header Skeleton */}
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3 }} />
          </Box>

          {/* Content Skeleton */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            </Grid>
          </Grid>
        </Box>
      </PaymentConfigLayout>
    );
  }

  return (
    <PaymentConfigLayout>
      {/* Return Button */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Button
          onClick={handleReturn}
          startIcon={<FontAwesome icon="fas fa-arrow-left" width={16} />}
          variant="outlined"
          color="inherit"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
              color: 'primary.main',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Retourner
        </Button>
      </Box>

      <PaymentConfigHeader
        title="Configuration Stripe"
        description="Configurez votre intégration Stripe pour accepter les paiements en ligne de manière sécurisée"
        icon="fab fa-stripe"
        isConfigured={isLiveKeyValid || isSandboxKeyValid}
        isActive={watchedValues.active}
        mode={watchedValues.mode}
        variant="primary"
      />

      <Box sx={{ p: 4 }}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <Grid container spacing={3}>
              {/* Status & Mode Configuration */}
              <Grid item xs={12} md={6}>
                <ConfigurationCard title="État et Mode" icon="fas fa-toggle-on" variant="primary">
                  <Stack spacing={3}>
                    {/* Active Status */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={watchedValues.active}
                            onChange={(e) => setValue('active', e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {watchedValues.active ? 'Stripe Activé' : 'Stripe Désactivé'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {watchedValues.active
                                ? 'Stripe traite actuellement les paiements'
                                : 'Aucun paiement ne sera traité via Stripe'}
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                      />
                    </Box>

                    {/* Mode Selection */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Mode de fonctionnement
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={watchedValues.mode}
                          onChange={(e) => setValue('mode', e.target.value as 'live' | 'sandbox')}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="sandbox">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <FontAwesome icon="fas fa-flask" width={18} />
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  Mode Test (Sandbox)
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pour les tests et le développement
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                          <MenuItem value="live">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <FontAwesome icon="fas fa-globe" width={18} />
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  Mode Production (Live)
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Pour les vrais paiements
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>
                </ConfigurationCard>
              </Grid>

              {/* API Keys Configuration */}
              <Grid item xs={12} md={6}>
                <ConfigurationCard title="Clés API Stripe" icon="fas fa-key" variant="warning">
                  <Stack spacing={3}>
                    {/* Live Secret Key */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Clé secrète de production
                      </Typography>
                      <TextField
                        {...register('liveSecretKey')}
                        fullWidth
                        type={showLiveKey ? 'text' : 'password'}
                        placeholder="sk_live_..."
                        error={watchedValues.liveSecretKey ? !isLiveKeyValid : false}
                        helperText={
                          watchedValues.liveSecretKey && !isLiveKeyValid
                            ? "La clé doit commencer par 'sk_live_'"
                            : ''
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesome icon="fas fa-globe" width={16} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                onClick={() => setShowLiveKey(!showLiveKey)}
                                sx={{ minWidth: 'auto', p: 0.5 }}
                              >
                                <FontAwesome
                                  icon={showLiveKey ? 'fas fa-eye-slash' : 'fas fa-eye'}
                                  width={16}
                                />
                              </Button>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Box>

                    {/* Sandbox Secret Key */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Clé secrète de test
                      </Typography>
                      <TextField
                        {...register('sandboxSecretKey')}
                        fullWidth
                        type={showSandboxKey ? 'text' : 'password'}
                        placeholder="sk_test_..."
                        error={watchedValues.sandboxSecretKey ? !isSandboxKeyValid : false}
                        helperText={
                          watchedValues.sandboxSecretKey && !isSandboxKeyValid
                            ? "La clé doit commencer par 'sk_test_'"
                            : ''
                        }
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesome icon="fas fa-flask" width={16} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                onClick={() => setShowSandboxKey(!showSandboxKey)}
                                sx={{ minWidth: 'auto', p: 0.5 }}
                              >
                                <FontAwesome
                                  icon={showSandboxKey ? 'fas fa-eye-slash' : 'fas fa-eye'}
                                  width={16}
                                />
                              </Button>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Box>
                  </Stack>
                </ConfigurationCard>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<FontAwesome icon="fas fa-undo" width={16} />}
                disabled={!isDirty || isSubmitting}
              >
                Réinitialiser
              </Button>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={isSubmitting}
                startIcon={<FontAwesome icon="fas fa-save" width={16} />}
                disabled={!isDirty}
                color="primary"
              >
                Enregistrer la configuration
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      </Box>
    </PaymentConfigLayout>
  );
}
