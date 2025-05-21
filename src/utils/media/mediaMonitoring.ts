/**
 * Track media errors for monitoring
 * 
 * @param url The media URL that failed to load
 * @param errorType The type of error that occurred
 * @param attemptCount Number of attempts made to load the media
 * @param mediaType The type of media (image, video, etc.)
 * @param componentName The component where the error occurred
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
  
  // This function can be expanded to:
  // 1. Send errors to an analytics service
  // 2. Log to a database for tracking
  // 3. Send to monitoring system
  // 4. Trigger alerts for repeated failures
}

/**
 * Monitor media performance metrics
 */
export function trackMediaPerformance(
  url: string,
  loadTime: number,
  mediaType: string,
  success: boolean
): void {
  console.info(`Media performance: ${url}`, {
    loadTime,
    mediaType,
    success
  });
}
