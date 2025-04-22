
import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    const updateMatch = () => {
      setMatches(media.matches);
    };
    
    // Set initial value
    updateMatch();
    
    // Listen for changes
    media.addEventListener('change', updateMatch);
    
    // Cleanup
    return () => {
      media.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}

// Export the useIsMobile function
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

// For backward compatibility, also export as useBreakpoint
export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  
  return {
    isMobile,
    isTablet,
    isDesktop
  };
}

export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || 
      navigator.maxTouchPoints > 0 ||
      // @ts-ignore
      navigator.msMaxTouchPoints > 0;
      
    setIsTouch(isTouchDevice);
  }, []);
  
  return isTouch;
}
