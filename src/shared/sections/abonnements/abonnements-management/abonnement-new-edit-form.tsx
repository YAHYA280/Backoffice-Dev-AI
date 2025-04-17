import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import FormGroup from '@mui/material/FormGroup';
import InfoIcon from '@mui/icons-material/Info';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControl from '@mui/material/FormControl';
import Calculator from '@mui/icons-material/Calculate';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Grid, Alert, Button, Slider, lighten, MenuItem, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { AI_MODEL_COSTS, AVAILABLE_MODELS } from 'src/shared/_mock';

import { toast } from 'src/shared/components/snackbar';
import { Form, Field } from 'src/shared/components/hook-form';

// ----------------------------------------------------------------------

// Type définissant les modèles d'assistants disponibles
export type AIModel = 'chatgpt3' | 'chatgpt4' | 'chatgpt5' | 'claude3' | 'claude3_5' | 'claude4';
export type TTSModel = 'tts_standard' | 'tts_premium' | 'tts_neural' | 'tts_premium_plus';

// Modifiez le type AssistantConfiguration
export type AssistantConfiguration = {
  devoir: {
    access: boolean;
    textModel: AIModel;
    ttsModel: TTSModel;
  };
  recherche: {
    access: boolean;
    textModel: AIModel;
    ttsModel: TTSModel;
  };
  japprends: {
    access: boolean;
    textModel: AIModel;
    ttsModel: TTSModel;
  };
};

// Ajoutez les coûts pour les modèles TTS
const TTS_MODEL_COSTS = {
  tts_standard: { cost: 0.2, name: 'TTS Standard' },
  tts_premium: { cost: 0.4, name: 'TTS Premium' },
  tts_neural: { cost: 0.5, name: 'TTS Neural' },
  tts_premium_plus: { cost: 0.7, name: 'TTS Premium+' },
};

// Modèles TTS disponibles par assistant
const AVAILABLE_TTS_MODELS = {
  devoir: ['tts_standard', 'tts_premium', 'tts_neural'],
  recherche: ['tts_standard', 'tts_premium', 'tts_neural', 'tts_premium_plus'],
  japprends: ['tts_standard', 'tts_premium', 'tts_neural', 'tts_premium_plus'],
};

export type NewAbonnementSchemaType = z.infer<typeof NewAbonnementSchema>;

export const NewAbonnementSchema = z.object({
  title: z.string().min(1, { message: 'Le nom est requis !' }),
  shortDescription: z.string().min(1, { message: 'La description courte est requise !' }),
  fullDescription: z.string().min(1, { message: 'La description complète est requise !' }),
  price: z.object({
    monthly: z.number().min(0, { message: 'Le montant mensuel doit être valide !' }),
    semiannual: z.number().min(0, { message: 'Le montant semestriel doit être valide !' }),
    annual: z.number().min(0, { message: 'Le montant annuel doit être valide !' }),
    defaultInterval: z.string().min(1, { message: "L'intervalle par défaut est requis !" }),
  }),
  nbr_children_access: z
    .number()
    .min(0, { message: "Le nombre d'accès enfants doit être valide !" }),
  daily_question_limit: z
    .number()
    .min(0, { message: 'La limite quotidienne de questions doit être valide !' }),
  assistants: z.object({
    devoir: z.object({
      access: z.boolean(),
      textModel: z.string(),
      ttsModel: z.string(),
    }),
    recherche: z.object({
      access: z.boolean(),
      textModel: z.string(),
      ttsModel: z.string(),
    }),
    japprends: z.object({
      access: z.boolean(),
      textModel: z.string(),
      ttsModel: z.string(),
    }),
  }),
  nbr_subjects: z.number().min(0, { message: 'Le nombre de matières doit être valide !' }),
  promoDetails: z
    .object({
      discountPercentage: z.number().optional(),
      validUntil: z.string().optional(),
    })
    .optional(),
  expiredAt: z.string(),
});

// ----------------------------------------------------------------------

type Props = {
  currentAbonnement?: IAbonnementItem;
};

export function AbonnementNewEditForm({ currentAbonnement }: Props) {
  const theme = useTheme();

  const router = useRouter();
  const [publish, setPublish] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState<string>('Mensuel');

  // État pour les coûts estimés des assistants
  const [assistantsCost, setAssistantsCost] = useState({
    daily: 0,
    monthly: 0,
    annually: 0,
    detailedCosts: {} as Record<string, { daily: number; monthly: number; annually: number }>,
  });

  const defaultValues = useMemo(
    () => ({
      title: currentAbonnement?.title || '',
      shortDescription: currentAbonnement?.shortDescription || '',
      fullDescription: currentAbonnement?.fullDescription || '',
      price: currentAbonnement?.price || {
        monthly: 0,
        semiannual: 0,
        annual: 0,
        defaultInterval: 'Mensuel',
      },
      nbr_children_access: currentAbonnement?.nbr_children_access || 0,
      daily_question_limit: currentAbonnement?.daily_question_limit || 0,
      assistants: currentAbonnement?.assistants || {
        devoir: {
          access: false,
          textModel: 'chatgpt4',
          ttsModel: 'tts_standard',
        },
        recherche: {
          access: false,
          textModel: 'chatgpt4',
          ttsModel: 'tts_standard',
        },
        japprends: {
          access: false,
          textModel: 'chatgpt4',
          ttsModel: 'tts_standard',
        },
      },
      nbr_subjects: currentAbonnement?.nbr_subjects || 0,
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
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Surveiller les valeurs qui impactent le calcul du coût
  const nbrChildrenAccess = watch('nbr_children_access');
  const dailyQuestionLimit = watch('daily_question_limit');
  const defaultIntervalValue = watch('price.defaultInterval');
  const assistantsConfig = watch('assistants');

  const devoirActive = watch('assistants.devoir.access');
  const rechercheActive = watch('assistants.recherche.access');
  const japprendsActive = watch('assistants.japprends.access');

  const devoirTextModel = watch('assistants.devoir.textModel');
  const devoirTtsModel = watch('assistants.devoir.ttsModel');
  const rechercheTextModel = watch('assistants.recherche.textModel');
  const rechercheTtsModel = watch('assistants.recherche.ttsModel');
  const japprendsTextModel = watch('assistants.japprends.textModel');
  const japprendsTtsModel = watch('assistants.japprends.ttsModel');
  useEffect(() => {
    // Créer un nouvel objet pour les coûts détaillés
    const detailedCosts: Record<string, { daily: number; monthly: number; annually: number }> = {};
    let totalDailyCost = 0;

    // Calcul pour Devoir
    if (devoirActive) {
      const textModelCost = AI_MODEL_COSTS[devoirTextModel as AIModel]?.cost || 0;
      const ttsModelCost = TTS_MODEL_COSTS[devoirTtsModel as TTSModel]?.cost || 0;

      // Le coût total par question est la somme du coût du modèle texte + TTS
      const costPerQuestion = textModelCost + ttsModelCost;
      const dailyCost = costPerQuestion * nbrChildrenAccess * dailyQuestionLimit;
      const monthlyCost = dailyCost * 30;
      const annualCost = dailyCost * 365;

      detailedCosts.devoir = {
        daily: dailyCost,
        monthly: monthlyCost,
        annually: annualCost,
      };

      totalDailyCost += dailyCost;
    } else {
      detailedCosts.devoir = { daily: 0, monthly: 0, annually: 0 };
    }

    // Calcul pour Recherche
    if (rechercheActive) {
      const textModelCost = AI_MODEL_COSTS[rechercheTextModel as AIModel]?.cost || 0;
      const ttsModelCost = TTS_MODEL_COSTS[rechercheTtsModel as TTSModel]?.cost || 0;

      const costPerQuestion = textModelCost + ttsModelCost;
      const dailyCost = costPerQuestion * nbrChildrenAccess * dailyQuestionLimit;
      const monthlyCost = dailyCost * 30;
      const annualCost = dailyCost * 365;

      detailedCosts.recherche = {
        daily: dailyCost,
        monthly: monthlyCost,
        annually: annualCost,
      };

      totalDailyCost += dailyCost;
    } else {
      detailedCosts.recherche = { daily: 0, monthly: 0, annually: 0 };
    }

    // Calcul pour J'apprends
    if (japprendsActive) {
      const textModelCost = AI_MODEL_COSTS[japprendsTextModel as AIModel]?.cost || 0;
      const ttsModelCost = TTS_MODEL_COSTS[japprendsTtsModel as TTSModel]?.cost || 0;

      const costPerQuestion = textModelCost + ttsModelCost;
      const dailyCost = costPerQuestion * nbrChildrenAccess * dailyQuestionLimit;
      const monthlyCost = dailyCost * 30;
      const annualCost = dailyCost * 365;

      detailedCosts.japprends = {
        daily: dailyCost,
        monthly: monthlyCost,
        annually: annualCost,
      };

      totalDailyCost += dailyCost;
    } else {
      detailedCosts.japprends = { daily: 0, monthly: 0, annually: 0 };
    }

    // Calculer les totaux
    const totalMonthlyCost = totalDailyCost * 30;
    const totalAnnualCost = totalDailyCost * 365;

    // Mettre à jour l'état avec un nouvel objet
    setAssistantsCost({
      daily: totalDailyCost,
      monthly: totalMonthlyCost,
      annually: totalAnnualCost,
      detailedCosts,
    });
  }, [
    nbrChildrenAccess,
    dailyQuestionLimit,
    devoirActive,
    devoirTextModel,
    devoirTtsModel,
    rechercheActive,
    rechercheTextModel,
    rechercheTtsModel,
    japprendsActive,
    japprendsTextModel,
    japprendsTtsModel,
  ]);
  useEffect(() => {
    if (currentAbonnement) {
      reset(defaultValues);
      setPublish(currentAbonnement.publish === 'published');

      // Convertir l'intervalle technique en format d'affichage
      setSelectedInterval(currentAbonnement.price?.defaultInterval || 'Mensuel');
    }
  }, [currentAbonnement, defaultValues, reset]);

  useEffect(() => {
    if (defaultIntervalValue) {
      setSelectedInterval(defaultIntervalValue);
    }
  }, [defaultIntervalValue]);

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
  const [additionalCosts, setAdditionalCosts] = useState({
    infrastructure: 0,
    support: 0,
    marketing: 0,
    other: 0,
  });
  const [profitMargin, setProfitMargin] = useState(30); // Pourcentage par défaut
  const [suggestedPrices, setSuggestedPrices] = useState({
    monthly: 0,
    semiannual: 0,
    annual: 0,
  });
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);

  // fonction pour calculer les prix suggérés
  const calculateSuggestedPrices = useCallback(() => {
    // Calculer le coût total mensuel (coûts des assistants + charges additionnelles)
    const totalMonthlyCosts =
      assistantsCost.monthly +
      additionalCosts.infrastructure +
      additionalCosts.support +
      additionalCosts.marketing +
      additionalCosts.other;
    // Calculer le prix mensuel avec la marge
    const suggestedMonthlyPrice = totalMonthlyCosts / (1 - profitMargin / 100);
    // Calculer les prix semestriel et annuel avec une remise
    const semiannualDiscount = 0.05; // 5% de remise pour engagement semestriel
    const annualDiscount = 0.15; // 15% de remise pour engagement annuel
    const suggestedSemiannualPrice = suggestedMonthlyPrice * 6 * (1 - semiannualDiscount);
    const suggestedAnnualPrice = suggestedMonthlyPrice * 12 * (1 - annualDiscount);
    // Mettre à jour l'état avec les prix suggérés
    setSuggestedPrices({
      monthly: Math.ceil(suggestedMonthlyPrice * 100) / 100, // Arrondi au centime supérieur
      semiannual: Math.ceil(suggestedSemiannualPrice * 100) / 100,
      annual: Math.ceil(suggestedAnnualPrice * 100) / 100,
    });
  }, [
    assistantsCost.monthly,
    additionalCosts.infrastructure,
    additionalCosts.support,
    additionalCosts.marketing,
    additionalCosts.other,
    profitMargin,
    setSuggestedPrices,
  ]);

  // Ensuite dans votre useEffect
  useEffect(() => {
    calculateSuggestedPrices();
  }, [calculateSuggestedPrices]);

  // Fonction pour appliquer les prix suggérés
  const applySuggestedPrices = () => {
    setValue('price.monthly', suggestedPrices.monthly);
    setValue('price.semiannual', suggestedPrices.semiannual);
    setValue('price.annual', suggestedPrices.annual);
    toast.success('Prix suggérés appliqués avec succès !');
  };

  const renderCostsAndMargin = (
    <Card sx={{ p: 3 }}>
      <CardHeader
        title="Calculateur de prix"
        action={
          <IconButton onClick={() => setShowPriceCalculator(!showPriceCalculator)}>
            <Calculator />
          </IconButton>
        }
        sx={{ px: 0, pt: 0 }}
      />
      <Divider sx={{ my: 2 }} />

      {showPriceCalculator && (
        <Stack spacing={3}>
          <Typography variant="subtitle1">Charges supplémentaires mensuelles</Typography>

          <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
            <TextField
              label="Infrastructure (serveurs, stockage)"
              type="number"
              value={additionalCosts.infrastructure}
              onChange={(e) =>
                setAdditionalCosts({
                  ...additionalCosts,
                  infrastructure: parseFloat(e.target.value) || 0,
                })
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                endAdornment: <InputAdornment position="end">/mois</InputAdornment>,
              }}
            />

            <TextField
              label="Support client"
              type="number"
              value={additionalCosts.support}
              onChange={(e) =>
                setAdditionalCosts({ ...additionalCosts, support: parseFloat(e.target.value) || 0 })
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                endAdornment: <InputAdornment position="end">/mois</InputAdornment>,
              }}
            />

            <TextField
              label="Marketing et acquisition"
              type="number"
              value={additionalCosts.marketing}
              onChange={(e) =>
                setAdditionalCosts({
                  ...additionalCosts,
                  marketing: parseFloat(e.target.value) || 0,
                })
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                endAdornment: <InputAdornment position="end">/mois</InputAdornment>,
              }}
            />

            <TextField
              label="Autres charges"
              type="number"
              value={additionalCosts.other}
              onChange={(e) =>
                setAdditionalCosts({ ...additionalCosts, other: parseFloat(e.target.value) || 0 })
              }
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
                endAdornment: <InputAdornment position="end">/mois</InputAdornment>,
              }}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Marge bénéficiaire souhaitée
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Slider
                value={profitMargin}
                onChange={(_, newValue) => setProfitMargin(newValue as number)}
                min={0}
                max={90}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                sx={{ flex: 1 }}
              />

              <Typography variant="h6" sx={{ width: 60, textAlign: 'right' }}>
                {profitMargin}%
              </Typography>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Récapitulatif des coûts mensuels
            </Typography>

            <Stack spacing={1} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Coût des assistants IA</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {fCurrency(assistantsCost.monthly)}
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Infrastructure</Typography>
                <Typography variant="body2">{fCurrency(additionalCosts.infrastructure)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Support client</Typography>
                <Typography variant="body2">{fCurrency(additionalCosts.support)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Marketing</Typography>
                <Typography variant="body2">{fCurrency(additionalCosts.marketing)}</Typography>
              </Box>

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">Autres charges</Typography>
                <Typography variant="body2">{fCurrency(additionalCosts.other)}</Typography>
              </Box>

              <Divider />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle2">Coût total mensuel</Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {fCurrency(
                    assistantsCost.monthly +
                      additionalCosts.infrastructure +
                      additionalCosts.support +
                      additionalCosts.marketing +
                      additionalCosts.other
                  )}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Prix suggérés avec {profitMargin}% de marge
            </Typography>

            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mensuel
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {fCurrency(suggestedPrices.monthly)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Semestriel
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {fCurrency(suggestedPrices.semiannual)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Annuel
                </Typography>
                <Typography variant="subtitle2" fontWeight="bold">
                  {fCurrency(suggestedPrices.annual)}
                </Typography>
              </Box>
            </Box>
          </Alert>

          <Button
            variant="contained"
            color="primary"
            onClick={applySuggestedPrices}
            startIcon={<Calculator />}
            fullWidth
          >
            Appliquer ces prix
          </Button>
        </Stack>
      )}
    </Card>
  );

  const renderDetails = (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Détails" sx={{ px: 0, pt: 0 }} />
      <Divider sx={{ my: 2 }} />
      <Stack spacing={3}>
        <Field.Text
          name="title"
          label="Titre de l'abonnement"
          placeholder="Ex: Abonnement Premium..."
        />
        <Field.Text
          name="shortDescription"
          label="Description courte"
          placeholder="Ex: Une description brève..."
        />
        <Field.Editor
          name="fullDescription"
          placeholder="Description complète"
          sx={{ maxHeight: 480 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Field.DatePicker name="expiredAt" label="Date d'expiration" />
        </LocalizationProvider>
      </Stack>
    </Card>
  );

  const renderLimits = (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Limites d'utilisation" sx={{ px: 0, pt: 0 }} />
      <Divider sx={{ my: 2 }} />
      <Stack spacing={3}>
        {/* Section des assistants */}
        <Box>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight="bold">
              Assistants accessibles
            </Typography>
            <Tooltip title="Sélectionnez les assistants qui seront disponibles dans cet abonnement">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 1,
              backgroundColor: lighten(theme.palette.background.neutral, 0.6),
            }}
          >
            <FormGroup>
              <Stack spacing={3}>
                {/* Assistant Devoir */}
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Controller
                      name="assistants.devoir.access"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                              }}
                              color="primary"
                            />
                          }
                          label="Assistant Devoir"
                          sx={{ minWidth: 180 }}
                        />
                      )}
                    />
                  </Stack>

                  {assistantsConfig?.devoir.access && (
                    <>
                      <Box sx={{ pl: 4, pt: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="assistants.devoir.textModel"
                              control={control}
                              render={({ field }) => (
                                <FormControl sx={{ width: '100%' }} size="small">
                                  <InputLabel>Modèle pour le texte</InputLabel>
                                  <Select {...field} label="Modèle pour le texte">
                                    {AVAILABLE_MODELS.devoir.map((modelKey) => (
                                      <MenuItem key={modelKey} value={modelKey}>
                                        {AI_MODEL_COSTS[modelKey as AIModel].name} (
                                        {fCurrency(AI_MODEL_COSTS[modelKey as AIModel].cost)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="assistants.devoir.ttsModel"
                              control={control}
                              render={({ field }) => (
                                <FormControl sx={{ width: '100%' }} size="small">
                                  <InputLabel>Modèle pour TTS</InputLabel>
                                  <Select {...field} label="Modèle pour TTS">
                                    {AVAILABLE_TTS_MODELS.devoir.map((modelKey) => (
                                      <MenuItem key={modelKey} value={modelKey}>
                                        {TTS_MODEL_COSTS[modelKey as TTSModel].name} (
                                        {fCurrency(TTS_MODEL_COSTS[modelKey as TTSModel].cost)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {assistantsCost.detailedCosts?.devoir && (
                        <Box sx={{ mt: 1, ml: 4 }}>
                          <Typography variant="caption" color="primary.main">
                            Coût estimé: {fCurrency(assistantsCost.detailedCosts.devoir.daily)}/jour
                            ({fCurrency(assistantsCost.detailedCosts.devoir.monthly)}/mois)
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                {/* Assistant Recherche */}
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Controller
                      name="assistants.recherche.access"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                              }}
                              color="primary"
                            />
                          }
                          label="Assistant Recherche"
                          sx={{ minWidth: 180 }}
                        />
                      )}
                    />
                  </Stack>

                  {assistantsConfig?.recherche.access && (
                    <>
                      <Box sx={{ pl: 4, pt: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="assistants.recherche.textModel"
                              control={control}
                              render={({ field }) => (
                                <FormControl sx={{ width: '100%' }} size="small">
                                  <InputLabel>Modèle pour le texte</InputLabel>
                                  <Select {...field} label="Modèle pour le texte">
                                    {AVAILABLE_MODELS.recherche.map((modelKey) => (
                                      <MenuItem key={modelKey} value={modelKey}>
                                        {AI_MODEL_COSTS[modelKey as AIModel].name} (
                                        {fCurrency(AI_MODEL_COSTS[modelKey as AIModel].cost)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="assistants.recherche.ttsModel"
                              control={control}
                              render={({ field }) => (
                                <FormControl sx={{ width: '100%' }} size="small">
                                  <InputLabel>Modèle pour TTS</InputLabel>
                                  <Select {...field} label="Modèle pour TTS">
                                    {AVAILABLE_TTS_MODELS.recherche.map((modelKey) => (
                                      <MenuItem key={modelKey} value={modelKey}>
                                        {TTS_MODEL_COSTS[modelKey as TTSModel].name} (
                                        {fCurrency(TTS_MODEL_COSTS[modelKey as TTSModel].cost)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {assistantsCost.detailedCosts?.recherche && (
                        <Box sx={{ mt: 1, ml: 4 }}>
                          <Typography variant="caption" color="primary.main">
                            Coût estimé: {fCurrency(assistantsCost.detailedCosts.recherche.daily)}
                            /jour ({fCurrency(assistantsCost.detailedCosts.recherche.monthly)}/mois)
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                {/* Assistant J'apprends */}
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Controller
                      name="assistants.japprends.access"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={field.value}
                              onChange={(e) => {
                                field.onChange(e.target.checked);
                              }}
                              color="primary"
                            />
                          }
                          label="Assistant J'apprends"
                          sx={{ minWidth: 180 }}
                        />
                      )}
                    />
                  </Stack>

                  {assistantsConfig?.japprends.access && (
                    <>
                      <Box sx={{ pl: 4, pt: 1 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="assistants.japprends.textModel"
                              control={control}
                              render={({ field }) => (
                                <FormControl sx={{ width: '100%' }} size="small">
                                  <InputLabel>Modèle pour le texte</InputLabel>
                                  <Select {...field} label="Modèle pour le texte">
                                    {AVAILABLE_MODELS.japprends.map((modelKey) => (
                                      <MenuItem key={modelKey} value={modelKey}>
                                        {AI_MODEL_COSTS[modelKey as AIModel].name} (
                                        {fCurrency(AI_MODEL_COSTS[modelKey as AIModel].cost)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Controller
                              name="assistants.japprends.ttsModel"
                              control={control}
                              render={({ field }) => (
                                <FormControl sx={{ width: '100%' }} size="small">
                                  <InputLabel>Modèle pour TTS</InputLabel>
                                  <Select {...field} label="Modèle pour TTS">
                                    {AVAILABLE_TTS_MODELS.japprends.map((modelKey) => (
                                      <MenuItem key={modelKey} value={modelKey}>
                                        {TTS_MODEL_COSTS[modelKey as TTSModel].name} (
                                        {fCurrency(TTS_MODEL_COSTS[modelKey as TTSModel].cost)})
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {assistantsCost.detailedCosts?.japprends && (
                        <Box sx={{ mt: 1, ml: 4 }}>
                          <Typography variant="caption" color="primary.main">
                            Coût estimé: {fCurrency(assistantsCost.detailedCosts.japprends.daily)}
                            /jour ({fCurrency(assistantsCost.detailedCosts.japprends.monthly)}/mois)
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Stack>
            </FormGroup>
          </Paper>
        </Box>

        {/* Afficher le champ de matières uniquement si J'apprends est activé */}
        {japprendsActive && (
          <Field.Text
            name="nbr_subjects"
            label="Nombre de matières accessibles pour l'assistant j'apprends "
            placeholder="Ex: 10"
            type="number"
          />
        )}
        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={3}>
          <Field.Text
            name="nbr_children_access"
            label="Nombre d'enfants autorisés"
            placeholder="Ex: 3"
            type="number"
          />
          <Field.Text
            name="daily_question_limit"
            label="Questions quotidiennes par enfant"
            placeholder="Ex: 50"
            type="number"
          />
        </Box>

        {/* Affichage des coûts estimés des assistants */}
        {nbrChildrenAccess > 0 &&
          dailyQuestionLimit > 0 &&
          (assistantsConfig?.devoir.access ||
            assistantsConfig?.recherche.access ||
            assistantsConfig?.japprends.access) && (
            <Paper
              sx={{
                p: 2,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.primary.lighter, 0.08),
                border: '1px solid',
                borderColor: 'primary.main',
              }}
            >
              <Typography variant="subtitle1" color="primary.main" gutterBottom>
                Estimation des coûts bruts des assistants
              </Typography>
              <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Coût quotidien
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {fCurrency(assistantsCost.daily)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Coût mensuel (30j)
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {fCurrency(assistantsCost.monthly)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Coût annuel
                  </Typography>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {fCurrency(assistantsCost.annually)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Basé sur les coûts par question des modèles sélectionnés pour chaque assistant
              </Typography>
            </Paper>
          )}
      </Stack>
    </Card>
  );

  const renderPricing = (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Tarification" sx={{ px: 0, pt: 0 }} />
      <Divider sx={{ my: 2 }} />
      <Stack spacing={3}>
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={3}>
          <Field.Text
            name="price.monthly"
            label="Prix mensuel"
            placeholder="0.00"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: 'text.disabled' }}>€</Box>
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">/mois</InputAdornment>,
            }}
          />

          <Field.Text
            name="price.semiannual"
            label="Prix semestriel"
            placeholder="0.00"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: 'text.disabled' }}>€</Box>
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">/6 mois</InputAdornment>,
            }}
          />

          <Field.Text
            name="price.annual"
            label="Prix annuel"
            placeholder="0.00"
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Box sx={{ color: 'text.disabled' }}>€</Box>
                </InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">/an</InputAdornment>,
            }}
          />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Périodicité par défaut à afficher
          </Typography>
          <Controller
            name="price.defaultInterval"
            control={control}
            render={({ field }) => (
              <Box gap={2} display="grid" gridTemplateColumns="repeat(3, 1fr)">
                {[{ label: 'Mensuel' }, { label: 'Semestriel' }, { label: 'Annuel' }].map(
                  (item) => (
                    <Paper
                      component={ButtonBase}
                      variant="outlined"
                      key={item.label}
                      onClick={() => {
                        field.onChange(item.label);
                        setSelectedInterval(item.label);
                      }}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        typography: 'subtitle2',
                        flexDirection: 'column',
                        ...(item.label === field.value && {
                          borderWidth: 2,
                          borderColor: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                        }),
                      }}
                    >
                      {item.label}
                    </Paper>
                  )
                )}
              </Box>
            )}
          />
        </Box>
      </Stack>
    </Card>
  );

  const renderPromoDetails = (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Détails de la promotion" sx={{ px: 0, pt: 0 }} />
      <Divider sx={{ my: 2 }} />
      <Stack spacing={3}>
        <Field.Text
          name="promoDetails.discountPercentage"
          label="Remise"
          placeholder="Ex: 10"
          type="number"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Field.DatePicker name="promoDetails.validUntil" label="Valide jusqu'au" />
        </LocalizationProvider>
      </Stack>
    </Card>
  );

  const renderActions = (
    <Card sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={<Switch checked={publish} onChange={() => setPublish(!publish)} />}
          label="Publier cet abonnement"
        />

        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          color="primary"
          loading={isSubmitting}
        >
          {!currentAbonnement ? "Créer l'abonnement" : 'Sauvegarder les modifications'}
        </LoadingButton>
      </Box>
    </Card>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={3} sx={{ mx: 'auto', maxWidth: { xs: 720, xl: 880 } }}>
        {renderDetails}
        {renderLimits}
        {renderCostsAndMargin}
        {renderPricing}
        {renderPromoDetails}
        {renderActions}
      </Stack>
    </Form>
  );
}
