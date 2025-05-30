import type { ISubscriberItem } from 'src/contexts/types/subscriber';

import Link from 'next/link';
import { m } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faHistory,
  faReceipt,
  faEnvelope,
  faToggleOn,
  faCreditCard,
  faCalendarAlt,
  faMapMarkerAlt,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Chip,
  List,
  Stack,
  Paper,
  Avatar,
  ListItem,
  Typography,
  ListItemText,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { Scrollbar } from 'src/shared/components/scrollbar';
import { varFade } from 'src/shared/components/animate/variants/fade';

import { SubscriberDetailsToolbar } from './subscriber-details-toolbar';

// ----------------------------------------------------------------------

// Options de méthodes de paiement en français
export const PAYMENT_METHOD_OPTIONS = [
  { label: 'Carte de crédit', value: 'credit_card' },
  { label: 'Virement bancaire', value: 'bank_transfer' },
];

// Options de cycles de facturation
export const BILLING_CYCLE_OPTIONS = [
  { label: 'Mensuel', value: 'monthly' },
  { label: 'Trimestriel', value: 'quarterly' },
  { label: 'Annuel', value: 'yearly' },
];

// Fonction pour obtenir le libellé français de la méthode de paiement
const getPaymentMethodLabel = (value: string): string => {
  const method = PAYMENT_METHOD_OPTIONS.find((option) => option.value === value);
  return method ? method.label : value;
};

// Fonction pour obtenir le libellé français du cycle de facturation
const getBillingCycleLabel = (value: string): string => {
  const cycle = BILLING_CYCLE_OPTIONS.find((option) => option.value === value);
  return cycle ? cycle.label : value;
};

// Création d'un style pour rendre les abonnements cliquables

// ----------------------------------------------------------------------

type Props = {
  subscriber: ISubscriberItem;
  openDetails: {
    value: boolean;
    onTrue: () => void;
    onFalse: () => void;
  };

  onDeleteSubscriber: (id: string) => void;
  onCloseDetails: () => void;
};

export function SubscriberDetails({
  subscriber,
  openDetails,
  onDeleteSubscriber,
  onCloseDetails,
}: Props) {
  const theme = useTheme();

  // Generate initials from subscriber name
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].substring(0, 2);
  };

  return (
    <Drawer
      anchor="right"
      open={openDetails.value}
      onClose={onCloseDetails}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 450 },
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
            {getInitials(subscriber.name)}
          </Avatar>

          <Box>
            <Typography variant="h5" fontWeight="fontWeightBold" gutterBottom>
              {subscriber.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={subscriber.email}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 'fontWeightMedium',
                  backdropFilter: 'blur(6px)',
                  maxWidth: 200,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              />

              <Chip
                label={
                  subscriber.status === 'active'
                    ? 'Actif'
                    : subscriber.status === 'pending'
                      ? 'En attente'
                      : 'Inactif'
                }
                size="small"
                sx={{
                  bgcolor: alpha(
                    subscriber.status === 'active'
                      ? theme.palette.success.main
                      : subscriber.status === 'pending'
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                    0.7
                  ),
                  color: 'white',
                  fontWeight: 'fontWeightMedium',
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Main content */}
      <Scrollbar sx={{ height: 'calc(100% - 140px)' }}>
        <Box sx={{ p: 3 }}>
          {/* Information Cards */}
          <Stack
            component={m.div}
            initial="initial"
            animate="animate"
            variants={varFade().inUp}
            direction="row"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: theme.customShadows?.z8,
                bgcolor: alpha(theme.palette.info.lighter, 0.5),
              }}
            >
              <FontAwesomeIcon
                icon={faReceipt}
                style={{
                  color: theme.palette.info.main,
                  fontSize: 24,
                  marginBottom: 8,
                }}
              />
              <Typography variant="h5" color="text.primary">
                {subscriber.subscriptions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Abonnements
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                flex: 1,
                textAlign: 'center',
                borderRadius: 2,
                boxShadow: theme.customShadows?.z8,
                bgcolor: alpha(theme.palette.success.lighter, 0.5),
              }}
            >
              <FontAwesomeIcon
                icon={faFileInvoiceDollar}
                style={{
                  color: theme.palette.success.main,
                  fontSize: 24,
                  marginBottom: 8,
                }}
              />
              <Typography variant="h5" color="text.primary">
                {getBillingCycleLabel(subscriber.billingCycle)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cycle de facturation
              </Typography>
            </Paper>
          </Stack>

          {/* Detailed Information List */}
          <Box component={m.div} initial="initial" animate="animate" variants={varFade().inUp}>
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Informations personnelles
            </Typography>

            <List
              sx={{
                bgcolor: 'background.paper',
                boxShadow: theme.customShadows?.z1,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3,
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
                        <FontAwesomeIcon icon={faEnvelope} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {subscriber.email}
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
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.main',
                        }}
                      >
                        <FontAwesomeIcon icon={faPhone} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Téléphone
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {subscriber.phone || 'Non spécifié'}
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
                        <FontAwesomeIcon icon={faMapMarkerAlt} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Adresse
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {subscriber.address || 'Non spécifiée'}
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Informations d&apos;abonnement
            </Typography>

            <List
              sx={{
                bgcolor: 'background.paper',
                boxShadow: theme.customShadows?.z1,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3,
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
                        Période d&apos;abonnement
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      Du {fDate(subscriber.subscriptionStartDate)} au{' '}
                      {fDate(subscriber.subscriptionEndDate)}
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
                          bgcolor: alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.main',
                        }}
                      >
                        <FontAwesomeIcon icon={faReceipt} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Cycle de facturation
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {getBillingCycleLabel(subscriber.billingCycle)}
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
                        Méthode de paiement
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {getPaymentMethodLabel(subscriber.paymentMethod)}
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
                        <FontAwesomeIcon icon={faHistory} size="sm" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Dernier paiement
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography variant="body1" sx={{ mt: 0.5, ml: 6 }}>
                      {fDate(subscriber.lastPaymentDate)}
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
                    <Box sx={{ mt: 0.5, ml: 6, display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={
                          subscriber.status === 'active'
                            ? 'Actif'
                            : subscriber.status === 'pending'
                              ? 'En attente'
                              : 'Inactif'
                        }
                        size="small"
                        sx={{
                          color: 'white',
                          bgcolor:
                            subscriber.status === 'active'
                              ? 'success.main'
                              : subscriber.status === 'pending'
                                ? 'warning.main'
                                : 'error.main',
                          fontWeight: 'bold',
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            </List>

            {/* Subscriptions */}
            <Typography variant="subtitle1" gutterBottom fontWeight="fontWeightBold" sx={{ mb: 2 }}>
              Abonnements associés
            </Typography>

            {subscriber.subscriptions.length > 0 ? (
              <Stack
                component={m.div}
                initial="initial"
                animate="animate"
                variants={varFade().inUp}
              >
                {subscriber.subscriptions.map((subscription) => (
                  <Link
                    key={subscription.id}
                    href={paths.dashboard.abonnements.details(subscription.id)}
                    passHref
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        mb: 2,
                        borderRadius: 2,
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: theme.customShadows?.z8,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.customShadows?.z16,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '6px',
                          height: '100%',
                          backgroundColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {subscription.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxHeight: 80,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {subscription.shortDescription || 'Aucune description disponible'}
                        </Typography>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" color="primary.main" fontWeight="bold">
                            {`${subscription.price?.monthly || 0} €`}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Link>
                ))}
              </Stack>
            ) : (
              <Paper
                component={m.div}
                initial="initial"
                animate="animate"
                variants={varFade().inUp}
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  boxShadow: theme.customShadows?.z8,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Aucun abonnement trouvé pour cet abonné
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Scrollbar>

      {/* Toolbar (overlay with toolbar) */}
      <SubscriberDetailsToolbar
        onDelete={onDeleteSubscriber}
        onCloseDetails={onCloseDetails}
        subscriber={subscriber}
      />
    </Drawer>
  );
}
