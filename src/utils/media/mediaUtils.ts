
/**
 * Create a unique file path for uploading
 * @param userId User ID
 * @param file File object
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = file.name.split('.').pop();
  return `${userId}/${timestamp}-${randomString}.${extension}`;
}

/**
 * Format file size to human-readable format
 * @param bytes Size in bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' bytes';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
  else return (bytes / 1073741824).toFixed(2) + ' GB';
}

/**
 * Convert seconds to time format (mm:ss)
 * @param seconds Duration in seconds
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
