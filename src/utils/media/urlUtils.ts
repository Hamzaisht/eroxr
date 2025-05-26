
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's already a complete URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a relative path, construct the full URL
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
};

/**
 * Adds cache busting parameters to a URL
 */
export const addCacheBuster = (url: string): string => {
  if (!url) return url;
  
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return url.includes('?') 
    ? `${url}&t=${timestamp}&r=${random}` 
    : `${url}?t=${timestamp}&r=${random}`;
};

/**
 * Determines if a URL is for a video file
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'].includes(extension);
};

/**
 * Determines if a URL is for an image file
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif', 'svg'].includes(extension);
};

/**
 * Determines if a URL is for an audio file
 */
export const isAudioUrl = (url: string): boolean => {
  if (!url) return false;
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension);
};

/**
 * Cleans and validates media URLs
 */
export const cleanMediaUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove whitespace
    url = url.trim();
    
    // If it's a valid URL, return it
    new URL(url);
    return url;
  } catch {
    // If not a valid URL but has content, try to construct one
    if (url && !url.startsWith('http')) {
      return getPlayableMediaUrl(url);
    }
    return url;
  }
};

/**
 * Validates if a URL is accessible
 */
export const validateMediaUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};
