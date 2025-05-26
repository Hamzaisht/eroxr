
import { MediaType } from '@/types/media';

export interface MediaItem {
  url: string;
  type: MediaType;
  thumbnail?: string;
  poster?: string;
  duration?: number;
  width?: number;
  height?: number;
  creator_id?: string;
}

/**
 * Determines media type from URL or file extension
 */
export const determineMediaType = (source: any): MediaType => {
  if (!source) return MediaType.UNKNOWN;
  
  // If source has explicit type
  if (typeof source === 'object' && source.type) return source.type;
  
  // Extract URL to check extension
  const url = extractMediaUrl(source);
  if (!url) return MediaType.UNKNOWN;
  
  const extension = url.split('.').pop()?.toLowerCase() || '';
  
  // Video extensions
  if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'].includes(extension)) {
    return MediaType.VIDEO;
  }
  
  // Image extensions
  if (['jpg', 'jpeg', 'png', 'webp', 'bmp', 'svg'].includes(extension)) {
    return MediaType.IMAGE;
  }
  
  // GIF extension
  if (extension === 'gif') {
    return MediaType.GIF;
  }
  
  // Audio extensions
  if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extension)) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
};

/**
 * Extracts URL from various source formats
 */
export const extractMediaUrl = (source: any): string | null => {
  if (!source) return null;
  
  // If source is already a string URL
  if (typeof source === 'string') {
    return source.trim();
  }
  
  // Check common URL properties
  if (source.url) return source.url.trim();
  if (source.media_url) {
    if (Array.isArray(source.media_url)) {
      return source.media_url[0]?.trim() || null;
    }
    return source.media_url.trim();
  }
  if (source.video_url) return source.video_url.trim();
  if (source.src) return source.src.trim();
  
  return null;
};

/**
 * Processes and validates a media source
 */
export const processMediaSource = (source: any): MediaItem | null => {
  if (!source) return null;
  
  const url = extractMediaUrl(source);
  if (!url) return null;
  
  return {
    url,
    type: determineMediaType(source),
    thumbnail: source.thumbnail,
    poster: source.poster,
    duration: source.duration,
    width: source.width,
    height: source.height,
    creator_id: source.creator_id
  };
};

/**
 * Cleans and validates media URLs
 */
export const cleanMediaUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // Remove whitespace
    url = url.trim();
    
    // If it's already a valid URL, return it
    new URL(url);
    return url;
  } catch {
    // If not a valid URL but has content, try to construct one
    if (url && !url.startsWith('http')) {
      // Handle relative URLs
      if (url.startsWith('/')) {
        return `${window.location.origin}${url}`;
      }
    }
    return url;
  }
};

/**
 * Validates if a media source is playable
 */
export const isValidMediaSource = (source: MediaItem): boolean => {
  return !!(source && source.url && source.type !== MediaType.UNKNOWN);
};
