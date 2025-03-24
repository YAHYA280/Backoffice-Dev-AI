'use client';

import type { ICGUCard, ICGUFilters } from 'src/contexts/types/configuration';

import { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFilter, faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useDebounce } from 'src/hooks/use-debounce';
import { useSetState } from 'src/hooks/use-set-state';

import { orderBy } from 'src/utils/helper';

import { POST_SORT_OPTIONS } from 'src/shared/_mock';
import { DashboardContent } from 'src/shared/layouts/dashboard';
import { useGetCGUs, useSearchCGUs } from 'src/shared/actions/configuration';

import { Label } from 'src/shared/components/label';
import { CustomBreadcrumbs } from 'src/shared/components/custom-breadcrumbs';

import { ConfigurationSort } from '../configuration-sort';
import { ConfigurationSearch } from '../configuration-search';
import { ConfigurationFilterInputs } from '../configuration-filters';
import { LanguageConfiguration } from './configuration-language-view';
import { ConfigurationListHorizontal } from '../configuration-list-horizontal';

// ----------------------------------------------------------------------

export function ConfigurationView() {
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filterCount, setFilterCount] = useState(0);
  const [resetTriggered, setResetTriggered] = useState(false);
  const [isAddLanguageDialogOpen, setIsAddLanguageDialogOpen] = useState(false);

  const debouncedQuery = useDebounce(searchQuery);

  const { searchResults, searchLoading } = useSearchCGUs(debouncedQuery);

  const { data: cgus, loading: cgusLoading } = useGetCGUs();

  const [activeSection, setActiveSection] = useState('texts');

  const filters = useSetState<ICGUFilters>({
    active: undefined,
    title: '',
    version: '',
    authorName: '',
    publishDate: null,
    expirationDate: null,
    lastModifiedAt: null,
  });

  const dataFiltered = applyFilter({ inputData: cgus || [], filters: filters.state, sortBy });

  // Count the number of active filters
  const activeFiltersCount = Object.entries(filters.state).reduce((count, [key, value]) => {
    if (key === 'active') return count;

    // Count filters if they have a value
    return count + (value ? 1 : 0);
  }, 0);

  // Function to open the dialog
  const handleAddLanguageClick = () => {
    setIsAddLanguageDialogOpen(true);
  };

  const handleSortBy = useCallback((newValue: string) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
  }, []);

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      if (newValue === 'all') {
        filters.setState({ ...filters.state, active: undefined });
      } else {
        filters.setState({ ...filters.state, active: newValue === 'published' });
      }
    },
    [filters]
  );

  const handleFilterChange = useCallback(
    (name: string, value: any) => {
      filters.setState({ ...filters.state, [name]: value });
    },
    [filters]
  );

  // Enhanced reset filters function to reset all filters, sort, and search
  const handleResetAll = useCallback(() => {
    filters.setState({
      active: undefined,
      version: '',
      authorName: '',
      publishDate: null,
    });

    setSortBy('latest');
    setSearchQuery('');

    // Close filter popover if open
    if (filterAnchorEl) {
      setFilterAnchorEl(null);
    }

    setResetTriggered((prev) => !prev);
  }, [filters, filterAnchorEl]);

  // Keep original reset function for filter panel
  const handleResetFilters = useCallback(() => {
    filters.setState({
      ...filters.state,
      version: '',
      authorName: '',
      publishDate: null,
    });
  }, [filters]);

  const handleToggleExpand = useCallback(() => {
    setIsFiltersExpanded(!isFiltersExpanded);
  }, [isFiltersExpanded]);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  // Check if any filters are active
  const hasActiveFilters = !!(
    filters.state.version ||
    filters.state.authorName ||
    filters.state.publishDate
  );

  // Determine the current tab value based on active filter state
  const currentTab =
    filters.state.active === undefined ? 'all' : filters.state.active ? 'published' : 'draft';

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Configuration"
        links={[
          { name: 'Tableau de bord', href: paths.dashboard.root },
          { name: 'Configuration', href: paths.dashboard.configuration.root },
          {
            name: activeSection === 'texts' ? 'Textes légaux' : 'Langues',
            href: paths.dashboard.configuration.root,
          },
        ]}
        action={
          activeSection === 'texts' ? (
            <Button
              component={RouterLink}
              href={paths.dashboard.configuration.new}
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              sx={{
                color: 'primary.contrastText',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Nouveau texte légal
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<FontAwesomeIcon icon={faPlus} />}
              sx={{
                color: 'primary.contrastText',
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
              onClick={handleAddLanguageClick}
            >
              Ajouter une langue
            </Button>
          )
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Section tabs */}
      <Tabs
        value={activeSection}
        onChange={(event, newValue) => setActiveSection(newValue)}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        <Tab value="texts" label="Textes légaux" />
        <Tab value="languages" label="Langues" />
      </Tabs>

      {activeSection === 'texts' ? (
        <>
          <Stack
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-end', sm: 'center' }}
            direction={{ xs: 'column', sm: 'row' }}
            sx={{ mb: { xs: 3, md: 5 } }}
          >
            <ConfigurationSearch
              query={searchQuery} // Use searchQuery instead of debouncedQuery to update input immediately
              results={searchResults}
              onSearch={handleSearch}
              loading={searchLoading}
              hrefItem={(title: string) => paths.dashboard.configuration.details(title)}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Filtres">
                <Button
                  startIcon={<FontAwesomeIcon icon={faFilter} />}
                  onClick={handleFilterClick}
                  sx={{
                    minWidth: 'auto',
                    paddingLeft: 0,
                    paddingRight: 0,
                    pl: '10px',
                    position: 'relative',
                    color: 'primary.main',
                  }}
                >
                  {/* End icon positioned absolutely */}
                  {hasActiveFilters ? (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        transform: 'translate(50%, -50%)',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.70rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {activeFiltersCount}
                    </Box>
                  ) : (
                    <></>
                  )}
                </Button>
              </Tooltip>

              <Tooltip title="Réinitialiser">
                <Button
                  size="small"
                  onClick={handleResetAll}
                  startIcon={<FontAwesomeIcon icon={faSyncAlt} style={{ paddingLeft: '5px' }} />}
                  sx={{
                    minWidth: '30px',
                    padding: '4px 4px',
                    color: 'primary.main',
                  }}
                />
              </Tooltip>

              <ConfigurationSort
                sort={sortBy}
                onSort={handleSortBy}
                sortOptions={POST_SORT_OPTIONS}
              />
            </Stack>
          </Stack>

          {/* Filter inputs component */}
          <ConfigurationFilterInputs
            filters={filters.state}
            onFiltersChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            isExpanded={isFiltersExpanded}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
            onFilterCountChange={setFilterCount}
            resetTriggered={resetTriggered}
          />

          <Tabs value={currentTab} onChange={handleFilterStatus} sx={{ mb: { xs: 3, md: 5 } }}>
            {[
              { value: 'all', label: 'Tout' },
              { value: 'published', label: 'Publié' },
              { value: 'draft', label: 'Brouillon' },
            ].map((tab) => {
              // Calculate the count for each tab
              let count = 0;
              if (tab.value === 'all') {
                count = cgus?.length || 0;
              } else if (tab.value === 'published') {
                count = cgus?.filter((cgu) => cgu.active).length || 0;
              } else if (tab.value === 'draft') {
                count = cgus?.filter((cgu) => !cgu.active).length || 0;
              }

              // Format the count as a two-digit string
              const formattedCount = String(count).padStart(2, '0');

              return (
                <Tab
                  key={tab.value}
                  iconPosition="end"
                  value={tab.value}
                  label={tab.label}
                  icon={
                    <Label
                      variant={
                        ((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'
                      }
                      color={(tab.value === 'published' && 'info') || 'default'}
                    >
                      {formattedCount}
                    </Label>
                  }
                  sx={{ textTransform: 'capitalize' }}
                />
              );
            })}
          </Tabs>

          <ConfigurationListHorizontal cgus={dataFiltered} loading={cgusLoading} />
        </>
      ) : (
        // Language configuration section
        <LanguageConfiguration
          onAddLanguage={handleAddLanguageClick}
          onCloseAddLanguageDialog={() => setIsAddLanguageDialogOpen(false)}
          isAddLanguageDialogOpen={isAddLanguageDialogOpen}
        />
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: ICGUCard[];
  filters: ICGUFilters;
  sortBy: string;
};

const applyFilter = ({ inputData, filters, sortBy }: ApplyFilterProps) => {
  const { active, title, publishDate, version, authorName } = filters;

  let filteredData = [...inputData];

  // Filter by active status
  if (active !== undefined) {
    filteredData = filteredData.filter((cgu) => cgu.active === active);
  }

  // Filter by title
  if (title) {
    filteredData = filteredData.filter((cgu) =>
      cgu.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // Filter by version
  if (version) {
    filteredData = filteredData.filter((cgu) =>
      cgu.version.toLowerCase().includes(version.toLowerCase())
    );
  }

  // Filter by author name
  if (authorName) {
    filteredData = filteredData.filter((cgu) =>
      cgu.author.name.toLowerCase().includes(authorName.toLowerCase())
    );
  }

  // Filter by publish date
  if (publishDate) {
    filteredData = filteredData.filter((cgu) => {
      const cguDate = cgu.publishDate ? new Date(cgu.publishDate).setHours(0, 0, 0, 0) : -Infinity;
      const filterDate = new Date(publishDate).setHours(0, 0, 0, 0);
      return cguDate === filterDate;
    });
  }

  // Apply sorting
  if (sortBy === 'latest') {
    filteredData = orderBy(filteredData, ['publishDate'], ['desc']);
  }

  if (sortBy === 'oldest') {
    filteredData = orderBy(filteredData, ['publishDate'], ['asc']);
  }

  if (sortBy === 'popular') {
    // Since we don't have view count in ICGUCard, we'll default to most recent
    filteredData = orderBy(filteredData, ['publishDate'], ['desc']);
  }

  return filteredData;
};
