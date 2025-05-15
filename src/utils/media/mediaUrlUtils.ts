
/**
 * Utilities for transforming and processing media URLs
 */

/**
 * Gets a URL that can be played in the browser
 * This function handles various URL formats and ensures they're playable
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Check if URL needs processing
  if (url.includes('supabase.co') || url.includes('supabase.in')) {
    // Add cache buster if needed for Supabase URLs
    const hasParams = url.includes('?');
    return `${url}${hasParams ? '&' : '?'}t=${Date.now()}`;
  }
  
  return url;
}

/**
 * Add cache buster to URL to prevent caching issues
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const hasParams = url.includes('?');
  return `${url}${hasParams ? '&' : '?'}t=${Date.now()}`;
}

/**
 * Process URL for thumbnail display
 */
export function getThumbnailUrl(url: string): string {
  if (!url) return '';
  
  // Add thumbnail processing logic here if needed
  return url;
}

