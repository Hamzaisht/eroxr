
import { MediaSource } from './types';
import { getMimeType, isVideoUrl, isImageUrl, isAudioUrl } from './mediaTypeUtils';

/**
 * Extract the media URL from various source objects
 */
export const extractMediaUrl = (media: any): string => {
  if (!media) return '';
  
  // If it's already a string, return it directly
  if (typeof media === 'string') return media;
  
  // Check for common URL properties
  return media.url || media.media_url || media.video_url || media.src || '';
};

/**
 * Get a playable media URL (with proper transformations if needed)
 */
export const getPlayableMediaUrl = (url: string): string => {
  if (!url) return '';
  
  // Add transformations or CDN parameters if needed
  return url;
};

/**
 * Check if media has a valid URL
 */
export const hasValidUrl = (media: any): boolean => {
  return !!extractMediaUrl(media);
};

/**
 * Create a derived URL for thumbnails
 */
export const getThumbnailUrl = (url: string): string => {
  if (!url) return '';
  
  // For video URLs, you might want to generate or fetch a thumbnail
  if (isVideoUrl(url)) {
    // This is a simplified approach - in a real app you'd use a proper thumbnail service
    return url + '?thumbnail=true';
  }
  
  // For images, you might want to resize or transform them
  return url;
};

/**
 * Re-export media type checking functions
 */
export { isVideoUrl, isImageUrl, isAudioUrl };
