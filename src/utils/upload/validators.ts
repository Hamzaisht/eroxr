
// Supported media types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
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
 * Check if a file is a valid image
 * @param file - File to validate
 * @returns true if it's a valid image file
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if a file is a valid video
 * @param file - File to validate
 * @returns true if it's a valid video file
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Validates a file based on type and size
 * @param file - File to validate
 * @param options - Validation options
 * @returns Validation result with status and message
 */
export interface ValidationOptions {
  allowedTypes?: string[];
  maxSizeInMB?: number;
  minSizeInKB?: number;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateFile = (file: File, options: ValidationOptions = {}): ValidationResult => {
  const {
    allowedTypes = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_VIDEO_TYPES],
    maxSizeInMB = 100,
    minSizeInKB = 1
  } = options;
  
  // Check if file is provided
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      message: `Unsupported file type. Please upload ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`
    };
  }
  
  // Check minimum file size
  const minSizeInBytes = minSizeInKB * 1024;
  if (file.size < minSizeInBytes) {
    return { 
      isValid: false, 
      message: `File size is too small. Minimum size is ${minSizeInKB}KB`
    };
  }
  
  // Check maximum file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return { 
      isValid: false, 
      message: `File size exceeds maximum limit of ${maxSizeInMB}MB`
    };
  }
  
  return { isValid: true };
};
