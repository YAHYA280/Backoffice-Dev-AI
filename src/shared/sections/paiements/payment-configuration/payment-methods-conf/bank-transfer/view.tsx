'use client';

// Types
import type { IBankAccount } from 'src/contexts/types/payment';

import * as z from 'zod';
import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';

import LoadingButton from '@mui/lab/LoadingButton';
// MUI Components
import {
  Box,
  Card,
  Chip,
  Grid,
  Alert,
  Stack,
  Switch,
  Button,
  useTheme,
  Typography,
  CardContent,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';
// Icons
import {
  Add as AddIcon,
  Check as CheckIcon,
  Refresh as RefreshIcon,
  CreditCard as CardIcon,
  Assignment as AssignmentIcon,
  AccountBalance as AccountIcon,
} from '@mui/icons-material';

// Custom components and hooks
import { updateBankTrasnferConf, useGetBankTranferConfig } from 'src/utils/payment';

import { toast } from 'src/shared/components/snackbar';
import { RHFTextField } from 'src/shared/components/hook-form';

// Bank accounts manager
import BankAccountsManager from './account-table';

// Form validation schema
const schema = z.object({
  active: z.boolean(),
  title: z.string().min(1, 'Titre est requis'),
  description: z.string().min(1, 'Description est requise'),
  accountId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function BankTransferConfView() {
  const theme = useTheme();
  const [bankAccounts, setBankAccounts] = useState<IBankAccount[]>([]);

  const { bankTranferConfigData, bankTranferConfigError, bankTranferConfigLoading } =
    useGetBankTranferConfig();

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      active: false,
      title: '',
      description: '',
      accountId: '',
    },
  });

  const {
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
    watch,
  } = methods;

  const isActive = watch('active');

  // Load data when available
  useEffect(() => {
    if (bankTranferConfigData) {
      setValue('active', bankTranferConfigData.active);
      setValue('title', bankTranferConfigData.title);
      setValue('description', bankTranferConfigData.description);
      setValue('accountId', bankTranferConfigData.accountId || '');

      if (bankTranferConfigData.bankAccounts) {
        const convertedAccounts: IBankAccount[] = bankTranferConfigData.bankAccounts.map(
          (account, index) => ({
            id: index,
            accountName: account.name,
            bankName: account.bank,
            accountNumber: account.number,
            iban: account.IBAN,
            swift: account.bic_swift,
            currency: account.code,
            order: index + 1,
          })
        );
        setBankAccounts(convertedAccounts);
      }
    }
  }, [bankTranferConfigData, setValue]);

  const updateBankAccounts = (updatedBankAccounts: IBankAccount[]) => {
    setBankAccounts(updatedBankAccounts);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { active, title, description, accountId } = data;

      const convertedBankAccounts = bankAccounts.map((account) => ({
        name: account.accountName,
        number: account.accountNumber,
        bank: account.bankName,
        code: account.currency || '',
        IBAN: account.iban,
        bic_swift: account.swift,
      }));

      await updateBankTrasnferConf({
        active,
        title,
        description,
        accountId: accountId || '',
        bankAccounts: convertedBankAccounts,
      });

      toast.success('Configuration du virement bancaire mise à jour avec succès');
    } catch (error) {
      toast.error('Échec de la mise à jour de la configuration du virement bancaire');
    }
  });

  const handleReset = () => {
    if (bankTranferConfigData) {
      reset({
        active: bankTranferConfigData.active,
        title: bankTranferConfigData.title,
        description: bankTranferConfigData.description,
        accountId: bankTranferConfigData.accountId || '',
      });

      if (bankTranferConfigData.bankAccounts) {
        const convertedAccounts: IBankAccount[] = bankTranferConfigData.bankAccounts.map(
          (account, index) => ({
            id: index,
            accountName: account.name,
            bankName: account.bank,
            accountNumber: account.number,
            iban: account.IBAN,
            swift: account.bic_swift,
            currency: account.code,
            order: index + 1,
          })
        );
        setBankAccounts(convertedAccounts);
      }
    }
  };

  // Loading state
  if (bankTranferConfigLoading) {
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
  if (bankTranferConfigError) {
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
          Impossible de charger la configuration du virement bancaire. Veuillez réessayer plus tard.
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
      <form onSubmit={onSubmit} noValidate autoComplete="off">
        <Grid container spacing={3}>
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

          {/* Status Card */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Card
                sx={{
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
                      ? 'Le paiement par virement bancaire est actuellement proposé à vos clients.'
                      : "Ce mode de paiement n'est pas visible pour vos clients actuellement."}
                  </Typography>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flexGrow: 1,
                  borderRadius: 2,
                  boxShadow: theme.shadows[1],
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <AccountIcon color="primary" sx={{ mr: 1.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      Aperçu client
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      p: 2,
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CardIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {watch('title') || 'Virement bancaire'}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {watch('description') || 'Description du mode de paiement'}
                    </Typography>
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Ceci est un aperçu de ce que vos clients verront lors du paiement
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Bank Accounts */}
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: theme.shadows[1],
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <CardContent>
                {bankAccounts.length === 0 ? (
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      border: '1px dashed',
                      borderColor: 'divider',
                      borderRadius: 2,
                      bgcolor: 'background.neutral',
                    }}
                  >
                    <AccountIcon
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
                      startIcon={<AddIcon />}
                      onClick={() => {
                        const newAccount: IBankAccount = {
                          id: 0,
                          accountName: '',
                          bankName: '',
                          accountNumber: '',
                          iban: '',
                          swift: '',
                          currency: '',
                          order: 1,
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
