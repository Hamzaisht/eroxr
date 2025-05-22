
/**
 * Create a unique file path for storage
 * @param file The file to create a path for
 * @param options Options for path creation
 * @returns A unique file path
 */
export function createUniqueFilePath(file: File, options: { folder?: string } = {}): string {
  if (!file) return '';
  
  const { folder = '' } = options;
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 10);
  const fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  const folderPrefix = folder ? `${folder.replace(/\/*$/, '')}/` : '';
  return `${folderPrefix}${timestamp}_${randomString}_${fileName}`;
}

/**
 * Format a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
