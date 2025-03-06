'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Exercice } from '../../types';
import { ExerciceForm } from './ExerciceForm';

interface ExerciceDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  exercice?: Exercice;
  chapitreId: string;
}

const ExerciceDialog = ({ open, onClose, onSubmit, exercice, chapitreId }: ExerciceDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!exercice;
  const title = isEditMode ? 'Modifier un exercice' : 'Ajouter un exercice';

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Here would be API call to save/update data
      // const response = await saveExercice({ ...data, chapitreId });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit(data);
    } catch (error) {
      console.error('Error saving exercice:', error);
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
        <ExerciceForm
          initialValues={exercice}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          chapitreId={chapitreId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExerciceDialog;
