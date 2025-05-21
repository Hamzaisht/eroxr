
import { MediaType } from "./types";

/**
 * Checks if the media type is an image
 * @param type Media type to check
 * @returns boolean
 */
export const isImageType = (type: MediaType | string): boolean => {
  return type === MediaType.IMAGE;
};

/**
 * Checks if the media type is a video
 * @param type Media type to check
 * @returns boolean
 */
export const isVideoType = (type: MediaType | string): boolean => {
  return type === MediaType.VIDEO;
};

/**
 * Checks if the media type is audio
 * @param type Media type to check
 * @returns boolean
 */
export const isAudioType = (type: MediaType | string): boolean => {
  return type === MediaType.AUDIO;
};

/**
 * Checks if the media type is a document
 * @param type Media type to check
 * @returns boolean
 */
export const isDocumentType = (type: MediaType | string): boolean => {
  return type === MediaType.DOCUMENT;
};

/**
 * Checks if a file is an image based on its MIME type
 * @param file File to check
 * @returns boolean
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Checks if a file is a video based on its MIME type
 * @param file File to check
 * @returns boolean
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Checks if a file is audio based on its MIME type
 * @param file File to check
 * @returns boolean
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Get file extension from a file
 * @param file File object
 * @returns File extension without the dot
 */
export const getFileExtension = (file: File): string => {
  return file.name.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get media type from file extension
 * @param extension File extension
 * @returns MediaType
 */
export const getMediaTypeFromExtension = (extension: string): MediaType => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'avif'];
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v', 'ogv'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  if (imageExtensions.includes(extension.toLowerCase())) {
    return MediaType.IMAGE;
  }
  
  if (videoExtensions.includes(extension.toLowerCase())) {
    return MediaType.VIDEO;
  }
  
  if (audioExtensions.includes(extension.toLowerCase())) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Convert MIME type to MediaType
 * @param mimeType MIME type string
 * @returns MediaType
 */
export const mimeTypeToMediaType = (mimeType: string): MediaType => {
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
  
  if (mimeType.startsWith('application/') || mimeType.startsWith('text/')) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
};
