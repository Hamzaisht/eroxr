
import { MediaSource } from './types';

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
  return source.video_url || 
         source.media_url || 
         source.url || 
         source.src || 
         (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null) ||
         (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null) ||
         null;
}

/**
 * Process a media URL to ensure it's playable
 * @param url - Raw media URL
 * @returns Processed URL for playback
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // Handle special cases for different hosting providers
  
  // Supabase storage URLs
  if (url.includes('storage.googleapis.com') || url.includes('supabase.co/storage/v1/object/public')) {
    // Ensure proper caching parameters
    return url.includes('?') ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
  }
  
  // Custom CDN URLs
  if (url.includes('cdn.eroxr.se')) {
    return url.includes('?') ? url : `${url}?quality=high`;
  }
  
  // URLs with special encoding
  if (url.includes('%')) {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.warn('Failed to decode URL:', url);
      return url;
    }
  }
  
  return url;
}
