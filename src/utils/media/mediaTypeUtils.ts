
import { MediaType } from './types';

/**
 * Check if media type is an image type
 */
export const isImageType = (type: MediaType | string): boolean => {
  if (typeof type === 'string') {
    return type === MediaType.IMAGE || type === 'image';
  }
  return type === MediaType.IMAGE;
};

/**
 * Check if media type is a video type
 */
export const isVideoType = (type: MediaType | string): boolean => {
  if (typeof type === 'string') {
    return type === MediaType.VIDEO || type === 'video';
  }
  return type === MediaType.VIDEO;
};

/**
 * Check if media type is an audio type
 */
export const isAudioType = (type: MediaType | string): boolean => {
  if (typeof type === 'string') {
    return type === MediaType.AUDIO || type === 'audio';
  }
  return type === MediaType.AUDIO;
};

/**
 * Check if media type is a document type
 */
export const isDocumentType = (type: MediaType | string): boolean => {
  if (typeof type === 'string') {
    return type === MediaType.DOCUMENT || type === 'document';
  }
  return type === MediaType.DOCUMENT;
};

/**
 * Check if media type is a GIF type
 */
export const isGifType = (type: MediaType | string): boolean => {
  if (typeof type === 'string') {
    return type === MediaType.GIF || type === 'gif';
  }
  return type === MediaType.GIF;
};

/**
 * Get file extension from a URL
 */
export const getFileExtensionFromUrl = (url: string): string => {
  const urlWithoutParams = url.split('?')[0];
  return urlWithoutParams.split('.').pop()?.toLowerCase() || '';
};

/**
 * Detect media type from URL or file extension
 */
export const detectMediaTypeFromUrl = (url: string): MediaType => {
  const extension = getFileExtensionFromUrl(url);
  
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  if (['gif'].includes(extension)) {
    return MediaType.GIF;
  }
  
  if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Convert MIME type to MediaType
 */
export const mimeTypeToMediaType = (mimeType: string): MediaType => {
  if (!mimeType) return MediaType.UNKNOWN;
  
  if (mimeType.startsWith('image/')) {
    if (mimeType === 'image/gif') {
      return MediaType.GIF;
    }
    return MediaType.IMAGE;
  }
  
  if (mimeType.startsWith('video/')) {
    return MediaType.VIDEO;
  }
  
  if (mimeType.startsWith('audio/')) {
    return MediaType.AUDIO;
  }
  
  if (mimeType.startsWith('application/pdf') || 
      mimeType.startsWith('application/msword') || 
      mimeType.includes('document') || 
      mimeType.includes('text/')) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};
