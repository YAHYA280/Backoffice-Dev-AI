import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  alpha,
  Stack,
  Dialog,
  Button,
  Avatar,
  Switch,
  useTheme,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControlLabel,
  DialogContentText,
} from '@mui/material';

import type { Challenge } from '../types';

interface ChallengeDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (permanentDelete: boolean) => void;
  challenge: Challenge;
  allowPermanentDelete?: boolean;
}

export const ChallengeDeleteDialog = ({
  open,
  onClose,
  onSubmit,
  challenge,
  allowPermanentDelete = false,
}: ChallengeDeleteDialogProps) => {
  const theme = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [permanentDelete, setPermanentDelete] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Dans une application réelle, il y aurait un appel API pour supprimer le challenge
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit(permanentDelete);
    } catch (error) {
      console.error('Error deleting challenge:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePermanentDeleteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPermanentDelete(event.target.checked);
  };

  const renderParticipantsWarning = () => {
    if (!challenge.participantsCount || challenge.participantsCount <= 0) return null;

    return (
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 1,
          bgcolor: alpha(theme.palette.warning.light, 0.1),
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            style={{
              color: theme.palette.warning.main,
              marginTop: 4,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            <strong>Attention :</strong> Ce challenge possède déjà{' '}
            <strong>{challenge.participantsCount}</strong> participant
            {challenge.participantsCount > 1 ? 's' : ''}. La suppression effacera toutes les données
            de participation et les résultats associés.
          </Typography>
        </Stack>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: 480,
          borderRadius: 2,
          boxShadow: (t) => t.customShadows?.dialog,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.error.main, 0.12),
            color: 'error.main',
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Avatar>
        <Typography variant="h6">Confirmer la suppression</Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer le challenge{' '}
          <strong>&quot;{challenge.titre}&quot;</strong> ?
        </DialogContentText>

        {renderParticipantsWarning()}

        {allowPermanentDelete && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.error.light, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={permanentDelete}
                  onChange={handlePermanentDeleteChange}
                  color="error"
                />
              }
              label={
                <Typography variant="body2" color="error.main" fontWeight="medium">
                  Supprimer définitivement (sans possibilité de restauration)
                </Typography>
              }
            />
            {permanentDelete && (
              <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                ATTENTION : Cette action est irréversible. Toutes les données seront définitivement
                supprimées.
              </Typography>
            )}
          </Box>
        )}

        {!permanentDelete && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note : Le challenge sera archivé et pourra être restauré ultérieurement si nécessaire.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isDeleting}
          sx={{
            borderColor: alpha(theme.palette.grey[500], 0.16),
          }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
          startIcon={
            isDeleting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FontAwesomeIcon icon={faTrash} />
            )
          }
        >
          {permanentDelete ? 'Supprimer définitivement' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeDeleteDialog;
