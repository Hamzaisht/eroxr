
/**
 * Supported file types for uploads
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml'
];

export const SUPPORTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska'
];

export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/aac',
  'audio/mp4'
];

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size (in MB)
 */
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  return file.size <= maxSizeInMB * 1024 * 1024;
};

/**
 * Get file extension from file or filename
 */
export const getFileExtension = (fileOrName: File | string): string => {
  const name = typeof fileOrName === 'string' ? fileOrName : fileOrName.name;
  return name.split('.').pop()?.toLowerCase() || '';
};

/**
 * Generate a safe filename (alphanumeric with hyphens, underscores)
 */
export const sanitizeFileName = (fileName: string): string => {
  const extension = getFileExtension(fileName);
  const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
  const sanitized = baseName
    .replace(/[^a-z0-9-_]/gi, '-')
    .replace(/-+/g, '-');
  
  return `${sanitized}.${extension}`;
};

/**
 * Generate a unique filename with timestamp
 */
export const generateUniqueFileName = (file: File): string => {
  const extension = getFileExtension(file);
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${timestamp}-${random}.${extension}`;
};

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
 * Validate a file for upload
 */
export const validateFileForUpload = (file: File, maxSizeInMB = 100): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }
  
  if (!(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }
  
  if (file.size > maxSizeInMB * 1024 * 1024) {
    return { valid: false, error: `File size exceeds ${maxSizeInMB}MB limit` };
  }
  
  return { valid: true };
};
