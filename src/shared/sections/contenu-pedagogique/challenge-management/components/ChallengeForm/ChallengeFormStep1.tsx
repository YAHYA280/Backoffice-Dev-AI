import React from 'react';
import { Controller } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import {
  Grid,
  Chip,
  Select,
  Divider,
  MenuItem,
  TextField,
  FormLabel,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';

import { Upload } from 'src/shared/components/upload';

import { STATUT_OPTIONS, DIFFICULTE_OPTIONS } from '../../constants';

import type { StepProps } from './types';

export const ChallengeFormStep1: React.FC<StepProps> = ({ form, niveaux = [] }) => {
  const {
    control,
    formState: { errors },
  } = form;

  // Format date for input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    return date.toISOString().slice(0, 16);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px' }} />
          Informations générales
        </Typography>
        <Divider sx={{ mb: 2 }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <Controller
          name="nom"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom du challenge"
              fullWidth
              error={!!errors.nom}
              helperText={errors.nom?.message}
              placeholder="Ex: Challenge de mathématiques"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={4}>
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
              placeholder="Ex: Résoudre 10 problèmes de mathématiques en 30 minutes"
            />
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="difficulte"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.difficulte}>
              <InputLabel>Niveau de difficulté</InputLabel>
              <Select
                {...field}
                label="Niveau de difficulté"
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
      <Grid item xs={12} md={6}>
        <Controller
          name="niveauId"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.niveauId}>
              <InputLabel>Niveau</InputLabel>
              <Select {...field} label="Niveau" displayEmpty required>
                <MenuItem value="">
                  <em>Sélectionnez un niveau</em>
                </MenuItem>
                {niveaux.map((niveau) => (
                  <MenuItem key={niveau.id} value={niveau.id}>
                    {niveau.nom}
                  </MenuItem>
                ))}
              </Select>
              {errors.niveauId && <FormHelperText>{errors.niveauId.message}</FormHelperText>}
            </FormControl>
          )}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Controller
          name="datePublication"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Date de publication"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              error={!!errors.datePublication}
              helperText={errors.datePublication?.message}
              value={formatDateForInput(field.value)}
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          name="fichiers_supplementaires"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormControl fullWidth>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                Documents supplémentaires (supports pédagogiques)
              </FormLabel>
              <Upload
                multiple
                thumbnail
                value={value || []}
                onDrop={(acceptedFiles) => {
                  const newFiles = value ? [...value, ...acceptedFiles] : acceptedFiles;
                  onChange(newFiles);
                }}
                onRemoveAll={() => {
                  onChange([]);
                }}
                onRemove={(file) => {
                  if (!value) return;
                  const filteredItems = value.filter((_file) => _file !== file);
                  onChange(filteredItems);
                }}
              />
            </FormControl>
          )}
        />
      </Grid>
    </Grid>
  );
};

export default ChallengeFormStep1;
