
import { MediaType, MediaSource } from './types';
import { isImageUrl, isVideoUrl, isAudioUrl } from './urlUtils';

/**
 * Extract a media URL from a source object or string
 */
export function extractMediaUrl(source: MediaSource | string): string | null {
  if (!source) return null;
  
  // If source is already a string, return it
  if (typeof source === 'string') return source;
  
  // Try to extract URL from different possible properties
  const url = source.url || 
              source.media_url || 
              source.video_url || 
              (source.video_urls && source.video_urls.length > 0 ? source.video_urls[0] : null) || 
              (source.media_urls && source.media_urls.length > 0 ? source.media_urls[0] : null);
              
  return url || null;
}

/**
 * Determine the media type from a source object or URL
 */
export function determineMediaType(source: MediaSource | string): MediaType {
  // For string sources, check directly
  if (typeof source === 'string') {
    if (isVideoUrl(source)) return MediaType.VIDEO;
    if (isImageUrl(source)) return MediaType.IMAGE;
    if (isAudioUrl(source)) return MediaType.AUDIO;
    return MediaType.UNKNOWN;
  }
  
  // For source objects, first check if there's an explicit type property
  if ('type' in source && source.type) {
    const type = source.type.toLowerCase();
    if (type === 'video') return MediaType.VIDEO;
    if (type === 'image') return MediaType.IMAGE;
    if (type === 'audio') return MediaType.AUDIO;
    if (type === 'document') return MediaType.DOCUMENT;
  }
  
  // If no explicit type, check URL patterns
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  // Check for video indicators
  if (
    source.video_url || 
    source.video_urls?.length || 
    isVideoUrl(url) ||
    url.includes('video') ||
    url.includes('mp4')
  ) {
    return MediaType.VIDEO;
  }
  
  // Check for image indicators
  if (
    source.media_url || 
    source.media_urls?.length || 
    isImageUrl(url) ||
    url.includes('image') ||
    url.includes('photo')
  ) {
    return MediaType.IMAGE;
  }
  
  // Check URL extensions as a fallback
  if (isVideoUrl(url)) return MediaType.VIDEO;
  if (isImageUrl(url)) return MediaType.IMAGE;
  if (isAudioUrl(url)) return MediaType.AUDIO;
  
  return MediaType.UNKNOWN;
}

/**
 * Get a thumbnail URL from a media source
 */
export function getThumbnailUrl(source: MediaSource | string): string | null {
  if (!source) return null;
  
  // If source is a string, there's no thumbnail info
  if (typeof source === 'string') return null;
  
  // Try to extract thumbnail URL from different possible properties
  return source.thumbnail_url || 
         source.video_thumbnail_url || 
         null;
}
