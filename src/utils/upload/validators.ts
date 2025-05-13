
/**
 * Validates a file for upload
 */
export const validateFileForUpload = (file: File | null): { valid: boolean; error?: string } => {
  // Basic validation
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes)' };
  }
  
  // Massive file check
  if (file.size > 500 * 1024 * 1024) { // 500 MB
    return { valid: false, error: `File too large (${Math.round(file.size / (1024 * 1024))} MB)` };
  }
  
  return { valid: true };
};

/**
 * Checks if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Checks if a file is a video
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Checks if a file is an audio file
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Checks if a file is a document
 */
export const isDocumentFile = (file: File): boolean => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];
  
  return documentTypes.includes(file.type);
};
