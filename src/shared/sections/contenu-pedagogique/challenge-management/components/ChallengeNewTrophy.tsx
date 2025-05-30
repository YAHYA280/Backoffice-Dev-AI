import * as Yup from 'yup';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Paper,
  Alert,
  Switch,
  Button,
  Select,
  Divider,
  MenuItem,
  useTheme,
  TextField,
  Typography,
  InputLabel,
  FormControl,
  FormHelperText,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { RHFUpload } from 'src/shared/components/hook-form';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { mockTrophies } from '../hooks/useChallenge';

import type { Trophy, CritereAttribution } from '../types';

interface ChallengeNewTrophyProps {
  challengeId: string;
  challengeTitle: string;
}

export default function ChallengeNewTrophy({
  challengeId,
  challengeTitle,
}: ChallengeNewTrophyProps) {
  const router = useRouter();
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [iconeFile, setIconeFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const TrophySchema = Yup.object().shape({
    titre: Yup.string().required('Le titre est requis'),
    description: Yup.string().required('La description est requise'),
    type: Yup.string()
      .oneOf(['OR', 'ARGENT', 'BRONZE', 'BADGE_PERSONNALISE'], 'Type de trophée non valide')
      .required('Le type est requis'),
    icone: Yup.mixed<File>()
      .nullable()
      .test('is-file', "L'icône doit être un fichier", (value) => {
        if (value === null || value === undefined) return true;
        return value instanceof File;
      }),
    critereAttribution: Yup.object().shape({
      minScore: Yup.number().typeError('Doit être un nombre').optional(),
      maxTemps: Yup.number().typeError('Doit être un nombre').optional(),
      maxTentatives: Yup.number()
        .typeError('Doit être un nombre')
        .integer('Doit être un entier')
        .optional(),
      tousLesQtsReussis: Yup.boolean(),
    }),
  });

  const defaultValues = {
    titre: '',
    description: '',
    type: 'BRONZE' as const,
    icone: null as File | null,
    critereAttribution: {
      minScore: undefined,
      maxTemps: undefined,
      maxTentatives: undefined,
      tousLesQtsReussis: false,
    },
  };

  const methods = useForm({
    resolver: yupResolver(TrophySchema),
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const handleDropIcone = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setIconeFile(file);
        setValue('icone', file, { shouldValidate: true });

        // Créer une URL pour prévisualiser l'image
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);
      }
    },
    [setValue]
  );

  const handleRemoveIcone = useCallback(() => {
    setIconeFile(null);
    setValue('icone', null, { shouldValidate: true });

    // Libérer l'URL de prévisualisation
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [setValue, previewUrl]);

  const onSubmit = useCallback(
    async (data: {
      titre: string;
      description: string;
      type: Trophy['type'];
      icone?: File | null;
      critereAttribution: CritereAttribution;
    }) => {
      try {
        setIsSubmitting(true);

        let iconeUrl;
        if (data.icone) {
          // Nous allons simplement créer une URL blob
          iconeUrl = URL.createObjectURL(data.icone);
        }

        const newTrophy: Trophy = {
          id: `trophy-${Date.now()}`,
          createdAt: new Date().toISOString(),
          challengeId,
          titre: data.titre,
          description: data.description,
          type: data.type,
          iconeUrl: iconeUrl || undefined,
          critereAttribution: {
            minScore: data.critereAttribution.minScore ?? undefined,
            maxTemps: data.critereAttribution.maxTemps ?? undefined,
            maxTentatives: data.critereAttribution.maxTentatives ?? undefined,
            tousLesQtsReussis: data.critereAttribution.tousLesQtsReussis ?? false,
          },
        };

        // Ajouter le nouveau trophée aux données mockées
        mockTrophies.push(newTrophy);

        // Simuler un appel API
        const promise = new Promise((resolve) => setTimeout(resolve, 1000));
        toast.promise(promise, {
          loading: 'Création du trophée en cours...',
          success: 'Trophée créé avec succès!',
          error: 'Erreur lors de la création du trophée',
        });

        await promise;
        router.push(paths.dashboard.contenu_pedagogique.trophies(challengeId));
      } catch (error) {
        console.error(error);
        toast.error('Une erreur est survenue lors de la création du trophée');
      } finally {
        setIsSubmitting(false);
      }
    },
    [challengeId, router]
  );

  // Style pour les cartes
  const cardStyle = {
    p: 3,
    mb: 3,
    boxShadow: theme.shadows[2],
    borderRadius: 2,
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  };

  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <CustomBreadcrumbs
        heading="Ajouter un trophée"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Contenu pédagogique', href: paths.dashboard.contenu_pedagogique.root },
          { name: 'Gestion des challenges', href: paths.dashboard.contenu_pedagogique.challenges },
          { name: 'Trophées', href: paths.dashboard.contenu_pedagogique.trophies(challengeId) },
          { name: 'Ajouter un trophée' },
        ]}
        sx={{ mb: { xs: 3, md: 4 } }}
      />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <Button
                component={Link}
                href={paths.dashboard.contenu_pedagogique.trophies(challengeId)}
                color="inherit"
                size="small"
                sx={{ minWidth: 40, p: 1 }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <Typography variant="h5" color="primary">
                Challenge: {challengeTitle}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configurez les détails du nouveau trophée pour récompenser les enfants qui
              atteignent des objectifs spécifiques.
            </Typography>
          </Paper>

          <Card sx={cardStyle}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Informations générales
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="titre"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Titre du trophée"
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error}>
                      <InputLabel>Type de trophée</InputLabel>
                      <Select {...field} label="Type de trophée" sx={{ borderRadius: 1 }}>
                        <MenuItem value="OR">Or</MenuItem>
                        <MenuItem value="ARGENT">Argent</MenuItem>
                        <MenuItem value="BRONZE">Bronze</MenuItem>
                        <MenuItem value="BADGE_PERSONNALISE">Badge personnalisé</MenuItem>
                      </Select>
                      {error ? <FormHelperText>{error.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      label="Description"
                      error={!!error}
                      helperText={error?.message}
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Card>

          <Card sx={cardStyle}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Icône du trophée
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <FormControl fullWidth>
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 3,
                  bgcolor: 'background.neutral',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {previewUrl ? (
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        overflow: 'hidden',
                        width: 200,
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={previewUrl}
                        alt="Aperçu du trophée"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Paper>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRemoveIcone}
                      size="small"
                      sx={{ borderRadius: 1 }}
                    >
                      Supprimer l&apos;image
                    </Button>
                  </Box>
                ) : (
                  <RHFUpload
                    name="icone"
                    maxSize={3145728}
                    onDrop={handleDropIcone}
                    onDelete={handleRemoveIcone}
                    thumbnail
                    sx={{
                      width: '100%',
                      '& .upload-placeholder': {
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        p: 3,
                      },
                      '& .upload-img-placeholder': {
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      '& .upload-drop-zone': {
                        py: 3,
                        borderRadius: 1,
                        border: '2px dashed',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                )}
                <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2 }}>
                  Format recommandé: PNG, JPG ou SVG (max: 3 MB)
                </Typography>
              </Box>
            </FormControl>
          </Card>

          <Card sx={cardStyle}>
            <Typography variant="h6" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Critères d&apos;attribution
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Alert severity="info" sx={{ mb: 3 }}>
              Définissez les conditions que les utilisateurs doivent remplir pour obtenir ce
              trophée. Vous pouvez combiner plusieurs critères ou n&apos;en utiliser qu&apos;un
              seul.
            </Alert>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Controller
                  name="critereAttribution.minScore"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Score minimum requis"
                      error={!!error}
                      helperText={error?.message || 'Points minimum à obtenir'}
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                      }
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="critereAttribution.maxTemps"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Temps maximum"
                      error={!!error}
                      helperText={error?.message || 'Durée maximale pour compléter le challenge'}
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                      }
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Controller
                  name="critereAttribution.maxTentatives"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Tentatives maximum"
                      error={!!error}
                      helperText={error?.message || "Nombre d'essais maximum autorisé"}
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                      }
                      InputProps={{
                        sx: { borderRadius: 1 },
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: -1, mb: 2, display: 'block' }}
                >
                  Note: Laissez un champ vide si vous ne souhaitez pas utiliser ce critère
                  d&apos;attribution.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor:
                      theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 1,
                  }}
                >
                  <Controller
                    name="critereAttribution.tousLesQtsReussis"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography variant="body2">
                            Toutes les questions doivent être réussies
                          </Typography>
                        }
                      />
                    )}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Card>

          <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 3 }}>
            <Button
              component={Link}
              href={paths.dashboard.contenu_pedagogique.trophies(challengeId)}
              variant="outlined"
              color="primary"
            >
              Annuler
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
              startIcon={<FontAwesomeIcon icon={faCheck} />}
              sx={{
                borderRadius: 1,
                px: 3,
              }}
              color="primary"
            >
              Créer le trophée
            </LoadingButton>
          </Stack>
        </form>
      </FormProvider>
    </DashboardContent>
  );
}
