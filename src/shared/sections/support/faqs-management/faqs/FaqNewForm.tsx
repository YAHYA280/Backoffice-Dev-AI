'use client';

import dayjs from 'dayjs';
import { z as zod } from 'zod';
import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingButton from '@mui/lab/LoadingButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Grid,
  Dialog,
  Button,
  Select,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/shared/components/snackbar';
import { Form } from 'src/shared/components/hook-form';

export const _STATUS_FAQs = [
  { value: 'Publié', label: 'Publié' },
  { value: 'Brouillion', label: 'Brouillion' },
  { value: 'Archivé', label: 'Archivé' },
];

export const __Categories = [
  { value: 'Compte', label: 'Compte' },
  { value: 'Facturation', label: 'Facturation' },
  { value: 'Sécurité', label: 'Sécurité' },
];

export const NewFaqSchema = zod.object({
  title: zod.string().min(1, { message: 'Le titre est requis.' }),
  reponse: zod.string().min(1, { message: 'La réponse est requise.' }),
  categorie: zod.string().min(1, { message: 'La catégorie est requise.' }),
  statut: zod.string().min(1, { message: 'Le statut est requis.' }),
  datePublication: zod.string().min(1, { message: 'La date de création est requise.' }),
});

export type NewFaqSchemaType = zod.infer<typeof NewFaqSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function FaqNewForm({ open, onClose }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: '',
      reponse: '',
      categorie: '',
      statut: '',
      datePublication: '',
    }),
    []
  );

  const methods = useForm<NewFaqSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewFaqSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('FAQ créée avec succès !');
      reset();
      onClose();
      router.push(paths.dashboard.support.faqs);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer une nouvelle FAQ</DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Titre"
                {...methods.register('title')}
                error={!!methods.formState.errors.title}
                helperText={methods.formState.errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth
                label="Réponse"
                multiline
                rows={4}
                {...methods.register('reponse')}
                error={!!methods.formState.errors.reponse}
                helperText={methods.formState.errors.reponse?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!methods.formState.errors.categorie}>
                <InputLabel id="faq-categorie-label">Catégorie</InputLabel>
                <Controller
                  name="categorie"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="faq-categorie-label" label="Catégorie" {...field} value={field.value || ''}>
                      {__Categories.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {methods.formState.errors.categorie ? (
                  <Typography variant="caption" color="error">
                    {methods.formState.errors.categorie.message}
                  </Typography>
                ):(
                  <>
                  </>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!methods.formState.errors.statut}>
                <InputLabel id="faq-statut-label">Statut</InputLabel>
                <Controller
                  name="statut"
                  control={control}
                  render={({ field }) => (
                    <Select labelId="faq-statut-label" label="Statut" {...field} value={field.value || ''}>
                      {_STATUS_FAQs.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {methods.formState.errors.statut ? (
                  <Typography variant="caption" color="error">
                    {methods.formState.errors.statut.message}
                  </Typography>
                ):(
                  <>
                  </>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="datePublication"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Date de création"
                    value={field.value ? dayjs(field.value, 'DD/MM/YYYY') : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(newValue.format('DD/MM/YYYY'));
                      } else {
                        field.onChange('');
                      }
                    }}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(fieldState.error),
                        helperText: fieldState.error?.message,
                      },
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <LoadingButton onClick={onSubmit} variant="contained" loading={isSubmitting} color="primary">
          Créer une FAQ
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}