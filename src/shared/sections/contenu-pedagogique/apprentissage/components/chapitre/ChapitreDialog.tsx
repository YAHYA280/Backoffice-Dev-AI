'use client';

import type { Chapter, ChapterRequest } from 'src/types/chapter';

import React, { useState } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Dialog, Typography, IconButton, DialogTitle, DialogContent } from '@mui/material';

import { useChapterStore } from 'src/shared/api/stores/chapterStore';

import { ChapitreForm } from './ChapitreForm';

interface ChapitreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ChapterRequest) => void;
  chapitre?: Chapter;
  matiereId: string;
}

const ChapitreDialog = ({ open, onClose, onSubmit, chapitre, matiereId }: ChapitreDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addChapter = useChapterStore((state) => state.addChapter);
  const updateChapter = useChapterStore((state) => state.updateChapter);

  const isEditMode = !!chapitre;
  const title = isEditMode ? 'Modifier un chapitre' : 'Ajouter un chapitre';

  const handleSubmit = async (data: { name: string; description: string; ordre: number; difficulty: string; }) => {
    setIsSubmitting(true);
    try {
      // Map form data to ChapterRequest
      const chapterRequest: ChapterRequest = {
        name: data.name,
        description: data.description,
        order: data.ordre,
        difficulty: data.difficulty as ChapterRequest['difficulty'],
        subjectId: matiereId,
      };

      if (isEditMode && chapitre) {
        await updateChapter(chapitre.id, chapterRequest);
      } else {
        await addChapter(chapterRequest);
      }

      onSubmit(chapterRequest);
      onClose();
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
          initialValues={
            chapitre
              ? {
                  name: chapitre.name,
                  description: chapitre.description,
                  ordre: chapitre.order,
                  difficulty: chapitre.difficulty,
                }
              : {
                  name: '',
                  description: '',
                  ordre: 1,
                  difficulty: 'MEDIUM',
                }
          }
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
          isEditMode={!!chapitre}
          matiereId={matiereId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ChapitreDialog;
