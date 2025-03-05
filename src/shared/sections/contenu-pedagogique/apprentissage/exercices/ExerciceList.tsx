'use client';

import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion'; // If you're using framer-motion
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

/** Inline definitions for Exercice and Chapitre.
 *  Delete these and import from your actual file if it exists.
 */
export interface Exercice {
  id: number;
  titre: string;
  ressources?: boolean;
  configuration?: boolean;
  planification?: boolean;
  // etc.
}

export interface Chapitre {
  id: number;
  nom: string;
  description: string;
  difficulte: string;
  dateCreation: string;
  // etc.
}

/** Props for the ExerciceList component. */
type ExerciceListProps = {
  exercices: Exercice[];
  chapitre: Chapitre;
  onSelect: (exercice: Exercice) => void;
  onAdd: () => void;
  onBack: () => void;
  onEdit: (exercice: Exercice, event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  onDelete: (
    exercice: Exercice,
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => void;
  onViewDetails: (
    exercice: Exercice,
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>
  ) => void;
};

/** Main ExerciceList component. */
export default function ExerciceList({
  exercices,
  chapitre,
  onSelect,
  onAdd,
  onBack,
  onEdit,
  onDelete,
  onViewDetails,
}: ExerciceListProps) {
  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulte: string) => {
    const diffLower = difficulte.toLowerCase();
    if (diffLower.includes('facile')) return '#4CAF50';
    if (diffLower.includes('moyen')) return '#FF9800';
    if (diffLower.includes('difficile')) return '#F44336';
    return '#2196F3'; // default color
  };

  const chapitreColor = getDifficultyColor(chapitre.difficulte);

  // If there are no exercices, show the "empty" UI
  if (exercices.length === 0) {
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
            bgcolor: chapitreColor,
            color: 'white',
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Exercices pour {chapitre.nom}</Typography>
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
                color: chapitreColor,
                '&:hover': { bgcolor: '#f7f7f7' },
              }}
            >
              Ajouter Exercice
            </Button>
          </Box>
        </Box>

        {/* Empty state card */}
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun exercice disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre premier exercice pour ce chapitre.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                bgcolor: chapitreColor,
                '&:hover': { bgcolor: `${chapitreColor}dd` },
              }}
            >
              Ajouter un Exercice
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Otherwise, render a list of exercices
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
          bgcolor: chapitreColor,
          color: 'white',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Exercices pour {chapitre.nom}</Typography>
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
              color: chapitreColor,
              '&:hover': { bgcolor: '#f7f7f7' },
            }}
          >
            Ajouter Exercice
          </Button>
        </Box>
      </Box>

      {/* List of exercices */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {exercices.map((exercice) => (
            <Box
              key={exercice.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'background.default' },
                cursor: 'pointer',
              }}
              onClick={() => onSelect(exercice)}
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
                    color: chapitreColor,
                    bgcolor: `${chapitreColor}20`,
                  }}
                >
                  <AssignmentIcon fontSize="small" />
                </Box>
                <Box>
                  <Typography>{exercice.titre}</Typography>

                  {/* Optionally show a row of chips if the exercice has certain flags */}
                  <Box
                    sx={{
                      display: 'flex',
                      mt: 0.5,
                      flexWrap: 'wrap',
                      gap: 0.5,
                    }}
                  >
                    {exercice.ressources && (
                      <Chip
                        icon={<AttachFileIcon sx={{ fontSize: '0.75rem !important' }} />}
                        label="Ressources"
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                    {exercice.configuration && (
                      <Chip
                        icon={<SettingsIcon sx={{ fontSize: '0.75rem !important' }} />}
                        label="Configuration"
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                    {exercice.planification && (
                      <Chip
                        icon={<AccessTimeIcon sx={{ fontSize: '0.75rem !important' }} />}
                        label="Planification"
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>

              <Box>
                <Tooltip title="Détails">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(exercice, e);
                    }}
                    sx={{ color: 'info.main' }}
                  >
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Modifier">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(exercice, e);
                    }}
                    sx={{ color: 'primary.main' }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Supprimer">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(exercice, e);
                    }}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
