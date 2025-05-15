
import { useEffect, useState } from 'react';

/**
 * Hook that listens for changes to a media query
 * @param query Media query to match
 * @returns Boolean indicating if the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState<boolean>(() => {
    // On first render, check if window is available
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    // Server-side rendering or testing environment
    return false;
  });

  useEffect(() => {
    // Check if window exists (browser environment)
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Define the listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};
