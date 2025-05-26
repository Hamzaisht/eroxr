
import { MediaType } from '@/types/media';

/**
 * Determines media type from file extension
 */
export const getMediaTypeFromExtension = (extension: string): MediaType => {
  const ext = extension.toLowerCase();
  
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) {
    return MediaType.VIDEO;
  }
  
  if (['jpg', 'jpeg', 'png', 'webp', 'bmp'].includes(ext)) {
    return MediaType.IMAGE;
  }
  
  if (ext === 'gif') {
    return MediaType.GIF;
  }
  
  if (['mp3', 'wav', 'ogg', 'aac'].includes(ext)) {
    return MediaType.AUDIO;
  }
  
  if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Checks if media type is playable in browser
 */
export const isPlayableMediaType = (type: MediaType): boolean => {
  return [MediaType.VIDEO, MediaType.AUDIO, MediaType.IMAGE, MediaType.GIF].includes(type);
};

/**
 * Checks if media type is an image
 */
export const isImageType = (type: MediaType): boolean => {
  return type === MediaType.IMAGE || type === MediaType.GIF;
};

/**
 * Checks if media type is a video
 */
export const isVideoType = (type: MediaType): boolean => {
  return type === MediaType.VIDEO;
};

/**
 * Checks if media type is audio
 */
export const isAudioType = (type: MediaType): boolean => {
  return type === MediaType.AUDIO;
};

/**
 * Checks if media type is a document
 */
export const isDocumentType = (type: MediaType): boolean => {
  return type === MediaType.DOCUMENT;
};
