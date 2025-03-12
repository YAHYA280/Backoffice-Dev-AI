// src/shared/sections/contenu-pedagogique/apprentissage/components/niveau/NiveauForm.tsx
import { z } from 'zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Box, Grid, Stack, Button, TextField, CircularProgress } from '@mui/material';

const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  code: z.string().min(1, 'Le code est requis'),
});

type NiveauFormData = z.infer<typeof schema>;

interface NiveauFormProps {
  initialValues?: NiveauFormData;
  onSubmit: (data: NiveauFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const NiveauForm = ({
  initialValues = {
    nom: '',
    description: '',
    code: '',
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
}: NiveauFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NiveauFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="nom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nom du niveau"
                fullWidth
                error={!!errors.nom}
                helperText={errors.nom?.message}
                placeholder="Ex: CP1 - Cours Préparatoire 1"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Code"
                fullWidth
                error={!!errors.code}
                helperText={errors.code?.message}
                placeholder="Ex: NIV-CP1"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Ex: Premier niveau du cycle préparatoire"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" onClick={onCancel} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {initialValues.nom ? 'Modifier' : 'Ajouter'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
