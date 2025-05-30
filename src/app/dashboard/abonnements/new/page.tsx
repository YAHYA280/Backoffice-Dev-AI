import { CONFIG } from 'src/config-global';

import { AbonnementCreateView } from 'src/shared/sections/abonnements/view/abonnement-create-view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new abonnement | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <AbonnementCreateView />;
}
