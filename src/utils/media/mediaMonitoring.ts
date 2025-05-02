
/**
 * Report a media-related error for monitoring and analytics
 * @param mediaUrl - The URL of the media that encountered an error
 * @param errorType - The type of error that occurred
 * @param retryCount - How many retries were attempted
 * @param mediaType - The type of media (video, image, etc)
 * @param componentName - The component where the error occurred
 */
export function reportMediaError(
  mediaUrl: string | null | undefined,
  errorType: string,
  retryCount: number,
  mediaType: string,
  componentName: string
): void {
  console.error(`[MediaError] ${componentName} - ${mediaType} error (${errorType}) after ${retryCount} retries:`, mediaUrl);
  
  // TODO: Implement actual error reporting to your analytics service
  // Example: send to a monitoring service
  try {
    // This is just a placeholder for actual implementation
    const errorData = {
      mediaUrl,
      errorType,
      retryCount,
      mediaType,
      componentName,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    console.debug('Media error data:', errorData);
    
    // In a real implementation, you might send this to a server
    // await fetch('/api/media-error-reporting', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(errorData)
    // });
  } catch (err) {
    // Don't let the error reporter itself cause more errors
    console.error('Failed to report media error:', err);
  }
}

/**
 * Report successful media loading for monitoring and performance tracking
 * @param mediaUrl - The URL of the media
 * @param loadTime - Time in milliseconds it took to load
 * @param mediaType - The type of media (video, image, etc)
 */
export function reportMediaSuccess(
  mediaUrl: string | null | undefined,
  loadTime: number,
  mediaType: string
): void {
  // This is a stub for performance monitoring
  console.debug(`[MediaSuccess] ${mediaType} loaded in ${loadTime}ms:`, mediaUrl);
  
  // TODO: Implement actual success reporting to your analytics service
}
