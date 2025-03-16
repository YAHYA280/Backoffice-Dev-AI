'use client';

import { useState } from 'react';

import { Container, Typography } from '@mui/material';

// Import le hook pour gérer les challenges
import { useChallenges } from './hooks/useChallenge';
// Import les composants
import { ChallengeList } from './components/ChallengeList';
import { ChallengeDialog } from './components/ChallengeDialog';
import { ChallengeDetailDrawer } from './components/ChallengeDetailDrawer';
import { ChallengeDeleteDialog } from './components/ChallengeDeleteDialog';

// Définissez quelques données de test pour les niveaux et matières
const MOCK_NIVEAUX = [
  { id: '1', nom: 'CP1 - Cours Préparatoire 1' },
  { id: '2', nom: 'CP2 - Cours Préparatoire 2' },
  { id: '3', nom: 'CE1 - Cours Élémentaire 1' },
  { id: '4', nom: 'CE2 - Cours Élémentaire 2' },
  { id: '5', nom: 'CM1 - Cours Moyen 1' },
  { id: '6', nom: 'CM2 - Cours Moyen 2' },
];

const MOCK_MATIERES = [
  { id: '1-1', nom: 'Mathématiques (CP1)' },
  { id: '1-2', nom: 'Français (CP1)' },
  { id: '2-1', nom: 'Mathématiques (CP2)' },
  { id: '2-2', nom: 'Français (CP2)' },
  { id: '3-1', nom: 'Mathématiques (CE1)' },
  { id: '3-2', nom: 'Français (CE1)' },
];

interface ChallengesManagementViewProps {
  title?: string;
}

export function ChallengesManagementView({
  title = 'Gestion des challenges',
}: ChallengesManagementViewProps) {
  // Utiliser le hook pour obtenir les challenges
  const {
    challenges,
    loading,
    pagination,
    filters,
    selectedChallenge,
    setSelectedChallenge,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleColumnFilterChange,
    handleToggleActive,
    handleDeleteChallenge,
    handleDeleteMultipleChallenges,
    refetch,
  } = useChallenges();

  // États pour les dialogues et tiroirs
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);

  // Gestionnaires pour les événements de l'interface utilisateur
  const handleAddClick = () => {
    setOpenAddDialog(true);
  };

  const handleEditClick = (challenge: any) => {
    setSelectedChallenge(challenge);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (challenge: any) => {
    setSelectedChallenge(challenge);
    setOpenDeleteDialog(true);
  };

  const handleViewClick = (challenge: any) => {
    setSelectedChallenge(challenge);
    setOpenDetailDrawer(true);
  };

  // Gestionnaires pour fermer les dialogues et tiroirs
  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedChallenge(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedChallenge(null);
  };

  const handleCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setSelectedChallenge(null);
  };

  // Gestionnaires pour les actions de soumission
  const handleSubmitAdd = (data: any) => {
    console.log('Adding new challenge:', data);
    handleCloseAddDialog();
    refetch();
  };

  const handleSubmitEdit = (data: any) => {
    console.log('Editing challenge:', data);
    handleCloseEditDialog();
    refetch();
  };

  const handleSubmitDelete = () => {
    if (selectedChallenge) {
      console.log('Deleting challenge:', selectedChallenge.id);
      handleDeleteChallenge(selectedChallenge.id);
    }
    handleCloseDeleteDialog();
  };

  const handleDeleteRows = (selectedRows: string[]) => {
    console.log('Deleting multiple challenges:', selectedRows);
    handleDeleteMultipleChallenges(selectedRows);
  };

  return (
    <Container maxWidth={false}>
      {/* Liste des challenges */}
      <ChallengeList
        challenges={challenges}
        loading={loading}
        pagination={pagination}
        filters={filters}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        onSearchChange={handleSearch}
        onColumnFilterChange={handleColumnFilterChange}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
        onViewClick={handleViewClick}
        onDeleteRows={handleDeleteRows}
        onAddClick={handleAddClick}
        onToggleActive={handleToggleActive}
      />

      {/* Dialogue d'ajout */}
      <ChallengeDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleSubmitAdd}
        niveaux={MOCK_NIVEAUX}
        matieres={MOCK_MATIERES}
      />

      {/* Dialogue d'édition */}
      {selectedChallenge && (
        <>
          <ChallengeDialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            onSubmit={handleSubmitEdit}
            challenge={selectedChallenge}
            niveaux={MOCK_NIVEAUX}
            matieres={MOCK_MATIERES}
          />

          {/* Dialogue de suppression */}
          <ChallengeDeleteDialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
            onSubmit={handleSubmitDelete}
            challenge={selectedChallenge}
          />

          {/* Tiroir de détails */}
          <ChallengeDetailDrawer
            open={openDetailDrawer}
            onClose={handleCloseDetailDrawer}
            challenge={selectedChallenge}
            onToggleActive={handleToggleActive}
          />
        </>
      )}
    </Container>
  );
}
