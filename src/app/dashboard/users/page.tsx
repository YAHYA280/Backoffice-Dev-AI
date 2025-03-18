import { CONFIG } from 'src/config-global';

import { BlankView } from 'src/shared/sections/blank/view';

export const metadata = { title: `USERS - ${CONFIG.site.name}` };

export default function Page() {
  return <BlankView title="Users" />;
}
