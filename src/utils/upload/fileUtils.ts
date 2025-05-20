
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

/**
 * Run a comprehensive diagnostic on a file object
 * This helps identify issues with file objects that may cause upload failures
 * @param file The file to diagnose
 * @returns The diagnostic report
 */
export const runFileDiagnostic = (file: File): { valid: boolean, error?: string } => {
  if (!file) {
    console.warn('FILE DIAGNOSTIC: File is null or undefined');
    return { valid: false, error: 'File is null or undefined' };
  }
  
  if (!(file instanceof File)) {
    console.warn('FILE DIAGNOSTIC: Not a File instance');
    return { valid: false, error: 'Not a valid File instance' };
  }
  
  if (file.size === 0) {
    console.warn('FILE DIAGNOSTIC: File has zero size');
    return { valid: false, error: 'File has zero size' };
  }
  
  // Log diagnostic info for debugging
  console.log('FILE DIAGNOSTIC:', {
    isFile: file instanceof File,
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });
  
  return { valid: true };
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
