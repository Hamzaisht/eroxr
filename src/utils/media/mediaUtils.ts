
import { MediaSource, MediaType } from "@/types/media";

/**
 * Determines the media type from a file or URL
 * @param url Media file URL
 * @returns The detected MediaType
 */
export function determineMediaType(url: string): MediaType {
  if (!url) return MediaType.UNKNOWN;

  const lowerCaseUrl = url.toLowerCase();
  
  // Check for image extensions
  if (lowerCaseUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/)) {
    return MediaType.IMAGE;
  }
  
  // Check for video extensions
  if (lowerCaseUrl.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv|mkv)$/)) {
    return MediaType.VIDEO;
  }
  
  // Check for audio extensions
  if (lowerCaseUrl.match(/\.(mp3|wav|ogg|m4a|aac|flac)$/)) {
    return MediaType.AUDIO;
  }
  
  // Check for document extensions
  if (lowerCaseUrl.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/)) {
    return MediaType.DOCUMENT;
  }
  
  // Default to unknown if can't determine
  return MediaType.UNKNOWN;
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
  if (source.video_url) {
    return source.video_url;
  }
  
  if (source.media_url) {
    return source.media_url;
  }
  
  // If media_urls array is provided, return the first one
  if (source.media_urls && source.media_urls.length > 0) {
    return source.media_urls[0];
  }
  
  // If video_urls array is provided, return the first one
  if (source.video_urls && source.video_urls.length > 0) {
    return source.video_urls[0];
  }
  
  return null;
}
