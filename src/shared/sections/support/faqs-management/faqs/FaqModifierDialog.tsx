'use client';

import type { IDateValue } from 'src/contexts/types/common';

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
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/shared/components/snackbar';
import { Form } from 'src/shared/components/hook-form';

const STATUS_OPTIONS = [
  { value: 'Publié', label: 'Publié' },
  { value: 'Brouillion', label: 'Brouillion' },
  { value: 'Archivé', label: 'Archivé' },
];

const CATEGORY_OPTIONS = [
  { value: 'Compte', label: 'Compte' },
  { value: 'Facturation', label: 'Facturation' },
  { value: 'Sécurité', label: 'Sécurité' },
];

export const ModifierFaqSchema = zod.object({
  title: zod.string().min(1, { message: 'Le titre est requis.' }),
  reponse: zod.string().min(1, { message: 'La réponse est requise.' }),
  categorie: zod.string().min(1, { message: 'La catégorie est requise.' }),
  statut: zod.string().min(1, { message: 'Le statut est requis.' }),
  datePublication: zod.string().min(1, { message: 'La date de création est requise.' }),
});

export type ModifierFaqSchemaType = zod.infer<typeof ModifierFaqSchema>;

type Props = {
  open: boolean;
  onClose: () => void;
  currentFaq: {
    id: string;
    title: string;
    reponse: string | null | undefined;
    categorie: string;
    statut: string;
    datePublication: IDateValue;
  };
};

export function FaqModifierDialog({ open, onClose, currentFaq }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      title: currentFaq.title,
      reponse: currentFaq.reponse ?? '',
      categorie: currentFaq.categorie,
      statut: currentFaq.statut,
      datePublication:
        currentFaq.datePublication !== null && currentFaq.datePublication !== undefined
          ? String(currentFaq.datePublication)
          : '',
    }),
    [currentFaq]
  );

  const methods = useForm<ModifierFaqSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(ModifierFaqSchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('FAQ modifiée avec succès !');
      reset();
      onClose();
      router.push(paths.dashboard.support.faqs);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier la FAQ</DialogTitle>
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
                      {CATEGORY_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
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
                      {STATUS_OPTIONS.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
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
                    label="Date de créations"
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
          Enregistrer les modifications
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}