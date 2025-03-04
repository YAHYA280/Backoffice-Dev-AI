// src/shared/sections/contenu-pedagogique/apprentissage/view/niveaux/NiveauList.tsx
'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Niveau } from '../view/apprentissage-view';

type NiveauListProps = {
  onSelect: (niveau: Niveau) => void;
  onAdd: () => void;
};

// Exemple de données fictives
const niveauxData: Niveau[] = [
  { id: 1, nom: 'Primaire 1', description: 'Niveau de base', dateCreation: '2023-01-01' },
  { id: 2, nom: 'Primaire 2', description: 'Niveau intermédiaire', dateCreation: '2023-02-15' },
  { id: 3, nom: 'Primaire 3', description: 'Niveau avancé', dateCreation: '2023-03-10' },
];

export default function NiveauList({ onSelect, onAdd }: NiveauListProps) {
  const MotionBox = motion(Box);
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Liste des Niveaux</Typography>}
        action={
          <Button variant="contained" onClick={onAdd}>
            Ajouter un Niveau
          </Button>
        }
      />
      <CardContent>
        {niveauxData.map((niveau) => (
          <MotionBox
            key={niveau.id}
            sx={{
              p: 1,
              borderBottom: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(niveau)}
          >
            <Typography variant="body1">{niveau.nom}</Typography>
            <Typography variant="caption" color="text.secondary">
              Ajouté le {niveau.dateCreation}
            </Typography>
          </MotionBox>
        ))}
      </CardContent>
    </Card>
  );
}
