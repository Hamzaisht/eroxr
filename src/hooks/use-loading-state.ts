
import { useState, useEffect } from "react";

interface UseLoadingStateOptions {
  initialState?: boolean;
  delay?: number;
  timeout?: number;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const { initialState = true, delay = 0, timeout = 10000 } = options;
  
  const [isLoading, setIsLoading] = useState(initialState);
  const [isTimedOut, setIsTimedOut] = useState(false);
  
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let delayId: ReturnType<typeof setTimeout>;
    
    // Apply delay if specified
    if (delay > 0) {
      delayId = setTimeout(() => {
        setIsLoading(false);
      }, delay);
    }
    
    // Set timeout for loading state
    if (initialState && timeout > 0) {
      timeoutId = setTimeout(() => {
        setIsTimedOut(true);
        setIsLoading(false);
      }, timeout);
    }
    
    return () => {
      if (delayId) clearTimeout(delayId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialState, delay, timeout]);
  
  const setLoading = (state: boolean) => {
    setIsLoading(state);
    if (state === false) {
      setIsTimedOut(false);
    }
  };
  
  return {
    isLoading,
    isTimedOut,
    setLoading
  };
}
