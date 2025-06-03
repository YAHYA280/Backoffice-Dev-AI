// Path: src/shared/sections/paiements/payment-configuration/views/BankTransferConfigurationView.tsx

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
  Alert,
  Button,
  Switch,
  TextField,
  Typography,
  Skeleton,
  IconButton,
  FormControlLabel,
  alpha,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { FontAwesome } from 'src/shared/components/fontawesome';
import { toast } from 'src/shared/components/snackbar';

import { PaymentConfigLayout } from '../components/common/PaymentConfigLayout';
import { PaymentConfigHeader } from '../components/common/PaymentConfigHeader';
import { ConfigurationCard } from '../components/common/ConfigurationCard';
import { BankAccountsManager } from '../components/bank-transfer/BankAccountsManager';

import type { BankAccount } from '../types/payment.types';

// Form validation schema
const bankTransferConfigSchema = z.object({
  active: z.boolean(),
  title: z.string().min(1, 'Titre est requis'),
  description: z.string().min(1, 'Description est requise'),
  instructions: z.string().optional(),
  showAccountDetails: z.boolean(),
});

type BankTransferConfigFormData = z.infer<typeof bankTransferConfigSchema>;

export default function BankTransferConfigurationView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: '1',
      accountName: 'Compte Principal',
      bankName: 'BNP Paribas',
      accountNumber: '12345678901',
      iban: 'FR76 3000 1007 9410 0000 0000 123',
      swift: 'BNPAFRPP',
      currency: 'EUR',
      isDefault: true,
    },
  ]);

  const methods = useForm<BankTransferConfigFormData>({
    resolver: zodResolver(bankTransferConfigSchema),
    defaultValues: {
      active: false,
      title: 'Virement bancaire',
      description:
        "Effectuez le paiement directement depuis votre compte bancaire. Veuillez indiquer l'ID de votre commande en référence.",
      instructions:
        "Effectuez le paiement directement depuis votre compte bancaire. Veuillez indiquer l'ID de votre commande en référence.",
      showAccountDetails: true,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, isDirty, errors },
  } = methods;

  const watchedValues = watch();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // API call would go here
      console.log('Saving Bank Transfer config:', data, 'Bank Accounts:', bankAccounts);
      toast.success('Configuration virement bancaire mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration virement bancaire');
    }
  });

  const handleReturn = () => {
    router.push(paths.dashboard.paiements.payment_configuration);
  };

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
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
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
        title="Configuration Virements Bancaires"
        description="Configurez vos comptes bancaires pour recevoir les paiements par virement directement"
        icon="fas fa-university"
        isConfigured={bankAccounts.length > 0}
        isActive={watchedValues.active}
        variant="success"
      />

      <Box sx={{ p: 4 }}>
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} noValidate>
            <Grid container spacing={3}>
              {/* General Settings */}
              <Grid item xs={12} md={6}>
                <ConfigurationCard title="Paramètres généraux" icon="fas fa-cog" variant="primary">
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
                              {watchedValues.active
                                ? 'Virement bancaire activé'
                                : 'Virement bancaire désactivé'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {watchedValues.active
                                ? 'Les clients peuvent payer par virement bancaire'
                                : 'Le paiement par virement est indisponible'}
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                      />
                    </Box>

                    {/* Title */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Titre affiché au client
                      </Typography>
                      <TextField
                        {...register('title')}
                        fullWidth
                        placeholder="ex: Virement bancaire"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        InputProps={{
                          startAdornment: (
                            <Box sx={{ mr: 1 }}>
                              <FontAwesome icon="fas fa-tag" width={16} />
                            </Box>
                          ),
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Box>

                    {/* Description */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Description du mode de paiement
                      </Typography>
                      <TextField
                        {...register('description')}
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="ex: Effectuez le paiement directement depuis votre compte bancaire"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        InputProps={{
                          sx: { borderRadius: 2 },
                        }}
                      />
                    </Box>

                    {/* Show Account Details */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={watchedValues.showAccountDetails}
                            onChange={(e) => setValue('showAccountDetails', e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Afficher les détails du compte
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Montrer les informations bancaires au client
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                      />
                    </Box>
                  </Stack>
                </ConfigurationCard>
              </Grid>

              {/* Preview */}
              <Grid item xs={12} md={6}>
                <ConfigurationCard title="Aperçu client" icon="fas fa-eye" variant="info">
                  <Box
                    sx={{
                      p: 3,
                      border: '2px dashed',
                      borderColor: watchedValues.active ? '#4CAF50' : 'divider',
                      borderRadius: 2,
                      bgcolor: watchedValues.active ? alpha('#4CAF50', 0.05) : 'background.neutral',
                      transition: 'all 0.2s ease-in-out',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <FontAwesome icon="fas fa-university" width={20} sx={{ mr: 1.5 }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {watchedValues.title || 'Virement bancaire'}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {watchedValues.description}
                    </Typography>

                    {watchedValues.showAccountDetails && bankAccounts.length > 0 && (
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'background.paper',
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="caption" fontWeight={600} gutterBottom>
                          Coordonnées bancaires:
                        </Typography>
                        {bankAccounts
                          .filter((acc) => acc.isDefault)
                          .map((account) => (
                            <Box key={account.id}>
                              <Typography variant="caption" display="block">
                                IBAN: {account.iban}
                              </Typography>
                              <Typography variant="caption" display="block">
                                BIC: {account.swift}
                              </Typography>
                            </Box>
                          ))}
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aperçu de ce que verront vos clients lors du paiement
                  </Typography>
                </ConfigurationCard>
              </Grid>

              {/* Instructions */}
              <Grid item xs={12}>
                <ConfigurationCard
                  title="Instructions de paiement"
                  icon="fas fa-clipboard-list"
                  variant="warning"
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Instructions qui seront ajoutées à la page de remerciement et aux emails
                    </Typography>
                    <TextField
                      {...register('instructions')}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="ex: Effectuez le paiement directement depuis votre compte bancaire. Veuillez indiquer l'ID de votre commande en référence."
                      InputProps={{
                        sx: { borderRadius: 2 },
                      }}
                    />
                  </Box>
                </ConfigurationCard>
              </Grid>

              {/* Bank Accounts Management */}
              <Grid item xs={12}>
                <BankAccountsManager accounts={bankAccounts} onAccountsChange={setBankAccounts} />
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
                    Informations importantes sur les virements bancaires
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-clock"
                          width={16}
                          sx={{ mt: 0.2, color: 'warning.main' }}
                        />
                        <Typography variant="body2">
                          Les virements nécessitent généralement{' '}
                          <strong>1-3 jours ouvrables</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-shield-alt"
                          width={16}
                          sx={{ mt: 0.2, color: 'success.main' }}
                        />
                        <Typography variant="body2">
                          Vérifiez que les <strong>informations bancaires</strong> sont correctes
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-globe"
                          width={16}
                          sx={{ mt: 0.2, color: 'info.main' }}
                        />
                        <Typography variant="body2">
                          Configurez <strong>plusieurs comptes</strong> pour différentes devises
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <FontAwesome
                          icon="fas fa-star"
                          width={16}
                          sx={{ mt: 0.2, color: 'primary.main' }}
                        />
                        <Typography variant="body2">
                          Le compte <strong>principal</strong> sera affiché en priorité
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
                color="success"
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
