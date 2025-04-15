
/**
 * File validation utilities
 */

// Common MIME types for images
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif'
];

// Common MIME types for videos
export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-ms-wmv'
];

// Common MIME types for audio
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm',
  'audio/mp3',
  'audio/aac'
];

/**
 * Check if a file is a valid image
 * @param file - The file to check
 * @returns true if the file is a valid image
 */
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}

/**
 * Check if a file is a valid video
 * @param file - The file to check
 * @returns true if the file is a valid video
 */
export function isVideoFile(file: File): boolean {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
}

/**
 * Check if a file is a valid audio file
 * @param file - The file to check
 * @returns true if the file is a valid audio
 */
export function isAudioFile(file: File): boolean {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
}

/**
 * Validate file size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum file size in MB
 * @returns An object with validation result and optional error message
 */
export function validateFileSize(file: File, maxSizeInMB: number = 100): {
  valid: boolean;
  message?: string;
} {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      message: `File size exceeds the maximum allowed size of ${maxSizeInMB}MB`
    };
  }
  
  return { valid: true };
}

/**
 * Validate file type
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @returns An object with validation result and optional error message
 */
export function validateFileType(file: File, allowedTypes: string[]): {
  valid: boolean;
  message?: string;
} {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: `File type not allowed: ${file.type}`
    };
  }
  
  return { valid: true };
}

/**
 * Comprehensive file validation
 * @param file - The file to validate
 * @param options - Validation options
 * @returns An object with validation result and optional error message
 */
export function validateFile(
  file: File,
  options: {
    maxSizeInMB?: number;
    allowedTypes?: string[];
  } = {}
): {
  valid: boolean;
  message?: string;
} {
  // Check file size
  if (options.maxSizeInMB) {
    const sizeValidation = validateFileSize(file, options.maxSizeInMB);
    if (!sizeValidation.valid) {
      return sizeValidation;
    }
  }
  
  // Check file type
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const typeValidation = validateFileType(file, options.allowedTypes);
    if (!typeValidation.valid) {
      return typeValidation;
    }
  }
  
  return { valid: true };
}
