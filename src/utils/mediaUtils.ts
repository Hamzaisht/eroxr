
/**
 * Adds a timestamp to a URL to prevent caching
 */
export const getUrlWithCacheBuster = (url: string | null): string | null => {
  if (!url) return null;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Tries to regenerate a fresh URL for media content
 */
export const refreshUrl = (url: string): string => {
  // Remove any existing cache busters
  let freshUrl = url.split('?')[0];
  
  // Generate a new timestamp
  return `${freshUrl}?refresh=${Date.now()}`;
};

/**
 * Determines the media type based on URL or file extension
 */
export const getMediaType = (url: string): 'video' | 'gif' | 'image' => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.endsWith('.mp4') || 
      lowerUrl.endsWith('.webm') || 
      lowerUrl.endsWith('.mov') ||
      lowerUrl.includes('video')) {
    return 'video';
  }
  
  if (lowerUrl.endsWith('.gif')) {
    return 'gif';
  }
  
  return 'image';
};
