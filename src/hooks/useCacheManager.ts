import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// Cache management for better performance
export const useCacheManager = () => {
  const queryClient = useQueryClient();

  const preloadData = useCallback(async (dataType: string, id?: string) => {
    // Pre-load common data to reduce perceived loading time
    switch (dataType) {
      case 'user-profile':
        if (id) {
          queryClient.prefetchQuery({
            queryKey: ['user-complete-data', id],
            staleTime: 5 * 60 * 1000,
          });
        }
        break;
      case 'posts':
        queryClient.prefetchQuery({
          queryKey: ['posts', 'public'],
          staleTime: 2 * 60 * 1000,
        });
        break;
    }
  }, [queryClient]);

  const invalidateCache = useCallback((pattern: string[]) => {
    queryClient.invalidateQueries({ queryKey: pattern });
  }, [queryClient]);

  const clearCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  const optimizeCache = useCallback(() => {
    // Remove old cache entries to prevent memory bloat
    queryClient.getQueryCache().clear();
  }, [queryClient]);

  return {
    preloadData,
    invalidateCache,
    clearCache,
    optimizeCache,
  };
};