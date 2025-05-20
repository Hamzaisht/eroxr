
import { MediaSource, MediaType } from "@/types/media";

/**
 * Normalizes a media source to ensure consistent format
 */
export function normalizeMediaSource(source: MediaSource | string): MediaSource {
  if (typeof source === 'string') {
    return {
      url: source,
      type: determineMediaType(source)
    };
  }
  
  // Ensure there's a url property
  const mediaSource: MediaSource = {
    ...source,
    url: source.url || extractMediaUrl(source)
  };
  
  // Ensure there's a type property
  if (!mediaSource.type) {
    mediaSource.type = determineMediaType(mediaSource.url);
  }
  
  return mediaSource;
}

/**
 * Extract media URL from various possible source properties
 */
export function extractMediaUrl(source: MediaSource): string {
  // Try to get URL from the various possible properties
  if (source.url) return source.url;
  if (source.video_url) return source.video_url;
  
  if (source.media_url) {
    if (Array.isArray(source.media_url) && source.media_url.length > 0) {
      return source.media_url[0];
    }
    if (typeof source.media_url === 'string') {
      return source.media_url;
    }
  }
  
  // Fallback to empty string if no URL can be found
  return '';
}

/**
 * Determine media type from URL extension
 */
export function determineMediaType(url: string): MediaType {
  if (!url) return MediaType.UNKNOWN;
  
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (!extension) return MediaType.UNKNOWN;
  
  // Check for image extensions
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  // Check for GIF
  if (extension === 'gif') {
    return MediaType.GIF;
  }
  
  // Check for video extensions
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  // Check for audio extensions
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  // Check for document extensions
  if (['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'].includes(extension)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
}
