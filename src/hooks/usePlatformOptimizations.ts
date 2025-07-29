import { useEffect, useCallback, useRef } from 'react';

// Cache for API responses to prevent duplicate requests
const apiCache = new Map<string, { data: any; timestamp: number; expires: number }>();

// Debounce utility
export const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

// Cached API call utility
export const useCachedQuery = () => {
  const getCachedData = useCallback((key: string) => {
    const cached = apiCache.get(key);
    if (cached && Date.now() < cached.expires) {
      return cached.data;
    }
    return null;
  }, []);

  const setCachedData = useCallback((key: string, data: any, ttl = 30000) => {
    apiCache.set(key, {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    });
  }, []);

  const clearCache = useCallback((key?: string) => {
    if (key) {
      apiCache.delete(key);
    } else {
      apiCache.clear();
    }
  }, []);

  return { getCachedData, setCachedData, clearCache };
};

// Performance monitoring
export const usePerformanceMonitor = () => {
  const measurePerformance = useCallback((name: string, fn: () => Promise<any>) => {
    return async () => {
      const start = performance.now();
      try {
        const result = await fn();
        const end = performance.now();
        console.log(`⚡ ${name} completed in ${(end - start).toFixed(2)}ms`);
        return result;
      } catch (error) {
        const end = performance.now();
        console.error(`❌ ${name} failed after ${(end - start).toFixed(2)}ms:`, error);
        throw error;
      }
    };
  }, []);

  return { measurePerformance };
};

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

export const useRequestDeduplication = () => {
  const deduplicateRequest = useCallback(async (key: string, requestFn: () => Promise<any>) => {
    // If same request is already pending, return the existing promise
    if (pendingRequests.has(key)) {
      return pendingRequests.get(key);
    }

    // Create new request
    const request = requestFn().finally(() => {
      // Clean up after request completes
      pendingRequests.delete(key);
    });

    pendingRequests.set(key, request);
    return request;
  }, []);

  return { deduplicateRequest };
};

// Cleanup on unmount
export const useCleanup = (cleanupFn: () => void) => {
  useEffect(() => {
    return cleanupFn;
  }, []);
};

// Memory optimization
export const useMemoryOptimization = () => {
  useEffect(() => {
    // Clean up old cache entries every 5 minutes
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of apiCache.entries()) {
        if (now > value.expires) {
          apiCache.delete(key);
        }
      }
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Force garbage collection hint
  const forceCleanup = useCallback(() => {
    apiCache.clear();
    pendingRequests.clear();
    
    // Suggest garbage collection if available
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
  }, []);

  return { forceCleanup };
};

// Platform-wide performance optimizations
export const usePlatformOptimizations = () => {
  const { getCachedData, setCachedData, clearCache } = useCachedQuery();
  const { deduplicateRequest } = useRequestDeduplication();
  const { measurePerformance } = usePerformanceMonitor();
  const { forceCleanup } = useMemoryOptimization();

  // Optimized API call wrapper
  const optimizedApiCall = useCallback(async (
    key: string,
    requestFn: () => Promise<any>,
    options: { cache?: boolean; ttl?: number; measure?: boolean } = {}
  ) => {
    const { cache = true, ttl = 30000, measure = false } = options;

    // Check cache first
    if (cache) {
      const cached = getCachedData(key);
      if (cached) {
        console.log(`🚀 Cache hit for ${key}`);
        return cached;
      }
    }

    // Deduplicate request
    const requestWithDedup = () => deduplicateRequest(key, requestFn);

    // Measure performance if requested
    const finalRequest = measure ? measurePerformance(key, requestWithDedup) : requestWithDedup;

    try {
      const result = await finalRequest();
      
      // Cache the result
      if (cache && result) {
        setCachedData(key, result, ttl);
      }

      return result;
    } catch (error) {
      console.error(`❌ API call failed for ${key}:`, error);
      throw error;
    }
  }, [getCachedData, setCachedData, deduplicateRequest, measurePerformance]);

  return {
    optimizedApiCall,
    clearCache,
    forceCleanup,
    getCachedData,
    setCachedData
  };
};