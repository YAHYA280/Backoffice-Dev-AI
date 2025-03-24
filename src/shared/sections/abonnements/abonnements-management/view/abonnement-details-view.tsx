'use client';

import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { useState, useCallback } from 'react';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';

import { useTabs } from 'src/hooks/use-tabs';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { ABONNEMENT_DETAILS_TABS, ABONNEMENT_PUBLISH_OPTIONS } from 'src/shared/_mock';

import { Label } from 'src/shared/components/label';

import { AbonnementDetailsToolbar } from '../abonnement-details-toolbar';
import { AbonnementDetailsContent } from '../abonnement-details-content';
import { AbonnementDetailsSubscribers } from '../abonnement-details-subscribers';

// ----------------------------------------------------------------------

type Props = {
  abonnement?: IAbonnementItem;
};

export function AbonnementDetailsView({ abonnement }: Props) {
  const tabs = useTabs('content');

  const [publish, setPublish] = useState(abonnement?.publish);

  const handleChangePublish = useCallback((newValue: string) => {
    setPublish(newValue);
  }, []);

  const renderTabs = (
    <Tabs value={tabs.value} onChange={tabs.onChange} sx={{ mb: { xs: 3, md: 5 } }}>
      {ABONNEMENT_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'subscribers' ? (
              <Label variant="filled">{abonnement?.totalSubscribers}</Label>
            ) : (
              <FontAwesomeIcon icon={faChevronUp} />
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <DashboardContent>
      <AbonnementDetailsToolbar
        backLink={paths.dashboard.abonnements.gestion_abonnements}
        editLink={paths.dashboard.abonnements.edit(`${abonnement?.id}`)}
        liveLink="#"
        publish={publish || ''}
        onChangePublish={handleChangePublish}
        publishOptions={ABONNEMENT_PUBLISH_OPTIONS}
      />
      {renderTabs}

      {tabs.value === 'content' && <AbonnementDetailsContent abonnement={abonnement} />}

      {tabs.value === 'subscribers' && (
        <AbonnementDetailsSubscribers subscribers={abonnement?.subscribers ?? []} />
      )}
    </DashboardContent>
  );
}
