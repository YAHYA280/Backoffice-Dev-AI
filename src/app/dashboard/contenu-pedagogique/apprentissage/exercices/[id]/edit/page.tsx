// app/dashboard/contenu-pedagogique/apprentissage/exercices/[id]/edit/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import ExerciseCreationView from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView';

interface EditExerciseContentProps {
  exerciseId: string;
}

function EditExerciseContent({ exerciseId }: EditExerciseContentProps) {
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
      exerciseId={exerciseId}
      initialMode="manual" // Default to manual for editing existing exercises
    />
  );
}

interface EditExercisePageProps {
  params: {
    id: string;
  };
}

export default function EditExercisePage({ params }: EditExercisePageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditExerciseContent exerciseId={params.id} />
    </Suspense>
  );
}
