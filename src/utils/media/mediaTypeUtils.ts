
import { MediaType, AvailabilityStatus } from './types';

/**
 * Re-export MediaType and AvailabilityStatus enum
 */
export { MediaType, AvailabilityStatus } from './types';

/**
 * Determine the MediaType from a file
 */
export function getMediaTypeFromFile(file: File): MediaType {
  if (!file) return MediaType.UNKNOWN;
  
  if (file.type.startsWith('image/')) {
    if (file.type === 'image/gif') return MediaType.GIF;
    return MediaType.IMAGE;
  }
  
  if (file.type.startsWith('video/')) return MediaType.VIDEO;
  if (file.type.startsWith('audio/')) return MediaType.AUDIO;
  
  return MediaType.UNKNOWN;
}

/**
 * Determine MediaType from a URL or extension
 */
export function getMediaTypeFromUrl(url: string): MediaType {
  if (!url) return MediaType.UNKNOWN;
  
  // Check for data URLs
  if (url.startsWith('data:image/')) return MediaType.IMAGE;
  if (url.startsWith('data:video/')) return MediaType.VIDEO;
  if (url.startsWith('data:audio/')) return MediaType.AUDIO;
  
  // Get file extension for regular URLs
  const extension = url.split('.').pop()?.toLowerCase();
  if (!extension) return MediaType.UNKNOWN;
  
  // Check image extensions
  if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  // Special case for GIF
  if (extension === 'gif') return MediaType.GIF;
  
  // Check video extensions
  if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  // Check audio extensions
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Check if a URL points to an image file
 */
export function isImageUrl(url: string): boolean {
  return getMediaTypeFromUrl(url) === MediaType.IMAGE || 
         getMediaTypeFromUrl(url) === MediaType.GIF;
}

/**
 * Check if a URL points to a video file
 */
export function isVideoUrl(url: string): boolean {
  return getMediaTypeFromUrl(url) === MediaType.VIDEO;
}

/**
 * Check if a URL points to an audio file
 */
export function isAudioUrl(url: string): boolean {
  return getMediaTypeFromUrl(url) === MediaType.AUDIO;
}
