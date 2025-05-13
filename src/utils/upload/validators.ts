
/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if a file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Check if a file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Get supported image types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Get supported video types
 */
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

/**
 * Validate a file for upload
 */
export function validateFileForUpload(file: File, maxSizeMB = 50): { valid: boolean; error?: string } {
  // Check if file is defined
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  // Check if it's a valid File object
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  // Check for zero-sized files
  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes)' };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File is too large. Maximum size is ${maxSizeMB}MB` 
    };
  }
  
  // Check if file has a type
  if (!file.type) {
    return { valid: false, error: 'File has no specified type' };
  }
  
  return { valid: true };
}
