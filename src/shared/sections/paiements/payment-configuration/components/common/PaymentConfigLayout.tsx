// Path: src/shared/sections/paiements/payment-configuration/components/common/PaymentConfigLayout.tsx

'use client';

import React from 'react';

import { Box, alpha, useTheme, Container } from '@mui/material';

interface PaymentConfigLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PaymentConfigLayout: React.FC<PaymentConfigLayoutProps> = ({
  children,
  maxWidth = 'lg',
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: alpha(theme.palette.background.default, 0.4),
        py: 4,
      }}
    >
      <Container maxWidth={maxWidth}>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
};
