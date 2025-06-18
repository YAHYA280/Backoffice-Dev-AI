// app/dashboard/contenu-pedagogique/apprentissage/exercices/new/page.tsx

'use client';

import { useSearchParams } from 'next/navigation';

import ExerciseCreationView from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice-creation/ExerciseCreationView';

export default function NewExercisePage() {
  const searchParams = useSearchParams();

  return (
    <ExerciseCreationView
      chapitreId={searchParams.get('chapitreId') || undefined}
      chapitreNom={searchParams.get('chapitreNom') || undefined}
      matiereId={searchParams.get('matiereId') || undefined}
      matiereNom={searchParams.get('matiereNom') || undefined}
      niveauId={searchParams.get('niveauId') || undefined}
      niveauNom={searchParams.get('niveauNom') || undefined}
      initialMode={undefined} // Let user choose mode
    />
  );
}
