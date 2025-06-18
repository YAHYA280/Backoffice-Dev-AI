'use client';

import type { Subject } from 'src/types/subject';

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

import { useSubjectStore } from 'src/shared/api/stores/subjectStore';

interface MatiereDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  matiere: Subject;
}

const MatiereDeleteDialog = ({ open, onClose, onSubmit, matiere }: MatiereDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSubject = useSubjectStore(state => state.deleteSubject);


  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      //  API call to delete
      await deleteSubject(matiere.id);

      onSubmit();
      onClose();
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
          Êtes-vous sûr de vouloir supprimer la matière <strong>&quot; {matiere.name} &quot;</strong>{' '}
          ? Cette action supprimera également tous les chapitres et exercices associés à cette
          matière.
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

export default MatiereDeleteDialog;
