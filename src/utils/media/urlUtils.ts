
/**
 * Adds a cache-buster parameter to a URL
 * @param url The URL to add cache-buster to
 * @returns URL with cache-buster parameter
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  // Don't add cache buster to blob URLs or data URLs
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
};

/**
 * Ensures media URL is safe and properly formatted
 * @param url Raw URL string
 * @returns Processed URL ready for use
 */
export const getSafeMediaUrl = (url: string | null): string => {
  if (!url) return '';
  
  // Process URLs for different sources
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Add cache buster to regular URLs
  return addCacheBuster(url);
};
