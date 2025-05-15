
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    // Initialize with current match state if in browser
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    // Default to false for SSR
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      // Set initial value
      setMatches(mediaQuery.matches);

      // Define the handler
      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add event listener
      mediaQuery.addEventListener('change', handler);
      
      // Clean up
      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    }
  }, [query]);

  return matches;
}
