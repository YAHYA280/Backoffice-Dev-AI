// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView.tsx

'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
  chapitreId: initialChapitreId,
  chapitreNom: initialChapitreNom,
  matiereId: initialMatiereId,
  matiereNom: initialMatiereNom,
  niveauId: initialNiveauId,
  niveauNom: initialNiveauNom,
  exerciseId,
  initialMode,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = useTheme();

  // États principaux
  const [selectedMode, setSelectedMode] = useState<CreationMode | null>(initialMode || null);
  const [createdExercise, setCreatedExercise] = useState<Exercise | null>(null);
  const [isEditing] = useState(!!exerciseId);

  // États des dialogs
  const modeSelector = useBoolean(!initialMode && !exerciseId);
  const preview = useBoolean();

  // Paramètres depuis l'URL - memoized to prevent re-renders
  const urlParams = useMemo(
    () => ({
      chapitreId: initialChapitreId || searchParams.get('chapitreId') || '',
      chapitreNom: initialChapitreNom || searchParams.get('chapitreNom') || '',
      matiereId: initialMatiereId || searchParams.get('matiereId') || '',
      matiereNom: initialMatiereNom || searchParams.get('matiereNom') || '',
      niveauId: initialNiveauId || searchParams.get('niveauId') || '',
      niveauNom: initialNiveauNom || searchParams.get('niveauNom') || '',
    }),
    [
      initialChapitreId,
      initialChapitreNom,
      initialMatiereId,
      initialMatiereNom,
      initialNiveauId,
      initialNiveauNom,
      searchParams,
    ]
  );

  // Handler functions with stable dependencies
  const handleCancel = useCallback(() => {
    // Construire l'URL de retour
    const params = new URLSearchParams();
    if (urlParams.chapitreId) params.set('chapitreId', urlParams.chapitreId);
    if (urlParams.chapitreNom) params.set('chapitreNom', urlParams.chapitreNom);
    if (urlParams.matiereId) params.set('matiereId', urlParams.matiereId);
    if (urlParams.matiereNom) params.set('matiereNom', urlParams.matiereNom);
    if (urlParams.niveauId) params.set('niveauId', urlParams.niveauId);
    if (urlParams.niveauNom) params.set('niveauNom', urlParams.niveauNom);
    params.set('view', 'exercices');

    router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
  }, [router, urlParams]);

  // Validation des paramètres requis
  useEffect(() => {
    if (!urlParams.chapitreId && !isEditing) {
      console.error("ChapitreId manquant pour la création d'exercice");
      handleCancel();
    }
  }, [urlParams.chapitreId, handleCancel, isEditing]);

  const handleModeSelect = useCallback(
    (mode: CreationMode) => {
      setSelectedMode(mode);
      modeSelector.onFalse();
    },
    [modeSelector]
  );

  const handleSuccess = useCallback(
    (exercise: Exercise) => {
      setCreatedExercise(exercise);
      preview.onTrue();
    },
    [preview]
  );

  const handleError = useCallback((error: string) => {
    console.error('Erreur lors de la création:', error);
    // Ici vous pourriez afficher une notification d'erreur
  }, []);

  const handleBack = useCallback(() => {
    if (selectedMode && !createdExercise) {
      // Retour à la sélection de mode
      setSelectedMode(null);
      modeSelector.onTrue();
    } else {
      // Retour à la liste
      handleCancel();
    }
  }, [selectedMode, createdExercise, modeSelector, handleCancel]);

  const handlePreview = useCallback(() => {
    if (createdExercise) {
      preview.onTrue();
    }
  }, [createdExercise, preview]);

  const handleEditFromPreview = useCallback(() => {
    preview.onFalse();
    // Rester sur le formulaire pour permettre les modifications
  }, [preview]);

  const handleSaveFromPreview = useCallback(() => {
    // Sauvegarder et retourner à la liste
    preview.onFalse();
    handleCancel();
  }, [preview, handleCancel]);

  const getBreadcrumbs = useCallback(() => {
    const breadcrumbs: Array<{
      label: string;
      onClick?: () => void;
    }> = [
      {
        label: 'Niveaux',
        onClick: () => router.push('/dashboard/contenu-pedagogique/apprentissage'),
      },
    ];

    if (urlParams.niveauId && urlParams.niveauNom) {
      breadcrumbs.push({
        label: urlParams.niveauNom,
        onClick: () => {
          const params = new URLSearchParams({
            view: 'matieres',
            niveauId: urlParams.niveauId,
            niveauNom: urlParams.niveauNom,
          });
          router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
        },
      });
    }

    if (urlParams.matiereId && urlParams.matiereNom) {
      breadcrumbs.push({
        label: urlParams.matiereNom,
        onClick: () => {
          const params = new URLSearchParams({
            view: 'chapitres',
            matiereId: urlParams.matiereId,
            matiereNom: urlParams.matiereNom,
            niveauId: urlParams.niveauId || '',
            niveauNom: urlParams.niveauNom || '',
          });
          router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
        },
      });
    }

    if (urlParams.chapitreId && urlParams.chapitreNom) {
      breadcrumbs.push({
        label: urlParams.chapitreNom,
        onClick: handleCancel,
      });
    }

    breadcrumbs.push({
      label: isEditing ? "Modifier l'exercice" : 'Nouvel exercice',
      onClick: undefined,
    });

    return breadcrumbs;
  }, [router, urlParams, isEditing, handleCancel]);

  const getTitle = useCallback(() => {
    if (isEditing) {
      return "Modifier l'exercice";
    }
    if (!selectedMode) {
      return 'Créer un exercice';
    }
    return selectedMode === 'ai' ? "Création avec l'IA" : 'Création manuelle';
  }, [isEditing, selectedMode]);

  const getSubtitle = useCallback(() => {
    if (isEditing) {
      return 'Modifiez les paramètres et le contenu de votre exercice';
    }
    if (!selectedMode) {
      return 'Choisissez votre méthode de création préférée';
    }
    return selectedMode === 'ai'
      ? "Laissez l'IA générer un exercice personnalisé"
      : 'Créez votre exercice étape par étape';
  }, [isEditing, selectedMode]);

  const renderContent = useCallback(() => {
    if (!selectedMode) {
      return null; // Le ModeSelector sera affiché
    }

    if (selectedMode === 'ai') {
      return (
        <AiForm
          chapitreId={urlParams.chapitreId}
          onSuccess={handleSuccess}
          onCancel={handleBack}
          onError={handleError}
        />
      );
    }

    return (
      <ManualForm
        chapitreId={urlParams.chapitreId}
        onSuccess={handleSuccess}
        onCancel={handleBack}
        onError={handleError}
      />
    );
  }, [selectedMode, urlParams.chapitreId, handleSuccess, handleBack, handleError]);

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
        breadcrumbs={getBreadcrumbs()}
        progress={selectedMode ? undefined : 0}
        showProgress={!!selectedMode}
        actions={{
          onBack: handleBack,
          onPreview: createdExercise ? handlePreview : undefined,
          onCancel: handleCancel,
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
                  onClick={modeSelector.onTrue}
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
                    <strong>Chapitre :</strong> {urlParams.chapitreNom || 'Non défini'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Matière :</strong> {urlParams.matiereNom || 'Non définie'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Niveau :</strong> {urlParams.niveauNom || 'Non défini'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </m.div>
        )}
      </CreationLayout>

      {/* Dialog de sélection de mode */}
      <ModeSelector
        open={modeSelector.value}
        onClose={modeSelector.onFalse}
        onModeSelect={handleModeSelect}
        selectedMode={selectedMode || undefined}
      />

      {/* Drawer de prévisualisation */}
      <ExercisePreview
        open={preview.value}
        onClose={preview.onFalse}
        exercise={createdExercise}
        mode={selectedMode || 'manual'}
        onEdit={handleEditFromPreview}
        onSave={handleSaveFromPreview}
      />
    </m.div>
  );
};

export default ExerciseCreationView;
