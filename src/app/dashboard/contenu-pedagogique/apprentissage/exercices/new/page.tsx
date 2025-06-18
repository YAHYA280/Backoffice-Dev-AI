// app/dashboard/contenu-pedagogique/apprentissage/exercices/new/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import ExerciseCreationView from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView';

function NewExerciseContent() {
  const searchParams = useSearchParams();

  // Extract params once and memoize them
  const params = {
    chapitreId: searchParams.get('chapitreId') || '',
    chapitreNom: searchParams.get('chapitreNom') || '',
    matiereId: searchParams.get('matiereId') || '',
    matiereNom: searchParams.get('matiereNom') || '',
    niveauId: searchParams.get('niveauId') || '',
    niveauNom: searchParams.get('niveauNom') || '',
  };

  return (
    <ExerciseCreationView
      chapitreId={params.chapitreId}
      chapitreNom={params.chapitreNom}
      matiereId={params.matiereId}
      matiereNom={params.matiereNom}
      niveauId={params.niveauId}
      niveauNom={params.niveauNom}
      initialMode={undefined} // Let user choose mode
    />
  );
}

export default function NewExercisePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewExerciseContent />
    </Suspense>
  );
}
