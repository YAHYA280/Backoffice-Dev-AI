import type { ChildUser } from 'src/contexts/types/user';
import type { Upgrade, UpgradeType } from 'src/contexts/types/common';
import type { IAbonnementItem, PurchasedSubscription } from 'src/contexts/types/abonnement';

import dayjs from 'dayjs';
import React, { useState, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Card, Grid, Link, Stack, Alert, Button, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

import { abonnementItems, getIntervalLabel } from 'src/shared/_mock';

import { Label } from 'src/shared/components/label';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { UpgradeDialog } from './UpgradeDialog';
import { ChangePlanDialog } from './ChangePlanDialog';

interface SubscriptionTabProps {
  open: boolean;
  onClose: () => void;
  onChangePlan: (planId: string, interval: string) => void;
  subscription?: PurchasedSubscription;
  children: ChildUser[];
  totalSubjectsSelected: number;
  remainingSubjectsToAllocate: number;
  openSubjectsModal: (childId: string) => void;
  applyUpgrade: (upgrade: Upgrade) => void;
  changePlan: (planId: string) => void;
  availablePlans?: IAbonnementItem[];
  navigateToPlans?: () => void;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  open,
  onClose,
  onChangePlan,
  subscription,
  children,
  totalSubjectsSelected,
  remainingSubjectsToAllocate,
  openSubjectsModal,
  applyUpgrade,
  changePlan,
  navigateToPlans,
  availablePlans = [],
}) => {
  // États pour le dialogue d'upgrade
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [upgradeType, setUpgradeType] = useState<UpgradeType | null>(null);
  const [upgradeValue, setUpgradeValue] = useState<number>(1);
  const [targetChildId, setTargetChildId] = useState<string | null>(null);
  const [upgradeInterval, setUpgradeInterval] = useState<string>('monthly');
  const [priceEstimation, setPriceEstimation] = useState<number>(0);

  // Prix par défaut
  const questionBasePrice = 2; // Prix par question supplémentaire
  const currentSubscriptionPrice = subscription?.price?.monthly || 0;

  // Calculer le nombre actuel de questions ou de matières selon le type d'upgrade
  const getCurrentValue = useCallback(
    (type: UpgradeType, childId: string | null): number | string => {
      if (!subscription) return 0;

      if (type === 'interval') {
        return subscription.interval;
      }

      if (childId) {
        const child = children.find((c) => c.id === childId);
        return child?.daily_question_limit || subscription.daily_question_limit;
      }

      return subscription.daily_question_limit;
    },
    [children, subscription]
  );

  // Calculer le total après l'upgrade
  const calculateTotalAfterUpgrade = useCallback(
    (type: UpgradeType, value: number, childId: string | null): number | string => {
      const current = getCurrentValue(type, childId);
      if (type === 'interval') {
        return upgradeInterval || 'monthly';
      }

      // Pour les questions, on additionne comme avant
      return (current as number) + value;
    },
    [getCurrentValue, upgradeInterval]
  );

  // Ouvrir le dialogue d'upgrade
  const openUpgradeDialog = useCallback(
    (type: UpgradeType, childId?: string) => {
      // Vérifier si un abonnement existe
      if (!subscription) return;

      // Initialisation des valeurs d'upgrade par défaut
      const initialValue = type === 'interval' ? 0 : 5;

      setUpgradeType(type);
      setUpgradeValue(initialValue);
      setTargetChildId(childId || null);

      // Calculer le prix estimé initial
      if (type === 'interval') {
        // Pour le changement d'intervalle, pas de prix initial
        setPriceEstimation(0);
      } else {
        // Pour les questions
        const initialPrice = questionBasePrice * initialValue;
        setPriceEstimation(initialPrice);
      }
      setUpgradeInterval('monthly');
      setUpgradeDialogOpen(true);
    },
    [questionBasePrice, subscription]
  );

  // Appliquer l'upgrade
  const handleApplyUpgrade = useCallback(() => {
    if (!upgradeType || !subscription) return;

    const currentDate = new Date().toISOString();
    const upgradeCost = priceEstimation;

    // Créer l'objet d'upgrade approprié selon le type
    let upgrade: Upgrade;

    if (upgradeType === 'questions' && targetChildId) {
      // Pour les upgrades de questions pour un enfant spécifique (ChildSpecificUpgrade)
      upgrade = {
        id: `upgrade-${currentDate}`,
        type: 'questions',
        cost: upgradeCost,
        date: currentDate,
        childId: targetChildId,
        additional_questions: upgradeValue,
      };
    } else if (upgradeType === 'interval') {
      // Pour les upgrades d'intervalle de facturation
      upgrade = {
        id: `upgrade-${currentDate}`,
        type: 'interval',
        cost: upgradeCost,
        date: currentDate,
        interval: upgradeInterval,
      };
    } else {
      // Pour d'autres cas (UpgradeBase)
      upgrade = {
        id: `upgrade-${currentDate}`,
        type: upgradeType,
        cost: upgradeCost,
        date: currentDate,
      };
    }

    // Appliquer l'upgrade via la fonction fournie
    applyUpgrade(upgrade);

    // Fermer le dialogue
    setUpgradeDialogOpen(false);
  }, [
    upgradeType,
    upgradeInterval,
    priceEstimation,
    targetChildId,
    applyUpgrade,
    upgradeValue,
    subscription,
  ]);

  // Vérifier si l'abonnement existe
  const hasSubscription = !!subscription;

  // Affichage pour le cas où il n'y a pas d'abonnement
  if (!hasSubscription) {
    return (
      <Grid container spacing={3} justifyContent="center">
        <Grid xs={12} md={8} item>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Aucun abonnement actif
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Vous n&apos;avez pas encore d&apos;abonnement actif. Choisissez un abonnement pour
              accéder à toutes les fonctionnalités.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={navigateToPlans}
              size="large"
              sx={{ mt: 2 }}
            >
              Choisir un abonnement
            </Button>
          </Card>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Carte d'informations sur l'abonnement */}
      <Grid xs={12} md={4} item>
        <Card sx={{ p: 3, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Détails de l&apos;abonnement
          </Typography>
          <Box sx={{ position: 'relative', mb: 3 }}>
            <Label
              color={
                subscription.publish === 'published'
                  ? 'success'
                  : subscription.publish === 'draft'
                    ? 'warning'
                    : 'error'
              }
              sx={{ position: 'absolute', top: 0, right: 0 }}
            >
              {subscription.publish === 'published'
                ? 'Actif'
                : subscription.publish === 'pending'
                  ? 'En attente'
                  : 'Expiré'}
            </Label>
            <Typography variant="h5" sx={{ mb: 1 }}>
              <Link
                href={paths.dashboard.abonnements.details(subscription.id)}
                sx={{ textDecoration: 'none', color: 'inherit' }}
              >
                {subscription.title || 'Non spécifié'}
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subscription.shortDescription || 'Non spécifié'}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Date de début
              </Typography>
              <Typography variant="body2">
                {dayjs(subscription.createdAt).format('DD/MM/YYYY') || 'Non spécifié'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Date d&apos;expiration
              </Typography>
              <Typography
                variant="body2"
                color={
                  subscription.expiredAt && dayjs(subscription.expiredAt).diff(dayjs(), 'day') < 7
                    ? 'error.main'
                    : 'text.primary'
                }
              >
                {subscription.expiredAt
                  ? dayjs(subscription.expiredAt).format('DD/MM/YYYY')
                  : 'Non définie'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Nombre d&apos;enfants
              </Typography>
              <Typography variant="body2">
                {children.length} / {subscription.nbr_children_access || 'Non spécifié'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Matières utilisées
              </Typography>
              <Typography variant="body2">
                {totalSubjectsSelected} / {subscription.nbr_subjects || 'Non spécifié'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Prix actuel
              </Typography>
              <Typography variant="body2">
                {fCurrency(currentSubscriptionPrice)} /{' '}
                {getIntervalLabel(subscription.interval) || 'Non spécifié'}
              </Typography>
            </Stack>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SwapHorizIcon />}
              onClick={() => changePlan}
              size="small"
              fullWidth
            >
              Changer d&apos;abonnement
            </Button>

            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openUpgradeDialog('interval')}
              size="small"
              fullWidth
            >
              Changer intervalle de facturation
            </Button>
          </Stack>
        </Card>
      </Grid>

      {/* Carte de gestion des enfants et matières */}
      <Grid xs={12} md={8} item>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gestion des enfants et matières
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Vous pouvez attribuer jusqu&apos;à {subscription.nbr_subjects || 0} matières au total.
            Il vous reste {remainingSubjectsToAllocate} matière(s) à attribuer.
          </Alert>

          {children.length === 0 ? (
            <Alert severity="warning">
              Aucun enfant n&apos;est encore rattaché à votre compte.
            </Alert>
          ) : (
            children.map((child) => (
              <Card
                key={child.id}
                sx={{ p: 2, mb: 2, bgcolor: 'background.neutral', borderRadius: 1 }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChildCareIcon sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">
                      <Link
                        href={paths.dashboard.user.consulter(child.id)}
                        sx={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        {child.firstName || 'Non spécifié'}
                      </Link>
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => openSubjectsModal(child.id)}
                  >
                    Gérer les matières
                  </Button>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  <ConditionalComponent
                    isValid={
                      child.subjects && child.subjects.filter((s) => s.isSelected).length > 0
                    }
                  >
                    {child.subjects
                      .filter((s) => s.isSelected)
                      .map((subject) => (
                        <Label key={subject.id} color="primary">
                          {subject.name}
                        </Label>
                      ))}
                  </ConditionalComponent>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 2,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Questions quotidiennes:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {child.daily_question_limit ??
                        subscription.daily_question_limit ??
                        'Non spécifié'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<UpgradeIcon />}
                      onClick={() => openUpgradeDialog('questions', child.id)}
                    >
                      Ajouter questions
                    </Button>
                  </Stack>
                </Box>
              </Card>
            ))
          )}
        </Card>
      </Grid>

      {/* Dialogue d'upgrade */}
      <UpgradeDialog
        open={upgradeDialogOpen}
        onClose={() => setUpgradeDialogOpen(false)}
        type={upgradeType}
        upgradeValue={upgradeValue}
        setUpgradeValue={setUpgradeValue}
        onApply={handleApplyUpgrade}
        currentValue={upgradeType ? getCurrentValue(upgradeType, targetChildId) : 0}
        totalAfterUpgrade={
          upgradeType ? calculateTotalAfterUpgrade(upgradeType, upgradeValue, targetChildId) : 0
        }
        priceEstimation={priceEstimation}
        setPriceEstimation={setPriceEstimation}
        children={children}
        targetChildId={targetChildId}
        onChildSelect={setTargetChildId}
        upgradeInterval={upgradeInterval}
        currentBillingInterval={subscription?.interval || 'monthly'}
        setUpgradeInterval={upgradeType === 'interval' ? setUpgradeInterval : undefined}
        currentSubscriptionPrice={subscription?.price?.monthly || 0}
      />

      {/* Dialogue de changement de plan */}
      <ConditionalComponent isValid={!!subscription}>
        <ChangePlanDialog
          open={open}
          onClose={onClose}
          currentSubscription={subscription}
          onChangePlan={onChangePlan}
          availablePlans={abonnementItems}
        />{' '}
      </ConditionalComponent>
    </Grid>
  );
};

export default SubscriptionTab;
