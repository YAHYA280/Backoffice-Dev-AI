'use client';

import { z } from 'zod';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Stack,
  alpha,
  Button,
  Avatar,
  Switch,
  Tooltip,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

import { MATIERE_COLORS } from '../../types';

const schema = z.object({
  nom: z
    .string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(300, 'La description ne peut pas dépasser 300 caractères'),
  couleur: z.string().min(1, 'Veuillez sélectionner une couleur'),
  icon: z.string().min(1, 'Veuillez sélectionner une icône'),
  active: z.boolean().optional().default(true),
  exercicesEstimes: z
    .number()
    .min(0, "Le nombre d'exercices ne peut pas être négatif")
    .max(100, "Le nombre d'exercices ne peut pas dépasser 100")
    .optional(),
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

export const MatiereForm: React.FC<MatiereFormProps> = ({
  initialValues = {
    nom: '',
    description: '',
    couleur: '',
    icon: '',
    active: true,
    exercicesEstimes: 0,
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  niveauId,
}) => {
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

  const selectedColor = watch('couleur');
  const active = watch('active');
  const description = watch('description', '');

  const handleColorSelect = (color: string) => {
    setValue('couleur', color, { shouldValidate: true });
  };

  const handleFormSubmit = (data: MatiereFormData) => {
    onSubmit({
      ...data,
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows?.z8,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: selectedColor
            ? `linear-gradient(to right, ${selectedColor}, ${alpha(selectedColor, 0.7)})`
            : 'linear-gradient(to right, #2065D1, #90CAF9)',
        }}
      />

      <Grid
        container
        spacing={3}
        sx={{
          p: 3,
          pt: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Nom de la matière */}
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
                InputProps={{
                  startAdornment: (
                    <Box
                      component={Avatar}
                      sx={{
                        mr: 2,
                        width: 40,
                        height: 40,
                        bgcolor: selectedColor || 'primary.main',
                        color: 'white',
                        fontSize: '1rem',
                      }}
                    >
                      {field.value ? field.value[0].toUpperCase() : '?'}
                    </Box>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    alignItems: 'center',
                  },
                }}
              />
            )}
          />
        </Grid>

        {/* Description */}
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
                helperText={`${errors.description?.message || ''} (${description.length}/300)`}
                placeholder="Ex: Apprentissage des fondements mathématiques"
              />
            )}
          />
        </Grid>

        {/* Couleur et Icône */}
        <Grid item xs={12}>
          <FormControl error={!!errors.couleur || !!errors.icon} fullWidth>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography variant="subtitle2">Couleur et icône</Typography>
              <Tooltip
                title="Sélectionnez une couleur et une icône représentative de la matière"
                arrow
              >
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{
                    color: 'text.secondary',
                    cursor: 'help',
                  }}
                />
              </Tooltip>
            </Box>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 1 }}>
              {MATIERE_COLORS.map((colorOption) => (
                <Box
                  key={colorOption.couleur}
                  onClick={() => handleColorSelect(colorOption.couleur)}
                  sx={{
                    p: 0.5,
                    cursor: 'pointer',
                    borderRadius: 1,
                    border: (theme) =>
                      selectedColor === colorOption.couleur
                        ? `2px solid ${theme.palette.primary.main}`
                        : '2px solid transparent',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: colorOption.couleur,
                      color: '#fff',
                      width: 40,
                      height: 40,
                      fontSize: '1rem',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* </Avatar> */}
                </Box>
              ))}
            </Stack>
            {(errors.couleur || errors.icon) && (
              <FormHelperText>Veuillez sélectionner une couleur et une icône</FormHelperText>
            )}
          </FormControl>
        </Grid>
        {/* Active Toggle */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FontAwesomeIcon
                icon={faCalendarCheck}
                style={{
                  color: active ? 'success.main' : 'text.disabled',
                  fontSize: 24,
                }}
              />
              <Typography variant="subtitle1">Matière active</Typography>
            </Box>
            <Controller
              name="active"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                  color="success"
                />
              )}
            />
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="primary" onClick={onCancel} disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.customShadows?.z16,
                },
              }}
            >
              {initialValues.nom ? 'Modifier' : 'Ajouter'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
