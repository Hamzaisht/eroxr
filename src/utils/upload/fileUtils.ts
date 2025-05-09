
/**
 * Creates a preview URL for a file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a file preview URL to free memory
 */
export function revokeFilePreview(url: string | null): void {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Logs detailed file information for debugging
 */
export function logFileDebugInfo(file: File): void {
  console.log("FILE DEBUG >>>", {
    name: file.name,
    size: file.size,
    type: file.type,
    isFile: file instanceof File,
    isBlob: file instanceof Blob,
    lastModified: file.lastModified,
    preview: URL.createObjectURL(file)
  });
}

/**
 * Generates a unique file path for storage
 */
export function createUniqueFilePath(userId: string, file: File): string {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 10);
  const fileExt = file.name.split('.').pop() || '';
  
  return `${userId}/${timestamp}-${random}.${fileExt}`;
}
