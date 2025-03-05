'use client';

import React from 'react'; // Add React import
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Grid,
  Divider,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  useTheme,
  useMediaQuery,
  Chip,
  alpha, // Import alpha for color manipulation
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookIcon from '@mui/icons-material/Book';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InfoIcon from '@mui/icons-material/Info';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PaletteIcon from '@mui/icons-material/Palette';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

import { Matiere } from '../view/apprentissage-view';

type MatiereDetailsProps = {
  matiere: Matiere;
  onEdit: () => void;
  onDelete: () => void;
  onManageChapitres: () => void;
  onBack: () => void;
};

// Mapping des icônes pour les matières
const getIconForMatiere = (nom: string) => {
  const nomLower = nom.toLowerCase();
  if (nomLower.includes('math')) return <CalculateIcon fontSize="large" />;
  if (nomLower.includes('franç') || nomLower.includes('litt'))
    return <MenuBookIcon fontSize="large" />;
  if (nomLower.includes('angl') || nomLower.includes('espag') || nomLower.includes('allem'))
    return <LanguageIcon fontSize="large" />;
  if (
    nomLower.includes('scien') ||
    nomLower.includes('physi') ||
    nomLower.includes('chim') ||
    nomLower.includes('bio')
  )
    return <ScienceIcon fontSize="large" />;
  if (nomLower.includes('art') || nomLower.includes('dessin'))
    return <BrushIcon fontSize="large" />;
  if (nomLower.includes('musi')) return <MusicNoteIcon fontSize="large" />;
  if (nomLower.includes('sport') || nomLower.includes('éduc') || nomLower.includes('eps'))
    return <FitnessCenterIcon fontSize="large" />;
  return <BookIcon fontSize="large" />;
};

export default function MatiereDetails({
  matiere,
  onEdit,
  onDelete,
  onManageChapitres,
  onBack,
}: MatiereDetailsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Helper function to get color based on matiere name
  const getColorForMatiere = (matiereName: string) => {
    const nomLower = matiereName.toLowerCase();
    if (nomLower.includes('math')) return '#4CAF50';
    if (nomLower.includes('franç')) return '#2196F3';
    if (nomLower.includes('angl')) return '#E91E63';
    if (nomLower.includes('scien')) return '#FF9800';
    if (nomLower.includes('art')) return '#9C27B0';
    if (nomLower.includes('musi')) return '#3F51B5';
    if (nomLower.includes('sport')) return '#F44336';

    // Default color
    return '#607D8B';
  };

  // Helper function to darken a color (replacement for theme.palette.darken)
  const darkenColor = (color: string, amount: number) => {
    return alpha(color, 1 - amount);
  };

  const matiereColor = matiere.couleur || getColorForMatiere(matiere.nom);
  const matiereIcon = getIconForMatiere(matiere.nom);

  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <Box
        sx={{
          bgcolor: matiereColor,
          color: 'white',
          p: 3,
          position: 'relative',
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <IconButton
              onClick={onBack}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                sx={{
                  bgcolor: 'white',
                  color: matiereColor,
                  mr: 2,
                  width: 56,
                  height: 56,
                }}
              >
                {matiereIcon}
              </Avatar>
              <Box>
                <Typography variant="h5" component="h2">
                  {matiere.nom}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <CalendarTodayIcon fontSize="small" sx={{ mr: 1, fontSize: '0.875rem' }} />
                  <Typography variant="subtitle2">Créée le {matiere.dateCreation}</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Grid container spacing={0}>
          {/* Left side - Details */}
          <Grid item xs={12} md={8} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} fontSize="small" />
              Description
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="body1">{matiere.description}</Typography>
            </Paper>

            {/* Style information */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Couleur
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: matiereColor,
                      mr: 1,
                    }}
                  />
                  <Typography>{matiere.couleur || 'Couleur par défaut'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Icône
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: matiereColor, width: 24, height: 24, mr: 1 }}>
                    {React.cloneElement(matiereIcon, { fontSize: 'small' })}
                  </Avatar>
                  <Typography>{matiere.icone || 'Icône par défaut'}</Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Statistiques */}
            <Typography variant="h6" gutterBottom>
              Statistiques de la matière
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color={matiereColor}>
                    3
                  </Typography>
                  <Typography variant="body2">Chapitres</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color={matiereColor}>
                    12
                  </Typography>
                  <Typography variant="body2">Exercices</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color={matiereColor}>
                    8
                  </Typography>
                  <Typography variant="body2">Ressources</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color={matiereColor}>
                    85%
                  </Typography>
                  <Typography variant="body2">Progression</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Right side - Actions */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderLeft: { xs: 'none', md: '1px solid' },
              borderColor: 'divider',
              bgcolor: 'background.default',
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<FormatListBulletedIcon />}
                onClick={onManageChapitres}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  bgcolor: matiereColor,
                  '&:hover': { bgcolor: darkenColor(matiereColor, 0.2) },
                }}
              >
                Gérer les Chapitres
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<EditIcon />}
                onClick={onEdit}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  borderColor: matiereColor,
                  color: matiereColor,
                  '&:hover': { borderColor: darkenColor(matiereColor, 0.2) },
                }}
              >
                Modifier
              </Button>

              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                size={isMobile ? 'small' : 'medium'}
              >
                Supprimer
              </Button>
            </Stack>

            {/* Additional info cards */}
            <Box sx={{ mt: 4 }}>
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <PeopleIcon sx={{ mr: 2, color: matiereColor }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Étudiants inscrits
                  </Typography>
                  <Typography variant="h6">18 étudiants</Typography>
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <AssignmentIcon sx={{ mr: 2, color: matiereColor }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Dernière mise à jour
                  </Typography>
                  <Typography variant="h6">Il y a 2 jours</Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
