
/**
 * Adds a cache buster parameter to a URL to prevent caching
 * @param url The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  // Generate a timestamp for cache busting
  const cacheBuster = `_cb=${Date.now()}`;
  
  // Check if the URL already has query parameters
  const separator = url.includes('?') ? '&' : '?';
  
  return `${url}${separator}${cacheBuster}`;
};

/**
 * Ensures a URL is playable by adding any needed params or transformations
 * @param url The URL to process
 * @returns A playable URL
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // For certain storage providers, we might need to add additional parameters
  // For example, some providers require a specific token or format
  
  // For now, just add a cache buster to ensure fresh content
  return addCacheBuster(url);
};
