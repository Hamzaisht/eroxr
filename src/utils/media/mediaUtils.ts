
import { v4 as uuidv4 } from 'uuid';
import { MediaType } from './types';

/**
 * Determine media type from file or URL
 */
export const determineMediaType = (fileOrUrl: File | string): MediaType => {
  if (typeof fileOrUrl === 'string') {
    // URL-based detection
    const url = fileOrUrl.toLowerCase();
    if (url.match(/\.(jpeg|jpg|png|gif|webp|bmp|svg)($|\?)/)) {
      return MediaType.IMAGE;
    } else if (url.match(/\.(mp4|webm|mov|avi|wmv|flv|mkv)($|\?)/)) {
      return MediaType.VIDEO;
    } else if (url.match(/\.(mp3|wav|ogg|flac|aac)($|\?)/)) {
      return MediaType.AUDIO;
    } else {
      return MediaType.UNKNOWN;
    }
  } else {
    // File-based detection
    const mimeType = fileOrUrl.type;
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (mimeType.startsWith('audio/')) {
      return MediaType.AUDIO;
    } else {
      return MediaType.UNKNOWN;
    }
  }
};

/**
 * Create a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  // Extract extension
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Create safe name from original filename
  const safeFilename = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''));
  
  // Create unique path with timestamp and UUID
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}_${uniqueId}_${safeFilename}.${extension}`;
};

/**
 * Get mime type from file extension
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  const ext = extension.toLowerCase().replace('.', '');
  
  // Common image formats
  if (['jpg', 'jpeg'].includes(ext)) return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'svg') return 'image/svg+xml';
  
  // Common video formats
  if (ext === 'mp4') return 'video/mp4';
  if (ext === 'webm') return 'video/webm';
  if (ext === 'mov') return 'video/quicktime';
  
  // Common audio formats
  if (ext === 'mp3') return 'audio/mpeg';
  if (ext === 'wav') return 'audio/wav';
  if (ext === 'ogg') return 'audio/ogg';
  
  // Default
  return 'application/octet-stream';
};

/**
 * Sanitize a filename for safe storage
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9-_]/gi, '_') // Replace non-alphanumeric with underscore
    .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')       // Remove leading/trailing underscores
    .toLowerCase()
    .substring(0, 50);             // Limit length
};

/**
 * Upload a file to storage
 */
export const uploadFileToStorage = async (
  bucket: string, 
  path: string, 
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  // In this stub implementation, we simulate a successful upload
  // This should be replaced with actual storage implementation
  console.log(`Simulating upload to ${bucket}/${path}`);
  
  // Return a mock success response
  return {
    success: true,
    url: `https://example.com/storage/${bucket}/${path}`
  };
};

/**
 * Extract media URL from a media source object
 */
export const extractMediaUrl = (mediaSource: any): string => {
  if (typeof mediaSource === 'string') {
    return mediaSource;
  }

  if (!mediaSource) {
    return '';
  }

  return (
    mediaSource.url ||
    mediaSource.video_url ||
    mediaSource.media_url ||
    mediaSource.image_url ||
    mediaSource.thumbnail_url ||
    mediaSource.src ||
    ''
  );
};
