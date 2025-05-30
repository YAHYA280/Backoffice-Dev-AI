'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { PaymentsContent } from '../paymentComponent/payments-list-content';
import { PaymentsHistoryContent } from '../paymentComponent/payments-history-content';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function SuiviFacturationView({ title = 'Suivi et Facturation' }: Props) {
  const tabs = useTabs('paiements');

  const TABS_OPTIONS = [
    {
      value: 'paiements',
      label: 'Paiements',
    },
    {
      value: 'historique',
      label: 'Historique',
    },
  ] as const;

  const renderTabs = (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {TABS_OPTIONS.map((tab) => (
        <Tab key={tab.value} value={tab.value} label={tab.label} />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Suivi et Facturation"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Paiements', href: paths.dashboard.paiements.root },
          { name: 'Suivi et Facturation', href: paths.dashboard.paiements.suivi_facturation },
          {
            name: tabs.value === 'paiements' ? 'Paiements' : 'Historique',
            href: paths.dashboard.abonnements.root,
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {renderTabs}
      {tabs.value === 'paiements' && <PaymentsContent />}
      {tabs.value === 'historique' && <PaymentsHistoryContent />}

    </DashboardContent>
  );
}
