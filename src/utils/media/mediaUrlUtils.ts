
/**
 * Comprehensive media URL handling utilities
 */

/**
 * Adds cache busting parameter to URL
 * @param url - The URL to add the cache buster to
 * @returns The URL with a cache buster parameter
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}cb=${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Clean and normalize a URL to ensure it's properly formatted
 * @param url - The URL to clean
 * @returns A cleaned and normalized URL
 */
export function normalizeMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  try {
    // Try to create a proper URL object
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (error) {
    // If invalid URL, attempt to fix common issues
    
    // Check if it's a relative path
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    
    // Add protocol if missing
    if (!url.match(/^[a-z]+:\/\//i)) {
      return `https://${url}`;
    }
    
    console.warn('Could not normalize URL:', url);
    return url;
  }
}

/**
 * Builds a media URL with proper parameters for playback and viewing
 * @param url - The source URL to process
 * @returns A fully prepared media URL ready for display
 */
export function buildPlayableMediaUrl(url: string | null | undefined): string {
  const normalized = normalizeMediaUrl(url);
  if (!normalized) return '';
  
  // Skip cache busting for local blob URLs and data URLs
  if (normalized.startsWith('blob:') || normalized.startsWith('data:')) {
    return normalized;
  }
  
  // Add cache buster to help with media loading issues
  return addCacheBuster(normalized);
}

/**
 * Extract a direct media URL from various source formats
 * @param source - The source object or string
 * @returns The extracted URL or empty string
 */
export function extractMediaUrl(source: any): string {
  if (!source) return '';
  
  // Direct string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from media object with priority order
  const extractedUrl = 
    // Try video URLs first
    (source.video_url) || 
    (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
    // Then try media URLs
    (source.media_url) || 
    (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
    // Finally try generic URL properties
    (source.url) || 
    (source.src) || 
    '';
    
  return extractedUrl;
}

/**
 * Get a complete playable media URL
 * @param source - Any media source (string, object, etc.)
 * @returns A ready-to-use media URL
 */
export function getPlayableUrl(source: any): string {
  // Extract the URL from the source
  const extractedUrl = extractMediaUrl(source);
  
  // Build the final playable URL
  return buildPlayableMediaUrl(extractedUrl);
}

/**
 * Handle fallbacks for failed media loading
 * @param primary - The primary media URL
 * @param fallbacks - Array of fallback URLs to try
 * @returns The first working URL or the primary URL
 */
export async function getWithFallbacks(
  primary: string,
  fallbacks: string[] = []
): Promise<string> {
  // Always return the primary URL without checking if there are no fallbacks
  if (!fallbacks.length) return primary;
  
  try {
    // Try to load the primary URL
    const response = await fetch(primary, { 
      method: 'HEAD', 
      cache: 'no-store',
      mode: 'no-cors'
    });
    
    if (response.ok) {
      return primary;
    }
    
    // Try each fallback
    for (const fallback of fallbacks) {
      if (!fallback) continue;
      
      try {
        const fallbackResponse = await fetch(fallback, { 
          method: 'HEAD', 
          cache: 'no-store',
          mode: 'no-cors'
        });
        
        if (fallbackResponse.ok) {
          return fallback;
        }
      } catch (e) {
        // Continue to next fallback
        console.warn('Fallback URL failed:', fallback);
      }
    }
  } catch (e) {
    // Fetch failed, just return the primary URL
    console.warn('URL check failed:', e);
  }
  
  // Return the primary URL if all checks fail
  return primary;
}

/**
 * Check if a URL points to a valid media resource
 * @param url - The URL to check
 * @returns Promise resolving to a boolean indicating if the URL is valid
 */
export async function isValidMediaUrl(url: string): Promise<boolean> {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { 
      method: 'HEAD', 
      mode: 'no-cors',
      cache: 'no-store' 
    });
    return true; // If no-cors didn't throw, assume it's valid
  } catch (e) {
    console.error('Media URL validation failed:', e);
    return false;
  }
}
