
import { MediaType } from "./types";

/**
 * Determine media type from an item or URL
 */
export function determineMediaType(item: any): MediaType {
  // Handle direct URL string
  if (typeof item === 'string') {
    const url = item.toLowerCase();
    if (url.match(/\.(mp4|webm|mov|avi)($|\?)/)) return MediaType.VIDEO;
    if (url.match(/\.(jpe?g|png|gif|webp|avif|svg)($|\?)/)) return MediaType.IMAGE;
    if (url.match(/\.(mp3|wav|ogg|aac)($|\?)/)) return MediaType.AUDIO;
    if (url.includes('/videos/') || url.includes('/shorts/')) return MediaType.VIDEO;
    return MediaType.UNKNOWN;
  }

  // Handle object
  if (!item) return MediaType.UNKNOWN;

  // Check explicit media type if available
  if (item.media_type === 'video' || item.content_type === 'video') {
    return MediaType.VIDEO;
  }
  
  if (item.media_type === 'image' || item.content_type === 'image') {
    return MediaType.IMAGE;
  }
  
  if (item.media_type === 'audio' || item.content_type === 'audio') {
    return MediaType.AUDIO;
  }

  // Check URL presence
  if (item.video_url) return MediaType.VIDEO;
  
  // Check media_url format if it exists
  if (item.media_url) {
    if (typeof item.media_url === 'string') {
      return determineMediaType(item.media_url);
    } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return determineMediaType(item.media_url[0]);
    }
  }

  return MediaType.UNKNOWN;
}

/**
 * Extract the appropriate media URL from an item
 */
export function extractMediaUrl(item: any): string | null {
  // Handle direct string
  if (typeof item === 'string') return item;
  
  if (!item) return null;
  
  // Get the appropriate URL based on media type
  const mediaType = determineMediaType(item);
  
  if (mediaType === MediaType.VIDEO && item.video_url) {
    return item.video_url;
  }
  
  if (item.media_url) {
    if (typeof item.media_url === 'string') {
      return item.media_url;
    } else if (Array.isArray(item.media_url) && item.media_url.length > 0) {
      return item.media_url[0];
    }
  }
  
  return null;
}

/**
 * Get content type from a file or URL
 */
export function getContentType(fileOrUrl: File | string): string {
  if (typeof fileOrUrl !== 'string') {
    return fileOrUrl.type;
  }
  
  const url = fileOrUrl.toLowerCase();
  
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) {
    return 'image/jpeg';
  } else if (url.endsWith('.png')) {
    return 'image/png';
  } else if (url.endsWith('.gif')) {
    return 'image/gif';
  } else if (url.endsWith('.webp')) {
    return 'image/webp';
  } else if (url.endsWith('.svg')) {
    return 'image/svg+xml';
  } else if (url.endsWith('.mp4')) {
    return 'video/mp4';
  } else if (url.endsWith('.webm')) {
    return 'video/webm';
  } else if (url.endsWith('.mov') || url.endsWith('.qt')) {
    return 'video/quicktime';
  } else if (url.endsWith('.avi')) {
    return 'video/x-msvideo';
  }
  
  // For URLs without file extensions, check for common video patterns
  if (url.includes('/video/') || url.includes('videos/')) {
    return 'video/mp4';
  } 
  
  // Default to image for media URLs
  return 'image/jpeg';
}

/**
 * Infer content type from file extension
 */
export function inferContentTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    default:
      return 'application/octet-stream';
  }
}
