
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
 * Calculate aspect ratio dimensions
 */
export function calculateAspectRatioDimensions(
  originalWidth: number, 
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  // If no target dimensions provided, return original dimensions
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }
  
  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight;
  
  // If targetWidth is provided but not targetHeight
  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio)
    };
  }
  
  // If targetHeight is provided but not targetWidth
  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight
    };
  }
  
  // If both are provided, maintain aspect ratio within bounds
  if (targetWidth && targetHeight) {
    const targetRatio = targetWidth / targetHeight;
    
    if (aspectRatio > targetRatio) {
      // Width constrains
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio)
      };
    } else {
      // Height constrains
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight
      };
    }
  }
  
  // Fallback
  return { width: originalWidth, height: originalHeight };
}
