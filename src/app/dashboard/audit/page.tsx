import { CONFIG } from 'src/config-global';

import { AuditPage } from 'src/shared/sections/audit/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.site.name}` };

export default function Page() {
  return <AuditPage />;
}
