import { z } from 'zod';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Grid,
  Chip,
  Stack,
  alpha,
  Button,
  Select,
  Switch,
  Slider,
  Divider,
  Tooltip,
  MenuItem,
  TextField,
  FormGroup,
  InputLabel,
  Typography,
  FormControl,
  FormHelperText,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { Upload } from 'src/shared/components/upload';

import { STATUT_OPTIONS, DIFFICULTE_OPTIONS, RECOMPENSE_TYPES } from '../constants';

const schema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  statut: z.string().min(1, 'Le statut est requis'),
  dateDebut: z.string().min(1, 'La date de début est requise'),
  dateFin: z.string().min(1, 'La date de fin est requise'),
  niveauId: z.string().optional(),
  matiereId: z.string().optional(),
  niveauDifficulte: z.string().min(1, 'Le niveau de difficulté est requis'),
  pointsRecompense: z.number().min(0, 'Les points de récompense doivent être positifs'),
  badgeRecompense: z.string().optional(),
  timer: z.number().min(1, "Le timer doit être d'au moins 1 minute").optional(),
  tentativesMax: z.number().min(1, "Le nombre de tentatives doit être d'au moins 1").optional(),
  isTimerEnabled: z.boolean().optional(),
  isRandomQuestions: z.boolean().optional(),
  messageFinalSuccess: z.string().optional(),
  messageFinalFailure: z.string().optional(),
});

type ChallengeFormData = z.infer<typeof schema>;

interface ChallengeFormProps {
  initialValues?: Partial<ChallengeFormData>;
  onSubmit: (data: ChallengeFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  niveaux?: { id: string; nom: string }[];
  matieres?: { id: string; nom: string }[];
}

export const ChallengeForm = ({
  initialValues = {
    titre: '',
    description: '',
    statut: 'Brouillon',
    dateDebut: '',
    dateFin: '',
    niveauDifficulte: 'Moyen',
    pointsRecompense: 100,
    timer: 30,
    tentativesMax: 1,
    isTimerEnabled: true,
    isRandomQuestions: false,
  },
  onSubmit,
  onCancel,
  isSubmitting = false,
  niveaux = [],
  matieres = [],
}: ChallengeFormProps) => {
  const [editorValue, setEditorValue] = useState(initialValues.description || '');

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ChallengeFormData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const isTimerEnabled = watch('isTimerEnabled');
  const isRandomQuestions = watch('isRandomQuestions');
  const niveauId = watch('niveauId');
  const statut = watch('statut');

  const handleEditorChange = (newValue: string) => {
    setEditorValue(newValue);
    setValue('description', newValue);
  };

  // Format date for input
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    return date.toISOString().slice(0, 16);
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
                label="Titre du challenge"
                fullWidth
                error={!!errors.titre}
                helperText={errors.titre?.message}
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
            name="niveauDifficulte"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.niveauDifficulte}>
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
                {errors.niveauDifficulte && (
                  <FormHelperText>{errors.niveauDifficulte.message}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="niveauId"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>
                <Select {...field} label="Niveau" displayEmpty>
                  <MenuItem value="">
                    <em>Tous niveaux</em>
                  </MenuItem>
                  {niveaux.map((niveau) => (
                    <MenuItem key={niveau.id} value={niveau.id}>
                      {niveau.nom}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        {niveauId && (
          <Grid item xs={12} md={6}>
            <Controller
              name="matiereId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Matière</InputLabel>
                  <Select {...field} label="Matière" displayEmpty>
                    <MenuItem value="">
                      <em>Toutes matières</em>
                    </MenuItem>
                    {matieres
                      .filter((matiere) => !niveauId || matiere.id.startsWith(niveauId))
                      .map((matiere) => (
                        <MenuItem key={matiere.id} value={matiere.id}>
                          {matiere.nom}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        )}

        {/* Section Planification */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Planification
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="dateDebut"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date de début"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateDebut}
                helperText={errors.dateDebut?.message}
                value={formatDateForInput(field.value)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="dateFin"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Date de fin"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.dateFin}
                helperText={errors.dateFin?.message}
                value={formatDateForInput(field.value)}
              />
            )}
          />
        </Grid>

        {/* Section Paramètres du challenge */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Paramètres du challenge
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormGroup>
              <Controller
                name="isTimerEnabled"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Utiliser un timer pour limiter le temps de réponse"
                  />
                )}
              />
            </FormGroup>
          </FormControl>

          {isTimerEnabled && (
            <Box sx={{ px: 3, py: 2 }}>
              <Controller
                name="timer"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <Typography id="timer-slider" gutterBottom>
                      Durée du timer: {value} minutes
                    </Typography>
                    <Slider
                      value={value || 30}
                      onChange={(_, newValue) => onChange(newValue)}
                      aria-labelledby="timer-slider"
                      valueLabelDisplay="auto"
                      step={5}
                      marks
                      min={5}
                      max={120}
                    />
                  </>
                )}
              />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="tentativesMax"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Nombre de tentatives autorisées</InputLabel>
                <Select {...field} label="Nombre de tentatives autorisées">
                  <MenuItem value={1}>1 tentative</MenuItem>
                  <MenuItem value={2}>2 tentatives</MenuItem>
                  <MenuItem value={3}>3 tentatives</MenuItem>
                  <MenuItem value={-1}>Illimité</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <FormGroup>
              <Controller
                name="isRandomQuestions"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(value)}
                        onChange={(e) => onChange(e.target.checked)}
                      />
                    }
                    label="Ordre aléatoire des questions"
                  />
                )}
              />
            </FormGroup>
          </FormControl>
        </Grid>

        {/* Section Récompenses */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Récompenses
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="pointsRecompense"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Points de récompense"
                type="number"
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
                error={!!errors.pointsRecompense}
                helperText={errors.pointsRecompense?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="badgeRecompense"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Badge de récompense (optionnel)"
                fullWidth
                placeholder="Ex: Mathématicien en herbe"
              />
            )}
          />
        </Grid>

        {/* Section Messages de fin */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Messages de fin
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="messageFinalSuccess"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Message de succès"
                fullWidth
                multiline
                rows={2}
                placeholder="Ex: Félicitations ! Vous avez réussi le challenge avec brio !"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="messageFinalFailure"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Message d'échec"
                fullWidth
                multiline
                rows={2}
                placeholder="Ex: Pas de chance cette fois-ci. Essayez encore !"
              />
            )}
          />
        </Grid>

        {/* Section Questions */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: alpha('#f5f5f5', 0.5),
              border: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="fontWeightBold">
                Questions du challenge
              </Typography>
              <Tooltip title="Les questions seront configurées dans l'étape suivante">
                <Box component={FontAwesomeIcon} icon={faInfoCircle} sx={{ color: 'info.main' }} />
              </Tooltip>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Après avoir enregistré les informations de base du challenge, vous pourrez ajouter et
              configurer les questions (QCM, questions ouvertes, mini-jeux visuels, etc.).
            </Typography>
          </Paper>
        </Grid>

        {/* Boutons d'action */}
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={isSubmitting}
              startIcon={<FontAwesomeIcon icon={faTimes} />}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="contained"
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

export default ChallengeForm;
