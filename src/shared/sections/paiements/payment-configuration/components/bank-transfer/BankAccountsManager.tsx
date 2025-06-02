// Path: src/shared/sections/paiements/payment-configuration/components/bank-transfer/BankAccountsManager.tsx

'use client';

import React, { useState } from 'react';

import {
  Box,
  Card,
  Grid,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  FormControl,
  CardContent,
} from '@mui/material';

import { FontAwesome } from 'src/shared/components/fontawesome';

import { ConfigurationCard } from '../common/ConfigurationCard';

import type { BankAccount } from '../../types/payment.types';

interface BankAccountsManagerProps {
  accounts: BankAccount[];
  onAccountsChange: (accounts: BankAccount[]) => void;
  currencies?: string[];
}

interface BankAccountFormProps {
  account: Partial<BankAccount>;
  currencies: string[];
  onSave: (account: BankAccount) => void;
  onCancel: () => void;
  isEdit?: boolean;
}

const CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'CAD'];

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  account,
  currencies,
  onSave,
  onCancel,
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<Partial<BankAccount>>({
    accountName: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    currency: 'EUR',
    isDefault: false,
    ...account,
  });

  const handleSave = () => {
    if (formData.accountName && formData.bankName && formData.iban) {
      onSave({
        id: formData.id || Date.now().toString(),
        accountName: formData.accountName,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber || '',
        iban: formData.iban,
        swift: formData.swift || '',
        currency: formData.currency || 'EUR',
        isDefault: formData.isDefault || false,
      });
    }
  };

  const isValid = formData.accountName && formData.bankName && formData.iban;

  return (
    <Card sx={{ p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <FontAwesome icon="fas fa-university" width={20} />
        <Typography variant="h6" fontWeight={600}>
          {isEdit ? 'Modifier le compte bancaire' : 'Ajouter un nouveau compte bancaire'}
        </Typography>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Nom du compte *
          </Typography>
          <TextField
            fullWidth
            placeholder="ex: Compte principal"
            value={formData.accountName || ''}
            onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <FontAwesome icon="fas fa-tag" width={16} />
                </Box>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Nom de la banque *
          </Typography>
          <TextField
            fullWidth
            placeholder="ex: BNP Paribas"
            value={formData.bankName || ''}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <FontAwesome icon="fas fa-building" width={16} />
                </Box>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Numéro de compte
          </Typography>
          <TextField
            fullWidth
            placeholder="ex: 123456789"
            value={formData.accountNumber || ''}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <FontAwesome icon="fas fa-hashtag" width={16} />
                </Box>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            IBAN *
          </Typography>
          <TextField
            fullWidth
            placeholder="ex: FR76 3000 1007..."
            value={formData.iban || ''}
            onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <FontAwesome icon="fas fa-credit-card" width={16} />
                </Box>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            SWIFT/BIC
          </Typography>
          <TextField
            fullWidth
            placeholder="ex: BNPAFRPP"
            value={formData.swift || ''}
            onChange={(e) => setFormData({ ...formData, swift: e.target.value })}
            size="small"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1 }}>
                  <FontAwesome icon="fas fa-globe" width={16} />
                </Box>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle2" fontWeight={500} gutterBottom>
            Devise
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={formData.currency || 'EUR'}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            >
              {currencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FontAwesome icon="fas fa-coins" width={16} />
                    {currency}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              startIcon={<FontAwesome icon="fas fa-times" width={16} />}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!isValid}
              startIcon={<FontAwesome icon="fas fa-check" width={16} />}
            >
              {isEdit ? 'Modifier' : 'Ajouter'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
};

export const BankAccountsManager: React.FC<BankAccountsManagerProps> = ({
  accounts,
  onAccountsChange,
  currencies = CURRENCIES,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);

  const handleAddAccount = (newAccount: BankAccount) => {
    // If this is the first account, make it default
    const accountToAdd = {
      ...newAccount,
      isDefault: accounts.length === 0 || newAccount.isDefault,
    };

    // If setting as default, remove default from others
    let updatedAccounts = accounts;
    if (accountToAdd.isDefault) {
      updatedAccounts = accounts.map((acc) => ({ ...acc, isDefault: false }));
    }

    onAccountsChange([...updatedAccounts, accountToAdd]);
    setShowAddForm(false);
  };

  const handleEditAccount = (updatedAccount: BankAccount) => {
    let updatedAccounts = accounts.map((acc) =>
      acc.id === updatedAccount.id ? updatedAccount : acc
    );

    // If setting as default, remove default from others
    if (updatedAccount.isDefault) {
      updatedAccounts = updatedAccounts.map((acc) => ({
        ...acc,
        isDefault: acc.id === updatedAccount.id,
      }));
    }

    onAccountsChange(updatedAccounts);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter((acc) => acc.id !== id);

    // If we deleted the default account, make the first remaining account default
    const deletedAccount = accounts.find((acc) => acc.id === id);
    if (deletedAccount?.isDefault && updatedAccounts.length > 0) {
      updatedAccounts[0].isDefault = true;
    }

    onAccountsChange(updatedAccounts);
  };

  const handleSetDefault = (id: string) => {
    const updatedAccounts = accounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));
    onAccountsChange(updatedAccounts);
  };

  if (accounts.length === 0 && !showAddForm) {
    return (
      <ConfigurationCard
        title="Gestion des comptes bancaires"
        icon="fas fa-university"
        variant="success"
      >
        <Box
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.neutral',
          }}
        >
          <FontAwesome
            icon="fas fa-university"
            width={48}
            sx={{ color: 'text.secondary', mb: 2 }}
          />
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Aucun compte bancaire configuré
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Ajoutez au moins un compte bancaire pour recevoir des paiements
          </Typography>
          <Button
            variant="contained"
            color="success"
            startIcon={<FontAwesome icon="fas fa-plus" width={16} />}
            onClick={() => setShowAddForm(true)}
            sx={{ borderRadius: 2 }}
          >
            Ajouter un compte bancaire
          </Button>
        </Box>
      </ConfigurationCard>
    );
  }

  return (
    <ConfigurationCard
      title="Gestion des comptes bancaires"
      icon="fas fa-university"
      variant="success"
    >
      <Stack spacing={3}>
        {/* Add Account Button */}
        {!showAddForm && !editingAccount && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<FontAwesome icon="fas fa-plus" width={16} />}
              onClick={() => setShowAddForm(true)}
              sx={{ borderRadius: 2 }}
            >
              Ajouter un compte
            </Button>
          </Box>
        )}

        {/* Add Account Form */}
        {showAddForm && (
          <BankAccountForm
            account={{}}
            currencies={currencies}
            onSave={handleAddAccount}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Bank Accounts List */}
        {accounts.map((account) => {
          if (editingAccount === account.id) {
            return (
              <BankAccountForm
                key={account.id}
                account={account}
                currencies={currencies}
                onSave={handleEditAccount}
                onCancel={() => setEditingAccount(null)}
                isEdit
              />
            );
          }

          return (
            <Card
              key={account.id}
              sx={{
                borderRadius: 2,
                border: account.isDefault ? '2px solid' : '1px solid',
                borderColor: account.isDefault ? 'success.main' : 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 2,
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        bgcolor: account.isDefault ? 'success.lighter' : 'grey.100',
                        color: account.isDefault ? 'success.main' : 'text.secondary',
                      }}
                    >
                      <FontAwesome icon="fas fa-university" width={20} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {account.accountName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {account.bankName} • {account.currency}
                      </Typography>
                    </Box>
                    {account.isDefault && (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: 'success.main',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        PRINCIPAL
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!account.isDefault && (
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleSetDefault(account.id)}
                        title="Définir comme principal"
                        sx={{
                          '&:hover': {
                            bgcolor: 'warning.lighter',
                          },
                        }}
                      >
                        <FontAwesome icon="fas fa-star" width={16} />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setEditingAccount(account.id)}
                      title="Modifier"
                      sx={{
                        '&:hover': {
                          bgcolor: 'primary.lighter',
                        },
                      }}
                    >
                      <FontAwesome icon="fas fa-edit" width={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteAccount(account.id)}
                      title="Supprimer"
                      sx={{
                        '&:hover': {
                          bgcolor: 'error.lighter',
                        },
                      }}
                    >
                      <FontAwesome icon="fas fa-trash" width={16} />
                    </IconButton>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <FontAwesome
                        icon="fas fa-credit-card"
                        width={16}
                        sx={{ color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        IBAN
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                      {account.iban || '—'}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <FontAwesome
                        icon="fas fa-globe"
                        width={16}
                        sx={{ color: 'text.secondary' }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        SWIFT/BIC
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                      {account.swift || '—'}
                    </Typography>
                  </Grid>

                  {account.accountNumber && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FontAwesome
                          icon="fas fa-hashtag"
                          width={16}
                          sx={{ color: 'text.secondary' }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Numéro de compte
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={500} sx={{ fontFamily: 'monospace' }}>
                        {account.accountNumber}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </ConfigurationCard>
  );
};
