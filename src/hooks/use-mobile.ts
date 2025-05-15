
import { useEffect, useState } from 'react';

/**
 * Hook to detect if the current device is a mobile device
 * @param breakpoint Breakpoint width to consider mobile (default: 768px)
 * @returns Boolean indicating if the device is mobile
 */
export function useIsMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window exists (browser environment)
    if (typeof window === 'undefined') return;

    // Initial check
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Run on mount
    checkIsMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}

// Re-export useMediaQuery for backward compatibility
export { useMediaQuery } from './useMediaQuery';
