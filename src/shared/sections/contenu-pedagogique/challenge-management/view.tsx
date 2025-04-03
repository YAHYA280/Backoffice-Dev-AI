'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@mui/material';

import { useChallenges } from './hooks/useChallenge';
import { ChallengeList } from './components/ChallengeList';
import { ChallengeDetailDrawer } from './components/ChallengeDetailDrawer';
import { ChallengeDeleteDialog } from './components/ChallengeDeleteDialog';

import type { Challenge } from './types';

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

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedChallenge(null);
  };

  const handleCloseDetailDrawer = () => {
    setOpenDetailDrawer(false);
    setSelectedChallenge(null);
  };

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

      {selectedChallenge ? (
        <>
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
