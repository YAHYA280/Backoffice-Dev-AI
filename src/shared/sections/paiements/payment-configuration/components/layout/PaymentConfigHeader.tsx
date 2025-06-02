// Path: src/shared/sections/paiements/payment-configuration/components/layout/PaymentConfigHeader.tsx

'use client';

import React from 'react';

import { Box, Chip, Stack, alpha, useTheme, Typography } from '@mui/material';
import {
  Payment as PaymentIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedIcon,
} from '@mui/icons-material';

interface PaymentConfigHeaderProps {
  title: string;
  description: string;
  isConfigured?: boolean;
  isActive?: boolean;
  mode?: 'live' | 'sandbox';
}

export const PaymentConfigHeader: React.FC<PaymentConfigHeaderProps> = ({
  title,
  description,
  isConfigured = false,
  isActive = false,
  mode,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.main, 0.1)} 0%, 
          ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
        border: '1px solid',
        borderColor: alpha(theme.palette.primary.main, 0.2),
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(45deg, 
            ${alpha(theme.palette.primary.main, 0.1)}, 
            ${alpha(theme.palette.secondary.main, 0.1)})`,
          zIndex: 0,
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={3}
        sx={{ position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <PaymentIcon fontSize="large" />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                {description}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          {/* Configuration Status */}
          <Chip
            icon={isConfigured ? <VerifiedIcon /> : <SecurityIcon />}
            label={isConfigured ? 'Configuré' : 'Non configuré'}
            color={isConfigured ? 'success' : 'warning'}
            variant="filled"
            sx={{
              fontWeight: 600,
              px: 1,
              '& .MuiChip-icon': {
                fontSize: 18,
              },
            }}
          />

          {/* Active Status */}
          {isConfigured && (
            <Chip
              label={isActive ? 'Activé' : 'Désactivé'}
              color={isActive ? 'success' : 'error'}
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderWidth: 2,
              }}
            />
          )}

          {/* Mode Status */}
          {mode && (
            <Chip
              label={mode === 'live' ? 'Production' : 'Test'}
              color={mode === 'live' ? 'info' : 'secondary'}
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderWidth: 2,
              }}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
