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
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Chapitre, Matiere } from '../view/apprentissage-view';

type ChapitreListProps = {
  chapitres: Chapitre[];
  matiere: Matiere;
  onSelect: (chapitre: Chapitre) => void;
  onAdd: () => void;
  onBack: () => void;
};

// Helper function to get difficulty level
const getDifficultyChip = (difficulte: string) => {
  const diffLower = difficulte.toLowerCase();
  if (diffLower.includes('facile')) {
    return <Chip label="Facile" size="small" color="success" sx={{ height: 24 }} />;
  }
  if (diffLower.includes('moyen')) {
    return <Chip label="Moyen" size="small" color="primary" sx={{ height: 24 }} />;
  }
  if (diffLower.includes('difficile')) {
    return <Chip label="Difficile" size="small" color="error" sx={{ height: 24 }} />;
  }
  return <Chip label={difficulte} size="small" color="default" sx={{ height: 24 }} />;
};

export default function ChapitreList({
  chapitres,
  matiere,
  onSelect,
  onAdd,
  onBack,
}: ChapitreListProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Sort chapitres by ordre
  const sortedChapitres = [...chapitres].sort((a, b) => a.ordre - b.ordre);

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
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Get color for matiere
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

  const matiereColor = matiere.couleur || getColorForMatiere(matiere.nom);

  // Empty state
  if (sortedChapitres.length === 0) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">Liste des Chapitres pour {matiere.nom}</Typography>
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
                  Ajouter un Chapitre
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
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun chapitre disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ajoutez votre premier chapitre pour cette matière.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAdd} size="large">
              Ajouter un Chapitre
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
              <Typography variant="h6">Liste des Chapitres pour {matiere.nom}</Typography>
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
                  Ajouter un Chapitre
                </Button>
              </Box>
            </Box>
          }
        />
        <Divider />
        <CardContent>
          {sortedChapitres.map((chapitre, index) => (
            <motion.div key={chapitre.id} variants={itemVariants}>
              <Paper
                elevation={1}
                sx={{
                  mb: 2,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 4,
                    bgcolor: 'background.paper',
                  },
                }}
                onClick={() => onSelect(chapitre)}
              >
                <Grid container>
                  {/* Order number */}
                  <Grid
                    item
                    xs={2}
                    sm={1}
                    sx={{
                      bgcolor: matiereColor,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      py: 2,
                    }}
                  >
                    <Badge
                      badgeContent={chapitre.ordre}
                      color="primary"
                      overlap="circular"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '1rem',
                          height: '30px',
                          width: '30px',
                          borderRadius: '50%',
                        },
                      }}
                    >
                      <BookmarkIcon
                        color="action"
                        sx={{ color: 'white', fontSize: 30, opacity: 0 }}
                      />
                    </Badge>
                  </Grid>

                  {/* Content */}
                  <Grid item xs={10} sm={11}>
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6">{chapitre.nom}</Typography>
                        {getDifficultyChip(chapitre.difficulte)}
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {chapitre.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon
                            sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {chapitre.dateCreation}
                          </Typography>

                          {chapitre.conditionsAcces && (
                            <Tooltip title={`Conditions d'accès: ${chapitre.conditionsAcces}`}>
                              <IconButton size="small" sx={{ ml: 1 }}>
                                <LockIcon fontSize="small" color="action" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Box>

                        <Tooltip title="Voir les détails">
                          <IconButton
                            size="small"
                            sx={{
                              color: matiereColor,
                              bgcolor: `${matiereColor}10`,
                            }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
