interface MediaErrorData {
  url: string;
  errorType: string;
  attemptCount: number;
  mediaType: string;
  componentName: string;
  timestamp: number;
  userAgent: string;
}

/**
 * Report media error for tracking
 */
export function reportMediaError(
  url: string,
  errorType: 'load_failure' | 'timeout' | 'format_error' | 'access_denied',
  attemptCount: number = 1,
  mediaType: string = 'unknown',
  componentName: string = 'unknown'
): void {
  // Log error for debugging
  console.error(`Media error [${errorType}]: ${url}`, {
    attemptCount,
    mediaType,
    componentName
  });
  
  // Create error report
  const errorData: MediaErrorData = {
    url,
    errorType,
    attemptCount,
    mediaType,
    componentName,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  };
  
  // Store errors for analytics
  const storedErrors = JSON.parse(localStorage.getItem('media_errors') || '[]');
  storedErrors.push(errorData);
  
  // Keep only the most recent 50 errors
  while (storedErrors.length > 50) {
    storedErrors.shift();
  }
  
  // Save back to storage
  localStorage.setItem('media_errors', JSON.stringify(storedErrors));
  
  // You could also send this to an analytics endpoint or error tracking service
}

/**
 * Get all recorded media errors
 */
export function getMediaErrorLogs(): MediaErrorData[] {
  return JSON.parse(localStorage.getItem('media_errors') || '[]');
}

/**
 * Clear media error logs
 */
export function clearMediaErrorLogs(): void {
  localStorage.removeItem('media_errors');
}

/**
 * Track successful media loads
 */
export function trackMediaSuccess(url: string, mediaType: string, loadTimeMs: number): void {
  // Can be used for performance monitoring
  console.log(`Media loaded successfully: ${url} (${mediaType}) in ${loadTimeMs}ms`);
  
  // This could be sent to an analytics service to track success rates
}
