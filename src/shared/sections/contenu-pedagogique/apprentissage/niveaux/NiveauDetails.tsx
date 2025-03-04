// src/shared/sections/contenu-pedagogique/apprentissage/view/niveaux/NiveauDetails.tsx
'use client';

import { Box, Card, CardHeader, CardContent, Button, Typography } from '@mui/material';
import { Niveau } from '../view/apprentissage-view';

type NiveauDetailsProps = {
  niveau: Niveau;
  onEdit: () => void;
  onDelete: () => void;
  onManageMatieres: () => void;
  onBack: () => void;
};

export default function NiveauDetails({
  niveau,
  onEdit,
  onDelete,
  onManageMatieres,
  onBack,
}: NiveauDetailsProps) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        title={<Typography variant="h6">Détails du Niveau: {niveau.nom}</Typography>}
        action={<Button onClick={onBack}>Retour</Button>}
      />
      <CardContent>
        <Typography variant="body2">Description: {niveau.description}</Typography>
        {niveau.observation && (
          <Typography variant="body2">Observation: {niveau.observation}</Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          Créé le {niveau.dateCreation}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" onClick={onEdit} sx={{ mr: 1 }}>
            Modifier
          </Button>
          <Button variant="outlined" color="error" onClick={onDelete} sx={{ mr: 1 }}>
            Supprimer
          </Button>
          <Button variant="contained" onClick={onManageMatieres}>
            Gérer Matières
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
