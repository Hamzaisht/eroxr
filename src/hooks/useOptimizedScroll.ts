import { useEffect, useRef, useCallback, useState } from 'react';

interface ScrollConfig {
  threshold?: number;
  onScrollEnd?: () => void;
  onRefresh?: () => void;
  enablePullToRefresh?: boolean;
  refreshThreshold?: number;
  debounceMs?: number;
}

export const useOptimizedScroll = (config: ScrollConfig = {}) => {
  const {
    threshold = 100,
    onScrollEnd,
    onRefresh,
    enablePullToRefresh = false,
    refreshThreshold = 80,
    debounceMs = 150
  } = config;

  const scrollElementRef = useRef<HTMLElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isPullingToRefresh, setIsPullingToRefresh] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const pullStartRef = useRef<number>(0);

  // Optimized scroll handler with debouncing
  const handleScroll = useCallback(() => {
    if (!scrollElementRef.current) return;

    const element = scrollElementRef.current;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    setScrollPosition(scrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set scroll end detection
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, debounceMs);

    // Check if near bottom for infinite scroll
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      onScrollEnd?.();
    }
  }, [threshold, onScrollEnd, debounceMs]);

  // Pull to refresh handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enablePullToRefresh || !scrollElementRef.current) return;
    
    const element = scrollElementRef.current;
    if (element.scrollTop === 0) {
      pullStartRef.current = e.touches[0].clientY;
    }
  }, [enablePullToRefresh]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enablePullToRefresh || !scrollElementRef.current || pullStartRef.current === 0) return;

    const element = scrollElementRef.current;
    const currentY = e.touches[0].clientY;
    const pullDistance = currentY - pullStartRef.current;

    if (element.scrollTop === 0 && pullDistance > 0) {
      e.preventDefault();
      
      if (pullDistance > refreshThreshold) {
        setIsPullingToRefresh(true);
        element.style.transform = `translateY(${Math.min(pullDistance * 0.5, refreshThreshold)}px)`;
        element.style.transition = 'none';
      }
    }
  }, [enablePullToRefresh, refreshThreshold]);

  const handleTouchEnd = useCallback(() => {
    if (!enablePullToRefresh || !scrollElementRef.current) return;

    const element = scrollElementRef.current;
    
    if (isPullingToRefresh) {
      element.style.transform = '';
      element.style.transition = 'transform 0.3s ease';
      onRefresh?.();
    }
    
    pullStartRef.current = 0;
    setIsPullingToRefresh(false);
  }, [enablePullToRefresh, isPullingToRefresh, onRefresh]);

  // Smooth scroll to position
  const scrollToPosition = useCallback((position: number, behavior: ScrollBehavior = 'smooth') => {
    if (!scrollElementRef.current) return;
    
    scrollElementRef.current.scrollTo({
      top: position,
      behavior
    });
  }, []);

  // Scroll to top
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollToPosition(0, behavior);
  }, [scrollToPosition]);

  // Setup event listeners
  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) return;

    // Add scroll listener with passive for performance
    element.addEventListener('scroll', handleScroll, { passive: true });

    // Add touch listeners for pull to refresh
    if (enablePullToRefresh) {
      element.addEventListener('touchstart', handleTouchStart, { passive: false });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      element.removeEventListener('scroll', handleScroll);
      
      if (enablePullToRefresh) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchmove', handleTouchMove);
        element.removeEventListener('touchend', handleTouchEnd);
      }

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd, enablePullToRefresh]);

  return {
    ref: scrollElementRef,
    isScrolling,
    isPullingToRefresh,
    scrollPosition,
    scrollToPosition,
    scrollToTop
  };
};