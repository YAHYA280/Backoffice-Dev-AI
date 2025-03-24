'use client';

import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { AbonnementNewEditForm } from '../abonnement-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  abonnement?: IAbonnementItem;
};

export function AbonnementEditView({ abonnement }: Props) {
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Éditer"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Abonnements', href: paths.dashboard.abonnements.gestion_abonnements },
          { name: abonnement?.title },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <AbonnementNewEditForm currentAbonnement={abonnement} />{' '}
    </DashboardContent>
  );
}
