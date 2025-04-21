'use client';

import { z } from 'zod';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Chip,
  Card,
  Stack,
  Button,
  Select,
  Switch,
  Slider,
  Divider,
  Tooltip,
  MenuItem,
  TextField,
  FormGroup,
  FormLabel,
  InputLabel,
  Typography,
  FormControl,
  Autocomplete,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { Upload } from 'src/shared/components/upload';
import { Editor } from 'src/shared/components/editor';
import { CustomUpload } from 'src/shared/components/upload/upload-custom';
import { schemaHelper } from 'src/shared/components/hook-form/schema-helper';

import { STATUT_OPTIONS } from '../../types';

// Available resources options
const RESSOURCE_OPTIONS = ['PDF', 'Audio', 'Vidéo', 'Interactive', 'Image'];

// Available reward types
const REWARD_TYPES = [
  { value: 'badge', label: 'Badge' },
  { value: 'trophy', label: 'Trophée' },
  { value: 'points', label: 'Points' },
];

// Available difficulty levels
const DIFFICULTY_LEVELS = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' },
];

const schema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  contenu: z.string().min(50, 'Le contenu doit contenir au moins 50 caractères'),
  statut: z.string().min(1, 'Le statut est requis'),
  niveau_difficulte: z.string().min(1, 'Le niveau de difficulté est requis'),
  ressources: z.array(z.string()).min(1, 'Au moins une ressource est requise'),
  fichier_pdf: schemaHelper
    .file({ message: { required_error: 'Le fichier PDF est requis' } })
    .optional(),
  fichier_video: schemaHelper
    .file({ message: { required_error: 'La vidéo est requise' } })
    .optional(),
  fichiers_supplementaires: z.array(z.custom<File>()).optional(),
  exiger_visionnage: z.boolean().optional(),
  pourcentage_visionnage: z.number().min(0).max(100).optional(),
  recompense_active: z.boolean().optional(),
  type_recompense: z.string().optional(),
  valeur_recompense: z.number().min(0).optional(),
  pourcentage_reussite: z.number().min(0).max(100).optional(),
  date_publication: schemaHelper.date().optional(),
  tags: z.array(z.string()).optional(),
});

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
    contenu: '',
    statut: 'Brouillon',
    niveau_difficulte: 'moyen',
    ressources: [],
    exiger_visionnage: false,
    pourcentage_visionnage: 80,
    recompense_active: false,
    type_recompense: 'points',
    valeur_recompense: 10,
    pourcentage_reussite: 70,
    tags: [],
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  chapitreId,
}: ExerciceFormProps) => {
  const [editorValue, setEditorValue] = useState(initialValues.contenu || '');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExerciceFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const exigerVisionnage = watch('exiger_visionnage');
  const recompenseActive = watch('recompense_active');
  const typeRecompense = watch('type_recompense');
  const fichierVideo = watch('fichier_video');

  const handleEditorChange = (newValue: string) => {
    setEditorValue(newValue);
    setValue('contenu', newValue);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* Section Informations générales */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Informations générales
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={8}>
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
                rows={2}
                error={!!errors.description}
                helperText={errors.description?.message}
                placeholder="Ex: Conjuguer les verbes du 1er groupe au présent de l'indicatif"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="niveau_difficulte"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.niveau_difficulte}>
                <InputLabel>Niveau de difficulté</InputLabel>
                <Select {...field} label="Niveau de difficulté">
                  {DIFFICULTY_LEVELS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.niveau_difficulte && (
                  <FormHelperText>{errors.niveau_difficulte.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="tags"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormControl fullWidth>
                <Autocomplete
                  multiple
                  freeSolo
                  options={[]}
                  value={value || []}
                  onChange={(_, newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={ref}
                      label="Tags"
                      placeholder="Ajouter des tags"
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
          <Controller
            name="contenu"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.contenu}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Contenu détaillé de l&apos;exercice
                </FormLabel>
                <Editor
                  value={editorValue}
                  onChange={handleEditorChange}
                  error={!!errors.contenu}
                  helperText={errors.contenu?.message}
                  fullItem
                  sx={{
                    border: (theme) =>
                      errors.contenu
                        ? `1px solid ${theme.palette.error.main}`
                        : `1px solid ${theme.palette.grey[300]}`,
                  }}
                />
              </FormControl>
            )}
          />
        </Grid>

        {/* Section Ressources pédagogiques */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Ressources pédagogiques
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="ressources"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <FormControl fullWidth error={!!errors.ressources}>
                <Autocomplete
                  multiple
                  options={RESSOURCE_OPTIONS}
                  value={value || []}
                  onChange={(_, newValue) => {
                    onChange(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputRef={ref}
                      label="Types de ressources"
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

        <Grid item xs={12} md={6}>
          <Controller
            name="date_publication"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="datetime-local"
                label="Date de publication"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="fichier_pdf"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth error={!!errors.fichier_pdf}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Fiche PDF
                </FormLabel>
                <CustomUpload
                  accept={{ 'application/pdf': [] }}
                  value={value}
                  multiple={false}
                  error={!!errors.fichier_pdf}
                  helperText={errors.fichier_pdf?.message}
                  onDrop={(acceptedFiles) => onChange(acceptedFiles[0])}
                  onDelete={() => onChange(null)}
                />
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="fichier_video"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControl fullWidth error={!!errors.fichier_video}>
                <FormLabel component="legend" sx={{ mb: 1 }}>
                  Vidéo explicative
                </FormLabel>
                <CustomUpload
                  accept={{ 'video/*': [] }}
                  value={value}
                  multiple={false}
                  error={!!errors.fichier_video}
                  helperText={errors.fichier_video?.message}
                  onDrop={(acceptedFiles) => onChange(acceptedFiles[0])}
                  onDelete={() => onChange(null)}
                />
              </FormControl>
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
                  Documents supplémentaires
                </FormLabel>
                <Upload
                  multiple
                  thumbnail
                  value={value}
                  onDrop={(acceptedFiles) => {
                    onChange(value ? [...(value as File[]), ...acceptedFiles] : acceptedFiles);
                  }}
                  onRemoveAll={() => {
                    onChange([]);
                  }}
                  onRemove={(file) => {
                    const filteredItems = (value as File[])?.filter((_file) => _file !== file);
                    onChange(filteredItems);
                  }}
                />
              </FormControl>
            )}
          />
        </Grid>

        {fichierVideo && (
          <Grid item xs={12}>
            <Card
              sx={{
                p: 2,
                bgcolor: (theme) => theme.palette.primary.lighter,
                border: '1px solid',
                borderColor: 'primary.light',
              }}
            >
              <FormControl component="fieldset">
                <FormGroup>
                  <Controller
                    name="exiger_visionnage"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={Boolean(value)}
                            onChange={(e) => onChange(e.target.checked)}
                          />
                        }
                        label="Exiger un visionnage de la vidéo avant de permettre l'accès à l'exercice"
                      />
                    )}
                  />

                  {exigerVisionnage && (
                    <Box sx={{ px: 3, py: 2 }}>
                      <Controller
                        name="pourcentage_visionnage"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <Typography id="visionnage-slider" gutterBottom>
                              Pourcentage de visionnage requis: {value}%
                            </Typography>
                            <Slider
                              value={value || 80}
                              onChange={(_, newValue) => onChange(newValue)}
                              aria-labelledby="visionnage-slider"
                              valueLabelDisplay="auto"
                              step={5}
                              marks
                              min={0}
                              max={100}
                            />
                          </>
                        )}
                      />
                    </Box>
                  )}
                </FormGroup>
              </FormControl>
            </Card>
          </Grid>
        )}

        {/* Section Paramètres de validation et récompenses */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Paramètres de validation et récompenses
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12}>
          <FormControl
            component="fieldset"
            sx={{
              p: 2,
              borderRadius: 1,
              width: '100%',
              mb: 3,
              bgcolor: (theme) => theme.palette.background.neutral,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <FormLabel component="legend">Validation de l&apos;exercice</FormLabel>
            <Box sx={{ mt: 2 }}>
              <Controller
                name="pourcentage_reussite"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Typography id="reussite-slider" gutterBottom>
                      Pourcentage minimal de réussite requis: {value}%
                    </Typography>
                    <Tooltip title="Le pourcentage minimum que l'élève doit atteindre pour valider l'exercice">
                      <Slider
                        value={value || 70}
                        onChange={(_, newValue) => onChange(newValue)}
                        aria-labelledby="reussite-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={0}
                        max={100}
                      />
                    </Tooltip>
                  </>
                )}
              />
            </Box>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            component="fieldset"
            sx={{
              p: 2,
              borderRadius: 1,
              width: '100%',
              bgcolor: (theme) => theme.palette.background.neutral,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <FormLabel component="legend">Récompenses</FormLabel>
            <FormGroup>
              <Controller
                name="recompense_active"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Attribuer une récompense pour la réussite de cet exercice"
                  />
                )}
              />

              {recompenseActive && (
                <Box sx={{ mt: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="type_recompense"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth>
                            <InputLabel>Type de récompense</InputLabel>
                            <Select {...field} label="Type de récompense">
                              {REWARD_TYPES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="valeur_recompense"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={
                              typeRecompense === 'points'
                                ? 'Nombre de points'
                                : 'Identifiant de la récompense'
                            }
                            type={typeRecompense === 'points' ? 'number' : 'text'}
                            fullWidth
                            InputProps={{
                              inputProps: { min: 0 },
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Boutons d'action */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={onCancel}
              disabled={isSubmitting}
              startIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={20} /> : <FontAwesomeIcon icon={faSave} />
              }
            >
              {initialValues.titre ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
