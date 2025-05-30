'use client';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { AbonnementNewEditForm } from '../abonnements-management/abonnement-new-edit-form';

// ----------------------------------------------------------------------

export function AbonnementCreateView() {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Créer un nouvel abonnement"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Abonnements', href: paths.dashboard.abonnements.gestion_abonnements },
          { name: 'Nouvel abonnement' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AbonnementNewEditForm />
    </DashboardContent>
  );
}
