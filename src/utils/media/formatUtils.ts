
/**
 * Infers the content type from a file extension
 */
export function inferContentTypeFromExtension(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Image types
  if (['jpg', 'jpeg'].includes(extension)) return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'svg') return 'image/svg+xml';
  
  // Video types
  if (extension === 'mp4') return 'video/mp4';
  if (extension === 'webm') return 'video/webm';
  if (extension === 'mov') return 'video/quicktime';
  if (extension === 'avi') return 'video/x-msvideo';
  
  // Audio types
  if (extension === 'mp3') return 'audio/mpeg';
  if (extension === 'wav') return 'audio/wav';
  if (extension === 'ogg') return 'audio/ogg';
  
  // Document types
  if (extension === 'pdf') return 'application/pdf';
  if (['doc', 'docx'].includes(extension)) return 'application/msword';
  if (['xls', 'xlsx'].includes(extension)) return 'application/vnd.ms-excel';
  if (extension === 'txt') return 'text/plain';
  
  // Default to octet-stream for unknown types
  return 'application/octet-stream';
}

/**
 * Formats file size from bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Adds common media-specific URL parameters
 */
export function addMediaUrlParams(url: string, params: Record<string, string>): string {
  const urlObj = new URL(url);
  
  Object.entries(params).forEach(([key, value]) => {
    urlObj.searchParams.append(key, value);
  });
  
  return urlObj.toString();
}
