
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for storage
 * @param userId User ID prefix
 * @param file File to create path for
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  // Extract extension
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  
  // Create safe name from original filename
  const safeFilename = sanitizeFilename(file.name.replace(/\.[^/.]+$/, ''));
  
  // Create unique path with timestamp and UUID
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}_${uniqueId}_${safeFilename}.${extension}`;
};

/**
 * Sanitizes a filename for safe storage
 * @param filename Original filename
 * @returns Sanitized filename
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9-_]/gi, '_') // Replace non-alphanumeric with underscore
    .replace(/_{2,}/g, '_')        // Replace multiple underscores with single
    .replace(/^_+|_+$/g, '')       // Remove leading/trailing underscores
    .toLowerCase()
    .substring(0, 50);             // Limit length
};

/**
 * Creates a file preview URL for local display
 * @param file File to preview
 */
export const createFilePreview = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (err) {
    console.error('Error creating file preview:', err);
    return '';
  }
};

/**
 * Revokes a file preview URL to free memory
 * @param url Preview URL to revoke
 */
export const revokeFilePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error revoking file preview:', err);
    }
  }
};

/**
 * Runs comprehensive diagnostics on a file
 */
export const runFileDiagnostic = (file: any): void => {
  console.log("FILE DIAGNOSTIC:", {
    value: file,
    type: typeof file,
    isFile: file instanceof File,
    constructor: file && file.constructor ? file.constructor.name : 'N/A',
    properties: file ? Object.keys(file) : [],
    fileType: file && file.type ? file.type : 'N/A',
    fileSize: file && file.size ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A',
    fileName: file && file.name ? file.name : 'N/A',
    lastModified: file && file.lastModified ? new Date(file.lastModified).toLocaleString() : 'N/A',
  });
};
