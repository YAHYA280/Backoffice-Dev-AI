'use client';

import React, { useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Dialog,
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
} from '@mui/material';

import type { Chapitre } from '../../types';

interface ChapitreDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  chapitre: Chapitre;
}

const ChapitreDeleteDialog = ({ open, onClose, onSubmit, chapitre }: ChapitreDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // API call to delete

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit();
    } catch (error) {
      console.error('Error deleting chapitre:', error);
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
          Êtes-vous sûr de vouloir supprimer le chapitre <strong>&quot;{chapitre.nom}&quot;</strong>{' '}
          ? Cette action supprimera également tous les exercices associés à ce chapitre.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button variant="outlined" color="primary" onClick={onClose} disabled={isDeleting}>
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

export default ChapitreDeleteDialog;
