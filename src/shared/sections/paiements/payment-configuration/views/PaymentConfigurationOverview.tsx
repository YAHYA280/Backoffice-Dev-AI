// Path: src/shared/sections/paiements/payment-configuration/views/PaymentConfigurationOverview.tsx

'use client';

import React from 'react';

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
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { FontAwesome } from 'src/shared/components/fontawesome';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

interface PaymentMethodCardProps {
  id: string;
  title: string;
  description: string;
  icon: any;
  isConfigured: boolean;
  isActive: boolean;
  loading?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  id,
  title,
  description,
  icon,
  isConfigured,
  isActive,
  loading = false,
  variant = 'primary',
}) => {
  const theme = useTheme();
  const router = useRouter();

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

  const handleClick = () => {
    switch (id) {
      case 'stripe':
        router.push(paths.dashboard.paiements.method('stripe'));
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

  const getStatusInfo = () => {
    if (!isConfigured) {
      return {
        text: 'Non configuré',
        color: theme.palette.warning.main,
        icon: 'fas fa-exclamation-triangle',
      };
    }
    return {
      text: isActive ? 'Activé' : 'Configuré',
      color: isActive ? theme.palette.success.main : theme.palette.info.main,
      icon: isActive ? 'fas fa-check-circle' : 'fas fa-pause-circle',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: isActive ? alpha(variantColor, 0.3) : 'divider',
        backgroundColor: isActive ? alpha(variantColor, 0.02) : 'background.paper',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: alpha(variantColor, 0.5),
        },
      }}
      onClick={handleClick}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          right: -10,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: `linear-gradient(45deg, 
            ${alpha(variantColor, 0.1)}, 
            ${alpha(variantColor, 0.05)})`,
          zIndex: 0,
        }}
      />

      <CardContent sx={{ p: 3, pb: 1, position: 'relative', zIndex: 1 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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

            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: alpha(statusInfo.color, 0.1),
                color: statusInfo.color,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              <FontAwesome icon={statusInfo.icon} width={14} />
              {statusInfo.text}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.5, minHeight: 40 }}
            >
              {description}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 3, pt: 1 }}>
        <Button
          fullWidth
          variant={isActive ? 'contained' : 'outlined'}
          color={variant}
          endIcon={<FontAwesome icon="fas fa-chevron-right" width={14} />}
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

const PAYMENT_METHODS = [
  {
    id: 'stripe',
    title: 'Configuration Stripe',
    description:
      'Configurez votre intégration Stripe pour traiter les paiements en ligne de manière sécurisée',
    icon: 'fab fa-stripe',
    variant: 'info' as const,
  },
  {
    id: 'credit_card',
    title: 'Cartes Bancaires',
    description: 'Configurez les options de paiement par carte bancaire avec sécurité avancée',
    icon: 'fas fa-credit-card',
    variant: 'primary' as const,
  },
  {
    id: 'bank_transfer',
    title: 'Virements Bancaires',
    description: 'Configurez les comptes bancaires pour recevoir les virements directement',
    icon: 'fas fa-university',
    variant: 'success' as const,
  },
];

export default function PaymentConfigurationOverview() {
  const theme = useTheme();

  // Mock status for demonstration - replace with actual hooks
  const getMethodStatus = (methodId: string) => ({
    isConfigured: true, // Replace with actual logic
    isActive: methodId === 'credit_card', // Replace with actual logic
    loading: false,
  });

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
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ position: 'relative', zIndex: 1, mb: 2 }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FontAwesome icon="fas fa-cogs" width={32} />
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Méthodes de paiement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Configurez et gérez vos différentes méthodes de paiement pour accepter les
                transactions
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
                  id={method.id}
                  title={method.title}
                  description={method.description}
                  icon={method.icon}
                  variant={method.variant}
                  isConfigured={status.isConfigured}
                  isActive={status.isActive}
                  loading={status.loading}
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    color: 'info.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                  }}
                >
                  <FontAwesome icon="fas fa-info-circle" width={24} />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  À propos de la configuration des paiements
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <FontAwesome
                      icon="fab fa-stripe"
                      width={20}
                      sx={{ color: 'info.main', mt: 0.2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Configuration Stripe
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configurez vos clés API Stripe pour traiter les paiements de manière
                        sécurisée
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <FontAwesome
                      icon="fas fa-credit-card"
                      width={20}
                      sx={{ color: 'primary.main', mt: 0.2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Cartes Bancaires
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Personnalisez l&apos;expérience de paiement par carte avec sécurité avancée
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                    <FontAwesome
                      icon="fas fa-university"
                      width={20}
                      sx={{ color: 'success.main', mt: 0.2 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                        Virements Bancaires
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Configurez vos comptes bancaires pour recevoir les virements
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
