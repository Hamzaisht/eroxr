
import { MediaType, AvailabilityStatus } from "./types";

/**
 * Get the MIME type for a file or URL
 */
export const getMimeType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Check if URL points to an image
 */
export const isImageUrl = (url: string): boolean => {
  const mimeType = getMimeType(url);
  return mimeType.startsWith('image/');
};

/**
 * Check if URL points to a video
 */
export const isVideoUrl = (url: string): boolean => {
  const mimeType = getMimeType(url);
  return mimeType.startsWith('video/');
};

/**
 * Check if URL points to an audio file
 */
export const isAudioUrl = (url: string): boolean => {
  const mimeType = getMimeType(url);
  return mimeType.startsWith('audio/');
};

/**
 * Convert string to MediaType enum value
 */
export const stringToMediaType = (type: string): MediaType => {
  switch (type.toLowerCase()) {
    case 'image':
      return MediaType.IMAGE;
    case 'video':
      return MediaType.VIDEO;
    case 'audio':
      return MediaType.AUDIO;
    case 'document':
      return MediaType.DOCUMENT;
    case 'gif':
      return MediaType.GIF;
    default:
      return MediaType.UNKNOWN;
  }
};

/**
 * Re-export AvailabilityStatus enum for consistency
 */
export { AvailabilityStatus };
