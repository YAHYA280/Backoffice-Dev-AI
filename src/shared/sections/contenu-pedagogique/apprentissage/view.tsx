// 'use client';

// import React, { useState } from 'react';
// import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// // Import hooks
// import useNiveauxHooks from './hooks/useNiveaux';
// import { useMatieres } from './hooks/useMatieres';

// // Import common components
// import { PageHeader } from './components/common/PageHeader';

// // Import Niveau components
// import { NiveauList } from './components/niveau/NiveauList';
// import { NiveauDialog } from './components/niveau/NiveauDialog';
// import NiveauDeleteDialog from './components/niveau/NiveauDeleteDialog';
// import NiveauDetailDrawer from './components/niveau/NiveauDetailDrawer';

// // Import Matiere components
// import { MatiereList } from './components/matiere/MatiereList';
// import { MatiereDialog } from './components/matiere/MatiereDialog';
// import MatiereDeleteDialog from './components/matiere/MatiereDeleteDialog';
// import MatiereDetailDrawer from './components/matiere/MatiereDetailDrawer';

// export const ApprentissageView: React.FC = () => {
//   // ---- State for view navigation ----
//   const [currentView, setCurrentView] = useState<'niveaux' | 'matieres'>('niveaux');
//   const [currentNiveauId, setCurrentNiveauId] = useState<string | null>(null);
//   const [currentNiveauName, setCurrentNiveauName] = useState<string | null>(null);

//   // ---- Niveaux state and functions ----
//   const { useNiveaux } = useNiveauxHooks;
//   const {
//     niveaux,
//     loading: niveauxLoading,
//     error: niveauxError,
//     pagination: niveauxPagination,
//     filters: niveauxFilters,
//     selectedNiveau,
//     setSelectedNiveau,
//     handlePageChange: handleNiveauPageChange,
//     handleLimitChange: handleNiveauLimitChange,
//     handleSearch: handleNiveauSearch,
//     refetch: refetchNiveaux,
//   } = useNiveaux();

//   // ---- Matieres state and functions ----
//   const {
//     matieres,
//     loading: matieresLoading,
//     error: matieresError,
//     pagination: matieresPagination,
//     filters: matieresFilters,
//     selectedMatiere,
//     setSelectedMatiere,
//     handlePageChange: handleMatierePageChange,
//     handleLimitChange: handleMatiereLimitChange,
//     handleSearch: handleMatiereSearch,
//     refetch: refetchMatieres,
//   } = useMatieres(currentNiveauId || '');

//   // ---- Niveaux dialog and drawer state ----
//   const [openNiveauAddDialog, setOpenNiveauAddDialog] = useState(false);
//   const [openNiveauEditDialog, setOpenNiveauEditDialog] = useState(false);
//   const [openNiveauDeleteDialog, setOpenNiveauDeleteDialog] = useState(false);
//   const [openNiveauDetailDrawer, setOpenNiveauDetailDrawer] = useState(false);

//   // ---- Matieres dialog and drawer state ----
//   const [openMatiereAddDialog, setOpenMatiereAddDialog] = useState(false);
//   const [openMatiereEditDialog, setOpenMatiereEditDialog] = useState(false);
//   const [openMatiereDeleteDialog, setOpenMatiereDeleteDialog] = useState(false);
//   const [openMatiereDetailDrawer, setOpenMatiereDetailDrawer] = useState(false);

//   // ---- Navigation functions ----
//   const navigateToMatieres = (niveau: any) => {
//     setCurrentNiveauId(niveau.id);
//     setCurrentNiveauName(niveau.nom);
//     setCurrentView('matieres');
//     // When navigating, clear any selected items and close any open drawers/dialogs
//     setSelectedNiveau(null);
//     setSelectedMatiere(null);
//   };

//   const navigateToNiveaux = () => {
//     setCurrentView('niveaux');
//     setCurrentNiveauId(null);
//     setCurrentNiveauName(null);
//     // When navigating, clear any selected items and close any open drawers/dialogs
//     setSelectedNiveau(null);
//     setSelectedMatiere(null);
//   };

//   // ---- Niveau handler functions ----
//   const handleNiveauAddClick = () => {
//     setOpenNiveauAddDialog(true);
//   };

//   const handleNiveauEditClick = (niveau: any) => {
//     setSelectedNiveau(niveau);
//     setOpenNiveauEditDialog(true);
//   };

//   const handleNiveauDeleteClick = (niveau: any) => {
//     setSelectedNiveau(niveau);
//     setOpenNiveauDeleteDialog(true);
//   };

//   const handleNiveauViewClick = (niveau: any) => {
//     setSelectedNiveau(niveau);
//     setOpenNiveauDetailDrawer(true);
//   };

//   const handleCloseNiveauAddDialog = () => {
//     setOpenNiveauAddDialog(false);
//   };

//   const handleCloseNiveauEditDialog = () => {
//     setOpenNiveauEditDialog(false);
//     setSelectedNiveau(null);
//   };

//   const handleCloseNiveauDeleteDialog = () => {
//     setOpenNiveauDeleteDialog(false);
//     setSelectedNiveau(null);
//   };

//   const handleCloseNiveauDetailDrawer = () => {
//     setOpenNiveauDetailDrawer(false);
//     setSelectedNiveau(null);
//   };

//   const handleDeleteNiveauRows = async (selectedRows: string[]) => {
//     // Here you would implement the logic to delete multiple rows
//     console.log('Deleting niveaux rows:', selectedRows);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     // Refresh data
//     refetchNiveaux();
//   };

//   // ---- Matiere handler functions ----
//   const handleMatiereAddClick = () => {
//     setOpenMatiereAddDialog(true);
//   };

//   const handleMatiereEditClick = (matiere: any) => {
//     setSelectedMatiere(matiere);
//     setOpenMatiereEditDialog(true);
//   };

//   const handleMatiereDeleteClick = (matiere: any) => {
//     setSelectedMatiere(matiere);
//     setOpenMatiereDeleteDialog(true);
//   };

//   const handleMatiereViewClick = (matiere: any) => {
//     setSelectedMatiere(matiere);
//     setOpenMatiereDetailDrawer(true);
//   };

//   const handleCloseMatiereAddDialog = () => {
//     setOpenMatiereAddDialog(false);
//   };

//   const handleCloseMatiereEditDialog = () => {
//     setOpenMatiereEditDialog(false);
//     setSelectedMatiere(null);
//   };

//   const handleCloseMatiereDeleteDialog = () => {
//     setOpenMatiereDeleteDialog(false);
//     setSelectedMatiere(null);
//   };

//   const handleCloseMatiereDetailDrawer = () => {
//     setOpenMatiereDetailDrawer(false);
//     setSelectedMatiere(null);
//   };

//   const handleDeleteMatiereRows = async (selectedRows: string[]) => {
//     // Here you would implement the logic to delete multiple matieres
//     console.log('Deleting matieres rows:', selectedRows);

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     // Refresh data
//     refetchMatieres();
//   };

//   // ---- Render functions ----
//   const renderBreadcrumbs = () => {
//     if (currentView === 'niveaux') {
//       return (
//         <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
//           <Typography color="text.primary">Niveaux d&apos;enseignement</Typography>
//         </Breadcrumbs>
//       );
//     }

//     if (currentView === 'matieres' && currentNiveauName) {
//       return (
//         <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
//           <Link
//             component="button"
//             color="inherit"
//             onClick={navigateToNiveaux}
//             sx={{ display: 'flex', alignItems: 'center' }}
//           >
//             <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '4px' }} />
//             Niveaux d&apos;enseignement
//           </Link>
//           <Typography color="text.primary">{currentNiveauName}</Typography>
//         </Breadcrumbs>
//       );
//     }

//     return null;
//   };

//   const renderContent = () => {
//     if (currentView === 'niveaux') {
//       return (
//         <>
//           <PageHeader
//             title="Niveaux d'enseignement"
//             actionLabel="+ Ajouter un niveau"
//             onActionClick={handleNiveauAddClick}
//           />

//           {niveauxError && (
//             <Box sx={{ mt: 2, mb: 2 }}>
//               <Typography color="error">{niveauxError}</Typography>
//             </Box>
//           )}

//           <NiveauList
//             niveaux={niveaux}
//             loading={niveauxLoading}
//             pagination={niveauxPagination}
//             filters={niveauxFilters}
//             onPageChange={handleNiveauPageChange}
//             onLimitChange={handleNiveauLimitChange}
//             onSearchChange={handleNiveauSearch}
//             onEditClick={handleNiveauEditClick}
//             onDeleteClick={handleNiveauDeleteClick}
//             onViewClick={handleNiveauViewClick}
//             onDeleteRows={handleDeleteNiveauRows}
//             onViewMatieres={navigateToMatieres}
//           />

//           {/* Niveau dialogs and drawers */}
//           <NiveauDialog
//             open={openNiveauAddDialog}
//             onClose={handleCloseNiveauAddDialog}
//             onSubmit={() => {
//               handleCloseNiveauAddDialog();
//               refetchNiveaux();
//             }}
//           />

//           {selectedNiveau && (
//             <>
//               <NiveauDialog
//                 open={openNiveauEditDialog}
//                 onClose={handleCloseNiveauEditDialog}
//                 niveau={selectedNiveau}
//                 onSubmit={() => {
//                   handleCloseNiveauEditDialog();
//                   refetchNiveaux();
//                 }}
//               />

//               <NiveauDeleteDialog
//                 open={openNiveauDeleteDialog}
//                 onClose={handleCloseNiveauDeleteDialog}
//                 onSubmit={() => {
//                   handleCloseNiveauDeleteDialog();
//                   refetchNiveaux();
//                 }}
//                 niveau={selectedNiveau}
//               />

//               <NiveauDetailDrawer
//                 open={openNiveauDetailDrawer}
//                 onClose={handleCloseNiveauDetailDrawer}
//                 niveau={selectedNiveau}
//                 onEdit={() => {
//                   handleCloseNiveauDetailDrawer();
//                   handleNiveauEditClick(selectedNiveau);
//                 }}
//                 onDelete={() => {
//                   handleCloseNiveauDetailDrawer();
//                   handleNiveauDeleteClick(selectedNiveau);
//                 }}
//                 onViewMatieres={() => {
//                   handleCloseNiveauDetailDrawer();
//                   navigateToMatieres(selectedNiveau);
//                 }}
//               />
//             </>
//           )}
//         </>
//       );
//     }

//     if (currentView === 'matieres' && currentNiveauId) {
//       return (
//         <>
//           <PageHeader
//             title={`Matières pour ${currentNiveauName}`}
//             actionLabel="+ Ajouter une matière"
//             onActionClick={handleMatiereAddClick}
//           />

//           {matieresError && (
//             <Box sx={{ mt: 2, mb: 2 }}>
//               <Typography color="error">{matieresError}</Typography>
//             </Box>
//           )}

//           <MatiereList
//             matieres={matieres}
//             loading={matieresLoading}
//             pagination={matieresPagination}
//             filters={matieresFilters}
//             onPageChange={handleMatierePageChange}
//             onLimitChange={handleMatiereLimitChange}
//             onSearchChange={handleMatiereSearch}
//             onEditClick={handleMatiereEditClick}
//             onDeleteClick={handleMatiereDeleteClick}
//             onViewClick={handleMatiereViewClick}
//             onDeleteRows={handleDeleteMatiereRows}
//           />

//           {/* Matiere dialogs and drawers */}
//           <MatiereDialog
//             open={openMatiereAddDialog}
//             onClose={handleCloseMatiereAddDialog}
//             onSubmit={() => {
//               handleCloseMatiereAddDialog();
//               refetchMatieres();
//             }}
//             niveauId={currentNiveauId}
//           />

//           {selectedMatiere && (
//             <>
//               <MatiereDialog
//                 open={openMatiereEditDialog}
//                 onClose={handleCloseMatiereEditDialog}
//                 matiere={selectedMatiere}
//                 onSubmit={() => {
//                   handleCloseMatiereEditDialog();
//                   refetchMatieres();
//                 }}
//                 niveauId={currentNiveauId}
//               />

//               <MatiereDeleteDialog
//                 open={openMatiereDeleteDialog}
//                 onClose={handleCloseMatiereDeleteDialog}
//                 onSubmit={() => {
//                   handleCloseMatiereDeleteDialog();
//                   refetchMatieres();
//                 }}
//                 matiere={selectedMatiere}
//               />

//               <MatiereDetailDrawer
//                 open={openMatiereDetailDrawer}
//                 onClose={handleCloseMatiereDetailDrawer}
//                 matiere={selectedMatiere}
//                 onEdit={() => {
//                   handleCloseMatiereDetailDrawer();
//                   handleMatiereEditClick(selectedMatiere);
//                 }}
//                 onDelete={() => {
//                   handleCloseMatiereDetailDrawer();
//                   handleMatiereDeleteClick(selectedMatiere);
//                 }}
//                 onViewChapitres={() => {
//                   // Navigate to chapitres page for this matiere
//                   console.log(`Navigate to chapitres for matiere: ${selectedMatiere.id}`);
//                 }}
//               />
//             </>
//           )}
//         </>
//       );
//     }

//     return null;
//   };

//   return (
//     <Container maxWidth={false}>
//       {renderBreadcrumbs()}
//       {renderContent()}
//     </Container>
//   );
// };

'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Breadcrumbs, Link } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// Import hooks
import useNiveauxHooks from './hooks/useNiveaux';
import { useMatieres } from './hooks/useMatieres';
import { useChapitres } from './hooks/useChapitres';
import { useExercices } from './hooks/useExercices';

// Import common components
import { PageHeader } from './components/common/PageHeader';

// Import Niveau components
import { NiveauList } from './components/niveau/NiveauList';
import { NiveauDialog } from './components/niveau/NiveauDialog';
import NiveauDeleteDialog from './components/niveau/NiveauDeleteDialog';
import NiveauDetailDrawer from './components/niveau/NiveauDetailDrawer';

// Import Matiere components
import { MatiereList } from './components/matiere/MatiereList';
import { MatiereDialog } from './components/matiere/MatiereDialog';
import MatiereDeleteDialog from './components/matiere/MatiereDeleteDialog';
import MatiereDetailDrawer from './components/matiere/MatiereDetailDrawer';

// Import Chapitre components
import { ChapitreList } from './components/chapitre/ChapitreList';
import ChapitreDialog from './components/chapitre/ChapitreDialog';
import ChapitreDeleteDialog from './components/chapitre/ChapitreDeleteDialog';
import ChapitreDetailDrawer from './components/chapitre/ChapitreDetailDrawer';

// Import Exercice components
import { ExerciceList } from './components/exercice/ExerciceList';
import ExerciceDialog from './components/exercice/ExerciceDialog';
import ExerciceDeleteDialog from './components/exercice/ExerciceDeleteDialog';
import ExerciceDetailDrawer from './components/exercice/ExerciceDetailDrawer';

export const ApprentissageView: React.FC = () => {
  // ---- State for view navigation ----
  const [currentView, setCurrentView] = useState<
    'niveaux' | 'matieres' | 'chapitres' | 'exercices'
  >('niveaux');

  // Track active IDs and names for breadcrumb navigation
  const [currentNiveauId, setCurrentNiveauId] = useState<string | null>(null);
  const [currentNiveauName, setCurrentNiveauName] = useState<string | null>(null);

  const [currentMatiereId, setCurrentMatiereId] = useState<string | null>(null);
  const [currentMatiereName, setCurrentMatiereName] = useState<string | null>(null);

  const [currentChapitreId, setCurrentChapitreId] = useState<string | null>(null);
  const [currentChapitreName, setCurrentChapitreName] = useState<string | null>(null);

  // ---- Niveaux state and functions ----
  const { useNiveaux } = useNiveauxHooks;
  const {
    niveaux,
    loading: niveauxLoading,
    error: niveauxError,
    pagination: niveauxPagination,
    filters: niveauxFilters,
    selectedNiveau,
    setSelectedNiveau,
    handlePageChange: handleNiveauPageChange,
    handleLimitChange: handleNiveauLimitChange,
    handleSearch: handleNiveauSearch,
    refetch: refetchNiveaux,
  } = useNiveaux();

  // ---- Matieres state and functions ----
  const {
    matieres,
    loading: matieresLoading,
    error: matieresError,
    pagination: matieresPagination,
    filters: matieresFilters,
    selectedMatiere,
    setSelectedMatiere,
    handlePageChange: handleMatierePageChange,
    handleLimitChange: handleMatiereLimitChange,
    handleSearch: handleMatiereSearch,
    refetch: refetchMatieres,
  } = useMatieres(currentNiveauId || '');

  // ---- Chapitres state and functions ----
  const {
    chapitres,
    loading: chapitresLoading,
    error: chapitresError,
    pagination: chapitresPagination,
    filters: chapitresFilters,
    selectedChapitre,
    setSelectedChapitre,
    handlePageChange: handleChapitrePageChange,
    handleLimitChange: handleChapitreLimitChange,
    handleSearch: handleChapitreSearch,
    refetch: refetchChapitres,
  } = useChapitres(currentMatiereId || '');

  // ---- Exercices state and functions ----
  const {
    exercices,
    loading: exercicesLoading,
    error: exercicesError,
    pagination: exercicesPagination,
    filters: exercicesFilters,
    selectedExercice,
    setSelectedExercice,
    handlePageChange: handleExercicePageChange,
    handleLimitChange: handleExerciceLimitChange,
    handleSearch: handleExerciceSearch,
    refetch: refetchExercices,
  } = useExercices(currentChapitreId || '');

  // ---- Niveaux dialog and drawer state ----
  const [openNiveauAddDialog, setOpenNiveauAddDialog] = useState(false);
  const [openNiveauEditDialog, setOpenNiveauEditDialog] = useState(false);
  const [openNiveauDeleteDialog, setOpenNiveauDeleteDialog] = useState(false);
  const [openNiveauDetailDrawer, setOpenNiveauDetailDrawer] = useState(false);

  // ---- Matieres dialog and drawer state ----
  const [openMatiereAddDialog, setOpenMatiereAddDialog] = useState(false);
  const [openMatiereEditDialog, setOpenMatiereEditDialog] = useState(false);
  const [openMatiereDeleteDialog, setOpenMatiereDeleteDialog] = useState(false);
  const [openMatiereDetailDrawer, setOpenMatiereDetailDrawer] = useState(false);

  // ---- Chapitres dialog and drawer state ----
  const [openChapitreAddDialog, setOpenChapitreAddDialog] = useState(false);
  const [openChapitreEditDialog, setOpenChapitreEditDialog] = useState(false);
  const [openChapitreDeleteDialog, setOpenChapitreDeleteDialog] = useState(false);
  const [openChapitreDetailDrawer, setOpenChapitreDetailDrawer] = useState(false);

  // ---- Exercices dialog and drawer state ----
  const [openExerciceAddDialog, setOpenExerciceAddDialog] = useState(false);
  const [openExerciceEditDialog, setOpenExerciceEditDialog] = useState(false);
  const [openExerciceDeleteDialog, setOpenExerciceDeleteDialog] = useState(false);
  const [openExerciceDetailDrawer, setOpenExerciceDetailDrawer] = useState(false);

  // ---- Navigation functions ----
  const navigateToNiveaux = () => {
    setCurrentView('niveaux');
    setCurrentNiveauId(null);
    setCurrentNiveauName(null);
    setCurrentMatiereId(null);
    setCurrentMatiereName(null);
    setCurrentChapitreId(null);
    setCurrentChapitreName(null);
    // Clear selected items
    setSelectedNiveau(null);
    setSelectedMatiere(null);
    setSelectedChapitre(null);
    setSelectedExercice(null);
  };

  const navigateToMatieres = (niveau: any) => {
    setCurrentView('matieres');
    setCurrentNiveauId(niveau.id);
    setCurrentNiveauName(niveau.nom);
    setCurrentMatiereId(null);
    setCurrentMatiereName(null);
    setCurrentChapitreId(null);
    setCurrentChapitreName(null);
    // Clear selected items
    setSelectedNiveau(null);
    setSelectedMatiere(null);
    setSelectedChapitre(null);
    setSelectedExercice(null);
  };

  const navigateToChapitres = (matiere: any) => {
    setCurrentView('chapitres');
    setCurrentMatiereId(matiere.id);
    setCurrentMatiereName(matiere.nom);
    setCurrentChapitreId(null);
    setCurrentChapitreName(null);
    // Clear selected items
    setSelectedMatiere(null);
    setSelectedChapitre(null);
    setSelectedExercice(null);
  };

  const navigateToExercices = (chapitre: any) => {
    setCurrentView('exercices');
    setCurrentChapitreId(chapitre.id);
    setCurrentChapitreName(chapitre.nom);
    // Clear selected items
    setSelectedChapitre(null);
    setSelectedExercice(null);
  };

  // ---- Niveau handler functions ----
  const handleNiveauAddClick = () => {
    setOpenNiveauAddDialog(true);
  };

  const handleNiveauEditClick = (niveau: any) => {
    setSelectedNiveau(niveau);
    setOpenNiveauEditDialog(true);
  };

  const handleNiveauDeleteClick = (niveau: any) => {
    setSelectedNiveau(niveau);
    setOpenNiveauDeleteDialog(true);
  };

  const handleNiveauViewClick = (niveau: any) => {
    setSelectedNiveau(niveau);
    setOpenNiveauDetailDrawer(true);
  };

  const handleCloseNiveauAddDialog = () => {
    setOpenNiveauAddDialog(false);
  };

  const handleCloseNiveauEditDialog = () => {
    setOpenNiveauEditDialog(false);
    setSelectedNiveau(null);
  };

  const handleCloseNiveauDeleteDialog = () => {
    setOpenNiveauDeleteDialog(false);
    setSelectedNiveau(null);
  };

  const handleCloseNiveauDetailDrawer = () => {
    setOpenNiveauDetailDrawer(false);
    setSelectedNiveau(null);
  };

  const handleDeleteNiveauRows = async (selectedRows: string[]) => {
    // Here you would implement the logic to delete multiple rows
    console.log('Deleting niveaux rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchNiveaux();
  };

  // ---- Matiere handler functions ----
  const handleMatiereAddClick = () => {
    setOpenMatiereAddDialog(true);
  };

  const handleMatiereEditClick = (matiere: any) => {
    setSelectedMatiere(matiere);
    setOpenMatiereEditDialog(true);
  };

  const handleMatiereDeleteClick = (matiere: any) => {
    setSelectedMatiere(matiere);
    setOpenMatiereDeleteDialog(true);
  };

  const handleMatiereViewClick = (matiere: any) => {
    setSelectedMatiere(matiere);
    setOpenMatiereDetailDrawer(true);
  };

  const handleCloseMatiereAddDialog = () => {
    setOpenMatiereAddDialog(false);
  };

  const handleCloseMatiereEditDialog = () => {
    setOpenMatiereEditDialog(false);
    setSelectedMatiere(null);
  };

  const handleCloseMatiereDeleteDialog = () => {
    setOpenMatiereDeleteDialog(false);
    setSelectedMatiere(null);
  };

  const handleCloseMatiereDetailDrawer = () => {
    setOpenMatiereDetailDrawer(false);
    setSelectedMatiere(null);
  };

  const handleDeleteMatiereRows = async (selectedRows: string[]) => {
    // Here you would implement the logic to delete multiple matieres
    console.log('Deleting matieres rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchMatieres();
  };

  // ---- Chapitre handler functions ----
  const handleChapitreAddClick = () => {
    setOpenChapitreAddDialog(true);
  };

  const handleChapitreEditClick = (chapitre: any) => {
    setSelectedChapitre(chapitre);
    setOpenChapitreEditDialog(true);
  };

  const handleChapitreDeleteClick = (chapitre: any) => {
    setSelectedChapitre(chapitre);
    setOpenChapitreDeleteDialog(true);
  };

  const handleChapitreViewClick = (chapitre: any) => {
    setSelectedChapitre(chapitre);
    setOpenChapitreDetailDrawer(true);
  };

  const handleCloseChapitreAddDialog = () => {
    setOpenChapitreAddDialog(false);
  };

  const handleCloseChapitreEditDialog = () => {
    setOpenChapitreEditDialog(false);
    setSelectedChapitre(null);
  };

  const handleCloseChapitreDeleteDialog = () => {
    setOpenChapitreDeleteDialog(false);
    setSelectedChapitre(null);
  };

  const handleCloseChapitreDetailDrawer = () => {
    setOpenChapitreDetailDrawer(false);
    setSelectedChapitre(null);
  };

  const handleDeleteChapitreRows = async (selectedRows: string[]) => {
    // Here you would implement the logic to delete multiple chapitres
    console.log('Deleting chapitres rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchChapitres();
  };

  // ---- Exercice handler functions ----
  const handleExerciceAddClick = () => {
    setOpenExerciceAddDialog(true);
  };

  const handleExerciceEditClick = (exercice: any) => {
    setSelectedExercice(exercice);
    setOpenExerciceEditDialog(true);
  };

  const handleExerciceDeleteClick = (exercice: any) => {
    setSelectedExercice(exercice);
    setOpenExerciceDeleteDialog(true);
  };

  const handleExerciceViewClick = (exercice: any) => {
    setSelectedExercice(exercice);
    setOpenExerciceDetailDrawer(true);
  };

  const handleCloseExerciceAddDialog = () => {
    setOpenExerciceAddDialog(false);
  };

  const handleCloseExerciceEditDialog = () => {
    setOpenExerciceEditDialog(false);
    setSelectedExercice(null);
  };

  const handleCloseExerciceDeleteDialog = () => {
    setOpenExerciceDeleteDialog(false);
    setSelectedExercice(null);
  };

  const handleCloseExerciceDetailDrawer = () => {
    setOpenExerciceDetailDrawer(false);
    setSelectedExercice(null);
  };

  const handleDeleteExerciceRows = async (selectedRows: string[]) => {
    // Here you would implement the logic to delete multiple exercices
    console.log('Deleting exercices rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchExercices();
  };

  // ---- Render functions ----
  const renderBreadcrumbs = () => {
    switch (currentView) {
      case 'niveaux':
        return (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Typography color="text.primary">Niveaux d&apos;enseignement</Typography>
          </Breadcrumbs>
        );

      case 'matieres':
        return (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link
              component="button"
              color="inherit"
              onClick={navigateToNiveaux}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={{ marginRight: '4px' }} />
              Niveaux d&apos;enseignement
            </Link>
            <Typography color="text.primary">{currentNiveauName}</Typography>
          </Breadcrumbs>
        );

      case 'chapitres':
        return (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link
              component="button"
              color="inherit"
              onClick={navigateToNiveaux}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              Niveaux d&apos;enseignement
            </Link>
            <Link
              component="button"
              color="inherit"
              onClick={() =>
                currentNiveauId &&
                navigateToMatieres({ id: currentNiveauId, nom: currentNiveauName })
              }
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {currentNiveauName}
            </Link>
            <Typography color="text.primary">{currentMatiereName}</Typography>
          </Breadcrumbs>
        );

      case 'exercices':
        return (
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
            <Link
              component="button"
              color="inherit"
              onClick={navigateToNiveaux}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              Niveaux d&apos;enseignement
            </Link>
            <Link
              component="button"
              color="inherit"
              onClick={() =>
                currentNiveauId &&
                navigateToMatieres({ id: currentNiveauId, nom: currentNiveauName })
              }
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {currentNiveauName}
            </Link>
            <Link
              component="button"
              color="inherit"
              onClick={() =>
                currentMatiereId &&
                navigateToChapitres({ id: currentMatiereId, nom: currentMatiereName })
              }
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              {currentMatiereName}
            </Link>
            <Typography color="text.primary">{currentChapitreName}</Typography>
          </Breadcrumbs>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'niveaux':
        return (
          <>
            <PageHeader
              title="Niveaux d'enseignement"
              actionLabel="+ Ajouter un niveau"
              onActionClick={handleNiveauAddClick}
            />

            {niveauxError && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography color="error">{niveauxError}</Typography>
              </Box>
            )}

            <NiveauList
              niveaux={niveaux}
              loading={niveauxLoading}
              pagination={niveauxPagination}
              filters={niveauxFilters}
              onPageChange={handleNiveauPageChange}
              onLimitChange={handleNiveauLimitChange}
              onSearchChange={handleNiveauSearch}
              onEditClick={handleNiveauEditClick}
              onDeleteClick={handleNiveauDeleteClick}
              onViewClick={handleNiveauViewClick}
              onDeleteRows={handleDeleteNiveauRows}
              onViewMatieres={navigateToMatieres}
            />

            {/* Niveau dialogs and drawers */}
            <NiveauDialog
              open={openNiveauAddDialog}
              onClose={handleCloseNiveauAddDialog}
              onSubmit={() => {
                handleCloseNiveauAddDialog();
                refetchNiveaux();
              }}
            />

            {selectedNiveau && (
              <>
                <NiveauDialog
                  open={openNiveauEditDialog}
                  onClose={handleCloseNiveauEditDialog}
                  niveau={selectedNiveau}
                  onSubmit={() => {
                    handleCloseNiveauEditDialog();
                    refetchNiveaux();
                  }}
                />

                <NiveauDeleteDialog
                  open={openNiveauDeleteDialog}
                  onClose={handleCloseNiveauDeleteDialog}
                  onSubmit={() => {
                    handleCloseNiveauDeleteDialog();
                    refetchNiveaux();
                  }}
                  niveau={selectedNiveau}
                />

                <NiveauDetailDrawer
                  open={openNiveauDetailDrawer}
                  onClose={handleCloseNiveauDetailDrawer}
                  niveau={selectedNiveau}
                  onEdit={() => {
                    handleCloseNiveauDetailDrawer();
                    handleNiveauEditClick(selectedNiveau);
                  }}
                  onDelete={() => {
                    handleCloseNiveauDetailDrawer();
                    handleNiveauDeleteClick(selectedNiveau);
                  }}
                  onViewMatieres={() => {
                    handleCloseNiveauDetailDrawer();
                    navigateToMatieres(selectedNiveau);
                  }}
                />
              </>
            )}
          </>
        );

      case 'matieres':
        return (
          <>
            <PageHeader
              title={`Matières pour ${currentNiveauName}`}
              actionLabel="+ Ajouter une matière"
              onActionClick={handleMatiereAddClick}
            />

            {matieresError && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography color="error">{matieresError}</Typography>
              </Box>
            )}

            <MatiereList
              matieres={matieres}
              loading={matieresLoading}
              pagination={matieresPagination}
              filters={matieresFilters}
              onPageChange={handleMatierePageChange}
              onLimitChange={handleMatiereLimitChange}
              onSearchChange={handleMatiereSearch}
              onEditClick={handleMatiereEditClick}
              onDeleteClick={handleMatiereDeleteClick}
              onViewClick={handleMatiereViewClick}
              onDeleteRows={handleDeleteMatiereRows}
              onViewChapitres={navigateToChapitres}
            />

            {/* Matiere dialogs and drawers */}
            <MatiereDialog
              open={openMatiereAddDialog}
              onClose={handleCloseMatiereAddDialog}
              onSubmit={() => {
                handleCloseMatiereAddDialog();
                refetchMatieres();
              }}
              niveauId={currentNiveauId || ''}
            />

            {selectedMatiere && (
              <>
                <MatiereDialog
                  open={openMatiereEditDialog}
                  onClose={handleCloseMatiereEditDialog}
                  matiere={selectedMatiere}
                  onSubmit={() => {
                    handleCloseMatiereEditDialog();
                    refetchMatieres();
                  }}
                  niveauId={currentNiveauId || ''}
                />

                <MatiereDeleteDialog
                  open={openMatiereDeleteDialog}
                  onClose={handleCloseMatiereDeleteDialog}
                  onSubmit={() => {
                    handleCloseMatiereDeleteDialog();
                    refetchMatieres();
                  }}
                  matiere={selectedMatiere}
                />

                <MatiereDetailDrawer
                  open={openMatiereDetailDrawer}
                  onClose={handleCloseMatiereDetailDrawer}
                  matiere={selectedMatiere}
                  onEdit={() => {
                    handleCloseMatiereDetailDrawer();
                    handleMatiereEditClick(selectedMatiere);
                  }}
                  onDelete={() => {
                    handleCloseMatiereDetailDrawer();
                    handleMatiereDeleteClick(selectedMatiere);
                  }}
                  onViewChapitres={() => {
                    handleCloseMatiereDetailDrawer();
                    navigateToChapitres(selectedMatiere);
                  }}
                />
              </>
            )}
          </>
        );

      case 'chapitres':
        return (
          <>
            <PageHeader
              title={`Chapitres de ${currentMatiereName}`}
              actionLabel="+ Ajouter un chapitre"
              onActionClick={handleChapitreAddClick}
            />

            {chapitresError && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography color="error">{chapitresError}</Typography>
              </Box>
            )}

            <ChapitreList
              chapitres={chapitres}
              loading={chapitresLoading}
              pagination={chapitresPagination}
              filters={chapitresFilters}
              onPageChange={handleChapitrePageChange}
              onLimitChange={handleChapitreLimitChange}
              onSearchChange={handleChapitreSearch}
              onEditClick={handleChapitreEditClick}
              onDeleteClick={handleChapitreDeleteClick}
              onViewClick={handleChapitreViewClick}
              onDeleteRows={handleDeleteChapitreRows}
              onViewExercices={navigateToExercices}
            />

            {/* Chapitre dialogs and drawers */}
            <ChapitreDialog
              open={openChapitreAddDialog}
              onClose={handleCloseChapitreAddDialog}
              onSubmit={() => {
                handleCloseChapitreAddDialog();
                refetchChapitres();
              }}
              matiereId={currentMatiereId || ''}
            />

            {selectedChapitre && (
              <>
                <ChapitreDialog
                  open={openChapitreEditDialog}
                  onClose={handleCloseChapitreEditDialog}
                  chapitre={selectedChapitre}
                  onSubmit={() => {
                    handleCloseChapitreEditDialog();
                    refetchChapitres();
                  }}
                  matiereId={currentMatiereId || ''}
                />

                <ChapitreDeleteDialog
                  open={openChapitreDeleteDialog}
                  onClose={handleCloseChapitreDeleteDialog}
                  onSubmit={() => {
                    handleCloseChapitreDeleteDialog();
                    refetchChapitres();
                  }}
                  chapitre={selectedChapitre}
                />

                <ChapitreDetailDrawer
                  open={openChapitreDetailDrawer}
                  onClose={handleCloseChapitreDetailDrawer}
                  chapitre={selectedChapitre}
                  onEdit={() => {
                    handleCloseChapitreDetailDrawer();
                    handleChapitreEditClick(selectedChapitre);
                  }}
                  onDelete={() => {
                    handleCloseChapitreDetailDrawer();
                    handleChapitreDeleteClick(selectedChapitre);
                  }}
                  onViewExercices={() => {
                    handleCloseChapitreDetailDrawer();
                    navigateToExercices(selectedChapitre);
                  }}
                />
              </>
            )}
          </>
        );

      case 'exercices':
        return (
          <>
            <PageHeader
              title={`Exercices de ${currentChapitreName}`}
              actionLabel="+ Ajouter un exercice"
              onActionClick={handleExerciceAddClick}
            />

            {exercicesError && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography color="error">{exercicesError}</Typography>
              </Box>
            )}

            <ExerciceList
              exercices={exercices}
              loading={exercicesLoading}
              pagination={exercicesPagination}
              filters={exercicesFilters}
              onPageChange={handleExercicePageChange}
              onLimitChange={handleExerciceLimitChange}
              onSearchChange={handleExerciceSearch}
              onEditClick={handleExerciceEditClick}
              onDeleteClick={handleExerciceDeleteClick}
              onViewClick={handleExerciceViewClick}
              onDeleteRows={handleDeleteExerciceRows}
            />

            {/* Exercice dialogs and drawers */}
            <ExerciceDialog
              open={openExerciceAddDialog}
              onClose={handleCloseExerciceAddDialog}
              onSubmit={() => {
                handleCloseExerciceAddDialog();
                refetchExercices();
              }}
              chapitreId={currentChapitreId || ''}
            />

            {selectedExercice && (
              <>
                <ExerciceDialog
                  open={openExerciceEditDialog}
                  onClose={handleCloseExerciceEditDialog}
                  exercice={selectedExercice}
                  onSubmit={() => {
                    handleCloseExerciceEditDialog();
                    refetchExercices();
                  }}
                  chapitreId={currentChapitreId || ''}
                />

                <ExerciceDeleteDialog
                  open={openExerciceDeleteDialog}
                  onClose={handleCloseExerciceDeleteDialog}
                  onSubmit={() => {
                    handleCloseExerciceDeleteDialog();
                    refetchExercices();
                  }}
                  exercice={selectedExercice}
                />

                <ExerciceDetailDrawer
                  open={openExerciceDetailDrawer}
                  onClose={handleCloseExerciceDetailDrawer}
                  exercice={selectedExercice}
                  onEdit={() => {
                    handleCloseExerciceDetailDrawer();
                    handleExerciceEditClick(selectedExercice);
                  }}
                  onDelete={() => {
                    handleCloseExerciceDetailDrawer();
                    handleExerciceDeleteClick(selectedExercice);
                  }}
                />
              </>
            )}
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Container maxWidth={false}>
      {renderBreadcrumbs()}
      {renderContent()}
    </Container>
  );
};
