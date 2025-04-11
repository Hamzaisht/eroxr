
/**
 * Supported file types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska'
];

/**
 * Check if a file is a valid image
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if a file is a valid video
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Validate that the file is an accepted media type
 */
export const validateMediaFile = (
  file: File, 
  options: {
    maxSizeInMB?: number;
    allowedTypes?: string[];
  } = {}
): {
  valid: boolean;
  message?: string;
} => {
  const maxSize = (options.maxSizeInMB || 100) * 1024 * 1024; // Default 100MB
  const allowedTypes = options.allowedTypes || [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES];
  
  // Check file size
  if (file.size > maxSize) {
    const sizeInMB = Math.round(file.size / (1024 * 1024));
    const maxSizeInMB = options.maxSizeInMB || 100;
    return {
      valid: false,
      message: `File size exceeds maximum allowed (${sizeInMB}MB / ${maxSizeInMB}MB)`
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `File type not supported: ${file.type}`
    };
  }
  
  return { valid: true };
};
