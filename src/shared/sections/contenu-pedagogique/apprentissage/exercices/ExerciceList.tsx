'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';

import { Exercice, Chapitre } from '../view/apprentissage-view';

type ExerciceListProps = {
  chapitre: Chapitre;
  onSelect: (exercice: Exercice) => void;
  onAdd: () => void;
  onBack: () => void;
};

const exercicesData: Exercice[] = [
  {
    id: 1,
    chapitreId: 1,
    titre: 'Exercice 1',
    description: 'Exercice sur les bases',
    dateCreation: '2023-01-20',
  },
  {
    id: 2,
    chapitreId: 1,
    titre: 'Exercice 2',
    description: 'Exercice intermédiaire',
    dateCreation: '2023-01-22',
  },
];

export default function ExerciceList({ chapitre, onSelect, onAdd, onBack }: ExerciceListProps) {
  const MotionBox = motion(Box);
  const filtered = exercicesData.filter((ex) => ex.chapitreId === chapitre.id);
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Liste des Exercices pour {chapitre.nom}</Typography>}
        action={
          <Button variant="contained" onClick={onAdd}>
            Ajouter un Exercice
          </Button>
        }
      />
      <CardContent>
        {filtered.map((exercice) => (
          <MotionBox
            key={exercice.id}
            sx={{
              p: 1,
              borderBottom: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(exercice)}
          >
            <Typography variant="body1">{exercice.titre}</Typography>
            <Typography variant="caption" color="text.secondary">
              Ajouté le {exercice.dateCreation}
            </Typography>
          </MotionBox>
        ))}
      </CardContent>
      <Button onClick={onBack}>Retour aux Chapitres</Button>
    </Card>
  );
}
