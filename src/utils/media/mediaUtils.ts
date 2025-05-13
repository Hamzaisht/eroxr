
import { MediaSource, MediaType } from './types';
import { extractMediaUrl } from './urlUtils';

/**
 * Create a unique file path for a media file
 */
export function createUniqueFilePath(userId: string, file: File, prefix = ''): string {
  const timestamp = new Date().getTime();
  const extension = file.name.split('.').pop() || '';
  const safeName = file.name
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  
  return `${prefix ? prefix + '/' : ''}${userId}/${timestamp}_${safeName}.${extension}`;
}

/**
 * Determine the media type based on URL or MIME type
 */
export function determineMediaType(source: string | MediaSource): MediaType {
  // Handle string sources
  if (typeof source === 'string') {
    return _getMediaTypeFromUrl(source);
  }
  
  // If media_type is already specified, use it
  if (source.media_type) {
    return source.media_type;
  }
  
  // Check for video_url or media_url
  const url = extractMediaUrl(source);
  if (url) {
    return _getMediaTypeFromUrl(url);
  }
  
  return MediaType.UNKNOWN;
}

// Export extractMediaUrl to resolve import errors
export { extractMediaUrl } from './urlUtils';

// Re-export the uploadFileToStorage function to maintain backward compatibility
export { uploadFileToStorage } from '../upload/storageService';

function _getMediaTypeFromUrl(url: string): MediaType {
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
    return MediaType.IMAGE;
  }
  
  if (['mp4', 'webm', 'mov', 'avi'].includes(extension || '')) {
    return MediaType.VIDEO;
  }
  
  if (['mp3', 'wav', 'ogg'].includes(extension || '')) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
}

// A simplified media orchestrator for caching and reusability
export const mediaOrchestrator = {
  process: (source: string | MediaSource): MediaSource => {
    return typeof source === 'string' ? { url: source } : source;
  },
  createMediaId: (source: string | MediaSource): string => {
    const url = typeof source === 'string' ? source : extractMediaUrl(source);
    return `media_${url?.split('/').pop() || ''}`;
  },
  registerMediaRequest: (source: MediaSource): void => {
    // Just a stub for now
    console.log("Media registered:", extractMediaUrl(source));
  }
};

/**
 * Normalize a media source to ensure it has a valid URL property
 */
export { normalizeMediaSource } from './types';
