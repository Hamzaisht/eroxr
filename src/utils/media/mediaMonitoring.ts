
/**
 * Media monitoring utility to track and report media loading performance and errors
 */

/**
 * Reports an error that occurred during media loading or playback
 * 
 * @param url The URL of the media that failed
 * @param errorType Type of error (load_failure, playback_error, etc)
 * @param retryCount Number of retries attempted
 * @param mediaType Type of media (image, video, audio)
 * @param componentName Name of the component where the error occurred
 */
export function reportMediaError(
  url: string | null | undefined,
  errorType: string,
  retryCount: number,
  mediaType: string,
  componentName: string
): void {
  console.error('Media Error:', {
    url,
    errorType,
    retryCount,
    mediaType,
    componentName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
  
  // In a production app, we might send this to an analytics service
  // or log it to a server endpoint for monitoring
}

/**
 * Reports successful media loading
 * 
 * @param url The URL of the media that was loaded successfully
 * @param loadTime Time taken to load the media in milliseconds
 * @param mediaType Type of media (image, video, audio)
 */
export function reportMediaSuccess(
  url: string | null | undefined,
  loadTime: number,
  mediaType: string
): void {
  console.log('Media Success:', {
    url,
    loadTime,
    mediaType,
    timestamp: new Date().toISOString()
  });
  
  // In a production app, we might send this to an analytics service
  // to track media load performance
}
