
import { MediaSource, MediaType } from "@/types/media";

/**
 * Extract media URL from various object shapes
 * @param media The media item to extract URL from
 */
export function extractMediaUrl(media: any): string {
  if (typeof media === 'string') {
    return media;
  }

  // Handle various shapes of media objects
  return media?.url || 
         media?.media_url || 
         media?.video_url || 
         media?.thumbnail || 
         media?.poster || 
         '';
}

/**
 * Determine the type of media from a URL or object
 * @param media The media to check
 */
export function determineMediaType(media: any): MediaType {
  if (!media) return MediaType.UNKNOWN;

  // If media already has a type, use it
  if (media.type && typeof media.type === 'string') {
    if (Object.values(MediaType).includes(media.type as MediaType)) {
      return media.type as MediaType;
    }
  }

  if (media.media_type && typeof media.media_type === 'string') {
    if (Object.values(MediaType).includes(media.media_type as MediaType)) {
      return media.media_type as MediaType;
    }
  }

  // Check by URL extension
  const url = extractMediaUrl(media);
  if (!url) return MediaType.UNKNOWN;

  const extension = url.split('.').pop()?.toLowerCase();
  if (!extension) return MediaType.UNKNOWN;

  if (['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(extension)) {
    return MediaType.IMAGE;
  } else if (['gif'].includes(extension)) {
    return MediaType.GIF;
  } else if (['mp4', 'webm', 'ogg', 'mov'].includes(extension)) {
    return MediaType.VIDEO;
  } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
    return MediaType.AUDIO;
  } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(extension)) {
    return MediaType.DOCUMENT;
  }

  return MediaType.UNKNOWN;
}

/**
 * Normalize a media source to ensure it has the correct shape
 * @param item The media source to normalize
 */
export function normalizeMediaSource(item: MediaSource | string): MediaSource {
  if (typeof item === 'string') {
    return {
      url: item,
      type: determineMediaType(item)
    };
  }

  // Handle legacy format
  if ('media_url' in item || 'video_url' in item) {
    return {
      url: item.url || item.media_url || item.video_url || '',
      type: item.type || determineMediaType(item),
      thumbnail: item.thumbnail || undefined,
      poster: item.poster || undefined
    };
  }

  return {
    url: item.url || '',
    type: item.type || determineMediaType(item),
    thumbnail: item.thumbnail || undefined,
    poster: item.poster || undefined
  };
}

/**
 * Create a unique file path for uploads
 * @param originalName Original file name
 */
export function createUniqueFilePath(originalName: string): string {
  return `${Date.now()}-${originalName}`;
}
