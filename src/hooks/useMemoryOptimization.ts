import { useEffect, useCallback, useRef } from 'react';

// Global cleanup registry for tracking resources
const globalCleanupRegistry = new Set<() => void>();
const blobUrlRegistry = new Set<string>();

export const useMemoryOptimization = () => {
  const cleanupFunctions = useRef<(() => void)[]>([]);

  // Register a cleanup function
  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
    globalCleanupRegistry.add(cleanup);
  }, []);

  // Clean blob URLs to prevent memory leaks
  const createAndRegisterBlobUrl = useCallback((file: File): string => {
    const url = URL.createObjectURL(file);
    blobUrlRegistry.add(url);
    
    const cleanup = () => {
      URL.revokeObjectURL(url);
      blobUrlRegistry.delete(url);
    };
    
    registerCleanup(cleanup);
    return url;
  }, [registerCleanup]);

  // Manual cleanup trigger
  const triggerCleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => {
      try {
        fn();
      } catch (error) {
        console.warn('Cleanup function failed:', error);
      }
    });
    cleanupFunctions.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      triggerCleanup();
    };
  }, [triggerCleanup]);

  // Global memory pressure handler
  const handleMemoryPressure = useCallback(() => {
    // Force cleanup of all registered resources
    globalCleanupRegistry.forEach(cleanup => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Global cleanup failed:', error);
      }
    });
    globalCleanupRegistry.clear();
    
    // Clean all blob URLs
    blobUrlRegistry.forEach(url => {
      URL.revokeObjectURL(url);
    });
    blobUrlRegistry.clear();
    
    // Suggest garbage collection if available
    if ('gc' in window && typeof window.gc === 'function') {
      window.gc();
    }
  }, []);

  // Listen for memory pressure events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // App going to background, clean up non-essential resources
        triggerCleanup();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up interval for proactive memory management
    const memoryCleanupInterval = setInterval(() => {
      if (blobUrlRegistry.size > 50) {
        handleMemoryPressure();
      }
    }, 60000); // Every minute

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(memoryCleanupInterval);
    };
  }, [triggerCleanup, handleMemoryPressure]);

  return {
    registerCleanup,
    createAndRegisterBlobUrl,
    triggerCleanup,
    handleMemoryPressure
  };
};

// Global cleanup utility
export const performGlobalCleanup = () => {
  globalCleanupRegistry.forEach(cleanup => {
    try {
      cleanup();
    } catch (error) {
      console.warn('Global cleanup failed:', error);
    }
  });
  globalCleanupRegistry.clear();
  
  blobUrlRegistry.forEach(url => {
    URL.revokeObjectURL(url);
  });
  blobUrlRegistry.clear();
};