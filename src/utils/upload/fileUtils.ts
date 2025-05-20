
/**
 * Creates a unique file path for uploaded files
 * @param originalName Original file name
 * @returns Unique file path
 */
export function createUniqueFilePath(originalName: string): string {
  return `${Date.now()}-${originalName}`;
}

/**
 * Run diagnostic on a file to ensure it's valid
 * @param file File to check
 */
export function runFileDiagnostic(file: File): void {
  if (!file) {
    console.error("Invalid file: File is null or undefined");
    return;
  }
  
  console.log("File diagnostic:", {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  });
  
  if (file.size === 0) {
    console.error("Invalid file: File size is 0 bytes");
  }
  
  if (!file.type) {
    console.warn("Warning: File has no MIME type");
  }
}

/**
 * Creates a temporary object URL for file preview
 * @param file File to preview
 * @returns Object URL for the file
 */
export function createFilePreview(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revokes a previously created object URL to free up memory
 * @param url URL to revoke
 */
export function revokeFilePreview(url: string): void {
  URL.revokeObjectURL(url);
}
