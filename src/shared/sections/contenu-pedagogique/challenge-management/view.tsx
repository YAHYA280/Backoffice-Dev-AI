'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@mui/material';

import { useChallenges } from './hooks/useChallenge';
import { ChallengeList } from './components/ChallengeList';
import { ChallengeDetailDrawer } from './components/ChallengeDetailDrawer';
import { ChallengeDeleteDialog } from './components/ChallengeDeleteDialog';

import type { Challenge } from './types';

// Keep the mock data for reference, might be needed in other components
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
  const router = useRouter();

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

  // Remove dialog states that we no longer need
  // const [openAddDialog, setOpenAddDialog] = useState(false);
  // const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);

  const handleAddClick = () => {
    // Navigate to the new challenge page instead of opening a dialog
    router.push('/dashboard/contenu-pedagogique/challenges/new');
  };

  const handleEditClick = (challenge: Challenge) => {
    // Navigate to the edit challenge page instead of opening a dialog
    router.push(`/dashboard/contenu-pedagogique/challenges/${challenge.id}/edit`);
  };

  const handleDeleteClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setOpenDeleteDialog(true);
  };

  const handleViewClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setOpenDetailDrawer(true);
  };

  // Remove handlers for dialog states we no longer need
  // const handleCloseAddDialog = () => {
  //   setOpenAddDialog(false);
  // };

  // const handleCloseEditDialog = () => {
  //   setOpenEditDialog(false);
  //   setSelectedChallenge(null);
  // };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedChallenge(null);
  };

  const handleCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setSelectedChallenge(null);
  };

  // We no longer need these handlers as they're moved to their respective pages
  // const handleSubmitAdd = async (data: Partial<Challenge>) => {
  //   console.log('Adding new challenge:', data);
  //   await handleAddChallenge(data);
  //   handleCloseAddDialog();
  //   refetch();
  // };

  // const handleSubmitEdit = async (data: Partial<Challenge>) => {
  //   console.log('Editing challenge:', data);
  //   if (selectedChallenge) {
  //     await handleUpdateChallenge(selectedChallenge.id, data);
  //   }
  //   handleCloseEditDialog();
  //   refetch();
  // };

  const handleSubmitDelete = async () => {
    if (selectedChallenge) {
      console.log('Deleting challenge:', selectedChallenge.id);
      await handleDeleteChallenge(selectedChallenge.id);
    }
    handleCloseDeleteDialog();
  };

  const handleDeleteRows = async (selectedRows: string[]) => {
    console.log('Deleting multiple challenges:', selectedRows);
    await handleDeleteMultipleChallenges(selectedRows);
  };

  return (
    <Container maxWidth={false}>
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

      {/* Remove the ChallengeDialog components as we no longer need them */}
      {/* <ChallengeDialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        onSubmit={handleSubmitAdd}
        niveaux={MOCK_NIVEAUX}
        matieres={MOCK_MATIERES}
      /> */}

      {selectedChallenge ? (
        <>
          {/* <ChallengeDialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            onSubmit={handleSubmitEdit}
            challenge={selectedChallenge}
            niveaux={MOCK_NIVEAUX}
            matieres={MOCK_MATIERES}
          /> */}

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
      ) : (
        <></>
      )}
    </Container>
  );
}
