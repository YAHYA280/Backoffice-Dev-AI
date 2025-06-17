'use client';

import type { Level, LevelRequest } from 'src/types/level';

import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { useLevelStore } from 'src/shared/api/stores/levelStore';

import { NiveauForm } from './NiveauForm';

interface NiveauDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LevelRequest) => void;
  niveau?: Level;
}

export const NiveauDialog = ({ open, onClose, onSubmit, niveau }: NiveauDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLevel = useLevelStore(state => state.addLevel);
  const updateLevel = useLevelStore(state => state.updateLevel);


  const isEditMode = !!niveau;
  const title = isEditMode ? 'Modifier un niveau' : 'Ajouter un niveau';

  const handleSubmit = async (data: LevelRequest) => {
    setIsSubmitting(true);
    try {
      // Here would be API call to save/update data
      if (isEditMode && niveau) {
        await updateLevel(niveau.id.toString(), data);
      } else {
        await addLevel(data);
      }
      onSubmit(data);
      onClose();

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
          initialValues={niveau
            ? {
                name: niveau.name,
                description: niveau.description,
                code: niveau.code,
              }
            : {
                name: '',
                description: '',
                code: '',
              }
          }
          isEditMode={!!niveau}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
