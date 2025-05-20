
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for upload
 * @param userId The user ID for the upload
 * @param file The file to create a path for
 * @param prefix Optional prefix for the path
 * @returns A unique path string
 */
export const createUniqueFilePath = (userId: string, file: File, prefix: string = ''): string => {
  // Get file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

  // Create a UUID-based filename
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  
  // Construct path with user ID, optional prefix, timestamp, and uuid
  const path = prefix 
    ? `${userId}/${prefix}/${timestamp}_${uniqueId}.${fileExtension}` 
    : `${userId}/${timestamp}_${uniqueId}.${fileExtension}`;
    
  return path;
};

/**
 * Converts a file to a base64 data URL
 * @param file The file to convert
 * @returns A promise that resolves to the data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Creates a URL for previewing a file
 * @param file The file to create a preview for
 * @returns A blob URL for the file
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a previously created file preview URL
 * @param url The URL to revoke
 */
export const revokeFilePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Gets a file's MIME type
 * @param file The file
 * @returns The MIME type string
 */
export const getFileMimeType = (file: File): string => {
  return file.type;
};
