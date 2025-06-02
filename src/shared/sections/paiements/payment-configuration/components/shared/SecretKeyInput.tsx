// Path: src/shared/sections/paiements/payment-configuration/components/shared/SecretKeyInput.tsx

'use client';

import React, { useState } from 'react';

import {
  Box,
  Card,
  Grid,
  alpha,
  Stack,
  useTheme,
  TextField,
  Typography,
  IconButton,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Key as KeyIcon,
  Visibility,
  VisibilityOff,
  Security as SecurityIcon,
} from '@mui/icons-material';

import type { PaymentMode } from '../../types/payment.types';

interface SecretKeyInputProps {
  liveSecretKey: string;
  sandboxSecretKey: string;
  currentMode: PaymentMode;
  onLiveKeyChange: (key: string) => void;
  onSandboxKeyChange: (key: string) => void;
  disabled?: boolean;
}

export const SecretKeyInput: React.FC<SecretKeyInputProps> = ({
  liveSecretKey,
  sandboxSecretKey,
  currentMode,
  onLiveKeyChange,
  onSandboxKeyChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showSandboxKey, setShowSandboxKey] = useState(false);

  const isLiveKeyValid = liveSecretKey.startsWith('sk_live_') && liveSecretKey.length > 20;
  const isSandboxKeyValid = sandboxSecretKey.startsWith('sk_test_') && sandboxSecretKey.length > 20;

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
          <SecurityIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={600}>
            Configuration des clés Stripe
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Configurez vos clés secrètes Stripe pour les environnements de production et de test
        </Typography>

        <Grid container spacing={3}>
          {/* Live Secret Key */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: currentMode === 'live' ? 'success.main' : 'divider',
                backgroundColor:
                  currentMode === 'live'
                    ? alpha(theme.palette.success.main, 0.04)
                    : alpha(theme.palette.background.default, 0.5),
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <KeyIcon
                  sx={{
                    color: currentMode === 'live' ? 'success.main' : 'text.secondary',
                    fontSize: 20,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color={currentMode === 'live' ? 'success.dark' : 'text.primary'}
                >
                  Live Secret Key
                </Typography>
                {currentMode === 'live' && (
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: 'success.main',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    ACTIF
                  </Box>
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                La clé secrète de production de Stripe
              </Typography>

              <TextField
                fullWidth
                value={liveSecretKey}
                onChange={(e) => onLiveKeyChange(e.target.value)}
                disabled={disabled}
                type={showLiveKey ? 'text' : 'password'}
                placeholder="sk_live_..."
                size="small"
                error={liveSecretKey ? !isLiveKeyValid : false}
                helperText={
                  liveSecretKey && !isLiveKeyValid ? "La clé doit commencer par 'sk_live_'" : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowLiveKey(!showLiveKey)}
                        size="small"
                      >
                        {showLiveKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Sandbox Secret Key */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: currentMode === 'sandbox' ? 'warning.main' : 'divider',
                backgroundColor:
                  currentMode === 'sandbox'
                    ? alpha(theme.palette.warning.main, 0.04)
                    : alpha(theme.palette.background.default, 0.5),
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <KeyIcon
                  sx={{
                    color: currentMode === 'sandbox' ? 'warning.main' : 'text.secondary',
                    fontSize: 20,
                  }}
                />
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  color={currentMode === 'sandbox' ? 'warning.dark' : 'text.primary'}
                >
                  Sandbox Secret Key
                </Typography>
                {currentMode === 'sandbox' && (
                  <Box
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: 'warning.main',
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    ACTIF
                  </Box>
                )}
              </Stack>

              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                La clé secrète de test de Stripe
              </Typography>

              <TextField
                fullWidth
                value={sandboxSecretKey}
                onChange={(e) => onSandboxKeyChange(e.target.value)}
                disabled={disabled}
                type={showSandboxKey ? 'text' : 'password'}
                placeholder="sk_test_..."
                size="small"
                error={sandboxSecretKey ? !isSandboxKeyValid : false}
                helperText={
                  sandboxSecretKey && !isSandboxKeyValid
                    ? "La clé doit commencer par 'sk_test_'"
                    : ''
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowSandboxKey(!showSandboxKey)}
                        size="small"
                      >
                        {showSandboxKey ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
