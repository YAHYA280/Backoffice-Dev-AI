import { EditExerciceView } from 'src/shared/sections/contenu-pedagogique/apprentissage/components/exercice/view/exercice-edit-view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Contenu pedagogique: Modifier exercice',
};

export default function EditExercicePage({ params }: { params: { id: string } }) {
  return <EditExerciceView id={params.id} />;
}
