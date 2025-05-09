
/**
 * Validates if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Validates if a file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Validates if a file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Validates file before upload to ensure it's valid
 */
export function validateFileForUpload(file: unknown): { valid: boolean, message?: string } {
  if (!file) {
    return { valid: false, message: 'No file provided' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, message: 'Invalid file object' };
  }
  
  if (file.size === 0) {
    return { valid: false, message: `File "${file.name}" is empty (0 bytes)` };
  }
  
  return { valid: true };
}

/**
 * Validates file size
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}
