
// Helper functions for file uploads

/**
 * Creates a preview URL from a file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a preview URL to free browser memory
 */
export function revokeFilePreview(preview: string): void {
  URL.revokeObjectURL(preview);
}

/**
 * Generate a unique file path for storage
 * @param userId User ID for path prefix
 * @param file File to create path for
 * @returns Unique file path with timestamp
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = new Date().getTime();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileExtension = file.name.split('.').pop();
  
  return `${userId}/${timestamp}-${randomString}.${fileExtension}`;
}

/**
 * Runs diagnostic checks on a file to ensure it meets requirements
 */
export function runFileDiagnostic(file: File, options?: { 
  maxSizeMB?: number;
  allowedTypes?: string[];
}): { valid: boolean; message?: string } {
  const maxSizeMB = options?.maxSizeMB || 50; // Default 50MB
  const allowedTypes = options?.allowedTypes || ['image/*', 'video/*'];
  
  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    return {
      valid: false,
      message: `File too large (${fileSizeMB.toFixed(2)}MB). Maximum size is ${maxSizeMB}MB.`
    };
  }
  
  // Check file type
  const fileType = file.type;
  const isAllowedType = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return fileType.startsWith(`${category}/`);
    }
    return fileType === type;
  });
  
  if (!isAllowedType) {
    return {
      valid: false,
      message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }
  
  return {
    valid: true
  };
}
