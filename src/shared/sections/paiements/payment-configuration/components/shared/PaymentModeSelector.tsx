// Path: src/shared/sections/paiements/payment-configuration/components/shared/PaymentModeSelector.tsx

'use client';

import React from 'react';

import {
  Code as TestIcon,
  Public as LiveIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  Radio,
  Stack,
  alpha,
  useTheme,
  Typography,
  RadioGroup,
  CardContent,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import type { PaymentMode } from '../../types/payment.types';

interface PaymentModeSelectorProps {
  value: PaymentMode;
  onChange: (mode: PaymentMode) => void;
  disabled?: boolean;
}

export const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value as PaymentMode);
  };

  return (
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
            Mode de paiement
          </Typography>
          <Chip
            label={value === 'live' ? 'PRODUCTION' : 'TEST'}
            color={value === 'live' ? 'success' : 'warning'}
            size="small"
            sx={{ ml: 2, fontWeight: 600 }}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Le mode de paiement Stripe
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={value} onChange={handleChange} sx={{ gap: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: value === 'live' ? 'success.main' : 'divider',
                backgroundColor:
                  value === 'live' ? alpha(theme.palette.success.main, 0.04) : 'transparent',
                transition: 'all 0.2s ease-in-out',
                cursor: disabled ? 'not-allowed' : 'pointer',
                '&:hover': !disabled
                  ? {
                      borderColor: 'success.light',
                      backgroundColor: alpha(theme.palette.success.main, 0.02),
                    }
                  : {},
              }}
            >
              <FormControlLabel
                value="live"
                control={<Radio disabled={disabled} />}
                disabled={disabled}
                label={
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <LiveIcon sx={{ color: 'success.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Mode Live (Production)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Traitement des paiements réels avec votre clé secrète de production
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Box>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '2px solid',
                borderColor: value === 'sandbox' ? 'warning.main' : 'divider',
                backgroundColor:
                  value === 'sandbox' ? alpha(theme.palette.warning.main, 0.04) : 'transparent',
                transition: 'all 0.2s ease-in-out',
                cursor: disabled ? 'not-allowed' : 'pointer',
                '&:hover': !disabled
                  ? {
                      borderColor: 'warning.light',
                      backgroundColor: alpha(theme.palette.warning.main, 0.02),
                    }
                  : {},
              }}
            >
              <FormControlLabel
                value="sandbox"
                control={<Radio disabled={disabled} />}
                disabled={disabled}
                label={
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <TestIcon sx={{ color: 'warning.main' }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        Mode Sandbox (Test)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mode test pour le développement avec votre clé secrète de test
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{ m: 0, width: '100%' }}
              />
            </Box>
          </RadioGroup>
        </FormControl>
      </CardContent>
    </Card>
  );
};
