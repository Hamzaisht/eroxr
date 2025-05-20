
/**
 * Run comprehensive file diagnostics
 * @param file File to diagnose
 */
export function runFileDiagnostic(file: File | null | undefined): void {
  if (!file) {
    console.error('❌ File is null or undefined');
    return;
  }

  if (!(file instanceof File)) {
    console.error('❌ Not a File instance:', file);
    return;
  }

  console.log('✅ File diagnostic:', {
    name: file.name,
    type: file.type,
    size: formatFileSize(file.size),
    lastModified: new Date(file.lastModified).toISOString(),
    isFile: file instanceof File,
    hasData: file.size > 0
  });
}

/**
 * Format file size to human-readable format
 * @param bytes Size in bytes
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Create a unique file path based on user ID and file
 * @param userId User ID
 * @param file File object or filename
 * @returns Unique file path
 */
export function createUniqueFilePath(userId: string, file: File | string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  
  const fileName = typeof file === 'string' 
    ? file 
    : file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${userId}/${timestamp}-${random}-${fileName}`;
}

/**
 * Create a unique file path based on original name
 * @param originalName Original file name
 * @returns Unique file path
 */
export function createUniqueFilePath2(originalName: string): string {
  return `${Date.now()}-${originalName}`;
}
