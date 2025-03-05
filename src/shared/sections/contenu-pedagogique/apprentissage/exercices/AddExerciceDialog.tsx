'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

/**
 * If your Exercice interface is in another file (e.g. ../view/apprentissage-view),
 * import it:
 *    import { Exercice } from '../view/apprentissage-view';
 * Otherwise, define it below for this example:
 */
export interface Exercice {
  id: number;
  chapitreId: number;
  titre: string;
  description: string;
  ressources?: string;
  configuration?: string;
  planification?: string;
  dateCreation: string;
}

type AddExerciceDialogProps = {
  open: boolean;
  onClose: () => void;
  chapitreId: number;
  onSubmit: (newExercice: Omit<Exercice, 'id' | 'dateCreation' | 'chapitreId'>) => void;
  editMode?: boolean;
  initialData?: Partial<Exercice>;
};

export default function AddExerciceDialog({
  open,
  onClose,
  chapitreId,
  onSubmit,
  editMode = false,
  initialData = {},
}: AddExerciceDialogProps) {
  const [titre, setTitre] = useState(initialData.titre || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [ressources, setRessources] = useState(initialData.ressources || '');
  const [configuration, setConfiguration] = useState(initialData.configuration || '');
  const [planification, setPlanification] = useState(initialData.planification || '');

  // Reset the form each time the dialog opens
  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setTitre(initialData.titre || '');
        setDescription(initialData.description || '');
        setRessources(initialData.ressources || '');
        setConfiguration(initialData.configuration || '');
        setPlanification(initialData.planification || '');
      } else {
        setTitre('');
        setDescription('');
        setRessources('');
        setConfiguration('');
        setPlanification('');
      }
    }
  }, [open, editMode, initialData]);

  const handleSubmit = () => {
    onSubmit({
      titre,
      description,
      ressources,
      configuration,
      planification,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editMode ? 'Modifier un Exercice' : 'Ajouter un Exercice'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Titre de l'exercice"
          fullWidth
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          margin="normal"
          label="Ressources (facultatif)"
          fullWidth
          multiline
          rows={2}
          value={ressources}
          onChange={(e) => setRessources(e.target.value)}
        />

        <TextField
          margin="normal"
          label="Configuration (facultatif)"
          fullWidth
          multiline
          rows={2}
          value={configuration}
          onChange={(e) => setConfiguration(e.target.value)}
        />

        <TextField
          margin="normal"
          label="Planification (facultatif)"
          fullWidth
          multiline
          rows={2}
          value={planification}
          onChange={(e) => setPlanification(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!titre || !description}>
          {editMode ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
