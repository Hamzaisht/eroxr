
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
