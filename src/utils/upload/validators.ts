
// Common file types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
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
  'video/x-ms-wmv',
  'video/mpeg'
];

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/webm'
];

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain'
];

/**
 * Check if a file is an image
 * @param file File to check
 * @returns boolean
 */
export const isImageFile = (file: File): boolean => {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if a file is a video
 * @param file File to check
 * @returns boolean
 */
export const isVideoFile = (file: File): boolean => {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
};

/**
 * Check if a file is an audio file
 * @param file File to check
 * @returns boolean
 */
export const isAudioFile = (file: File): boolean => {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
};

/**
 * Check if a file is a document
 * @param file File to check
 * @returns boolean
 */
export const isDocumentFile = (file: File): boolean => {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
};

/**
 * Validate file size
 * @param file File to check
 * @param maxSizeMB Maximum size in MB
 * @returns boolean
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param file File to check
 * @param allowedTypes Array of allowed MIME types
 * @returns boolean
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Get appropriate error message for validation failures
 * @param file File that failed validation
 * @param maxSizeMB Maximum size in MB
 * @param allowedTypes Array of allowed MIME types
 * @returns Error message string
 */
export const getValidationErrorMessage = (
  file: File,
  maxSizeMB: number,
  allowedTypes: string[]
): string => {
  if (!validateFileSize(file, maxSizeMB)) {
    return `File too large. Maximum size is ${maxSizeMB}MB.`;
  }
  
  if (!validateFileType(file, allowedTypes)) {
    return 'File type not supported.';
  }
  
  return 'Invalid file.';
};

/**
 * Full file validation with all checks
 * @param file File to validate
 * @param options Validation options
 * @returns Object with validation result and error message
 */
export const validateFile = (
  file: File,
  options: {
    maxSizeMB: number;
    allowedTypes: string[];
  }
): { valid: boolean; message?: string } => {
  if (!file) {
    return { valid: false, message: 'No file provided.' };
  }
  
  if (!validateFileSize(file, options.maxSizeMB)) {
    return { 
      valid: false, 
      message: `File too large. Maximum size is ${options.maxSizeMB}MB.` 
    };
  }
  
  if (!validateFileType(file, options.allowedTypes)) {
    return { 
      valid: false, 
      message: 'File type not supported.' 
    };
  }
  
  return { valid: true };
};
