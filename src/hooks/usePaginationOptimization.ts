import { useState, useCallback, useEffect, useRef } from 'react';
import { useQueryOptimization } from './useQueryOptimization';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
  preloadPages?: number;
  enableInfiniteScroll?: boolean;
  scrollThreshold?: number;
}

interface PaginationState<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  error: string | null;
}

export const usePaginationOptimization = <T = any>(
  table: string,
  select = '*',
  filters?: Record<string, any>,
  options: PaginationOptions = {}
) => {
  const {
    pageSize = 20,
    initialPage = 1,
    preloadPages = 1,
    enableInfiniteScroll = false,
    scrollThreshold = 0.8,
  } = options;

  const { optimizedPaginatedQuery } = useQueryOptimization();
  
  const [state, setState] = useState<PaginationState<T>>({
    data: [],
    currentPage: initialPage,
    totalPages: 0,
    isLoading: false,
    hasNextPage: false,
    hasPreviousPage: false,
    error: null,
  });

  const loadedPages = useRef(new Map<number, T[]>());
  const isLoadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Load data for a specific page
  const loadPage = useCallback(async (page: number, append = false) => {
    if (isLoadingRef.current) return;
    
    // Check cache first
    if (loadedPages.current.has(page)) {
      const cachedData = loadedPages.current.get(page)!;
      setState(prev => ({
        ...prev,
        data: append ? [...prev.data, ...cachedData] : cachedData,
        currentPage: page,
        isLoading: false,
      }));
      return;
    }

    isLoadingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const data = await optimizedPaginatedQuery(table, {
        select,
        filters,
        page,
        pageSize,
        orderBy: { column: 'created_at', ascending: false },
      });

      // Cache the page data
      loadedPages.current.set(page, data || []);

      // Calculate pagination info
      const hasNextPage = data && data.length === pageSize;
      const hasPreviousPage = page > 1;

      setState(prev => ({
        ...prev,
        data: append ? [...prev.data, ...(data || [])] : (data || []),
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
        isLoading: false,
        totalPages: Math.max(prev.totalPages, page + (hasNextPage ? 1 : 0)),
      }));

      // Preload adjacent pages
      if (preloadPages > 0) {
        setTimeout(() => {
          if (hasNextPage && !loadedPages.current.has(page + 1)) {
            loadPage(page + 1, false);
          }
          if (hasPreviousPage && !loadedPages.current.has(page - 1)) {
            loadPage(page - 1, false);
          }
        }, 100);
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data',
        isLoading: false,
      }));
    } finally {
      isLoadingRef.current = false;
    }
  }, [table, select, filters, pageSize, preloadPages, optimizedPaginatedQuery]);

  // Navigation functions
  const goToPage = useCallback((page: number) => {
    if (page < 1 || page === state.currentPage || isLoadingRef.current) return;
    loadPage(page, false);
  }, [state.currentPage, loadPage]);

  const nextPage = useCallback(() => {
    if (state.hasNextPage) {
      if (enableInfiniteScroll) {
        loadPage(state.currentPage + 1, true);
      } else {
        goToPage(state.currentPage + 1);
      }
    }
  }, [state.hasNextPage, state.currentPage, enableInfiniteScroll, loadPage, goToPage]);

  const previousPage = useCallback(() => {
    if (state.hasPreviousPage) {
      goToPage(state.currentPage - 1);
    }
  }, [state.hasPreviousPage, state.currentPage, goToPage]);

  // Infinite scroll setup
  const setupInfiniteScroll = useCallback((element: HTMLElement) => {
    if (!enableInfiniteScroll || !element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && state.hasNextPage && !state.isLoading) {
          nextPage();
        }
      },
      { threshold: scrollThreshold }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableInfiniteScroll, state.hasNextPage, state.isLoading, nextPage, scrollThreshold]);

  // Refresh data
  const refresh = useCallback(() => {
    loadedPages.current.clear();
    loadPage(1, false);
  }, [loadPage]);

  // Clear cache
  const clearCache = useCallback(() => {
    loadedPages.current.clear();
  }, []);

  // Initial load
  useEffect(() => {
    loadPage(initialPage, false);
  }, [loadPage, initialPage]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    ...state,
    goToPage,
    nextPage,
    previousPage,
    refresh,
    clearCache,
    setupInfiniteScroll,
    // Helper function for infinite scroll trigger element
    infiniteScrollRef: useCallback((node: HTMLElement | null) => {
      if (node && enableInfiniteScroll) {
        setupInfiniteScroll(node);
      }
    }, [setupInfiniteScroll, enableInfiniteScroll]),
  };
};