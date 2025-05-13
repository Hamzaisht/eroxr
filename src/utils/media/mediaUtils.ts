
import { MediaType, MediaSource } from './types';
import { isImageUrl, isVideoUrl, isAudioUrl, extractMediaUrl } from './urlUtils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Determine the media type based on URL or MediaSource object
 * @param media - URL string or MediaSource object
 * @returns MediaType enum value
 */
export function determineMediaType(media: string | MediaSource): MediaType {
  // If media is already typed, use that
  if (typeof media !== 'string' && media.media_type) {
    if (typeof media.media_type === 'string') {
      switch (media.media_type.toLowerCase()) {
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
        case 'file':
          return MediaType.FILE;
      }
    }
    return media.media_type;
  }
  
  // Extract URL to check
  const url = typeof media === 'string' ? media : extractMediaUrl(media);
  if (!url) return MediaType.UNKNOWN;
  
  // Check URL patterns
  if (isImageUrl(url)) return MediaType.IMAGE;
  if (isVideoUrl(url)) return MediaType.VIDEO;
  if (isAudioUrl(url)) return MediaType.AUDIO;
  
  // Default to unknown
  return MediaType.UNKNOWN;
}

/**
 * Helper function to standardize media objects for our components
 */
export function normalizeMediaSource(source: string | MediaSource): MediaSource {
  // If source is a string, assume it's a URL and create a MediaSource object
  if (typeof source === 'string') {
    return { url: source };
  }
  
  // For MediaSource objects, ensure they have the 'url' property
  const normalized: MediaSource = { ...source };
  
  // If url is not set, try to extract it from other fields
  if (!normalized.url) {
    normalized.url = extractMediaUrl(source);
  }
  
  // If media_type is not set, try to determine it
  if (!normalized.media_type) {
    normalized.media_type = determineMediaType(source);
  }
  
  return normalized;
}

/**
 * Media processing orchestrator - coordinates all media-related operations
 */
export const mediaOrchestrator = {
  process: (source: string | MediaSource) => {
    const normalized = normalizeMediaSource(source);
    return normalized;
  }
};

// Re-export functions from urlUtils to avoid duplicate imports
export { extractMediaUrl } from './urlUtils';
