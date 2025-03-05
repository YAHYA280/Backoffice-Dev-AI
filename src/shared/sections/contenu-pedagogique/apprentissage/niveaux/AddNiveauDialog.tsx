'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { Niveau } from '../view/apprentissage-view';

type AddNiveauDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (newNiveau: Omit<Niveau, 'id' | 'dateCreation'>) => void;
  editMode?: boolean;
  initialData?: Partial<Niveau>;
};

export default function AddNiveauDialog({
  open,
  onClose,
  onSubmit,
  editMode = false,
  initialData = {},
}: AddNiveauDialogProps) {
  const [nom, setNom] = useState(initialData.nom || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [observation, setObservation] = useState(initialData.observation || '');

  // Reset form when dialog opens/closes
  const resetForm = () => {
    if (editMode && initialData) {
      setNom(initialData.nom || '');
      setDescription(initialData.description || '');
      setObservation(initialData.observation || '');
    } else {
      setNom('');
      setDescription('');
      setObservation('');
    }
  };

  const handleSubmit = () => {
    onSubmit({ nom, description, observation });
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
      <DialogTitle>{editMode ? 'Modifier un Niveau' : 'Ajouter un Niveau'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Nom du Niveau"
          fullWidth
          value={nom}
          onChange={(e) => setNom(e.target.value)}
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
          label="Observation (facultatif)"
          fullWidth
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!nom || !description}>
          {editMode ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
