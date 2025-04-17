import type { IPaymentItem } from 'src/contexts/types/payment';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { useForm, FormProvider as RHFForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import SendIcon from '@mui/icons-material/Send';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PrintIcon from '@mui/icons-material/Print';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { fCurrency } from 'src/utils/format-number';

import { getIntervalLabel } from 'src/shared/_mock';

import { toast } from 'src/shared/components/snackbar';
import { Field } from 'src/shared/components/hook-form';

// ----------------------------------------------------------------------
type Props = {
  open: boolean;
  onClose: () => void;
  payment: IPaymentItem;
};

export function GenerateInvoiceDialog({ open, onClose, payment }: Props) {
  const [previewMode, setPreviewMode] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);

  const defaultValues = useMemo(
    () => ({
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      invoiceDate: format(new Date(), 'dd MMMM yyyy', { locale: fr }),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'dd MMMM yyyy', {
        locale: fr,
      }),
      clientNote:
        payment?.subscriber?.role === 'enterprise'
          ? 'Merci pour votre confiance. Cette facture est due dans les 30 jours suivant sa réception.'
          : 'Merci pour votre confiance.',
      paymentTerms: '30 jours',
      taxRate: 20,
      logoUrl: '/assets/logo.png',
      companyInfo:
        'Votre Entreprise SAS\n123 Avenue des Affaires\n75000 Paris, France\nTVA: FR123456789',
    }),
    [payment]
  );

  const methods = useForm({
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const currentValues = watch();

  // Calcul du montant de la TVA et du total TTC
  const subtotal = payment?.amount || 0;
  const taxAmount = (subtotal * (currentValues.taxRate / 100)).toFixed(2);
  const total = (subtotal + parseFloat(taxAmount)).toFixed(2);

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      // Simuler un appel API pour générer la facture
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Création d'un objet facture
      const invoice = {
        id: `FACT-${Date.now().toString().slice(-8)}`,
        invoiceNumber: data.invoiceNumber,
        invoiceDate: data.invoiceDate,
        dueDate: data.dueDate,
        clientNote: data.clientNote,
        paymentTerms: data.paymentTerms,
        taxRate: data.taxRate,
        subtotal,
        taxAmount,
        total,
        paymentId: payment.id,
        status: 'Émise',
        sentToClient: false,
        createdAt: new Date().toISOString(),
        companyInfo: data.companyInfo,
      };

      console.info('DONNÉES FACTURE GÉNÉRÉE', invoice);
      setInvoiceGenerated(true);
      toast.success('Facture générée avec succès!');

      // Ne pas fermer la boîte de dialogue pour permettre l'envoi de la facture
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la génération de la facture.');
    }
  });

  const handleSendInvoice = async () => {
    try {
      // Simuler un appel API pour envoyer la facture
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(`Facture envoyée avec succès à ${payment.subscriber?.name}`);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue lors de l'envoi de la facture.");
    }
  };

  const handlePrintInvoice = () => {
    toast.info("Préparation de l'impression...");
    // Logique d'impression ici
  };

  const handleDownloadInvoice = () => {
    toast.info('Téléchargement de la facture en PDF...');
    // Logique de téléchargement ici
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (!payment) {
    return null;
  }

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
      >
        <Typography variant="h5">
          {previewMode ? 'Aperçu de la facture' : 'Générer une facture'}
        </Typography>
        <Stack direction="row" spacing={1}>
          {!invoiceGenerated && !previewMode && (
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={togglePreview}
              size="small"
            >
              Aperçu
            </Button>
          )}
          {invoiceGenerated && (
            <>
              <IconButton onClick={handlePrintInvoice} title="Imprimer">
                <PrintIcon />
              </IconButton>
              <IconButton onClick={handleDownloadInvoice} title="Télécharger">
                <DownloadIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </DialogTitle>

      <Divider />

      <RHFForm {...methods}>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
            {previewMode ? (
              <Box sx={{ my: 2 }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    backgroundColor: 'background.paper',
                    position: 'relative',
                    minHeight: '60vh',
                  }}
                >
                  <Typography variant="h4" align="center" sx={{ mb: 5, color: 'primary.main' }}>
                    FACTURE
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        De
                      </Typography>
                      <Typography sx={{ whiteSpace: 'pre-line', mb: 1 }}>
                        {currentValues.companyInfo}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Facturé à
                      </Typography>
                      <Typography sx={{ mb: 0.5 }}>
                        <strong>{payment.subscriber?.name}</strong>
                      </Typography>
                      <Typography variant="body2">
                        {payment.subscriber?.role || 'Adresse non spécifiée'}
                      </Typography>
                      <Typography variant="body2">{payment.subscriber?.role}</Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        N° Facture
                      </Typography>
                      <Typography variant="body2">{currentValues.invoiceNumber}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Date d&apos;émission
                      </Typography>
                      <Typography variant="body2">{currentValues.invoiceDate}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Date d&apos;échéance
                      </Typography>
                      <Typography variant="body2">{currentValues.dueDate}</Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="caption" color="text.secondary">
                        Statut
                      </Typography>
                      <Box sx={{ display: 'flex' }}>
                        <Chip
                          label={payment.status === 'Payé' ? 'Payé' : 'En attente'}
                          color={payment.status === 'Payé' ? 'success' : 'warning'}
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 4, mb: 3 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '60px 1fr 120px 120px',
                          bgcolor: 'primary.main',
                          color: 'primary.contrastText',
                          p: 1.5,
                        }}
                      >
                        <Typography variant="subtitle2">Réf.</Typography>
                        <Typography variant="subtitle2">Description</Typography>
                        <Typography variant="subtitle2" align="right">
                          Période
                        </Typography>
                        <Typography variant="subtitle2" align="right">
                          Montant
                        </Typography>
                      </Box>

                      {payment.subscriptions?.map((subscription, index) => (
                        <Box
                          key={subscription.id || index}
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: '60px 1fr 120px 120px',
                            p: 1.5,
                            '&:not(:last-child)': {
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                            },
                          }}
                        >
                          <Typography variant="body2">#{index + 1}</Typography>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {subscription.title || `Abonnement #${index + 1}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {subscription.fullDescription || 'Aucune description disponible'}
                            </Typography>
                          </Box>
                          <Typography variant="body2" align="right">
                            {getIntervalLabel(subscription.interval) || 'Mensuel'}
                          </Typography>
                          <Typography variant="body2" align="right">
                            {fCurrency(
                              subscription.price[
                                subscription.interval as keyof typeof subscription.price
                              ] || subscription.price.monthly
                            ) || 0}{' '}
                            €
                          </Typography>
                        </Box>
                      ))}
                    </Paper>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Box sx={{ width: '280px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography>Sous-total:</Typography>
                          <Typography>{subtotal.toFixed(2)} €</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography>TVA ({currentValues.taxRate}%):</Typography>
                          <Typography>{taxAmount} €</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Total:
                          </Typography>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {total} €
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 4 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Notes
                    </Typography>
                    <Typography variant="body2">{currentValues.clientNote}</Typography>
                  </Box>

                  <Box sx={{ mt: 4, bgcolor: 'background.neutral', p: 2, borderRadius: 1 }}>
                    <Typography variant="body2" align="center">
                      Ce document a été généré automatiquement et ne nécessite pas de signature.
                    </Typography>
                  </Box>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button variant="outlined" onClick={togglePreview} sx={{ mx: 1 }}>
                    Retour à l&apos;édition
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ my: 2 }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 3,
                    mb: 4,
                    bgcolor: (theme) => theme.palette.background.neutral,
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ mr: 1 }}>
                          Client:
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {payment.subscriber?.name || 'Non spécifié'}
                        </Typography>
                        {payment.invoiceGenerated && (
                          <Chip
                            icon={<CheckCircleIcon />}
                            label="Facture déjà générée"
                            color="info"
                            size="small"
                            sx={{ ml: 2 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        <strong>Nom:</strong> {payment.subscriber?.name || 'Non spécifié'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Role:</strong> {payment.subscriber?.role || 'Non spécifié'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>ID Client:</strong> {payment.subscriber?.id || 'Non spécifié'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Détails du paiement
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>ID Transaction:</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{payment.transactionId}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Méthode:</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">{payment.paymentMethod}</Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Date:</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            {format(new Date(payment.paymentDate), 'dd/MM/yyyy', { locale: fr })}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <Typography variant="body2">
                            <strong>Montant:</strong>
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', color: 'success.main' }}
                          >
                            {payment.amount.toFixed(2)} €
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>

                <Typography variant="h6" sx={{ mb: 3 }}>
                  Informations de facturation
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field.Text
                      name="companyInfo"
                      label="Informations de votre entreprise"
                      multiline
                      rows={4}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="invoiceNumber" label="Numéro de facture" />
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={6}>
                        <Field.Text name="invoiceDate" label="Date d'émission" />
                      </Grid>
                      <Grid item xs={6}>
                        <Field.Text name="dueDate" label="Date d'échéance" />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 4, mb: 3 }}>
                  Récapitulatif des abonnements
                </Typography>

                <Paper
                  variant="outlined"
                  sx={{
                    borderRadius: 1,
                    overflow: 'hidden',
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 120px 120px',
                      bgcolor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.primary.contrastText,
                      p: 2,
                    }}
                  >
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography variant="subtitle2" align="right">
                      Période
                    </Typography>
                    <Typography variant="subtitle2" align="right">
                      Montant
                    </Typography>
                  </Box>

                  {payment.subscriptions?.map((subscription, index) => (
                    <Box
                      key={subscription.id || index}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 120px 120px',
                        p: 2,
                        '&:not(:last-child)': {
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {subscription.title || `Abonnement #${index + 1}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subscription.fullDescription || 'Aucune description disponible'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" align="right">
                        {getIntervalLabel(subscription.interval) || 'Mensuel'}
                      </Typography>
                      <Typography variant="body2" align="right">
                        {fCurrency(
                          subscription.price[
                            subscription.interval as keyof typeof subscription.price
                          ] || subscription.price.monthly
                        ) || 0}{' '}
                        €
                      </Typography>
                    </Box>
                  ))}

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 240px',
                      bgcolor: (theme) => theme.palette.background.neutral,
                      p: 2,
                    }}
                  >
                    <Box />
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Sous-total:</Typography>
                        <Typography variant="body2">{subtotal.toFixed(2)} €</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">TVA ({currentValues.taxRate}%):</Typography>
                        <Typography variant="body2">{taxAmount} €</Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2">Total:</Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {total} €
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="taxRate" label="Taux de TVA (%)" type="number" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field.Text name="paymentTerms" label="Conditions de paiement" />
                  </Grid>
                  <Grid item xs={12}>
                    <Field.Text
                      name="clientNote"
                      label="Note client"
                      multiline
                      rows={3}
                      placeholder="Ajoutez une note personnalisée pour le client..."
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
            {!invoiceGenerated ? (
              <>
                <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 1 }}>
                  Annuler
                </Button>
                {!previewMode && (
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                    }}
                  >
                    Générer la facture
                  </LoadingButton>
                )}
              </>
            ) : (
              <>
                <Button variant="outlined" onClick={onClose}>
                  Fermer
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SendIcon />}
                  onClick={handleSendInvoice}
                  sx={{ ml: 1 }}
                >
                  Envoyer au client
                </Button>
              </>
            )}
          </DialogActions>
        </form>
      </RHFForm>
    </Dialog>
  );
}
