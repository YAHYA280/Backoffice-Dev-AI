'use client';

// src/shared/sections/contenu-pedagogique/apprentissage/components/matiere/MatiereDialog.tsx
import type { Subject, SubjectRequest } from 'src/types/subject';

import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { useSubjectStore } from 'src/shared/api/stores/subjectStore';

import { MatiereForm } from './MatiereForm';

interface MatiereDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectRequest) => void;
  matiere?: Subject;
  niveauId: string;
}

export const MatiereDialog = ({
  open,
  onClose,
  onSubmit,
  matiere,
  niveauId,
}: MatiereDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSubject = useSubjectStore((state) => state.addSubject);
  const updateSubject = useSubjectStore((state) => state.updateSubject);

  const isEditMode = !!matiere;
  const title = isEditMode ? 'Modifier une matière' : 'Ajouter une matière';

  const handleSubmit = async (data: {
    name: string;
    description: string;
    active: boolean;
    color?: string;
    icon?: string;
  }) => {
    setIsSubmitting(true);
    try {
      const subjectRequest: SubjectRequest = {
        name: data.name,
        description: data.description,
        active: data.active,
        color: data.color ?? '',
        levelId: niveauId,
      };
      //  API call to save/update data
      if (isEditMode && matiere) {
        await updateSubject(matiere.id, subjectRequest);
      } else {
        await addSubject(subjectRequest);
      }

      onSubmit(subjectRequest);
      onClose();
    } catch (error) {
      console.error('Error saving matiere:', error);
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
        <MatiereForm
          initialValues={
            matiere
              ? {
                  name: matiere.name,
                  description: matiere.description,
                  color: matiere.color,
                  active: matiere.active,
                }
              : { name: '', description: '', color:'', active: true }
          }
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isEditMode={!!matiere}
          niveauId={niveauId}
        />
      </DialogContent>
    </Dialog>
  );
};
