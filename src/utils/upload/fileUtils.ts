
/**
 * Log file information for debugging purposes
 */
export function logFileDebugInfo(file: File): void {
  console.group('File Debug Info');
  console.log('Name:', file.name);
  console.log('Type:', file.type);
  console.log('Size:', formatFileSize(file.size));
  console.log('Last Modified:', new Date(file.lastModified).toLocaleString());
  console.groupEnd();
}

/**
 * Run a diagnostic check on a file to catch common issues
 */
export function runFileDiagnostic(file: File | null): void {
  if (!file) {
    console.warn('File Diagnostic: No file provided');
    return;
  }
  
  console.group('File Diagnostic');
  console.log('Name:', file.name);
  console.log('Type:', file.type);
  console.log('Size:', formatFileSize(file.size));
  
  // Check if file size is reasonable
  if (file.size > 100 * 1024 * 1024) {
    console.warn('File is very large (>100MB). This may cause upload issues.');
  }
  
  // Check for empty files
  if (file.size === 0) {
    console.error('File is empty (0 bytes)');
  }
  
  // Check for common file types
  if (!file.type) {
    console.warn('File has no MIME type specified');
  }
  
  console.groupEnd();
}

/**
 * Format file size in a human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a unique path for a file
 */
export function createUniqueFilePath(userId: string, file: File, prefix = ''): string {
  const timestamp = new Date().getTime();
  const extension = file.name.split('.').pop() || '';
  const safeName = file.name
    .split('.')[0]
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase();
  
  return `${prefix ? prefix + '/' : ''}${userId}/${timestamp}_${safeName}.${extension}`;
}

/**
 * Create a preview for a file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke a file preview URL
 */
export function revokeFilePreview(url: string): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Generate a unique ID for a file
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
