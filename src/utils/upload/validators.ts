
/**
 * Checks if the file is an image based on MIME type
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/');
};

/**
 * Checks if the file is a video based on MIME type
 */
export const isVideoFile = (file: File): boolean => {
  return file.type.startsWith('video/');
};

/**
 * Validates file size
 */
export const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

/**
 * Validates file type against a list of allowed types
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => {
    // Handle wildcard patterns like "image/*"
    if (type.endsWith('/*')) {
      const prefix = type.split('/')[0];
      return file.type.startsWith(`${prefix}/`);
    }
    return file.type === type;
  });
};
