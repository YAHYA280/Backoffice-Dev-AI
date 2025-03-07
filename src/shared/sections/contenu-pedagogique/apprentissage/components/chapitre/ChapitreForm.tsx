'use client';

import { z } from 'zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Box,
  Grid,
  Chip,
  Stack,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

import { DIFFICULTE_OPTIONS } from '../../types';

// Form validation schema using Zod
const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  ordre: z
    .number()
    .positive("L'ordre doit être un nombre positif")
    .int("L'ordre doit être un nombre entier")
    .or(
      z
        .string()
        .regex(/^\d+$/, "L'ordre doit être un nombre")
        .transform((val) => parseInt(val, 10))
    ),
  difficulte: z.string().min(1, 'La difficulté est requise'),
});

// Infer the type from the schema
type ChapitreFormData = z.infer<typeof schema>;

interface ChapitreFormProps {
  initialValues?: Partial<ChapitreFormData>;
  onSubmit: (data: ChapitreFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  matiereId: string;
}

export const ChapitreForm = ({
  initialValues = {
    nom: '',
    description: '',
    ordre: 1,
    difficulte: 'Moyen',
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  matiereId,
}: ChapitreFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ChapitreFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={3}>
          <Controller
            name="ordre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Ordre"
                fullWidth
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                error={!!errors.ordre}
                helperText={errors.ordre?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <Controller
            name="nom"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nom du chapitre"
                fullWidth
                error={!!errors.nom}
                helperText={errors.nom?.message}
                placeholder="Ex: Grammaire"
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
                placeholder="Ex: Règles grammaticales de base et construction de phrases"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="difficulte"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.difficulte}>
                <InputLabel>Difficulté</InputLabel>
                <Select
                  {...field}
                  label="Difficulté"
                  renderValue={(selected) => {
                    const option = DIFFICULTE_OPTIONS.find((opt) => opt.value === selected);
                    return (
                      <Chip
                        size="small"
                        label={option?.label}
                        sx={{
                          backgroundColor: option?.bgColor,
                          color: option?.color,
                        }}
                      />
                    );
                  }}
                >
                  {DIFFICULTE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Chip
                        size="small"
                        label={option.label}
                        sx={{
                          backgroundColor: option.bgColor,
                          color: option.color,
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
                {errors.difficulte && <FormHelperText>{errors.difficulte.message}</FormHelperText>}
              </FormControl>
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
