'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import {
  Box,
  Card,
  Button,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';

import { ExerciceForm } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceForm';

const fetchExercice = async (id: string) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    id,
    titre: 'Sample Exercise',
    description: 'This is a sample exercise description',
    contenu: 'Exercise content goes here',
    statut: 'Brouillon',
    niveau_difficulte: 'moyen',
    ressources: ['PDF', 'Audio'],
    chapitreId: 'chapitre-1',
    exiger_visionnage: false,
    pourcentage_visionnage: 80,
    recompense_active: false,
    type_recompense: 'points',
    valeur_recompense: 10,
    pourcentage_reussite: 70,
    tags: ['grammar', 'verbs'],
  };
};

// Explicitly define the props interface
interface EditExerciceViewProps {
  id: string;
}

// Use the props interface in the component declaration
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
      // You would implement your actual API call here

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

  return (
    <Container maxWidth="lg" sx={{ pt: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
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
          {niveauId ? (
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
          ) : (
            <></>
          )}
          {matiereId ? (
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
          ) : (
            <></>
          )}
          {chapitreId || exercice.chapitreId ? (
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
          ) : (
            <></>
          )}
          <Typography color="text.primary">Modifier l&apos;exercice</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold', mb: 3 }}>
          Modifier l&apos;exercice: {exercice.titre}
        </Typography>
      </Box>

      <Card sx={{ p: 3, boxShadow: (theme) => theme.customShadows?.z8 }}>
        <ExerciceForm
          initialValues={exercice}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          chapitreId={chapitreId || exercice.chapitreId}
        />
      </Card>
    </Container>
  );
};
