
import { MediaSource, MediaType } from '@/types/media';

/**
 * Extract media URL from various source formats
 * @param source The media source object or string
 * @returns The extracted URL
 */
export function extractMediaUrl(source: MediaSource | string | null | undefined): string | null {
  if (!source) return null;

  if (typeof source === 'string') {
    return source;
  }

  // Try to get the URL from various properties
  return source.url || 
         source.media_url || 
         source.video_url ||
         null;
}

/**
 * Creates a unique file path for uploaded media files
 * @param filename Original filename
 * @returns A unique filepath with timestamp
 */
export function createUniqueFilePath(filename: string): string {
  return `media/${Date.now()}-${filename}`;
}

/**
 * Normalize a media source to ensure it has the expected properties
 * @param item The media item to normalize
 * @returns A normalized MediaSource object
 */
export function normalizeMediaSource(item: MediaSource | string): MediaSource {
  if (typeof item === 'string') {
    // Convert string URL to MediaSource object
    return {
      url: item,
      type: determineMediaType(item),
    };
  }

  // Ensure the object has a URL property
  if (!item.url && (item.media_url || item.video_url)) {
    const url = item.media_url || item.video_url || '';
    const type = item.type || determineMediaType(url);

    return {
      ...item,
      url,
      type,
    };
  }

  // If item already has URL and type, return it as is
  if (item.url && item.type) {
    return item;
  }

  // Fallback - create a default MediaSource
  return {
    url: extractMediaUrl(item) || '',
    type: item.type || MediaType.UNKNOWN,
    thumbnail: item.thumbnail || undefined,
  };
}

/**
 * Determine the media type based on the URL
 * @param url The media URL
 * @returns The determined MediaType
 */
export function determineMediaType(url: string): MediaType {
  if (!url) return MediaType.UNKNOWN;
  
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.match(/\.(mp4|webm|mov|avi|m4v)($|\?)/i)) {
    return MediaType.VIDEO;
  }
  
  if (lowercaseUrl.match(/\.(jpg|jpeg|png|webp|avif|tif|tiff)($|\?)/i)) {
    return MediaType.IMAGE;
  }
  
  if (lowercaseUrl.match(/\.(gif)($|\?)/i)) {
    return MediaType.GIF;
  }
  
  if (lowercaseUrl.match(/\.(mp3|wav|ogg|aac)($|\?)/i)) {
    return MediaType.AUDIO;
  }
  
  if (lowercaseUrl.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)($|\?)/i)) {
    return MediaType.DOCUMENT;
  }
  
  return MediaType.UNKNOWN;
}
