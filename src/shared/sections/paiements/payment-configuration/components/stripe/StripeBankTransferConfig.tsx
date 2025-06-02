// Path: src/shared/sections/paiements/payment-configuration/components/stripe/StripeBankTransferConfig.tsx

'use client';

import { z } from 'zod';
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Grid,
  Alert,
  Button,
  useTheme,
  Container,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Assignment as AssignmentIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';

import { toast } from 'src/shared/components/snackbar';
import { RHFTextField } from 'src/shared/components/hook-form';

import { PaymentStatusCard } from '../shared/PaymentStatusCard';
import { PaymentPreviewCard } from '../shared/PaymentPreviewCard';
import BankAccountsManager from '../../payment-methods-conf/bank-transfer/account-table';

import type { BankTransferConfig, BankAccount } from '../../types/payment.types';

// Form validation schema
const bankTransferConfigSchema = z.object({
  active: z.boolean(),
  title: z.string().min(1, 'Titre est requis'),
  description: z.string().min(1, 'Description est requise'),
  accountId: z.string().optional(),
});

type BankTransferConfigFormData = z.infer<typeof bankTransferConfigSchema>;

interface StripeBankTransferConfigProps {
  bankTransferConfig?: BankTransferConfig;
  loading?: boolean;
  error?: string | null;
  onSave: (config: BankTransferConfig) => Promise<void>;
  onReset?: () => void;
}

export const StripeBankTransferConfig: React.FC<StripeBankTransferConfigProps> = ({
  bankTransferConfig,
  loading = false,
  error = null,
  onSave,
  onReset,
}) => {
  const theme = useTheme();

  const methods = useForm<BankTransferConfigFormData>({
    resolver: zodResolver(bankTransferConfigSchema),
    defaultValues: {
      active: false,
      title: 'Virement bancaire',
      description: 'Payez directement sur notre compte bancaire',
      accountId: '',
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
  const [bankAccounts, setBankAccounts] = React.useState<BankAccount[]>([]);

  // Load data when available
  useEffect(() => {
    if (bankTransferConfig) {
      setValue('active', bankTransferConfig.active);
      setValue('title', bankTransferConfig.title);
      setValue('description', bankTransferConfig.description);
      setValue('accountId', bankTransferConfig.accountId || '');

      if (bankTransferConfig.bankAccounts) {
        setBankAccounts(bankTransferConfig.bankAccounts);
      }
    }
  }, [bankTransferConfig, setValue]);

  const updateBankAccounts = (updatedBankAccounts: BankAccount[]) => {
    setBankAccounts(updatedBankAccounts);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const configToSave: BankTransferConfig = {
        ...bankTransferConfig,
        active: data.active,
        title: data.title,
        description: data.description,
        accountId: data.accountId || '',
        bankAccounts,
      };

      await onSave(configToSave);
      toast.success('Configuration du virement bancaire mise à jour avec succès');
    } catch (err) {
      toast.error('Échec de la mise à jour de la configuration du virement bancaire');
    }
  });

  const handleReset = () => {
    if (bankTransferConfig) {
      reset({
        active: bankTransferConfig.active,
        title: bankTransferConfig.title,
        description: bankTransferConfig.description,
        accountId: bankTransferConfig.accountId || '',
      });

      if (bankTransferConfig.bankAccounts) {
        setBankAccounts(bankTransferConfig.bankAccounts);
      }
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
                  Configuration Virement Bancaire
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Configurez les options de paiement par virement bancaire via Stripe
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
                        placeholder="ex: Virement bancaire"
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
                        Description du mode de paiement
                      </Typography>
                      <RHFTextField
                        name="description"
                        placeholder="ex: Payez directement sur notre compte bancaire"
                        fullWidth
                        multiline
                        rows={3}
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Status & Preview */}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3} sx={{ height: '100%' }}>
                <Grid item xs={12}>
                  <PaymentStatusCard
                    title="Virement bancaire"
                    description={
                      watchedValues.active
                        ? 'Le paiement par virement bancaire est actuellement proposé à vos clients'
                        : "Ce mode de paiement n'est pas visible pour vos clients actuellement"
                    }
                    isActive={watchedValues.active}
                    onToggle={(active) => setValue('active', active)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <PaymentPreviewCard
                    title={watchedValues.title}
                    description={watchedValues.description}
                    type="bank_transfer"
                    isActive={watchedValues.active}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Bank Accounts Management */}
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  {bankAccounts.length === 0 ? (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: 'center',
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.neutral',
                        m: 3,
                      }}
                    >
                      <BankIcon
                        sx={{ fontSize: 48, color: 'text.secondary', mb: 1, opacity: 0.7 }}
                      />
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Aucun compte bancaire configuré
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        Ajoutez au moins un compte bancaire pour recevoir des paiements
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<BankIcon />}
                        onClick={() => {
                          const newAccount: BankAccount = {
                            id: Date.now(),
                            accountName: '',
                            bankName: '',
                            accountNumber: '',
                            iban: '',
                            swift: '',
                            currency: 'EUR',
                            order: 1,
                            isDefault: true,
                          };
                          updateBankAccounts([newAccount]);
                        }}
                      >
                        Ajouter un compte bancaire
                      </Button>
                    </Box>
                  ) : (
                    <BankAccountsManager
                      bankAccounts={bankAccounts}
                      updateBankAccounts={updateBankAccounts}
                    />
                  )}
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
                  Intégration avec Stripe
                </Typography>
                <Typography variant="body2">
                  Les virements bancaires via Stripe permettent aux clients de payer directement
                  depuis leur compte bancaire avec une sécurité renforcée et un suivi automatique
                  des transactions.
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
