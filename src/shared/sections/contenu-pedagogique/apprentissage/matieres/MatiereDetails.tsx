'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { Niveau, Matiere } from '../view/apprentissage-view';

type MatiereDetailsProps = {
  matiere: Matiere;
  onEdit: () => void;
  onDelete: () => void;
  onManageChapitres: () => void;
  onBack: () => void;
};

export default function MatiereDetails({
  matiere,
  onEdit,
  onDelete,
  onManageChapitres,
  onBack,
}: MatiereDetailsProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Détails de la Matière : {matiere.nom}</Typography>}
        action={<Button onClick={onBack}>Retour</Button>}
      />
      <CardContent>
        <Typography variant="body2">Description : {matiere.description}</Typography>
        <Typography variant="caption" color="text.secondary">
          Créée le {matiere.dateCreation}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={onEdit} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button variant="outlined" color="error" onClick={onDelete} sx={{ mr: 1 }}>
            Supprimer
          </Button>
          <Button variant="contained" onClick={onManageChapitres}>
            Gérer Chapitres
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
