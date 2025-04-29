
/**
 * Utilities for processing and validating media URLs
 */

/**
 * Clean up a URL to ensure it's properly formatted
 */
export const getCleanUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  // Handle protocol-less URLs (//example.com/image.jpg)
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  
  try {
    // If it's already a valid URL, just return it stringified
    if (url.match(/^[a-z]+:\/\//i)) {
      return new URL(url).toString();
    }
    
    // If no protocol, add https:// and parse
    if (!url.match(/^[a-z]+:\/\//i)) {
      return new URL(`https://${url}`).toString();
    }
    
    // Default case
    return url;
  } catch (error) {
    // If URL parsing fails, it might be a relative path
    console.error('Error cleaning URL:', url, error);
    
    // Check if it's a relative path and convert to absolute
    if (url.startsWith('/')) {
      return `${window.location.origin}${url}`;
    }
    
    return url;
  }
};

/**
 * Add cache busting parameter to prevent browser caching
 */
export const addCacheBuster = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;
  
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const cacheBuster = `cb=${timestamp}-${random}`;
  
  try {
    const urlObj = new URL(getCleanUrl(url));
    urlObj.searchParams.set('t', `${timestamp}-${random}`);
    return urlObj.toString();
  } catch (error) {
    // Fallback to simpler cache busting
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${cacheBuster}`;
  }
};

/**
 * Get direct media URL with proper formatting
 * This is the main function that should be used to process media URLs
 */
export const getPlayableMediaUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  
  // Handle special URLs
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  
  try {
    // Clean the URL
    const cleanUrl = getCleanUrl(url);
    
    // Skip cache busting for special URLs
    if (url.startsWith('blob:') || process.env.NODE_ENV !== 'production') {
      return cleanUrl;
    }

    // Add cache busting for remote URLs in production
    return addCacheBuster(cleanUrl);
  } catch (error) {
    console.error('Error processing media URL:', error);
    return url;
  }
};

/**
 * Check if URL is likely to be a video
 */
export const isVideoUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Check file extension
  if (url.match(/\.(mp4|webm|mov|m4v|avi)($|\?)/i)) return true;
  
  // Check common video path patterns
  if (url.includes('/videos/') || 
      url.includes('/video/') || 
      url.includes('/shorts/') ||
      url.includes('stream')) {
    return true;
  }
  
  return false;
};

/**
 * Check if URL is likely to be an image
 */
export const isImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  
  // Check file extension
  if (url.match(/\.(jpe?g|png|gif|webp|avif|svg|bmp)($|\?)/i)) return true;
  
  // Check common image path patterns
  if (url.includes('/images/') || 
      url.includes('/img/') || 
      url.includes('/photos/')) {
    return true;
  }
  
  return false;
};
