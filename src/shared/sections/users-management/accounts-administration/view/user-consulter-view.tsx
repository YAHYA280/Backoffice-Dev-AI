'use client';

import type { IUserItem } from 'src/contexts/types/user';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { UserConsulterForm } from '../user-consulter-form';

// ----------------------------------------------------------------------

type Props = {
  user?: IUserItem;
};

export function UserConsulterView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Visualiser utilisateur"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Utilisateurs', href: paths.dashboard.users.accounts },
          { name: currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Utilisateur' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <UserConsulterForm currentUser={currentUser} />
    </DashboardContent>
  );
}
