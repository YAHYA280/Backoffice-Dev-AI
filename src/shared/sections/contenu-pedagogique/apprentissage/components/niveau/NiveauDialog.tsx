'use client';

import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { NiveauForm } from './NiveauForm';

import type { Niveau } from '../../types';

interface NiveauDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  niveau?: Niveau;
}

export const NiveauDialog = ({ open, onClose, onSubmit, niveau }: NiveauDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!niveau;
  const title = isEditMode ? 'Modifier un niveau' : 'Ajouter un niveau';

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Here would be API call to save/update data

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit(data);
    } catch (error) {
      console.error('Error saving niveau:', error);
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
        <NiveauForm
          initialValues={niveau}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
