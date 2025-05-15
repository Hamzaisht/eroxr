
/**
 * Reports a media error for logging and debugging
 * @param url - URL of the media that failed
 * @param errorType - Type of error (e.g., 'load_failure', 'playback_error')
 * @param retryCount - Number of retries attempted
 * @param mediaType - Type of media ('video', 'image', 'audio')
 * @param componentName - Name of component where error occurred
 */
export function reportMediaError(
  url: string,
  errorType: string,
  retryCount: number,
  mediaType: string,
  componentName: string
): void {
  // Log the error details to console
  console.error(`Media ${errorType} in ${componentName}:`, {
    url,
    mediaType,
    retryCount,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
  
  // In the future, this could send errors to a monitoring service
  // For now, just console logging
}

/**
 * Track media playback success
 * @param url - URL of the media
 * @param mediaType - Type of media
 * @param componentName - Name of component
 */
export function trackMediaSuccess(
  url: string,
  mediaType: string,
  componentName: string
): void {
  console.log(`Media loaded successfully in ${componentName}:`, {
    url,
    mediaType,
    timestamp: new Date().toISOString()
  });
}
