
import { MediaSource, MediaType } from "./types";

export const normalizeMediaSource = (source: MediaSource | string): MediaSource => {
  if (typeof source === 'string') {
    // If source is a string (URL), convert it to a MediaSource object
    return {
      url: source,
      media_type: detectMediaType(source),
    };
  }
  
  // If source is already a MediaSource object but missing media_type
  if (!source.media_type) {
    return {
      ...source,
      media_type: detectMediaType(source.url),
    };
  }
  
  return source;
};

export const detectMediaType = (url: string): MediaType => {
  if (!url) return MediaType.UNKNOWN;
  
  const lowerUrl = url.toLowerCase();
  
  // Check for common image extensions
  if (
    lowerUrl.endsWith('.jpg') || 
    lowerUrl.endsWith('.jpeg') || 
    lowerUrl.endsWith('.png') || 
    lowerUrl.endsWith('.gif') || 
    lowerUrl.endsWith('.webp') || 
    lowerUrl.endsWith('.svg')
  ) {
    return MediaType.IMAGE;
  }
  
  // Check for common video extensions
  if (
    lowerUrl.endsWith('.mp4') || 
    lowerUrl.endsWith('.webm') || 
    lowerUrl.endsWith('.ogg') || 
    lowerUrl.endsWith('.mov') || 
    lowerUrl.endsWith('.avi') || 
    lowerUrl.endsWith('.mkv')
  ) {
    return MediaType.VIDEO;
  }
  
  // Check for common audio extensions
  if (
    lowerUrl.endsWith('.mp3') || 
    lowerUrl.endsWith('.wav') || 
    lowerUrl.endsWith('.ogg') || 
    lowerUrl.endsWith('.aac')
  ) {
    return MediaType.AUDIO;
  }
  
  // Check if URL contains hints about its type
  if (lowerUrl.includes('image')) {
    return MediaType.IMAGE;
  }
  
  if (lowerUrl.includes('video')) {
    return MediaType.VIDEO;
  }
  
  if (lowerUrl.includes('audio')) {
    return MediaType.AUDIO;
  }
  
  // Default to unknown if we can't determine the type
  return MediaType.UNKNOWN;
};

export const extractMediaUrl = (source: MediaSource): string | null => {
  if (!source) return null;
  
  // Directly return the URL if it exists
  if (source.url) return source.url;
  
  // Try to find a URL from other possible properties
  if ('media_url' in source && typeof source.media_url === 'string') {
    return source.media_url;
  }
  
  if ('video_url' in source && typeof source.video_url === 'string') {
    return source.video_url;
  }
  
  if ('thumbnail' in source && typeof source.thumbnail === 'string') {
    return source.thumbnail;
  }
  
  // Return null if no URL can be found
  return null;
};

/**
 * Determine the media type from a media source object or URL
 */
export function determineMediaType(source: MediaSource | string): MediaType {
  // Handle string URLs directly
  if (typeof source === 'string') {
    return detectMediaType(source);
  }
  
  // If media_type is already defined, use it
  if (source.media_type) {
    return source.media_type;
  }
  
  // Check for content_type hints
  if (source.content_type) {
    const contentType = source.content_type.toLowerCase();
    if (contentType === 'image' || contentType.includes('image')) {
      return MediaType.IMAGE;
    }
    if (contentType === 'video' || contentType.includes('video')) {
      return MediaType.VIDEO;
    }
    if (contentType === 'audio' || contentType.includes('audio')) {
      return MediaType.AUDIO;
    }
  }
  
  // Check which URL property exists and use that for detection
  if (source.video_url) {
    return MediaType.VIDEO;
  }
  
  if (source.media_url) {
    return detectMediaType(source.media_url);
  }
  
  if (source.url) {
    return detectMediaType(source.url);
  }
  
  // Default to unknown if we can't determine
  return MediaType.UNKNOWN;
}
