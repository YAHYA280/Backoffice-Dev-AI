'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Chapitre } from '../view/apprentissage-view';

// Predefined difficulty options
const difficultyOptions = [
  { value: 'Facile', label: 'Facile' },
  { value: 'Moyen', label: 'Moyen' },
  { value: 'Difficile', label: 'Difficile' },
];

type AddChapitreDialogProps = {
  open: boolean;
  onClose: () => void;
  matiereId: number; // If you need it, though it's not used in the form
  onSubmit: (newChapitre: Omit<Chapitre, 'id' | 'dateCreation' | 'matiereId'>) => void;
  editMode?: boolean;
  initialData?: Partial<Chapitre>;
};

export default function AddChapitreDialog({
  open,
  onClose,
  matiereId,
  onSubmit,
  editMode = false,
  initialData = {},
}: AddChapitreDialogProps) {
  const [nom, setNom] = useState(initialData.nom || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [difficulte, setDifficulte] = useState(
    initialData.difficulte || difficultyOptions[0].value
  );
  const [ordre, setOrdre] = useState(initialData.ordre || 1);
  const [conditionsAcces, setConditionsAcces] = useState(initialData.conditionsAcces || '');

  // Reset form whenever the dialog opens
  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setNom(initialData.nom ?? '');
        setDescription(initialData.description ?? '');
        setDifficulte(initialData.difficulte ?? difficultyOptions[0].value);
        setOrdre(initialData.ordre ?? 1);
        setConditionsAcces(initialData.conditionsAcces ?? '');
      } else {
        setNom('');
        setDescription('');
        setDifficulte(difficultyOptions[0].value);
        setOrdre(1);
        setConditionsAcces('');
      }
    }
  }, [open, editMode, initialData]);

  const handleSubmit = () => {
    // We omit id, dateCreation, matiereId per your type definition
    onSubmit({
      nom,
      description,
      difficulte,
      ordre,
      conditionsAcces,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editMode ? 'Modifier un Chapitre' : 'Ajouter un Chapitre'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          label="Nom du chapitre"
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

        <FormControl margin="normal" fullWidth>
          <InputLabel>Difficulté</InputLabel>
          <Select
            label="Difficulté"
            value={difficulte}
            onChange={(e) => setDifficulte(e.target.value as string)}
          >
            {difficultyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="normal"
          label="Ordre"
          type="number"
          fullWidth
          value={ordre}
          onChange={(e) => setOrdre(Number(e.target.value))}
        />

        <TextField
          margin="normal"
          label="Conditions d'accès (facultatif)"
          fullWidth
          multiline
          rows={2}
          value={conditionsAcces}
          onChange={(e) => setConditionsAcces(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!nom || !description}>
          {editMode ? 'Enregistrer' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
