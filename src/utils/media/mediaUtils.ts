
import { MediaType, MediaSource } from '@/types/media';

/**
 * Extract a usable media URL from various input formats
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string | null {
  if (!source) return null;
  
  // If it's a string, assume it's a URL
  if (typeof source === 'string') return source;
  
  // If it has a url property, use it
  if (source.url) return source.url;
  
  // Legacy support for various formats
  if (source.video_url) return source.video_url;
  
  if (source.media_url) {
    // Handle both string and array formats
    if (typeof source.media_url === 'string') return source.media_url;
    if (Array.isArray(source.media_url) && source.media_url.length > 0) {
      return source.media_url[0];
    }
  }
  
  return null;
}

/**
 * Normalize a media source into a standard format
 */
export function normalizeMediaSource(input: MediaSource | string | null | undefined): MediaSource {
  if (!input) return { url: '', type: MediaType.UNKNOWN };
  
  // If it's a string, convert to object
  if (typeof input === 'string') {
    const mediaType = determineMediaType(input);
    return {
      url: input,
      type: mediaType
    };
  }
  
  // If it's already a MediaSource object but missing the standard URL
  const source = { ...input };
  
  if (!source.url) {
    // Try to get URL from legacy properties
    source.url = extractMediaUrl(source) || '';
  }
  
  if (!source.type) {
    // Determine type from URL
    source.type = determineMediaType(source.url);
  }
  
  return source;
}

/**
 * Determine media type from URL or extension
 */
export function determineMediaType(url?: string): MediaType {
  if (!url) return MediaType.UNKNOWN;
  
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (!extension) return MediaType.UNKNOWN;
  
  // Check image extensions
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  // Check for GIF format
  if (extension === 'gif') {
    return MediaType.GIF;
  }
  
  // Check video extensions
  if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  // Check audio extensions
  if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
}
