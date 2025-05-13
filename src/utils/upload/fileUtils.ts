
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

/**
 * Creates a unique path for storage
 */
export const createUniqueFilePath = (userId: string, file: File): string => {
  const timestamp = new Date().getTime();
  const fileExtension = file.name.split('.').pop() || '';
  return `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
};

/**
 * Log detailed file information for debugging
 */
export const logFileDebugInfo = (file: File): void => {
  console.log("[FILE DEBUG]", {
    filename: file.name,
    size: `${(file.size / 1024).toFixed(2)} KB`,
    type: file.type,
    lastModified: new Date(file.lastModified).toLocaleString()
  });
};
