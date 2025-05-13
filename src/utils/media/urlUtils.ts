
import { MediaSource } from './types';

/**
 * Extract the media URL from a MediaSource object or string
 */
export function extractMediaUrl(source: MediaSource | string): string | null {
  if (typeof source === 'string') {
    return source;
  }
  
  // Try to get the URL from different possible properties
  const url = source.url || source.video_url || source.media_url || source.src;
  
  return url || null;
}

/**
 * Get a playable media URL by handling special cases
 */
export function getPlayableMediaUrl(url: string): string {
  // Handle special URL types or transformations here
  
  // Handle Supabase URLs
  if (url.includes('storage.googleapis.com') && !url.includes('token=')) {
    // This is a likely public Supabase URL, leave it as is
    return url;
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
 * @param url - URL to check
 * @returns True if URL points to an image, false otherwise
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = getFileExtension(url).toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  
  return imageExtensions.includes(extension);
}

/**
 * Checks if a URL points to a video
 * @param url - URL to check
 * @returns True if URL points to a video, false otherwise
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = getFileExtension(url).toLowerCase();
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'm4v', 'mkv'];
  
  return videoExtensions.includes(extension);
}

/**
 * Checks if a URL points to an audio file
 * @param url - URL to check
 * @returns True if URL points to an audio file, false otherwise
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  
  const extension = getFileExtension(url).toLowerCase();
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  return audioExtensions.includes(extension);
}

/**
 * Extracts a file extension from a URL
 * @param url - URL to extract extension from
 * @returns The file extension or an empty string
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
