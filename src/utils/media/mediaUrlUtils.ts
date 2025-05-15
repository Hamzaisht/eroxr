
import { MediaSource } from './types';

/**
 * Extract a media URL from a MediaSource object or string
 * @param source - MediaSource object or URL string
 * @returns Extracted URL or null if no URL found
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string | null {
  if (!source) return null;
  
  // If source is already a string, return it
  if (typeof source === 'string') {
    return source;
  }
  
  // Try all possible URL fields in the MediaSource object
  return source.url || 
         source.video_url || 
         source.media_url || 
         source.image_url ||
         (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null) ||
         (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
         null;
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
