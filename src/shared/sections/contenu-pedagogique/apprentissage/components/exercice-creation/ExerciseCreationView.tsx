// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { m, AnimatePresence } from 'framer-motion';
import { Box, Alert, Snackbar, Fade } from '@mui/material';

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

  // UI State
  const [selectedMode, setSelectedMode] = useState<CreationMode | null>(initialMode || null);
  const [createdExercise, setCreatedExercise] = useState<Exercise | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(!initialMode && !exerciseId);
  const [showPreview, setShowPreview] = useState(false);

  // Notification state
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const isEditing = Boolean(exerciseId);

  // Enhanced exercise creation hook
  const {
    currentStep,
    formData,
    aiState,
    isLoading,
    isSaving,
    errors,
    warnings,
    hasUnsavedChanges,
    completedSteps,
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
    progressPercentage,
  } = useExerciseCreation({
    initialMode: selectedMode || 'manual',
    chapitreId,
    onSuccess: handleExerciseSuccess,
    onError: handleExerciseError,
  });

  // Success handler
  function handleExerciseSuccess(exercise: Exercise) {
    setCreatedExercise(exercise);
    setNotification({
      open: true,
      message: 'Exercice créé avec succès ! 🎉',
      severity: 'success',
    });

    // Auto-show preview after successful creation
    setTimeout(() => {
      setShowPreview(true);
    }, 1000);
  }

  // Error handler
  function handleExerciseError(error: string) {
    setNotification({
      open: true,
      message: error,
      severity: 'error',
    });
  }

  // Navigation function with enhanced URL management
  const navigateToExerciseList = useCallback(() => {
    const params = new URLSearchParams();
    if (chapitreId) params.set('chapitreId', chapitreId);
    if (chapitreNom) params.set('chapitreNom', chapitreNom);
    if (matiereId) params.set('matiereId', matiereId);
    if (matiereNom) params.set('matiereNom', matiereNom);
    if (niveauId) params.set('niveauId', niveauId);
    if (niveauNom) params.set('niveauNom', niveauNom);
    params.set('view', 'exercices');

    router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
  }, [router, chapitreId, chapitreNom, matiereId, matiereNom, niveauId, niveauNom]);

  // Enhanced validation for exercise creation
  useEffect(() => {
    if (!chapitreId && !isEditing) {
      setNotification({
        open: true,
        message: 'Chapitre manquant. Redirection vers la liste des exercices...',
        severity: 'error',
      });

      setTimeout(() => {
        navigateToExerciseList();
      }, 2000);
    }
  }, [chapitreId, isEditing, navigateToExerciseList]);

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue =
          'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Event handlers
  const handleModeSelect = useCallback((mode: CreationMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);

    setNotification({
      open: true,
      message: `Mode ${mode === 'ai' ? 'IA' : 'manuel'} sélectionné !`,
      severity: 'info',
    });
  }, []);

  const handleBack = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir revenir en arrière ?'
      );
      if (!confirmLeave) return;
    }

    if (selectedMode && !createdExercise) {
      setSelectedMode(null);
      setShowModeSelector(true);
    } else {
      navigateToExerciseList();
    }
  }, [selectedMode, createdExercise, hasUnsavedChanges, navigateToExerciseList]);

  const handlePreview = useCallback(() => {
    if (createdExercise) {
      setShowPreview(true);
    } else {
      // Create a preview exercise from current form data
      const previewExercise: Exercise = {
        id: 'preview',
        ...formData,
        mode: selectedMode || 'manual',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Exercise;

      setCreatedExercise(previewExercise);
      setShowPreview(true);
    }
  }, [createdExercise, formData, selectedMode]);

  const handleEditFromPreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleSaveFromPreview = useCallback(async () => {
    const success = await saveExercise();
    if (success) {
      setShowPreview(false);
      setTimeout(() => {
        navigateToExerciseList();
      }, 1500);
    }
  }, [saveExercise, navigateToExerciseList]);

  const handleCloseNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  // Early return for missing chapitreId
  if (!chapitreId && !isEditing) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Chapitre ID manquant. Redirection vers la liste des exercices...
        </Alert>
      </Box>
    );
  }

  // Breadcrumbs configuration
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

  // Dynamic title and subtitle
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Render main content
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
          <m.div variants={itemVariants} initial="hidden" animate="visible">
            <Box sx={{ maxWidth: 600, mx: 'auto' }}>
              <Box sx={{ fontSize: '4rem', mb: 3 }}>🎓</Box>
              <Box sx={{ fontSize: '1.75rem', fontWeight: 'bold', mb: 2, color: 'text.primary' }}>
                Prêt à créer un exercice exceptionnel ?
              </Box>
              <Box sx={{ color: 'text.secondary', mb: 4, fontSize: '1.1rem', lineHeight: 1.6 }}>
                Choisissez entre la <strong>création manuelle</strong> pour un contrôle total ou la{' '}
                <strong>génération IA</strong> pour gagner du temps tout en gardant la qualité.
              </Box>

              {/* Context info */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'primary.lighter',
                  border: 1,
                  borderColor: 'primary.light',
                  maxWidth: 500,
                  mx: 'auto',
                }}
              >
                <Box sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  📍 Contexte de création
                </Box>
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
          </m.div>
        </Box>
      );
    }

    // Show form based on selected mode
    return (
      <AnimatePresence mode="wait">
        <m.div
          key={selectedMode}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {selectedMode === 'ai' ? (
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
          ) : (
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
          )}
        </m.div>
      </AnimatePresence>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <CreationLayout
        mode={selectedMode || 'manual'}
        title={getTitle()}
        subtitle={getSubtitle()}
        breadcrumbs={breadcrumbs}
        progress={selectedMode ? progressPercentage : undefined}
        showProgress={!!selectedMode}
        hasUnsavedChanges={hasUnsavedChanges}
        errors={errors}
        warnings={warnings}
        actions={{
          onBack: handleBack,
          onPreview: formData.questions.length > 0 || createdExercise ? handlePreview : undefined,
          onSave: selectedMode && isLastStep ? saveExercise : undefined,
          onCancel: navigateToExerciseList,
          isSaving,
          canSave: canGoNext && !Object.keys(errors).length,
        }}
      >
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
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

      {/* Enhanced Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            minWidth: 300,
            borderRadius: 2,
            boxShadow: (theme) => theme.customShadows?.z16,
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ExerciseCreationView;
