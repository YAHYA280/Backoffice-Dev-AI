'use client';

import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { ChapitreForm } from './ChapitreForm';

import type { Chapitre } from '../../types';

interface ChapitreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  chapitre?: Chapitre;
  matiereId: string;
}

const ChapitreDialog = ({ open, onClose, onSubmit, chapitre, matiereId }: ChapitreDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!chapitre;
  const title = isEditMode ? 'Modifier un chapitre' : 'Ajouter un chapitre';

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Here would be API call to save/update data
      // const response = await saveChapitre({ ...data, matiereId });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      onSubmit(data);
    } catch (error) {
      console.error('Error saving chapitre:', error);
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
        <ChapitreForm
          initialValues={chapitre}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          matiereId={matiereId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChapitreDialog;
