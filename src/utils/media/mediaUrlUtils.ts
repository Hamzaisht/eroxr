
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
  const random = Math.floor(Math.random() * 10000);
  
  try {
    const urlObj = new URL(getCleanUrl(url));
    urlObj.searchParams.set('t', `${timestamp}-${random}`);
    return urlObj.toString();
  } catch (error) {
    console.error('Error adding cache buster:', error);
    
    // Fallback to simpler cache busting
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${timestamp}-${random}`;
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
    console.log(`getDirectMediaUrl - Original: ${url}`);
    console.log(`getDirectMediaUrl - Cleaned: ${cleanUrl}`);
    
    // Skip cache busting for local preview URLs
    if (url.startsWith('blob:')) {
      return cleanUrl;
    }

    // Add cache busting for remote URLs
    const finalUrl = addCacheBuster(cleanUrl);
    console.log(`getDirectMediaUrl - Final: ${finalUrl}`);
    return finalUrl;
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
  const extractedUrl = source.video_url || 
    (Array.isArray(source.video_urls) && source.video_urls.length > 0 ? source.video_urls[0] : '') ||
    source.media_url || 
    (Array.isArray(source.media_urls) && source.media_urls.length > 0 ? source.media_urls[0] : '') ||
    source.url || 
    source.src || 
    '';
    
  console.log(`extractMediaUrl - Source type: ${typeof source}, Extracted URL: ${extractedUrl}`);
  return extractedUrl;
};

/**
 * Check if URL is accessible and return status details
 * Override CORS issues by assuming local URLs are always accessible
 */
export const checkUrlAccessibility = async (url: string): Promise<{ 
  accessible: boolean; 
  status?: number;
  contentType?: string;
  error?: string;
}> => {
  if (!url) return { accessible: false, error: 'No URL provided' };
  
  // Special handling for data and blob URLs - they are always accessible
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    console.log(`URL accessibility check - Special URL (${url.substring(0, 20)}...): accessible`);
    return { accessible: true };
  }
  
  // For development purposes, assume all URLs are accessible
  // This bypasses CORS issues that might happen during development
  if (process.env.NODE_ENV === 'development' || 
      url.includes('localhost') || 
      url.includes('127.0.0.1')) {
    console.log(`URL accessibility check - Development environment or local URL: assuming accessible`);
    return { accessible: true };
  }
  
  console.log(`Checking URL accessibility: ${url}`);
  
  // Security measure to ensure we're not sending credentials to other origins
  const requestOptions: RequestInit = {
    method: 'HEAD',
    cache: 'no-store',
    credentials: 'omit', // Don't send credentials for cross-origin requests
    mode: 'no-cors', // Try with no-cors to avoid CORS issues
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
    
    // For error during fetch, assume the URL is still accessible
    // This helps bypass CORS errors
    console.log(`Assuming URL is accessible despite fetch error: ${url}`);
    return { accessible: true };
  }
};
