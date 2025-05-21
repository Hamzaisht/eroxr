
import { v4 as uuidv4 } from 'uuid';

interface FileDiagnosticOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

interface FileDiagnosticResult {
  valid: boolean;
  message?: string;
}

/**
 * Runs comprehensive diagnostic on a file to check for potential issues
 */
export const runFileDiagnostic = (file: File | null, options?: FileDiagnosticOptions): FileDiagnosticResult => {
  if (!file) {
    console.error("❌ Null or undefined file object");
    return { valid: false, message: "No file provided" };
  }
  
  const diagnostics = {
    isFile: file instanceof File,
    size: file.size,
    type: file.type,
    name: file.name,
    lastModified: new Date(file.lastModified).toISOString(),
    validSize: file.size > 0,
    hasMimeType: !!file.type,
  };
  
  console.log("📋 File diagnostic:", diagnostics);
  
  if (!diagnostics.isFile) {
    console.error("❌ Not a valid File instance");
    return { valid: false, message: "Not a valid file" };
  }
  
  if (!diagnostics.validSize) {
    console.error("❌ File has no data (size: 0 bytes)");
    return { valid: false, message: "File is empty (0 bytes)" };
  }
  
  if (!diagnostics.hasMimeType) {
    console.error("❌ File has no MIME type");
    return { valid: false, message: "File has no identifiable type" };
  }

  // Check file size if maxSizeMB is provided
  if (options?.maxSizeMB) {
    const maxSizeBytes = options.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { 
        valid: false, 
        message: `File size exceeds the maximum allowed (${options.maxSizeMB}MB)`
      };
    }
  }

  // Check allowed types if provided
  if (options?.allowedTypes && options.allowedTypes.length > 0) {
    const fileType = file.type;
    const isAllowed = options.allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        // Handle wildcard types (e.g., "image/*")
        const category = type.split('/')[0];
        return fileType.startsWith(`${category}/`);
      }
      return type === fileType;
    });

    if (!isAllowed) {
      return {
        valid: false,
        message: `File type ${fileType} is not allowed`
      };
    }
  }
  
  return { valid: true };
};

/**
 * Create a file preview URL
 */
export const createFilePreview = (file: File): string => {
  if (!file) return '';
  return URL.createObjectURL(file);
};

/**
 * Revoke a file preview URL
 */
export const revokeFilePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Create a unique file path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  const fileExt = file.name.split('.').pop() || '';
  const safeFileName = file.name
    .split('.')[0]
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 20);

  return `${userId}/${timestamp}-${uuid}-${safeFileName}.${fileExt}`.toLowerCase();
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};
