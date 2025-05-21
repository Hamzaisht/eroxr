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
export function runFileDiagnostic(file: File): { valid: boolean; message: string } {
  if (!file) {
    return { valid: false, message: "No file provided" };
  }

  if (!(file instanceof File)) {
    return { valid: false, message: "Invalid file object" };
  }

  if (file.size === 0) {
    return { valid: false, message: "File is empty (zero bytes)" };
  }

  // Check for valid file name
  if (!file.name || file.name.trim() === '') {
    return { valid: false, message: "File has no name" };
  }

  // Validate file type basic check
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  const isDocument = file.type.includes('pdf') || 
                    file.type.includes('doc') || 
                    file.type.includes('sheet') || 
                    file.type.includes('presentation');

  if (!isImage && !isVideo && !isAudio && !isDocument) {
    return { 
      valid: false, 
      message: `Unknown file type: ${file.type}. Only images, videos, audio and documents are supported.` 
    };
  }

  console.log(`File diagnostic passed for: ${file.name} (${file.type}, ${file.size} bytes)`);
  
  return { valid: true, message: "File is valid" };
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
 * Extract file extension from filename
 */
export function extractFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string {
  const mimeTypes: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    
    // Videos
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'wmv': 'video/x-ms-wmv',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
  };
  
  const ext = extension.toLowerCase().replace('.', '');
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Infer content type from file extension
 */
export function inferContentTypeFromExtension(filename: string): string {
  return getMimeTypeFromExtension(extractFileExtension(filename));
}

/**
 * Add cache buster to URL
 */
export function addCacheBuster(url: string): string {
  if (!url) return '';
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${Date.now()}`;
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
