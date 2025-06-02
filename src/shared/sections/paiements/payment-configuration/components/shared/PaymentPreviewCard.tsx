// Path: src/shared/sections/paiements/payment-configuration/components/shared/PaymentPreviewCard.tsx

'use client';

import React from 'react';

import { Box, Card, Chip, Stack, useTheme, Typography, CardContent } from '@mui/material';
import {
  Visibility as EyeIcon,
  Preview as PreviewIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
} from '@mui/icons-material';

interface PaymentPreviewCardProps {
  title: string;
  description?: string;
  type: 'credit_card' | 'bank_transfer';
  logos?: string[];
  isActive?: boolean;
}

export const PaymentPreviewCard: React.FC<PaymentPreviewCardProps> = ({
  title,
  description,
  type,
  logos = [],
  isActive = true,
}) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'credit_card':
        return <CardIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />;
      case 'bank_transfer':
        return <BankIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />;
      default:
        return <CardIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />;
    }
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
          <PreviewIcon color="primary" sx={{ mr: 1.5 }} />
          <Typography variant="h6" fontWeight={600}>
            Aperçu client
          </Typography>
          <EyeIcon sx={{ ml: 1, color: 'text.secondary', fontSize: 18 }} />
        </Box>

        <Box
          sx={{
            p: 3,
            border: '2px dashed',
            borderColor: isActive ? 'primary.light' : 'divider',
            borderRadius: 2,
            bgcolor: isActive ? 'primary.lighter' : 'background.neutral',
            transition: 'all 0.2s ease-in-out',
            position: 'relative',
            mb: 2,
          }}
        >
          {/* Simulated payment method display */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            {getIcon()}
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {title || `${type === 'credit_card' ? 'Carte bancaire' : 'Virement bancaire'}`}
            </Typography>

            {isActive && (
              <Chip
                label="ACTIF"
                color="success"
                size="small"
                sx={{ ml: 'auto', fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {description ||
              `Paiement par ${type === 'credit_card' ? 'carte bancaire' : 'virement bancaire'}`}
          </Typography>

          {/* Display card logos if available */}
          {type === 'credit_card' && logos.length > 0 && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {logos.slice(0, 4).map((logo, index) => (
                <Chip
                  key={index}
                  label={logo}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                />
              ))}
              {logos.length > 4 && (
                <Chip
                  label={`+${logos.length - 4}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 22,
                    borderColor: 'divider',
                    color: 'text.secondary',
                  }}
                />
              )}
            </Stack>
          )}

          {/* Status indicator */}
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isActive ? 'success.main' : 'error.main',
            }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Ceci est un aperçu de ce que vos clients verront lors du paiement
        </Typography>
      </CardContent>
    </Card>
  );
};
