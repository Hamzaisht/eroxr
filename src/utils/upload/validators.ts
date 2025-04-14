
/**
 * Check if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Check if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Check if a file is an audio file
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Supported image MIME types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

/**
 * Supported video MIME types
 */
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo'
];

/**
 * Check if the file size is within the limit
 */
export const isFileSizeValid = (file: File, maxSizeMB: number): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024; // Convert MB to bytes
};

/**
 * Validate file based on type and size
 */
export const validateFile = (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): ValidationResult => {
  // Check file size
  if (options.maxSizeMB && !isFileSizeValid(file, options.maxSizeMB)) {
    return {
      valid: false,
      message: `File size exceeds ${options.maxSizeMB}MB limit`
    };
  }

  // Check file type
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const isTypeAllowed = options.allowedTypes.some(type => {
      // Handle wildcards like "image/*"
      if (type.endsWith('/*')) {
        const mainType = type.split('/')[0];
        return file.type.startsWith(`${mainType}/`);
      }
      return file.type === type;
    });

    if (!isTypeAllowed) {
      return {
        valid: false,
        message: `File type not allowed. Supported types: ${options.allowedTypes.join(', ')}`
      };
    }
  }

  return { valid: true };
};

export interface ValidationResult {
  valid: boolean;
  message?: string;
}
