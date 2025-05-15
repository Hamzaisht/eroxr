
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a unique file path for uploading
 * @param userId User ID
 * @param file File being uploaded
 * @returns Unique file path
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const extension = getFileExtension(file);
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  
  return `${userId}/${timestamp}_${uniqueId}.${extension}`;
}

/**
 * Gets file extension from a File object
 * @param file File object
 * @returns File extension
 */
export function getFileExtension(file: File): string {
  const parts = file.name.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

/**
 * Creates a preview URL for a file
 * @param file File to create preview for
 * @returns Object URL for the file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a file preview URL
 * @param url URL to revoke
 */
export function revokeFilePreview(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Runs diagnostic checks on a file and logs results
 * @param file File to check
 */
export function runFileDiagnostic(file: File | null): void {
  if (!file) {
    console.error("File diagnostic: Null file object");
    return;
  }
  
  if (!(file instanceof File)) {
    console.error("File diagnostic: Object is not a File instance", typeof file);
    return;
  }
  
  console.log("File diagnostic:", {
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type || "No type",
    lastModified: new Date(file.lastModified).toLocaleString()
  });
}
