
/**
 * Format utilities for media
 */

/**
 * Infer content type from file extension
 */
export function inferContentTypeFromExtension(url: string): string {
  if (!url) return '';
  
  const extension = url.split('.').pop()?.toLowerCase();
  
  if (!extension) return '';
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
  const videoExtensions = ['mp4', 'webm', 'ogv', 'mov', 'avi', 'm4v'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
  
  if (imageExtensions.includes(extension)) {
    return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
  }
  
  if (videoExtensions.includes(extension)) {
    return `video/${extension}`;
  }
  
  if (audioExtensions.includes(extension)) {
    return `audio/${extension}`;
  }
  
  return 'application/octet-stream';
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration in seconds to MM:SS format
 */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
