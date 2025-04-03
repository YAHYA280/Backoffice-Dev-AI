'use client';

import type { IAbonnementItem, IAbonnementFilters } from 'src/contexts/types/abonnement';

import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { Tooltip, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { DashboardContent } from 'src/shared/layouts/dashboard';
import {
  abonnementItems,
  ABONNEMENT_SORT_OPTIONS,
  ABONNEMENT_TYPES_OPTIONS,
  ABONNEMENT_PUBLISH_OPTIONS,
  ABONNEMENT_FEATURES_OPTIONS,
} from 'src/shared/_mock';

import { EmptyContent } from 'src/shared/components/empty-content';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { AbonnementList } from '../abonnement-list';
import { AbonnementSort } from '../abonnement-sort';
import { AbonnementSearch } from '../abonnement-search';
import { AbonnementFilters } from '../abonnement-filters';

// ----------------------------------------------------------------------

export function AbonnementListView() {
  const openFilters = useBoolean();
  const theme = useTheme();

  const [sortBy, setSortBy] = useState('Plus récent');

  const search = useSetState<{
    query: string;
    results: IAbonnementItem[];
  }>({ query: '', results: [] });

  const filters = useSetState<IAbonnementFilters>({
    types: [],
    publishOptions: 'Tous',
    features: [],
  });

  const dataFiltered = applyFilter({ inputData: abonnementItems, filters: filters.state, sortBy });

  const canReset =
    filters.state.types.length > 0 ||
    filters.state.features.length > 0 ||
    filters.state.publishOptions !== 'Tous';

  const notFound = !dataFiltered.length && canReset;

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
  const handleResetAll = () => {
    filters.setState({
      types: [],
      publishOptions: 'Tous',
      features: [],
    });
  };
  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <AbonnementSearch search={search} onSearch={handleSearch} />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <AbonnementFilters
          filters={filters}
          canReset={canReset}
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          options={{
            types: ABONNEMENT_TYPES_OPTIONS.map((option) => option.label),
            PublishOptions: ['Tous', ...ABONNEMENT_PUBLISH_OPTIONS.map((option) => option.label)],
            features: ABONNEMENT_FEATURES_OPTIONS.map((option) => option.label),
          }}
        />
        <Tooltip title="Réinitialiser" arrow>
          <IconButton
            color="primary"
            onClick={handleResetAll}
            sx={{
              p: 1,
              position: 'relative', // Add positioning for the indicator
              transition: theme.transitions.create(['transform', 'box-shadow']),
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            <FontAwesomeIcon icon={faSyncAlt} />
          </IconButton>
        </Tooltip>

        <AbonnementSort sort={sortBy} onSort={handleSortBy} sortOptions={ABONNEMENT_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  // const renderResults = (
  //   <AbonnementFiltersResult filters={filters} totalResults={dataFiltered.length} />
  // );

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

      <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
        {renderFilters}

        {/* {canReset && renderResults} */}
      </Stack>

      {notFound && <EmptyContent filled sx={{ py: 10 }} />}

      <AbonnementList abonnements={dataFiltered} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: IAbonnementItem[];
  filters: IAbonnementFilters;
  sortBy: string;
};

const applyFilter = ({ inputData, filters, sortBy }: ApplyFilterProps) => {
  const { types, publishOptions, features } = filters;

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

  // Filters
  if (features.length) {
    inputData = inputData.filter((abonnement) =>
      abonnement.features.some((item) => features.includes(item))
    );
  }

  if (types.length) {
    inputData = inputData.filter((abonnement) => types.includes(abonnement.type));
  }

  if (publishOptions !== 'Tous') {
    inputData = inputData.filter((abonnement) => abonnement.publish === publishOptions);
  }

  return inputData;
};
