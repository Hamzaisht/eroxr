
import { MediaType } from './types';

/**
 * Check if a URL is valid
 * @param url URL to check
 * @returns boolean
 */
export function isValidUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Get an optimized image URL with width and height parameters
 * @param url Original image URL
 * @param width Target width
 * @param height Target height
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(url: string, width?: number, height?: number): string {
  if (!url) return '';
  
  try {
    // Parse URL
    const urlObj = new URL(url);
    
    // Only process storage URLs
    if (!url.includes('storage/v1/object')) {
      return url;
    }
    
    // Add dimensions if provided
    if (width) {
      urlObj.searchParams.set('width', width.toString());
    }
    
    if (height) {
      urlObj.searchParams.set('height', height.toString());
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error optimizing image URL:', error);
    return url;
  }
}

/**
 * Check if a URL points to a video
 * @param url URL to check
 * @returns boolean
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|avi|mkv)($|\?)/i.test(url);
}

/**
 * Check if a URL points to an image
 * @param url URL to check
 * @returns boolean
 */
export function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(jpe?g|png|gif|webp|svg|avif)($|\?)/i.test(url);
}

/**
 * Check if a URL points to an audio file
 * @param url URL to check
 * @returns boolean
 */
export function isAudioUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp3|wav|ogg|aac|flac|m4a)($|\?)/i.test(url);
}

/**
 * Get a playable media URL with cache busting
 * @param url Input URL
 * @returns Processed URL ready for playback
 */
export function getPlayableMediaUrl(url: string): string {
  if (!url) return '';
  
  // For Supabase storage URLs, add cache busting
  if (url.includes('storage/v1/object') && !url.includes('?t=')) {
    const separator = url.includes('?') ? '&' : '?';
    const timestamp = Date.now();
    return `${url}${separator}t=${timestamp}`;
  }
  
  return url;
}
