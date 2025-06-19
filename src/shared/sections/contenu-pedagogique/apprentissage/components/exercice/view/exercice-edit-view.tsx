'use client';

import type { ExerciceMode } from 'src/shared/sections/contenu-pedagogique/apprentissage/types';

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
  CircularProgress,
} from '@mui/material';

import { ExerciceForm } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceForm';
import { ExerciceManualForm } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceManualForm';

const fetchExercice = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock data - in real app, this would come from your API
  const mockExercice = {
    id,
    titre: 'Quiz sur les verbes du premier groupe',
    description: 'Exercice de conjugaison pour apprendre les verbes du premier groupe au présent',
    statut: 'Brouillon',
    chapitreId: 'chapitre-1',
    mode: 'manual' as ExerciceMode, // This would be determined by your API

    // For manual mode exercises
    instructions:
      "Conjuguez les verbes suivants au présent de l'indicatif. Attention aux terminaisons !",
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice' as const,
        question: 'Conjuguez le verbe "parler" à la première personne du singulier',
        points: 5,
        order: 0,
        options: [
          { id: 'opt1', text: 'je parle', isCorrect: true },
          { id: 'opt2', text: 'je parles', isCorrect: false },
          { id: 'opt3', text: 'je parlent', isCorrect: false },
          { id: 'opt4', text: 'je parlons', isCorrect: false },
        ],
        allowMultiple: false,
      },
      {
        id: 'q2',
        type: 'true_false' as const,
        question:
          'La terminaison de la 3ème personne du pluriel des verbes du 1er groupe est "-ent"',
        points: 3,
        order: 1,
        correctAnswer: true,
        explanation:
          'Les verbes du premier groupe se terminent par -ent à la 3ème personne du pluriel',
      },
    ],
    timeLimit: 30,
    passingScore: 70,
    shuffleQuestions: false,
    showCorrectAnswers: true,
    maxAttempts: 3,

    // For AI mode exercises (fallback values)
    contenu: "<p>Contenu de l'exercice généré par IA</p>",
    niveau_difficulte: 'moyen',
    ressources: ['PDF', 'Audio'],
    exiger_visionnage: false,
    pourcentage_visionnage: 80,
    recompense_active: false,
    type_recompense: 'points',
    valeur_recompense: 10,
    pourcentage_reussite: 70,
    tags: ['conjugaison', 'verbes'],
  };

  return mockExercice;
};

interface EditExerciceViewProps {
  id: string;
}

export const EditExerciceView = ({ id }: EditExerciceViewProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapitreId = searchParams.get('chapitreId');
  const chapitreNom = searchParams.get('chapitreNom');
  const matiereId = searchParams.get('matiereId');
  const matiereNom = searchParams.get('matiereNom');
  const niveauId = searchParams.get('niveauId');
  const niveauNom = searchParams.get('niveauNom');

  const [exercice, setExercice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadExercice = async () => {
      try {
        const data = await fetchExercice(id);
        setExercice(data);
      } catch (err) {
        console.error('Error loading exercice:', err);
        setErrorMsg("Impossible de charger les données de l'exercice");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadExercice();
    }
  }, [id]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // API call to update the exercice
      console.log('Updating exercice:', { ...data, mode: exercice.mode });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      router.push(
        `/dashboard/contenu-pedagogique/apprentissage?view=exercices&chapitreId=${chapitreId || ''}&chapitreNom=${chapitreNom || ''}&matiereId=${matiereId || ''}&matiereNom=${matiereNom || ''}&niveauId=${niveauId || ''}&niveauNom=${niveauNom || ''}`
      );
    } catch (err) {
      console.error('Error updating exercice:', err);
      setErrorMsg("Erreur lors de la mise à jour de l'exercice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(
      `/dashboard/contenu-pedagogique/apprentissage?view=exercices&chapitreId=${chapitreId || ''}&chapitreNom=${chapitreNom || ''}&matiereId=${matiereId || ''}&matiereNom=${matiereNom || ''}&niveauId=${niveauId || ''}&niveauNom=${niveauNom || ''}`
    );
  };

  if (isLoading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (errorMsg || !exercice) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {errorMsg || 'Exercice non trouvé'}
        </Typography>
        <Button variant="contained" onClick={handleCancel} sx={{ mt: 2 }}>
          Retourner à la liste
        </Button>
      </Container>
    );
  }

  const isManualMode = exercice.mode === 'manual' || exercice.questions;

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Box sx={{ mb: 4 }}>
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
          {(chapitreId || exercice.chapitreId) && (
            <MuiLink
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => {
                const params = new URLSearchParams({
                  view: 'exercices',
                  chapitreId: chapitreId || exercice.chapitreId,
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
          <Typography color="text.primary">Modifier l&apos;exercice</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold' }}>
            Modifier l&apos;exercice: {exercice.titre}
          </Typography>

          <Chip
            icon={<FontAwesomeIcon icon={isManualMode ? faHandPaper : faRobot} />}
            label={isManualMode ? 'Mode Manuel' : 'Mode IA'}
            color={isManualMode ? 'info' : 'primary'}
            sx={{ fontWeight: 'fontWeightMedium' }}
          />
        </Box>
      </Box>

      <Card sx={{ p: 3, boxShadow: (theme) => theme.customShadows?.z8 }}>
        {isManualMode ? (
          <ExerciceManualForm
            initialValues={{
              titre: exercice.titre,
              description: exercice.description,
              instructions: exercice.instructions || '',
              questions: exercice.questions || [],
              timeLimit: exercice.timeLimit,
              passingScore: exercice.passingScore || 70,
              shuffleQuestions: exercice.shuffleQuestions || false,
              showCorrectAnswers: exercice.showCorrectAnswers !== false, // default to true
              maxAttempts: exercice.maxAttempts || 3,
              attachments: exercice.attachments || [],
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            chapitreId={chapitreId || exercice.chapitreId}
          />
        ) : (
          <ExerciceForm
            initialValues={{
              titre: exercice.titre,
              description: exercice.description,
              contenu: exercice.contenu || '',
              statut: exercice.statut,
              niveau_difficulte: exercice.niveau_difficulte || 'moyen',
              ressources: exercice.ressources || [],
              exiger_visionnage: exercice.exiger_visionnage || false,
              pourcentage_visionnage: exercice.pourcentage_visionnage || 80,
              recompense_active: exercice.recompense_active || false,
              type_recompense: exercice.type_recompense || 'points',
              valeur_recompense: exercice.valeur_recompense || 10,
              pourcentage_reussite: exercice.pourcentage_reussite || 70,
              tags: exercice.tags || [],
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            chapitreId={chapitreId || exercice.chapitreId}
          />
        )}
      </Card>
    </Container>
  );
};
