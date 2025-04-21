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
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { toast } from 'src/shared/components/snackbar';
import { Form } from 'src/shared/components/hook-form';

export const NewCategorySchema = zod.object({
  titre: zod.string().min(1, { message: 'Le titre est requis.' }),
  description: zod.string().min(1, { message: 'La description est requise.' }),
  dateCreation: zod.string().min(1, { message: 'La date de création est requise.' }),
});

export type NewCategorySchemaType = zod.infer<typeof NewCategorySchema>;

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CategoryNewDialog({ open, onClose }: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      titre: '',
      description: '',
      dateCreation: '',
    }),
    []
  );

  const methods = useForm<NewCategorySchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewCategorySchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Catégorie créée avec succès !');
      reset();
      onClose();
      router.push(paths.dashboard.support.faqs);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
      <DialogContent>
        <Form methods={methods} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre"
                {...methods.register('titre')}
                error={!!methods.formState.errors.titre}
                helperText={methods.formState.errors.titre?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...methods.register('description')}
                error={!!methods.formState.errors.description}
                helperText={methods.formState.errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="dateCreation"
                control={control}
                render={({ field, fieldState }) => (
                  <DatePicker
                    label="Date de Création"
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
        <Button onClick={onClose} variant="outlined" color="primary">
          Annuler
        </Button>
        <LoadingButton
          onClick={onSubmit}
          variant="contained"
          loading={isSubmitting}
          color="primary"
        >
          Créer une catégorie
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
