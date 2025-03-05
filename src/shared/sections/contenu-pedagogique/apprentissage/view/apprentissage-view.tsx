'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Container,
  Grid,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Tooltip,
  Stack,
} from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

// Import icons
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
import BookIcon from '@mui/icons-material/Book';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate';
import LanguageIcon from '@mui/icons-material/Language';
import ScienceIcon from '@mui/icons-material/Science';
import BrushIcon from '@mui/icons-material/Brush';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Types
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

export interface Chapitre {
  id: number;
  matiereId: number;
  nom: string;
  description: string;
  difficulte: string;
  ordre: number;
  conditionsAcces?: string;
  dateCreation: string;
}

// Données initiales (exemple)
const initialNiveaux: Niveau[] = [
  {
    id: 1,
    nom: 'Primaire 1',
    description: 'Niveau de base pour les débutants',
    dateCreation: '2023-01-01',
  },
  {
    id: 2,
    nom: 'Primaire 2',
    description: 'Niveau intermédiaire pour progression',
    dateCreation: '2023-02-15',
  },
  {
    id: 3,
    nom: 'Primaire 3',
    description: 'Niveau avancé pour maîtrise des compétences',
    dateCreation: '2023-03-10',
  },
];

const initialMatieres: Matiere[] = [
  {
    id: 1,
    niveauId: 1,
    nom: 'Mathématiques',
    description: 'Cours de mathématiques pour le niveau primaire 1',
    couleur: '#4CAF50',
    icone: 'calculator',
    dateCreation: '2023-01-05',
  },
  {
    id: 2,
    niveauId: 1,
    nom: 'Français',
    description: 'Cours de français pour le niveau primaire 1',
    couleur: '#2196F3',
    icone: 'book',
    dateCreation: '2023-01-07',
  },
  {
    id: 3,
    niveauId: 2,
    nom: 'Sciences',
    description: 'Cours de sciences pour le niveau primaire 2',
    couleur: '#FF9800',
    icone: 'flask',
    dateCreation: '2023-02-20',
  },
  {
    id: 4,
    niveauId: 2,
    nom: 'Anglais',
    description: "Cours d'anglais pour le niveau primaire 2",
    couleur: '#E91E63',
    icone: 'language',
    dateCreation: '2023-02-22',
  },
];

// Enumération des étapes de la navigation
type Step = 'liste_niveaux' | 'detail_niveau' | 'liste_matieres' | 'detail_matiere';

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
  return <BookIcon />;
};

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

export default function ApprentissageView() {
  // States pour stocker les données
  const [niveaux, setNiveaux] = useState<Niveau[]>(initialNiveaux);
  const [matieres, setMatieres] = useState<Matiere[]>(initialMatieres);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('liste_niveaux');

  // États pour stocker l'élément sélectionné dans chaque module
  const [selectedNiveau, setSelectedNiveau] = useState<Niveau | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);

  // État pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fonction pour afficher une notification
  const showNotification = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'success'
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Fonction pour fermer la notification
  const closeSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Fonction pour revenir en arrière (selon le fil d'Ariane)
  const goBack = () => {
    if (currentStep === 'detail_niveau') setCurrentStep('liste_niveaux');
    else if (currentStep === 'liste_matieres') setCurrentStep('detail_niveau');
    else if (currentStep === 'detail_matiere') setCurrentStep('liste_matieres');
  };

  // Handlers d'ajout (placeholder)
  const handleAddNiveau = () => {
    showNotification('Fonctionnalité à implémenter: Ajouter un niveau', 'info');
  };
  const handleAddMatiere = () => {
    showNotification('Fonctionnalité à implémenter: Ajouter une matière', 'info');
  };

  // Handlers pour la sélection
  const handleSelectNiveau = (niveau: Niveau) => {
    setSelectedNiveau(niveau);
    setCurrentStep('liste_matieres');
    setSearchTerm('');
  };
  const handleSelectMatiere = (matiere: Matiere) => {
    setSelectedMatiere(matiere);
    setCurrentStep('detail_matiere');
    showNotification(`Matière ${matiere.nom} sélectionnée`);
  };

  // Handlers for niveau actions
  const handleEditNiveau = (niveau: Niveau, event: React.MouseEvent) => {
    event.stopPropagation();
    showNotification(`Édition du niveau ${niveau.nom}`, 'info');
  };
  const handleDeleteNiveau = (niveau: Niveau, event: React.MouseEvent) => {
    event.stopPropagation();
    showNotification(`Suppression du niveau ${niveau.nom}`, 'info');
  };
  const handleViewNiveauDetails = (niveau: Niveau, event: React.MouseEvent) => {
    event.stopPropagation();
    showNotification(`Voir les détails du niveau ${niveau.nom}`, 'info');
  };

  // Render: liste des niveaux
  const renderNiveauxList = () => {
    const filteredNiveaux = niveaux.filter(
      (niveau) =>
        searchTerm === '' ||
        niveau.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        niveau.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Box>
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
          <Typography variant="h6">Niveaux</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNiveau}
            size="small"
            sx={{
              bgcolor: 'white',
              color: (theme) => theme.palette.primary.main,
              '&:hover': { bgcolor: '#f7f7f7' },
            }}
          >
            Ajouter Niveau
          </Button>
        </Box>

        {filteredNiveaux.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
              borderRadius: 2,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            <FolderIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucun niveau disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? `Aucun résultat pour "${searchTerm}"`
                : 'Ajoutez votre premier niveau pour commencer à organiser votre contenu pédagogique.'}
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNiveau}>
              Ajouter un Niveau
            </Button>
          </Paper>
        ) : (
          <Box sx={{ mt: 2 }}>
            {filteredNiveaux.map((niveau) => (
              <Box
                key={niveau.id}
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
                onClick={() => handleSelectNiveau(niveau)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <FolderIcon
                    sx={{
                      mr: 2,
                      color: (theme) => theme.palette.primary.main,
                    }}
                  />
                  <Typography>{niveau.nom}</Typography>
                </Box>

                <Box>
                  <Tooltip title="Détails">
                    <IconButton
                      size="small"
                      onClick={(e) => handleViewNiveauDetails(niveau, e)}
                      sx={{ color: 'info.main' }}
                    >
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Modifier">
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditNiveau(niveau, e)}
                      sx={{ color: 'primary.main' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Supprimer">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteNiveau(niveau, e)}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  // Helper function to get color based on matiere name
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

    // Default color
    return '#607D8B';
  };

  // Handlers for matiere actions
  const handleEditMatiere = (matiere: Matiere, event: React.MouseEvent) => {
    event.stopPropagation();
    showNotification(`Édition de la matière ${matiere.nom}`, 'info');
  };
  const handleDeleteMatiere = (matiere: Matiere, event: React.MouseEvent) => {
    event.stopPropagation();
    showNotification(`Suppression de la matière ${matiere.nom}`, 'info');
  };
  const handleViewMatiereDetails = (matiere: Matiere, event: React.MouseEvent) => {
    event.stopPropagation();
    handleSelectMatiere(matiere);
  };

  // Render: liste des matières
  const renderMatieresList = () => {
    const filteredMatieres = matieres.filter(
      (matiere) =>
        matiere.niveauId === selectedNiveau?.id &&
        (searchTerm === '' ||
          matiere.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matiere.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
      <Box>
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
          <Typography variant="h6">Matières pour {selectedNiveau?.nom}</Typography>
          <Box>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={goBack}
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
              onClick={handleAddMatiere}
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

        {filteredMatieres.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              bgcolor: 'background.default',
              borderRadius: 2,
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.7 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Aucune matière disponible
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTerm
                ? `Aucun résultat pour "${searchTerm}"`
                : 'Ajoutez votre première matière pour ce niveau.'}
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddMatiere}>
              Ajouter une Matière
            </Button>
          </Paper>
        ) : (
          <Box sx={{ mt: 2 }}>
            {filteredMatieres.map((matiere) => {
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
                  onClick={() => handleSelectMatiere(matiere)}
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
                        onClick={(e) => handleViewMatiereDetails(matiere, e)}
                        sx={{ color: 'info.main' }}
                      >
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={(e) => handleEditMatiere(matiere, e)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDeleteMatiere(matiere, e)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    );
  };

  // Example: details of the selected matiere (placeholder)
  const renderMatiereDetails = () => {
    if (!selectedMatiere) return null;

    return (
      <Card>
        <CardHeader title={`Détails de la matière: ${selectedMatiere.nom}`} />
        <CardContent>
          <Grid container spacing={2}>
            {/* Example usage of selectedMatiere info */}
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedMatiere.description}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  startIcon={<InfoIcon />}
                  onClick={() => showNotification('Fonctionnalité à implémenter', 'info')}
                  size="medium"
                >
                  Supprimer
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Placeholder for any "Add" dialogs you might implement
  const renderAddDialogs = () => {
    // Return your modal or dialog components here if needed
    return null;
  };

  // Main component return
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        py: 2,
        px: 2,
      }}
    >
      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Only show search bar when in list views */}
      {(currentStep === 'liste_niveaux' || currentStep === 'liste_matieres') && (
        <Box sx={{ mb: 3 }}>
          <Paper
            sx={{
              p: 1.5,
              borderRadius: 1,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <TextField
              placeholder="Rechercher..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')} title="Effacer">
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Paper>
        </Box>
      )}

      {/* Render content based on the current step */}
      {currentStep === 'liste_niveaux' && renderNiveauxList()}
      {currentStep === 'liste_matieres' && renderMatieresList()}
      {currentStep === 'detail_matiere' && renderMatiereDetails()}

      {/* Any add dialogs or modals */}
      {renderAddDialogs()}
    </Container>
  );
}
