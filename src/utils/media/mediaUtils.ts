
import { MediaType, MediaSource } from './types';

/**
 * Determine the type of media from a URL or source object
 * @param source The URL or source object
 * @returns The media type
 */
export function determineMediaType(source: string | MediaSource): MediaType {
  if (!source) return MediaType.UNKNOWN;
  
  // If the source is a string (URL), check its extension
  if (typeof source === 'string') {
    // Check for image extensions
    if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(source)) {
      return MediaType.IMAGE;
    }
    // Check for video extensions
    else if (/\.(mp4|webm|mov|avi)$/i.test(source)) {
      return MediaType.VIDEO;
    }
    // Check for audio extensions
    else if (/\.(mp3|wav|ogg|m4a)$/i.test(source)) {
      return MediaType.AUDIO;
    }
  } 
  // If the source is an object, check its properties
  else {
    // Check if the source has an explicit media_type
    if (source.media_type) {
      return source.media_type;
    }
    
    // Check content_type if available
    if (source.content_type) {
      if (source.content_type.includes('image')) return MediaType.IMAGE;
      if (source.content_type.includes('video')) return MediaType.VIDEO;
      if (source.content_type.includes('audio')) return MediaType.AUDIO;
    }
    
    // Check URL properties if available
    const url = extractMediaUrl(source);
    if (url) {
      return determineMediaType(url);
    }
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Extract a media URL from a variety of source formats
 * @param source The media source object or string
 * @returns The extracted URL or null
 */
export function extractMediaUrl(source: MediaSource | any | null | undefined): string | null {
  if (!source) return null;
  
  // If the source is already a string, return it
  if (typeof source === 'string') {
    return source;
  }
  
  // Try to extract URL from various properties commonly found in our media objects
  if (typeof source === 'object') {
    // Try standard properties
    if (source.url) return source.url;
    if (source.video_url) return source.video_url;
    if (source.media_url) return source.media_url;
    if (source.image_url) return source.image_url;
    if (source.thumbnail_url) return source.thumbnail_url;
    
    // Try properties that might contain URLs
    if (source.src) return source.src;
    if (source.source) return typeof source.source === 'string' ? source.source : extractMediaUrl(source.source);
    
    // Try nested properties
    if (source.media) return extractMediaUrl(source.media);
    if (source.video) return extractMediaUrl(source.video);
    if (source.image) return extractMediaUrl(source.image);
    if (source.thumbnail) return extractMediaUrl(source.thumbnail);
  }
  
  return null;
}

/**
 * Normalize a media source to a standard format
 * @param source The source object or URL to normalize
 * @returns A normalized media source object
 */
export function normalizeMediaSource(source: MediaSource | string | any): MediaSource {
  if (!source) {
    return { url: null, media_type: MediaType.UNKNOWN };
  }
  
  // If the source is already a string, create a media source object
  if (typeof source === 'string') {
    return {
      url: source,
      media_type: determineMediaType(source)
    };
  }
  
  // If the source is an object, normalize it
  const url = extractMediaUrl(source);
  const mediaType = source.media_type || determineMediaType(source);
  
  return {
    ...source,
    url,
    media_type: mediaType
  };
}

/**
 * Create a unique file path for uploading
 * @param userId User ID
 * @param file File object
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}
