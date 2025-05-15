
/**
 * Validate a file for upload
 * @param file The file to validate
 * @param maxSizeInMB Maximum allowed file size in MB
 * @returns Validation result with valid flag and optional error message
 */
export function validateFileForUpload(file: File, maxSizeInMB: number = 100): {
  valid: boolean;
  error?: string;
} {
  // Verify file isn't null
  if (!file) {
    return {
      valid: false,
      error: 'No file provided'
    };
  }
  
  // Verify it's actually a File object
  if (!(file instanceof File)) {
    return {
      valid: false,
      error: 'Invalid file object'
    };
  }
  
  // Verify file isn't empty
  if (file.size <= 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }
  
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${maxSizeInMB}MB`
    };
  }
  
  // Check for supported file types
  if (!isSupportedFileType(file)) {
    return {
      valid: false,
      error: 'Unsupported file type'
    };
  }
  
  return { valid: true };
}

/**
 * Check if file is a supported type
 * @param file File to check
 * @returns Whether the file type is supported
 */
export function isSupportedFileType(file: File): boolean {
  // Check if it's an image
  if (isImageFile(file)) {
    return true;
  }
  
  // Check if it's a video
  if (isVideoFile(file)) {
    return true;
  }
  
  // Check if it's an audio file
  if (isAudioFile(file)) {
    return true;
  }
  
  // Check if it's a document
  if (isDocumentFile(file)) {
    return true;
  }
  
  return false;
}

/**
 * Check if file is an image
 * @param file File to check
 * @returns Whether the file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is a video
 * @param file File to check
 * @returns Whether the file is a video
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * Check if file is an audio file
 * @param file File to check
 * @returns Whether the file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

/**
 * Check if file is a document
 * @param file File to check
 * @returns Whether the file is a document
 */
export function isDocumentFile(file: File): boolean {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  
  return documentTypes.includes(file.type);
}
