'use client';

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
  Box,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { Matiere, Niveau } from '../view/apprentissage-view';

// Predefined color options
const colorOptions = [
  { value: '#4CAF50', label: 'Vert' },
  { value: '#2196F3', label: 'Bleu' },
  { value: '#FF9800', label: 'Orange' },
  { value: '#E91E63', label: 'Rose' },
  { value: '#9C27B0', label: 'Violet' },
  { value: '#3F51B5', label: 'Indigo' },
  { value: '#F44336', label: 'Rouge' },
  { value: '#607D8B', label: 'Bleu-gris' },
];

// Predefined icon options
const iconOptions = [
  { value: 'calculator', label: 'Calculatrice' },
  { value: 'book', label: 'Livre' },
  { value: 'language', label: 'Langue' },
  { value: 'flask', label: 'Sciences' },
  { value: 'brush', label: 'Art' },
  { value: 'music', label: 'Musique' },
  { value: 'fitness', label: 'Sport' },
];

type AddMatiereDialogProps = {
  open: boolean;
  onClose: () => void;
  niveauId: number;
  onSubmit: (newMatiere: Omit<Matiere, 'id' | 'dateCreation' | 'niveauId'>) => void;
  editMode?: boolean;
  initialData?: Partial<Matiere>;
};

export default function AddMatiereDialog({
  open,
  onClose,
  niveauId,
  onSubmit,
  editMode = false,
  initialData = {},
}: AddMatiereDialogProps) {
  const [nom, setNom] = useState(initialData.nom || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [couleur, setCouleur] = useState(initialData.couleur || colorOptions[0].value);
  const [icone, setIcone] = useState(initialData.icone || iconOptions[0].value);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setNom(initialData.nom || '');
        setDescription(initialData.description || '');
        setCouleur(initialData.couleur || colorOptions[0].value);
        setIcone(initialData.icone || iconOptions[0].value);
      } else {
        setNom('');
        setDescription('');
        setCouleur(colorOptions[0].value);
        setIcone(iconOptions[0].value);
      }
    }
  }, [open, editMode, initialData]);

  const handleSubmit = () => {
    onSubmit({ nom, description, couleur, icone });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editMode ? 'Modifier une Matière' : 'Ajouter une Matière'}</DialogTitle>
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

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="couleur-label">Couleur</InputLabel>
            <Select
              labelId="couleur-label"
              value={couleur}
              label="Couleur"
              onChange={(e) => setCouleur(e.target.value)}
            >
              {colorOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        bgcolor: option.value,
                        mr: 1,
                      }}
                    />
                    {option.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel id="icone-label">Icône</InputLabel>
            <Select
              labelId="icone-label"
              value={icone}
              label="Icône"
              onChange={(e) => setIcone(e.target.value)}
            >
              {iconOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
