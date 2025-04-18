
/**
 * Format duration in seconds to MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || isNaN(bytes)) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Infer content type from file extension
 */
export const inferContentTypeFromExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  const mimeTypes: {[key: string]: string} = {
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
    'ogg': 'video/ogg',
    'mov': 'video/quicktime',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    
    // Default
    'bin': 'application/octet-stream'
  };
  
  return mimeTypes[extension] || 'application/octet-stream';
};
