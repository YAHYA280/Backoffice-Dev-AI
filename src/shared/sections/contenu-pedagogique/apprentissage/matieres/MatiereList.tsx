'use client';

import React from 'react';
import { Box, Card, CardContent, Button, Typography, Tooltip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';
import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

/** Minimal versions of Matiere and Niveau types **/
export interface Niveau {
  id: number;
  nom: string;
  description: string;
  observation?: string;
  dateCreation: string;
}

export interface Matiere {
  id: number;
  niveauId: number;
  nom: string;
  description: string;
  couleur?: string;
  icone?: string;
  dateCreation: string;
}

/** Utility functions you referenced */
export function getIconForMatiere(nom: string) {
  const lowerNom = nom.toLowerCase();
  if (lowerNom.includes('math')) return <CalculateIcon />;
  if (lowerNom.includes('franç') || lowerNom.includes('litt')) return <MenuBookIcon />;
  if (lowerNom.includes('angl') || lowerNom.includes('espag') || lowerNom.includes('allem')) {
    return <LanguageIcon />;
  }
  if (
    lowerNom.includes('scien') ||
    lowerNom.includes('physi') ||
    lowerNom.includes('chim') ||
    lowerNom.includes('bio')
  ) {
    return <ScienceIcon />;
  }
  if (lowerNom.includes('art') || lowerNom.includes('dessin')) return <BrushIcon />;
  if (lowerNom.includes('musi')) return <MusicNoteIcon />;
  if (lowerNom.includes('sport') || lowerNom.includes('éduc') || lowerNom.includes('eps')) {
    return <FitnessCenterIcon />;
  }
  return <BookIcon />;
}

export function getColorForMatiere(matiere: Matiere) {
  // If already set
  if (matiere.couleur) return matiere.couleur;

  const lowerNom = matiere.nom.toLowerCase();
  if (lowerNom.includes('math')) return '#4CAF50';
  if (lowerNom.includes('franç')) return '#2196F3';
  if (lowerNom.includes('angl')) return '#E91E63';
  if (lowerNom.includes('scien')) return '#FF9800';
  if (lowerNom.includes('art')) return '#9C27B0';
  if (lowerNom.includes('musi')) return '#3F51B5';
  if (lowerNom.includes('sport')) return '#F44336';

  // Default color
  return '#607D8B';
}

/** Props for the MatiereList component */
type MatiereListProps = {
  matieres: Matiere[];
  niveau: Niveau;
  onSelect: (matiere: Matiere) => void;
  onAdd: () => void;
  onBack: () => void;
  onEdit: (matiere: Matiere, event: React.MouseEvent) => void;
  onDelete: (matiere: Matiere, event: React.MouseEvent) => void;
  onViewDetails: (matiere: Matiere, event: React.MouseEvent) => void;
};

/** Main MatiereList component */
export default function MatiereList({
  matieres,
  niveau,
  onSelect,
  onAdd,
  onBack,
  onEdit,
  onDelete,
  onViewDetails,
}: MatiereListProps) {
  // Show "empty state" card if there are no matieres:
  if (matieres.length === 0) {
    return (
      <Box>
        {/* Top bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            p: 2,
            bgcolor: (theme) => theme.palette.primary.main,
            color: 'white',
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Matières pour {niveau.nom}</Typography>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={onBack}
              sx={{
                mr: 1,
                color: 'white',
                borderColor: 'white',
                '&:hover': { borderColor: '#f0f0f0' },
              }}
              variant="outlined"
              size="small"
            >
              Retour
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              size="small"
              sx={{
                bgcolor: 'white',
                color: (theme) => theme.palette.primary.main,
                '&:hover': { bgcolor: '#f7f7f7' },
              }}
            >
              Ajouter Matière
            </Button>
          </Box>
        </Box>

        {/* Empty State */}
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucune matière disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre première matière pour ce niveau.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd}>
              Ajouter une Matière
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Otherwise, display the list of matieres:
  return (
    <Box>
      {/* Top bar */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          p: 2,
          bgcolor: (theme) => theme.palette.primary.main,
          color: 'white',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Matières pour {niveau.nom}</Typography>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              mr: 1,
              color: 'white',
              borderColor: 'white',
              '&:hover': { borderColor: '#f0f0f0' },
            }}
            variant="outlined"
            size="small"
          >
            Retour
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            size="small"
            sx={{
              bgcolor: 'white',
              color: (theme) => theme.palette.primary.main,
              '&:hover': { bgcolor: '#f7f7f7' },
            }}
          >
            Ajouter Matière
          </Button>
        </Box>
      </Box>

      {/* Actual list */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {matieres.map((matiere) => {
            const color = getColorForMatiere(matiere);
            return (
              <Box
                key={matiere.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'background.default',
                  },
                  cursor: 'pointer',
                }}
                onClick={() => onSelect(matiere)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Box
                    sx={{
                      mr: 2,
                      width: 30,
                      height: 30,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      color: color,
                      bgcolor: `${color}20`,
                    }}
                  >
                    {getIconForMatiere(matiere.nom)}
                  </Box>
                  <Typography>{matiere.nom}</Typography>
                </Box>

                <Box>
                  <Tooltip title="Détails">
                    <IconButton
                      size="small"
                      onClick={(e) => onViewDetails(matiere, e)}
                      sx={{ color: 'info.main' }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={(e) => onEdit(matiere, e)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Supprimer">
                    <IconButton
                      size="small"
                      onClick={(e) => onDelete(matiere, e)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
        </CardContent>
      </Card>
    </Box>
  );
}
