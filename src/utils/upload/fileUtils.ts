
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for upload
 * @param file The file to create a path for
 * @param prefix Optional prefix for the path
 * @returns A unique path string
 */
export const createUniqueFilePath = (file: File, prefix: string = ''): string => {
  // Get file extension
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

  // Create a UUID-based filename
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  
  // Construct path with optional prefix, timestamp, and uuid
  const path = prefix 
    ? `${prefix}/${timestamp}_${uniqueId}.${fileExtension}` 
    : `${timestamp}_${uniqueId}.${fileExtension}`;
    
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
 * Gets a file's MIME type
 * @param file The file
 * @returns The MIME type string
 */
export const getFileMimeType = (file: File): string => {
  return file.type;
};
