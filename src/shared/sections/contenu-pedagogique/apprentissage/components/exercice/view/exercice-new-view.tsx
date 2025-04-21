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
} from '@mui/material';

import { ExerciceForm } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/ExerciceForm';

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

  useEffect(() => {
    if (!chapitreId) {
      // Redirect to the main page if no chapitreId is provided
      router.push('/dashboard/contenu-pedagogique/apprentissage');
    }
  }, [chapitreId, router]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // API call to save the exercice
      // You would implement your actual API call here

      // Simulate API delay
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
          {chapitreId ? (
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
          ) : (
            <></>
          )}
          <Typography color="text.primary">Nouvel exercice</Typography>
        </Breadcrumbs>

        <Typography variant="h4" component="h1" sx={{ fontWeight: 'fontWeightBold', mb: 3 }}>
          Ajouter un exercice
        </Typography>
      </Box>

      <Card sx={{ p: 3, boxShadow: (theme) => theme.customShadows?.z8 }}>
        {chapitreId ? (
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
          <Typography color="error">
            ID du chapitre manquant. Impossible de créer un exercice.
          </Typography>
        )}
      </Card>
    </Container>
  );
};
