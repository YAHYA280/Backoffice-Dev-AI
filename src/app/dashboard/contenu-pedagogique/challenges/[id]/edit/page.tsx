import { EditChallengeView } from 'src/shared/sections/contenu-pedagogique/challenge-management/view/challenge-edit-view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Contenu pedagogique: Modifier un challenge',
};

export default function EditChallengePage({ params }: { params: { id: string } }) {
  return <EditChallengeView id={params.id} />;
}
