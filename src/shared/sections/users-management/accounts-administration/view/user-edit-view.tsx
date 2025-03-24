'use client';

import type { IUserItem } from 'src/contexts/types/user';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { UserNewEditForm } from '../user-new-edit-form';

type Props = {
  user?: IUserItem;
};

export function UserEditView({ user: currentUser }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Edit utilisateur"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Utilisateurs', href: paths.dashboard.users.accounts },
          { name: `${currentUser?.firstName} ${currentUser?.lastName}` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <UserNewEditForm currentUser={currentUser} />
    </DashboardContent>
  );
}