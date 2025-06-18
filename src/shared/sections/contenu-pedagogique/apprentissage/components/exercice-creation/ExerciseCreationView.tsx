// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Alert } from '@mui/material';

import { useExerciseCreation } from './hooks/useExerciseCreation';
import CreationLayout from './components/shared/CreationLayout';
import ModeSelector from './components/mode-selector/ModeSelector';
import ExercisePreview from './components/preview/ExercisePreview';

// Import form components
import AiForm from './components/ai/AiForm';
import ManualForm from './components/manual/ManualForm';

import type { Exercise, CreationMode } from './types/exercise-types';

interface ExerciseCreationViewProps {
  chapitreId?: string;
  chapitreNom?: string;
  matiereId?: string;
  matiereNom?: string;
  niveauId?: string;
  niveauNom?: string;
  exerciseId?: string;
  initialMode?: CreationMode;
}

const ExerciseCreationView: React.FC<ExerciseCreationViewProps> = ({
  chapitreId = '',
  chapitreNom = '',
  matiereId = '',
  matiereNom = '',
  niveauId = '',
  niveauNom = '',
  exerciseId,
  initialMode,
}) => {
  const router = useRouter();

  // Simple state management
  const [selectedMode, setSelectedMode] = useState<CreationMode | null>(initialMode || null);
  const [createdExercise, setCreatedExercise] = useState<Exercise | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(!initialMode && !exerciseId);
  const [showPreview, setShowPreview] = useState(false);

  const isEditing = Boolean(exerciseId);

  // Exercise creation hook - MUST be called before any conditional returns
  const {
    currentStep,
    formData,
    aiState,
    isLoading,
    isSaving,
    errors,
    nextStep,
    prevStep,
    goToStep,
    updateFormData,
    generateWithAI,
    saveExercise,
    validateCurrentStep,
    canGoNext,
    canGoPrev,
    isLastStep,
    totalSteps,
  } = useExerciseCreation({
    initialMode: selectedMode || 'manual',
    chapitreId,
    onSuccess: (exercise) => {
      setCreatedExercise(exercise);
      setShowPreview(true);
    },
    onError: (error) => {
      console.error('Exercise creation error:', error);
    },
  });

  // Navigation function
  const navigateToExerciseList = () => {
    const params = new URLSearchParams();
    if (chapitreId) params.set('chapitreId', chapitreId);
    if (chapitreNom) params.set('chapitreNom', chapitreNom);
    if (matiereId) params.set('matiereId', matiereId);
    if (matiereNom) params.set('matiereNom', matiereNom);
    if (niveauId) params.set('niveauId', niveauId);
    if (niveauNom) params.set('niveauNom', niveauNom);
    params.set('view', 'exercices');

    router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
  };

  // Early return if no chapitreId for new exercises
  if (!chapitreId && !isEditing) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">
          Chapitre ID manquant. Redirection vers la liste des exercices...
        </Alert>
      </Box>
    );
  }

  // Event handlers
  const handleModeSelect = (mode: CreationMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);
  };

  const handleBack = () => {
    if (selectedMode && !createdExercise) {
      setSelectedMode(null);
      setShowModeSelector(true);
    } else {
      navigateToExerciseList();
    }
  };

  const handlePreview = () => {
    if (createdExercise) {
      setShowPreview(true);
    }
  };

  const handleEditFromPreview = () => {
    setShowPreview(false);
  };

  const handleSaveFromPreview = () => {
    setShowPreview(false);
    navigateToExerciseList();
  };

  // Breadcrumbs
  const breadcrumbs = [
    {
      label: 'Niveaux',
      onClick: () => router.push('/dashboard/contenu-pedagogique/apprentissage'),
    },
    ...(niveauId && niveauNom
      ? [
          {
            label: niveauNom,
            onClick: () => {
              const params = new URLSearchParams({
                view: 'matieres',
                niveauId,
                niveauNom,
              });
              router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
            },
          },
        ]
      : []),
    ...(matiereId && matiereNom
      ? [
          {
            label: matiereNom,
            onClick: () => {
              const params = new URLSearchParams({
                view: 'chapitres',
                matiereId,
                matiereNom,
                niveauId: niveauId || '',
                niveauNom: niveauNom || '',
              });
              router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
            },
          },
        ]
      : []),
    ...(chapitreId && chapitreNom
      ? [
          {
            label: chapitreNom,
            onClick: navigateToExerciseList,
          },
        ]
      : []),
    {
      label: isEditing ? "Modifier l'exercice" : 'Nouvel exercice',
      onClick: undefined,
    },
  ];

  // Title and subtitle
  const getTitle = () => {
    if (isEditing) return "Modifier l'exercice";
    if (!selectedMode) return 'Créer un exercice';
    return selectedMode === 'ai' ? "Création avec l'IA" : 'Création manuelle';
  };

  const getSubtitle = () => {
    if (isEditing) return 'Modifiez les paramètres et le contenu de votre exercice';
    if (!selectedMode) return 'Choisissez votre méthode de création préférée';
    return selectedMode === 'ai'
      ? "Laissez l'IA générer un exercice personnalisé"
      : 'Créez votre exercice étape par étape';
  };

  // Render mode selector or form
  const renderContent = () => {
    // Show mode selector if no mode is selected
    if (!selectedMode) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            p: 4,
          }}
        >
          <Box>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ fontSize: '4rem', mb: 2 }}>🚀</Box>
              <Box sx={{ fontSize: '1.5rem', fontWeight: 'bold', mb: 2 }}>
                Créons votre exercice !
              </Box>
              <Box sx={{ color: 'text.secondary', mb: 4, maxWidth: 600 }}>
                Choisissez la méthode qui vous convient le mieux pour créer un exercice adapté à vos
                besoins pédagogiques.
              </Box>
            </Box>

            {/* Context info */}
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'grey.50',
                border: 1,
                borderColor: 'divider',
                maxWidth: 500,
                mx: 'auto',
                mb: 4,
              }}
            >
              <Box sx={{ fontWeight: 'medium', mb: 2 }}>📍 Contexte de création</Box>
              <Box sx={{ textAlign: 'left', fontSize: '0.875rem', color: 'text.secondary' }}>
                <Box>
                  <strong>Chapitre :</strong> {chapitreNom || 'Non défini'}
                </Box>
                <Box>
                  <strong>Matière :</strong> {matiereNom || 'Non définie'}
                </Box>
                <Box>
                  <strong>Niveau :</strong> {niveauNom || 'Non défini'}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }

    // Show form based on selected mode
    if (selectedMode === 'ai') {
      return (
        <AiForm
          chapitreId={chapitreId}
          formData={formData}
          aiState={aiState}
          errors={errors}
          currentStep={currentStep}
          totalSteps={totalSteps}
          canGoNext={canGoNext}
          canGoPrev={canGoPrev}
          isLastStep={isLastStep}
          onUpdateFormData={updateFormData}
          onNextStep={nextStep}
          onPrevStep={prevStep}
          onGoToStep={goToStep}
          onGenerateWithAI={generateWithAI}
          onSave={saveExercise}
          onCancel={handleBack}
        />
      );
    }

    return (
      <ManualForm
        chapitreId={chapitreId}
        formData={formData}
        errors={errors}
        currentStep={currentStep}
        totalSteps={totalSteps}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        isLastStep={isLastStep}
        isSaving={isSaving}
        onUpdateFormData={updateFormData}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        onGoToStep={goToStep}
        onSave={saveExercise}
        onCancel={handleBack}
      />
    );
  };

  return (
    <Box>
      <CreationLayout
        mode={selectedMode || 'manual'}
        title={getTitle()}
        subtitle={getSubtitle()}
        breadcrumbs={breadcrumbs}
        progress={selectedMode ? ((currentStep + 1) / totalSteps) * 100 : undefined}
        showProgress={!!selectedMode}
        actions={{
          onBack: handleBack,
          onPreview: createdExercise ? handlePreview : undefined,
          onCancel: navigateToExerciseList,
          canSave: !!createdExercise,
        }}
      >
        {renderContent()}
      </CreationLayout>

      {/* Mode Selector Dialog */}
      <ModeSelector
        open={showModeSelector}
        onClose={() => setShowModeSelector(false)}
        onModeSelect={handleModeSelect}
        selectedMode={selectedMode || undefined}
      />

      {/* Exercise Preview */}
      <ExercisePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        exercise={createdExercise}
        mode={selectedMode || 'manual'}
        onEdit={handleEditFromPreview}
        onSave={handleSaveFromPreview}
      />
    </Box>
  );
};

export default ExerciseCreationView;
