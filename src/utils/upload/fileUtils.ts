
/**
 * File utility functions for media uploads
 */

/**
 * Runs a diagnostic analysis on a file to check its integrity and details
 * @param file File to diagnose
 */
export function runFileDiagnostic(file: File): void {
  if (!file) {
    console.error('Invalid file provided for diagnostic');
    return;
  }
  
  console.log('File diagnostic:', {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: new Date(file.lastModified).toISOString()
  });
}

/**
 * Creates a URL preview from a file
 * @param file The file to preview
 * @returns URL string for the preview
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a created file preview URL
 * @param url The URL to revoke
 */
export function revokeFilePreview(url: string): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Determines if a file is valid for upload
 * @param file The file to validate
 * @returns An object with validation result
 */
export function validateFileForUpload(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  // Limit file size (default: 100MB)
  const MAX_SIZE = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_SIZE) {
    return { 
      valid: false, 
      error: `File size exceeds maximum limit of ${(MAX_SIZE / (1024 * 1024)).toFixed(0)}MB` 
    };
  }
  
  return { valid: true };
}

/**
 * Checks if a file is an image
 * @param file The file to check
 * @returns Boolean indicating if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Checks if a file is a video
 * @param file The file to check
 * @returns Boolean indicating if file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Checks if a file is an audio file
 * @param file The file to check
 * @returns Boolean indicating if file is an audio
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Gets a user-friendly size string
 * @param bytes Size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export function getFormattedFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }
}
