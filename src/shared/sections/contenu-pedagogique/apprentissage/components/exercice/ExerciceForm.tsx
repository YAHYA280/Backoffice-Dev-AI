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
  Autocomplete,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

import { STATUT_OPTIONS } from '../../types';

// Available resources options
const RESSOURCE_OPTIONS = ['PDF', 'Audio', 'Vidéo', 'Interactive', 'Image'];

// Form validation schema using Zod
const schema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  statut: z.string().min(1, 'Le statut est requis'),
  ressources: z.array(z.string()).min(1, 'Au moins une ressource est requise'),
});

// Infer the type from the schema
type ExerciceFormData = z.infer<typeof schema>;

interface ExerciceFormProps {
  initialValues?: Partial<ExerciceFormData>;
  onSubmit: (data: ExerciceFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  chapitreId: string;
}

export const ExerciceForm = ({
  initialValues = {
    titre: '',
    description: '',
    statut: 'Brouillon',
    ressources: [],
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  chapitreId,
}: ExerciceFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExerciceFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Controller
            name="titre"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Titre de l'exercice"
                fullWidth
                error={!!errors.titre}
                helperText={errors.titre?.message}
                placeholder="Ex: Le présent de l'indicatif"
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
                placeholder="Ex: Conjuguer les verbes du 1er groupe au présent de l'indicatif"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="statut"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.statut}>
                <InputLabel>Statut</InputLabel>
                <Select
                  {...field}
                  label="Statut"
                  renderValue={(selected) => {
                    const option = STATUT_OPTIONS.find((opt) => opt.value === selected);
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
                  {STATUT_OPTIONS.map((option) => (
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
                {errors.statut && <FormHelperText>{errors.statut.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="ressources"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormControl fullWidth error={!!errors.ressources}>
                <Autocomplete
                  multiple
                  options={RESSOURCE_OPTIONS}
                  value={value}
                  onChange={(_, newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={ref}
                      label="Ressources"
                      error={!!errors.ressources}
                      helperText={errors.ressources?.message}
                    />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={option} {...getTagProps({ index })} size="small" />
                    ))
                  }
                />
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
              {initialValues.titre ? 'Modifier' : 'Ajouter'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
