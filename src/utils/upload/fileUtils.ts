
/**
 * Creates a URL for previewing a file
 * @param file File to create preview for
 * @returns URL to preview the file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a URL created with createFilePreview
 * @param url URL to revoke
 */
export function revokeFilePreview(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Get the file type category (image, video, audio, document)
 * @param file File to check
 * @returns Category string
 */
export function getFileType(file: File): string {
  if (file.type.startsWith('image/')) {
    return 'image';
  } else if (file.type.startsWith('video/')) {
    return 'video';
  } else if (file.type.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'document';
  }
}

/**
 * Format file size to human-readable string
 * @param bytes Size in bytes
 * @returns Formatted string (e.g. "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Run diagnostic checks on a file to ensure it meets requirements
 * @param file File to check
 * @param options Options for validation
 * @returns Object with validation results
 */
export function runFileDiagnostic(file: File, options: {
  maxSizeInMB?: number;
  allowedTypes?: string[];
} = {}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check file size if maxSize is provided
  if (options.maxSizeInMB) {
    const maxSizeInBytes = options.maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      errors.push(`File size exceeds maximum allowed size of ${options.maxSizeInMB} MB`);
    }
  }
  
  // Check file type if allowedTypes is provided
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const mimeTypeBase = file.type.split('/')[0];
    const mimeTypeFull = file.type;
    
    const isAllowedType = options.allowedTypes.some(type => {
      // Check if type matches MIME type base (image, video, etc.)
      if (type.includes('/')) {
        return mimeTypeFull === type;
      }
      // Check if type matches file extension
      return fileExtension === type.toLowerCase().replace('.', '');
    });
    
    if (!isAllowedType) {
      errors.push(`File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
