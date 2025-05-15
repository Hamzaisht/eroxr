
import { MediaType, MediaSource } from './types';

/**
 * Extracts media URL from a MediaSource object or string
 */
export function extractMediaUrl(source: string | MediaSource | null): string | null {
  if (!source) return null;
  
  // If source is a string, return it directly
  if (typeof source === 'string') return source;
  
  // Extract from MediaSource object, checking various properties
  return source.url || 
         source.video_url || 
         source.media_url || 
         source.image_url || 
         source.thumbnail_url || 
         source.src || 
         null;
}

/**
 * Determine the media type from a URL or source object
 */
export function determineMediaType(source: string | MediaSource): MediaType {
  const url = typeof source === 'string' ? source : extractMediaUrl(source);
  
  if (!url) return MediaType.UNKNOWN;
  
  // Check for specific media type property in MediaSource
  if (typeof source !== 'string' && source.media_type) {
    return source.media_type;
  }
  
  // Simple URL-based detection
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.match(/\.(jpeg|jpg|png|gif|webp|avif|svg)$/i) || 
      lowerUrl.includes('/images/') ||
      lowerUrl.includes('/img/')) {
    return MediaType.IMAGE;
  }
  
  if (lowerUrl.match(/\.(mp4|mov|webm|avi|wmv|flv|mkv)$/i) || 
      lowerUrl.includes('/videos/') ||
      lowerUrl.includes('/video/')) {
    return MediaType.VIDEO;
  }
  
  if (lowerUrl.match(/\.(mp3|wav|ogg|aac|flac)$/i) || 
      lowerUrl.includes('/audio/')) {
    return MediaType.AUDIO;
  }
  
  return MediaType.UNKNOWN;
}

/**
 * Creates a unique file path for upload
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = file.name.split('.').pop() || '';
  
  return `${userId}/${timestamp}-${randomString}.${fileExtension}`;
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  
  const ext = extension.toLowerCase().replace('.', '');
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Normalize any media source to a standard MediaSource object
 */
export const normalizeMediaSource = (source: string | any): MediaSource => {
  // If source is a string, treat it as a URL
  if (typeof source === 'string') {
    return { 
      url: source,
      media_type: determineMediaType(source)
    };
  }
  
  // If it's null or undefined, return an empty object
  if (!source) {
    return { url: '', media_type: MediaType.UNKNOWN };
  }
  
  // Create a copy to avoid mutating the original
  const mediaSource: MediaSource = { ...source };
  
  // Set the url property based on available properties
  if (!mediaSource.url) {
    mediaSource.url = mediaSource.video_url || mediaSource.media_url || mediaSource.image_url || mediaSource.thumbnail_url || mediaSource.src || '';
  }
  
  // Also set src property for backwards compatibility
  if (!mediaSource.src) {
    mediaSource.src = mediaSource.url;
  }
  
  // Set media_type if not already set
  if (!mediaSource.media_type) {
    mediaSource.media_type = determineMediaType(mediaSource.url || '');
  }
  
  return mediaSource;
};
