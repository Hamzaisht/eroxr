
/**
 * Media file validation utilities
 */

export interface FileValidationResult {
  valid: boolean;
  message?: string;
}

export interface FileValidationOptions {
  maxSizeInMB?: number;
  allowedTypes?: string[];
  minSizeInKB?: number;
}

const DEFAULT_MAX_SIZE = 100 * 1024 * 1024; // 100MB
const DEFAULT_MIN_SIZE = 1 * 1024; // 1KB

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4', 
  'video/webm', 
  'video/quicktime', 
  'video/x-msvideo'
];

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/gif', 
  'image/webp'
];

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg', 
  'audio/wav', 
  'audio/ogg'
];

export const SUPPORTED_MEDIA_TYPES = [
  ...SUPPORTED_VIDEO_TYPES,
  ...SUPPORTED_IMAGE_TYPES,
  ...SUPPORTED_AUDIO_TYPES
];

/**
 * Validates a file based on size and type
 */
export const validateMediaFile = (
  file: File, 
  options: FileValidationOptions = {}
): FileValidationResult => {
  const {
    maxSizeInMB = 100,
    minSizeInKB = 1,
    allowedTypes = SUPPORTED_MEDIA_TYPES
  } = options;

  const maxSize = maxSizeInMB * 1024 * 1024;
  const minSize = minSizeInKB * 1024;

  // Check minimum size
  if (file.size < minSize) {
    return { 
      valid: false, 
      message: `File too small. Minimum size is ${minSizeInKB}KB.`
    };
  }

  // Check maximum size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      message: `File too large. Maximum size is ${maxSizeInMB}MB.`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return { 
      valid: false, 
      message: `Unsupported file type: ${file.type}. Allowed types: ${allowedTypes.map(t => t.replace('image/', '').replace('video/', '')).join(', ')}`
    };
  }

  return { valid: true };
};

/**
 * Determines if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Determines if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Determines if a file is an audio file
 */
export const isAudioFile = (file: File): boolean => {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
};

/**
 * Gets the media type from a file
 */
export const getMediaType = (file: File): 'image' | 'video' | 'audio' | 'unknown' => {
  if (isImageFile(file)) return 'image';
  if (isVideoFile(file)) return 'video';
  if (isAudioFile(file)) return 'audio';
  return 'unknown';
};
