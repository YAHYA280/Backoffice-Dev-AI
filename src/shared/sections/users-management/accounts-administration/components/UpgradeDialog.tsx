import type { SelectChangeEvent } from '@mui/material';
import type { ChildUser } from 'src/contexts/types/user';
import type { UpgradeType } from 'src/contexts/types/common';

import React from 'react';

import { useTheme } from '@mui/material/styles';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  Box,
  alpha,
  Button,
  Dialog,
  Select,
  Divider,
  MenuItem,
  TextField,
  InputLabel,
  Typography,
  DialogTitle,
  FormControl,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

import { fCurrency } from 'src/utils/format-number';

import { formatInterval } from 'src/shared/_mock';

import ConditionalComponent from 'src/shared/components/ConditionalComponent/ConditionalComponent';

interface UpgradeDialogProps {
  open: boolean;
  onClose: () => void;
  type: UpgradeType | null;
  upgradeValue: number;
  priceEstimation: number;
  setUpgradeValue: (value: number) => void;
  setPriceEstimation: (value: number) => void;
  onApply: () => void;
  currentValue: number;
  totalAfterUpgrade: number;
  children?: ChildUser[];
  targetChildId: string | null;
  onChildSelect?: (childId: string) => void;
  isChildSpecificUpgrade?: boolean;
  upgradeInterval?: string;
  currentBillingInterval: string;
  setUpgradeInterval?: (interval: string) => void;
  currentSubscriptionPrice?: number; // Prix actuel de l'abonnement
}

export const UpgradeDialog: React.FC<UpgradeDialogProps> = ({
  open,
  onClose,
  type,
  upgradeValue,
  priceEstimation,
  setUpgradeValue,
  setPriceEstimation,
  onApply,
  currentValue,
  totalAfterUpgrade,
  children = [],
  targetChildId,
  onChildSelect,
  isChildSpecificUpgrade = false,
  upgradeInterval = 'monthly',
  currentBillingInterval,
  setUpgradeInterval,
  currentSubscriptionPrice = 0,
}) => {
  const targetChild =
    targetChildId && type !== 'subjects'
      ? children.find((child) => child.id === targetChildId)
      : null;
  const theme = useTheme();

  const handleIntervalChange = (event: SelectChangeEvent) => {
    const newInterval = event.target.value;
    if (setUpgradeInterval) {
      setUpgradeInterval(newInterval);

      // Ajuster le prix en fonction de l'intervalle
      const basePrice = type === 'subjects' ? 5 : 2;
      const newPrice = basePrice * upgradeValue;
      // Calcul selon l'intervalle
      let multiplier = 1;
      if (newInterval === 'annual') {
        multiplier = 10; // Remise de 16% pour annuel (12 * 0.84 = 10.08 arrondi à 10)
      } else if (newInterval === 'semiannual') {
        multiplier = 5.5; // Remise de 8% pour semestriel (6 * 0.92 = 5.52 arrondi à 5.5)
      }

      setPriceEstimation(newPrice * multiplier);
    }
  };

  // Fonction pour mettre à jour la valeur d'upgrade et le prix estimé
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Pour les matières, on peut accepter 0, pour les questions on commence à 1
    const minValue = type === 'subjects' ? 0 : 1;
    const value = Math.max(minValue, parseInt(event.target.value, 10) || 0);
    setUpgradeValue(value);

    // Mettre à jour le prix estimé
    const basePrice = type === 'subjects' ? 5 : 2;
    const newPrice = basePrice * value;

    // Calcul selon l'intervalle
    let multiplier = 1;
    if (upgradeInterval === 'annual') {
      multiplier = 10;
    } else if (upgradeInterval === 'semiannual') {
      multiplier = 5.5;
    }

    setPriceEstimation(newPrice * multiplier);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <UpgradeIcon sx={{ mr: 1 }} />
        {type === 'subjects'
          ? `Ajouter des matières`
          : `Ajouter des questions quotidiennes${targetChild ? ` pour ${targetChild.firstName}` : ''}`}
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 3 }}>
          {type === 'subjects'
            ? "Ajoutez des matières supplémentaires à votre abonnement pour permettre à vos enfants d'explorer plus de disciplines."
            : 'Augmentez le nombre de questions quotidiennes pour permettre à vos enfants de pratiquer davantage.'}
        </DialogContentText>

        {/* Sélecteur d'enfant pour appliquer l'upgrade (seulement pour les questions, pas pour les matières) */}

        <ConditionalComponent
          isValid={!isChildSpecificUpgrade && children.length > 0 && type !== 'subjects'}
        >
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="upgrade-child-select-label">
              Appliquer à un enfant spécifique
            </InputLabel>
            <Select
              labelId="upgrade-child-select-label"
              id="upgrade-child-select"
              value={targetChildId || ''}
              label="Appliquer à un enfant spécifique"
              onChange={(e) => onChildSelect && onChildSelect(e.target.value as string)}
            >
              <MenuItem value="">Tous les enfants (abonnement global)</MenuItem>
              {children.map((child) => (
                <MenuItem key={child.id} value={child.id}>
                  {child.firstName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ConditionalComponent>

        {/* Champ numérique pour la valeur d'upgrade */}
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            id="upgrade-value"
            label={
              type === 'subjects' ? 'Nombre de matières à ajouter' : 'Nombre de questions à ajouter'
            }
            type="number"
            value={upgradeValue}
            onChange={handleValueChange}
            InputProps={{
              inputProps: {
                min: type === 'subjects' ? 0 : 1, // Permet 0 pour les matières
                max: type === 'subjects' ? 10 : 50,
              },
            }}
            fullWidth
          />
        </FormControl>

        {/* Sélecteur d'intervalle de facturation */}

        <ConditionalComponent isValid={!!setUpgradeInterval && !isChildSpecificUpgrade}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="upgrade-interval-label">Intervalle de facturation</InputLabel>
            <Select
              labelId="upgrade-interval-label"
              id="upgrade-interval"
              value={upgradeInterval}
              label="Intervalle de facturation"
              onChange={handleIntervalChange}
            >
              <MenuItem value="monthly">Mensuel</MenuItem>
              <MenuItem value="semiannual">Semestriel (économisez 8%)</MenuItem>
              <MenuItem value="annual">Annuel (économisez 16%)</MenuItem>
            </Select>
          </FormControl>{' '}
        </ConditionalComponent>

        {/* Récapitulatif */}
        <Box sx={{ bgcolor: 'background.neutral', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Récapitulatif
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {type === 'subjects' ? 'Matières actuelles' : 'Questions actuelles'}:
            </Typography>
            <Typography variant="body2">{currentValue}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {type === 'subjects' ? 'Matières à ajouter' : 'Questions à ajouter'}:
            </Typography>
            <Typography variant="body2" color="primary.main">
              +{upgradeValue}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2">
              {type === 'subjects' ? 'Total des matières' : 'Total des questions'}:
            </Typography>
            <Typography variant="subtitle2" color="primary.main">
              {totalAfterUpgrade}
            </Typography>
          </Box>
        </Box>

        {/* Affichage du prix de l'upgrade */}
        <Box bgcolor={alpha(theme.palette.primary.main, 0.1)} sx={{ p: 2, borderRadius: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ mr: 1 }} color="primary" />
              <Typography variant="subtitle2">Prix de l&apos;upgrade:</Typography>
            </Box>
            <Typography variant="h6" color="primary.main">
              {fCurrency(priceEstimation)} €
              {upgradeInterval ? ` / ${formatInterval(upgradeInterval)}` : ' / mois'}
            </Typography>
          </Box>
        </Box>

        {/* Affichage du prix total de l'abonnement */}
        <Box sx={{ bgcolor: 'secondary.lighter', p: 2, borderRadius: 1 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              Abonnement actuel:
            </Typography>
            <Typography variant="body1">
              {fCurrency(currentSubscriptionPrice)} €
              {currentBillingInterval ? ` / ${formatInterval(currentBillingInterval)}` : ' / mois'}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ mr: 1 }} color="secondary" />
              <Typography variant="subtitle2">Total après upgrade:</Typography>
            </Box>
            <Typography variant="h6" color="secondary.main">
              {fCurrency(priceEstimation + currentSubscriptionPrice)} €
              {upgradeInterval
                ? ` / ${formatInterval(upgradeInterval)}`
                : `${formatInterval(currentBillingInterval)}`}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={onApply}
          variant="contained"
          startIcon={<UpgradeIcon />}
          disabled={type === 'questions' && upgradeValue === 0}
        >
          {upgradeValue === 0 && setUpgradeInterval
            ? "Changer l'intervalle de facturation"
            : 'Confirmer la mise à niveau'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
