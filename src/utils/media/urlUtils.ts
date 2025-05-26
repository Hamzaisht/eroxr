
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
  return ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension);
};

/**
 * Determines if a URL is for an image file
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'].includes(extension);
};

/**
 * Determines if a URL is for an audio file
 */
export const isAudioUrl = (url: string): boolean => {
  if (!url) return false;
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['mp3', 'wav', 'ogg', 'aac'].includes(extension);
};
