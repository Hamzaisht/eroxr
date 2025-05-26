
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
 * Check if a file is audio
 */
export const isAudioFile = (file: File): boolean => {
  return file.type.startsWith('audio/');
};

/**
 * Validate file for upload with detailed checks
 */
export const validateFileForUpload = (file: File): { valid: boolean; error?: string } => {
  // Check if it's a valid File object
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }

  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 100MB limit' };
  }

  // Check if file has content
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  // Check file type
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mp3', 'audio/wav', 'audio/ogg',
    'application/pdf'
  ];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not supported` };
  }

  return { valid: true };
};

/**
 * Validate multiple files
 */
export const validateMultipleFiles = (files: File[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  for (const file of files) {
    const validation = validateFileForUpload(file);
    if (!validation.valid) {
      errors.push(`${file.name}: ${validation.error}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
