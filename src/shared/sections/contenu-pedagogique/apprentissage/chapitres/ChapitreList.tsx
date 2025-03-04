'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { Chapitre, Matiere } from '../view/apprentissage-view';

type ChapitreListProps = {
  matiere: Matiere;
  onSelect: (chapitre: Chapitre) => void;
  onAdd: () => void;
  onBack: () => void;
};

const chapitresData: Chapitre[] = [
  {
    id: 1,
    matiereId: 1,
    nom: 'Chapitre 1',
    description: 'Introduction',
    difficulte: 'Facile',
    ordre: 1,
    dateCreation: '2023-01-10',
  },
  {
    id: 2,
    matiereId: 1,
    nom: 'Chapitre 2',
    description: 'Concepts de base',
    difficulte: 'Moyen',
    ordre: 2,
    dateCreation: '2023-01-15',
  },
];

export default function ChapitreList({ matiere, onSelect, onAdd, onBack }: ChapitreListProps) {
  const MotionBox = motion(Box);
  const filtered = chapitresData.filter((chapitre) => chapitre.matiereId === matiere.id);
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Liste des Chapitres pour {matiere.nom}</Typography>}
        action={
          <Button variant="contained" onClick={onAdd}>
            Ajouter un Chapitre
          </Button>
        }
      />
      <CardContent>
        {filtered.map((chapitre) => (
          <MotionBox
            key={chapitre.id}
            sx={{
              p: 1,
              borderBottom: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(chapitre)}
          >
            <Typography variant="body1">{chapitre.nom}</Typography>
            <Typography variant="caption" color="text.secondary">
              Ajouté le {chapitre.dateCreation}
            </Typography>
          </MotionBox>
        ))}
      </CardContent>
      <Button onClick={onBack}>Retour aux Matières</Button>
    </Card>
  );
}
