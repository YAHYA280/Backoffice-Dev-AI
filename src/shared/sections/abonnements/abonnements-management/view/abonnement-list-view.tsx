'use client';

import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { useState, useCallback } from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { abonnementItems, ABONNEMENT_SORT_OPTIONS } from 'src/shared/_mock';

import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { AbonnementList } from '../abonnement-list';
import { AbonnementSort } from '../abonnement-sort';
import { AbonnementSearch } from '../abonnement-search';
import AbonnementPublishCard from '../abonnement_publish_card';

// ----------------------------------------------------------------------

export function AbonnementListView() {
  const [sortBy, setSortBy] = useState('Plus récent');

  const search = useSetState<{
    query: string;
    results: IAbonnementItem[];
  }>({ query: '', results: [] });

  const dataFiltered = applyFilter({ inputData: abonnementItems, sortBy });

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue: string) => {
      search.setState({ query: inputValue });

      if (inputValue) {
        const results = abonnementItems.filter((abonnement) =>
          abonnement.title.toLowerCase().includes(inputValue.toLowerCase())
        );
        search.setState({ results });
      }
    },
    [search]
  );
  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <AbonnementSearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <AbonnementSort sort={sortBy} onSort={handleSortBy} sortOptions={ABONNEMENT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Liste des abonnements"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Abonnements', href: paths.dashboard.abonnements.gestion_abonnements },
          { name: 'Gestion des plans' },
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

      <AbonnementPublishCard abonnements={abonnementItems} />

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}
      </Stack>

      <AbonnementList abonnements={dataFiltered} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IAbonnementItem[];
  sortBy: string;
};

const applyFilter = ({ inputData, sortBy }: ApplyFilterProps) => {
  // Sort by
  if (sortBy === 'Plus récent') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'Plus ancien') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'Plus populaire') {
    inputData = orderBy(inputData, ['totalSubscribers'], ['desc']);
  }

  return inputData;
};
