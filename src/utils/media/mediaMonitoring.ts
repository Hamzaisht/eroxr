
/**
 * Media monitoring utilities for tracking and reporting media errors
 */

interface MediaErrorReport {
  url?: string | null;
  errorType: string;
  retryCount?: number;
  mediaType?: string;
  component?: string;
  details?: any;
  timestamp: number;
}

interface MediaSuccessReport {
  url?: string | null;
  loadTime: number;
  mediaType?: string;
  component?: string;
  timestamp: number;
}

/**
 * Reports a media error for monitoring and analytics
 * 
 * @param url The URL of the media that caused the error
 * @param errorType The type of error that occurred
 * @param retryCount Number of retry attempts (if applicable)
 * @param mediaType The type of media (image, video, audio)
 * @param component The component where the error occurred
 * @param details Any additional details about the error
 */
export function reportMediaError(
  url: string | null | undefined,
  errorType: string,
  retryCount: number = 0,
  mediaType: string = 'unknown',
  component: string = 'unknown',
  details?: any
): void {
  console.error(`Media Error [${errorType}] in ${component}:`, {
    url, 
    mediaType,
    retryCount,
    details
  });
  
  // Here you would normally send this data to your monitoring service
  // For example:
  // analyticsService.trackMediaError({...})
  
  const errorReport: MediaErrorReport = {
    url,
    errorType,
    retryCount,
    mediaType,
    component,
    details,
    timestamp: Date.now()
  };
  
  // In the future, we could implement:
  // 1. Send to analytics/monitoring service
  // 2. Store locally for periodic batch uploads
  // 3. Trigger fallback mechanisms based on error patterns
}

/**
 * Reports successful media loading for monitoring and analytics
 * 
 * @param url The URL of the media that was successfully loaded
 * @param loadTime Time taken to load the media in milliseconds
 * @param mediaType The type of media (image, video, audio)
 * @param component The component where the media was loaded
 */
export function reportMediaSuccess(
  url: string | null | undefined,
  loadTime: number,
  mediaType: string = 'unknown',
  component: string = 'unknown'
): void {
  console.log(`Media Loaded Successfully [${mediaType}] in ${component}:`, {
    url,
    loadTime: `${loadTime}ms`,
  });
  
  // Here you would normally send this data to your monitoring service
  // For example:
  // analyticsService.trackMediaSuccess({...})
  
  const successReport: MediaSuccessReport = {
    url,
    loadTime,
    mediaType,
    component,
    timestamp: Date.now()
  };
  
  // This data can be used for:
  // 1. Performance monitoring
  // 2. Content delivery optimization
  // 3. User experience analytics
}
