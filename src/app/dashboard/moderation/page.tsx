import { CONFIG } from 'src/config-global';

import { KanbanView } from 'src/shared/sections/moderation/view';

// ----------------------------------------------------------------------

export const metadata = { title: `moderation et signalement | Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <KanbanView />;
}
