// Path: src/shared/sections/paiements/payment-configuration/components/common/PaymentConfigHeader.tsx

'use client';

import React from 'react';

import { Box, Chip, Stack, alpha, useTheme, Typography } from '@mui/material';

import { FontAwesome } from 'src/shared/components/fontawesome';

interface PaymentConfigHeaderProps {
  title: string;
  description: string;
  icon: any; // FontAwesome icon
  isConfigured?: boolean;
  isActive?: boolean;
  mode?: 'live' | 'sandbox';
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

export const PaymentConfigHeader: React.FC<PaymentConfigHeaderProps> = ({
  title,
  description,
  icon,
  isConfigured = false,
  isActive = false,
  mode,
  variant = 'primary',
}) => {
  const theme = useTheme();

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const variantColor = getVariantColor();

  return (
    <Box
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 3,
        background: `linear-gradient(135deg, 
          ${alpha(variantColor, 0.1)} 0%, 
          ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
        border: '1px solid',
        borderColor: alpha(variantColor, 0.2),
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
            ${alpha(variantColor, 0.1)}, 
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
                backgroundColor: alpha(variantColor, 0.1),
                color: variantColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome icon={icon} width={32} />
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
            icon={
              <FontAwesome
                icon={isConfigured ? 'fas fa-check-circle' : 'fas fa-exclamation-triangle'}
                width={18}
              />
            }
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
              icon={
                <FontAwesome
                  icon={isActive ? 'fas fa-toggle-on' : 'fas fa-toggle-off'}
                  width={18}
                />
              }
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
              icon={
                <FontAwesome icon={mode === 'live' ? 'fas fa-globe' : 'fas fa-flask'} width={18} />
              }
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
