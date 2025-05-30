import type { IPaymentItem } from 'src/contexts/types/payment';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useMemo, useState } from 'react';
import { useForm, FormProvider as RHFForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { fCurrency } from 'src/utils/format-number';

import { getIntervalLabel } from 'src/shared/_mock';

import { toast } from 'src/shared/components/snackbar';

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
      toast.success('Facture téléchargée avec succès!');

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

      <RHFForm {...methods}>
        <form onSubmit={handleFormSubmit}>
          <DialogContent>
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
              </Box>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2 }}>
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={onClose}
                  sx={{ borderRadius: 1 }}
                >
                  Annuler
                </Button>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    sx={{
                      borderRadius: 1,
                      px: 3,
                    }}
                  >
                    Télécharger la facture
                  </LoadingButton>
              </>
          </DialogActions>
        </form>
      </RHFForm>
    </Dialog>
  );
}
