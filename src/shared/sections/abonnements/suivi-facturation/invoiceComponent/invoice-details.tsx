import type { IInvoice } from 'src/contexts/types/invoice';

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

// Status colors and labels
const STATUS_COLORS = {
  success: { bgColor: '#28a745', color: '#FFFFFF', label: 'Payée' },
  pending: { bgColor: '#FFB300', color: '#FFFFFF', label: 'En attente' },
  failed: { bgColor: '#dc3545', color: '#FFFFFF', label: 'Échoué' },
  refunded: { bgColor: '#17a2b8', color: '#FFFFFF', label: 'Remboursée' },
};
// Options de méthodes de paiement en français
export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Carte de crédit', value: 'credit_card' },
  { label: 'Virement bancaire', value: 'bank_transfer' },
];
const getPaymentMethodLabel = (value: string): string => {
  const method = PAYMENT_METHOD_OPTIONS.find((option) => option.value === value);
  return method ? method.label : value;
};

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

type Props = {
  invoice: IInvoice;
  openDetails: {
    value: boolean;
    onTrue: () => void;
    onFalse: () => void;
  };
  onCloseDetails: () => void;
};

export function InvoiceDetails({ invoice, openDetails, onCloseDetails }: Props) {
  const theme = useTheme();

  // Get status option
  const statusOption = STATUS_COLORS[
    (invoice.status?.toLowerCase() || 'pending') as keyof typeof STATUS_COLORS
  ] || { bgColor: 'rgba(50, 50, 50, 0.6)', color: '#FFFFFF', label: invoice.status || 'Inconnu' };

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
      open={openDetails.value}
      onClose={onCloseDetails}
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
          onClick={onCloseDetails}
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
              Détails de la Facture
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
        {/* Invoice Amount Summary */}
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
            Montant de la Facture
          </Typography>
          <Typography variant="h4" color="primary.main">
            {fCurrency(invoice.amount || 0)}
          </Typography>
        </Paper>

        {/* Subscriber Information */}
        {invoice.subscriber && (
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
                  src={invoice.subscriber.avatarUrl}
                  alt={invoice.subscriber.name}
                  sx={{ width: 56, height: 56 }}
                >
                  {invoice.subscriber.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Stack>
                  <Typography variant="subtitle1">{invoice.subscriber.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {invoice.subscriber.role}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>
        )}

        {/* Subscriptions Information */}
        {invoice.subscriptions && invoice.subscriptions.length > 0 ? (
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Abonnements associés
            </Typography>
            <Stack>
              {invoice.subscriptions.map((subscription) => (
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
                          {fCurrency(subscription.price?.amount || 0)}
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
              Aucun abonnement trouvé pour cette facture
            </Typography>
          </Paper>
        )}

        {/* Detailed Information List */}
        <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
          <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
            Détails de la Facture
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
                      Date de Création
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {safeFormatDate(invoice.createDate)}
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
                    {invoice.payment?.paymentMethod
                      ? getPaymentMethodLabel(invoice.payment.paymentMethod)
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
                      <FontAwesomeIcon icon={faFileInvoice} size="sm" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Numéro de Facture
                    </Typography>
                  </Stack>
                }
                secondary={
                  <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                    {invoice.invoiceNumber || 'Non disponible'}
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

            {/* Affichage des informations de remboursement si disponibles */}
            {invoice.refundAmount && (
              <>
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
                          Montant remboursé
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
                        <Typography variant="body1">
                          {' '}
                          {invoice.refundAmount ? fCurrency(invoice.refundAmount) : 0}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {invoice.refundDate && (
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
                            Date remboursement
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
                          <Typography variant="body1">
                            {invoice.refundDate ? fDate(invoice.refundDate) : 'Non disponible'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )}

                {invoice.refundReason && (
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
                            Raison
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
                          <Typography variant="body1">{invoice.refundReason}</Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                )}
              </>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
}
