
// Create this utility file if it doesn't exist
import { MediaType } from './types';

/**
 * Check if media type is an image
 */
export function isImageType(type: MediaType): boolean {
  return type === MediaType.IMAGE || type === MediaType.GIF;
}

/**
 * Check if media type is a video
 */
export function isVideoType(type: MediaType): boolean {
  return type === MediaType.VIDEO;
}

/**
 * Check if media type is audio
 */
export function isAudioType(type: MediaType): boolean {
  return type === MediaType.AUDIO;
}

/**
 * Check if media type is a document
 */
export function isDocumentType(type: MediaType): boolean {
  return type === MediaType.DOCUMENT;
}

/**
 * Determine media type from file object
 */
export function getMediaTypeFromFile(file: File): MediaType {
  if (!file || !file.type) return MediaType.UNKNOWN;
  
  if (file.type.startsWith('image/')) {
    return file.type.includes('gif') ? MediaType.GIF : MediaType.IMAGE;
  }
  
  if (file.type.startsWith('video/')) {
    return MediaType.VIDEO;
  }
  
  if (file.type.startsWith('audio/')) {
    return MediaType.AUDIO;
  }
  
  if (file.type.includes('pdf') || 
      file.type.includes('doc') || 
      file.type.includes('xls') || 
      file.type.includes('ppt') || 
      file.type.includes('text/')) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
}
