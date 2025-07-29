import { useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Query deduplication and caching
const queryCache = new Map<string, {
  data: any;
  timestamp: number;
  promise?: Promise<any>;
}>();

const CACHE_TTL = 30000; // 30 seconds
const MAX_CACHE_SIZE = 100;

export const useQueryOptimization = () => {
  const pendingQueries = useRef(new Map<string, Promise<any>>());

  // Create cache key from query parameters
  const createCacheKey = useCallback((
    table: string, 
    select?: string, 
    filters?: Record<string, any>,
    options?: Record<string, any>
  ) => {
    const key = JSON.stringify({ table, select, filters, options });
    return btoa(key).slice(0, 32); // Truncate for performance
  }, []);

  // Optimized query with deduplication and caching
  const optimizedQuery = useCallback(async (
    table: string,
    select = '*',
    filters?: Record<string, any>,
    options?: Record<string, any>
  ) => {
    const cacheKey = createCacheKey(table, select, filters, options);
    const now = Date.now();

    // Check cache first
    const cached = queryCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_TTL) {
      console.log(`🚀 Cache hit for ${table} query`);
      return cached.data;
    }

    // Check if query is already pending
    const pending = pendingQueries.current.get(cacheKey);
    if (pending) {
      console.log(`⏳ Deduplicating ${table} query`);
      return pending;
    }

    // Build and execute query
    let query = supabase.from(table).select(select);

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            query = query.in(key, value);
          } else if (typeof value === 'object' && value.operator) {
            // Handle complex filters like { operator: 'gte', value: 18 }
            query = query[value.operator](key, value.value);
          } else {
            query = query.eq(key, value);
          }
        }
      });
    }

    // Apply options (limit, order, etc.)
    if (options) {
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }
      if (options.range) {
        query = query.range(options.range.from, options.range.to);
      }
    }

    // Execute query with deduplication
    const queryPromise = (async () => {
      try {
        const result = await query;
        pendingQueries.current.delete(cacheKey);
        
        if (result.error) {
          throw new Error(result.error.message);
        }

        // Cache the result
        queryCache.set(cacheKey, {
          data: result.data,
          timestamp: now,
        });

        // Cleanup old cache entries
        if (queryCache.size > MAX_CACHE_SIZE) {
          const oldestKey = Array.from(queryCache.keys())[0];
          queryCache.delete(oldestKey);
        }

        return result.data;
      } catch (error) {
        pendingQueries.current.delete(cacheKey);
        console.error(`❌ Query failed for ${table}:`, error);
        throw error;
      }
    })();

    pendingQueries.current.set(cacheKey, queryPromise);
    return queryPromise;
  }, [createCacheKey]);

  // Paginated query with optimizations
  const optimizedPaginatedQuery = useCallback(async (
    table: string,
    {
      select = '*',
      filters,
      page = 1,
      pageSize = 20,
      orderBy,
    }: {
      select?: string;
      filters?: Record<string, any>;
      page?: number;
      pageSize?: number;
      orderBy?: { column: string; ascending?: boolean };
    } = {}
  ) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const options = {
      limit: pageSize,
      range: { from, to },
      ...(orderBy && { order: orderBy }),
    };

    return optimizedQuery(table, select, filters, options);
  }, [optimizedQuery]);

  // Clear cache for specific table or all
  const clearCache = useCallback((table?: string) => {
    if (table) {
      Array.from(queryCache.keys()).forEach(key => {
        try {
          const parsed = JSON.parse(atob(key));
          if (parsed.table === table) {
            queryCache.delete(key);
          }
        } catch (e) {
          // Invalid key, remove it
          queryCache.delete(key);
        }
      });
    } else {
      queryCache.clear();
    }
  }, []);

  // Get cache statistics
  const getCacheStats = useCallback(() => {
    return {
      size: queryCache.size,
      pendingQueries: pendingQueries.current.size,
      keys: Array.from(queryCache.keys()),
    };
  }, []);

  return {
    optimizedQuery,
    optimizedPaginatedQuery,
    clearCache,
    getCacheStats,
  };
};