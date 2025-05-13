
/**
 * Comprehensive file diagnostics utility
 */
export const runFileDiagnostic = (file: File | null): void => {
  if (!file) {
    console.error("❌ File is null or undefined");
    return;
  }
  
  if (!(file instanceof File)) {
    console.error("❌ Object is not a File instance:", file);
    return;
  }
  
  console.log("📋 File diagnostic:", {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString(),
    isFile: file instanceof File,
    constructor: file.constructor.name,
  });
  
  if (file.size === 0) {
    console.error("⚠️ Warning: File has zero bytes");
  }
};

/**
 * Creates a temporary file preview URL
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a file preview URL to free up memory
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url);
};
