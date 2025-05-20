
import { MediaType } from './types';

/**
 * Check if the given type is an image type
 */
export function isImageType(type: string): boolean {
  return type === MediaType.IMAGE || 
         type === 'image' || 
         (typeof type === 'string' && type.startsWith('image/'));
}

/**
 * Check if the given type is a video type
 */
export function isVideoType(type: string): boolean {
  return type === MediaType.VIDEO || 
         type === 'video' || 
         (typeof type === 'string' && type.startsWith('video/'));
}

/**
 * Check if the given type is an audio type
 */
export function isAudioType(type: string): boolean {
  return type === MediaType.AUDIO || 
         type === 'audio' || 
         (typeof type === 'string' && type.startsWith('audio/'));
}

/**
 * Convert a MIME type to a MediaType enum
 */
export function mimeTypeToMediaType(mimeType: string): MediaType {
  if (!mimeType) return MediaType.UNKNOWN;
  
  if (mimeType.startsWith('image/')) {
    return MediaType.IMAGE;
  } else if (mimeType.startsWith('video/')) {
    return MediaType.VIDEO;
  } else if (mimeType.startsWith('audio/')) {
    return MediaType.AUDIO;
  } else if (mimeType.startsWith('application/') || mimeType.startsWith('text/')) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
}
