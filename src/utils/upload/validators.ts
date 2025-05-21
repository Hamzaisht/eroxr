
/**
 * Allowed MIME types for image uploads
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Allowed MIME types for video uploads
 */
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime'
];

/**
 * Validates a file for upload based on size and type
 */
export const validateFileForUpload = (
  file: File, 
  maxSizeMB: number = 100
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { 
      valid: false, 
      error: `File size exceeds the maximum allowed (${maxSizeMB}MB)`
    };
  }
  
  // Check if file is empty
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  return { valid: true };
};
