
// Define supported file types
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const SUPPORTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const SUPPORTED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
export const SUPPORTED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Maximum allowed file sizes in bytes
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Check if a file is an image
 */
export function isImageFile(file: File): boolean {
  return SUPPORTED_IMAGE_TYPES.includes(file.type);
}

/**
 * Check if a file is a video
 */
export function isVideoFile(file: File): boolean {
  return SUPPORTED_VIDEO_TYPES.includes(file.type);
}

/**
 * Check if a file is an audio file
 */
export function isAudioFile(file: File): boolean {
  return SUPPORTED_AUDIO_TYPES.includes(file.type);
}

/**
 * Check if a file is a document
 */
export function isDocumentFile(file: File): boolean {
  return SUPPORTED_DOCUMENT_TYPES.includes(file.type);
}

/**
 * Validate file for upload
 */
export function validateFileForUpload(file: File): { valid: boolean; error?: string } {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  // Check if file has content
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  // Check if file is too large
  let maxSize = MAX_IMAGE_SIZE;
  
  if (isImageFile(file)) {
    maxSize = MAX_IMAGE_SIZE;
  } else if (isVideoFile(file)) {
    maxSize = MAX_VIDEO_SIZE;
  } else if (isAudioFile(file)) {
    maxSize = MAX_AUDIO_SIZE;
  } else if (isDocumentFile(file)) {
    maxSize = MAX_DOCUMENT_SIZE;
  } else {
    return { valid: false, error: 'Unsupported file type' };
  }
  
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB` 
    };
  }
  
  return { valid: true };
}

/**
 * Get file extension from a File object
 */
export function getFileExtension(file: File | string): string {
  if (typeof file === 'string') {
    return file.split('.').pop()?.toLowerCase() || '';
  }
  return file.name.split('.').pop()?.toLowerCase() || '';
}

/**
 * Run comprehensive file diagnostics
 */
export function runFileDiagnostic(file: File): void {
  try {
    console.log('[FILE DIAGNOSTIC]', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      lastModified: new Date(file.lastModified).toISOString(),
      isFile: file instanceof File,
      hasProperties: {
        name: !!file.name,
        type: !!file.type,
        size: typeof file.size === 'number',
        lastModified: typeof file.lastModified === 'number',
      },
    });
  } catch (error) {
    console.error('[FILE DIAGNOSTIC ERROR]', error);
  }
}
