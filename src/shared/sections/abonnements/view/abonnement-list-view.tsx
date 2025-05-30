'use client';

import type { IAbonnementItem } from 'src/contexts/types/abonnement';

import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';

import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import { abonnementItems, ABONNEMENT_SORT_OPTIONS } from 'src/shared/_mock';

import { AbonnementList } from '../abonnements-management/abonnement-list';
import { AbonnementSort } from '../abonnements-management/abonnement-sort';
import { AbonnementSearch } from '../abonnements-management/abonnement-search';
import AbonnementPublishCard from '../abonnements-management/abonnement_publish_card';

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
