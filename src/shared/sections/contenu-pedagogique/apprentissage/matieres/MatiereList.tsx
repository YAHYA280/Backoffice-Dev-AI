'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Niveau, Matiere } from '../view/apprentissage-view';

type MatiereListProps = {
  niveau: Niveau;
  onSelect: (matiere: Matiere) => void;
  onAdd: () => void;
  onBack: () => void;
};

const matieresData: Matiere[] = [
  {
    id: 1,
    niveauId: 1,
    nom: 'Mathématiques',
    description: 'Cours de mathématiques',
    dateCreation: '2023-01-05',
  },
  {
    id: 2,
    niveauId: 1,
    nom: 'Français',
    description: 'Cours de français',
    dateCreation: '2023-01-07',
  },
  {
    id: 3,
    niveauId: 2,
    nom: 'Sciences',
    description: 'Cours de sciences',
    dateCreation: '2023-02-20',
  },
  {
    id: 4,
    niveauId: 2,
    nom: 'Anglais',
    description: "Cours d'anglais",
    dateCreation: '2023-02-22',
  },
];

export default function MatiereList({ niveau, onSelect, onAdd, onBack }: MatiereListProps) {
  const MotionBox = motion(Box);
  const filtered = matieresData.filter((matiere) => matiere.niveauId === niveau.id);
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Liste des Matières pour {niveau.nom}</Typography>}
        action={
          <Button variant="contained" onClick={onAdd}>
            Ajouter une Matière
          </Button>
        }
      />
      <CardContent>
        {filtered.map((matiere) => (
          <MotionBox
            key={matiere.id}
            sx={{
              p: 1,
              borderBottom: '1px solid #e0e0e0',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => onSelect(matiere)}
          >
            <Typography variant="body1">{matiere.nom}</Typography>
            <Typography variant="caption" color="text.secondary">
              Ajoutée le {matiere.dateCreation}
            </Typography>
          </MotionBox>
        ))}
      </CardContent>
      <Button onClick={onBack}>Retour aux Niveaux</Button>
    </Card>
  );
}
