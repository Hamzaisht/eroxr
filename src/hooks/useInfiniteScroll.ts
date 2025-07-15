
import { useEffect, useState, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  initialPage?: number;
}

export function useInfiniteScroll<T>({
  threshold = 200,
  initialPage = 0,
}: UseInfiniteScrollOptions = {}) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement | null>(null);
  
  // Callback ref for last element
  const lastElementCallback = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    }, { 
      rootMargin: `0px 0px ${threshold}px 0px`,
      threshold: 0.1
    });
    
    if (node) {
      observer.current.observe(node);
      lastElementRef.current = node;
    }
  }, [loading, hasMore, threshold]);
  
  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  
  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setLoading(false);
    setHasMore(true);
    setError(null);
  }, [initialPage]);
  
  return {
    data,
    setData,
    loading,
    setLoading,
    hasMore,
    setHasMore,
    error,
    setError,
    page,
    setPage,
    lastElementRef: lastElementCallback,
    reset,
  };
}
