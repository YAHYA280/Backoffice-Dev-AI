import type { ChildUser } from 'src/contexts/types/user';
import type { Upgrade, UpgradeType } from 'src/contexts/types/common';
import type { PurchasedSubscription } from 'src/contexts/types/abonnement';

import dayjs from 'dayjs';
import React, { useState, useCallback } from 'react';

import AddIcon from '@mui/icons-material/Add';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { Box, Card, Grid, Link, Stack, Alert, Button, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fCurrency } from 'src/utils/format-number';

import { getIntervalLabel } from 'src/shared/_mock';

import { Label } from 'src/shared/components/label';
import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

import { UpgradeDialog } from './UpgradeDialog';

interface SubscriptionTabProps {
  subscription: PurchasedSubscription;
  children: ChildUser[];
  totalSubjectsSelected: number;
  remainingSubjectsToAllocate: number;
  openSubjectsModal: (childId: string) => void;
  applyUpgrade: (upgrade: Upgrade) => void;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({
  subscription,
  children,
  totalSubjectsSelected,
  remainingSubjectsToAllocate,
  openSubjectsModal,
  applyUpgrade,
}) => {
  // États pour le dialogue d'upgrade
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [upgradeType, setUpgradeType] = useState<UpgradeType | null>(null);
  const [upgradeValue, setUpgradeValue] = useState<number>(1);
  const [targetChildId, setTargetChildId] = useState<string | null>(null);
  const [upgradeInterval, setUpgradeInterval] = useState<string>('monthly');
  const [priceEstimation, setPriceEstimation] = useState<number>(0);

  // Prix par défaut
  const subjectBasePrice = 5; // Prix par matière supplémentaire
  const questionBasePrice = 2; // Prix par question supplémentaire
  const currentSubscriptionPrice = subscription.price.monthly || 0;

  // Calculer le nombre actuel de questions ou de matières selon le type d'upgrade
  const getCurrentValue = useCallback(
    (type: UpgradeType, childId: string | null): number => {
      if (type === 'subjects') {
        return subscription.nbr_subjects;
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
    (type: UpgradeType, value: number, childId: string | null): number => {
      const current = getCurrentValue(type, childId);
      return current + value;
    },
    [getCurrentValue]
  );

  // Ouvrir le dialogue d'upgrade
  const openUpgradeDialog = useCallback(
    (type: UpgradeType, childId?: string) => {
      // Initialisation des valeurs d'upgrade par défaut
      const initialValue = type === 'subjects' ? 1 : 5;

      setUpgradeType(type);
      setUpgradeValue(initialValue);
      setTargetChildId(childId || null);

      // Calculer le prix estimé initial
      const basePrice = type === 'subjects' ? subjectBasePrice : questionBasePrice;
      const initialPrice = basePrice * initialValue;
      setPriceEstimation(initialPrice);

      setUpgradeInterval('monthly');
      setUpgradeDialogOpen(true);
    },
    [subjectBasePrice, questionBasePrice]
  );

  // Appliquer l'upgrade
  const handleApplyUpgrade = useCallback(() => {
    if (!upgradeType) return;

    const currentDate = new Date().toISOString();
    const upgradeCost = priceEstimation;

    // Créer l'objet d'upgrade approprié selon le type
    let upgrade: Upgrade;

    if (upgradeType === 'subjects') {
      // Pour les upgrades de matières (GlobalUpgrade)
      upgrade = {
        id: `upgrade-${currentDate}`,
        type: 'subjects',
        cost: upgradeCost,
        date: currentDate,
        additional_subjects: upgradeValue,
        interval: upgradeInterval,
      };
    } else if (upgradeType === 'questions' && targetChildId) {
      // Pour les upgrades de questions pour un enfant spécifique (ChildSpecificUpgrade)
      upgrade = {
        id: `upgrade-${currentDate}`,
        type: 'questions',
        cost: upgradeCost,
        date: currentDate,
        childId: targetChildId,
        additional_questions: upgradeValue,
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
  }, [upgradeType, upgradeInterval, priceEstimation, targetChildId, applyUpgrade, upgradeValue]);

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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => openUpgradeDialog('subjects')}
              size="small"
            >
              Upgrade abonnement
            </Button>
          </Box>
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
        currentBillingInterval={subscription.interval}
        setUpgradeInterval={upgradeType === 'subjects' ? setUpgradeInterval : undefined}
        currentSubscriptionPrice={subscription.price.monthly}
      />
    </Grid>
  );
};

export default SubscriptionTab;
