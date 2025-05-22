
import { MediaType, MediaSource } from './types';

/**
 * Extract a URL from a MediaSource object or return the string if it's already a string
 */
export function extractMediaUrl(source: MediaSource | string): string {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return source.url || '';
}

/**
 * Normalize a variety of inputs into a MediaSource object
 */
export function normalizeMediaSource(input: any): MediaSource {
  // If it's already in the right format
  if (input && typeof input === 'object' && 'url' in input && 'type' in input) {
    return input as MediaSource;
  }

  // If it's a string URL
  if (typeof input === 'string') {
    // Try to determine type from URL
    const url = input;
    const isImage = /\.(jpg|jpeg|png|gif|webp|svg|avif)($|\?)/i.test(url);
    const isVideo = /\.(mp4|webm|mov|avi)($|\?)/i.test(url);
    const isAudio = /\.(mp3|wav|ogg|aac)($|\?)/i.test(url);
    
    let type = MediaType.UNKNOWN;
    if (isImage) type = MediaType.IMAGE;
    else if (isVideo) type = MediaType.VIDEO;
    else if (isAudio) type = MediaType.AUDIO;
    
    return { url, type };
  }

  // If it has media_url, video_url, or thumbnail_url (compatibility with old format)
  if (input && typeof input === 'object') {
    if (input.media_url) {
      return {
        url: Array.isArray(input.media_url) ? input.media_url[0] : input.media_url,
        type: MediaType.IMAGE,
        thumbnail: input.thumbnail_url,
      };
    }
    
    if (input.video_url) {
      return {
        url: input.video_url,
        type: MediaType.VIDEO,
        thumbnail: input.thumbnail_url,
        poster: input.thumbnail_url,
      };
    }
    
    if (input.thumbnail_url) {
      return {
        url: input.thumbnail_url,
        type: MediaType.IMAGE,
      };
    }
  }

  // Default fallback
  return { url: '', type: MediaType.UNKNOWN };
}

/**
 * Determine the media type from a URL or other source
 */
export function determineMediaType(source: string | MediaSource): MediaType {
  // If it's already a MediaSource object, return its type
  if (typeof source !== 'string' && source?.type) {
    return source.type;
  }
  
  // Get the URL string
  const url = typeof source === 'string' ? source : (source?.url || '');
  
  // Check extensions
  if (/\.(jpg|jpeg|png|gif|webp|svg|avif)($|\?)/i.test(url)) {
    return MediaType.IMAGE;
  } else if (/\.(mp4|webm|mov|avi|mkv)($|\?)/i.test(url)) {
    return MediaType.VIDEO;
  } else if (/\.(mp3|wav|ogg|aac|flac)($|\?)/i.test(url)) {
    return MediaType.AUDIO;
  } else if (/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)($|\?)/i.test(url)) {
    return MediaType.DOCUMENT;
  }
  
  // If we can't determine based on extension, try to make an educated guess
  if (url.includes('image')) {
    return MediaType.IMAGE;
  } else if (url.includes('video')) {
    return MediaType.VIDEO;
  } else if (url.includes('audio')) {
    return MediaType.AUDIO;
  }
  
  // Default fallback
  return MediaType.UNKNOWN;
}
