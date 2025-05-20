
import { MediaSource } from "@/types/media";

/**
 * Determines the media type from a file or URL
 * @param url Media file URL
 * @returns The detected MediaType
 */
export function determineMediaType(url: string): string {
  if (!url) return 'unknown';

  const lowerCaseUrl = url.toLowerCase();
  
  // Check for image extensions
  if (lowerCaseUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)) {
    return 'image';
  }
  
  // Check for video extensions
  if (lowerCaseUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/)) {
    return 'video';
  }
  
  // Check for audio extensions
  if (lowerCaseUrl.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/)) {
    return 'audio';
  }
  
  // Check for document extensions
  if (lowerCaseUrl.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/)) {
    return 'document';
  }
  
  // Default to unknown if can't determine
  return 'unknown';
}

/**
 * Creates a unique file path for uploads
 * @param userId User ID for the upload
 * @param file The file being uploaded
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = file.name.split('.').pop();
  
  return `${userId}/${timestamp}-${random}.${extension}`;
}

/**
 * Extract the media URL from a MediaSource object or string
 * @param source MediaSource object or direct URL string
 * @returns The extracted URL as a string
 */
export function extractMediaUrl(source: MediaSource | string): string | null {
  if (!source) return null;
  
  // If it's already a string, just return it
  if (typeof source === "string") {
    return source;
  }
  
  // If it has a url property, use that
  if (source.url) {
    return source.url;
  }
  
  // For backward compatibility, try other properties
  // We need to use type assertion here to handle the backward compatibility properties
  const sourceWithCompat = source as any;
  
  if (sourceWithCompat.video_url) {
    return sourceWithCompat.video_url;
  }
  
  if (sourceWithCompat.media_url) {
    return sourceWithCompat.media_url;
  }
  
  // If media_urls array is provided, return the first one
  if (sourceWithCompat.media_urls && sourceWithCompat.media_urls.length > 0) {
    return sourceWithCompat.media_urls[0];
  }
  
  // If video_urls array is provided, return the first one
  if (sourceWithCompat.video_urls && sourceWithCompat.video_urls.length > 0) {
    return sourceWithCompat.video_urls[0];
  }
  
  return null;
}

/**
 * Normalizes a media source to ensure it has a consistent structure
 * @param source The source to normalize (string URL or MediaSource object)
 * @returns A normalized MediaSource object
 */
export function normalizeMediaSource(source: string | MediaSource | any): MediaSource {
  // If it's a string, convert it to a MediaSource object
  if (typeof source === 'string') {
    return {
      url: source,
      type: determineMediaType(source)
    };
  }

  // If it's already a MediaSource with url property, return it
  if (source && source.url) {
    return source;
  }

  // For backward compatibility, handle legacy formats
  let url = '';
  let type = source?.type || 'unknown';
  
  // Try to get the URL from various possible properties
  if (source?.video_url) {
    url = source.video_url;
    type = 'video';
  } else if (source?.media_url) {
    url = source.media_url;
    type = determineMediaType(source.media_url);
  } else if (source?.media_urls && source.media_urls.length > 0) {
    url = source.media_urls[0];
    type = determineMediaType(url);
  } else if (source?.video_urls && source.video_urls.length > 0) {
    url = source.video_urls[0];
    type = 'video';
  }

  // Create a normalized MediaSource object
  return {
    url,
    type,
    creator_id: source?.creator_id || '',
    contentCategory: source?.contentCategory || undefined
  };
}
