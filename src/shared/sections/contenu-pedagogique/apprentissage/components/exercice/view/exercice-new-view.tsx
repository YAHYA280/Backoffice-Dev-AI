'use client';

import type { ExerciceMode } from 'src/shared/sections/contenu-pedagogique/apprentissage/types';

import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faHandPaper, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Chip,
  Button,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';

import { varFade } from 'src/shared/components/animate';

import { ExerciceForm } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceForm';
import { ExerciceManualForm } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceManualForm';
import { ExerciceModeSelector } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceModeSelector';

export const NewExerciceView: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapitreId = searchParams.get('chapitreId');
  const chapitreNom = searchParams.get('chapitreNom');
  const matiereId = searchParams.get('matiereId');
  const matiereNom = searchParams.get('matiereNom');
  const niveauId = searchParams.get('niveauId');
  const niveauNom = searchParams.get('niveauNom');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(true);
  const [selectedMode, setSelectedMode] = useState<ExerciceMode | null>(null);

  useEffect(() => {
    if (!chapitreId) {
      router.push('/dashboard/contenu-pedagogique/apprentissage');
    }
  }, [chapitreId, router]);

  const handleModeSelect = (mode: ExerciceMode) => {
    setSelectedMode(mode);
    setShowModeSelector(false);
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // API call to save the exercice with mode information
      const exerciceData = {
        ...data,
        mode: selectedMode,
      };

      console.log('Saving exercice:', exerciceData);

      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push(
        `/dashboard/contenu-pedagogique/apprentissage?view=exercices&chapitreId=${chapitreId || ''}&chapitreNom=${chapitreNom || ''}&matiereId=${matiereId || ''}&matiereNom=${matiereNom || ''}&niveauId=${niveauId || ''}&niveauNom=${niveauNom || ''}`
      );
    } catch (err) {
      console.error('Error saving exercice:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(
      `/dashboard/contenu-pedagogique/apprentissage?view=exercices&chapitreId=${chapitreId || ''}&chapitreNom=${chapitreNom || ''}&matiereId=${matiereId || ''}&matiereNom=${matiereNom || ''}&niveauId=${niveauId || ''}&niveauNom=${niveauNom || ''}`
    );
  };

  const handleResetMode = () => {
    setSelectedMode(null);
    setShowModeSelector(true);
  };

  // Fix: Only handle modal close when user explicitly cancels, not on backdrop click or escape
  const handleModalClose = () => {
    // Don't automatically redirect - just close the modal and stay on the page
    setShowModeSelector(false);
  };

  // If user hasn't selected a mode and modal is closed, show a prompt to select mode
  const shouldShowModePrompt = !selectedMode && !showModeSelector;

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Box component={m.div} variants={varFade().inUp} sx={{ mb: 4 }}>
        <Button
          variant="text"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faChevronLeft} />}
          onClick={handleCancel}
          sx={{ mb: 2 }}
        >
          Retour
        </Button>

        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <MuiLink
            component="button"
            underline="hover"
            color="inherit"
            onClick={() => router.push('/dashboard/contenu-pedagogique/apprentissage')}
          >
            Niveaux
          </MuiLink>
          {niveauId && (
            <MuiLink
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => {
                const params = new URLSearchParams({
                  view: 'matieres',
                  niveauId,
                  niveauNom: niveauNom || '',
                });
                router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
              }}
            >
              {niveauNom}
            </MuiLink>
          )}
          {matiereId && (
            <MuiLink
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => {
                const params = new URLSearchParams({
                  view: 'chapitres',
                  matiereId,
                  matiereNom: matiereNom || '',
                  niveauId: niveauId || '',
                  niveauNom: niveauNom || '',
                });
                router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
              }}
            >
              {matiereNom}
            </MuiLink>
          )}
          {chapitreId && (
            <MuiLink
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => {
                const params = new URLSearchParams({
                  view: 'exercices',
                  chapitreId,
                  chapitreNom: chapitreNom || '',
                  matiereId: matiereId || '',
                  matiereNom: matiereNom || '',
                  niveauId: niveauId || '',
                  niveauNom: niveauNom || '',
                });
                router.push(`/dashboard/contenu-pedagogique/apprentissage?${params.toString()}`);
              }}
            >
              {chapitreNom}
            </MuiLink>
          )}
          <Typography color="text.primary">Nouvel exercice</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Ajouter un exercice
          </Typography>

          {selectedMode && (
            <Box component={m.div} variants={varFade().inRight} sx={{ display: 'flex', gap: 1 }}>
              <Chip
                icon={<FontAwesomeIcon icon={selectedMode === 'ai' ? faRobot : faHandPaper} />}
                label={selectedMode === 'ai' ? 'Mode IA' : 'Mode Manuel'}
                color={selectedMode === 'ai' ? 'primary' : 'info'}
                sx={{ fontWeight: 'fontWeightMedium' }}
              />
              <Button size="small" variant="text" onClick={handleResetMode} sx={{ ml: 1 }}>
                Changer de mode
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Mode Selector Modal */}
      <ExerciceModeSelector
        open={showModeSelector}
        onClose={handleModalClose} // Fix: Don't redirect automatically
        onSelectMode={handleModeSelect}
      />

      {/* Show mode selection prompt if user closed modal without selecting */}
      {shouldShowModePrompt && (
        <Card
          component={m.div}
          variants={varFade().inUp}
          sx={{
            p: 4,
            textAlign: 'center',
            boxShadow: (theme) => theme.customShadows?.z8,
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Mode de création requis
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Vous devez choisir un mode de création pour continuer
          </Typography>
          <Button variant="contained" onClick={() => setShowModeSelector(true)} sx={{ mr: 2 }}>
            Choisir un mode
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            Annuler
          </Button>
        </Card>
      )}

      {/* Exercise Form */}
      {selectedMode && chapitreId && (
        <Card
          component={m.div}
          variants={varFade().inUp}
          sx={{
            p: 3,
            boxShadow: (theme) => theme.customShadows?.z8,
            borderRadius: 2,
          }}
        >
          {selectedMode === 'ai' ? (
            <ExerciceForm
              initialValues={{
                titre: '',
                description: '',
                contenu: '',
                statut: 'Brouillon',
                niveau_difficulte: 'moyen',
                ressources: [],
                exiger_visionnage: false,
                pourcentage_visionnage: 80,
                recompense_active: false,
                type_recompense: 'points',
                valeur_recompense: 10,
                pourcentage_reussite: 70,
                tags: [],
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              chapitreId={chapitreId}
            />
          ) : (
            <ExerciceManualForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              chapitreId={chapitreId}
            />
          )}
        </Card>
      )}

      {/* Error state when chapitreId is missing */}
      {selectedMode && !chapitreId && (
        <Typography color="error">
          ID du chapitre manquant. Impossible de créer un exercice.
        </Typography>
      )}
    </Container>
  );
};
