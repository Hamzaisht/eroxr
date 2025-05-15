
/**
 * Create a unique file path for uploading
 * @param userId User ID for organization
 * @param file File being uploaded
 * @returns A unique path string for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  // Get clean filename
  const filename = cleanFileName(file.name);
  
  // Generate a timestamp with random string to ensure uniqueness
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${userId}/${timestamp}_${random}_${filename}`;
}

/**
 * Clean a filename for storage (remove special characters)
 * @param filename Original filename
 * @returns Cleaned filename
 */
export function cleanFileName(filename: string): string {
  // Replace spaces with underscores
  let cleanName = filename.replace(/\s+/g, '_');
  
  // Remove any characters that might cause issues in URLs
  cleanName = cleanName.replace(/[^\w.-]/g, '');
  
  return cleanName;
}

/**
 * Run a comprehensive diagnostic on a file before upload
 * @param file File to diagnose
 */
export function runFileDiagnostic(file: File): void {
  if (!file) {
    console.warn('File Diagnostic: No file provided');
    return;
  }
  
  try {
    const diagnostics = {
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      type: file.type || 'unknown',
      lastModified: new Date(file.lastModified).toLocaleString(),
      isFile: file instanceof File,
      hasData: file.size > 0,
      extension: file.name.split('.').pop()?.toLowerCase() || 'unknown'
    };
    
    console.log('📋 File Diagnostic:', diagnostics);
    
    // Warn about potential issues
    if (!file.type) {
      console.warn('⚠️ File has no MIME type');
    }
    
    if (file.size === 0) {
      console.warn('⚠️ File has zero bytes');
    }
    
    if (file.size > 100 * 1024 * 1024) {
      console.warn('⚠️ File exceeds 100MB and may fail to upload');
    }
  } catch (error) {
    console.error('Error in file diagnostic:', error);
  }
}

/**
 * Create a preview URL from a File object
 * @param file File to create preview for
 * @returns URL for preview
 */
export function createFilePreview(file: File): string {
  try {
    return URL.createObjectURL(file);
  } catch (error) {
    console.error('Error creating file preview:', error);
    return '';
  }
}

/**
 * Revoke a previously created file preview
 * @param url URL to revoke
 */
export function revokeFilePreview(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
