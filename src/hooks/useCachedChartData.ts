import { useState, useEffect, useCallback, useRef } from 'react';
import { clientCache, CacheMeta } from '../services/cache';

interface UseCachedChartDataOptions<T> {
  ttlMs?: number; // Cache duration in ms (default 5 min)
  initialData?: T;
  enabled?: boolean;
}

export interface UseCachedChartDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isFromCache: boolean;
  cacheMeta: CacheMeta | null;
  refetch: (forceRefresh?: boolean) => Promise<void>;
  invalidateCache: () => void;
}

export function useCachedChartData<T>(
  cacheKey: string,
  fetcher: () => Promise<T>,
  options: UseCachedChartDataOptions<T> = {}
): UseCachedChartDataResult<T> {
  const { ttlMs = 5 * 60 * 1000, initialData, enabled = true } = options;

  // Use ref for fetcher so changing inline function references never triggers re-fetch loops
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  // Initialize state directly from cache if available for ZERO-latency mount
  const cachedVal = clientCache.get<T>(cacheKey);
  const [data, setData] = useState<T | null>(cachedVal !== null ? cachedVal : (initialData || null));
  const [loading, setLoading] = useState<boolean>(cachedVal === null && enabled);
  const [error, setError] = useState<Error | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(cachedVal !== null);
  const [cacheMeta, setCacheMeta] = useState<CacheMeta | null>(clientCache.getMeta(cacheKey));

  const isMounted = useRef(true);

  const loadData = useCallback(
    async (forceRefresh = false) => {
      if (!enabled) return;

      // Check if cache already has it and we're not forcing
      if (!forceRefresh) {
        const cached = clientCache.get<T>(cacheKey);
        if (cached !== null) {
          if (isMounted.current) {
            setData(cached);
            setLoading(false);
            setIsFromCache(true);
            setCacheMeta(clientCache.getMeta(cacheKey));
          }
          return;
        }
      }

      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      try {
        const currentFetcher = fetcherRef.current;
        const result = await clientCache.fetchWithCache<T>(cacheKey, currentFetcher, ttlMs, forceRefresh);
        if (isMounted.current) {
          setData(result.data);
          setIsFromCache(result.isFromCache);
          setCacheMeta(clientCache.getMeta(cacheKey));
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      }
    },
    [cacheKey, ttlMs, enabled]
  );

  useEffect(() => {
    isMounted.current = true;
    loadData(false);

    return () => {
      isMounted.current = false;
    };
  }, [loadData]);

  const invalidateCache = useCallback(() => {
    clientCache.invalidate(cacheKey);
    setCacheMeta(null);
    setIsFromCache(false);
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    isFromCache,
    cacheMeta,
    refetch: (force = true) => loadData(force),
    invalidateCache,
  };
}
