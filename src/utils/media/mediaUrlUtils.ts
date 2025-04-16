/**
 * Utilities for processing and validating media URLs
 */

/**
 * Clean up a URL to ensure it's properly formatted
 */
export const getCleanUrl = (url: string): string => {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, it might be a relative path
    console.error('Error cleaning URL:', url, error);
    
    // Check if it's a relative path and convert to absolute
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }

    // Try prepending https:// if no protocol
    if (!url.match(/^[a-z]+:\/\//i)) {
      return `https://${url}`;
    }
    
    return url;
  }
};

/**
 * Add cache busting parameter to prevent browser caching
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  const timestamp = Date.now();
  
  try {
    const urlObj = new URL(getCleanUrl(url));
    urlObj.searchParams.set('t', timestamp.toString());
    return urlObj.toString();
  } catch (error) {
    console.error('Error adding cache buster:', error);
    
    // Fallback to simpler cache busting
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}`;
  }
};

/**
 * Get direct media URL with proper formatting
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
    
    // Add cache busting
    return addCacheBuster(cleanUrl);
  } catch (error) {
    console.error('Error processing media URL:', error);
    return url;
  }
};

/**
 * Extract a direct media URL from a variety of sources
 * Used by components to get URLs from various source formats
 */
export const extractMediaUrl = (source: any): string => {
  if (!source) return '';
  
  // Direct string URL
  if (typeof source === 'string') {
    return source;
  }
  
  // Extract from media object with priority order
  return source.video_url || 
         (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
         source.media_url || 
         (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
         source.url || 
         source.src || 
         '';
};

/**
 * Check if URL is accessible and return status details
 */
export const checkUrlAccessibility = async (url: string): Promise<{ 
  accessible: boolean; 
  status?: number;
  contentType?: string;
  error?: string;
}> => {
  if (!url) return { accessible: false, error: 'No URL provided' };
  
  // Special handling for data and blob URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return { accessible: true };
  }
  
  // Security measure to ensure we're not sending credentials to other origins
  const requestOptions: RequestInit = {
    method: 'HEAD',
    cache: 'no-store',
    credentials: 'omit', // Don't send credentials for cross-origin requests
  };
  
  try {
    // First try with HEAD request for efficiency
    const response = await fetch(url, requestOptions);
    
    console.log(`URL accessibility check for ${url}: status ${response.status}`);
    
    return { 
      accessible: response.ok, 
      status: response.status,
      contentType: response.headers.get('content-type') || undefined
    };
  } catch (error) {
    console.error('Error checking URL accessibility:', url, error);
    
    // Attempt with GET as fallback (some servers don't support HEAD)
    try {
      const getResponse = await fetch(url, { 
        method: 'GET', 
        cache: 'no-store',
        credentials: 'omit'
      });
      
      return { 
        accessible: getResponse.ok, 
        status: getResponse.status,
        contentType: getResponse.headers.get('content-type') || undefined
      };
    } catch (secondError) {
      console.error('Failed GET fallback check:', url, secondError);
      return { 
        accessible: false, 
        error: secondError instanceof Error ? secondError.message : String(secondError)
      };
    }
  }
};
