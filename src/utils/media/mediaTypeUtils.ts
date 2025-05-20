
import { MediaType } from '@/types/media';

/**
 * Determines if a file type is an image
 * @param type MIME type to check
 */
export function isImageType(type: string): boolean {
  return type.startsWith('image/');
}

/**
 * Determines if a file type is a video
 * @param type MIME type to check
 */
export function isVideoType(type: string): boolean {
  return type.startsWith('video/');
}

/**
 * Determines if a file type is an audio file
 * @param type MIME type to check
 */
export function isAudioType(type: string): boolean {
  return type.startsWith('audio/');
}

/**
 * Maps a MIME type to a MediaType enum value
 * @param mimeType MIME type to map
 */
export function mimeTypeToMediaType(mimeType: string): MediaType {
  if (isImageType(mimeType)) {
    return mimeType === 'image/gif' ? MediaType.GIF : MediaType.IMAGE;
  }
  
  if (isVideoType(mimeType)) {
    return MediaType.VIDEO;
  }
  
  if (isAudioType(mimeType)) {
    return MediaType.AUDIO;
  }
  
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('application/')) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Gets file extension from a MIME type
 * @param mimeType MIME type
 * @returns File extension (without dot)
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mappings: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'application/pdf': 'pdf'
  };
  
  return mappings[mimeType] || mimeType.split('/').pop() || 'unknown';
}
