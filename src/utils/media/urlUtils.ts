
/**
 * Get file extension from a filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Make URL playable by various players
 */
export const getPlayableMediaUrl = (url: string): string => {
  // Add proxying, transformations, or other processing here if needed
  return url;
};

/**
 * Add cache buster to URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${new Date().getTime()}`;
};

/**
 * Convert to absolute URL
 */
export const toAbsoluteUrl = (url: string): string => {
  if (!url) return url;
  
  if (url.startsWith('http')) {
    return url;
  }
  
  // Convert relative URL to absolute
  const baseUrl = window.location.origin;
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
};
