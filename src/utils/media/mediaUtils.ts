
import { v4 as uuidv4 } from 'uuid';
import { getFileExtension } from '../upload/validators';

/**
 * Create a unique file path for uploading
 * @param userId User ID for organization
 * @param file File being uploaded
 * @returns A unique path string for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  // Get clean filename and extension
  const extension = getFileExtension(file);
  const baseFilename = file.name.replace(/\.[^/.]+$/, "");
  const sanitizedName = sanitizeFilename(baseFilename);
  
  // Generate a timestamp with random string to ensure uniqueness
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}_${uniqueId}_${sanitizedName}.${extension}`;
}

/**
 * Sanitize a filename for storage
 * @param filename Original filename
 * @returns Safe filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9-_]/gi, '_') // Replace non-alphanumeric with underscore
    .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')       // Remove leading/trailing underscores
    .toLowerCase()
    .substring(0, 50);             // Limit length
}

/**
 * Extract the content URL from a media object
 * @param media The media object or URL string
 * @returns The extracted URL
 */
export function extractMediaUrl(media: any): string {
  if (!media) return '';
  
  // If it's a string, assume it's already a URL
  if (typeof media === 'string') return media;
  
  // Check all possible URL properties
  return media.url || 
         media.media_url || 
         media.video_url || 
         media.image_url || 
         media.thumbnail_url || 
         '';
}

/**
 * Get appropriate MIME type for an extension
 * @param extension File extension
 * @returns MIME type
 */
export function getMimeTypeFromExtension(extension: string): string {
  const ext = extension.toLowerCase();
  
  // Image types
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  
  // Video types
  if (ext === 'mp4') return 'video/mp4';
  if (ext === 'webm') return 'video/webm';
  if (ext === 'mov') return 'video/quicktime';
  
  // Audio types
  if (ext === 'mp3') return 'audio/mpeg';
  if (ext === 'wav') return 'audio/wav';
  if (ext === 'ogg') return 'audio/ogg';
  
  return 'application/octet-stream';
}
