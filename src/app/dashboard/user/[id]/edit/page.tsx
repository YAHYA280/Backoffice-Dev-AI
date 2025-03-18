import { CONFIG } from 'src/config-global';
import { _listUsers } from 'src/shared/_mock/_user';

import { UserEditView } from 'src/shared/sections/users-management/accounts-administration/view/user-edit-view';

// ----------------------------------------------------------------------

export const metadata = { title: `User edit | Dashboard - ${CONFIG.site.name}` };

type Props = {
  params: { id: string };
};

export default function Page({ params }: Props) {
  const { id } = params;

  const currentUser = _listUsers.find((user) => user.id === id);

  return <UserEditView user={currentUser} />;
}

const dynamic = CONFIG.isStaticExport ? 'auto' : 'force-dynamic';

export { dynamic };

export async function generateStaticParams() {
  if (CONFIG.isStaticExport) {
    return _listUsers.map((user) => ({ id: user.id }));
  }
  return [];
}
