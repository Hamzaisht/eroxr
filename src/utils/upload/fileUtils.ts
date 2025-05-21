import { v4 as uuidv4 } from 'uuid';

/**
 * Format file size into human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Run diagnostic tests on a file object
 */
export function runFileDiagnostic(file: File): { valid: boolean, message?: string } {
  // Basic existence check
  if (!file) {
    console.error("File is null or undefined");
    return { valid: false, message: "No file provided" };
  }
  
  // Type check
  if (!(file instanceof File)) {
    console.error(`File is not a File instance:`, file);
    return { valid: false, message: "Not a valid File object" };
  }
  
  // Size check
  if (file.size === 0) {
    console.error("File has zero size");
    return { valid: false, message: "File is empty (0 bytes)" };
  }
  
  // Name check
  if (!file.name || file.name.length === 0) {
    console.warn("File has no name");
  }
  
  // Type check
  if (!file.type || file.type.length === 0) {
    console.warn("File has no type information");
  }
  
  // Log file details for debugging
  console.info("File diagnostic:", {
    name: file.name,
    type: file.type,
    size: formatFileSize(file.size),
    lastModified: new Date(file.lastModified).toISOString()
  });
  
  return { valid: true };
}

/**
 * Create file preview URL
 * @returns Promise that resolves to a data URL string
 */
export async function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Make sure we're working with a valid file
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }
    
    if (!(file instanceof File)) {
      reject(new Error('Invalid file object'));
      return;
    }

    // For image files, create an ObjectURL
    if (file.type.startsWith('image/')) {
      try {
        const url = URL.createObjectURL(file);
        resolve(url);
      } catch (err) {
        reject(new Error('Failed to create preview URL'));
      }
      return;
    }
    
    // For video files, create an ObjectURL
    if (file.type.startsWith('video/')) {
      try {
        const url = URL.createObjectURL(file);
        resolve(url);
      } catch (err) {
        reject(new Error('Failed to create video preview'));
      }
      return;
    }
    
    // For other file types, generate a type icon URL or placeholder
    resolve('https://via.placeholder.com/150?text=File');
  });
}

/**
 * Revoke file preview URL to prevent memory leaks
 */
export function revokeFilePreview(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Create a unique filepath for upload organized by content type
 * This is the preferred method that doesn't require a userId
 * 
 * @param file The file to generate a path for
 * @returns A unique path string like "images/1234567890-abcdef.jpg"
 */
export function createUniqueFilePath(file: File): string {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const fileExt = file.name.split('.').pop() || '';
  
  // Organize by file type
  const contentType = file.type.split('/')[0];
  return `${contentType}s/${timestamp}-${uniqueId}.${fileExt}`;
}

/**
 * Create a unique file path that includes the user ID
 * Use this when you need to keep files organized by user
 * 
 * @param userId The user ID to include in the path
 * @param file The file to generate a path for
 * @returns A unique path string like "user123/images/1234567890-abcdef.jpg"
 */
export function createUserFilePath(userId: string, file: File): string {
  const timestamp = Date.now();
  const uniqueId = uuidv4().substring(0, 8);
  const fileExt = file.name.split('.').pop() || '';
  
  // Organize by user ID and file type
  const contentType = file.type.split('/')[0];
  return `${userId}/${contentType}s/${timestamp}-${uniqueId}.${fileExt}`;
}
