
/**
 * Creates a unique file path for storage based on user ID and file
 */
export const createUniqueFilePath = (userId: string, file: File | string): string => {
  const timestamp = Date.now();
  let fileExt = 'jpg'; // Default extension
  
  if (typeof file === 'object' && file instanceof File) {
    fileExt = file.name.split('.').pop() || 'jpg';
  } else if (typeof file === 'string') {
    // Try to extract extension from string (URL or base64)
    const matches = file.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    if (matches && matches[1]) {
      fileExt = matches[1];
    }
  }
  
  return `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
};

/**
 * Runs diagnostic checks on a file object
 */
export const runFileDiagnostic = (file: File | Blob): { valid: boolean, error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }
  
  if (!(file instanceof File) && !(file instanceof Blob)) {
    return { valid: false, error: 'Invalid file object type' };
  }
  
  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes)' };
  }
  
  return { valid: true };
};

/**
 * Create a preview URL for a file
 */
export const createFilePreview = (file: File): string => {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating file preview:', error);
    return '';
  }
};

/**
 * Revoke a file preview URL to prevent memory leaks
 */
export const revokeFilePreview = (url: string): void => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
