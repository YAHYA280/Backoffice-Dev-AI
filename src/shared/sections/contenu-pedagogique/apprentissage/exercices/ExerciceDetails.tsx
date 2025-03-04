'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';

import { Exercice } from '../view/apprentissage-view';

type ExerciceDetailsProps = {
  exercice: Exercice;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export default function ExerciceDetails({
  exercice,
  onEdit,
  onDelete,
  onBack,
}: ExerciceDetailsProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Détails de l'Exercice : {exercice.titre}</Typography>}
        action={<Button onClick={onBack}>Retour</Button>}
      />
      <CardContent>
        <Typography variant="body2">Description : {exercice.description}</Typography>
        <Typography variant="caption" color="text.secondary">
          Créé le {exercice.dateCreation}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={onEdit} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button variant="outlined" color="error" onClick={onDelete}>
            Supprimer
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
