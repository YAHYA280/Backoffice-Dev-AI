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
};

export default function AddNiveauDialog({ open, onClose, onSubmit }: AddNiveauDialogProps) {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [observation, setObservation] = useState('');

  const handleSubmit = () => {
    onSubmit({ nom, description, observation });
    setNom('');
    setDescription('');
    setObservation('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter / Modifier un Niveau</DialogTitle>
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
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
