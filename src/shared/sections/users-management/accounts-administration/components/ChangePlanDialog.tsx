import type {
  AIModel,
  IAbonnementItem,
  PurchasedSubscription,
  AssistantConfiguration,
} from 'src/contexts/types/abonnement';

import React, { useState, useEffect } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {
  Box,
  Chip,
  Radio,
  Alert,
  Stack,
  Paper,
  Dialog,
  Button,
  Tooltip,
  Typography,
  RadioGroup,
  DialogTitle,
  ToggleButton,
  DialogContent,
  DialogActions,
  FormControlLabel,
  ToggleButtonGroup,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { AI_MODEL_COSTS, getIntervalLabel, ABONNEMENT_INTERVALS_OPTIONS } from 'src/shared/_mock';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface ChangePlanDialogProps {
  open: boolean;
  onClose: () => void;
  currentSubscription?: PurchasedSubscription;
  availablePlans: IAbonnementItem[];
  onChangePlan: (planId: string, interval: string) => void;
}

// Fonction utilitaire pour comparer les modèles AI (par coût)
const compareAIModels = (model1: AIModel, model2: AIModel): number => {
  const cost1 = AI_MODEL_COSTS[model1]?.cost || 0;
  const cost2 = AI_MODEL_COSTS[model2]?.cost || 0;
  return cost2 - cost1; // Ordre décroissant
};

// Fonction pour déterminer si un modèle est meilleur qu'un autre
const isModelUpgrade = (newModel: AIModel, currentModel: AIModel): boolean =>
  compareAIModels(newModel, currentModel) <= 0; // Coût plus élevé = meilleur modèle

// Fonction pour comparer deux configurations d'assistants (incluant TTS)
const compareAssistantConfig = (
  newConfig: AssistantConfiguration,
  currentConfig?: AssistantConfiguration
): {
  upgrades: Array<{
    assistant: string;
    type: 'access' | 'model' | 'tts';
    from?: string;
    to?: string;
  }>;
  downgrades: Array<{
    assistant: string;
    type: 'access' | 'model' | 'tts';
    from?: string;
    to?: string;
  }>;
} => {
  const upgrades: Array<{
    assistant: string;
    type: 'access' | 'model' | 'tts';
    from?: string;
    to?: string;
  }> = [];
  const downgrades: Array<{
    assistant: string;
    type: 'access' | 'model' | 'tts';
    from?: string;
    to?: string;
  }> = [];

  // Si pas de configuration actuelle, tout est une amélioration
  if (!currentConfig) {
    (Object.keys(newConfig) as Array<keyof AssistantConfiguration>).forEach((assistant) => {
      const newAssistant = newConfig[assistant];
      if (newAssistant.access) {
        upgrades.push({
          assistant: assistant.toString(),
          type: 'access',
          to: AI_MODEL_COSTS[newAssistant.textModel as AIModel]?.name || newAssistant.textModel,
        });

        if (newAssistant.ttsModel) {
          upgrades.push({
            assistant: assistant.toString(),
            type: 'tts',
            from: 'Aucun',
            to: newAssistant.ttsModel,
          });
        }
      }
    });

    return { upgrades, downgrades };
  }

  // Parcourir chaque assistant
  (Object.keys(newConfig) as Array<keyof AssistantConfiguration>).forEach((assistant) => {
    const newAssistant = newConfig[assistant];
    const currentAssistant = currentConfig[assistant];

    // S'il n'y a pas d'assistant actuel correspondant, c'est une amélioration
    if (!currentAssistant) {
      if (newAssistant.access) {
        upgrades.push({
          assistant: assistant.toString(),
          type: 'access',
          to: AI_MODEL_COSTS[newAssistant.textModel as AIModel]?.name || newAssistant.textModel,
        });

        if (newAssistant.ttsModel) {
          upgrades.push({
            assistant: assistant.toString(),
            type: 'tts',
            from: 'Aucun',
            to: newAssistant.ttsModel,
          });
        }
      }
      return;
    }

    // Vérifier l'accès
    if (newAssistant.access !== currentAssistant.access) {
      if (newAssistant.access) {
        upgrades.push({ assistant: assistant.toString(), type: 'access' });
      } else {
        downgrades.push({ assistant: assistant.toString(), type: 'access' });
      }
    }

    // Vérifier le modèle de texte
    if (newAssistant.textModel !== currentAssistant.textModel) {
      if (
        isModelUpgrade(newAssistant.textModel as AIModel, currentAssistant.textModel as AIModel)
      ) {
        upgrades.push({
          assistant: assistant.toString(),
          type: 'model',
          from:
            AI_MODEL_COSTS[currentAssistant.textModel as AIModel]?.name ||
            currentAssistant.textModel,
          to: AI_MODEL_COSTS[newAssistant.textModel as AIModel]?.name || newAssistant.textModel,
        });
      } else {
        downgrades.push({
          assistant: assistant.toString(),
          type: 'model',
          from:
            AI_MODEL_COSTS[currentAssistant.textModel as AIModel]?.name ||
            currentAssistant.textModel,
          to: AI_MODEL_COSTS[newAssistant.textModel as AIModel]?.name || newAssistant.textModel,
        });
      }
    }

    // Vérifier le modèle TTS
    if (newAssistant.ttsModel !== currentAssistant.ttsModel) {
      // Comparaison simple pour TTS - vous pourriez ajouter une logique plus sophistiquée si nécessaire
      if (
        newAssistant.ttsModel &&
        (!currentAssistant.ttsModel || newAssistant.ttsModel > currentAssistant.ttsModel)
      ) {
        upgrades.push({
          assistant: assistant.toString(),
          type: 'tts',
          from: currentAssistant.ttsModel || 'Aucun',
          to: newAssistant.ttsModel,
        });
      } else {
        downgrades.push({
          assistant: assistant.toString(),
          type: 'tts',
          from: currentAssistant.ttsModel || 'Aucun',
          to: newAssistant.ttsModel || 'Aucun',
        });
      }
    }
  });

  return { upgrades, downgrades };
};

// Fonction pour calculer les économies ou surcoûts entre différents intervalles
const calculateIntervalSavings = (
  plan: IAbonnementItem,
  interval: string
): { percent: number; amount: number } | null => {
  if (!plan.price || !interval) return null;

  // Base de comparaison: prix mensuel x 12
  const monthlyPrice = plan.price.monthly || 0;
  const annualEquivalent = monthlyPrice * 12;

  if (interval === 'monthly') return null; // Pas d'économie pour le mensuel (référence)

  const intervalPrice = (plan.price[interval as keyof typeof plan.price] as number) || 0;

  if (interval === 'annual') {
    // Économie annuelle par rapport au paiement mensuel
    const saving = annualEquivalent - intervalPrice;
    const percent = Math.round((saving / annualEquivalent) * 100);
    return { percent, amount: saving };
  }
  if (interval === 'semiannual') {
    // Économie semestrielle (comparée à 6 mois de paiement mensuel)
    const sixMonthsMonthly = monthlyPrice * 6;
    const saving = sixMonthsMonthly - intervalPrice;
    const percent = Math.round((saving / sixMonthsMonthly) * 100);
    return { percent, amount: saving };
  }

  return null;
};

export const ChangePlanDialog: React.FC<ChangePlanDialogProps> = ({
  open,
  onClose,
  currentSubscription,
  availablePlans,
  onChangePlan,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [priceDifference, setPriceDifference] = useState<number>(0);
  const [isUpgrade, setIsUpgrade] = useState<boolean>(true);
  const [selectedInterval, setSelectedInterval] = useState(
    currentSubscription?.interval || 'monthly'
  );
  const [comparisons, setComparisons] = useState<{
    upgrades: Array<{
      assistant: string;
      type: 'access' | 'model' | 'tts';
      from?: string;
      to?: string;
    }>;
    downgrades: Array<{
      assistant: string;
      type: 'access' | 'model' | 'tts';
      from?: string;
      to?: string;
    }>;
  }>({ upgrades: [], downgrades: [] });
  const [savings, setSavings] = useState<{ percent: number; amount: number } | null>(null);

  // État pour le dialog de confirmation
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);

  // Trier les plans par prix
  const sortedPlans = [...availablePlans].sort(
    (a, b) =>
      (a.price[selectedInterval as keyof typeof a.price] as number) -
      (b.price[selectedInterval as keyof typeof b.price] as number)
  );

  // Réinitialiser la sélection à l'ouverture du dialogue
  useEffect(() => {
    if (open) {
      setSelectedPlanId('');
      setPriceDifference(0);
      setIsUpgrade(true);
      setSelectedInterval(currentSubscription?.interval || 'monthly');
      setComparisons({ upgrades: [], downgrades: [] });
      setSavings(null);
      setConfirmDialogOpen(false);
    }
  }, [open, currentSubscription?.interval]);

  // Mise à jour du prix différentiel et des comparaisons lorsqu'un plan est sélectionné
  useEffect(() => {
    if (selectedPlanId) {
      const selectedPlan = availablePlans.find((plan) => plan.id === selectedPlanId);
      if (selectedPlan) {
        // Calcul de la différence de prix
        const currentPrice = currentSubscription
          ? (currentSubscription.price[
              selectedInterval as keyof typeof currentSubscription.price
            ] as number) || 0
          : 0;

        const newPrice =
          (selectedPlan.price[selectedInterval as keyof typeof selectedPlan.price] as number) || 0;

        setPriceDifference(newPrice - currentPrice);
        setIsUpgrade(newPrice >= currentPrice);

        // Calcul des économies par rapport au paiement mensuel
        const savingsInfo = calculateIntervalSavings(selectedPlan, selectedInterval);
        setSavings(savingsInfo);

        // Comparaison des configurations d'assistants
        const comparison = compareAssistantConfig(
          selectedPlan.assistants,
          currentSubscription?.assistants
        );
        setComparisons(comparison);
      }
    }
  }, [selectedPlanId, availablePlans, currentSubscription, selectedInterval]);

  const handlePlanChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlanId(event.target.value);
  };

  const handleIntervalChange = (_event: React.MouseEvent<HTMLElement>, newInterval: string) => {
    if (newInterval !== null) {
      setSelectedInterval(newInterval);
    }
  };

  // Ouvrir le dialog de confirmation au lieu de confirmer directement
  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  // Fermer le dialog de confirmation
  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  // La confirmation finale après le dialog de confirmation
  const handleConfirm = () => {
    if (selectedPlanId) {
      onChangePlan(selectedPlanId, selectedInterval);
      setConfirmDialogOpen(false);
      onClose();
    }
  };

  // Vérifie si le plan actuel est déjà sélectionné
  const isCurrentPlan = (planId: string) =>
    currentSubscription &&
    planId === currentSubscription.id &&
    selectedInterval === currentSubscription.interval;

  // Obtenir les détails du plan sélectionné
  const selectedPlan = selectedPlanId
    ? availablePlans.find((plan) => plan.id === selectedPlanId)
    : null;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 0 }}>
          <Box display="flex" alignItems="center">
            <CompareArrowsIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {currentSubscription ? "Changer d'abonnement" : 'Choisir un abonnement'}
            </Typography>
          </Box>
        </DialogTitle>

        {/* Barre fixe pour la sélection d'intervalle */}
        <Paper
          elevation={2}
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1100,
            padding: 2,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {currentSubscription ? (
              <Typography variant="body2">
                Votre abonnement actuel : <strong>{currentSubscription.title}</strong> (
                {fCurrency(
                  currentSubscription.price[
                    currentSubscription.interval as keyof typeof currentSubscription.price
                  ] as number
                )}{' '}
                / {getIntervalLabel(currentSubscription.interval)})
              </Typography>
            ) : (
              <Typography variant="body2">
                Vous n&apos;avez pas d&apos;abonnement actif. Sélectionnez un plan ci-dessous.
              </Typography>
            )}

            {/* Sélecteur d'intervalle de facturation avec les trois options */}
            <ToggleButtonGroup
              value={selectedInterval}
              exclusive
              onChange={handleIntervalChange}
              aria-label="intervalle de facturation"
              size="small"
            >
              {ABONNEMENT_INTERVALS_OPTIONS.map((option) => (
                <ToggleButton key={option.value} value={option.value} aria-label={option.label}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Message d'économie si applicable */}
          <ConditionalComponent isValid={!!savings && savings.percent > 0}>
            <Alert severity="success" sx={{ mt: 2, mb: 0 }}>
              Économisez {savings?.percent}% ({fCurrency(savings?.amount)}) avec un paiement{' '}
              {selectedInterval === 'annual' ? 'annuel' : 'semestriel'} !
            </Alert>
          </ConditionalComponent>
        </Paper>

        <DialogContent sx={{ pt: 3 }}>
          {availablePlans.length === 0 ? (
            <Alert severity="info">
              Aucun plan d&apos;abonnement n&apos;est disponible pour le moment.
            </Alert>
          ) : (
            <RadioGroup value={selectedPlanId} onChange={handlePlanChange}>
              {sortedPlans.map((plan) => {
                const isCurrent = isCurrentPlan(plan.id);
                const planPrice = plan.price[selectedInterval as keyof typeof plan.price] as number;
                const planSavings = calculateIntervalSavings(plan, selectedInterval);

                return (
                  <Box key={plan.id} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: isCurrent ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        p: 2,
                        backgroundColor: isCurrent ? 'action.selected' : 'background.paper',
                        position: 'relative',
                      }}
                    >
                      <ConditionalComponent isValid={!!isCurrent}>
                        <Chip
                          label="Actuel"
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        />
                      </ConditionalComponent>

                      <FormControlLabel
                        value={plan.id}
                        control={<Radio />}
                        disabled={isCurrent}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="subtitle1">{plan.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" color="text.secondary">
                                {fCurrency(planPrice)} / {getIntervalLabel(selectedInterval)}
                              </Typography>
                              <ConditionalComponent
                                isValid={!!planSavings && planSavings.percent > 0}
                              >
                                <Chip
                                  label={`-${planSavings?.percent}%`}
                                  color="success"
                                  size="small"
                                  sx={{ ml: 1 }}
                                />
                              </ConditionalComponent>
                            </Box>
                          </Box>
                        }
                        sx={{ width: '100%', m: 0 }}
                      />
                      <Box sx={{ pl: 4, mt: 1 }}>
                        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Matières incluses
                            </Typography>
                            <Typography variant="body1">{plan.nbr_subjects} </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Questions quotidiennes
                            </Typography>
                            <Typography variant="body1">{plan.daily_question_limit} </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Enfants
                            </Typography>
                            <Typography variant="body1">{plan.nbr_children_access} </Typography>
                          </Box>
                        </Stack>

                        {/* Section assistants avec modèles TTS */}
                        <Box sx={{ mt: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: 'flex', alignItems: 'center' }}
                          >
                            Assistants inclus
                            <Tooltip title="Indique les assistants accessibles avec leurs modèles IA et TTS">
                              <InfoIcon sx={{ fontSize: 16, ml: 0.5, color: 'text.secondary' }} />
                            </Tooltip>
                          </Typography>
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            spacing={1}
                            gap={1}
                            sx={{ mt: 0.5 }}
                          >
                            {(
                              Object.keys(plan.assistants) as Array<keyof AssistantConfiguration>
                            ).map((assistant) => {
                              const assistantConfig = plan.assistants[assistant];
                              return assistantConfig.access ? (
                                <Chip
                                  key={assistant}
                                  label={`${assistant} (${AI_MODEL_COSTS[assistantConfig.textModel as AIModel]?.name || assistantConfig.textModel}${
                                    assistantConfig.ttsModel
                                      ? `, TTS: ${assistantConfig.ttsModel}`
                                      : ''
                                  })`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ) : null;
                            })}
                          </Stack>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </RadioGroup>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleOpenConfirmDialog}
            variant="contained"
            disabled={!selectedPlanId || isCurrentPlan(selectedPlanId)}
          >
            {currentSubscription ? 'Confirmer le changement' : 'Souscrire'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmation */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6">Confirmation</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <ConditionalComponent isValid={!!selectedPlan}>
            <>
              <Typography variant="body1" gutterBottom>
                Êtes-vous sûr de vouloir {currentSubscription ? 'changer pour' : 'souscrire à'}{' '}
                l&apos;abonnement <strong>{selectedPlan?.title}</strong> ?
              </Typography>

              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Détails de l&apos;abonnement:
                </Typography>
                <Typography variant="body1">
                  • Prix:{' '}
                  {fCurrency(
                    selectedPlan?.price[selectedInterval as keyof typeof selectedPlan.price] ?? 0
                  )}{' '}
                  / {getIntervalLabel(selectedInterval)}
                </Typography>
                <ConditionalComponent isValid={!!currentSubscription}>
                  <Typography
                    variant="body1"
                    sx={{ color: priceDifference > 0 ? 'error.main' : 'success.main' }}
                  >
                    • {priceDifference > 0 ? 'Supplément' : 'Économie'} de:{' '}
                    {fCurrency(Math.abs(priceDifference))} / {getIntervalLabel(selectedInterval)}
                  </Typography>
                </ConditionalComponent>
              </Box>
              <ConditionalComponent isValid={comparisons.downgrades.length > 0}>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    Attention: Ce changement inclut des réductions de fonctionnalités
                  </Typography>
                  <Typography variant="body2">
                    {comparisons.downgrades.map((item, index) => (
                      <Box key={index} component="span" display="block">
                        • {item.assistant}:{' '}
                        {item.type === 'access'
                          ? "Perte d'accès"
                          : item.type === 'model'
                            ? `Modèle réduit (${item.from} → ${item.to})`
                            : `TTS réduit (${item.from} → ${item.to})`}
                      </Box>
                    ))}
                  </Typography>
                </Alert>{' '}
              </ConditionalComponent>
            </>
          </ConditionalComponent>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleConfirm} variant="contained" color="primary">
            {currentSubscription
              ? 'Oui, changer mon abonnement'
              : 'Oui, souscrire à cet abonnement'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
