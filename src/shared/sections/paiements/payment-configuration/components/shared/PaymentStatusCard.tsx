// Path: src/shared/sections/paiements/payment-configuration/components/shared/PaymentStatusCard.tsx

'use client';

import React from 'react';

import {
  CheckCircle as ActiveIcon,
  Warning as InactiveIcon,
  PowerSettingsNew as PowerIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  Stack,
  Switch,
  useTheme,
  Typography,
  CardContent,
  FormControlLabel,
} from '@mui/material';

interface PaymentStatusCardProps {
  title: string;
  description?: string;
  isActive: boolean;
  onToggle: (active: boolean) => void;
  disabled?: boolean;
  showModeChip?: boolean;
  mode?: 'live' | 'sandbox';
}

export const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  title,
  description,
  isActive,
  onToggle,
  disabled = false,
  showModeChip = false,
  mode,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: isActive ? 'success.lighter' : 'warning.lighter',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {isActive ? (
              <ActiveIcon sx={{ color: 'success.main', fontSize: 24 }} />
            ) : (
              <InactiveIcon sx={{ color: 'warning.main', fontSize: 24 }} />
            )}

            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color={isActive ? 'success.dark' : 'warning.dark'}
                >
                  {title}
                </Typography>

                <Chip
                  label={isActive ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
                  color={isActive ? 'success' : 'warning'}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 1,
                  }}
                />

                {showModeChip && mode && (
                  <Chip
                    label={mode === 'live' ? 'PRODUCTION' : 'TEST'}
                    color={mode === 'live' ? 'info' : 'secondary'}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontWeight: 500,
                      borderRadius: 1,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => onToggle(e.target.checked)}
                disabled={disabled}
                color="default"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#fff',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: isActive ? 'success.main' : 'warning.main',
                  },
                }}
              />
            }
            label=""
          />
        </Box>

        {description && (
          <Typography
            variant="body2"
            color={isActive ? 'success.dark' : 'warning.dark'}
            sx={{ opacity: 0.9, lineHeight: 1.5 }}
          >
            {description}
          </Typography>
        )}

        <Box
          sx={{
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            backgroundColor: isActive
              ? theme.palette.success.lighter
              : theme.palette.warning.lighter,
            border: '1px solid',
            borderColor: isActive ? 'success.main' : 'warning.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <PowerIcon
            sx={{
              color: isActive ? 'success.main' : 'warning.main',
              fontSize: 18,
            }}
          />
          <Typography
            variant="caption"
            fontWeight={500}
            color={isActive ? 'success.dark' : 'warning.dark'}
          >
            {isActive
              ? 'Ce mode de paiement est visible pour vos clients'
              : "Ce mode de paiement n'est pas visible pour vos clients"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
