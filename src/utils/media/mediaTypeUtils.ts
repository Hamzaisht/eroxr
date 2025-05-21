
import { MediaType } from './types';

/**
 * Check if media type is an image type
 * @param type The media type to check
 * @returns True if the type is an image type
 */
export const isImageType = (type: MediaType): boolean => {
  return type === MediaType.IMAGE || type === MediaType.GIF;
};

/**
 * Check if media type is a video type
 * @param type The media type to check
 * @returns True if the type is a video type
 */
export const isVideoType = (type: MediaType): boolean => {
  return type === MediaType.VIDEO;
};

/**
 * Check if media type is an audio type
 * @param type The media type to check
 * @returns True if the type is an audio type
 */
export const isAudioType = (type: MediaType): boolean => {
  return type === MediaType.AUDIO;
};

/**
 * Check if media type is a document type
 * @param type The media type to check
 * @returns True if the type is a document type
 */
export const isDocumentType = (type: MediaType): boolean => {
  return type === MediaType.DOCUMENT;
};

/**
 * Get file extension from URL
 * @param url The URL to extract extension from
 * @returns The file extension or empty string
 */
export const getFileExtension = (url: string): string => {
  if (!url) return '';
  
  // Remove query parameters
  const urlWithoutParams = url.split('?')[0];
  
  // Get last part after last slash
  const filename = urlWithoutParams.split('/').pop() || '';
  
  // Get extension
  const extension = filename.split('.').pop() || '';
  
  return extension.toLowerCase();
};

/**
 * Check if URL is a valid media URL
 * @param url URL to check
 * @returns True if URL is valid
 */
export const isValidMediaUrl = (url: string): boolean => {
  // Basic validation - at minimum should be non-empty
  if (!url) return false;
  
  // Check if absolute URL
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return true;
  }
  
  // Check if relative URL
  if (url.startsWith('/')) {
    return true;
  }
  
  // Check data URLs
  if (url.startsWith('data:')) {
    return true;
  }
  
  return false;
};
