
/**
 * Utilities for processing and validating media URLs
 */

/**
 * Prepare a media URL for display by ensuring it has a proper protocol
 * and handling various URL formats
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  let processedUrl = url;
  
  // Handle protocol-relative URLs (starting with //)
  if (url.startsWith('//')) {
    processedUrl = `https:${url}`;
  } 
  // Add protocol if missing
  else if (!url.startsWith('http://') && !url.startsWith('https://')) {
    processedUrl = `https://${url}`;
  }
  
  // Add cache busting parameter if needed to prevent caching issues
  if (processedUrl.includes('?')) {
    processedUrl += `&t=${Date.now()}`;
  } else {
    processedUrl += `?t=${Date.now()}`;
  }
  
  return processedUrl;
};

/**
 * Validates that a string is a valid URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url.startsWith('//') ? `https:${url}` : url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Extract the file extension from a URL
 */
export const getFileExtension = (url: string): string => {
  try {
    const path = new URL(url).pathname;
    const extension = path.split('.').pop();
    return extension ? extension.toLowerCase() : '';
  } catch (e) {
    // Try to get extension without URL parsing
    const parts = url.split('.');
    return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
  }
};

/**
 * Check if a URL is likely a media file based on its extension
 */
export const isMediaUrl = (url: string): boolean => {
  if (!url) return false;
  
  const extension = getFileExtension(url);
  const mediaExtensions = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg',  // Images
    'mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv',   // Videos
    'mp3', 'wav', 'ogg', 'flac', 'aac'           // Audio
  ];
  
  return mediaExtensions.includes(extension);
};

/**
 * Generate a thumbnail URL from a video URL (if possible)
 */
export const getThumbnailUrl = (videoUrl: string): string | null => {
  if (!videoUrl) return null;
  
  // For Supabase storage URLs
  if (videoUrl.includes('supabase.co/storage/v1/object/public')) {
    // Try to guess a thumbnail by replacing the file extension
    const extension = getFileExtension(videoUrl);
    if (extension) {
      return videoUrl.replace(`.${extension}`, '.jpg');
    }
  }
  
  return null;
};

/**
 * Clean and prepare URLs for cross-origin requests
 */
export const prepareCrossOriginUrl = (url: string): string => {
  let processedUrl = getPlayableMediaUrl(url);
  
  // Add CORS proxy for external resources if needed
  // This would need to be implemented on the server side
  
  return processedUrl;
};
