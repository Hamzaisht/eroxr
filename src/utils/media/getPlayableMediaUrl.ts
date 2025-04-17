
/**
 * Utility function to get a playable media URL
 * This handles various URL formats and ensures that videos can be played
 * 
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
  if (url.includes('?')) {
    return `${url}&_t=${Date.now()}`;
  } else {
    return `${url}?_t=${Date.now()}`;
  }
};

/**
 * Gets a direct media URL that can be used without caching issues
 * @param url The original media URL
 * @returns A direct URL that bypasses caching
 */
export const getDirectMediaUrl = (url: string): string => {
  return getPlayableMediaUrl(url);
};
