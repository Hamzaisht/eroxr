
/**
 * Infer content type from file extension
 * @param filename Filename with extension
 * @returns Inferred content type or fallback
 */
export function inferContentTypeFromExtension(filename: string): string {
  if (!filename) return 'application/octet-stream';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  if (!extension) return 'application/octet-stream';
  
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'bmp': 'image/bmp',
    'svg': 'image/svg+xml',
    
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'mov': 'video/quicktime',
    'mkv': 'video/x-matroska',
    'avi': 'video/x-msvideo',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'aac': 'audio/aac',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
}

/**
 * Format file size to human readable format
 * @param bytes File size in bytes
 * @returns Human readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
}

/**
 * Format a media duration in seconds to readable time format
 * @param seconds Duration in seconds
 * @returns Formatted time string (MM:SS or HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return '00:00';
  }
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Creates a media monitoring report to track issues
 */
export function reportMediaError(
  url: string,
  errorType: 'load_failure' | 'playback_error' | 'processing_error',
  retryCount: number,
  mediaType: string,
  componentName: string
): void {
  console.error(`Media Error Report: ${componentName} - ${errorType}`, {
    url,
    errorType,
    retryCount,
    mediaType,
    component: componentName,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });
}
