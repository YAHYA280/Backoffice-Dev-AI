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
import { Exercice } from '../view/apprentissage-view';

type AddExerciceDialogProps = {
  open: boolean;
  onClose: () => void;
  chapitreId: number;
  onSubmit: (newExercice: Omit<Exercice, 'id' | 'dateCreation'>) => void;
};

export default function AddExerciceDialog({
  open,
  onClose,
  chapitreId,
  onSubmit,
}: AddExerciceDialogProps) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [ressources, setRessources] = useState('');
  const [configuration, setConfiguration] = useState('');
  const [planification, setPlanification] = useState('');

  const handleSubmit = () => {
    onSubmit({ chapitreId, titre, description, ressources, configuration, planification });
    setTitre('');
    setDescription('');
    setRessources('');
    setConfiguration('');
    setPlanification('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter / Modifier un Exercice</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Titre"
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
          label="Ressources"
          fullWidth
          value={ressources}
          onChange={(e) => setRessources(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Configuration"
          fullWidth
          value={configuration}
          onChange={(e) => setConfiguration(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Planification"
          fullWidth
          value={planification}
          onChange={(e) => setPlanification(e.target.value)}
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
