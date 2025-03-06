'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Exercice } from '../../types';

interface ExerciceDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  exercice: Exercice;
}

const ExerciceDeleteDialog = ({ open, onClose, onSubmit, exercice }: ExerciceDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Here would be API call to delete
      // await deleteExercice(exercice.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit();
    } catch (error) {
      console.error('Error deleting exercice:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          maxWidth: 400,
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows?.dialog,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>Confirmer la suppression</DialogTitle>
      <DialogContent sx={{ pb: 3 }}>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer l&quot;exercice{' '}
          <strong>&quot;{exercice.titre}&quot;</strong> ? Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={isDeleting}>
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
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExerciceDeleteDialog;
