
/**
 * Creates a URL for previewing a file
 * @param file File to create preview for
 * @returns URL to preview the file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a URL created with createFilePreview
 * @param url URL to revoke
 */
export function revokeFilePreview(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Get the file type category (image, video, audio, document)
 * @param file File to check
 * @returns Category string
 */
export function getFileType(file: File): string {
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type.startsWith('video/')) {
    return 'video';
  } else if (file.type.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'document';
  }
}

/**
 * Format file size to human-readable string
 * @param bytes Size in bytes
 * @returns Formatted string (e.g. "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
