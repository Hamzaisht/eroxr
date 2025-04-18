
/**
 * URL utilities for media handling
 */

/**
 * Extracts file extension from a URL or path
 */
export const getFileExtension = (url: string): string | null => {
  if (!url) return null;
  
  try {
    const pathname = new URL(url, 'https://example.com').pathname;
    const extension = pathname.split('.').pop()?.toLowerCase();
    return extension || null;
  } catch {
    // If URL parsing fails, try simple string operations
    const extension = url.split('.').pop()?.toLowerCase();
    if (extension?.includes('/')) {
      return null;
    }
    return extension || null;
  }
};

/**
 * Gets a playable media URL, handling various URL formats
 */
export const getPlayableMediaUrl = (source: any): string => {
  if (!source) return '';

  // If source is a string, return it directly
  if (typeof source === 'string') return source;

  // Try to extract URL from object based on common properties
  if (typeof source === 'object') {
    return source.url ||
           source.video_url || 
           source.media_url?.[0] || 
           source.thumbnail_url ||
           source.profile_url ||
           source.avatar_url || '';
  }

  return '';
};

/**
 * Add cache buster to URL to prevent caching issues
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
};

/**
 * Converts relative URL to absolute URL
 */
export const toAbsoluteUrl = (url: string, base?: string): string => {
  if (!url) return '';
  
  try {
    // If URL is already absolute, return it
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If URL starts with //, add https:
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    // Use base URL if provided, otherwise use window.location
    const baseUrl = base || (typeof window !== 'undefined' ? window.location.origin : '');
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
};
