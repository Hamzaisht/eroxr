
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique file path for storage
 */
export const createUniqueFilePath = (file: File, userId?: string): string => {
  const timestamp = Date.now();
  const randomId = uuidv4();
  const extension = getFileExtension(file.name);
  
  if (userId) {
    return `${userId}/${timestamp}-${randomId}.${extension}`;
  }
  
  return `${timestamp}-${randomId}.${extension}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Determine media type from MIME type
 */
export const getMediaTypeFromMime = (mimeType: string): 'image' | 'video' | 'audio' | 'document' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'document';
};

/**
 * Create file preview URL
 */
export const createFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      resolve(''); // No preview for non-images
    }
  });
};

/**
 * Revoke file preview URL to prevent memory leaks
 */
export const revokeFilePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Calculate content hash for duplicate detection
 */
export const calculateFileHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate file for upload
 */
export const validateFileForUpload = (file: File): { valid: boolean; error?: string } => {
  // Check if it's a valid File object
  if (!file || !(file instanceof File)) {
    return { valid: false, error: 'Invalid file object' };
  }

  // Check file size (max 100MB)
  const maxSize = 100 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 100MB limit' };
  }

  // Check if file has content
  if (file.size === 0) {
    return { valid: false, error: 'File is empty' };
  }

  return { valid: true };
};

/**
 * Run comprehensive file diagnostic
 */
export const runFileDiagnostic = (file: File): void => {
  console.log('📁 File Diagnostic:', {
    name: file.name,
    type: file.type,
    size: file.size,
    lastModified: file.lastModified,
    isFileInstance: file instanceof File,
    hasArrayBuffer: typeof file.arrayBuffer === 'function',
    hasStream: typeof file.stream === 'function'
  });
};
