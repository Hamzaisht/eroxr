
/**
 * File Utility Functions for Upload Operations
 */

/**
 * Creates a unique file path for upload
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = file.name.split('.').pop() || '';
  
  return `${userId}/${timestamp}-${randomString}.${fileExtension}`;
}

/**
 * Generates a human-readable file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Creates a file preview URL
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a file preview URL to free memory
 */
export function revokeFilePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Run a comprehensive diagnostic on a file object
 * This helps identify issues with file objects that may cause upload failures
 */
export function runFileDiagnostic(file: File): void {
  if (!file) {
    console.warn('FILE DIAGNOSTIC: File is null or undefined');
    return;
  }
  
  console.log('FILE DIAGNOSTIC:', {
    isFile: file instanceof File,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });
}
