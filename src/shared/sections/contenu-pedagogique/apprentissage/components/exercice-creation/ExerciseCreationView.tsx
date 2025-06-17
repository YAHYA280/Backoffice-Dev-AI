// src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView.tsx

'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Box, Button, useTheme, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import AiForm from './components/ai/AiForm';
import ManualForm from './components/manual/';
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
  const [isEditing, setIsEditing] = useState(!!exerciseId);

  // États des dialogs
  const modeSelector = useBoolean(!initialMode && !exerciseId);
  const preview = useBoolean();

  // Paramètres depuis l'URL
  const [chapitreId] = useState(initialChapitreId || searchParams.get('chapitreId') || '');
  const [chapitreNom] = useState(initialChapitreNom || searchParams.get('chapitreNom') || '');
  const [matiereId] = useState(initialMatiereId || searchParams.get('matiereId') || '');
  const [matiereNom] = useState(initialMatiereNom || searchParams.get('matiereNom') || '');
  const [niveauId] = useState(initialNiveauId || searchParams.get('niveauId') || '');
  const [niveauNom] = useState(initialNiveauNom || searchParams.get('niveauNom') || '');

  // Validation des paramètres requis
  useEffect(() => {
    if (!chapitreId && !isEditing) {
      console.error("ChapitreId manquant pour la création d'exercice");
      handleCancel();
    }
  }, [chapitreId, handleCancel, isEditing]);

  const handleModeSelect = (mode: CreationMode) => {
    setSelectedMode(mode);
    modeSelector.onFalse();
  };

  const handleSuccess = (exercise: Exercise) => {
    setCreatedExercise(exercise);
    preview.onTrue();
  };

  const handleError = (error: string) => {
    console.error('Erreur lors de la création:', error);
    // Ici vous pourriez afficher une notification d'erreur
  };

  const handleCancel = () => {
    // Construire l'URL de retour
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

  const handleBack = () => {
    if (selectedMode && !createdExercise) {
      // Retour à la sélection de mode
      setSelectedMode(null);
      modeSelector.onTrue();
    } else {
      // Retour à la liste
      handleCancel();
    }
  };

  const handlePreview = () => {
    if (createdExercise) {
      preview.onTrue();
    }
  };

  const handleEditFromPreview = () => {
    preview.onFalse();
    // Rester sur le formulaire pour permettre les modifications
  };

  const handleSaveFromPreview = () => {
    // Sauvegarder et retourner à la liste
    preview.onFalse();
    handleCancel();
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: 'Niveaux',
        onClick: () => router.push('/dashboard/contenu-pedagogique/apprentissage'),
      },
    ];

    if (niveauId && niveauNom) {
      breadcrumbs.push({
        label: niveauNom,
        onClick: () => {
          const params = new URLSearchParams({
            view: 'matieres',
            niveauId,
            niveauNom,
          });
          router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
        },
      });
    }

    if (matiereId && matiereNom) {
      breadcrumbs.push({
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
      });
    }

    if (chapitreId && chapitreNom) {
      breadcrumbs.push({
        label: chapitreNom,
        onClick: handleCancel,
      });
    }

    breadcrumbs.push({
      label: isEditing ? "Modifier l'exercice" : 'Nouvel exercice',
      onClick: undefined,
    });

    return breadcrumbs;
  };

  const getTitle = () => {
    if (isEditing) {
      return "Modifier l'exercice";
    }
    if (!selectedMode) {
      return 'Créer un exercice';
    }
    return selectedMode === 'ai' ? "Création avec l'IA" : 'Création manuelle';
  };

  const getSubtitle = () => {
    if (isEditing) {
      return 'Modifiez les paramètres et le contenu de votre exercice';
    }
    if (!selectedMode) {
      return 'Choisissez votre méthode de création préférée';
    }
    return selectedMode === 'ai'
      ? "Laissez l'IA générer un exercice personnalisé"
      : 'Créez votre exercice étape par étape';
  };

  const renderContent = () => {
    if (!selectedMode) {
      return null; // Le ModeSelector sera affiché
    }

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
