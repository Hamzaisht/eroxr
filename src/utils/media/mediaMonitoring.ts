
interface MediaErrorEvent {
  url: string;
  errorType: string;
  retryCount: number;
  mediaType: string;
  componentName: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

const ERROR_LIMIT = 10; // Maximum number of errors to store
let errorCache: MediaErrorEvent[] = [];

/**
 * Report a media error for tracking and debugging
 */
export function reportMediaError(
  url: string,
  errorType: string,
  retryCount: number = 0,
  mediaType: string = 'unknown',
  componentName: string = 'unknown'
) {
  // Create error event
  const errorEvent: MediaErrorEvent = {
    url,
    errorType,
    retryCount,
    mediaType,
    componentName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    referrer: document.referrer || window.location.href
  };
  
  // Add to local cache (limited size)
  errorCache = [errorEvent, ...errorCache.slice(0, ERROR_LIMIT - 1)];
  
  // Log to console for development
  console.error('Media Error:', errorEvent);
  
  // In production, you could send this to an error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTrackingService(errorEvent);
  }
}

/**
 * Get all recorded media errors for debugging
 */
export function getMediaErrors(): MediaErrorEvent[] {
  return [...errorCache];
}

/**
 * Clear the media error cache
 */
export function clearMediaErrors(): void {
  errorCache = [];
}
