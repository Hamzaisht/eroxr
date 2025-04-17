
/**
 * Creates a blob URL preview for a file
 * @param file File to create preview for
 * @returns Local URL for preview
 */
export const createFilePreview = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error("Error creating file preview:", error);
    return "";
  }
};

/**
 * Revokes a blob URL to prevent memory leaks
 * @param url URL to revoke
 */
export const revokeFilePreview = (url: string): void => {
  try {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Error revoking file preview:", error);
  }
};

/**
 * Checks if file size is within limits
 * @param file File to check
 * @param maxSizeMB Maximum size in MB
 * @returns Boolean indicating if file is within size limit
 */
export const isFileSizeValid = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Checks if file type is in allowed types
 * @param file File to check
 * @param allowedTypes Array of allowed MIME types
 * @returns Boolean indicating if file type is allowed
 */
export const isFileTypeValid = (file: File, allowedTypes: string[]): boolean => {
  if (allowedTypes.includes('*')) return true;
  
  // Check for wildcard types (e.g., 'image/*')
  const wildcardTypes = allowedTypes.filter(type => type.endsWith('/*'));
  
  // Check exact match
  if (allowedTypes.includes(file.type)) {
    return true;
  }
  
  // Check wildcard match
  for (const wildcardType of wildcardTypes) {
    const prefix = wildcardType.split('/*')[0];
    if (file.type.startsWith(prefix + '/')) {
      return true;
    }
  }
  
  return false;
};

/**
 * Formats file size into human readable format
 * @param bytes File size in bytes
 * @param decimals Decimal places to show
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
