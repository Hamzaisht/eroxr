
/**
 * Create a preview URL for a file
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL to prevent memory leaks
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Format file size to human-readable string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
};
