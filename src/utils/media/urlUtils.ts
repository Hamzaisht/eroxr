/**
 * Extract media URL from different types of media objects
 */
export function extractMediaUrl(media: any): string {
  if (!media) return '';
  
  // If it's already a string, assume it's a URL
  if (typeof media === 'string') return media;
  
  // Check for different URL properties
  return media.url || 
         media.media_url || 
         media.video_url || 
         media.image_url || 
         media.thumbnail_url || 
         '';
}

/**
 * Add cache buster to URL to prevent caching issues
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_cb=${Date.now()}`;
}

/**
 * Get a playable media URL with cache busting
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  return addCacheBuster(url);
}

/**
 * Convert a relative URL to an absolute URL if needed
 */
export function ensureAbsoluteUrl(url: string): string {
  if (!url) return '';
  
  // If URL is already absolute, return it
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If it's a data URL, return it
  if (url.startsWith('data:')) {
    return url;
  }
  
  // If it's a blob URL, return it
  if (url.startsWith('blob:')) {
    return url;
  }
  
  // Otherwise, assume it's relative to the base URL
  const baseUrl = window.location.origin;
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
}

/**
 * Check if a URL is for an image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension);
}

/**
 * Check if a URL is for a video
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension);
}

/**
 * Check if a URL is for an audio file
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  return ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension);
}
