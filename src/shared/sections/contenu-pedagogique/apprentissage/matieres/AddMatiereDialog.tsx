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
import { Matiere } from '../view/apprentissage-view';

type AddMatiereDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (newMatiere: Omit<Matiere, 'id' | 'dateCreation' | 'niveauId'>) => void;
};

export default function AddMatiereDialog({ open, onClose, onSubmit }: AddMatiereDialogProps) {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [couleur, setCouleur] = useState('');
  const [icone, setIcone] = useState('');

  const handleSubmit = () => {
    onSubmit({ nom, description, couleur, icone });
    setNom('');
    setDescription('');
    setCouleur('');
    setIcone('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter / Modifier une Matière</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Nom de la Matière"
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
          label="Couleur (hex)"
          fullWidth
          value={couleur}
          onChange={(e) => setCouleur(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Icône"
          fullWidth
          value={icone}
          onChange={(e) => setIcone(e.target.value)}
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
