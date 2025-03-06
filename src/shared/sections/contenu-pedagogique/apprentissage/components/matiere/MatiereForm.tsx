'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Grid,
  TextField,
  Stack,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Typography,
  Avatar,
} from '@mui/material';
import { Matiere, MATIERE_COLORS } from '../../types';

// Form validation schema using Zod
const schema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  couleur: z.string().min(1, 'Veuillez sélectionner une couleur'),
  icon: z.string().min(1, 'Veuillez sélectionner une icône'),
});

// Infer the type from the schema
type MatiereFormData = z.infer<typeof schema>;

interface MatiereFormProps {
  initialValues?: Partial<MatiereFormData>;
  onSubmit: (data: MatiereFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  niveauId: string;
}

export const MatiereForm = ({
  initialValues = {
    nom: '',
    description: '',
    couleur: '',
    icon: '',
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  niveauId,
}: MatiereFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MatiereFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  // Selected color and icon
  const selectedColor = watch('couleur');
  const selectedIcon = watch('icon');

  const handleColorSelect = (color: string, icon: string) => {
    setValue('couleur', color, { shouldValidate: true });
    setValue('icon', icon, { shouldValidate: true });
  };

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
                label="Nom de la matière"
                fullWidth
                error={!!errors.nom}
                helperText={errors.nom?.message}
                placeholder="Ex: Mathématiques"
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
                placeholder="Ex: Apprentissage des fondements mathématiques"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl error={!!errors.couleur || !!errors.icon} fullWidth>
            <Typography variant="subtitle2" gutterBottom>
              Couleur et icône
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 1 }}>
              {MATIERE_COLORS.map((colorOption) => (
                <Box
                  key={colorOption.couleur}
                  onClick={() => handleColorSelect(colorOption.couleur, colorOption.icon)}
                  sx={{
                    p: 0.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: (theme) =>
                      selectedColor === colorOption.couleur
                        ? `2px solid ${theme.palette.primary.main}`
                        : '2px solid transparent',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: colorOption.couleur,
                      color: '#fff',
                      width: 40,
                      height: 40,
                      fontSize: '1rem',
                    }}
                  >
                    {colorOption.icon}
                  </Avatar>
                </Box>
              ))}
            </Stack>
            {(errors.couleur || errors.icon) && (
              <FormHelperText>Veuillez sélectionner une couleur et une icône</FormHelperText>
            )}
          </FormControl>
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
