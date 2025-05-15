
import { MediaSource } from './types';

/**
 * Extract the media URL from a MediaSource object or string
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
         (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null) ||
         (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
         null;
}

/**
 * Get a playable media URL by handling special cases
 */
export function getPlayableMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Handle special URL types or transformations here
  
  // Handle Supabase URLs
  if (url.includes('storage.googleapis.com') || url.includes('supabase.co/storage/v1/object/public')) {
    // Ensure proper caching parameters
    return url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
  }
  
  return url;
}

/**
 * Add a cache buster to a URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return url;
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
}

/**
 * Convert a relative URL to an absolute URL
 */
export function toAbsoluteUrl(url: string): string {
  if (!url) return url;
  
  // If already absolute, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Handle relative URLs
  const baseUrl = window.location.origin;
  
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  
  return `${baseUrl}/${url}`;
}

/**
 * Check if URL exists and is accessible
 */
export async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Checks if a URL points to an image
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = getFileExtension(url).toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  
  return imageExtensions.includes(extension);
}

/**
 * Checks if a URL points to a video
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = getFileExtension(url).toLowerCase();
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'm4v', 'mkv'];
  
  return videoExtensions.includes(extension);
}

/**
 * Extracts a file extension from a URL
 */
export function getFileExtension(url: string): string {
  if (!url) return '';
  
  // Extract the filename from the URL
  const filename = url.split('/').pop() || '';
  
  // If there's a query string, remove it
  const filenameWithoutQuery = filename.split('?')[0];
  
  // Extract extension
  const parts = filenameWithoutQuery.split('.');
  if (parts.length > 1) {
    return parts.pop() || '';
  }
  
  return '';
}
