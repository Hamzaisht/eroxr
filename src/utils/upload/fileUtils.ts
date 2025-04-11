
/**
 * Utility functions for generating unique filenames and handling file references
 */

/**
 * Generates a unique file name using timestamp and random string
 */
export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop() || '';
  
  return `${timestamp}_${randomStr}.${extension}`;
};

/**
 * Creates a storage path for a user's file
 */
export const createUserFilePath = (userId: string, fileName: string, folderName?: string): string => {
  const uniqueFileName = generateUniqueFileName(fileName);
  
  if (folderName) {
    return `${userId}/${folderName}/${uniqueFileName}`;
  }
  
  return `${userId}/${uniqueFileName}`;
};

/**
 * Extracts the file extension from a file name or path
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || '';
};

/**
 * Converts bytes to a human-readable format (KB, MB, GB)
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Creates an object URL from a File object
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes an object URL to free up memory
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};

/**
 * Returns the appropriate bucket for a file based on its content type
 */
export const getBucketForFileType = (contentType: string): string => {
  if (contentType.startsWith('image/')) return 'media';
  if (contentType.startsWith('video/')) return 'videos';
  if (contentType.startsWith('audio/')) return 'media';
  return 'files';
};

/**
 * Returns the appropriate storage path segment based on content type
 */
export const getStoragePathForContentType = (contentType: string): string => {
  if (contentType.startsWith('image/')) return 'images';
  if (contentType.startsWith('video/')) return 'videos';
  if (contentType.startsWith('audio/')) return 'audio';
  return 'files';
};
