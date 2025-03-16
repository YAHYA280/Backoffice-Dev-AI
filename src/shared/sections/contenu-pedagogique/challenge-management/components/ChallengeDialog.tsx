import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { ChallengeForm } from './ChallengeForm';

import type { Challenge } from '../types';

interface ChallengeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Challenge>) => void;
  challenge?: Challenge;
  niveaux?: { id: string; nom: string }[];
  matieres?: { id: string; nom: string }[];
}

export const ChallengeDialog = ({
  open,
  onClose,
  onSubmit,
  challenge,
  niveaux = [],
  matieres = [],
}: ChallengeDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!challenge;
  const title = isEditMode ? 'Modifier un challenge' : 'Ajouter un challenge';

  const handleSubmit = async (data: Partial<Challenge>) => {
    setIsSubmitting(true);
    try {
      // Ici, il y aurait un appel API pour sauvegarder/mettre à jour les données
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit(data);
    } catch (error) {
      console.error('Error saving challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ position: 'relative', p: 3 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <ChallengeForm
          initialValues={challenge}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          niveaux={niveaux}
          prerequisChallenges={[]}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeDialog;
