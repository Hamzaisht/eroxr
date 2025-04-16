
/**
 * Format utilities for media files
 */

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format seconds to duration string (MM:SS)
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Get file extension from a filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Check if a file is audio based on its type
 */
export function isAudioFile(type: string): boolean {
  return type.startsWith('audio/');
}

/**
 * Check if a file is video based on its type
 */
export function isVideoFile(type: string): boolean {
  return type.startsWith('video/');
}

/**
 * Check if a file is an image based on its type
 */
export function isImageFile(type: string): boolean {
  return type.startsWith('image/');
}

/**
 * Check if a file is a document based on its type
 */
export function isDocumentFile(type: string): boolean {
  return [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/rtf'
  ].includes(type);
}
