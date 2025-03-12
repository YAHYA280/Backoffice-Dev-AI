'use client';

// src/shared/sections/contenu-pedagogique/apprentissage/components/matiere/MatiereDialog.tsx
import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { MatiereForm } from './MatiereForm';

import type { Matiere } from '../../types';

interface MatiereDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  matiere?: Matiere;
  niveauId: string;
}

export const MatiereDialog = ({
  open,
  onClose,
  onSubmit,
  matiere,
  niveauId,
}: MatiereDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!matiere;
  const title = isEditMode ? 'Modifier une matière' : 'Ajouter une matière';

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      //  API call to save/update data

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit(data);
    } catch (error) {
      console.error('Error saving matiere:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
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
        <MatiereForm
          initialValues={matiere}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          niveauId={niveauId}
        />
      </DialogContent>
    </Dialog>
  );
};
