
/**
 * Helper function to safely get a playable URL from a string or array of strings
 * This can be used throughout the app to handle media URLs correctly
 */
export function getPlayableMediaUrl(url: string | string[] | undefined | null): string {
  if (!url) return '';
  
  if (Array.isArray(url)) {
    return url.length > 0 ? processMediaUrl(url[0]) : '';
  }
  
  return processMediaUrl(url);
}

/**
 * Helper function to safely get the first URL from a string or array of strings
 */
export function getFirstUrl(url: string | string[] | undefined | null): string {
  if (!url) return '';
  
  if (Array.isArray(url)) {
    return url.length > 0 ? url[0] : '';
  }
  
  return url;
}

/**
 * Helper function to extract all media URLs from a message
 */
export function extractMediaUrls(message: any): string[] {
  if (!message) return [];
  
  // Look for media_url array
  if (Array.isArray(message.media_url)) {
    return message.media_url;
  }
  
  // Look for media_url string
  if (typeof message.media_url === 'string') {
    return [message.media_url];
  }
  
  // Look for video_url
  if (message.video_url) {
    if (Array.isArray(message.video_url)) {
      return message.video_url;
    } else {
      return [message.video_url];
    }
  }
  
  return [];
}

/**
 * Helper function to determine if a message has media attachments
 */
export function hasMediaAttachment(message: any): boolean {
  return !!(
    message.media_url || 
    message.video_url || 
    message.media_urls?.length || 
    message.video_urls?.length
  );
}

/**
 * Adds cache busting parameters to a URL
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
}

/**
 * Process media URL to make it playable
 * This is the core function for URL processing to avoid circular dependencies
 */
function processMediaUrl(url: string): string {
  if (!url) return '';
  
  // Handle URL without protocol
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  // Add protocol if missing
  if (!url.startsWith('http') && !url.startsWith('blob:') && !url.startsWith('data:')) {
    return `https://${url}`;
  }
  
  // Add cache buster to help with media loading issues
  return addCacheBuster(url);
}
