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
import { Chapitre } from '../view/apprentissage-view';

type AddChapitreDialogProps = {
  open: boolean;
  onClose: () => void;
  // matiereId doit être transmis par le parent
  matiereId: number;
  onSubmit: (newChapitre: Omit<Chapitre, 'id' | 'dateCreation'>) => void;
};

export default function AddChapitreDialog({
  open,
  onClose,
  matiereId,
  onSubmit,
}: AddChapitreDialogProps) {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [difficulte, setDifficulte] = useState('');
  const [ordre, setOrdre] = useState<number>(1);
  const [conditionsAcces, setConditionsAcces] = useState('');

  const handleSubmit = () => {
    // Maintenant, nous incluons matiereId dans l'objet soumis
    onSubmit({ matiereId, nom, description, difficulte, ordre, conditionsAcces });
    setNom('');
    setDescription('');
    setDifficulte('');
    setOrdre(1);
    setConditionsAcces('');
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter / Modifier un Chapitre</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Nom du Chapitre"
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
          label="Difficulté"
          fullWidth
          value={difficulte}
          onChange={(e) => setDifficulte(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Ordre"
          fullWidth
          type="number"
          value={ordre}
          onChange={(e) => setOrdre(Number(e.target.value))}
        />
        <TextField
          margin="normal"
          label="Conditions d'accès (facultatif)"
          fullWidth
          value={conditionsAcces}
          onChange={(e) => setConditionsAcces(e.target.value)}
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
