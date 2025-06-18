// src/app/dashboard/contenu-pedagogique/apprentissage/exercices/new/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

import ExerciseCreationView from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView';

function NewExerciseContent() {
  const searchParams = useSearchParams();

  // Extract search parameters
  const chapitreId = searchParams.get('chapitreId') || '';
  const chapitreNom = searchParams.get('chapitreNom') || '';
  const matiereId = searchParams.get('matiereId') || '';
  const matiereNom = searchParams.get('matiereNom') || '';
  const niveauId = searchParams.get('niveauId') || '';
  const niveauNom = searchParams.get('niveauNom') || '';

  return (
    <ExerciseCreationView
      chapitreId={chapitreId}
      chapitreNom={chapitreNom}
      matiereId={matiereId}
      matiereNom={matiereNom}
      niveauId={niveauId}
      niveauNom={niveauNom}
    />
  );
}

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default function NewExercisePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NewExerciseContent />
    </Suspense>
  );
}
