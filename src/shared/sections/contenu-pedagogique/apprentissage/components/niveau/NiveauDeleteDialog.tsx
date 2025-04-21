'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  alpha,
  Dialog,
  Button,
  Avatar,
  useTheme,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  DialogContentText,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate/variants/fade';

import type { Niveau } from '../../types';

interface NiveauDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  niveau: Niveau;
  directDelete?: boolean;
}

const NiveauDeleteDialog = ({
  open,
  onClose,
  onSubmit,
  niveau,
  directDelete = false,
}: NiveauDeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const theme = useTheme();

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      // API call to delete
      // await deleteNiveau(niveau.id);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit();
    } catch (error) {
      console.error('Error deleting niveau:', error);
    } finally {
      setIsDeleting(false);
    }
  }, [onSubmit]);

  useEffect(() => {
    if (open && directDelete) {
      handleDelete();
    }
  }, [open, directDelete, handleDelete]);

  if (directDelete) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: m.div,
        initial: 'initial',
        animate: 'animate',
        variants: varFade().in,
        sx: {
          maxWidth: 450,
          borderRadius: 2,
          boxShadow: theme.customShadows?.dialog,
          px: 1.5,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.12),
              color: 'error.main',
              width: 40,
              height: 40,
            }}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </Avatar>
          <Typography variant="h6">Confirmer la suppression</Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <DialogContentText sx={{ color: 'text.primary' }}>
          Êtes-vous sûr de vouloir supprimer le niveau <strong>&quot;{niveau.nom}&quot;</strong> ?
        </DialogContentText>

        <Box
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 1,
            bgcolor: alpha(theme.palette.warning.main, 0.08),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            color: 'warning.dark',
          }}
        >
          <Typography variant="body2">
            Cette action est irréversible et supprimera également toutes les matières et chapitres
            associés.
          </Typography>

          {niveau.matieresCount && niveau.matieresCount > 0 && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'fontWeightMedium' }}>
              Ce niveau contient {niveau.matieresCount} matière{niveau.matieresCount > 1 ? 's' : ''}
              .
            </Typography>
          )}

          {niveau.exercicesCount && niveau.exercicesCount > 0 && (
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 'fontWeightMedium' }}>
              Ce niveau contient {niveau.exercicesCount} exercice
              {niveau.exercicesCount > 1 ? 's' : ''}.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={onClose}
          disabled={isDeleting}
          sx={{
            borderColor: alpha(theme.palette.grey[500], 0.24),
            color: 'text.primary',
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
          sx={{
            boxShadow: theme.customShadows?.error,
            '&:hover': {
              boxShadow: 'none',
            },
          }}
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NiveauDeleteDialog;
