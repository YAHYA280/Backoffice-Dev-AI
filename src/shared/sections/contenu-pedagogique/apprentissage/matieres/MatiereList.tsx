'use client';

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  Tooltip,
  IconButton,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import { Matiere, Niveau } from '../view/apprentissage-view';

type MatiereListProps = {
  matieres: Matiere[];
  niveau: Niveau;
  onSelect: (matiere: Matiere) => void;
  onAdd: () => void;
  onBack: () => void;
};

// Mapping des icônes pour les matières
const getIconForMatiere = (nom: string) => {
  const nomLower = nom.toLowerCase();
  if (nomLower.includes('math')) return <CalculateIcon />;
  if (nomLower.includes('franç') || nomLower.includes('litt')) return <MenuBookIcon />;
  if (nomLower.includes('angl') || nomLower.includes('espag') || nomLower.includes('allem'))
    return <LanguageIcon />;
  if (
    nomLower.includes('scien') ||
    nomLower.includes('physi') ||
    nomLower.includes('chim') ||
    nomLower.includes('bio')
  )
    return <ScienceIcon />;
  if (nomLower.includes('art') || nomLower.includes('dessin')) return <BrushIcon />;
  if (nomLower.includes('musi')) return <MusicNoteIcon />;
  if (nomLower.includes('sport') || nomLower.includes('éduc') || nomLower.includes('eps'))
    return <FitnessCenterIcon />;
  return <LibraryBooksIcon />;
};

export default function MatiereList({
  matieres,
  niveau,
  onSelect,
  onAdd,
  onBack,
}: MatiereListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Empty state
  if (matieres.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Matières pour {niveau.nom}</Typography>
              <Box>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={onBack}
                  sx={{ mr: 1 }}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAdd}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Ajouter une Matière
                </Button>
              </Box>
            </Box>
          }
        />
        <CardContent
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
              borderRadius: 2,
              maxWidth: 500,
            }}
          >
            <LibraryBooksIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucune matière disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre première matière pour ce niveau.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} size="large">
              Ajouter une Matière
            </Button>
          </Paper>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get a color based on matiere name
  const getColorForMatiere = (matiere: Matiere) => {
    if (matiere.couleur) return matiere.couleur;

    const nomLower = matiere.nom.toLowerCase();
    if (nomLower.includes('math')) return '#4CAF50';
    if (nomLower.includes('franç')) return '#2196F3';
    if (nomLower.includes('angl')) return '#E91E63';
    if (nomLower.includes('scien')) return '#FF9800';
    if (nomLower.includes('art')) return '#9C27B0';
    if (nomLower.includes('musi')) return '#3F51B5';
    if (nomLower.includes('sport')) return '#F44336';

    // Default colors for other subjects
    const hash = matiere.nom.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#3F51B5', '#F44336'];
    return colors[hash % colors.length];
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Matières pour {niveau.nom}</Typography>
              <Box>
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={onBack}
                  sx={{ mr: 1 }}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={onAdd}
                  size={isMobile ? 'small' : 'medium'}
                >
                  Ajouter une Matière
                </Button>
              </Box>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {matieres.map((matiere) => {
              const color = getColorForMatiere(matiere);
              return (
                <Grid item xs={12} sm={6} md={4} key={matiere.id}>
                  <motion.div variants={itemVariants}>
                    <Card
                      sx={{
                        height: '100%',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: 6,
                          transform: 'translateY(-4px)',
                        },
                      }}
                      onClick={() => onSelect(matiere)}
                    >
                      <Box
                        sx={{
                          height: '60px',
                          bgcolor: color,
                          display: 'flex',
                          alignItems: 'center',
                          px: 2,
                        }}
                      >
                        <Typography variant="h6" sx={{ color: 'white', flexGrow: 1 }}>
                          {matiere.nom}
                        </Typography>
                      </Box>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: `${color}20`,
                              color: color,
                              mr: 2,
                            }}
                          >
                            {getIconForMatiere(matiere.nom)}
                          </Avatar>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarTodayIcon
                                sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Créée le {matiere.dateCreation}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            height: 60,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {matiere.description}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Tooltip title="Voir les détails">
                            <IconButton
                              size="small"
                              sx={{
                                color: color,
                                bgcolor: `${color}10`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelect(matiere);
                              }}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
}
