
/**
 * Creates a temporary object URL for file preview
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a previously created object URL to free up memory
 */
export function revokeFilePreview(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Validates if a file is of a specific type
 */
export function validateFileType(file: File, acceptedTypes: string[]): boolean {
  return acceptedTypes.some(type => file.type.startsWith(type));
}

/**
 * Validates if a file is within the size limit
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Generates a unique filename for uploads
 */
export function generateUniqueFileName(file: File, userId?: string): string {
  const fileExt = file.name.split('.').pop() || '';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const prefix = userId ? `${userId}/` : '';
  
  return `${prefix}${timestamp}-${random}.${fileExt}`;
}
