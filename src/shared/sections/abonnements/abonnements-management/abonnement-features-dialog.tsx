import { z } from 'zod';
import { useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider as RHFForm } from 'react-hook-form';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { toast } from 'src/shared/components/snackbar';
import { Field } from 'src/shared/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AddFeatureDialog({ open, onClose }: Props) {
  const FeatureSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    description: z.string().min(1, 'La description est requise'),
  });

  const defaultValues = useMemo(
    () => ({
      title: '',
      description: '',
    }),
    []
  );

  const methods = useForm({
    resolver: zodResolver(FeatureSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      onClose();
      toast.success('Nouvelle fonctionnalité ajoutée avec succès!');
      console.info('DONNÉES', data);
    } catch (error) {
      console.error(error);
      toast.error('Une erreur est survenue lors de la soumission.');
    }
  });

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <RHFForm {...methods}>
        <form onSubmit={handleFormSubmit}>
          <DialogTitle>Ajouter une nouvelle fonctionnalité</DialogTitle>
          <DialogContent>
            <Box display="grid" rowGap={3} paddingTop="2vh">
              <Field.Text name="title" label="Titre" />
              <Field.Text name="description" label="Description" multiline rows={4} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="primary" onClick={onClose}>
              Annuler
            </Button>
            <LoadingButton
              type="button"
              color="primary"
              variant="contained"
              loading={isSubmitting}
              onClick={handleFormSubmit}
            >
              Ajouter
            </LoadingButton>
          </DialogActions>
        </form>
      </RHFForm>
    </Dialog>
  );
}
