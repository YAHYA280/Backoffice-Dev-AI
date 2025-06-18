// app/dashboard/contenu-pedagogique/apprentissage/exercices/[exerciseId]/edit/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';

import ExerciseCreationView from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView';

interface EditExercisePageProps {
  params: {
    exerciseId: string;
  };
}

export default function EditExercisePage({ params }: EditExercisePageProps) {
  const searchParams = useSearchParams();
  const { exerciseId } = params;

  return (
    <ExerciseCreationView
      chapitreId={searchParams.get('chapitreId') || undefined}
      chapitreNom={searchParams.get('chapitreNom') || undefined}
      matiereId={searchParams.get('matiereId') || undefined}
      matiereNom={searchParams.get('matiereNom') || undefined}
      niveauId={searchParams.get('niveauId') || undefined}
      niveauNom={searchParams.get('niveauNom') || undefined}
      exerciseId={exerciseId}
      initialMode="manual" // Default to manual for editing existing exercises
    />
  );
}
