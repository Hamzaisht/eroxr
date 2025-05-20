
/**
 * Report media errors for monitoring and analytics
 * 
 * @param url The URL of the media that failed
 * @param errorType Type of error that occurred
 * @param retryCount Number of times retry was attempted
 * @param mediaType Type of media (image, video, etc)
 * @param component Component where the error occurred
 */
export function reportMediaError(
  url: string,
  errorType: 'load_failure' | 'playback_error' | 'network_error' | 'timeout' | 'other',
  retryCount: number,
  mediaType: string,
  component: string
): void {
  // Log the error for local debugging
  console.error('Media Error Report:', {
    url,
    errorType,
    retryCount,
    mediaType,
    component,
    timestamp: new Date().toISOString(),
  });

  // In a production app, this would send data to an analytics service
  // For now, we'll just log it to the console
}

/**
 * Track media playback events for analytics
 */
export function trackMediaPlayback(
  mediaId: string,
  action: 'play' | 'pause' | 'seek' | 'complete',
  position: number,
  duration: number
): void {
  // Log the playback event
  console.log('Media Playback Event:', {
    mediaId,
    action,
    position,
    duration,
    timestamp: new Date().toISOString(),
  });
  
  // In a production app, this would send data to an analytics service
}
