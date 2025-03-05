'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Divider,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Alert,
  Snackbar,
  Drawer,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faHome,
  faFilter,
  faSort,
  faSearch,
  faTimes,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import FilterListIcon from '@mui/icons-material/FilterList'; // Add this import

// Importation des composants
import NiveauList from '../niveaux/NiveauList';
import NiveauDetails from '../niveaux/NiveauDetails';
import AddNiveauDialog from '../niveaux/AddNiveauDialog';
import MatiereList from '../matieres/MatiereList';
import MatiereDetails from '../matieres/MatiereDetails';
import AddMatiereDialog from '../matieres/AddMatiereDialog';
import ChapitreList from '../chapitres/ChapitreList';
import ChapitreDetails from '../chapitres/ChapitreDetails';
import AddChapitreDialog from '../chapitres/AddChapitreDialog';
import ExerciceList from '../exercices/ExerciceList';
import ExerciceDetails from '../exercices/ExerciceDetails';
import AddExerciceDialog from '../exercices/AddExerciceDialog';

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

export interface Exercice {
  id: number;
  chapitreId: number;
  titre: string;
  description: string;
  ressources?: string;
  configuration?: string;
  planification?: string;
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

const initialChapitres: Chapitre[] = [
  {
    id: 1,
    matiereId: 1,
    nom: 'Les Nombres',
    description: 'Introduction aux nombres et opérations de base',
    difficulte: 'Facile',
    ordre: 1,
    dateCreation: '2023-01-10',
  },
  {
    id: 2,
    matiereId: 1,
    nom: 'Géométrie Simple',
    description: 'Concepts de base en géométrie',
    difficulte: 'Moyen',
    ordre: 2,
    dateCreation: '2023-01-15',
  },
  {
    id: 3,
    matiereId: 2,
    nom: 'Lecture',
    description: 'Apprentissage de la lecture',
    difficulte: 'Facile',
    ordre: 1,
    dateCreation: '2023-01-12',
  },
  {
    id: 4,
    matiereId: 2,
    nom: 'Grammaire',
    description: 'Les bases de la grammaire française',
    difficulte: 'Moyen',
    ordre: 2,
    dateCreation: '2023-01-18',
  },
];

const initialExercices: Exercice[] = [
  {
    id: 1,
    chapitreId: 1,
    titre: 'Addition et Soustraction',
    description: 'Exercices sur les additions et soustractions simples',
    ressources: 'Fiches PDF, Vidéos explicatives',
    dateCreation: '2023-01-20',
  },
  {
    id: 2,
    chapitreId: 1,
    titre: 'Multiplication',
    description: 'Exercices sur les tables de multiplication',
    ressources: 'Jeux interactifs, Fiches de travail',
    dateCreation: '2023-01-22',
  },
  {
    id: 3,
    chapitreId: 2,
    titre: 'Reconnaître les formes',
    description: "Exercices d'identification des formes géométriques",
    ressources: 'Images, Modèles 3D',
    dateCreation: '2023-01-25',
  },
];

// Enumération des étapes de la navigation
type Step =
  | 'liste_niveaux'
  | 'detail_niveau'
  | 'liste_matieres'
  | 'detail_matiere'
  | 'liste_chapitres'
  | 'detail_chapitre'
  | 'liste_exercices'
  | 'detail_exercice';

export default function ApprentissageView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Gestion de l'étape actuelle de la navigation
  const [currentStep, setCurrentStep] = useState<Step>('liste_niveaux');
  const [searchTerm, setSearchTerm] = useState('');

  // États pour stocker les données
  const [niveaux, setNiveaux] = useState<Niveau[]>(initialNiveaux);
  const [matieres, setMatieres] = useState<Matiere[]>(initialMatieres);
  const [chapitres, setChapitres] = useState<Chapitre[]>(initialChapitres);
  const [exercices, setExercices] = useState<Exercice[]>(initialExercices);

  // États pour stocker l'élément sélectionné dans chaque module
  const [selectedNiveau, setSelectedNiveau] = useState<Niveau | null>(null);
  const [selectedMatiere, setSelectedMatiere] = useState<Matiere | null>(null);
  const [selectedChapitre, setSelectedChapitre] = useState<Chapitre | null>(null);
  const [selectedExercice, setSelectedExercice] = useState<Exercice | null>(null);

  // États pour les dialogues d'ajout
  const [openNiveauDialog, setOpenNiveauDialog] = useState(false);
  const [openMatiereDialog, setOpenMatiereDialog] = useState(false);
  const [openChapitreDialog, setOpenChapitreDialog] = useState(false);
  const [openExerciceDialog, setOpenExerciceDialog] = useState(false);

  // État pour les notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // Fonction pour revenir en arrière (selon le fil d'Ariane)
  const goBack = () => {
    if (currentStep === 'detail_niveau') setCurrentStep('liste_niveaux');
    else if (currentStep === 'liste_matieres') setCurrentStep('detail_niveau');
    else if (currentStep === 'detail_matiere') setCurrentStep('liste_matieres');
    else if (currentStep === 'liste_chapitres') setCurrentStep('detail_matiere');
    else if (currentStep === 'detail_chapitre') setCurrentStep('liste_chapitres');
    else if (currentStep === 'liste_exercices') setCurrentStep('detail_chapitre');
    else if (currentStep === 'detail_exercice') setCurrentStep('liste_exercices');
  };

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

  // Handlers pour les dialogues d'ajout
  const handleAddNiveau = (newNiveau: Omit<Niveau, 'id' | 'dateCreation'>) => {
    const now = new Date();
    const dateString = now.toISOString().slice(0, 10);

    const niveau: Niveau = {
      id: niveaux.length > 0 ? Math.max(...niveaux.map((n) => n.id)) + 1 : 1,
      dateCreation: dateString,
      ...newNiveau,
    };

    setNiveaux([...niveaux, niveau]);
    setOpenNiveauDialog(false);
    showNotification(`Niveau "${niveau.nom}" ajouté avec succès`);
  };

  const handleAddMatiere = (newMatiere: Omit<Matiere, 'id' | 'dateCreation' | 'niveauId'>) => {
    if (!selectedNiveau) return;

    const now = new Date();
    const dateString = now.toISOString().slice(0, 10);

    const matiere: Matiere = {
      id: matieres.length > 0 ? Math.max(...matieres.map((m) => m.id)) + 1 : 1,
      niveauId: selectedNiveau.id,
      dateCreation: dateString,
      ...newMatiere,
    };

    setMatieres([...matieres, matiere]);
    setOpenMatiereDialog(false);
    showNotification(`Matière "${matiere.nom}" ajoutée avec succès`);
  };

  const handleAddChapitre = (newChapitre: Omit<Chapitre, 'id' | 'dateCreation' | 'matiereId'>) => {
    if (!selectedMatiere) return;

    const now = new Date();
    const dateString = now.toISOString().slice(0, 10);

    const chapitre: Chapitre = {
      id: chapitres.length > 0 ? Math.max(...chapitres.map((c) => c.id)) + 1 : 1,
      matiereId: selectedMatiere.id,
      dateCreation: dateString,
      ...newChapitre,
    };

    setChapitres([...chapitres, chapitre]);
    setOpenChapitreDialog(false);
    showNotification(`Chapitre "${chapitre.nom}" ajouté avec succès`);
  };

  const handleAddExercice = (newExercice: Omit<Exercice, 'id' | 'dateCreation' | 'chapitreId'>) => {
    if (!selectedChapitre) return;

    const now = new Date();
    const dateString = now.toISOString().slice(0, 10);

    const exercice: Exercice = {
      id: exercices.length > 0 ? Math.max(...exercices.map((e) => e.id)) + 1 : 1,
      chapitreId: selectedChapitre.id,
      dateCreation: dateString,
      ...newExercice,
    };

    setExercices([...exercices, exercice]);
    setOpenExerciceDialog(false);
    showNotification(`Exercice "${exercice.titre}" ajouté avec succès`);
  };

  // Handlers pour les actions de suppression
  const handleDeleteNiveau = () => {
    if (!selectedNiveau) return;

    // Vérifier si le niveau a des matières associées
    const hasChildren = matieres.some((m) => m.niveauId === selectedNiveau.id);

    if (hasChildren) {
      showNotification('Impossible de supprimer ce niveau car il contient des matières', 'error');
      return;
    }

    setNiveaux(niveaux.filter((n) => n.id !== selectedNiveau.id));
    showNotification(`Niveau "${selectedNiveau.nom}" supprimé avec succès`);
    setCurrentStep('liste_niveaux');
    setSelectedNiveau(null);
  };

  const handleDeleteMatiere = () => {
    if (!selectedMatiere) return;

    // Vérifier si la matière a des chapitres associés
    const hasChildren = chapitres.some((c) => c.matiereId === selectedMatiere.id);

    if (hasChildren) {
      showNotification(
        'Impossible de supprimer cette matière car elle contient des chapitres',
        'error'
      );
      return;
    }

    setMatieres(matieres.filter((m) => m.id !== selectedMatiere.id));
    showNotification(`Matière "${selectedMatiere.nom}" supprimée avec succès`);
    setCurrentStep('liste_matieres');
    setSelectedMatiere(null);
  };

  const handleDeleteChapitre = () => {
    if (!selectedChapitre) return;

    // Vérifier si le chapitre a des exercices associés
    const hasChildren = exercices.some((e) => e.chapitreId === selectedChapitre.id);

    if (hasChildren) {
      showNotification(
        'Impossible de supprimer ce chapitre car il contient des exercices',
        'error'
      );
      return;
    }

    setChapitres(chapitres.filter((c) => c.id !== selectedChapitre.id));
    showNotification(`Chapitre "${selectedChapitre.nom}" supprimé avec succès`);
    setCurrentStep('liste_chapitres');
    setSelectedChapitre(null);
  };

  const handleDeleteExercice = () => {
    if (!selectedExercice) return;

    setExercices(exercices.filter((e) => e.id !== selectedExercice.id));
    showNotification(`Exercice "${selectedExercice.titre}" supprimé avec succès`);
    setCurrentStep('liste_exercices');
    setSelectedExercice(null);
  };

  // Handlers pour les actions d'édition (à implémenter)
  const handleEditNiveau = () => {
    // À implémenter
    showNotification("Fonctionnalité d'édition à implémenter", 'info');
  };

  const handleEditMatiere = () => {
    // À implémenter
    showNotification("Fonctionnalité d'édition à implémenter", 'info');
  };

  const handleEditChapitre = () => {
    // À implémenter
    showNotification("Fonctionnalité d'édition à implémenter", 'info');
  };

  const handleEditExercice = () => {
    // À implémenter
    showNotification("Fonctionnalité d'édition à implémenter", 'info');
  };

  // Render breadcrumbs
  const renderBreadcrumbs = () => {
    let breadcrumbs = [
      <Link
        key="home"
        underline="hover"
        color="inherit"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentStep('liste_niveaux');
        }}
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <FontAwesomeIcon icon={faHome} style={{ marginRight: '8px' }} />
        Accueil
      </Link>,
    ];

    if (currentStep === 'detail_niveau' && selectedNiveau) {
      breadcrumbs.push(
        <Typography key="niveau" color="text.primary">
          {selectedNiveau.nom}
        </Typography>
      );
    } else if (currentStep === 'liste_matieres' && selectedNiveau) {
      breadcrumbs.push(
        <Typography key="niveau" color="text.primary">
          {selectedNiveau.nom}
        </Typography>
      );
    } else if (
      ['detail_matiere', 'liste_chapitres'].includes(currentStep) &&
      selectedNiveau &&
      selectedMatiere
    ) {
      breadcrumbs.push(
        <Link
          key="niveau"
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep('detail_niveau');
          }}
        >
          {selectedNiveau.nom}
        </Link>
      );

      breadcrumbs.push(
        <Typography key="matiere" color="text.primary">
          {selectedMatiere.nom}
        </Typography>
      );
    } else if (
      ['detail_chapitre', 'liste_exercices'].includes(currentStep) &&
      selectedNiveau &&
      selectedMatiere &&
      selectedChapitre
    ) {
      breadcrumbs.push(
        <Link
          key="niveau"
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep('detail_niveau');
          }}
        >
          {selectedNiveau.nom}
        </Link>
      );

      breadcrumbs.push(
        <Link
          key="matiere"
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep('detail_matiere');
          }}
        >
          {selectedMatiere.nom}
        </Link>
      );

      breadcrumbs.push(
        <Typography key="chapitre" color="text.primary">
          {selectedChapitre.nom}
        </Typography>
      );
    } else if (
      currentStep === 'detail_exercice' &&
      selectedNiveau &&
      selectedMatiere &&
      selectedChapitre &&
      selectedExercice
    ) {
      breadcrumbs.push(
        <Link
          key="niveau"
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep('detail_niveau');
          }}
        >
          {selectedNiveau.nom}
        </Link>
      );

      breadcrumbs.push(
        <Link
          key="matiere"
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep('detail_matiere');
          }}
        >
          {selectedMatiere.nom}
        </Link>
      );

      breadcrumbs.push(
        <Link
          key="chapitre"
          underline="hover"
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentStep('detail_chapitre');
          }}
        >
          {selectedChapitre.nom}
        </Link>
      );

      breadcrumbs.push(
        <Typography key="exercice" color="text.primary">
          {selectedExercice.titre}
        </Typography>
      );
    }

    return (
      <Breadcrumbs
        separator={
          <FontAwesomeIcon
            icon={faChevronRight}
            style={{ fontSize: '12px', marginBottom: '2px' }}
          />
        }
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        {breadcrumbs}
      </Breadcrumbs>
    );
  };

  // Render action bar with search
  const renderActionBar = () => {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'background.default',
          borderRadius: 2,
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
                <FontAwesomeIcon icon={faSearch} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')} title="Effacer">
                  <FontAwesomeIcon icon={faTimes} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{ mr: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" color="primary" title="Filtrer">
            <FilterListIcon />
          </IconButton>
        </Box>
      </Paper>
    );
  };

  // Rendu du contenu principal en fonction de l'étape
  const renderMainContent = () => {
    switch (currentStep) {
      case 'liste_niveaux':
        return (
          <NiveauList
            niveaux={niveaux.filter(
              (n) =>
                searchTerm === '' ||
                n.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.description.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            onSelect={(niveau) => {
              setSelectedNiveau(niveau);
              setCurrentStep('detail_niveau');
            }}
            onAdd={() => setOpenNiveauDialog(true)}
          />
        );
      case 'liste_matieres':
        return (
          <MatiereList
            matieres={matieres.filter(
              (m) =>
                m.niveauId === selectedNiveau?.id &&
                (searchTerm === '' ||
                  m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            niveau={selectedNiveau!}
            onSelect={(matiere) => {
              setSelectedMatiere(matiere);
              setCurrentStep('detail_matiere');
            }}
            onAdd={() => setOpenMatiereDialog(true)}
            onBack={goBack}
          />
        );
      case 'liste_chapitres':
        return (
          <ChapitreList
            chapitres={chapitres.filter(
              (c) =>
                c.matiereId === selectedMatiere?.id &&
                (searchTerm === '' ||
                  c.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            matiere={selectedMatiere!}
            onSelect={(chapitre) => {
              setSelectedChapitre(chapitre);
              setCurrentStep('detail_chapitre');
            }}
            onAdd={() => setOpenChapitreDialog(true)}
            onBack={goBack}
          />
        );
      case 'liste_exercices':
        return (
          <ExerciceList
            exercices={exercices.filter(
              (e) =>
                e.chapitreId === selectedChapitre?.id &&
                (searchTerm === '' ||
                  e.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  e.description.toLowerCase().includes(searchTerm.toLowerCase()))
            )}
            chapitre={selectedChapitre!}
            onSelect={(exercice) => {
              setSelectedExercice(exercice);
              setCurrentStep('detail_exercice');
            }}
            onAdd={() => setOpenExerciceDialog(true)}
            onBack={goBack}
          />
        );
      default:
        return null;
    }
  };

  // Rendu des contenus détaillés (dans la sidebar)
  const renderDetailContent = () => {
    switch (currentStep) {
      case 'detail_niveau':
        return (
          selectedNiveau && (
            <NiveauDetails
              niveau={selectedNiveau}
              onEdit={handleEditNiveau}
              onDelete={handleDeleteNiveau}
              onManageMatieres={() => setCurrentStep('liste_matieres')}
              onBack={() => setCurrentStep('liste_niveaux')}
            />
          )
        );
      case 'detail_matiere':
        return (
          selectedMatiere && (
            <MatiereDetails
              matiere={selectedMatiere}
              onEdit={handleEditMatiere}
              onDelete={handleDeleteMatiere}
              onManageChapitres={() => setCurrentStep('liste_chapitres')}
              onBack={() => setCurrentStep('liste_matieres')}
            />
          )
        );
      case 'detail_chapitre':
        return (
          selectedChapitre && (
            <ChapitreDetails
              chapitre={selectedChapitre}
              onEdit={handleEditChapitre}
              onDelete={handleDeleteChapitre}
              onManageExercices={() => setCurrentStep('liste_exercices')}
              onBack={() => setCurrentStep('liste_chapitres')}
            />
          )
        );
      case 'detail_exercice':
        return (
          selectedExercice && (
            <ExerciceDetails
              exercice={selectedExercice}
              onEdit={handleEditExercice}
              onDelete={handleDeleteExercice}
              onBack={() => setCurrentStep('liste_exercices')}
            />
          )
        );
      default:
        return null;
    }
  };

  // Vérifier si un détail est affiché
  const isDetailView = currentStep.includes('detail_');

  // Largeur du contenu principal lorsqu'un détail est affiché
  const mainContentWidth = isDetailView ? { xs: '100%', md: 'calc(100% - 450px)' } : '100%';

  return (
    <Container
      maxWidth={false}
      disableGutters={isDetailView}
      sx={{
        py: 4,
        px: isDetailView ? { xs: 2, md: 3 } : 3,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: isDetailView ? '100%' : 'lg',
        mx: 'auto',
      }}
    >
      <Box
        sx={{
          width: mainContentWidth,
          transition: 'width 0.3s ease',
          mr: isDetailView ? { xs: 0, md: '450px' } : 0,
          display: isDetailView && isMobile ? 'none' : 'block',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 2,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          }}
        >
          Gestion de Contenu Pédagogique
        </Typography>

        <Divider sx={{ my: 2 }} />

        {renderBreadcrumbs()}
        {renderActionBar()}

        <Box sx={{ mt: 2 }}>{renderMainContent()}</Box>
      </Box>

      {/* Sidebar for details */}
      {isDetailView && (
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isDetailView}
          anchor="right"
          onClose={() => goBack()}
          sx={{
            width: { xs: '100%', md: '450px' },
            flexShrink: 0,
            display: isDetailView ? 'block' : 'none',
            '& .MuiDrawer-paper': {
              width: { xs: '100%', md: '450px' },
              boxSizing: 'border-box',
              position: 'absolute',
              height: '100%',
              border: 'none',
              boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ p: 3 }}>{renderDetailContent()}</Box>
        </Drawer>
      )}

      {/* Dialogues d'ajout */}
      <AddNiveauDialog
        open={openNiveauDialog}
        onClose={() => setOpenNiveauDialog(false)}
        onSubmit={handleAddNiveau}
      />

      <AddMatiereDialog
        open={openMatiereDialog}
        onClose={() => setOpenMatiereDialog(false)}
        onSubmit={handleAddMatiere}
      />

      {selectedMatiere && (
        <AddChapitreDialog
          open={openChapitreDialog}
          onClose={() => setOpenChapitreDialog(false)}
          matiereId={selectedMatiere.id}
          onSubmit={handleAddChapitre}
        />
      )}

      {selectedChapitre && (
        <AddExerciceDialog
          open={openExerciceDialog}
          onClose={() => setOpenExerciceDialog(false)}
          chapitreId={selectedChapitre.id}
          onSubmit={handleAddExercice}
        />
      )}

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
    </Container>
  );
}
