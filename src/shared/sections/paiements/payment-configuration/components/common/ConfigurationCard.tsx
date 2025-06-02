// Path: src/shared/sections/paiements/payment-configuration/components/common/ConfigurationCard.tsx

'use client';

import React from 'react';

import { Box, Card, alpha, useTheme, Typography, CardContent } from '@mui/material';

import { FontAwesome } from 'src/shared/components/fontawesome';

interface ConfigurationCardProps {
  title: string;
  icon: any; // FontAwesome icon
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'error';
}

export const ConfigurationCard: React.FC<ConfigurationCardProps> = ({
  title,
  icon,
  children,
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
      case 'error':
        return theme.palette.error.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const variantColor = getVariantColor();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: alpha(variantColor, 0.3),
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: alpha(variantColor, 0.1),
              color: variantColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <FontAwesome icon={icon} width={24} />
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};
