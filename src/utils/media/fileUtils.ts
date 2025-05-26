
/**
 * Creates a unique file path for uploads
 */
export const createUniqueFilePath = (
  file: File,
  options: { folder?: string; userId?: string } = {}
): string => {
  const { folder = '', userId = '' } = options;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const extension = file.name.split('.').pop() || '';
  
  const basePath = folder ? `${folder}/` : '';
  const userPath = userId ? `${userId}/` : '';
  
  return `${basePath}${userPath}${timestamp}-${randomString}.${extension}`;
};

/**
 * Gets file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Validates file type for media upload
 */
export const isValidMediaFile = (file: File): boolean => {
  const validTypes = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mp3', 'audio/wav', 'audio/ogg'
  ];
  
  return validTypes.includes(file.type);
};
