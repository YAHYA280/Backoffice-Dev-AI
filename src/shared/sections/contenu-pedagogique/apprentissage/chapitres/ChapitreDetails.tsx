'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { Chapitre } from '../view/apprentissage-view';

type ChapitreDetailsProps = {
  chapitre: Chapitre;
  onEdit: () => void;
  onDelete: () => void;
  onManageExercices: () => void;
  onBack: () => void;
};

export default function ChapitreDetails({
  chapitre,
  onEdit,
  onDelete,
  onManageExercices,
  onBack,
}: ChapitreDetailsProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Détails du Chapitre : {chapitre.nom}</Typography>}
        action={<Button onClick={onBack}>Retour</Button>}
      />
      <CardContent>
        <Typography variant="body2">Description : {chapitre.description}</Typography>
        <Typography variant="body2">Difficulté : {chapitre.difficulte}</Typography>
        <Typography variant="body2">Ordre : {chapitre.ordre}</Typography>
        {chapitre.conditionsAcces && (
          <Typography variant="body2">Conditions d'accès : {chapitre.conditionsAcces}</Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Créé le {chapitre.dateCreation}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={onEdit} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button variant="outlined" color="error" onClick={onDelete} sx={{ mr: 1 }}>
            Supprimer
          </Button>
          <Button variant="contained" onClick={onManageExercices}>
            Gérer Exercices
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
