
/**
 * Get file extension from URL or filename
 */
export const getFileExtension = (url: string): string | null => {
  if (!url) return null;
  
  // Remove query parameters and get the last part of URL
  const filename = url.split('?')[0].split('/').pop();
  
  if (!filename) return null;
  
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension || null;
};

/**
 * Convert relative URL to absolute URL
 */
export const toAbsoluteUrl = (url: string): string => {
  if (!url) return '';
  
  // Check if URL is already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative URLs
  return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Add cache busting parameter to URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Create a URL that can be played directly in browser elements
 */
export const getPlayableMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Handle Supabase storage URLs
  if (url.includes('supabase')) {
    // Storage URLs are already configured for direct play/view
    return url;
  }
  
  return toAbsoluteUrl(url);
};
