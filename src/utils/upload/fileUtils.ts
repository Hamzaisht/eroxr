
/**
 * Creates a unique file path for uploads
 * @param userId User ID for the upload
 * @param file The file being uploaded
 * @returns A unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = file.name.split('.').pop();
  
  return `${userId}/${timestamp}-${random}.${extension}`;
}

/**
 * Analyzes a file for diagnostic purposes
 * @param file The file to analyze
 * @returns Diagnostic information
 */
export function runFileDiagnostic(file: File): { size: number; type: string; name: string } {
  console.log(`Diagnostic for file: ${file.name}`);
  console.log(`File size: ${formatFileSize(file.size)}`);
  console.log(`File type: ${file.type}`);
  
  return {
    size: file.size,
    type: file.type,
    name: file.name
  };
}

/**
 * Formats file size in a human-readable format
 * @param bytes File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates if a file is within acceptable size limits
 * @param file File to validate
 * @param maxSizeInMB Maximum allowed size in MB
 * @returns Whether the file is within size limits
 */
export function validateFileSize(file: File, maxSizeInMB: number = 10): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
}

/**
 * Validates if a file is of an allowed type
 * @param file File to validate
 * @param allowedTypes Array of allowed MIME types
 * @returns Whether the file is of an allowed type
 */
export function validateFileType(file: File, allowedTypes: string[] = []): boolean {
  if (allowedTypes.length === 0) return true;
  return allowedTypes.some(type => file.type.startsWith(type) || file.type === type);
}
