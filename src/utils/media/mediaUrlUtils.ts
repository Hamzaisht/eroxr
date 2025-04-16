
/**
 * A unified utility for processing media URLs to ensure they load correctly
 */

/**
 * Add cache busting parameter to URL to prevent browser caching
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  // Parse the URL to handle query parameters correctly
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('t', Date.now().toString());
    return urlObj.toString();
  } catch (e) {
    console.error('Error adding cache buster to URL:', e);
    return url;
  }
};

/**
 * Clean up a URL by removing duplicate query parameters
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (e) {
    console.error('Error cleaning URL:', e);
    return url;
  }
};

/**
 * Get a direct playable URL for media that works reliably
 */
export const getDirectMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  try {
    // Clean the URL
    const cleanUrl = getCleanUrl(url);
    
    // Add cache busting to ensure fresh content
    return addCacheBuster(cleanUrl);
  } catch (e) {
    console.error('Error processing media URL:', e);
    return url;
  }
};

/**
 * Extract URL from a media object or string
 */
export const extractMediaUrl = (media: any): string => {
  if (!media) return '';
  
  // Handle direct string input
  if (typeof media === 'string') {
    return getDirectMediaUrl(media);
  }
  
  // Extract URL from object based on common properties
  const url = 
    media.video_url || 
    (Array.isArray(media.video_urls) && media.video_urls.length > 0 ? media.video_urls[0] : null) ||
    media.media_url ||
    (Array.isArray(media.media_urls) && media.media_urls.length > 0 ? media.media_urls[0] : null) ||
    media.url ||
    '';
  
  return getDirectMediaUrl(url);
};

/**
 * Check URL accessibility and return detailed information
 */
export const checkUrlAccessibility = async (url: string): Promise<{ 
  accessible: boolean; 
  status?: number;
  contentType?: string;
  error?: string;
}> => {
  try {
    if (!url) return { accessible: false, error: 'No URL provided' };
    
    // If it's a blob or data URL, assume it's accessible
    if (url.startsWith('blob:') || url.startsWith('data:')) {
      return { accessible: true };
    }
    
    // Try fetch with HEAD request first
    const response = await fetch(url, { 
      method: 'HEAD',
      cache: 'no-store',
      mode: 'cors'
    });
    
    return { 
      accessible: response.ok, 
      status: response.status,
      contentType: response.headers.get('content-type') || undefined
    };
  } catch (error) {
    console.error('Error checking URL accessibility:', error);
    return { 
      accessible: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
};
