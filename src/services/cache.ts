// ConsentIQ Client-Side Caching Service
// Provides in-memory and storage-backed caching with TTL, hit tracking, and deduplication
// Prevents unnecessary API re-fetches when toggling between admin and brand views.

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number; // Date.now() when cached
  ttl: number; // TTL in milliseconds
  hits: number; // Number of cache hits
}

export interface CacheMeta {
  isCached: boolean;
  ageMs: number;
  hits: number;
  expiresAt: number;
  formattedAge: string;
}

class ClientCacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private inFlightRequests: Map<string, Promise<any>> = new Map();

  // Default TTL: 5 minutes (300,000 ms)
  private readonly DEFAULT_TTL = 5 * 60 * 1000;

  /**
   * Get cached data if valid (not expired)
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Expired: remove from cache
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits += 1;
    return entry.data as T;
  }

  /**
   * Store data in cache with specified TTL
   */
  set<T>(key: string, data: T, ttlMs: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      hits: 0,
    });
  }

  /**
   * Check if valid unexpired cache entry exists
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    return Date.now() - entry.timestamp <= entry.ttl;
  }

  /**
   * Invalidate a single key or all keys matching a prefix/regex
   */
  invalidate(keyOrPattern?: string): void {
    if (!keyOrPattern) {
      this.cache.clear();
      return;
    }

    if (this.cache.has(keyOrPattern)) {
      this.cache.delete(keyOrPattern);
      return;
    }

    // Prefix match
    for (const key of this.cache.keys()) {
      if (key.startsWith(keyOrPattern) || key.includes(keyOrPattern)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get metadata for a cache key
   */
  getMeta(key: string): CacheMeta | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    const ageMs = now - entry.timestamp;
    const isCached = ageMs <= entry.ttl;

    let formattedAge = 'just now';
    if (ageMs > 60000) {
      formattedAge = `${Math.floor(ageMs / 60000)}m ago`;
    } else if (ageMs > 1000) {
      formattedAge = `${Math.floor(ageMs / 1000)}s ago`;
    }

    return {
      isCached,
      ageMs,
      hits: entry.hits,
      expiresAt: entry.timestamp + entry.ttl,
      formattedAge,
    };
  }

  /**
   * Fetch with cache and in-flight request deduplication
   */
  async fetchWithCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlMs: number = this.DEFAULT_TTL,
    forceRefresh: boolean = false
  ): Promise<{ data: T; isFromCache: boolean; ageMs: number; hits: number }> {
    // If not forcing refresh, check cache first
    if (!forceRefresh) {
      const cached = this.get<T>(key);
      if (cached !== null) {
        const meta = this.getMeta(key);
        return {
          data: cached,
          isFromCache: true,
          ageMs: meta?.ageMs || 0,
          hits: meta?.hits || 1,
        };
      }
    }

    // In-flight deduplication: return existing promise if same key is already being fetched
    if (this.inFlightRequests.has(key) && !forceRefresh) {
      const data = (await this.inFlightRequests.get(key)) as T;
      return {
        data,
        isFromCache: true,
        ageMs: 0,
        hits: 1,
      };
    }

    // Execute fetcher
    const fetchPromise = (async () => {
      try {
        const freshData = await fetcher();
        this.set(key, freshData, ttlMs);
        return freshData;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, fetchPromise);
    const resultData = await fetchPromise;

    return {
      data: resultData,
      isFromCache: false,
      ageMs: 0,
      hits: 0,
    };
  }

  /**
   * Get size of current cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Global Singleton Cache Instance
export const clientCache = new ClientCacheService();
