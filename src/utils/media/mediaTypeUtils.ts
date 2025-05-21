
import { MediaType } from './types';

/**
 * Check if a media type is an image
 */
export const isImageType = (type: MediaType): boolean => {
  return type === MediaType.IMAGE || type === MediaType.GIF;
};

/**
 * Check if a media type is a video
 */
export const isVideoType = (type: MediaType): boolean => {
  return type === MediaType.VIDEO;
};

/**
 * Check if a media type is audio
 */
export const isAudioType = (type: MediaType): boolean => {
  return type === MediaType.AUDIO;
};

/**
 * Convert MIME type to MediaType
 */
export const mimeTypeToMediaType = (mimeType: string): MediaType => {
  if (mimeType.startsWith('image/')) {
    return mimeType.includes('gif') ? MediaType.GIF : MediaType.IMAGE;
  }
  
  if (mimeType.startsWith('video/')) {
    return MediaType.VIDEO;
  }
  
  if (mimeType.startsWith('audio/')) {
    return MediaType.AUDIO;
  }
  
  if (mimeType.startsWith('application/')) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};
