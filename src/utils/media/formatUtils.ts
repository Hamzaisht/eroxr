
/**
 * Infers content type from file extension
 * 
 * @param filename The filename with extension
 * @returns The MIME type
 */
export const inferContentTypeFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  if (!ext) return 'application/octet-stream';
  
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
  
  // Common document formats
  if (ext === 'pdf') return 'application/pdf';
  if (['doc', 'docx'].includes(ext)) return 'application/msword';
  if (['xls', 'xlsx'].includes(ext)) return 'application/vnd.ms-excel';
  
  // Default
  return 'application/octet-stream';
};

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }
  
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }
  
  if (sizeInBytes < 1024 * 1024 * 1024) {
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  
  return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

/**
 * Format seconds to MM:SS string
 */
export const formatDuration = (durationInSeconds: number): string => {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = Math.floor(durationInSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Detects if running in mobile environment
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
