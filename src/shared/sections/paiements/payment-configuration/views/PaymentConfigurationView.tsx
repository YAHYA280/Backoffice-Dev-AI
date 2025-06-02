// Path: src/shared/sections/paiements/payment-configuration/views/PaymentConfigurationView.tsx

'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Grid,
  Stack,
  alpha,
  Button,
  useTheme,
  Container,
  Typography,
  CardContent,
  CardActions,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Payment as StripeIcon,
  ChevronRight as ArrowIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import {
  useStripeConfig,
  useCreditCardConfig,
  useBankTransferConfig,
} from '../hooks/useStripeConfig';

import type { PaymentMethod } from '../types/payment.types';

const PAYMENT_METHODS: Omit<PaymentMethod, 'active' | 'config'>[] = [
  {
    id: 'stripe',
    type: 'credit_card',
    title: 'Configuration Stripe',
    description: 'Configurez votre intégration Stripe pour traiter les paiements',
    icon: 'stripe',
  },
  {
    id: 'credit_card',
    type: 'credit_card',
    title: 'Carte Bancaire',
    description: 'Configurez les options de paiement par carte bancaire',
    icon: 'credit_card',
  },
  {
    id: 'bank_transfer',
    type: 'bank_transfer',
    title: 'Virement Bancaire',
    description: 'Configurez les options de virement bancaire',
    icon: 'bank_transfer',
  },
];

interface PaymentMethodCardProps {
  method: Omit<PaymentMethod, 'active' | 'config'>;
  isConfigured: boolean;
  isActive: boolean;
  loading: boolean;
  onClick: () => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  isConfigured,
  isActive,
  loading,
  onClick,
}) => {
  const theme = useTheme();

  const getIcon = () => {
    const iconProps = { fontSize: 'large' as const, color: 'primary' as const };

    switch (method.icon) {
      case 'stripe':
        return <StripeIcon {...iconProps} />;
      case 'credit_card':
        return <CardIcon {...iconProps} />;
      case 'bank_transfer':
        return <BankIcon {...iconProps} />;
      default:
        return <SettingsIcon {...iconProps} />;
    }
  };

  const getStatusColor = () => {
    if (!isConfigured) return 'warning';
    return isActive ? 'success' : 'error';
  };

  const getStatusIcon = () => {
    if (!isConfigured) return <WarningIcon fontSize="small" />;
    return <CheckIcon fontSize="small" />;
  };

  const getStatusText = () => {
    if (!isConfigured) return 'Non configuré';
    return isActive ? 'Activé' : 'Configuré';
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isActive ? 'success.light' : 'divider',
        backgroundColor: isActive ? alpha(theme.palette.success.main, 0.02) : 'background.paper',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: 'primary.light',
        },
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, pb: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              {getIcon()}
            </Box>

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: `${getStatusColor()}.lighter`,
                color: `${getStatusColor()}.dark`,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {getStatusIcon()}
              {getStatusText()}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {method.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5, minHeight: 40 }}
            >
              {method.description}
            </Typography>
          </Box>

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <CircularProgress size={20} />
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 1 }}>
        <Button
          fullWidth
          variant={isActive ? 'contained' : 'outlined'}
          color="primary"
          endIcon={<ArrowIcon />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            '&:hover': {
              transform: 'scale(1.02)',
            },
          }}
        >
          {isConfigured ? 'Modifier' : 'Configurer'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default function PaymentConfigurationView() {
  const theme = useTheme();
  const router = useRouter();

  const { config: stripeConfig, loading: stripeLoading } = useStripeConfig();
  const { config: creditCardConfig, loading: creditCardLoading } = useCreditCardConfig();
  const { config: bankTransferConfig, loading: bankTransferLoading } = useBankTransferConfig();

  const handleMethodClick = (methodId: string) => {
    switch (methodId) {
      case 'stripe':
        // For now, we'll redirect to the same page since we don't have separate Stripe config
        // In a real app, this would go to a dedicated Stripe configuration page
        router.push(paths.dashboard.paiements.method('credit_card'));
        break;
      case 'credit_card':
        router.push(paths.dashboard.paiements.method('credit_card'));
        break;
      case 'bank_transfer':
        router.push(paths.dashboard.paiements.method('bank_transfer'));
        break;
      default:
        break;
    }
  };

  const getMethodStatus = (methodId: string) => {
    switch (methodId) {
      case 'stripe':
        return {
          isConfigured: Boolean(stripeConfig?.liveSecretKey || stripeConfig?.sandboxSecretKey),
          isActive: stripeConfig?.active || false,
          loading: stripeLoading,
        };
      case 'credit_card':
        return {
          isConfigured: Boolean(creditCardConfig?.title),
          isActive: creditCardConfig?.active || false,
          loading: creditCardLoading,
        };
      case 'bank_transfer':
        return {
          isConfigured: Boolean(bankTransferConfig?.title),
          isActive: bankTransferConfig?.active || false,
          loading: bankTransferLoading,
        };
      default:
        return { isConfigured: false, isActive: false, loading: false };
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: alpha(theme.palette.background.default, 0.4),
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <CustomBreadcrumbs
          heading="Configuration des paiements"
          links={[
            {
              name: 'Tableau de bord',
              href: paths.dashboard.root,
            },
            {
              name: 'Paiements',
              href: paths.dashboard.paiements.root,
            },
            {
              name: 'Configuration des paiements',
            },
          ]}
          sx={{ mb: 4 }}
        />

        {/* Header */}
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
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <SettingsIcon fontSize="large" />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Méthodes de paiement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configurez et gérez vos différentes méthodes de paiement pour votre boutique en
                ligne
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Payment Methods Grid */}
        <Grid container spacing={3}>
          {PAYMENT_METHODS.map((method) => {
            const status = getMethodStatus(method.id);

            return (
              <Grid item xs={12} md={6} lg={4} key={method.id}>
                <PaymentMethodCard
                  method={method}
                  isConfigured={status.isConfigured}
                  isActive={status.isActive}
                  loading={status.loading}
                  onClick={() => handleMethodClick(method.id)}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Information Section */}
        <Box sx={{ mt: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: alpha(theme.palette.info.main, 0.02),
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                À propos de la configuration des paiements
              </Typography>

              <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Configuration Stripe :</strong> Configurez vos clés API Stripe pour
                    traiter les paiements
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Carte Bancaire :</strong> Personnalisez l&apos;expérience de paiement
                    par carte avec les logos et restrictions
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Virement Bancaire :</strong> Configurez vos comptes bancaires pour
                    recevoir les virements
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Sécurité :</strong> Toutes les configurations sont chiffrées et
                    sécurisées
                  </Typography>
                </li>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
