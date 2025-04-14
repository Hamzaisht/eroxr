
// Define constant arrays of supported media types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'image/webp', 
  'image/svg+xml',
  'image/avif'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4', 
  'video/webm', 
  'video/quicktime', 
  'video/x-msvideo',
  'video/mpeg'
];

/**
 * Validates if the file is acceptable for upload
 */
export const validateMediaFile = (
  file: File, 
  options: {
    maxSizeInMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; message?: string } => {
  // Check file size
  const maxSize = (options.maxSizeInMB || 100) * 1024 * 1024; // Default 100MB
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `File is too large. Maximum size is ${options.maxSizeInMB || 100}MB.`
    };
  }

  // Check file type if allowed types are specified
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    if (!options.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        message: `File type not supported. Allowed types: ${options.allowedTypes.join(', ')}`
      };
    }
  }

  return { valid: true };
};

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
