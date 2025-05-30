'use client';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/shared/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { AbonnementListView } from './abonnement-list-view';
import { SubscribersContent } from '../subscriberComponent/SubscribersContent';



// ----------------------------------------------------------------------

type Props = {
  title?: string;
};

export function AbonnementsView({ title = 'Suivi & Facturation' }: Props) {
  const tabs = useTabs('plans');

  const TABS_OPTIONS = [
    {
      value: 'plans',
      label: 'Plans',
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
          { name: 'Abonnements', href: paths.dashboard.abonnements.root },
          {
            name: tabs.value === 'plans' ? 'Plans' : 'Abonnés',
            href: paths.dashboard.abonnements.root,
          },
        ]}
        action={
          <Button
            component={RouterLink}
            color="primary"
            href={paths.dashboard.abonnements.new}
            variant="contained"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Nouvel abonnement
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {renderTabs}

      {tabs.value === 'plans' && <AbonnementListView />}
      {tabs.value === 'abonnés' && <SubscribersContent />}
    </DashboardContent>
  );
}
