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
import { Matiere } from '../../types';

interface MatiereDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  matiere: Matiere;
}

const MatiereDeleteDialog = ({ open, onClose, onSubmit, matiere }: MatiereDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Here would be API call to delete
      // await deleteMatiere(matiere.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit();
    } catch (error) {
      console.error('Error deleting matiere:', error);
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
          Êtes-vous sûr de vouloir supprimer la matière <strong>&quot; {matiere.nom} &quot;</strong>{' '}
          ? Cette action supprimera également tous les chapitres et exercices associés à cette
          matière.
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

export default MatiereDeleteDialog;
