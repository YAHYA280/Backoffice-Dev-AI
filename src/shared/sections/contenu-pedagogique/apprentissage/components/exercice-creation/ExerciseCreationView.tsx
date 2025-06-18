// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView.tsx

'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { Box, Button, useTheme, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import AiForm from './components/ai/AiForm';
import ManualForm from './components/manual/ManualForm';
import CreationLayout from './components/shared/CreationLayout';
import ModeSelector from './components/mode-selector/ModeSelector';
import ExercisePreview from './components/preview/ExercisePreview';

import type { Exercise, CreationMode } from './types/exercise-types';

interface ExerciseCreationViewProps {
  chapitreId?: string;
  chapitreNom?: string;
  matiereId?: string;
  matiereNom?: string;
  niveauId?: string;
  niveauNom?: string;
  exerciseId?: string; // Pour l'édition
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
  const theme = useTheme();
  const hasNavigatedRef = useRef(false);
  const isMountedRef = useRef(true);

  // Simple state without complex dependencies
  const [selectedMode, setSelectedMode] = useState<CreationMode | null>(initialMode || null);
  const [createdExercise, setCreatedExercise] = useState<Exercise | null>(null);
  const isEditing = Boolean(exerciseId);

  // Dialog states - initialize with simple boolean values
  const [showModeSelector, setShowModeSelector] = useState(!initialMode && !exerciseId);
  const [showPreview, setShowPreview] = useState(false);

  // Simple navigation function without complex dependencies
  const navigateToExerciseList = useCallback(() => {
    if (hasNavigatedRef.current || !isMountedRef.current) return;

    hasNavigatedRef.current = true;

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

  // Check for missing chapitreId only once on mount
  useEffect(() => {
    if (!chapitreId && !isEditing && !hasNavigatedRef.current) {
      console.error("ChapitreId manquant pour la création d'exercice");
      navigateToExerciseList();
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
    };
  }, []); // Empty dependency array - only run on mount

  // Simple event handlers
  const handleModeSelect = useCallback((mode: CreationMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);
  }, []);

  const handleSuccess = useCallback((exercise: Exercise) => {
    setCreatedExercise(exercise);
    setShowPreview(true);
  }, []);

  const handleError = useCallback((error: string) => {
    console.error('Erreur lors de la création:', error);
  }, []);

  const handleBack = useCallback(() => {
    if (selectedMode && !createdExercise) {
      setSelectedMode(null);
      setShowModeSelector(true);
    } else {
      navigateToExerciseList();
    }
  }, [selectedMode, createdExercise, navigateToExerciseList]);

  const handlePreview = useCallback(() => {
    if (createdExercise) {
      setShowPreview(true);
    }
  }, [createdExercise]);

  const handleEditFromPreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  const handleSaveFromPreview = useCallback(() => {
    setShowPreview(false);
    navigateToExerciseList();
  }, [navigateToExerciseList]);

  const handleOpenModeSelector = useCallback(() => {
    setShowModeSelector(true);
  }, []);

  const handleCloseModeSelector = useCallback(() => {
    setShowModeSelector(false);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, []);

  // Static breadcrumbs - no complex calculations
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

  // Simple title logic
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

  // Simple content rendering
  const renderContent = () => {
    if (!selectedMode) return null;

    if (selectedMode === 'ai') {
      return (
        <AiForm
          chapitreId={chapitreId}
          onSuccess={handleSuccess}
          onCancel={handleBack}
          onError={handleError}
        />
      );
    }

    return (
      <ManualForm
        chapitreId={chapitreId}
        onSuccess={handleSuccess}
        onCancel={handleBack}
        onError={handleError}
      />
    );
  };

  // Don't render if chapitreId is missing for new exercises
  if (!chapitreId && !isEditing) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <m.div variants={containerVariants} initial="hidden" animate="visible">
      <CreationLayout
        mode={selectedMode || 'manual'}
        title={getTitle()}
        subtitle={getSubtitle()}
        breadcrumbs={breadcrumbs}
        progress={selectedMode ? undefined : 0}
        showProgress={!!selectedMode}
        actions={{
          onBack: handleBack,
          onPreview: createdExercise ? handlePreview : undefined,
          onCancel: navigateToExerciseList,
          canSave: !!createdExercise,
        }}
      >
        {selectedMode ? (
          <Box sx={{ minHeight: '70vh' }}>{renderContent()}</Box>
        ) : (
          <m.div variants={itemVariants}>
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
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  🚀 Créons votre exercice !
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                  Choisissez la méthode qui vous convient le mieux pour créer un exercice adapté à
                  vos besoins pédagogiques.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenModeSelector}
                  sx={{
                    py: 2,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    boxShadow: theme.customShadows?.z16,
                    '&:hover': {
                      boxShadow: theme.customShadows?.z20,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Choisir le mode de création
                </Button>

                {/* Informations contextuelles */}
                <Box
                  sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 2,
                    bgcolor: theme.palette.grey[50],
                    border: `1px solid ${theme.palette.divider}`,
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    📍 Contexte de création
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Chapitre :</strong> {chapitreNom || 'Non défini'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Matière :</strong> {matiereNom || 'Non définie'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Niveau :</strong> {niveauNom || 'Non défini'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </m.div>
        )}
      </CreationLayout>

      {/* Dialog de sélection de mode */}
      <ModeSelector
        open={showModeSelector}
        onClose={handleCloseModeSelector}
        onModeSelect={handleModeSelect}
        selectedMode={selectedMode || undefined}
      />

      {/* Drawer de prévisualisation */}
      <ExercisePreview
        open={showPreview}
        onClose={handleClosePreview}
        exercise={createdExercise}
        mode={selectedMode || 'manual'}
        onEdit={handleEditFromPreview}
        onSave={handleSaveFromPreview}
      />
    </m.div>
  );
};

export default ExerciseCreationView;
