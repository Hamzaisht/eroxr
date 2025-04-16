
/**
 * Utilities for working with media URLs
 */

/**
 * Check if URL is an image based on extension or content type
 */
export function isImageUrl(url: string): boolean {
  const lowercaseUrl = url.toLowerCase();
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg|avif|tiff|heic)($|\?)/.test(lowercaseUrl) ||
         lowercaseUrl.includes('image/');
}

/**
 * Check if URL is a video based on extension or content type
 */
export function isVideoUrl(url: string): boolean {
  const lowercaseUrl = url.toLowerCase();
  return /\.(mp4|webm|mkv|avi|mov|flv|wmv|3gp|m4v)($|\?)/.test(lowercaseUrl) ||
         lowercaseUrl.includes('video/');
}

/**
 * Check if URL is an audio file
 */
export function isAudioUrl(url: string): boolean {
  const lowercaseUrl = url.toLowerCase();
  return /\.(mp3|wav|ogg|m4a|flac|aac)($|\?)/.test(lowercaseUrl) ||
         lowercaseUrl.includes('audio/');
}

/**
 * Add cache busting parameter to URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const cacheBuster = `t=${Date.now()}`;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${cacheBuster}`;
}

/**
 * Ensures URL includes protocol (https)
 */
export function ensureFullUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `https://${url}`;
}

/**
 * Process media URL to make it playable
 */
export function getPlayableMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Don't process blob or data URLs 
  if (url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Add cache buster to avoid browser caching issues
  return addCacheBuster(url);
}

/**
 * Get a stable URL without cache busting parameters for comparing URLs
 */
export function getStableUrl(url: string): string {
  if (!url) return '';
  return url.split('?')[0];
}
