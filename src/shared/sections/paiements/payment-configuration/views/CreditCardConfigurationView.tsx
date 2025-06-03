// Path: src/shared/sections/paiements/payment-configuration/views/CreditCardConfigurationView.tsx

'use client';

import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Chip,
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
  Skeleton,
  IconButton,
  Autocomplete,
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

// Card brands options
const CARD_BRANDS = [
  'Visa',
  'Mastercard',
  'American Express',
  'Discover',
  'JCB',
  'Diners Club',
  'UnionPay',
  'Maestro',
];

// 3D Secure options
const THREEDS_OPTIONS = [
  { value: 'REQUIRED', label: '3D Secure requis', description: 'Selon les règles bancaires' },
  { value: 'ALWAYS', label: 'Toujours activer', description: 'Force sur tous les paiements' },
];

// Form validation schema
const creditCardConfigSchema = z.object({
  active: z.boolean(),
  title: z.string().min(1, 'Titre est requis'),
  allowedBrands: z.array(z.string()),
  disabledBrands: z.array(z.string()),
  vaulting: z.boolean(),
  threeDSecure: z.enum(['REQUIRED', 'ALWAYS']),
  displayLogos: z.boolean(),
});

type CreditCardConfigFormData = z.infer<typeof creditCardConfigSchema>;

export default function CreditCardConfigurationView() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const methods = useForm<CreditCardConfigFormData>({
    resolver: zodResolver(creditCardConfigSchema),
    defaultValues: {
      active: false,
      title: 'Carte bancaire',
      allowedBrands: ['Visa', 'Mastercard'],
      disabledBrands: [],
      vaulting: false,
      threeDSecure: 'REQUIRED',
      displayLogos: true,
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
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    try {
      // API call would go here
      console.log('Saving Credit Card config:', data);
      toast.success('Configuration carte bancaire mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration carte bancaire');
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
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
            </Grid>
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
        title="Configuration Cartes Bancaires"
        description="Configurez les options de paiement par carte bancaire avec sécurité avancée et personnalisation complète"
        icon="fas fa-credit-card"
        isConfigured={!!watchedValues.title}
        isActive={watchedValues.active}
        variant="primary"
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
                                ? 'Paiement par carte activé'
                                : 'Paiement par carte désactivé'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {watchedValues.active
                                ? 'Les clients peuvent payer par carte bancaire'
                                : 'Le paiement par carte est indisponible'}
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
                        placeholder="ex: Carte bancaire"
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

                    {/* Display Logos */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={watchedValues.displayLogos}
                            onChange={(e) => setValue('displayLogos', e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Afficher les logos des cartes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Montrer les logos des marques de cartes acceptées
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                      />
                    </Box>
                  </Stack>
                </ConfigurationCard>
              </Grid>

              {/* Preview Card */}
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
                      <FontAwesome icon="fas fa-credit-card" width={20} sx={{ mr: 1.5 }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {watchedValues.title || 'Carte bancaire'}
                      </Typography>
                      {watchedValues.active && (
                        <Chip
                          label="ACTIF"
                          color="success"
                          size="small"
                          sx={{ ml: 'auto', fontSize: '0.7rem', height: 20 }}
                        />
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Paiement sécurisé par carte bancaire
                    </Typography>

                    {/* Display card logos if enabled */}
                    {watchedValues.displayLogos && watchedValues.allowedBrands.length > 0 && (
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {watchedValues.allowedBrands.slice(0, 4).map((brand) => (
                          <Chip
                            key={brand}
                            label={brand}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 22,
                              borderColor: 'divider',
                              color: 'text.secondary',
                            }}
                          />
                        ))}
                        {watchedValues.allowedBrands.length > 4 && (
                          <Chip
                            label={`+${watchedValues.allowedBrands.length - 4}`}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 22,
                              borderColor: 'divider',
                              color: 'text.secondary',
                            }}
                          />
                        )}
                      </Stack>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Aperçu de ce que verront vos clients lors du paiement
                  </Typography>
                </ConfigurationCard>
              </Grid>

              {/* Card Brands Management */}
              <Grid item xs={12} md={6}>
                <ConfigurationCard
                  title="Marques de cartes acceptées"
                  icon="fas fa-credit-card"
                  variant="success"
                >
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Marques autorisées
                      </Typography>
                      <Autocomplete
                        multiple
                        value={watchedValues.allowedBrands || []}
                        onChange={(_, newValue) =>
                          setValue('allowedBrands', newValue, { shouldDirty: true })
                        }
                        options={CARD_BRANDS}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) => option === value}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              label={option}
                              size="small"
                              color="success"
                              variant="filled"
                              sx={{ m: 0.5 }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Sélectionner les marques..."
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <Box sx={{ mr: 1 }}>
                                    <FontAwesome icon="fas fa-check-circle" width={16} />
                                  </Box>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                        sx={{ width: '100%' }}
                      />
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Marques désactivées
                      </Typography>
                      <Autocomplete
                        multiple
                        value={watchedValues.disabledBrands || []}
                        onChange={(_, newValue) =>
                          setValue('disabledBrands', newValue, { shouldDirty: true })
                        }
                        options={CARD_BRANDS}
                        getOptionLabel={(option) => option}
                        isOptionEqualToValue={(option, value) => option === value}
                        renderTags={(tagValue, getTagProps) =>
                          tagValue.map((option, index) => (
                            <Chip
                              {...getTagProps({ index })}
                              key={option}
                              label={option}
                              size="small"
                              color="error"
                              variant="filled"
                              sx={{ m: 0.5 }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Sélectionner les marques à désactiver..."
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <Box sx={{ mr: 1 }}>
                                    <FontAwesome icon="fas fa-ban" width={16} />
                                  </Box>
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                          />
                        )}
                        sx={{ width: '100%' }}
                      />
                    </Box>
                  </Stack>
                </ConfigurationCard>
              </Grid>

              {/* Security Settings */}
              <Grid item xs={12} md={6}>
                <ConfigurationCard
                  title="Paramètres de sécurité"
                  icon="fas fa-shield-alt"
                  variant="warning"
                >
                  <Stack spacing={3}>
                    {/* Vaulting */}
                    <Box>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={watchedValues.vaulting}
                            onChange={(e) => setValue('vaulting', e.target.checked)}
                            color="warning"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              Stockage sécurisé (Vaulting)
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Sauvegarder les cartes pour faciliter les futurs paiements
                            </Typography>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0, alignItems: 'flex-start' }}
                      />
                    </Box>

                    {/* 3D Secure */}
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Configuration 3D Secure
                      </Typography>
                      <FormControl fullWidth>
                        <Select
                          value={watchedValues.threeDSecure}
                          onChange={(e) =>
                            setValue('threeDSecure', e.target.value as 'REQUIRED' | 'ALWAYS')
                          }
                          sx={{ borderRadius: 2 }}
                        >
                          {THREEDS_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <FontAwesome
                                  icon={
                                    option.value === 'REQUIRED'
                                      ? 'fas fa-shield-alt'
                                      : 'fas fa-shield-virus'
                                  }
                                  width={18}
                                />
                                <Box>
                                  <Typography variant="body2" fontWeight={500}>
                                    {option.label}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {option.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>
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
                    À propos du paiement par carte bancaire
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-shield-alt"
                          width={16}
                          sx={{ mt: 0.2, color: 'success.main' }}
                        />
                        <Typography variant="body2">
                          Le <strong>3D Secure</strong> ajoute une couche de sécurité supplémentaire
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-vault"
                          width={16}
                          sx={{ mt: 0.2, color: 'info.main' }}
                        />
                        <Typography variant="body2">
                          Le <strong>Vaulting</strong> améliore l&apos;expérience client pour les
                          achats récurrents
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-credit-card"
                          width={16}
                          sx={{ mt: 0.2, color: 'primary.main' }}
                        />
                        <Typography variant="body2">
                          Vous pouvez <strong>personnaliser</strong> les marques de cartes acceptées
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <FontAwesome
                          icon="fas fa-eye"
                          width={16}
                          sx={{ mt: 0.2, color: 'warning.main' }}
                        />
                        <Typography variant="body2">
                          L&apos;<strong>aperçu</strong> montre ce que verront vos clients
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-lock"
                          width={16}
                          sx={{ mt: 0.2, color: 'error.main' }}
                        />
                        <Typography variant="body2">
                          Toutes les transactions sont <strong>chiffrées</strong> et sécurisées
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <FontAwesome
                          icon="fas fa-chart-line"
                          width={16}
                          sx={{ mt: 0.2, color: 'success.main' }}
                        />
                        <Typography variant="body2">
                          Suivi en temps réel des <strong>transactions</strong> et des performances
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
