import { MediaType } from './types';
import { determineMediaType } from './mediaUtils';

/**
 * Check if URL points to a video file
 * @param url URL to check
 * @returns True if it's a video URL
 */
export const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  
  const mediaType = determineMediaType(url);
  return mediaType === MediaType.VIDEO;
};

/**
 * Check if URL points to an image file
 * @param url URL to check
 * @returns True if it's an image URL
 */
export const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  
  const mediaType = determineMediaType(url);
  return mediaType === MediaType.IMAGE || mediaType === MediaType.GIF;
};

/**
 * Check if URL points to an audio file
 * @param url URL to check
 * @returns True if it's an audio URL
 */
export const isAudioUrl = (url: string): boolean => {
  if (!url) return false;
  
  const mediaType = determineMediaType(url);
  return mediaType === MediaType.AUDIO;
};

/**
 * Check if URL is valid
 * @param url URL to check
 * @returns True if URL is valid
 */
export const isValidUrl = (url?: string): boolean => {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || 
           parsedUrl.protocol === 'https:' || 
           parsedUrl.protocol === 'blob:' || 
           parsedUrl.protocol === 'data:';
  } catch (e) {
    // If URL is relative, it's still valid for our purposes
    return url.startsWith('/');
  }
};

/**
 * Get playable media URL (fixes relative paths)
 * @param url The URL to process
 * @returns A properly formatted URL for playback
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Already absolute URL
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('data:')) {
    return url;
  }
  
  // Convert relative URL to absolute
  if (url.startsWith('/')) {
    return `${window.location.origin}${url}`;
  }
  
  return url;
};

/**
 * Generate optimized image URL (for CDNs or responsive sizes)
 * @param url Original image URL
 * @param width Target width
 * @param height Target height
 * @returns Optimized image URL
 */
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url) return '';
  
  // If we're not using a CDN or if it's not an image, return the original URL
  if (!isImageUrl(url)) return url;
  
  // Basic implementation - could be extended with CDN parameters
  // For example with imgix, cloudinary, etc.
  
  // For now, just return the original URL
  // In the future, add CDN parameters here
  return url;
};
