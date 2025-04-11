
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a user-specific file path for storage
 * 
 * @param userId - User identifier
 * @param fileName - Original file name
 * @returns A unique file path
 */
export const createUserFilePath = (userId: string, fileName: string): string => {
  const uniqueFileName = generateUniqueFileName(fileName);
  return `${userId}/${uniqueFileName}`;
};

/**
 * Generates a unique file name by adding UUID to avoid collisions
 * 
 * @param originalFileName - Original file name
 * @returns A unique file name
 */
export const generateUniqueFileName = (originalFileName: string): string => {
  const fileNameParts = originalFileName.split('.');
  const extension = fileNameParts.length > 1 ? fileNameParts.pop() : '';
  const nameWithoutExtension = fileNameParts.join('.');
  
  const uuid = uuidv4().substring(0, 8);
  const timestamp = Date.now();
  
  return `${nameWithoutExtension}_${timestamp}_${uuid}${extension ? `.${extension}` : ''}`;
};

/**
 * Determines the appropriate storage bucket based on file type
 * 
 * @param file - The file object
 * @returns The bucket name
 */
export const getBucketForFileType = (file: File, contentCategory?: string): string => {
  // Use content category if provided
  if (contentCategory) {
    switch (contentCategory) {
      case 'story': return 'stories';
      case 'post': return 'posts';
      case 'message': return 'messages';
      case 'profile': return 'avatars';
      case 'short': return 'shorts';
    }
  }
  
  // Fallback to type-based buckets
  if (file.type.startsWith('image/')) {
    return 'images';
  } else if (file.type.startsWith('video/')) {
    return 'videos';
  } else if (file.type.startsWith('audio/')) {
    return 'audio';
  }
  
  // Default bucket
  return 'media';
};

/**
 * Format file size to human-readable string
 * 
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "1.2 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Create a file preview URL for local display
 * 
 * @param file - The file to preview
 * @returns Object URL for the file
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL to free browser memory
 * 
 * @param previewUrl - The URL to revoke
 */
export const revokeFilePreview = (previewUrl: string): void => {
  if (previewUrl && previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl);
  }
};
