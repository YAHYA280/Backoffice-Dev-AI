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

  // Use orange theme consistently
  const primaryColor = '#FF5722'; // Orange theme color

  const getVariantColor = () => {
    switch (variant) {
      case 'success':
        return '#4CAF50';
      case 'warning':
        return '#FF9800';
      case 'info':
        return primaryColor; // Use orange for info/stripe
      default:
        return primaryColor; // Use orange as primary
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
          ${alpha(variantColor, 0.08)} 0%, 
          ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        border: '2px solid',
        borderColor: isActive
          ? '#4CAF50' // Green for active
          : isConfigured
            ? alpha(variantColor, 0.4)
            : '#FF9800', // Orange for non-configured
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative corner elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 100,
          height: 100,
          background: `radial-gradient(circle at center, 
            ${alpha(variantColor, 0.1)} 0%, 
            transparent 70%)`,
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 80,
          height: 80,
          background: `radial-gradient(circle at center, 
            ${alpha(variantColor, 0.05)} 0%, 
            transparent 70%)`,
          zIndex: 0,
        }}
      />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={3}
        sx={{ position: 'relative', zIndex: 2 }}
      >
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2.5} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: alpha(variantColor, 0.1),
                color: variantColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid',
                borderColor: alpha(variantColor, 0.2),
              }}
            >
              <FontAwesome icon={icon} width={36} />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
                color="text.primary"
                sx={{
                  mb: 0.5,
                  background: `linear-gradient(45deg, ${theme.palette.text.primary}, ${variantColor})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                {description}
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
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
              px: 2,
              py: 1,
              height: 40,
              borderRadius: 3,
              boxShadow: theme.shadows[2],
            }}
          />

          {/* Active Status */}
          {isConfigured && (
            <Chip
              icon={
                <FontAwesome
                  icon={isActive ? 'fas fa-power-off' : 'fas fa-pause-circle'}
                  width={18}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {isActive ? 'Activé' : 'Désactivé'}
                  </Typography>
                  {isActive && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: 'success.main',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      ON
                    </Box>
                  )}
                </Box>
              }
              color={isActive ? 'success' : 'error'}
              variant={isActive ? 'filled' : 'outlined'}
              sx={{
                fontWeight: 600,
                px: 2,
                py: 1,
                height: 40,
                borderRadius: 3,
                borderWidth: 2,
                boxShadow: isActive ? theme.shadows[2] : 'none',
                ...(isActive && {
                  background: `linear-gradient(45deg, 
                    ${theme.palette.success.main}, 
                    ${theme.palette.success.light})`,
                }),
              }}
            />
          )}

          {/* Mode Status */}
          {mode && (
            <Chip
              icon={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <FontAwesome
                    icon={mode === 'live' ? 'fas fa-globe' : 'fas fa-flask'}
                    width={18}
                  />
                </Box>
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {mode === 'live' ? 'Production' : 'Test'}
                  </Typography>
                  {mode === 'live' && (
                    <Box
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        bgcolor: 'error.main',
                        color: 'white',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        boxShadow: '0 0 10px rgba(244, 67, 54, 0.5)',
                      }}
                    >
                      LIVE
                    </Box>
                  )}
                </Box>
              }
              color={mode === 'live' ? 'error' : 'secondary'}
              variant="outlined"
              sx={{
                fontWeight: 600,
                px: 2,
                py: 1,
                height: 40,
                borderRadius: 3,
                borderWidth: 2,
                ...(mode === 'live' && {
                  background: `linear-gradient(45deg, 
                    ${alpha(theme.palette.error.main, 0.1)}, 
                    ${alpha(theme.palette.error.main, 0.05)})`,
                  borderColor: theme.palette.error.main,
                  boxShadow: '0 0 20px rgba(244, 67, 54, 0.3)',
                }),
              }}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
