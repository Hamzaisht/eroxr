
/**
 * Media error reporting and monitoring utilities
 */

type MediaErrorType = 
  | 'load_failure' 
  | 'processing_error' 
  | 'playback_error'
  | 'invalid_format'
  | 'decode_error'
  | 'timeout'
  | 'network_error'
  | 'unknown';

type MediaType = 'image' | 'video' | 'audio' | 'unknown';

/**
 * Reports a media error for monitoring and debugging
 * @param url - The URL of the media that caused the error
 * @param errorType - The type of error that occurred
 * @param retryCount - The number of retry attempts made
 * @param mediaType - The type of media that caused the error
 * @param componentName - The component where the error occurred
 */
export function reportMediaError(
  url: string | null | undefined,
  errorType: MediaErrorType,
  retryCount: number = 0,
  mediaType: MediaType = 'unknown',
  componentName: string = 'unknown'
): void {
  // Sanitize URL for logging (remove sensitive parts)
  const sanitizedUrl = url ? url.split('?')[0] : 'null-url';
  
  console.error(`Media ${errorType} in ${componentName}:`, {
    mediaType,
    retryCount,
    url: sanitizedUrl
  });
  
  // In a production app, you would send this data to a monitoring service
  // For now, we just log it to the console
}

/**
 * Reports successful media loads (for monitoring performance)
 * @param url - The URL of the media that was loaded
 * @param loadTimeMs - The time it took to load in milliseconds
 * @param mediaType - The type of media that was loaded
 */
export function reportMediaSuccess(
  url: string | null | undefined,
  loadTimeMs: number,
  mediaType: MediaType = 'unknown'
): void {
  // Only log in development to avoid console spam
  if (process.env.NODE_ENV === 'development') {
    console.info(`Media loaded successfully (${mediaType}): ${loadTimeMs}ms`);
  }
}
