
/**
 * Throttle a function to prevent it from being called too frequently
 * @param fn The function to throttle
 * @param delay The minimum delay between function calls in ms
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    // Store the latest arguments
    lastArgs = args;
    
    // If we're within the delay period, schedule the call for later
    if (timeSinceLastCall < delay) {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          timeoutId = null;
          if (lastArgs) {
            fn(...lastArgs);
            lastArgs = null;
          }
        }, delay - timeSinceLastCall);
      }
      return;
    }
    
    // Clear any scheduled timeout
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    
    // Execute the function
    lastCall = now;
    fn(...args);
    lastArgs = null;
  };
}

/**
 * Debounce a function to delay its execution until after a certain period of inactivity
 * @param fn The function to debounce
 * @param delay The delay in ms
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}
