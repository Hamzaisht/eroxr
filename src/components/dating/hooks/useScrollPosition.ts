import { useState, useEffect, useCallback } from "react";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Optimized scroll tracking with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setIsScrolling(true);
      
      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Set scroll end detection
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    // Use passive event listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Optimized scroll restoration
  const restoreScroll = useCallback((savedPosition: number) => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: savedPosition,
        behavior: 'smooth'
      });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll to position
  const scrollToPosition = useCallback((position: number, behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: position,
      behavior
    });
  }, []);

  // Scroll to top
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollToPosition(0, behavior);
  }, [scrollToPosition]);

  return {
    scrollPosition,
    isScrolling,
    restoreScroll,
    scrollToPosition,
    scrollToTop
  };
}