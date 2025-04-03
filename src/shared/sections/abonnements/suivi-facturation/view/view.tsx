'use client';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { InvoicesContent } from '../InvoicesContent';
import { PaymentsContent } from '../payments-list-content';
import { SubscribersContent } from '../SubscribersContent';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function SuiviFacturationView({ title = 'Suivi & Facturation' }: Props) {
  const tabs = useTabs('paiements');

  const TABS_OPTIONS = [
    {
      value: 'paiements',
      label: 'Paiements',
    },
    {
      value: 'factures',
      label: 'Factures',
    },
    {
      value: 'abonnés',
      label: 'Abonnés',
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
        heading="Abonnements"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Abonnements', href: paths.dashboard.abonnements.suivi_facturation },
          { name: 'suivi & facturation' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {renderTabs}

      {tabs.value === 'paiements' && <PaymentsContent />}
      {tabs.value === 'factures' && <InvoicesContent />}
      {tabs.value === 'abonnés' && <SubscribersContent />}
    </DashboardContent>
  );
}
