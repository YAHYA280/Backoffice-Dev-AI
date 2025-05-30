'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Box, Container, Typography } from '@mui/material';

// Import hooks
import useNiveauxHooks from './hooks/useNiveaux';
import { useMatieres } from './hooks/useMatieres';
import { useChapitres } from './hooks/useChapitres';
import { useExercices } from './hooks/useExercices';
// Import Niveau components
import { NiveauList } from './components/niveau/NiveauList';
// Import Matiere components
import { MatiereList } from './components/matiere/MatiereList';
import { NiveauDialog } from './components/niveau/NiveauDialog';
// Import Chapitre components
import { ChapitreList } from './components/chapitre/ChapitreList';
import ChapitreDialog from './components/chapitre/ChapitreDialog';
// Import Exercice components
import { ExerciceList } from './components/exercice/ExerciceList';
import ExerciceDialog from './components/exercice/ExerciceDialog';
import { MatiereDialog } from './components/matiere/MatiereDialog';
import NiveauDeleteDialog from './components/niveau/NiveauDeleteDialog';
import NiveauDetailDrawer from './components/niveau/NiveauDetailDrawer';
import MatiereDeleteDialog from './components/matiere/MatiereDeleteDialog';
import MatiereDetailDrawer from './components/matiere/MatiereDetailDrawer';
import ChapitreDeleteDialog from './components/chapitre/ChapitreDeleteDialog';
import ChapitreDetailDrawer from './components/chapitre/ChapitreDetailDrawer';
import ExerciceDeleteDialog from './components/exercice/ExerciceDeleteDialog';
import ExerciceDetailDrawer from './components/exercice/ExerciceDetailDrawer';

export const ApprentissageView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const viewParam = searchParams.get('view');
    const niveauIdParam = searchParams.get('niveauId');
    const niveauNomParam = searchParams.get('niveauNom');
    const matiereIdParam = searchParams.get('matiereId');
    const matiereNomParam = searchParams.get('matiereNom');
    const chapitreIdParam = searchParams.get('chapitreId');
    const chapitreNomParam = searchParams.get('chapitreNom');

    if (viewParam && ['niveaux', 'matieres', 'chapitres', 'exercices'].includes(viewParam)) {
      setCurrentView(viewParam as any);
    }

    if (niveauIdParam) {
      setCurrentNiveauId(niveauIdParam);
      setCurrentNiveauName(niveauNomParam || null);
    }

    if (matiereIdParam) {
      setCurrentMatiereId(matiereIdParam);
      setCurrentMatiereName(matiereNomParam || null);
    }

    if (chapitreIdParam) {
      setCurrentChapitreId(chapitreIdParam);
      setCurrentChapitreName(chapitreNomParam || null);
    }
  }, [searchParams]);
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
    // If niveau is provided, use it; otherwise use the previously selected niveau
    const niveauToDelete = niveau || selectedNiveau;
    setSelectedNiveau(niveauToDelete);
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
  const handleAddClick = () => {
    // This is essentially an alias for handleNiveauAddClick
    handleNiveauAddClick();
  };

  const handleToggleActive = async (niveau: any, active: boolean) => {
    try {
      //  API function to toggle the active status, call it here

      console.log(`Toggling active status for niveau ${niveau.nom} to ${active}`);

      if (selectedNiveau && selectedNiveau.id === niveau.id) {
        setSelectedNiveau({
          ...selectedNiveau,
          active,
        });
      }

      // Refresh the list to show updated data
      refetchNiveaux();
    } catch (error) {
      console.error('Error toggling niveau active status:', error);

      // Refresh data to ensure UI consistency
      refetchNiveaux();
    }
  };
  const handleDeleteNiveauRows = async (selectedRows: string[]) => {
    //  implement the logic to delete multiple rows
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
    //  implement the logic to delete multiple matieres
    console.log('Deleting matieres rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchMatieres();
  };

  // handle Active and desactive for matier
  const handleToggleActiveMatiere = async (matiere: any, active: boolean) => {
    try {
      //  API function to toggle the active status, here

      console.log(`Toggling active status for matiere ${matiere.nom} to ${active}`);

      if (selectedMatiere && selectedMatiere.id === matiere.id) {
        setSelectedMatiere({
          ...selectedMatiere,
          active,
        });
      }

      // Refresh the list to show updated data
      refetchMatieres();
    } catch (error) {
      console.error('Error toggling matiere active status:', error);

      // Refresh data to ensure UI consistency
      refetchMatieres();
    }
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
    // implement the logic to delete multiple chapitres
    console.log('Deleting chapitres rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchChapitres();
  };

  // Handle active desactive here

  const handleToggleActiveChapitre = async (chapitre: any, active: boolean) => {
    try {
      //  API function to toggle the active status,  here

      console.log(`Toggling active status for chapitre ${chapitre.nom} to ${active}`);

      if (selectedChapitre && selectedChapitre.id === chapitre.id) {
        setSelectedChapitre({
          ...selectedChapitre,
          active,
        });
      }

      // Refresh the list to show updated data
      refetchChapitres();
    } catch (error) {
      console.error('Error toggling chapitre active status:', error);

      // Refresh data to ensure UI consistency
      refetchChapitres();
    }
  };

  // ---- Exercice handler functions ----
  const handleExerciceAddClick = () => {
    // Navigate to the new page with all necessary parameters
    const params = new URLSearchParams({
      chapitreId: currentChapitreId || '',
      chapitreNom: currentChapitreName || '',
      matiereId: currentMatiereId || '',
      matiereNom: currentMatiereName || '',
      niveauId: currentNiveauId || '',
      niveauNom: currentNiveauName || '',
    });

    router.push(`/dashboard/contenu-pedagogique/apprentissage/exercices/new?${params.toString()}`);
  };

  const handleExerciceEditClick = (exercice: any) => {
    const params = new URLSearchParams({
      chapitreId: currentChapitreId || '',
      chapitreNom: currentChapitreName || '',
      matiereId: currentMatiereId || '',
      matiereNom: currentMatiereName || '',
      niveauId: currentNiveauId || '',
      niveauNom: currentNiveauName || '',
    });

    router.push(
      `/dashboard/contenu-pedagogique/apprentissage/exercices/${exercice.id}/edit?${params.toString()}`
    );
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
    // implement the logic to delete multiple exercices
    console.log('Deleting exercices rows:', selectedRows);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Refresh data
    refetchExercices();
  };

  // Hnadle active change

  const handleToggleActiveExercice = async (exercice: any, active: boolean) => {
    try {
      // API function to toggle the active status, here

      console.log(`Toggling active status for exercice ${exercice.titre} to ${active}`);

      if (selectedExercice && selectedExercice.id === exercice.id) {
        setSelectedExercice({
          ...selectedExercice,
          // For exercices, the status should be either "Publié" (when active) or "Inactif" (when inactive)
          statut: active ? 'Publié' : 'Inactif',
        });
      }

      // Refresh the list to show updated data
      refetchExercices();
    } catch (error) {
      console.error('Error toggling exercice active status:', error);

      // Refresh data to ensure UI consistency
      refetchExercices();
    }
  };

  // ---- Render content function ----

  const renderContent = () => {
    switch (currentView) {
      case 'niveaux':
        return (
          <>
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
              onAddClick={handleAddClick}
              onToggleActive={handleToggleActive}
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
              onAddClick={handleMatiereAddClick}
              onToggleActive={handleToggleActiveMatiere}
              // Pass breadcrumb props
              breadcrumbs={{
                currentNiveauId,
                currentNiveauName,
                navigateToNiveaux,
              }}
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
              onAddClick={handleChapitreAddClick}
              onToggleActive={handleToggleActiveChapitre}
              // Pass breadcrumb props
              breadcrumbs={{
                currentNiveauId,
                currentNiveauName,
                currentMatiereId,
                currentMatiereName,
                navigateToNiveaux,
                navigateToMatieres,
              }}
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
              onEditClick={handleExerciceEditClick}
              onDeleteClick={handleExerciceDeleteClick}
              onViewClick={handleExerciceViewClick}
              onDeleteRows={handleDeleteExerciceRows}
              onAddClick={handleExerciceAddClick}
              onToggleActive={handleToggleActiveExercice}
              // Pass breadcrumb props
              breadcrumbs={{
                currentNiveauId,
                currentNiveauName,
                currentMatiereId,
                currentMatiereName,
                currentChapitreId,
                currentChapitreName,
                navigateToNiveaux,
                navigateToMatieres,
                navigateToChapitres,
              }}
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
    <Container 
      maxWidth={false} 
      sx={{ 
        mx: '10%', 
        width: '96%', 
        marginLeft: 'auto', 
        marginRight: 'auto' 
      }}
    >
      {renderContent()}
    </Container>
  );
};
