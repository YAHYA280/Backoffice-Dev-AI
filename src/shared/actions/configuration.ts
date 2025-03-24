import type { ICGUCard } from 'src/contexts/types/configuration';

import { useMemo, useState, useEffect } from 'react';

import { paramCase } from 'src/utils/change-case';

import { _CGUData } from '../_mock/_configuration';

// ----------------------------------------------------------------------

export function useGetCGUs() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const memoizedValue = useMemo(
    () => ({
      data: _CGUData || [],
      loading: isLoading,
      error: null,
      isValidating: false,
      isEmpty: !_CGUData?.length,
    }),
    [isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCGU(title: string) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [title]);

  const cgu = useMemo(() => 
    _CGUData.find((item) => item.title === title) || null, 
    [title]
  );

  const memoizedValue = useMemo(
    () => ({
      data: cgu,
      loading: isLoading,
      error: null,
      isValidating: false,
    }),
    [cgu, isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCGUByTitle(urlTitle: string) {
  const [data, setData] = useState<ICGUCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCGU = () => {
      try {
        setLoading(true);

        // Simulate finding the CGU in mock data
        const foundCGU = _CGUData.find(
          (cgu) => paramCase(cgu.title) === urlTitle
        );

        if (!foundCGU) {
          throw new Error('CGU not found');
        }

        setData(foundCGU);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch CGU'));
      } finally {
        setLoading(false);
      }
    };

    if (urlTitle) {
      fetchCGU();
    }
  }, [urlTitle]);

  return { data, loading, error };
}

// ----------------------------------------------------------------------

export function useGetLatestCGUs(excludeId?: string) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [excludeId]);

  const latestCGUs = useMemo(() => {
    const sorted = [..._CGUData]
      .sort((a, b) => {
        // Sort by publishDate in descending order
        const dateA = a.publishDate ? new Date(a.publishDate).getTime() : 0;
        const dateB = b.publishDate ? new Date(b.publishDate).getTime() : 0;
        return dateB - dateA;
      })
      .filter((cgu) => excludeId ? cgu.id !== excludeId : true)
      .slice(0, 5); // Get only the 5 latest CGUs
      
    return sorted;
  }, [excludeId]);

  const memoizedValue = useMemo(
    () => ({
      latestCGUs,
      loading: isLoading,
      error: null,
      isValidating: false,
      isEmpty: !latestCGUs.length,
    }),
    [latestCGUs, isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchCGUs(query: string) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    if (!query) return [];
    
    const lowercasedQuery = query.toLowerCase();
    
    return _CGUData.filter((cgu) => 
      cgu.title.toLowerCase().includes(lowercasedQuery) ||
      cgu.description.toLowerCase().includes(lowercasedQuery) ||
      cgu.version.toLowerCase().includes(lowercasedQuery) ||
      cgu.author.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [query]);

  const memoizedValue = useMemo(
    () => ({
      searchResults: results,
      searchLoading: isLoading,
      searchError: null,
      searchValidating: false,
      searchEmpty: !results.length,
    }),
    [results, isLoading]
  );

  return memoizedValue;
}
