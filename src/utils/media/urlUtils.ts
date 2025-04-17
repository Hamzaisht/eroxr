
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

/**
 * Gets a playable media URL (used in video/audio elements)
 * @param url The original media URL
 * @returns A URL that can be used in video or img elements
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle already processed URLs
  if (url.startsWith('blob:') || 
      url.startsWith('data:') || 
      url.startsWith('http://localhost') ||
      url.startsWith('http://127.0.0.1')) {
    return url;
  }
  
  // Handle Supabase storage URLs
  if (url.includes('supabase.co/storage/v1/object/public/')) {
    return url;
  }
  
  // Handle relative URLs
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }

  // Add timestamp to bust cache if needed
  return addCacheBuster(url);
};

/**
 * Ensures a URL is a full absolute URL
 * @param url Possibly relative URL
 * @returns Absolute URL
 */
export const ensureFullUrl = (url: string): string => {
  if (!url) return '';
  
  // Already absolute URL
  if (url.match(/^(https?:\/\/|blob:|data:)/i)) {
    return url;
  }
  
  // Convert relative URL to absolute using window location
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  // Assume it's a path relative to the current path
  return `${window.location.origin}/${url}`;
};
