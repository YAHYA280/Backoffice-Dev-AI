import type { IPaymentItem } from 'src/contexts/types/payment';

import React from 'react';
import Link from 'next/link';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faToggleOn,
  faCreditCard,
  faCalendarAlt,
  faFileInvoice,
  faMoneyBillWave,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  List,
  Chip,
  Stack,
  alpha,
  Paper,
  Drawer,
  Avatar,
  styled,
  ListItem,
  useTheme,
  IconButton,
  Typography,
  ListItemText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { varFade } from 'src/shared/components/animate/variants/fade';

// Status colors and labels similar to challenge detail approach
const STATUS_COLORS = {
  success: { bgColor: '#28a745', color: '#FFFFFF', label: 'Réussi' },
  pending: { bgColor: '#FFB300', color: '#FFFFFF', label: 'En attente' },
  failed: { bgColor: '#dc3545', color: '#FFFFFF', label: 'Échoué' },
  refunded: { bgColor: '#17a2b8', color: '#FFFFFF', label: 'Remboursé' },
};
// Options de méthodes de paiement en français
export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Carte de crédit', value: 'credit_card' },
  { label: 'Virement bancaire', value: 'bank_transfer' },
];

// Fonction pour obtenir le libellé français de la méthode de paiement
const getPaymentMethodLabel = (value: string): string => {
  const method = PAYMENT_METHOD_OPTIONS.find((option) => option.value === value);
  return method ? method.label : value;
};
interface PaymentDetailsProps {
  open: boolean;
  onClose: () => void;
  payment: IPaymentItem;
}

// Création d'un style pour rendre les abonnements cliquables
const SubscriptionCard = styled(Paper)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.background.default, 0.8),
  boxShadow: theme.shadows[2],
  overflow: 'hidden',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
    '&::after': {
      opacity: 1,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '6px',
    height: '100%',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.6,
    transition: 'opacity 0.2s ease-in-out',
  },
}));

export const PaymentDetails = ({ open, onClose, payment }: PaymentDetailsProps) => {
  const theme = useTheme();

  // Get status option
  const statusOption = STATUS_COLORS[
    payment.status.toLowerCase() as keyof typeof STATUS_COLORS
  ] || { bgColor: 'rgba(50, 50, 50, 0.6)', color: '#FFFFFF', label: payment.status };

  // Helper to safely format dates
  const safeFormatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return fDate(new Date(dateString));
    } catch (error) {
      return 'Date invalide';
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          p: 0,
          boxShadow: theme.customShadows?.z16,
          overflowY: 'auto',
        },
      }}
    >
      {/* Header with background and icon */}
      <Box
        component={m.div}
        initial="initial"
        animate="animate"
        variants={varFade().in}
        sx={{
          p: 3,
          pb: 5,
          position: 'relative',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.8)} 100%)`,
          color: 'white',
        }}
      >
        <IconButton
          onClick={onClose}
          edge="end"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'white',
            '&:hover': {
              backgroundColor: alpha('#fff', 0.1),
            },
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>

        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha('#fff', 0.9),
              color: 'primary.main',
              boxShadow: theme.customShadows?.z8,
            }}
          >
            <FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              Détails du Paiement
            </Typography>

            <Chip
              label={statusOption.label}
              size="small"
              sx={{
                bgcolor: alpha(statusOption.bgColor, 0.8),
                color: statusOption.color,
                fontWeight: 'fontWeightMedium',
                backdropFilter: 'blur(6px)',
              }}
            />
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Box sx={{ p: 3 }}>
        {/* Payment Summary */}
        <Paper
          component={m.div}
          initial="initial"
          animate="animate"
          variants={varFade().inUp}
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: alpha(theme.palette.primary.lighter, 0.2),
            borderRadius: 2,
          }}
        >
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Montant du Paiement
          </Typography>
          <Typography variant="h4" color="primary.main">
            {fCurrency(payment.amount || 0)}
          </Typography>
        </Paper>

        {/* Subscriber Information */}
        {payment.subscriber && (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Informations de l&apos;Abonné
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                mb: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.z8,
                bgcolor: alpha(theme.palette.background.default, 0.5),
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={payment.subscriber.avatarUrl}
                  alt={payment.subscriber.name}
                  sx={{ width: 56, height: 56 }}
                >
                  {payment.subscriber.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Stack>
                  <Typography variant="subtitle1">{payment.subscriber.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {payment.subscriber.role}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        )}

        {/* Subscription Information */}
        {payment.subscriptions.length > 0 ? (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Abonnements associés
            </Typography>
            <Stack>
              {payment.subscriptions.map((subscription) => (
                <Link
                  key={subscription.id}
                  href={paths.dashboard.abonnements.details(subscription.id)}
                  passHref
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <SubscriptionCard>
                    <Stack spacing={1}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {subscription.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {subscription.fullDescription || 'Aucune description disponible'}
                      </Typography>

                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          label="Abonnement"
                          size="small"
                          sx={{
                            bgcolor: 'background.neutral',
                            fontWeight: 'medium',
                            fontSize: 12,
                          }}
                        />
                        <Typography variant="h6" color="primary.main">
                          {fCurrency(subscription.price?.monthly || 0)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </SubscriptionCard>
                </Link>
              ))}
            </Stack>
          </Box>
        ) : (
          <Paper
            variant="outlined"
            sx={{ p: 3, textAlign: 'center', bgcolor: 'background.neutral' }}
          >
            <Typography variant="body2" color="text.secondary">
              Aucun abonnement trouvé pour ce paiement
            </Typography>
          </Paper>
        )}

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Détails du Paiement
          </Typography>

          <List
            sx={{
              bgcolor: 'background.paper',
              boxShadow: theme.customShadows?.z1,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: 'primary.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarAlt} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de Paiement
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(payment.paymentDate)}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faCreditCard} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Méthode de Paiement
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {payment.paymentMethod
                      ? getPaymentMethodLabel(payment.paymentMethod)
                      : 'Non spécifié'}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: 'info.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faMoneyBillWave} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Numéro de Transaction
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {payment.transactionId || 'Non disponible'}
                  </Typography>
                }
              />
            </ListItem>

            <ListItem
              sx={{
                py: 1.5,
              }}
            >
              <ListItemText
                primary={
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: 'success.main',
                      }}
                    >
                      <FontAwesomeIcon icon={faToggleOn} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Statut
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Box
                    sx={{
                      mt: 0.5,
                      ml: 6,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body1">{statusOption.label}</Typography>
                  </Box>
                }
              />
            </ListItem>
            {payment.invoiceGenerated && payment.invoice && (
              <ListItem
                sx={{
                  py: 1.5,
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                }}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                        }}
                      >
                        <FontAwesomeIcon icon={faFileInvoice} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Facture
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Link href="#" passHref>
                      <Typography variant="body1" sx={{ mt: 0.5, ml: 6, cursor: 'pointer' }}>
                        Voir la facture
                      </Typography>
                    </Link>
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default PaymentDetails;
