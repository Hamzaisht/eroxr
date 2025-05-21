
// Supported file types
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska'
];

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/webm'
];

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

/**
 * Check if file is an image
 */
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}

/**
 * Check if file is a video
 */
export function isVideoFile(file: File): boolean {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
}

/**
 * Check if file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
}

/**
 * Check if file is a document
 */
export function isDocumentFile(file: File): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
}

/**
 * Get file extension from filename or File object
 */
export function getFileExtension(file: File | string): string {
  if (typeof file === 'string') {
    return file.split('.').pop()?.toLowerCase() || '';
  }
  
  return file.name.split('.').pop()?.toLowerCase() || '';
}

/**
 * Validate file before upload
 */
export function validateFileForUpload(file: File, maxSizeInMB = 100): { valid: boolean; error?: string } {
  // Basic validation
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      valid: false,
      error: `File size exceeds the maximum allowed (${maxSizeInMB}MB)`
    };
  }
  
  // Check if file is supported
  const isSupported = 
    isImageFile(file) || 
    isVideoFile(file) || 
    isAudioFile(file) || 
    isDocumentFile(file);
  
  if (!isSupported) {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type}`
    };
  }
  
  return { valid: true };
}
