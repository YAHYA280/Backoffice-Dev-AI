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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  alpha, // Import alpha for color manipulation
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Exercice, Chapitre } from '../view/apprentissage-view';

type ExerciceListProps = {
  exercices: Exercice[];
  chapitre: Chapitre;
  onSelect: (exercice: Exercice) => void;
  onAdd: () => void;
  onBack: () => void;
};

export default function ExerciceList({
  exercices,
  chapitre,
  onSelect,
  onAdd,
  onBack,
}: ExerciceListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Helper function to darken a color (replacement for theme.palette.darken)
  const darkenColor = (color: string, amount: number) => {
    return alpha(color, 1 - amount);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Helper function to get color based on chapitre difficulty
  const getColorByDifficulty = (difficulte: string) => {
    const diffLower = difficulte.toLowerCase();
    if (diffLower.includes('facile')) return '#4CAF50';
    if (diffLower.includes('moyen')) return '#FF9800';
    if (diffLower.includes('difficile')) return '#F44336';
    return '#2196F3';
  };

  const chapitreColor = getColorByDifficulty(chapitre.difficulte);

  // Empty state
  if (exercices.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Exercices pour {chapitre.nom}</Typography>
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
                  Ajouter un Exercice
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
            <FitnessCenterIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun exercice disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre premier exercice pour ce chapitre.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} size="large">
              Ajouter un Exercice
            </Button>
          </Paper>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Card sx={{ mb: 2 }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Exercices pour {chapitre.nom}</Typography>
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
                  Ajouter un Exercice
                </Button>
              </Box>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          <List sx={{ width: '100%', bgcolor: 'background.paper', py: 0 }}>
            {exercices.map((exercice) => (
              <motion.div key={exercice.id} variants={itemVariants}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    mb: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: chapitreColor,
                    },
                  }}
                  onClick={() => onSelect(exercice)}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: chapitreColor }}>
                      <AssignmentIcon />
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="div">
                        {exercice.titre}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" component="span">
                          {exercice.description}
                        </Typography>

                        <Box sx={{ display: 'flex', mt: 1, flexWrap: 'wrap', gap: 1 }}>
                          {exercice.ressources && (
                            <Chip
                              icon={<AttachFileIcon />}
                              label="Ressources"
                              size="small"
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}

                          {exercice.configuration && (
                            <Chip
                              icon={<SettingsIcon />}
                              label="Configuration"
                              size="small"
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}

                          {exercice.planification && (
                            <Chip
                              icon={<AccessTimeIcon />}
                              label="Planification"
                              size="small"
                              variant="outlined"
                              sx={{ height: 24 }}
                            />
                          )}

                          <Chip
                            icon={<CalendarTodayIcon />}
                            label={`Créé le ${exercice.dateCreation}`}
                            size="small"
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        </Box>
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction>
                    <Tooltip title="Consulter l'exercice">
                      <IconButton
                        edge="end"
                        sx={{
                          color: 'white',
                          bgcolor: chapitreColor,
                          '&:hover': {
                            bgcolor: darkenColor(chapitreColor, 0.2),
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect(exercice);
                        }}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </CardContent>
      </Card>
    </motion.div>
  );
}
