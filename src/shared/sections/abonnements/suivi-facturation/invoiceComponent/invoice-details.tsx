import type { IInvoice } from 'src/contexts/types/invoice';

import Link from 'next/link';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { alpha, styled } from '@mui/material/styles';
import { Chip, Stack, Paper, Avatar, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { Scrollbar } from 'src/shared/components/scrollbar';

import { InvoiceDetailsToolbar } from './invoice-details-toolbar';

// ----------------------------------------------------------------------
// Status color mapping
const STATUS_COLORS = {
  all: 'rgba(50, 50, 50, 0.6)',
  success: '#28a745',
  paid: '#28a745',
  failed: '#424242',
  cancelled: '#C62828',
  pending: '#FFB300',
  overdue: '#E53935',
  partial: '#039BE5',
  refunded: '#388E3C',
};

// Traductions des statuts
const STATUS_LABELS = {
  paid: 'Payée',
  pending: 'En attente',
  partial: 'Partiellement payée',
  refunded: 'Remboursée',
  failed: 'Échoué',
};

// Traductions des statuts
const PAYMENT_STATUS_LABELS = {
  success: 'Réussi',
  pending: 'En attente',
  refunded: 'Remboursée',
  failed: 'Échoué',
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
const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 120,
  flexShrink: 0,
  color: theme.vars.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

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

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: 18,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 40,
    height: 3,
    backgroundColor: theme.palette.primary.main,
  },
}));

const SubscriberCard = styled(Paper)(({ theme }) => ({
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
  },
}));

const DetailContainer = styled(Box)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

type Props = {
  invoice: IInvoice;
  openDetails: {
    value: boolean;
    onTrue: () => void;
    onFalse: () => void;
  };
  onDeleteInvoice: (id: string) => void;
  onCloseDetails: () => void;
};

export function InvoiceDetails({ invoice, openDetails, onDeleteInvoice, onCloseDetails }: Props) {
  const renderStatus = (status: string) => {
    const statusValue = status || 'pending';
    const lowerStatus = statusValue.toLowerCase();
    const backgroundColor =
      STATUS_COLORS[lowerStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.all;

    // Utiliser le label traduit ou le status original si aucune traduction n'est trouvée
    const label = STATUS_LABELS[lowerStatus as keyof typeof STATUS_LABELS] || status;

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          color: '#FFFFFF',
          backgroundColor,
          fontWeight: 'bold',
          px: 1,
          height: 28,
        }}
      />
    );
  };
  const renderPaymentStatus = (status: string) => {
    const statusValue = status || 'pending';
    const lowerStatus = statusValue.toLowerCase();
    const backgroundColor =
      STATUS_COLORS[lowerStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.all;
    const label =
      PAYMENT_STATUS_LABELS[lowerStatus as keyof typeof PAYMENT_STATUS_LABELS] || status;

    return (
      <Chip
        label={label}
        size="small"
        sx={{
          color: '#FFFFFF',
          backgroundColor,
          fontWeight: 'bold',
          px: 1,
          height: 28,
        }}
      />
    );
  };

  const renderToolbar = (
    <InvoiceDetailsToolbar
      onDelete={onDeleteInvoice}
      onCloseDetails={onCloseDetails}
      invoice={invoice}
    />
  );

  const renderTabOverview = (
    <Stack spacing={4} sx={{ px: 1 }}>
      <Box>
        <SectionTitle variant="h6">Détails de la facture</SectionTitle>
        <DetailContainer>
          <Stack spacing={2.5}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <StyledLabel>N° Facture</StyledLabel>
                <Typography variant="body1" fontWeight="medium">
                  {invoice.invoiceNumber || 'Non spécifié'}
                </Typography>
              </Stack>
              {renderStatus(invoice.status)}
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center">
              <StyledLabel>Date création</StyledLabel>
              <Typography variant="body2">
                {' '}
                {invoice.createDate ? fDate(invoice.createDate) : 'Non spécifié'}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <StyledLabel>Dernière Mise à jour</StyledLabel>
              <Typography variant="body2">
                {invoice.updatedDate ? fDate(invoice.updatedDate) : fDate(invoice.createDate)}
              </Typography>
            </Stack>

            {/* Ajout de l'information de paiement */}
            <Stack direction="row" alignItems="center">
              <StyledLabel>Méthode de paiement</StyledLabel>
              <Typography variant="body2">
                {invoice.payment?.paymentMethod
                  ? getPaymentMethodLabel(invoice.payment.paymentMethod)
                  : 'Non spécifié'}
              </Typography>
            </Stack>

            {/* Affichage des informations de remboursement si disponibles */}
            {invoice.refundAmount && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Stack direction="row" alignItems="center">
                  <StyledLabel>Montant remboursé</StyledLabel>
                  <Typography variant="body2" color="error.main">
                    {invoice.refundAmount ? fCurrency(invoice.refundAmount) : 0}
                  </Typography>
                </Stack>
                {invoice.refundDate && (
                  <Stack direction="row" alignItems="center">
                    <StyledLabel>Date remboursement</StyledLabel>
                    <Typography variant="body2">
                      {invoice.refundDate ? fDate(invoice.refundDate) : 'Non disponible'}
                    </Typography>
                  </Stack>
                )}
                {invoice.refundReason && (
                  <Stack direction="row" alignItems="flex-start">
                    <StyledLabel>Raison</StyledLabel>
                    <Typography variant="body2">{invoice.refundReason}</Typography>
                  </Stack>
                )}
              </>
            )}

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <StyledLabel>Montant Total</StyledLabel>
              <Typography variant="h6" color="primary.main">
                {invoice.amount ? fCurrency(invoice.amount) : fCurrency(0)}
              </Typography>
            </Stack>

            {/* Ajout des notes si disponibles */}
            {invoice.notes && (
              <>
                <Divider sx={{ borderStyle: 'dashed' }} />
                <Stack direction="row" alignItems="flex-start">
                  <StyledLabel>Notes</StyledLabel>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {invoice.notes ? invoice.notes : 'Non disponible'}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </DetailContainer>
      </Box>

      <Box>
        <SectionTitle variant="h6">Informations de l&apos;abonné</SectionTitle>
        {invoice.subscriber ? (
          <Link
            key={invoice.subscriber.id}
            href={paths.dashboard.abonnements.details(invoice.subscriber.id)}
            passHref
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <SubscriberCard>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={invoice.subscriber.avatarUrl}
                    alt={invoice.subscriber.name}
                    sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                  >
                    {invoice.subscriber.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {invoice.subscriber.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {invoice.subscriber.role}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </SubscriberCard>
          </Link>
        ) : (
          <Typography variant="body2" color="text.secondary" align="center" py={3}>
            Aucune information sur l&apos;abonné
          </Typography>
        )}
      </Box>

      <Box>
        <SectionTitle variant="h6">Abonnements associés</SectionTitle>

        {invoice.subscriptions && invoice.subscriptions.length > 0 ? (
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
      </Box>

      {/* Ajout de la section pour les détails de paiement */}
      <Box>
        <SectionTitle variant="h6">Détails du paiement</SectionTitle>
        <DetailContainer>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center">
              <StyledLabel>Méthode</StyledLabel>
              <Typography variant="body2">
                {invoice.payment?.paymentMethod
                  ? getPaymentMethodLabel(invoice.payment.paymentMethod)
                  : 'Non spécifié'}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center">
              <StyledLabel>État</StyledLabel>
              <Typography variant="body2">
                {invoice.payment?.status
                  ? renderPaymentStatus(invoice.payment.status)
                  : renderPaymentStatus('pending')}
              </Typography>
            </Stack>

            {invoice.payment?.paymentDate && (
              <Stack direction="row" alignItems="center">
                <StyledLabel>Date</StyledLabel>
                <Typography variant="body2">{fDate(invoice.payment?.paymentDate)}</Typography>
              </Stack>
            )}

            {invoice.payment?.transactionId && (
              <Stack direction="row" alignItems="center">
                <StyledLabel>ID Transaction</StyledLabel>
                <Typography variant="body2">
                  {invoice.payment?.transactionId || 'Non spécifié'}
                </Typography>
              </Stack>
            )}
          </Stack>
        </DetailContainer>
      </Box>
    </Stack>
  );

  return (
    <Drawer
      open={openDetails.value}
      onClose={onCloseDetails}
      anchor="right"
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{
        sx: {
          width: { xs: 1, sm: 480 },
          boxShadow: (theme) => theme.shadows[24],
          bgcolor: (theme) => alpha(theme.palette.background.default, 0.95),
        },
      }}
    >
      {renderToolbar}
      <Scrollbar fillContent sx={{ py: 3, px: 2.5 }}>
        {renderTabOverview}
      </Scrollbar>
    </Drawer>
  );
}
