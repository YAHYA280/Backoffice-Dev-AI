'use client';

import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LockIcon from '@mui/icons-material/Lock';
import Badge from '@mui/material/Badge';

import { Chapitre, Matiere } from '../view/apprentissage-view';

type ChapitreListProps = {
  chapitres: Chapitre[];
  matiere: Matiere;
  onSelect: (chapitre: Chapitre) => void;
  onAdd: () => void;
  onBack: () => void;
  onEdit: (chapitre: Chapitre, event: React.MouseEvent) => void;
  onDelete: (chapitre: Chapitre, event: React.MouseEvent) => void;
  onViewDetails: (chapitre: Chapitre, event: React.MouseEvent) => void;
};

export default function ChapitreList({
  chapitres,
  matiere,
  onSelect,
  onAdd,
  onBack,
  onEdit,
  onDelete,
  onViewDetails,
}: ChapitreListProps) {
  // Helper function to get difficulty level
  const getDifficultyChip = (difficulte: string) => {
    const diffLower = difficulte.toLowerCase();
    if (diffLower.includes('facile')) {
      return (
        <Chip label="Facile" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
      );
    }
    if (diffLower.includes('moyen')) {
      return (
        <Chip label="Moyen" size="small" color="primary" sx={{ height: 20, fontSize: '0.7rem' }} />
      );
    }
    if (diffLower.includes('difficile')) {
      return (
        <Chip
          label="Difficile"
          size="small"
          color="error"
          sx={{ height: 20, fontSize: '0.7rem' }}
        />
      );
    }
    return (
      <Chip
        label={difficulte}
        size="small"
        color="default"
        sx={{ height: 20, fontSize: '0.7rem' }}
      />
    );
  };

  // Helper function to get color based on difficulty
  const getDifficultyColor = (difficulte: string) => {
    const diffLower = difficulte.toLowerCase();
    if (diffLower.includes('facile')) return '#4CAF50';
    if (diffLower.includes('moyen')) return '#FF9800';
    if (diffLower.includes('difficile')) return '#F44336';
    return '#2196F3';
  };

  // Sort chapitres by ordre
  const sortedChapitres = [...chapitres].sort((a, b) => a.ordre - b.ordre);

  // Get color for matiere
  const matiereColor = matiere.couleur || '#607D8B';

  // Empty state
  if (sortedChapitres.length === 0) {
    return (
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            p: 2,
            bgcolor: matiereColor,
            color: 'white',
            borderRadius: 1,
          }}
        >
          <Typography variant="h6">Chapitres pour {matiere.nom}</Typography>
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
                color: matiereColor,
                '&:hover': { bgcolor: '#f7f7f7' },
              }}
            >
              Ajouter Chapitre
            </Button>
          </Box>
        </Box>

        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <MenuBookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun chapitre disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre premier chapitre pour cette matière.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onAdd}
              sx={{
                bgcolor: matiereColor,
                '&:hover': { bgcolor: `${matiereColor}dd` },
              }}
            >
              Ajouter un Chapitre
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          p: 2,
          bgcolor: matiereColor,
          color: 'white',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Chapitres pour {matiere.nom}</Typography>
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
              color: matiereColor,
              '&:hover': { bgcolor: '#f7f7f7' },
            }}
          >
            Ajouter Chapitre
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {sortedChapitres.map((chapitre) => {
            const difficultyColor = getDifficultyColor(chapitre.difficulte);

            return (
              <Box
                key={chapitre.id}
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
                onClick={() => onSelect(chapitre)}
              >
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Badge
                    badgeContent={chapitre.ordre}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        fontSize: '0.8rem',
                        height: '22px',
                        minWidth: '22px',
                        borderRadius: '50%',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: difficultyColor,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                      }}
                    >
                      <MenuBookIcon fontSize="small" />
                    </Box>
                  </Badge>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ mr: 1 }}>{chapitre.nom}</Typography>
                    {getDifficultyChip(chapitre.difficulte)}
                    {chapitre.conditionsAcces && (
                      <Tooltip title={`Conditions d'accès: ${chapitre.conditionsAcces}`}>
                        <LockIcon
                          fontSize="small"
                          sx={{ ml: 1, fontSize: '1rem', color: 'text.secondary' }}
                        />
                      </Tooltip>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {chapitre.description.length > 100
                      ? `${chapitre.description.substring(0, 100)}...`
                      : chapitre.description}
                  </Typography>
                </Box>

                <Box>
                  <Tooltip title="Détails">
                    <IconButton
                      size="small"
                      onClick={(e) => onViewDetails(chapitre, e)}
                      sx={{ color: 'info.main' }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={(e) => onEdit(chapitre, e)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Supprimer">
                    <IconButton
                      size="small"
                      onClick={(e) => onDelete(chapitre, e)}
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
