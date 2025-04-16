
import { MediaType } from './types';

/**
 * Format file size to human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration in seconds to readable format (MM:SS)
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get a friendly name for a media type
 */
export function getMediaTypeName(type: MediaType): string {
  switch (type) {
    case MediaType.IMAGE: return 'Image';
    case MediaType.VIDEO: return 'Video';
    case MediaType.AUDIO: return 'Audio';
    case MediaType.DOCUMENT: return 'Document';
    default: return 'File';
  }
}

/**
 * Get file extension from a URL or filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}
