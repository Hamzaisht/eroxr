
/**
 * Supported image file types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff'
];

/**
 * Supported video file types
 */
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv',
  'video/x-flv'
];

/**
 * Check if file is an image
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Validate file for upload
 * @param file The file to validate
 * @returns Object with validation result and optional error message
 */
export const validateFileForUpload = (file: File): { valid: boolean; message?: string } => {
  // Check if file exists and is a File instance
  if (!file || !(file instanceof File)) {
    return { valid: false, message: 'Invalid file object' };
  }

  // Check if file has content
  if (file.size === 0) {
    return { valid: false, message: 'File is empty (0 bytes)' };
  }

  // Check if file is too large (default: 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    const sizeMB = Math.round(file.size / (1024 * 1024));
    return { valid: false, message: `File is too large (${sizeMB}MB). Maximum size is 100MB.` };
  }

  // Check if file type is supported
  const isValidType = isImageFile(file) || isVideoFile(file);
  if (!isValidType) {
    return { valid: false, message: `File type '${file.type}' is not supported` };
  }

  return { valid: true };
};
