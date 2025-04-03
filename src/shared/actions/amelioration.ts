import type { IKanbanTask } from "src/contexts/types/kanban";

import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const enableServer = false;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

type SearchAmeliorationData = {
  results: IKanbanTask[];
};

export function useSearchAmeliorations(query: string) {
  const url = query ? [endpoints.amelioration.search, { params: { query } }] : '';

  const { data, isLoading, error, isValidating } = useSWR<SearchAmeliorationData>(url, fetcher, {
    ...swrOptions,
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results?.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
