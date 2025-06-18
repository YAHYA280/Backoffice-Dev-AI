// Path: src/shared/sections/paiements/payment-configuration/views/StripeConfigurationView.tsx

'use client';

import { z } from 'zod';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Grid,
  Stack,
  Alert,
  Button,
  Switch,
  Select,
  MenuItem,
  TextField,
  Typography,
  FormControl,
  CardContent,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

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
  webhookUrl: z.string().optional(),
  webhookSecret: z.string().optional(),
});

type StripeConfigFormData = z.infer<typeof stripeConfigSchema>;

export default function StripeConfigurationView() {
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showSandboxKey, setShowSandboxKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

  const methods = useForm<StripeConfigFormData>({
    resolver: zodResolver(stripeConfigSchema),
    defaultValues: {
      active: false,
      mode: 'sandbox',
      liveSecretKey: '',
      sandboxSecretKey: '',
      webhookUrl: '',
      webhookSecret: '',
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      // API call would go here
      console.log('Saving Stripe config:', data);
      toast.success('Configuration Stripe mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration Stripe');
    }
  });

  const isLiveKeyValid =
    watchedValues.liveSecretKey.startsWith('sk_live_') && watchedValues.liveSecretKey.length > 20;
  const isSandboxKeyValid =
    watchedValues.sandboxSecretKey.startsWith('sk_test_') &&
    watchedValues.sandboxSecretKey.length > 20;

  return (
    <PaymentConfigLayout>
      <PaymentConfigHeader
        title="Configuration Stripe"
        description="Configurez votre intégration Stripe pour accepter les paiements en ligne de manière sécurisée"
        icon="fab fa-stripe"
        isConfigured={isLiveKeyValid || isSandboxKeyValid}
        isActive={watchedValues.active}
        mode={watchedValues.mode}
        variant="info"
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

              {/* Webhooks Configuration */}
              <Grid item xs={12}>
                <ConfigurationCard
                  title="Configuration des Webhooks"
                  icon="fas fa-webhook"
                  variant="info"
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        URL du Webhook
                      </Typography>
                      <TextField
                        {...register('webhookUrl')}
                        fullWidth
                        placeholder="https://votre-domaine.com/webhook/stripe"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesome icon="fas fa-link" width={16} />
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        URL où Stripe enverra les notifications d&apos;événements
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Secret du Webhook
                      </Typography>
                      <TextField
                        {...register('webhookSecret')}
                        fullWidth
                        type={showWebhookSecret ? 'text' : 'password'}
                        placeholder="whsec_..."
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FontAwesome icon="fas fa-shield-alt" width={16} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                size="small"
                                onClick={() => setShowWebhookSecret(!showWebhookSecret)}
                                sx={{ minWidth: 'auto', p: 0.5 }}
                              >
                                <FontAwesome
                                  icon={showWebhookSecret ? 'fas fa-eye-slash' : 'fas fa-eye'}
                                  width={16}
                                />
                              </Button>
                            </InputAdornment>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Secret pour vérifier l&apos;authenticité des webhooks
                      </Typography>
                    </Grid>
                  </Grid>
                </ConfigurationCard>
              </Grid>

              {/* Information Alert */}
              <Grid item xs={12}>
                <Alert
                  severity="info"
                  icon={<FontAwesome icon="fas fa-info-circle" width={20} />}
                  sx={{
                    borderRadius: 2,
                    '& .MuiAlert-message': { width: '100%' },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Informations importantes sur Stripe
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-flask"
                          width={16}
                          sx={{ mt: 0.2, color: 'warning.main' }}
                        />
                        <Typography variant="body2">
                          Utilisez le mode <strong>Test</strong> pour les développements et tests
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-globe"
                          width={16}
                          sx={{ mt: 0.2, color: 'success.main' }}
                        />
                        <Typography variant="body2">
                          Le mode <strong>Production</strong> traite les vrais paiements
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-shield-alt"
                          width={16}
                          sx={{ mt: 0.2, color: 'info.main' }}
                        />
                        <Typography variant="body2">
                          Vos clés sont stockées de manière sécurisée et chiffrée
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <FontAwesome
                          icon="fas fa-external-link-alt"
                          width={16}
                          sx={{ mt: 0.2, color: 'primary.main' }}
                        />
                        <Typography variant="body2">
                          Retrouvez vos clés dans votre tableau de bord Stripe
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Alert>
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
                color="info"
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
