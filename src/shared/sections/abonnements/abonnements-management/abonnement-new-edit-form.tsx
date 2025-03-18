import type { IAbonnementItem } from 'src/types/abonnement';

import { z as zod } from 'zod';
import { useMemo, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { varAlpha } from 'src/shared/theme/styles';
import { ABONNEMENT_TYPES_OPTIONS, ABONNEMENT_FEATURES_OPTIONS } from 'src/shared/_mock';

import { toast } from 'src/shared/components/snackbar';
import { Form, Field } from 'src/shared/components/hook-form';

import { AddFeatureDialog } from './abonnement-features-dialog';
// ----------------------------------------------------------------------

export type NewAbonnementSchemaType = zod.infer<typeof NewAbonnementSchema>;

export const NewAbonnementSchema = zod.object({
  title: zod.string().min(1, { message: 'Le nom est requis !' }),
  shortDescription: zod.string().min(1, { message: 'La description courte est requise !' }),
  fullDescription: zod.string().min(1, { message: 'La description complète est requise !' }),
  type: zod.string().min(1, { message: 'Le type est requis !' }),
  price: zod.object({
    amount: zod.number().min(1, { message: 'Le montant est requis !' }),
    interval: zod.string().min(1, { message: "L'intervalle est requis !" }),
  }),
  duration: zod.number(),
  features: zod
    .string()
    .array()
    .nonempty({ message: 'Au moins une caractéristique est requise !' }),
  promoDetails: zod
    .object({
      discountPercentage: zod.number().optional(),
      validUntil: zod.string().optional(),
    })
    .optional(),
  expiredAt: zod.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentAbonnement?: IAbonnementItem;
};

export function AbonnementNewEditForm({ currentAbonnement }: Props) {
  const router = useRouter();
  const [publish, setPublish] = useState(false);
  const features = useBoolean();

  const defaultValues = useMemo(
    () => ({
      title: currentAbonnement?.title || '',
      shortDescription: currentAbonnement?.shortDescription || '',
      fullDescription: currentAbonnement?.fullDescription || '',
      type: currentAbonnement?.type || '',
      price: currentAbonnement?.price || { amount: 0, interval: 'Mensuel' },
      duration: currentAbonnement?.duration || 0,
      features: currentAbonnement?.features || [],
      promoDetails: currentAbonnement?.promoDetails || { discountPercentage: 0, validUntil: '' },
      expiredAt: currentAbonnement?.expiredAt || '',
    }),
    [currentAbonnement]
  );
  const methods = useForm<NewAbonnementSchemaType>({
    mode: 'all',
    resolver: zodResolver(NewAbonnementSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (currentAbonnement) {
      reset(defaultValues);
      setPublish(currentAbonnement.publish === 'Publié');
    }
  }, [currentAbonnement, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      toast.success(currentAbonnement ? 'Mise à jour réussie !' : 'Création réussie !');
      router.push(paths.dashboard.abonnements.gestion_abonnements);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <Card>
      <CardHeader title="Détails" subheader="Titre, description courte..." sx={{ mb: 3 }} />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Titre</Typography>
          <Field.Text name="title" placeholder="Ex: Abonnement Premium..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description courte</Typography>
          <Field.Text name="shortDescription" placeholder="Ex: Une description brève..." />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Description complète</Typography>
          <Field.Editor name="fullDescription" sx={{ maxHeight: 480 }} />
        </Stack>
      </Stack>
    </Card>
  );

  const renderProperties = (
    <Card>
      <CardHeader
        title="Propriétés"
        subheader="Détails et caractéristiques de l'abonnement..."
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Type</Typography>
          <Field.RadioGroup row name="type" options={ABONNEMENT_TYPES_OPTIONS} sx={{ gap: 4 }} />
        </Stack>
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle2">Fonctionnalités</Typography>
            <Box sx={{ gap: 1, display: 'flex', flexWrap: 'wrap' }}>
              <Tooltip title="Ajouter une nouvelle fonctionnalité">
                <IconButton
                  onClick={features.onTrue}
                  sx={{
                    bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
                    border: (theme) => `dashed 1px ${theme.vars.palette.divider}`,
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </IconButton>
              </Tooltip>
              <AddFeatureDialog open={features.value} onClose={features.onFalse} />
            </Box>
          </Box>
          <Field.Autocomplete
            name="features"
            placeholder="+ Fonctionnalités"
            multiple
            disableCloseOnSelect
            options={ABONNEMENT_FEATURES_OPTIONS.map((option) => option.label)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Date d&apos;expiration</Typography>
            <Field.DatePicker name="expiredAt" />
          </Stack>
        </LocalizationProvider>

        <Stack spacing={2}>
          <Typography variant="subtitle2">Prix</Typography>
          <Controller
            name="price.interval"
            control={control}
            render={({ field }) => (
              <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                {[{ label: 'Mensuel' }, { label: 'Annuel' }].map((item) => (
                  <Paper
                    component={ButtonBase}
                    variant="outlined"
                    key={item.label}
                    onClick={() => field.onChange(item.label)}
                    sx={{
                      p: 2.5,
                      borderRadius: 1,
                      typography: 'subtitle2',
                      flexDirection: 'column',
                      ...(item.label === field.value && {
                        borderWidth: 2,
                        borderColor: 'text.primary',
                      }),
                    }}
                  >
                    {item.label}
                  </Paper>
                ))}
              </Box>
            )}
          />
          <Field.Text
            name="price.amount"
            placeholder="0.00"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ typography: 'subtitle2', color: 'text.disabled' }}>$</Box>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );

  const renderPromoDetails = (
    <Card>
      <CardHeader
        title="Détails de la promotion"
        subheader="Appliquez une remise spéciale à cet abonnement"
        sx={{ mb: 3 }}
      />
      <Divider />
      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">Remise (%)</Typography>
          <Field.Text
            name="promoDetails.discountPercentage"
            placeholder="Ex: 10%"
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        </Stack>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Valide jusqu&apos;au</Typography>
            <Field.DatePicker name="promoDetails.validUntil" />
          </Stack>
        </LocalizationProvider>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Box display="flex" alignItems="center" flexWrap="wrap">
      <FormControlLabel
        control={<Switch checked={publish} onChange={() => setPublish(!publish)} />}
        label="Publier"
        sx={{ flexGrow: 1, pl: 3 }}
      />

      <LoadingButton
        type="submit"
        variant="contained"
        size="large"
        loading={isSubmitting}
        sx={{ ml: 2 }}
      >
        {!currentAbonnement ? "Créer l'abonnement" : 'Sauvegarder les modifications'}
      </LoadingButton>
    </Box>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={{ xs: 3, md: 5 }} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderProperties}
        {renderPromoDetails}
        {renderActions}
      </Stack>
    </Form>
  );
}
