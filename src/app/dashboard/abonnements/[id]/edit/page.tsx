import { CONFIG } from 'src/config-global';
import { abonnementItems } from 'src/shared/_mock';

import { AbonnementEditView } from 'src/shared/sections/abonnements/view/abonnement-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `mettre à jour un abonnement | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentAbonnement = abonnementItems.find((abonnement) => abonnement.id === id);

  return <AbonnementEditView abonnement={currentAbonnement} />;
}

// ----------------------------------------------------------------------

/**
 * [1] Default
 * Remove [1] and [2] if not using [2]
 */
const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

/**
 * [2] Static exports
 * https://nextjs.org/docs/app/building-your-application/deploying/static-exports
 */
export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return abonnementItems.map((abonnement) => ({ id: abonnement.id }));
  }
  return [];
}
