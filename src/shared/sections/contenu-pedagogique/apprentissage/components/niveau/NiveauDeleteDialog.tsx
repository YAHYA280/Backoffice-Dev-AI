'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Box,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Niveau } from '../../types';

interface NiveauDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  niveau: Niveau;
}

const NiveauDeleteDialog = ({ open, onClose, onSubmit, niveau }: NiveauDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Here would be API call to delete
      // await deleteNiveau(niveau.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit();
    } catch (error) {
      console.error('Error deleting niveau:', error);
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
          Êtes-vous sûr de vouloir supprimer le niveau <strong>&quot;{niveau.nom}&quot;</strong> ?
          Cette action est irréversible.
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

export default NiveauDeleteDialog;
