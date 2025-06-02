// Path: src/shared/sections/paiements/payment-configuration/payment-methods-conf/bank-transfer/account-table.tsx

import React, { useState } from 'react';

import {
  Add,
  Edit,
  Delete,
  Cancel,
  CreditCard,
  CheckCircle,
  LanOutlined,
  CurrencyExchange,
  AccountBalanceWallet,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  alpha,
  Paper,
  Stack,
  Button,
  Avatar,
  Divider,
  Tooltip,
  Collapse,
  Checkbox,
  TextField,
  IconButton,
  Typography,
  CardHeader,
  CardContent,
  FormControlLabel,
} from '@mui/material';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

export interface IBankAccount {
  id?: number;
  accountName: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  currency?: string;
  order: number;
  isDefault?: boolean;
}

interface BankAccountFormProps {
  account: IBankAccount;
  onChange: (updatedAccount: IBankAccount) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}

const BankAccountForm: React.FC<BankAccountFormProps> = ({
  account,
  onChange,
  onSave,
  onCancel,
  isNew = false,
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
      borderRadius: 2,
    }}
  >
    <Typography variant="h6" sx={{ mb: 2 }}>
      {isNew ? 'Ajouter un nouveau compte bancaire' : 'Modifier les informations du compte'}
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nom du compte"
          value={account.accountName}
          onChange={(e) => onChange({ ...account, accountName: e.target.value })}
          size="small"
          placeholder="Ex: Compte principal"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Nom de la banque"
          value={account.bankName}
          onChange={(e) => onChange({ ...account, bankName: e.target.value })}
          size="small"
          placeholder="Ex: BNP Paribas"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Numéro de compte"
          value={account.accountNumber}
          onChange={(e) => onChange({ ...account, accountNumber: e.target.value })}
          size="small"
          placeholder="Ex: 123456789"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="IBAN"
          value={account.iban}
          onChange={(e) => onChange({ ...account, iban: e.target.value })}
          size="small"
          placeholder="Ex: FR76 3000 1007..."
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="SWIFT/BIC"
          value={account.swift}
          onChange={(e) => onChange({ ...account, swift: e.target.value })}
          size="small"
          placeholder="Ex: BNPAFRPP"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Devise"
          value={account.currency || ''}
          onChange={(e) => onChange({ ...account, currency: e.target.value })}
          size="small"
          placeholder="EUR, USD, GBP..."
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={account.isDefault || false}
              onChange={(e) => onChange({ ...account, isDefault: e.target.checked })}
              color="primary"
            />
          }
          label="Définir comme compte principal pour les virements"
        />
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button variant="outlined" color="inherit" onClick={onCancel} startIcon={<Cancel />}>
          Annuler
        </Button>
        <Button variant="contained" color="primary" onClick={onSave} startIcon={<CheckCircle />}>
          {isNew ? 'Ajouter' : 'Enregistrer'}
        </Button>
      </Grid>
    </Grid>
  </Paper>
);

type Props = {
  updateBankAccounts: (bankAccounts: IBankAccount[]) => void;
  bankAccounts: IBankAccount[];
};

const BankAccountsManager: React.FC<Props> = ({ updateBankAccounts, bankAccounts }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingAccount, setEditingAccount] = useState<IBankAccount | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState<IBankAccount>({
    accountName: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    currency: '',
    order: bankAccounts.length,
    isDefault: false,
  });

  const handleEditClick = (account: IBankAccount) => {
    setEditingId(account.id !== undefined ? account.id : null);
    setEditingAccount({ ...account });
    setShowAddForm(false);
  };

  const handleSaveEdit = () => {
    if (editingAccount) {
      const updatedAccounts = bankAccounts.map((account) =>
        account.id === editingAccount.id ? editingAccount : account
      );

      // S'assurer qu'un seul compte est marqué comme principal
      if (editingAccount.isDefault) {
        updatedAccounts.forEach((account) => {
          if (account.id !== editingAccount.id) {
            account.isDefault = false;
          }
        });
      }

      updateBankAccounts(updatedAccounts);
      setEditingId(null);
      setEditingAccount(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingAccount(null);
  };

  const handleDeleteAccount = (id?: number) => {
    if (id !== undefined) {
      const updatedAccounts = bankAccounts
        .filter((account) => account.id !== id)
        .map((account, index) => ({ ...account, order: index }));
      updateBankAccounts(updatedAccounts);
    }
  };

  const handleAddAccount = () => {
    // Generate a temporary unique ID
    const tempId = Date.now();
    const accountToAdd = { ...newAccount, id: tempId };
    const updatedAccounts = [...bankAccounts, accountToAdd];

    // Update all orders
    const reorderedAccounts = updatedAccounts.map((account, index) => ({
      ...account,
      order: index,
    }));

    // S'assurer qu'un seul compte est marqué comme principal
    if (accountToAdd.isDefault) {
      reorderedAccounts.forEach((account) => {
        if (account.id !== tempId) {
          account.isDefault = false;
        }
      });
    }

    updateBankAccounts(reorderedAccounts);

    // Reset form
    setNewAccount({
      accountName: '',
      bankName: '',
      accountNumber: '',
      iban: '',
      swift: '',
      currency: '',
      order: reorderedAccounts.length,
      isDefault: false,
    });
    setShowAddForm(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Gestion des comptes bancaires
        </Typography>
        <ConditionalComponent
          isValid={bankAccounts.length > 0 && !showAddForm && editingId === null}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setShowAddForm(true)}
            sx={{ borderRadius: 2 }}
          >
            Ajouter un compte
          </Button>
        </ConditionalComponent>
      </Box>

      <Collapse in={showAddForm}>
        <Box sx={{ mb: 2 }}>
          <BankAccountForm
            account={newAccount}
            onChange={setNewAccount}
            onSave={handleAddAccount}
            onCancel={() => setShowAddForm(false)}
            isNew
          />
        </Box>
      </Collapse>

      <ConditionalComponent isValid={bankAccounts.length === 0 && !showAddForm}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: 'center',
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            backgroundColor: (theme) => alpha(theme.palette.background.default, 0.6),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 60,
              height: 60,
              backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <AccountBalanceWallet sx={{ color: 'primary.main', fontSize: 32 }} />
          </Avatar>
          <Typography variant="h6" color="text.primary">
            Aucun compte bancaire
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Vous n&apos;avez pas encore configuré de comptes bancaires.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setShowAddForm(true)}
            sx={{ borderRadius: 2 }}
          >
            Ajouter un compte bancaire
          </Button>
        </Paper>
      </ConditionalComponent>

      <ConditionalComponent isValid={bankAccounts.length > 0}>
        <Stack spacing={2}>
          {bankAccounts.map((account, index) =>
            editingId === account.id ? (
              <Box key={account.id || index} sx={{ mb: 2 }}>
                <BankAccountForm
                  account={editingAccount!}
                  onChange={setEditingAccount}
                  onSave={handleSaveEdit}
                  onCancel={handleCancelEdit}
                />
              </Box>
            ) : (
              <Card
                key={account.id || index}
                sx={{
                  mb: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: account.isDefault ? 'primary.light' : 'divider',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: (theme) => theme.shadows[3],
                  },
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
              >
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{
                        bgcolor: account.isDefault ? 'primary.main' : 'action.disabledBackground',
                      }}
                    >
                      <CreditCard />
                    </Avatar>
                  }
                  title={
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {account.accountName}
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body2" color="text.secondary">
                      {account.bankName}
                      {account.currency && ` • ${account.currency}`}
                    </Typography>
                  }
                  action={
                    <Box>
                      <Tooltip title="Modifier">
                        <IconButton onClick={() => handleEditClick(account)} size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          onClick={() => handleDeleteAccount(account.id)}
                          size="small"
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
                <Divider />
                <CardContent
                  sx={{ backgroundColor: (theme) => alpha(theme.palette.background.default, 0.4) }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <AccountBalanceWallet
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1, mt: 0.5 }}
                        />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Numéro de compte
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {account.accountNumber || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <LanOutlined fontSize="small" color="action" sx={{ mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            IBAN
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {account.iban || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CurrencyExchange fontSize="small" color="action" sx={{ mr: 1, mt: 0.5 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            SWIFT/BIC
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {account.swift || '—'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )
          )}
        </Stack>
      </ConditionalComponent>
    </Box>
  );
};

export default BankAccountsManager;
