
/**
 * Supported media types for upload
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/gif', 
  'image/webp'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4', 
  'video/webm', 
  'video/quicktime'
];

/**
 * Checks if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Checks if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Validates a file for upload
 */
export const validateFileForUpload = (file: File, maxSizeInMB = 100): {
  valid: boolean;
  error?: string;
} => {
  // Check if file is valid
  if (!file || !(file instanceof File)) {
    return {
      valid: false,
      error: 'Invalid file'
    };
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeInMB}MB.`
    };
  }

  // Check if empty
  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }

  // Check file type
  const isValidType = isImageFile(file) || isVideoFile(file);
  if (!isValidType) {
    return {
      valid: false,
      error: 'Unsupported file type. Please upload an image or video.'
    };
  }

  return { valid: true };
};
